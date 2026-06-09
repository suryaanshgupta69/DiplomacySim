// ═══════════════════════════════════════════════════════════════
// DiplomacySim · SETUP CONFIG (run once)
// ═══════════════════════════════════════════════════════════════
// Stores sensitive config in Firestore instead of source code.
// After running this, the admin email and API keys are no longer
// visible in source code — they live in Firestore behind auth.
//
// Run ONCE by pasting into DevTools console on admin.html.
// ═══════════════════════════════════════════════════════════════

(async function () {
  const db = firebase.firestore();

  await db.collection('config').doc('admin').set({
    adminEmails: ['suru669op@gmail.com'],
    pexelsKey:   'rEHCvKXn2mTbTM62xVZTZA4KPrm6JsWuEE8RAF2Z0DJk8NyDXyrmx1DD',
    cloudinaryCloud:  'djkzjki1t',
    cloudinaryPreset: 'diplomacysim_unsigned'
  });

  console.log('✅ Config saved to Firestore config/admin');
  console.log('   You can now remove hardcoded keys from source files.');
  console.log('\n⚠️  Also update Firestore Security Rules to add:');
  console.log('   match /config/{doc} { allow read: if request.auth != null; }');
})();
