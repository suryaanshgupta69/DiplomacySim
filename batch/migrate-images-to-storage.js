// ═══════════════════════════════════════════════════════════════
// DiplomacySim · GENERATE IMAGES VIA PEXELS → CLOUDINARY
// ═══════════════════════════════════════════════════════════════
// Pollinations is now paywalled. This script uses Pexels (free
// stock photos, 200 req/hour) to find relevant images, uploads
// them to Cloudinary CDN, and saves the permanent URL to Firestore.
//
// Paste into DevTools console on admin.html while signed in as admin.
// ═══════════════════════════════════════════════════════════════

(async function () {

  const PEXELS_API_KEY           = 'rEHCvKXn2mTbTM62xVZTZA4KPrm6JsWuEE8RAF2Z0DJk8NyDXyrmx1DD';
  const CLOUDINARY_CLOUD_NAME    = 'djkzjki1t';
  const CLOUDINARY_UPLOAD_PRESET = 'diplomacysim_unsigned';
  const LIMIT = Infinity;       // do all remaining
  const REDO_CLOUDINARY = true; // true = also redo the 225 already uploaded (fix duplicates)

  const db = firebase.firestore();

  // ── Category → Pexels search keywords ──────────────────────
  const CATEGORY_KEYWORDS = {
    'Historical Events':           'history war archive diplomacy vintage',
    'Current Affairs':             'politics government summit protest news',
    'Fictional Scenarios':         'futuristic city war dramatic cinematic',
    'Economic Strategy':           'finance economy trade global market',
    'Global Diplomacy':            'diplomacy summit leaders united nations',
    'Intelligence & Espionage':    'surveillance secret spy dark shadows',
    'Nuclear Brinkmanship':        'nuclear military war tension weapons',
    'Environmental Crises':        'climate disaster flood fire environment',
    'Humanitarian & Human Rights': 'refugee crisis humanitarian aid people',
    'Cyber Warfare':               'cybersecurity hacker digital technology'
  };

  // Extract key nouns from scenario title to refine search
  const STOP_WORDS = new Set(['the','a','an','of','in','on','at','to','for','is','are','was','were','and','or','but','with','from','by','as','it','its','this','that','these','those','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','shall','can','not','no','nor','so','yet','both','either','neither','each','every','all','any','few','more','most','other','such','than','then','too','very','just','about','above','after','before','between','during','since','until','while']);

  function extractKeywords(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3 && !STOP_WORDS.has(w))
      .slice(0, 3)
      .join(' ');
  }

  function buildSearchQuery(title, category) {
    const catKeys   = CATEGORY_KEYWORDS[category] || 'politics diplomacy world';
    const titleKeys = extractKeywords(title);
    // Combine title keywords with category base — Pexels picks best match
    return (titleKeys + ' ' + catKeys).trim().slice(0, 100);
  }

  // ── Fetch a photo URL from Pexels ───────────────────────────
  // Tracks used photo IDs to prevent duplicates across the whole run
  const usedPhotoIds = new Set();

  async function fetchPexelsPhoto(query, scenarioId) {
    // Try up to 5 pages to find a photo not already used
    for (let page = 1; page <= 5; page++) {
      const url = 'https://api.pexels.com/v1/search?query=' +
        encodeURIComponent(query) + '&per_page=15&orientation=landscape&page=' + page;

      const res = await fetch(url, { headers: { Authorization: PEXELS_API_KEY } });
      if (!res.ok) throw new Error('Pexels HTTP ' + res.status);

      const data = await res.json();
      if (!data.photos || data.photos.length === 0) break;

      // Use scenario ID as seed so same scenario always gets same photo (deterministic)
      // but different scenarios get different photos
      const seed   = parseInt(scenarioId.slice(0, 8), 16) || Math.random() * 1000;
      const offset = Math.floor(seed % data.photos.length);

      // Walk through results starting at offset, find first unused photo
      for (let i = 0; i < data.photos.length; i++) {
        const photo = data.photos[(offset + i) % data.photos.length];
        if (!usedPhotoIds.has(photo.id)) {
          usedPhotoIds.add(photo.id);
          return photo.src.large2x || photo.src.large || photo.src.original;
        }
      }
      // All photos on this page already used — try next page
    }
    throw new Error('No unique Pexels result found for: ' + query);
  }

  // ── Upload blob to Cloudinary ───────────────────────────────
  async function uploadToCloudinary(blob, filename) {
    const form = new FormData();
    form.append('file', blob, filename);
    form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    form.append('folder', 'diplomacysim');
    form.append('quality', 'auto');
    form.append('fetch_format', 'auto');

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/' + CLOUDINARY_CLOUD_NAME + '/image/upload',
      { method: 'POST', body: form }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error('Cloudinary: ' + (err.error?.message || res.status));
    }
    const data = await res.json();
    return data.secure_url;
  }

  // ── 1. Fetch scenarios ──────────────────────────────────────
  console.log('📡 Fetching scenarios from Firestore…');
  const snap = await db.collection('scenarios').get();

  const toProcess = snap.docs.filter(doc => {
    const url = doc.data().imageUrl || '';
    if (REDO_CLOUDINARY) return !url || url.includes('pollinations.ai') || url.includes('cloudinary.com');
    return !url || url.includes('pollinations.ai');
  });

  const alreadyDone = REDO_CLOUDINARY ? [] : snap.docs.filter(doc =>
    (doc.data().imageUrl || '').includes('cloudinary.com')
  );

  console.log('📋 Total:                 ' + snap.size);
  console.log('🔄 To process:            ' + toProcess.length + (REDO_CLOUDINARY ? ' (including redo of existing Cloudinary images)' : ''));
  console.log('⏭️  Skipping:              ' + (snap.size - toProcess.length));

  if (toProcess.length === 0) {
    console.log('\n✅ All images already on Cloudinary!');
    return;
  }

  const batch = toProcess.slice(0, LIMIT);

  const confirmed = confirm(
    'Fetch ' + batch.length + ' images from Pexels → upload to Cloudinary?\n\n' +
    '• Each image: ~300–600 KB\n' +
    '• No generation delay — instant stock photos\n' +
    '• Estimated time: ~' + Math.ceil(batch.length * 4 / 60) + ' minutes\n' +
    (toProcess.length > LIMIT ? '• ' + (toProcess.length - batch.length) + ' remaining after this run\n' : '') +
    '\n⚠️  Keep this tab open.\n\nContinue?'
  );
  if (!confirmed) { console.log('Cancelled.'); return; }

  // ── 2. Process each scenario ────────────────────────────────
  let success = 0, failed = 0;

  for (const doc of batch) {
    const data     = doc.data();
    const title    = data.title    || 'Untitled';
    const category = data.category || '';
    const num      = success + failed + 1;

    console.log('🖼  [' + num + '/' + batch.length + '] ' + title.slice(0, 55) + '…');

    try {
      // Search Pexels
      const query    = buildSearchQuery(title, category);
      console.log('  🔍 Pexels query: "' + query.slice(0, 60) + '"');
      const photoUrl = await fetchPexelsPhoto(query, doc.id);

      // Download photo
      const imgRes = await fetch(photoUrl);
      if (!imgRes.ok) throw new Error('Photo download failed: ' + imgRes.status);
      const blob = await imgRes.blob();
      console.log('  ⬆️  Uploading ' + Math.round(blob.size / 1024) + ' KB to Cloudinary…');

      // Upload to Cloudinary
      const safeName = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50) + '-' + doc.id.slice(0, 8) + '.jpg';
      const cdnUrl   = await uploadToCloudinary(blob, safeName);

      // Save to Firestore
      await db.collection('scenarios').doc(doc.id).update({ imageUrl: cdnUrl });
      console.log('  ✅ Saved: ' + cdnUrl.slice(0, 65) + '…');
      success++;

      // Small pause to stay within Pexels rate limit (200/hr = ~18s/req max, we're well under)
      await new Promise(r => setTimeout(r, 600));

    } catch (err) {
      console.error('  ❌ FAILED: ' + title.slice(0, 40) + ' — ' + err.message);
      failed++;
    }
  }

  // ── 3. Summary ───────────────────────────────────────────────
  const remaining = toProcess.length - batch.length;
  console.log('\n══════════════════════════════════════════════════');
  console.log('Batch complete.');
  console.log('  ✅ Uploaded to Cloudinary: ' + success);
  console.log('  ❌ Failed:                 ' + failed);
  console.log('  📋 Still remaining:        ' + remaining);
  console.log('══════════════════════════════════════════════════');
  if (remaining > 0) {
    console.log('Paste the script again for the next batch.');
    console.log('Change LIMIT = 10 to a larger number (e.g. 50 or Infinity) to do more per run.');
  } else {
    console.log('🎉 All done! Every scenario now has a Cloudinary CDN image.');
  }

})();
