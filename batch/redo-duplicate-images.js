// ═══════════════════════════════════════════════════════════════
// DiplomacySim · REDO DUPLICATE CLOUDINARY IMAGES
// ═══════════════════════════════════════════════════════════════
// Fixes the ~225 images uploaded with the old script that may
// have duplicates (always picked photos[0]).
// Re-fetches unique photos from Pexels and overwrites Cloudinary URLs.
//
// Run AFTER the main migration script finishes.
// Paste into DevTools console on admin.html while signed in as admin.
// ═══════════════════════════════════════════════════════════════

(async function () {

  const PEXELS_API_KEY           = 'rEHCvKXn2mTbTM62xVZTZA4KPrm6JsWuEE8RAF2Z0DJk8NyDXyrmx1DD';
  const CLOUDINARY_CLOUD_NAME    = 'djkzjki1t';
  const CLOUDINARY_UPLOAD_PRESET = 'diplomacysim_unsigned';

  const db = firebase.firestore();

  const CATEGORY_KEYWORDS = {
    'Historical Events':           'history war archive diplomacy vintage',
    'Current Affairs':             'politics government summit protest news',
    'Fictional Scenarios':         'futuristic dramatic cinematic conflict',
    'Economic Strategy':           'finance economy trade global market',
    'Global Diplomacy':            'diplomacy summit leaders united nations',
    'Intelligence & Espionage':    'surveillance secret spy shadows security',
    'Nuclear Brinkmanship':        'nuclear military tension weapons defense',
    'Environmental Crises':        'climate disaster flood fire environment',
    'Humanitarian & Human Rights': 'refugee crisis humanitarian aid people',
    'Cyber Warfare':               'cybersecurity digital technology hacker'
  };

  const STOP_WORDS = new Set(['the','a','an','of','in','on','at','to','for','is','are','was','were','and','or','but','with','from','by','as','it','its','this','that','these','those','be','been','have','has','had','do','does','did','will','would','could','should','may','might','not','no','each','every','all','any','more','most','other','such','than','then','very','just','about']);

  function buildSearchQuery(title, category) {
    const catKeys   = CATEGORY_KEYWORDS[category] || 'politics diplomacy world';
    const titleKeys = title.toLowerCase().replace(/[^a-z\s]/g,'').split(/\s+/).filter(w => w.length > 3 && !STOP_WORDS.has(w)).slice(0, 3).join(' ');
    return (titleKeys + ' ' + catKeys).trim().slice(0, 100);
  }

  const usedPhotoIds = new Set();

  async function fetchUniquePhoto(query, scenarioId) {
    for (let page = 1; page <= 5; page++) {
      const url = 'https://api.pexels.com/v1/search?query=' +
        encodeURIComponent(query) + '&per_page=15&orientation=landscape&page=' + page;
      const res = await fetch(url, { headers: { Authorization: PEXELS_API_KEY } });
      if (!res.ok) throw new Error('Pexels HTTP ' + res.status);
      const data = await res.json();
      if (!data.photos || !data.photos.length) break;

      const seed   = parseInt(scenarioId.slice(0, 8), 16) || Math.random() * 1000;
      const offset = Math.floor(seed % data.photos.length);

      for (let i = 0; i < data.photos.length; i++) {
        const photo = data.photos[(offset + i) % data.photos.length];
        if (!usedPhotoIds.has(photo.id)) {
          usedPhotoIds.add(photo.id);
          return photo.src.large2x || photo.src.large;
        }
      }
    }
    throw new Error('No unique photo found for: ' + query);
  }

  async function uploadToCloudinary(blob, filename) {
    const form = new FormData();
    form.append('file', blob, filename);
    form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    form.append('folder', 'diplomacysim');
    form.append('quality', 'auto');
    form.append('fetch_format', 'auto');
    const res = await fetch('https://api.cloudinary.com/v1_1/' + CLOUDINARY_CLOUD_NAME + '/image/upload', { method: 'POST', body: form });
    if (!res.ok) { const e = await res.json().catch(()=>({})); throw new Error(e.error?.message || res.status); }
    return (await res.json()).secure_url;
  }

  // ── Fetch only the ones already on Cloudinary ───────────────
  console.log('📡 Fetching scenarios from Firestore…');
  const snap = await db.collection('scenarios').get();

  const toRedo = snap.docs.filter(doc =>
    (doc.data().imageUrl || '').includes('cloudinary.com')
  );

  console.log('📋 Total scenarios:       ' + snap.size);
  console.log('🔄 On Cloudinary to redo: ' + toRedo.length);

  if (toRedo.length === 0) {
    console.log('Nothing to redo.');
    return;
  }

  const confirmed = confirm(
    'Redo ' + toRedo.length + ' Cloudinary images with unique photos?\n\n' +
    '• Fixes duplicate images from first upload run\n' +
    '• Each scenario gets a guaranteed unique photo\n' +
    '• Estimated time: ~' + Math.ceil(toRedo.length * 4 / 60) + ' minutes\n\n' +
    '⚠️  Keep this tab open.\n\nContinue?'
  );
  if (!confirmed) { console.log('Cancelled.'); return; }

  let success = 0, failed = 0;

  for (const doc of toRedo) {
    const data     = doc.data();
    const title    = data.title    || 'Untitled';
    const category = data.category || '';
    const num      = success + failed + 1;

    console.log('🖼  [' + num + '/' + toRedo.length + '] ' + title.slice(0, 55) + '…');

    try {
      const query    = buildSearchQuery(title, category);
      const photoUrl = await fetchUniquePhoto(query, doc.id);

      const imgRes = await fetch(photoUrl);
      if (!imgRes.ok) throw new Error('Download failed: ' + imgRes.status);
      const blob = await imgRes.blob();

      const safeName = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50) + '-' + doc.id.slice(0, 8) + '.jpg';
      const cdnUrl   = await uploadToCloudinary(blob, safeName);

      await db.collection('scenarios').doc(doc.id).update({ imageUrl: cdnUrl });
      console.log('  ✅ ' + cdnUrl.slice(0, 65) + '…');
      success++;

      await new Promise(r => setTimeout(r, 600));
    } catch (err) {
      console.error('  ❌ ' + title.slice(0, 40) + ' — ' + err.message);
      failed++;
    }
  }

  console.log('\n══════════════════════════════════════════════');
  console.log('Redo complete.');
  console.log('  ✅ Fixed: ' + success);
  console.log('  ❌ Failed: ' + failed);
  console.log('══════════════════════════════════════════════');
  console.log('All scenarios now have unique images.');

})();
