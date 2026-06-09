// ── DiplomacySim: Generate & save Pollinations images for all scenarios ──
// Paste in browser console on admin.html while signed in
// Fetches every scenario with imageUrl == null, builds a prompt from its
// title + category + description, writes the Pollinations URL to Firestore.
// Images render lazily — no heavy downloading happens here.
// ─────────────────────────────────────────────────────────────────────────
(async function () {
  const db = firebase.firestore();

  // ── Art-direction prefix per category ──────────────────────────────────
  const STYLE = {
    "Current Affairs":             "photorealistic editorial press photograph, dramatic lighting, Reuters style —",
    "Historical Events":           "detailed oil painting, historical realism, museum quality, cinematic composition —",
    "Fictional Scenarios":         "cinematic concept art, sci-fi realism, dramatic atmosphere, wide angle —",
    "Economic Strategy":           "clean modern infographic illustration, Bloomberg visual style, bold colours —",
    "Global Diplomacy":            "dramatic diplomatic tableau, wide angle, authoritative gravitas, photorealistic —",
    "Intelligence & Espionage":    "dark moody espionage film still, shadowy figures, classified dossier aesthetic, cinematic —",
    "Nuclear Brinkmanship":        "cold war era dramatic illustration, nuclear tension, war room atmosphere, cinematic realism —",
    "Environmental Crises":        "powerful nature documentary photograph, dramatic environmental destruction, National Geographic style —",
    "Humanitarian & Human Rights": "photojournalism style photograph, raw emotion, humanitarian crisis, Pulitzer quality —",
    "Cyber Warfare":               "dark digital cyberpunk illustration, glowing code, network grid, hacker aesthetic, cinematic —",
  };

  const DEFAULT_STYLE = "cinematic documentary photograph, dramatic lighting, high detail —";

  function buildPrompt(scenario) {
    const style  = STYLE[scenario.category] || DEFAULT_STYLE;
    // Use first 120 chars of description to add scene context
    const snippet = (scenario.description || "").slice(0, 120).replace(/[^\w\s,.-]/g, "");
    const prompt  = `${style} ${scenario.title}, ${snippet}`;
    return prompt.trim();
  }

  function pollinationsUrl(prompt) {
    const encoded = encodeURIComponent(prompt);
    return `https://image.pollinations.ai/prompt/${encoded}?width=800&height=450&nologo=true&seed=${Math.floor(Math.random()*99999)}`;
  }

  // ── 1. Fetch all scenarios that still need an image ─────────────────────
  console.log("🔍 Fetching scenarios with no image…");
  const snap = await db.collection("scenarios").get();

  const needsImage = snap.docs.filter(doc => {
    const d = doc.data();
    return !d.imageUrl || d.imageUrl === null || d.imageUrl === "";
  });

  console.log(`📋 Found ${needsImage.length} scenarios without images (${snap.size} total).`);

  if (needsImage.length === 0) {
    console.log("✅ All scenarios already have images. Nothing to do.");
    return;
  }

  const confirmed = confirm(
    `Generate Pollinations.ai image URLs for ${needsImage.length} scenarios?\n\n` +
    `This writes URLs to Firestore instantly — images render lazily when viewed.\n\n` +
    `Continue?`
  );
  if (!confirmed) { console.log("Cancelled."); return; }

  // ── 2. Update in Firestore batches of 400 ───────────────────────────────
  const BATCH_SIZE = 400;
  let updated = 0;

  for (let i = 0; i < needsImage.length; i += BATCH_SIZE) {
    const chunk = needsImage.slice(i, i + BATCH_SIZE);
    const batch = db.batch();

    chunk.forEach(doc => {
      const data   = doc.data();
      const prompt = buildPrompt(data);
      const url    = pollinationsUrl(prompt);
      batch.update(doc.ref, { imageUrl: url });
    });

    await batch.commit();
    updated += chunk.length;
    console.log(`✅ ${updated} / ${needsImage.length} image URLs saved…`);
  }

  console.log(`\n🎉 Done! ${updated} scenarios now have Pollinations image URLs.`);
  console.log("Images will render the first time each scenario is viewed — no pre-loading needed.");
  console.log("\nSample URL for first scenario:");
  const sample = needsImage[0].data();
  console.log(pollinationsUrl(buildPrompt(sample)));
})();
