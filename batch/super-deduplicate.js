// ═══════════════════════════════════════════════════════════════
// DiplomacySim · SUPER DEDUPLICATOR
// ═══════════════════════════════════════════════════════════════
// Runs SEVEN independent checks against every scenario pair.
// Any scenario that fails ANY check is flagged as a duplicate.
// The OLDEST document (earliest createdAt) is always kept.
// A full report is printed before anything is deleted.
//
// CHECKS:
//   1. Exact title match (normalised)
//   2. Title word-set Jaccard similarity ≥ 0.82
//   3. Title substring containment (one title contains the other)
//   4. Exact question match (normalised)
//   5. Exact optionA match (normalised, first 100 chars)
//   6. optionA + optionB combined fingerprint match
//   7. Description first 140 chars exact match (normalised)
//
// Paste in DevTools console (Cmd+Option+J) on admin.html
// while signed in as admin.
// ═══════════════════════════════════════════════════════════════

(async function () {
  const db = firebase.firestore();

  // ── 0. Fetch everything ──────────────────────────────────────
  console.log("📡 Fetching all scenarios from Firestore...");
  const snap = await db.collection("scenarios").get();
  console.log("📋 Total documents found: " + snap.size);

  const docs = [];
  snap.forEach(doc => docs.push({ id: doc.id, ref: doc.ref, data: doc.data() }));

  // ── 1. Normalisation helpers ─────────────────────────────────
  function norm(s, maxLen) {
    const out = (s || "")
      .toLowerCase()
      .replace(/[''""«»]/g, "")          // smart quotes
      .replace(/[^\w\s]/g, " ")           // punctuation → space
      .replace(/\s+/g, " ")
      .trim();
    return maxLen ? out.slice(0, maxLen) : out;
  }

  function words(s) {
    return new Set(norm(s).split(" ").filter(w => w.length > 2));
  }

  function jaccard(a, b) {
    const wa = words(a);
    const wb = words(b);
    if (!wa.size || !wb.size) return 0;
    let inter = 0;
    wa.forEach(w => { if (wb.has(w)) inter++; });
    return inter / (wa.size + wb.size - inter);
  }

  function levenshtein(a, b) {
    // Only used on short strings (titles)
    const m = a.length, n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    const dp = Array.from({ length: m + 1 }, (_, i) =>
      Array.from({ length: n + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0)
    );
    for (let i = 1; i <= m; i++)
      for (let j = 1; j <= n; j++)
        dp[i][j] = a[i-1] === b[j-1]
          ? dp[i-1][j-1]
          : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    return dp[m][n];
  }

  // ── 2. Build per-doc fingerprints ────────────────────────────
  const fingerprinted = docs.map(doc => {
    const d = doc.data;
    return {
      ...doc,
      f_title:       norm(d.title),
      f_question:    norm(d.question),
      f_optA:        norm(d.optionA, 100),
      f_optAB:       norm((d.optionA || "") + (d.optionB || ""), 160),
      f_desc:        norm(d.description, 140),
      f_titleWords:  norm(d.title),   // used for jaccard
    };
  });

  // ── 3. Sort so oldest doc is first (we always keep oldest) ───
  fingerprinted.sort((a, b) => {
    const ta = a.data.createdAt || "";
    const tb = b.data.createdAt || "";
    return ta < tb ? -1 : ta > tb ? 1 : 0;
  });

  // ── 4. Run all seven checks ──────────────────────────────────
  const JACCARD_THRESHOLD  = 0.82;   // title word overlap ≥ this → dupe
  const LEVENSHTEIN_MAX    = 4;      // edit distance ≤ this on short titles → dupe

  const dupeSet  = new Set();   // doc IDs confirmed as duplicates
  const reasons  = {};          // docId → [reason strings]
  const keepFor  = {};          // dupeId → keepId

  function markDupe(keepDoc, dupeDoc, reason) {
    if (dupeSet.has(keepDoc.id)) return; // never mark the keeper itself
    if (!dupeSet.has(dupeDoc.id)) {
      dupeSet.add(dupeDoc.id);
      reasons[dupeDoc.id]  = [];
      keepFor[dupeDoc.id]  = keepDoc.id;
    }
    reasons[dupeDoc.id].push(reason);
  }

  console.log("🔍 Running duplicate checks across " + fingerprinted.length + " documents...");

  // Maps for O(1) lookups on exact checks
  const byTitle    = {};
  const byQuestion = {};
  const byOptA     = {};
  const byOptAB    = {};
  const byDesc     = {};

  for (const doc of fingerprinted) {
    // ── Check 1: Exact title ──────────────────────────────────
    if (doc.f_title) {
      if (byTitle[doc.f_title] !== undefined) {
        markDupe(fingerprinted[byTitle[doc.f_title]], doc, "CHECK 1 · Exact title match");
      } else {
        byTitle[doc.f_title] = fingerprinted.indexOf(doc);
      }
    }

    // ── Check 4: Exact question ───────────────────────────────
    if (doc.f_question && doc.f_question.length > 20) {
      if (byQuestion[doc.f_question] !== undefined) {
        markDupe(fingerprinted[byQuestion[doc.f_question]], doc, "CHECK 4 · Exact question match");
      } else {
        byQuestion[doc.f_question] = fingerprinted.indexOf(doc);
      }
    }

    // ── Check 5: Exact optionA (first 100 chars) ──────────────
    if (doc.f_optA && doc.f_optA.length > 20) {
      if (byOptA[doc.f_optA] !== undefined) {
        markDupe(fingerprinted[byOptA[doc.f_optA]], doc, "CHECK 5 · Exact optionA match");
      } else {
        byOptA[doc.f_optA] = fingerprinted.indexOf(doc);
      }
    }

    // ── Check 6: optionA + optionB combined ───────────────────
    if (doc.f_optAB && doc.f_optAB.length > 30) {
      if (byOptAB[doc.f_optAB] !== undefined) {
        markDupe(fingerprinted[byOptAB[doc.f_optAB]], doc, "CHECK 6 · optionA+B fingerprint match");
      } else {
        byOptAB[doc.f_optAB] = fingerprinted.indexOf(doc);
      }
    }

    // ── Check 7: Description first 140 chars ─────────────────
    if (doc.f_desc && doc.f_desc.length > 40) {
      if (byDesc[doc.f_desc] !== undefined) {
        markDupe(fingerprinted[byDesc[doc.f_desc]], doc, "CHECK 7 · Description prefix match");
      } else {
        byDesc[doc.f_desc] = fingerprinted.indexOf(doc);
      }
    }
  }

  // ── Checks 2, 3 require pairwise comparison ──────────────────
  // Only run on docs not already flagged, to save time
  const unflagged = fingerprinted.filter(d => !dupeSet.has(d.id));
  console.log("🔍 Running fuzzy checks on " + unflagged.length + " remaining docs...");

  for (let i = 0; i < unflagged.length; i++) {
    for (let j = i + 1; j < unflagged.length; j++) {
      const a = unflagged[i];
      const b = unflagged[j];

      // Skip if b is already a dupe
      if (dupeSet.has(b.id)) continue;

      const ta = a.f_title;
      const tb = b.f_title;

      // ── Check 2: Jaccard similarity on title words ──────────
      const jScore = jaccard(ta, tb);
      if (jScore >= JACCARD_THRESHOLD) {
        markDupe(a, b, "CHECK 2 · Title Jaccard=" + jScore.toFixed(3) + " (≥" + JACCARD_THRESHOLD + ")");
        continue;
      }

      // ── Check 3: Title substring containment ─────────────────
      if (ta.length > 8 && tb.length > 8) {
        if (ta.includes(tb) || tb.includes(ta)) {
          markDupe(a, b, "CHECK 3 · Title substring containment");
          continue;
        }
      }

      // ── Levenshtein on short similar-length titles ────────────
      if (
        ta.length > 10 && tb.length > 10 &&
        Math.abs(ta.length - tb.length) <= LEVENSHTEIN_MAX
      ) {
        const lev = levenshtein(ta, tb);
        if (lev <= LEVENSHTEIN_MAX && lev < ta.length * 0.15) {
          markDupe(a, b, "CHECK 2b · Title Levenshtein=" + lev + " (≤" + LEVENSHTEIN_MAX + ")");
        }
      }
    }
  }

  // ── 5. Build report ──────────────────────────────────────────
  const dupeIds = Array.from(dupeSet);

  if (dupeIds.length === 0) {
    console.log("");
    console.log("✅ ═══════════════════════════════════════════════");
    console.log("✅  ZERO DUPLICATES FOUND. Database is clean.");
    console.log("✅ ═══════════════════════════════════════════════");
    return;
  }

  // Group by category for summary
  const catCounts = {};
  const dupeDetails = dupeIds.map(id => {
    const doc = fingerprinted.find(d => d.id === id);
    const keepDoc = fingerprinted.find(d => d.id === keepFor[id]);
    const cat = (doc.data.category || "Unknown").trim();
    catCounts[cat] = (catCounts[cat] || 0) + 1;
    return { doc, keepDoc, reasons: reasons[id] };
  });

  console.log("");
  console.log("⚠️  ══════════════════════════════════════════════════");
  console.log("⚠️   DUPLICATES DETECTED: " + dupeIds.length);
  console.log("⚠️  ══════════════════════════════════════════════════");
  console.log("");
  console.log("BY THEATRE:");
  Object.entries(catCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, n]) => console.log("  • " + n + " × " + cat));
  console.log("");
  console.log("FULL DUPLICATE LIST:");
  dupeDetails.forEach(({ doc, keepDoc, reasons }, i) => {
    console.log(
      "  [" + (i + 1) + "] " + (doc.data.category || "?") + " · \"" + doc.data.title + "\""
    );
    console.log(
      "       ↳ KEEPING: \"" + (keepDoc ? keepDoc.data.title : "?") + "\" (older)"
    );
    reasons.forEach(r => console.log("       ↳ " + r));
  });
  console.log("");
  console.log("Unique scenarios that will remain: " +
    (fingerprinted.length - dupeIds.length));
  console.log("Documents to be deleted: " + dupeIds.length);

  // ── 6. Confirm and delete ────────────────────────────────────
  const byTheatre = Object.entries(catCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([c, n]) => "  • " + n + " × " + c)
    .join("\n");

  const confirmed = window.confirm(
    "SUPER DEDUPLICATOR\n" +
    "══════════════════\n" +
    "Found " + dupeIds.length + " duplicate(s) across 7 checks.\n\n" +
    "BY THEATRE:\n" + byTheatre + "\n\n" +
    "Unique scenarios kept: " + (fingerprinted.length - dupeIds.length) + "\n" +
    "To delete: " + dupeIds.length + "\n\n" +
    "The oldest version of each scenario is always kept.\n\n" +
    "Proceed with deletion?"
  );

  if (!confirmed) {
    console.log("❌ Cancelled. Nothing was deleted.");
    return;
  }

  // Delete in Firestore batches of 400
  const BATCH_SIZE = 400;
  const refs = dupeIds.map(id => fingerprinted.find(d => d.id === id).ref);
  let deleted = 0;

  for (let i = 0; i < refs.length; i += BATCH_SIZE) {
    const chunk = refs.slice(i, i + BATCH_SIZE);
    const batch = db.batch();
    chunk.forEach(ref => batch.delete(ref));
    await batch.commit();
    deleted += chunk.length;
    console.log("🗑️  Deleted " + deleted + " / " + refs.length);
  }

  console.log("");
  console.log("🎉 ══════════════════════════════════════════════════");
  console.log("🎉  Done. " + deleted + " duplicate(s) removed.");
  console.log("🎉  " + (fingerprinted.length - deleted) + " unique scenarios remain.");
  console.log("🎉 ══════════════════════════════════════════════════");

  // ── 7. Final count by category ───────────────────────────────
  const remaining = fingerprinted.filter(d => !dupeSet.has(d.id));
  const finalCats = {};
  remaining.forEach(d => {
    const c = (d.data.category || "Unknown").trim();
    finalCats[c] = (finalCats[c] || 0) + 1;
  });
  console.log("");
  console.log("FINAL SCENARIO COUNT BY THEATRE:");
  Object.entries(finalCats)
    .sort((a, b) => b[1] - a[1])
    .forEach(([c, n]) => console.log("  " + n + " × " + c));
  console.log("  ─────────────────");
  console.log("  " + remaining.length + " × TOTAL");
})();
