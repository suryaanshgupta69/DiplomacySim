// ═══════════════════════════════════════════════════════════════
// DiplomacySim · Add Forum Replies
// Paste into DevTools console while signed in as admin.
// No rule changes needed — uses existing forum create rule.
// Takes ~1-2 minutes.
// ═══════════════════════════════════════════════════════════════

(async function() {

  const db    = firebase.firestore();
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  function randomInt(min, max) { return Math.floor(Math.random()*(max-min+1))+min; }

  // ── Load test user profiles to get their uid + avatar ─────────
  console.log('📡 Loading test user profiles…');
  const TEST_USERNAMES = [
    'Ambassador_Chen','General_Petrov','Minister_Okafor','Agent_Nakamura',
    'Director_Al-Rashid','Consul_Ferreira','Colonel_Andersen','Envoy_Kapoor',
    'Attaché_Müller','Secretary_Tanaka'
  ];
  const AVATARS = [
    'https://randomuser.me/api/portraits/men/32.jpg',
    'https://randomuser.me/api/portraits/men/54.jpg',
    'https://randomuser.me/api/portraits/men/76.jpg',
    'https://randomuser.me/api/portraits/women/44.jpg',
    'https://randomuser.me/api/portraits/men/11.jpg',
    'https://randomuser.me/api/portraits/women/62.jpg',
    'https://randomuser.me/api/portraits/men/88.jpg',
    'https://randomuser.me/api/portraits/women/29.jpg',
    'https://randomuser.me/api/portraits/men/67.jpg',
    'https://randomuser.me/api/portraits/women/8.jpg',
  ];

  // Fetch their uids from Firestore
  const userSnap = await db.collection('users')
    .where('username', 'in', TEST_USERNAMES.slice(0,10)).get();
  const userMap = {}; // username → { uid, avatar, photoDataUrl }
  userSnap.forEach(function(doc) {
    var d = doc.data();
    userMap[d.username] = {
      uid:      doc.id,
      username: d.username,
      photo:    d.photoDataUrl || d.avatar || AVATARS[TEST_USERNAMES.indexOf(d.username)] || ''
    };
  });
  console.log('✅ Loaded ' + Object.keys(userMap).length + ' user profiles');

  if (Object.keys(userMap).length < 3) {
    console.error('❌ Not enough test users found. Run create-test-users.js first.');
    return;
  }

  // Helper: pick user by username
  function user(name) { return userMap[name] || Object.values(userMap)[0]; }

  // ── Load existing top-level posts ─────────────────────────────
  console.log('📡 Loading existing forum posts…');
  // Fetch all forum docs, filter client-side — avoids composite index requirement
  const forumSnap2 = await db.collection('forum')
    .orderBy('created_at', 'asc')
    .limit(300).get();

  const topLevelPosts = [];
  forumSnap2.forEach(function(doc) {
    var d = doc.data();
    if (!d.parent_id) {
      topLevelPosts.push({ id: doc.id, data: d });
    }
  });

  console.log('✅ Found ' + topLevelPosts.length + ' top-level posts to reply to');
  if (topLevelPosts.length === 0) {
    console.error('❌ No top-level posts found. Run create-test-users.js first.');
    return;
  }

  // ── Reply conversation scripts ─────────────────────────────────
  // Keyed by the username of the original post author.
  // Falls back to generic replies if no match.
  const REPLY_SCRIPTS = {

    'General_Petrov': [
      { name: 'Colonel_Andersen',   body: 'Petrov, the surgical strike logic only holds if you have confirmed target locations. In that scenario the ISR window was 40 minutes — not enough for a clean BDA. Sanctions give you time to build the picture.' },
      { name: 'Ambassador_Chen',    body: 'Restraint is almost always the higher-scoring path in nuclear scenarios. The simulation penalises anything that could be read as first use, even pre-emptive.' },
      { name: 'General_Petrov',     body: 'I take the point on BDA. Still think there is a case for kinetic signalling that stops short of full strike. The game doesn\'t model that option well.' },
      { name: 'Director_Al-Rashid', body: 'The game models what policymakers actually face — the absence of a "clean" kinetic option is intentional. Every option with military action has downstream costs baked in.' },
      { name: 'Secretary_Tanaka',   body: 'From a UN perspective: the back-channel option also buys time for Security Council deliberation. That\'s often what actually defuses these situations historically.' },
    ],

    'Agent_Nakamura': [
      { name: 'Consul_Ferreira',    body: 'The attribution problem is the whole game in Cyber scenarios. I spent three playthroughs trying the "confident attribution" path and it reliably scores 20–30 points below the cautious route.' },
      { name: 'Agent_Nakamura',     body: 'Exactly. The trap is that confident attribution feels decisive. But the sim is modelling the political cost of getting it wrong — which is enormous.' },
      { name: 'Minister_Okafor',    body: 'Does anyone know if the scoring changes based on whether the attribution turns out to be correct? Or is it purely about the decision you make with the information given?' },
      { name: 'Agent_Nakamura',     body: 'Purely the decision. The game doesn\'t reveal ground truth. Which I think is pedagogically correct — you can only be judged on what you knew at the time.' },
      { name: 'Envoy_Kapoor',       body: 'That\'s consistent with how real post-incident reviews work. You\'re evaluated on the process, not just the outcome.' },
      { name: 'Attaché_Müller',     body: 'German doctrine on this is explicit: no public attribution without allied consensus. The game seems to reward that approach across the board.' },
    ],

    'Consul_Ferreira': [
      { name: 'Envoy_Kapoor',       body: 'The time multiplier completely changed how I play. I used to read every word carefully but that was costing me 40+ points per scenario.' },
      { name: 'Consul_Ferreira',    body: 'The brief is dense but front-loaded. Most of the analytical weight is in paragraphs one and three. Paragraph two is usually context you already know from the title.' },
      { name: 'General_Petrov',     body: 'I disagree on skipping paragraph two. In the military scenarios the operational context in the middle paragraph often reverses what the summary implies.' },
      { name: 'Ambassador_Chen',    body: 'Both are right depending on the theatre. For Historical Events and Current Affairs, front-load. For Intelligence & Espionage, read every word — the trap is always in the detail.' },
      { name: 'Secretary_Tanaka',   body: 'Good breakdown. I\'d add: for Humanitarian scenarios, the final paragraph almost always contains the key constraint (funding window, access corridor, diplomatic channel) that determines the best option.' },
    ],

    'Envoy_Kapoor': [
      { name: 'Attaché_Müller',     body: 'The ExComm comparison is apt. The scenario designers clearly drew on the transcripts. The "quarantine vs. strike" framing maps almost exactly onto the real October 22nd debate.' },
      { name: 'Envoy_Kapoor',       body: 'What I found striking is that the highest-scoring option isn\'t the one Kennedy actually chose — it\'s the one Adlai Stevenson advocated for and was dismissed for suggesting.' },
      { name: 'Ambassador_Chen',    body: 'That\'s deliberate I think. The game isn\'t just testing historical recall — it\'s asking you to evaluate the counterfactual. Would the "better" option have actually worked?' },
      { name: 'Minister_Okafor',    body: 'This is what makes it different from a quiz. A quiz would reward you for knowing what happened. This rewards you for understanding what should have happened given the information available.' },
    ],

    'Secretary_Tanaka': [
      { name: 'Consul_Ferreira',    body: 'I looked into that after seeing your post. The Lula government\'s FUNAI policy is almost verbatim in the scenario brief. Whoever wrote it is following real events closely.' },
      { name: 'Secretary_Tanaka',   body: 'The Rohingya scenario hit differently after I\'d been following the ICJ proceedings. The "refer to international mechanisms" option scores well but feels hollow given the timeline.' },
      { name: 'Director_Al-Rashid', body: 'I think that\'s the design intent. Some situations don\'t have satisfying answers. The game is honest about that in a way most educational tools aren\'t.' },
      { name: 'Envoy_Kapoor',       body: 'Agreed. The Environmental Crises theatre in particular seems designed to sit with you after you\'ve played it. The Amazon scenario ending stayed with me for days.' },
      { name: 'Colonel_Andersen',   body: 'Is there any plan to add more scenarios in that theatre? I\'ve worked through all eight environmental ones and want more.' },
    ],

    'Minister_Okafor': [
      { name: 'Agent_Nakamura',     body: 'Double-agent option in the Tbilisi scenario cost me 55 points on my first run. The brief mentioned "blown NOC cover" in the second paragraph and I read straight past it.' },
      { name: 'Minister_Okafor',    body: 'The tells are always there. The game never makes it unfair — it makes it easy to miss if you\'re going fast. Deliberate pacing.' },
      { name: 'Colonel_Andersen',   body: 'Military intelligence doctrine: never run a source you can\'t burn. The game rewards that principle in every espionage scenario I\'ve played.' },
      { name: 'General_Petrov',     body: 'Starting with Option D is counterintuitive but I\'ve been doing the same thing. In this theatre it\'s the path most players overlook and the designers know it.' },
    ],

    'Ambassador_Chen': [
      { name: 'Envoy_Kapoor',       body: 'The WTO critique is fair but I think it reflects the actual normative position — what multilateral frameworks are designed to achieve, not what they currently manage to achieve.' },
      { name: 'Ambassador_Chen',    body: 'Exactly right. The game is training people on what good decision-making looks like within the framework. Whether the framework delivers is a separate question.' },
      { name: 'Minister_Okafor',    body: 'From an African trade perspective: the WTO scenarios actually frustrate me for the opposite reason. They don\'t capture how developing nations are systematically disadvantaged in those negotiations.' },
      { name: 'Secretary_Tanaka',   body: 'That\'s a real limitation. The scenarios are generally strong but they do tend to model decisions from a Global North institutional vantage point.' },
      { name: 'Consul_Ferreira',    body: 'Worth flagging to whoever maintains the scenario library. More perspectives from the Global South would genuinely improve the depth of the simulation.' },
      { name: 'Director_Al-Rashid', body: 'Seconded. The Gulf economic scenarios have similar gaps — the energy geopolitics are modelled from a consumer/importer perspective rather than a producer one.' },
      { name: 'Ambassador_Chen',    body: 'These are excellent points for feedback. The historical and fictional scenarios have more variety in perspective. The current affairs ones are where the bias shows most.' },
    ],
  };

  // Generic fallback replies for posts without a specific script
  const GENERIC_REPLIES = [
    [
      { name: 'Colonel_Andersen',   body: 'Good point. The scoring in that scenario surprised me too — I expected the hard-line option to score higher given the context.' },
      { name: 'Envoy_Kapoor',       body: 'The game consistently rewards restraint over escalation. Once you internalise that, the "surprising" outcomes start to feel inevitable.' },
    ],
    [
      { name: 'Director_Al-Rashid', body: 'Interesting take. I had a completely different read on that scenario — which I think shows how much the framing matters in these briefings.' },
      { name: 'Attaché_Müller',     body: 'The framing is doing a lot of work. I\'ve replayed several scenarios after reading the sources they\'re based on and it changes everything.' },
    ],
    [
      { name: 'Agent_Nakamura',     body: 'This. Reading between the lines of the brief is the core skill. The surface narrative is almost always misleading.' },
      { name: 'Minister_Okafor',    body: 'Agreed. The scenarios that punish you most are the ones where the obvious answer is obviously wrong. You have to slow down enough to notice.' },
    ],
    [
      { name: 'Consul_Ferreira',    body: 'Really appreciate this breakdown. Changed my approach on the whole theatre going forward.' },
      { name: 'Secretary_Tanaka',   body: 'Same here. This forum has genuinely improved my scores — the collective strategy discussion is as valuable as playing the scenarios themselves.' },
    ],
  ];

  // ── Write replies ─────────────────────────────────────────────
  console.log('\n💬 Writing replies…');
  let batch = db.batch();
  let count = 0;
  let total = 0;

  for (var p = 0; p < topLevelPosts.length; p++) {
    var post       = topLevelPosts[p];
    var postAuthor = post.data.username || '';
    var postTime   = new Date(post.data.created_at || Date.now()).getTime();

    // Pick reply script: author-specific or generic (cycle through generics)
    var script = REPLY_SCRIPTS[postAuthor] || GENERIC_REPLIES[p % GENERIC_REPLIES.length];
    if (!script || script.length === 0) continue;

    // Only add replies if this post doesn't already have many
    var existingReplySnap = await db.collection('forum')
      .where('parent_id', '==', post.id).get();
    if (!existingReplySnap.empty) {
      console.log('  ⏭️  Skipping "' + postAuthor + '" — already has replies');
      continue;
    }

    var minuteOffset = randomInt(30, 120); // first reply 30-120 min after post

    for (var r = 0; r < script.length; r++) {
      var reply    = script[r];
      var replyUser = user(reply.name);
      if (!replyUser || !replyUser.uid) continue;

      minuteOffset += randomInt(20, 90); // each reply 20-90 min after previous
      var replyTime = new Date(postTime + minuteOffset * 60 * 1000).toISOString();

      batch.set(db.collection('forum').doc(), {
        user_id:      replyUser.uid,
        username:     replyUser.username,
        photoDataUrl: replyUser.photo,
        message:      reply.body,
        parent_id:    post.id,
        created_at:   replyTime
      });
      count++; total++;

      if (count >= 400) {
        await batch.commit();
        console.log('  📦 Batch flushed');
        batch = db.batch(); count = 0;
        await sleep(300);
      }
    }

    console.log('  ✅ Added ' + script.length + ' replies to ' + (postAuthor || 'post'));
    await sleep(200);
  }

  if (count > 0) await batch.commit();

  console.log('\n═══════════════════════════════════════════');
  console.log('✅ ' + total + ' replies written across ' + topLevelPosts.length + ' posts');
  console.log('🔄 Refresh the forum page to see threaded conversations');
  console.log('═══════════════════════════════════════════');

})();
