// ═══════════════════════════════════════════════════════════════════════════
// DiplomacySim · FINAL MIGRATION SCRIPT  (v3 — one script, does everything)
// ═══════════════════════════════════════════════════════════════════════════
//
//  ✅ Uploads images for scenarios that still need them
//  ✅ Redoes ALL scenarios so every photo is globally unique
//  ✅ Auto-pauses & resumes on Pexels rate limits (HTTP 429)
//  ✅ Fully resumable — progress saved to Firestore every 10 steps
//  ✅ Timeouts on every fetch (no more hangs on large images)
//
//  PASTE INTO DEVTOOLS CONSOLE on admin.html while signed in as admin.
//  Leave the tab open. The script handles rate limits automatically —
//  it will pause, wait, and continue on its own. ~2-3 hours for 810 scenarios.
//  If the tab closes mid-run, paste again — it resumes where it left off.
// ═══════════════════════════════════════════════════════════════════════════

(async function () {

  const PEXELS_API_KEY           = 'rEHCvKXn2mTbTM62xVZTZA4KPrm6JsWuEE8RAF2Z0DJk8NyDXyrmx1DD';
  const CLOUDINARY_CLOUD_NAME    = 'djkzjki1t';
  const CLOUDINARY_UPLOAD_PRESET = 'diplomacysim_unsigned';

  const db    = firebase.firestore();
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // ── Fetch with hard timeout (prevents hangs on large images) ──────────────
  function fetchWithTimeout(url, options, timeoutMs) {
    const ctrl = new AbortController();
    const t    = setTimeout(() => ctrl.abort(), timeoutMs);
    return fetch(url, { ...options, signal: ctrl.signal })
      .finally(() => clearTimeout(t));
  }

  // ── Pexels fetch: auto-waits on 429 rate-limit, then retries ─────────────
  async function pexelsFetch(url) {
    while (true) {
      let res;
      try {
        res = await fetchWithTimeout(
          url,
          { headers: { Authorization: PEXELS_API_KEY } },
          15000
        );
      } catch (e) {
        if (e.name === 'AbortError') throw new Error('Pexels request timed out after 15s');
        throw e;
      }

      if (res.status === 429) {
        // Read reset timestamp from Pexels header
        const resetHeader = res.headers.get('X-Ratelimit-Reset');
        const resetAt     = resetHeader ? parseInt(resetHeader) * 1000 : Date.now() + 62000;
        const waitMs      = Math.max(resetAt - Date.now() + 3000, 10000); // min 10s
        const waitMin     = (waitMs / 60000).toFixed(1);
        console.log('\n  ⏳ Pexels rate limit — pausing ' + waitMin + ' min (auto-resumes at ' +
          new Date(Date.now() + waitMs).toLocaleTimeString() + ')');
        console.log('     ★ You can leave the tab — it will continue automatically.\n');
        await sleep(waitMs);
        continue; // retry the same request
      }

      if (!res.ok) throw new Error('Pexels HTTP ' + res.status);
      return res;
    }
  }

  // ── Cloudinary upload ─────────────────────────────────────────────────────
  async function uploadToCloudinary(blob, filename) {
    // Skip if blob is suspiciously large (>3.5 MB) to avoid timeouts
    if (blob.size > 3.5 * 1024 * 1024) {
      throw new Error('Image too large (' + Math.round(blob.size / 1024) + ' KB) — skipped to avoid timeout');
    }
    const form = new FormData();
    form.append('file', blob, filename);
    form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    form.append('folder', 'diplomacysim');
    form.append('quality', 'auto');
    form.append('fetch_format', 'auto');

    const res = await fetchWithTimeout(
      'https://api.cloudinary.com/v1_1/' + CLOUDINARY_CLOUD_NAME + '/image/upload',
      { method: 'POST', body: form },
      45000 // 45s timeout — large enough for any blob we allow
    );
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error('Cloudinary: ' + (e.error?.message || res.status));
    }
    return (await res.json()).secure_url;
  }

  // ── Category keywords for Pexels search ──────────────────────────────────
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

  const STOP_WORDS = new Set([
    'the','a','an','of','in','on','at','to','for','is','are','was','were',
    'and','or','but','with','from','by','as','it','its','this','that','these',
    'those','be','been','have','has','had','do','does','did','will','would',
    'could','should','may','might','not','no','each','every','all','any',
    'more','most','other','such','than','then','very','just','about'
  ]);

  function buildQuery(title, category) {
    const catKeys   = CATEGORY_KEYWORDS[category] || 'politics diplomacy world';
    const titleKeys = title.toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3 && !STOP_WORDS.has(w))
      .slice(0, 3)
      .join(' ');
    return (titleKeys + ' ' + catKeys).trim().slice(0, 100);
  }

  // ── Find a unique Pexels photo not already used this run ──────────────────
  async function fetchUniquePhoto(query, scenarioId, usedPhotoIds) {
    for (let page = 1; page <= 8; page++) {
      const url  = 'https://api.pexels.com/v1/search?query=' +
        encodeURIComponent(query) + '&per_page=15&orientation=landscape&page=' + page;
      const res  = await pexelsFetch(url);
      const data = await res.json();

      if (!data.photos || !data.photos.length) break;

      // Deterministic starting offset from scenario ID
      const seedNum = parseInt(scenarioId.slice(0, 8), 16);
      const seed    = (isNaN(seedNum) ? 0 : seedNum) % data.photos.length;
      for (let i = 0; i < data.photos.length; i++) {
        const photo = data.photos[(seed + i) % data.photos.length];
        if (!photo) continue;
        if (!usedPhotoIds.has(photo.id)) {
          usedPhotoIds.add(photo.id);
          // Prefer src.large (≤1920px, ~200-600KB) over src.large2x (≤3840px, can be >3MB)
          return { photoUrl: photo.src.large || photo.src.medium, photoId: photo.id };
        }
      }
    }
    throw new Error('No unique photo found after 8 pages for: ' + query);
  }

  // ── Load persisted run state from Firestore ───────────────────────────────
  console.log('═══════════════════════════════════════════════════');
  console.log('DiplomacySim · Final Migration Script');
  console.log('═══════════════════════════════════════════════════');
  console.log('📡 Loading state from Firestore…');

  const STATE_DOC  = db.collection('_migration').doc('final_run_v3');
  const stateSnap  = await STATE_DOC.get();

  let completedIds = new Set();
  let usedPhotoIds = new Set();

  if (stateSnap.exists) {
    const s = stateSnap.data();
    completedIds = new Set(s.completedIds || []);
    usedPhotoIds = new Set(s.usedPhotoIds || []);
    console.log('🔄 Resuming run: ' + completedIds.size + ' done, ' +
      usedPhotoIds.size + ' photo IDs tracked');
  } else {
    console.log('🆕 No previous run found — starting fresh');
  }

  // ── Fetch all scenarios ───────────────────────────────────────────────────
  console.log('📡 Fetching all scenarios…');
  const allSnap = await db.collection('scenarios').get();

  // Process: ones without images first (priority), then ones already on Cloudinary
  const withoutImage = allSnap.docs.filter(d =>
    !completedIds.has(d.id) && !(d.data().imageUrl || '').includes('cloudinary.com')
  );
  const withImage    = allSnap.docs.filter(d =>
    !completedIds.has(d.id) && (d.data().imageUrl || '').includes('cloudinary.com')
  );
  const todos = [...withoutImage, ...withImage];

  console.log('');
  console.log('📋 Total scenarios:           ' + allSnap.size);
  console.log('✅ Already done (this run):   ' + completedIds.size);
  console.log('🔴 Without Cloudinary image:  ' + withoutImage.length + '  ← processed first');
  console.log('🔁 Redo for deduplication:    ' + withImage.length);
  console.log('📌 To process this run:       ' + todos.length);
  console.log('');

  if (todos.length === 0) {
    console.log('🎉 All scenarios already processed! Every image is unique.');
    return;
  }

  const estHours = (todos.length * 4.5 / 3600).toFixed(1);
  const confirmed = confirm(
    'Final migration: ' + todos.length + ' scenarios to process.\n\n' +
    '• ' + withoutImage.length + ' need images (done first)\n' +
    '• ' + withImage.length + ' redone to guarantee uniqueness\n' +
    '• Auto-pauses on Pexels rate limits and resumes\n' +
    '• Progress saved every 10 steps (resumable)\n' +
    '• Estimated time: ~' + estHours + 'h (leave tab open)\n\n' +
    '⚠️  Do not close this tab. The script handles everything.\n\nStart?'
  );
  if (!confirmed) { console.log('Cancelled.'); return; }

  // ── Main loop ─────────────────────────────────────────────────────────────
  let success = 0, failed = 0, saveCounter = 0;

  for (const doc of todos) {
    const data     = doc.data();
    const title    = data.title    || 'Untitled';
    const category = data.category || '';
    const overall  = completedIds.size + failed + 1;

    console.log('🖼  [' + overall + '/' + allSnap.size + '] ' + title.slice(0, 55) + '…');

    try {
      const query = buildQuery(title, category);
      const { photoUrl, photoId } = await fetchUniquePhoto(query, doc.id, usedPhotoIds);

      // Download photo with timeout
      let blob;
      try {
        const imgRes = await fetchWithTimeout(photoUrl, {}, 20000);
        if (!imgRes.ok) throw new Error('Download HTTP ' + imgRes.status);
        blob = await imgRes.blob();
      } catch (dlErr) {
        // One retry after 2s
        console.warn('  ⚠️  Download failed (' + dlErr.message + '), retrying once…');
        await sleep(2000);
        const imgRes2 = await fetchWithTimeout(photoUrl, {}, 20000);
        if (!imgRes2.ok) throw new Error('Retry download HTTP ' + imgRes2.status);
        blob = await imgRes2.blob();
      }

      const kbSize   = Math.round(blob.size / 1024);
      console.log('  ⬆️  ' + kbSize + ' KB → Cloudinary…');

      const safeName = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50) +
        '-' + doc.id.slice(0, 8) + '.jpg';
      const cdnUrl   = await uploadToCloudinary(blob, safeName);

      await db.collection('scenarios').doc(doc.id).update({ imageUrl: cdnUrl });
      console.log('  ✅ ' + cdnUrl.slice(0, 70) + '…');

      completedIds.add(doc.id);
      success++;
      saveCounter++;

      // Save state to Firestore every 10 scenarios
      if (saveCounter % 10 === 0) {
        await STATE_DOC.set({
          completedIds: Array.from(completedIds),
          usedPhotoIds: Array.from(usedPhotoIds),
          lastUpdated:  new Date().toISOString(),
          finished:     false
        });
        console.log('  💾 Progress saved — ' + completedIds.size + '/' + allSnap.size + ' complete');
      }

      // Pace: 800ms between scenarios keeps us under 200 req/hr in theory,
      // but the auto-429 handler above is the real safety net.
      await sleep(800);

    } catch (err) {
      console.error('  ❌ ' + title.slice(0, 40) + ' — ' + err.message);
      failed++;
    }
  }

  // ── Final state save ──────────────────────────────────────────────────────
  const allDone = completedIds.size >= allSnap.size;
  await STATE_DOC.set({
    completedIds: Array.from(completedIds),
    usedPhotoIds: Array.from(usedPhotoIds),
    lastUpdated:  new Date().toISOString(),
    finished:     allDone
  });

  console.log('\n═══════════════════════════════════════════════════');
  console.log('Run complete.');
  console.log('  ✅ Uploaded this session: ' + success);
  console.log('  ❌ Failed this session:   ' + failed);
  console.log('  📋 Total done overall:    ' + completedIds.size + ' / ' + allSnap.size);
  console.log('═══════════════════════════════════════════════════');

  if (!allDone) {
    console.log('\n⚠️  ' + (allSnap.size - completedIds.size) + ' scenarios still pending.');
    console.log('  → Paste this script again to resume from where you left off.');
    console.log('  → Photo ID tracking is saved — deduplication continues correctly.');
  } else {
    console.log('\n🎉 All ' + allSnap.size + ' scenarios have unique CDN images!');
    console.log('   You can delete the _migration collection from Firestore now.');
  }

})();
