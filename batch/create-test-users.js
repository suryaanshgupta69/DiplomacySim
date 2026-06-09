// ═══════════════════════════════════════════════════════════════
// DiplomacySim · Test User Creator  (v4)
//
// PRE-REQUISITE: temporarily relax Firestore rules for responses + users:
//   match /responses/{id} { allow create: if request.auth != null; }
//   match /users/{userId} { allow write:  if request.auth != null; }
// Restore strict rules after the script finishes.
//
// Paste into DevTools console while signed in as admin.
// Takes ~8-12 minutes.  Admin session never disrupted.
// ═══════════════════════════════════════════════════════════════

(async function() {

  const FB_CONFIG = {
    apiKey:            'AIzaSyC_-1B2F9A8tXoPDlmJT4Gf2XPVNcRr94s',
    authDomain:        'diplomacysim-110de.firebaseapp.com',
    projectId:         'diplomacysim-110de',
    storageBucket:     'diplomacysim-110de.firebasestorage.app',
    messagingSenderId: '29829728460',
    appId:             '1:29829728460:web:7c15e8bc421e2dd56dda69'
  };

  // Secondary app — used ONLY for creating Auth accounts & getting uids.
  // ALL Firestore writes go through the main admin db (no auth propagation issue).
  const SEC_NAME = 'ds-seed-v4';
  let secApp;
  try   { secApp = firebase.app(SEC_NAME); }
  catch { secApp = firebase.initializeApp(FB_CONFIG, SEC_NAME); }
  const secAuth = secApp.auth();

  // Main db — admin is signed in, so request.auth != null is satisfied
  const db    = firebase.firestore();
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  console.log('✅ Ready. Admin:', firebase.auth().currentUser?.email);

  // ── User roster ───────────────────────────────────────────────
  const TEST_USERS = [
    { email: 'testuser01@diplomacysim.test', password: 'TestPass123!', username: 'Ambassador_Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      bio: 'Senior diplomat with 20 years across the Asia-Pacific theatre. Believes in patient multilateralism.' },
    { email: 'testuser02@diplomacysim.test', password: 'TestPass123!', username: 'General_Petrov',
      avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
      bio: 'Retired General, now strategic consultant. Prefers decisive action over prolonged negotiation.' },
    { email: 'testuser03@diplomacysim.test', password: 'TestPass123!', username: 'Minister_Okafor',
      avatar: 'https://randomuser.me/api/portraits/men/76.jpg',
      bio: 'West African trade minister. Focuses on economic levers and coalition-building.' },
    { email: 'testuser04@diplomacysim.test', password: 'TestPass123!', username: 'Agent_Nakamura',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      bio: 'Intelligence analyst. Reads between the lines. Never trusts Option A.' },
    { email: 'testuser05@diplomacysim.test', password: 'TestPass123!', username: 'Director_Al-Rashid',
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
      bio: 'Director of a Gulf-based think tank. Tracks energy markets and nuclear proliferation.' },
    { email: 'testuser06@diplomacysim.test', password: 'TestPass123!', username: 'Consul_Ferreira',
      avatar: 'https://randomuser.me/api/portraits/women/62.jpg',
      bio: 'Brazilian consul. Former journalist. Believes transparency and press freedom change outcomes.' },
    { email: 'testuser07@diplomacysim.test', password: 'TestPass123!', username: 'Colonel_Andersen',
      avatar: 'https://randomuser.me/api/portraits/men/88.jpg',
      bio: 'NATO logistics officer. Obsessed with escalation ladders and red lines.' },
    { email: 'testuser08@diplomacysim.test', password: 'TestPass123!', username: 'Envoy_Kapoor',
      avatar: 'https://randomuser.me/api/portraits/women/29.jpg',
      bio: 'Indian Foreign Service. Navigates non-alignment with surgical precision.' },
    { email: 'testuser09@diplomacysim.test', password: 'TestPass123!', username: 'Attaché_Müller',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      bio: 'German attaché. Values international law and precedent above all tactical gains.' },
    { email: 'testuser10@diplomacysim.test', password: 'TestPass123!', username: 'Secretary_Tanaka',
      avatar: 'https://randomuser.me/api/portraits/women/8.jpg',
      bio: "UN Secretary's office. Coordinates multilateral responses to humanitarian crises." },
  ];

  // ── Forum threads ─────────────────────────────────────────────
  const FORUM_THREADS = [
    [
      { u: 1, body: 'The Pyongyang scenario broke me. I chose the surgical-strike option and lost 65 points. Still not sure the sanctions route would have been better given the 45-second timer.' },
      { u: 6, body: "@General_Petrov I made the exact same call and got hammered. Went back and tried the back-channel diplomacy option — scored 88. The game really punishes anything that looks like pre-emption." },
      { u: 4, body: 'The nuclear scenarios are designed around the idea that signalling matters more than capability. Every aggressive option bleeds points because it triggers counter-mobilisation in the simulation.' },
      { u: 0, body: "Agreed. I've played the Pyongyang one three times. The back-channel option paired with a UN resolution request is reliably the highest scorer. Restraint wins every time in that theatre." },
      { u: 9, body: "From a UN perspective that tracks perfectly. The scenarios model the actual escalation literature — Schelling's work, mostly. Credible commitment without crossing thresholds." },
    ],
    [
      { u: 3, body: 'The Cyber Warfare attribution scenarios are the most realistic thing in this game. The "confirm attribution before responding" dilemma is exactly what analysts face. No easy answers.' },
      { u: 7, body: 'I keep second-guessing myself on those. Went with immediate retaliation on the grid-attack scenario — lost 40 points. The timer pressure makes you feel like you have to act.' },
      { u: 3, body: "That's the trap. The timer IS the scenario. Real attribution takes weeks. The game teaches you to resist the pressure for instant response. Option C (forensic delay + allied consultation) is almost always optimal." },
      { u: 6, body: 'I noticed — "consult allies" appears in the best option for probably 70% of Cyber scenarios. The game really emphasises coalition over unilateral action.' },
      { u: 4, body: "Which mirrors actual doctrine. No serious power does solo attribution anymore after the 2016 lessons. You need Five Eyes or EU cert teams backing the claim." },
      { u: 2, body: "This is making me rethink my whole approach. I've been treating Cyber as a solo puzzle. Need to factor in alliance coordination every time." },
    ],
    [
      { u: 5, body: 'For anyone chasing leaderboard: the time multiplier is everything. Same scenario answered in 12 seconds vs 90 seconds — difference of nearly 60 points on the same option.' },
      { u: 8, body: 'Confirmed. The brief is usually 250 words but 80% of the signal is in the first two sentences and the final paragraph. Read those, decide fast.' },
      { u: 0, body: 'Hot take: the hint system costs more than it saves. -15 points for a hint, but a fast correct answer without one beats a slow correct answer with one every time.' },
      { u: 1, body: 'Disagree. For Nuclear Brinkmanship specifically the hint clarifies escalation context in ways that consistently push me to the right option. Worth the 15 on a 100-point scenario.' },
      { u: 9, body: "I think it depends on your knowledge base. Historical Events and Current Affairs I skip hints entirely. Fictional Scenarios — always worth it." },
      { u: 7, body: 'My rule: hint only if genuinely split between two options after reading. Never as a first-read crutch.' },
      { u: 5, body: 'Also: base points per option are fixed but the multiplier stacks. A 70-base option answered in 10 seconds beats a 90-base option answered in 90 seconds. Speed matters more than finding the "best" option.' },
    ],
    [
      { u: 8, body: 'The Cuban Missile Crisis scenario is extraordinarily well-constructed. The briefing matches the declassified ExComm records almost verbatim. Whoever wrote these did serious archival work.' },
      { u: 0, body: 'The Berlin Wall one similarly. The order to shoot versus detain defectors — I knew the history and still found it genuinely difficult to decide what I\'d recommend as an advisor.' },
      { u: 2, body: 'Historical Events is my weakest theatre. I keep applying modern frameworks to Cold War scenarios and getting destroyed. The game punishes anachronistic thinking.' },
      { u: 8, body: "@Minister_Okafor The key is to think about what information decision-makers actually had at the time. Read the brief as if you're reading a 1962 intelligence cable." },
      { u: 4, body: "Epistemic authenticity. You only have what the actor had. No hindsight allowed. It's what makes the scoring feel fair even when you get it wrong." },
    ],
    [
      { u: 9, body: "The Amazon deforestation scenario has a genuinely surprising optimal answer. Won't spoil it but: ignore the obvious economic lever. The answer involves indigenous land rights law." },
      { u: 6, body: "I got that one right only because I'd been following the Lula government's actual policy. The game rewards people who follow real-world developments." },
      { u: 7, body: 'The Rohingya scenario in Humanitarian & Human Rights destroyed me emotionally. Even the highest-scoring option felt inadequate. I think that\'s intentional.' },
      { u: 9, body: 'Completely agree. Some scenarios have a "best" option that\'s still tragic. The scoring acknowledges harm minimisation rather than pretending there\'s a clean solution.' },
      { u: 3, body: "That's what separates this from a quiz app. It's modelling real decision environments where you're choosing between bad and worse, not right and wrong." },
      { u: 5, body: "Well said. I've recommended this to three policy school friends. The Environmental Crises theatre alone is worth it for anyone studying climate governance." },
    ],
    [
      { u: 3, body: 'Intelligence & Espionage tip: the double-agent option is almost never what it appears. If you see it, read the risk section of the brief twice before clicking.' },
      { u: 1, body: 'Learned this the hard way. Chose the double-agent route in the Tehran scenario — lost 50 points because the brief mentioned "compromised handler network" in paragraph three which I glossed over.' },
      { u: 4, body: 'The espionage scenarios are almost pure reading comprehension tests. The brief contains the answer, buried in tradecraft jargon. Slow down and parse every noun in the threat assessment.' },
      { u: 0, body: 'The option labels are deliberately misleading. "Covert extraction" sounds aggressive, "maintain cover" sounds passive — which scores higher depends entirely on the specific brief, not the label.' },
      { u: 7, body: "I've started reading Option D first because it's almost always the most counterintuitive and often correct in this theatre. Not a hard rule but worth checking." },
    ],
    [
      { u: 2, body: "Honest question: does anyone find the Economic Strategy scenarios too optimistic about multilateral coordination? The WTO deadlock scenario had a 'negotiate a framework' option scoring 95 but that realistically takes a decade." },
      { u: 8, body: "Fair critique. I think the game models ideal outcomes given correct choices, not realistic timelines. It's a training tool, not a simulation." },
      { u: 5, body: 'The framing is "what should a good decision-maker recommend" not "what will actually happen." The scoring rewards principled action over cynical realism.' },
      { u: 2, body: "That helps reframe it. I was playing too cynically and consistently picking the 'pragmatic' option which scored low. The game rewards idealism tempered by strategy, not pure realpolitik." },
      { u: 0, body: 'Which is also a defensible pedagogical position. Most IR programs have overcorrected toward realism. A tool that rewards multilateral thinking has its place.' },
      { u: 9, body: "As someone who works in the actual UN system: the game's idealism reflects the normative framework we're supposed to operate in. Whether states follow it is different. Good training tool." },
      { u: 1, body: 'This debate has genuinely changed how I play. Going to re-run the Global Diplomacy theatre with a completely different lens.' },
    ],
  ];

  // ── Helpers ───────────────────────────────────────────────────
  function pickRandom(arr, n) {
    return arr.slice().sort(() => Math.random() - 0.5).slice(0, Math.min(n, arr.length));
  }
  function randomOption()      { return ['A','B','C','D'][Math.floor(Math.random()*4)]; }
  function randomInt(min, max) { return Math.floor(Math.random()*(max-min+1))+min; }
  function daysAgo(d)          { return new Date(Date.now() - d*24*60*60*1000).toISOString(); }

  // ── Wipe old test data so we only do creates (no updates) ────
  console.log('\n🧹 Clearing old test responses + user docs…');
  const TEST_EMAILS = TEST_USERS.map(u => u.email);
  // Find existing test user docs to get their uids for cleanup
  const existingUsers = await db.collection('users')
    .where('email', 'in', TEST_EMAILS).get();
  if (!existingUsers.empty) {
    const existingUids = existingUsers.docs.map(d => d.id);
    for (const oldUid of existingUids) {
      // Delete their responses
      const rSnap = await db.collection('responses').where('user_id', '==', oldUid).get();
      let delBatch = db.batch();
      let delCount = 0;
      for (const doc of rSnap.docs) {
        delBatch.delete(doc.ref); delCount++;
        if (delCount >= 400) { await delBatch.commit(); delBatch = db.batch(); delCount = 0; }
      }
      if (delCount > 0) await delBatch.commit();
      // Delete user doc
      await db.collection('users').doc(oldUid).delete();
    }
    console.log('  🗑️  Cleared ' + existingUsers.size + ' old test user docs + their responses');
  } else {
    console.log('  ✅ No old test data found — clean start');
  }
  // Wipe old test forum posts
  const oldForum = await db.collection('forum').where('username', 'in', TEST_USERS.map(u => u.username)).get();
  if (!oldForum.empty) {
    let fb = db.batch(); let fc = 0;
    for (const doc of oldForum.docs) { fb.delete(doc.ref); fc++; if (fc>=400){await fb.commit();fb=db.batch();fc=0;} }
    if (fc>0) await fb.commit();
    console.log('  🗑️  Cleared ' + oldForum.size + ' old forum posts');
  }

  // ── Load scenarios via admin db ───────────────────────────────
  console.log('\n📡 Loading scenarios…');
  const scenSnap     = await db.collection('scenarios').get();
  const allScenarios = scenSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  console.log('✅ ' + allScenarios.length + ' scenarios loaded');
  if (!allScenarios.length) { console.error('❌ No scenarios found'); return; }

  const userUids   = [];
  let totalCreated = 0;

  // ══════════════════════════════════════════════════════════════
  // PHASE 1 — Create Auth accounts (secondary app), write data (main admin db)
  // ══════════════════════════════════════════════════════════════
  for (let i = 0; i < TEST_USERS.length; i++) {
    const u = TEST_USERS[i];
    console.log('\n─────────────────────────────────────────');
    console.log('👤 [' + (i+1) + '/10] ' + u.username);

    // Create or sign in via secondary app to get uid
    let uid;
    try {
      let cred;
      try {
        cred = await secAuth.createUserWithEmailAndPassword(u.email, u.password);
        console.log('  ✅ Auth account created');
      } catch(e) {
        if (e.code === 'auth/email-already-in-use') {
          cred = await secAuth.signInWithEmailAndPassword(u.email, u.password);
          console.log('  ♻️  Already exists — uid retrieved');
        } else throw e;
      }
      uid = cred.user.uid;
      await secAuth.signOut(); // immediately sign out secondary — we only needed the uid
    } catch(e) {
      console.error('  ❌ Auth failed:', e.message);
      userUids.push(null);
      continue;
    }

    userUids.push(uid);
    console.log('  🔑 UID:', uid);
    console.log('  👑 Admin still active:', firebase.auth().currentUser?.email);

    // Write all Firestore data through main admin db
    const numToPlay   = randomInt(50, 70);
    const toPlay      = pickRandom(allScenarios, numToPlay);
    let   totalPoints = 0;
    let   batch       = db.batch();
    let   batchCount  = 0;

    for (const scen of toPlay) {
      const opt        = randomOption();
      const base       = Number(scen['points' + opt]) || randomInt(25, 95);
      const multiplier = [1, 1.1, 1.2, 1.5, 1.8, 2][Math.floor(Math.random()*6)];
      const pts        = Math.round(Math.max(5, Math.min(200, base * multiplier)));
      totalPoints += pts;

      batch.set(db.collection('responses').doc(), {   // auto-ID = always a create, never an update
        user_id:         uid,
        username:        u.username,
        avatar:          u.avatar,
        scenario_id:     scen.id,
        scenario_title:  scen.title    || 'Unknown',
        category:        scen.category || 'Global Diplomacy',
        selected_option: opt,
        points_earned:   pts,
        base_points:     base,
        time_multiplier: multiplier,
        seconds_taken:   randomInt(8, 115),
        hint_used:       Math.random() < 0.18,
        created_at:      daysAgo(randomInt(0, 90))
      });
      batchCount++;

      if (batchCount >= 400) {
        await batch.commit();
        console.log('  📦 Batch flushed (400)');
        batch = db.batch(); batchCount = 0;
        await sleep(400);
      }
    }

    // User profile
    batch.set(db.collection('users').doc(uid), {
      username:         u.username,
      email:            u.email,
      avatar:           u.avatar,
      bio:              u.bio,
      total_points:     totalPoints,
      scenarios_played: toPlay.length,
      created_at:       daysAgo(randomInt(30, 120))
    }, { merge: true });
    batchCount++;

    await batch.commit();
    console.log('  🎮 ' + toPlay.length + ' scenarios → ' + totalPoints.toLocaleString() + ' pts');
    console.log('  🖼️  Avatar + bio saved');
    totalCreated++;
    await sleep(500);
  }

  // ══════════════════════════════════════════════════════════════
  // PHASE 2 — Forum threads (all through main admin db)
  // ══════════════════════════════════════════════════════════════
  console.log('\n💬 Writing forum threads…');
  const threadOffsets = [13, 11, 9, 7, 5, 4, 2];
  let forumBatch = db.batch();
  let forumCount = 0;
  let totalMsgs  = 0;

  for (let t = 0; t < FORUM_THREADS.length; t++) {
    const thread      = FORUM_THREADS[t];
    const baseDay     = threadOffsets[t] || randomInt(1, 12);
    let   minOffset   = 0;

    for (let m = 0; m < thread.length; m++) {
      const msg = thread[m];
      const uid = userUids[msg.u];
      if (!uid) continue;

      minOffset += randomInt(90, 300);
      const ts = new Date(Date.now() - baseDay*24*60*60*1000 + minOffset*60*1000).toISOString();

      forumBatch.set(db.collection('forum').doc(), {
        user_id:      uid,
        username:     TEST_USERS[msg.u].username,
        photoDataUrl: TEST_USERS[msg.u].avatar,  // field name forum.html expects
        message:      msg.body,                  // field name forum.html expects
        thread_id:    'thread_' + t,
        reply_to:     m > 0 ? TEST_USERS[thread[m-1].u].username : null,
        created_at:   ts,
        likes:        randomInt(0, 18)
      });
      forumCount++; totalMsgs++;

      if (forumCount >= 400) {
        await forumBatch.commit();
        forumBatch = db.batch(); forumCount = 0;
        await sleep(300);
      }
    }
  }
  if (forumCount > 0) await forumBatch.commit();
  console.log('  ✅ ' + totalMsgs + ' forum messages written');

  // ══════════════════════════════════════════════════════════════
  // DONE — remind user to restore Firestore rules
  // ══════════════════════════════════════════════════════════════
  console.log('\n═══════════════════════════════════════════');
  console.log('✅ ' + totalCreated + '/10 users created');
  console.log('💬 ' + totalMsgs + ' forum messages');
  console.log('👑 Admin session:', firebase.auth().currentUser?.email);
  console.log('');
  console.log('⚠️  IMPORTANT: restore Firestore security rules now!');
  console.log('   responses → allow create: if request.auth != null && request.resource.data.user_id == request.auth.uid;');
  console.log('   users     → allow write:  if request.auth != null && request.auth.uid == userId;');
  console.log('═══════════════════════════════════════════');

})();
