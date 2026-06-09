(async function() {
  const db = firebase.firestore();
  const snap = await db.collection('scenarios').get();

  let noImage = 0, pollinations = 0, cloudinary = 0, other = 0;

  snap.forEach(doc => {
    const url = doc.data().imageUrl || '';
    if (!url)                          noImage++;
    else if (url.includes('pollinations')) pollinations++;
    else if (url.includes('cloudinary'))   cloudinary++;
    else                                   other++;
  });

  console.log('════════════════════════════════');
  console.log('IMAGE STATUS — ' + snap.size + ' total scenarios');
  console.log('════════════════════════════════');
  console.log('✅ Cloudinary (good):   ' + cloudinary);
  console.log('❌ No image:            ' + noImage);
  console.log('⚠️  Pollinations (dead): ' + pollinations);
  console.log('🔗 Other URL:           ' + other);
  console.log('────────────────────────────────');
  console.log('Still need images:      ' + (noImage + pollinations + other));
  console.log('════════════════════════════════');
})();
