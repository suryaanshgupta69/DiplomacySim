// ═══════════════════════════════════════════════════════════════
// DiplomacySim · BATCH SCENARIO UPLOAD
// ═══════════════════════════════════════════════════════════════
// 15 new scenarios across 5 theatres:
//   Historical Events    × 4
//   Fictional Scenarios  × 1
//   Global Diplomacy     × 3
//   Nuclear Brinkmanship × 4
//   Humanitarian & Human Rights × 3
//
// Paste into DevTools console on admin.html while signed in as admin.
// ═══════════════════════════════════════════════════════════════

(async function () {
  const db = firebase.firestore();

  const scenarios = [

    // ─────────────────────────────────────────────────────────────
    // HISTORICAL EVENTS × 4
    // ─────────────────────────────────────────────────────────────

    {
      category:    "Historical Events",
      title:       "The Berlin Airlift: Feeding a Blockaded City",
      difficulty:  "Medium",
      description: "It is June 1948. The Soviet Union has sealed all land and water routes into West Berlin, cutting off two million civilians from food, fuel, and medicine. The Western Allies face a stark choice: force their way through the blockade by land — risking open war — or attempt to supply the city entirely by air, an operation with no historical precedent at this scale. Your advisers are divided. The military estimates the city needs 4,500 tonnes of supplies per day; current airlift capacity is barely 700. Winter is months away.",
      question:    "As the Allied commander, what is your primary response to the Soviet blockade?",
      optionA:     "Launch a full-scale airlift immediately, requesting maximum military and civilian aircraft from the US, UK, and Canada to sustain West Berlin indefinitely.",
      optionB:     "Send a small armed convoy down the Autobahn to test Soviet resolve and negotiate simultaneously, using the threat of escalation as leverage.",
      optionC:     "Propose a four-power conference to resolve the Berlin question diplomatically before committing to any action that could trigger war.",
      optionD:     "Withdraw Allied forces from West Berlin, accepting that an isolated outpost inside Soviet territory is strategically untenable.",
      impactA:     "Operation Vittles becomes the largest humanitarian airlift in history. Over 11 months, Allied aircraft make 278,000 flights and deliver 2.3 million tonnes of supplies. The Soviets lift the blockade in May 1949, having gained nothing. West Berlin becomes a symbol of Western resolve that shapes the Cold War for decades.",
      impactB:     "The convoy reaches a Soviet checkpoint and halts. The standoff lasts three days before a diplomatic back-channel defuses it. The Soviets tighten other restrictions in response. The ambiguity of the outcome satisfies neither side and leaves Berlin's status more precarious than before.",
      impactC:     "The Soviets agree to talks but use the delay to consolidate the blockade. Six weeks of negotiations produce no agreement. West Berliners begin rationing. The window for a decisive airlift response narrows as public morale in the city deteriorates.",
      impactD:     "Allied withdrawal triggers a political crisis in Western Europe. The credibility of the US security guarantee collapses. France accelerates its own independent nuclear programme. The message sent to Moscow — that the West will not hold exposed positions — shapes Soviet strategy for the next decade.",
      pointsA:     90,
      pointsB:     45,
      pointsC:     30,
      pointsD:     5,
      imageUrl:    null,
      createdAt:   new Date().toISOString()
    },

    {
      category:    "Historical Events",
      title:       "Suez 1956: Britain's Imperial Gamble",
      difficulty:  "Hard",
      description: "It is July 1956. Egyptian President Nasser has nationalised the Suez Canal, seizing an asset that Britain and France regard as vital to their global trade and prestige. Prime Minister Eden believes Nasser is 'another Hitler' and that appeasement is impossible. The US under Eisenhower has privately signalled it will not support military action. Israel is prepared to attack Egypt's Sinai if offered air cover. British public opinion is divided; the Commonwealth is sceptical; the UN Security Council is deadlocked. Your advisers say a window for military action exists — but it closes within weeks as the canal continues to function and international patience hardens.",
      question:    "As Prime Minister Eden, how do you respond to Nasser's nationalisation of the Suez Canal?",
      optionA:     "Proceed with the secret Sèvres Protocol: coordinate with France and Israel for Israel to attack Egypt, then intervene as 'peacekeepers' to occupy the canal zone.",
      optionB:     "Pursue the US-backed SCUA plan — an international users' association to manage the canal — and accept reduced British leverage in exchange for American support.",
      optionC:     "Refer the matter to the UN Security Council and accept whatever resolution emerges, using the process to build international legitimacy for future action.",
      optionD:     "Recognise Egyptian sovereignty over the canal in exchange for guaranteed passage rights and compensation for British shareholders, and move on.",
      impactA:     "The military operation succeeds initially but the political consequences are catastrophic. The US threatens to sell sterling reserves, triggering a currency crisis. Britain and France are forced to halt the operation within days. Eden resigns in January 1957. The Suez crisis marks the definitive end of British imperial power and accelerates Nasser's standing across the Arab world.",
      impactB:     "The SCUA proposal limps along for months without Egyptian participation. Nasser operates the canal without incident, undermining the case for intervention. Britain retains US goodwill but is widely seen as having been humiliated without a fight. The canal question fades; the broader question of British strategic relevance does not.",
      impactC:     "The Security Council debate is vetoed by the Soviet Union and goes nowhere. International attention moves on. Nasser solidifies his position. Britain has traded action for legitimacy and received neither. The option of negotiating from strength is now closed.",
      impactD:     "The settlement is attacked by the Conservative right as capitulation. Eden's government survives but is weakened. However, Britain maintains the transatlantic relationship, avoids a currency crisis, and retains credibility in the Commonwealth. In retrospect, the least costly outcome — though not the one sought.",
      pointsA:     15,
      pointsB:     55,
      pointsC:     35,
      pointsD:     75,
      imageUrl:    null,
      createdAt:   new Date().toISOString()
    },

    {
      category:    "Historical Events",
      title:       "Rwandan Genocide: The UN's 100 Days",
      difficulty:  "Hard",
      description: "It is April 7, 1994 — one day after the Rwandan president's plane was shot down. General Roméo Dallaire, commanding the UN peacekeeping mission UNAMIR, has warned New York for months that Hutu extremists are planning mass killings of Tutsis. His request to raid weapons caches was denied. The killing has now begun. Dallaire believes 2,500 well-equipped troops could stop the genocide. The US, still reeling from Somalia, is applying pressure to withdraw all UN forces. Ten Belgian peacekeepers have been killed and Belgium is pulling out. The Security Council is paralysed. You are the UN Secretary-General's special representative. You have 72 hours before the international community makes its decision.",
      question:    "With Security Council consensus impossible, what do you recommend to the Secretary-General?",
      optionA:     "Recommend that Dallaire use existing UNAMIR forces to establish protected zones for civilians in Kigali, accepting casualties and acting without explicit Security Council authorisation.",
      optionB:     "Pursue an emergency Security Council session to pass a resolution authorising a reinforced mandate, buying time while making the political cost of inaction explicit.",
      optionC:     "Accept the US position: recommend an orderly withdrawal of UNAMIR to protect remaining peacekeepers, and issue a strong public condemnation of the violence.",
      optionD:     "Recommend a unilateral ceasefire appeal to both sides, backed by a threat of targeted sanctions against Hutu extremist leadership, without deploying additional troops.",
      impactA:     "Dallaire establishes zones that shelter tens of thousands. He is court-martialled in all but name by New York for exceeding his mandate. The zones hold in some areas and collapse in others. Approximately 300,000 lives are saved compared to the actual outcome, but 500,000 still die. The action establishes a precedent for commanders acting on conscience — later cited in debates over the Responsibility to Protect.",
      impactB:     "The Security Council session is called but the US refuses additional troops and the UK abstains. A weak resolution passes authorising a reduced mission. The delay costs three weeks. By the time a reinforced force is authorised in May, the killing has reached its peak. The political cost of inaction is documented but not translated into action in time.",
      impactC:     "UNAMIR withdraws. The genocide kills approximately 800,000 people in 100 days. Dallaire's later testimony devastates the credibility of the UN system. The withdrawal is cited as one of the defining moral failures of twentieth-century international institutions. Clinton later calls it one of his greatest regrets.",
      impactD:     "The ceasefire appeal is ignored by Interahamwe militias who have no interest in negotiation. Sanctions require Security Council agreement — which the US blocks. The appeal is seen as a face-saving gesture that changes nothing on the ground. The killing continues uninterrupted.",
      pointsA:     80,
      pointsB:     50,
      pointsC:     5,
      pointsD:     20,
      imageUrl:    null,
      createdAt:   new Date().toISOString()
    },

    {
      category:    "Historical Events",
      title:       "The Marshall Plan: America's Postwar Bet",
      difficulty:  "Medium",
      description: "It is May 1947. Europe lies devastated. Industrial production across the continent is at a fraction of pre-war levels. Severe food shortages have left populations malnourished. Communist parties are gaining ground rapidly in France and Italy. Secretary of State George Marshall has drafted a proposal to offer $13 billion (equivalent to $150 billion today) in economic aid to rebuild European economies — with the condition that recipients coordinate their recovery plans and that American goods flow in. The US Congress is sceptical of the cost. The Soviet Union has been offered participation and its response is awaited. Stalin's foreign minister Molotov is in Paris. Your task is to finalise the terms.",
      question:    "As the State Department official finalising the Marshall Plan terms, how do you structure the offer?",
      optionA:     "Present the plan with strict coordination requirements and open books — all recipients must share economic data and submit joint recovery plans, making Soviet participation effectively impossible given their secrecy requirements.",
      optionB:     "Make the offer genuinely open to the Soviet Union with minimal coordination requirements, accepting the political risk of USSR participation in exchange for diplomatic legitimacy.",
      optionC:     "Offer bilateral deals to individual European nations, bypassing the multilateral framework to speed disbursement and reduce the coordination burden.",
      optionD:     "Scale back the aid package to $5 billion to ensure Congressional passage, accepting a slower European recovery in exchange for domestic political sustainability.",
      impactA:     "The coordination requirements cause the Soviets to withdraw and pressure Eastern European states to reject the plan. This backfires diplomatically but succeeds strategically: Western European nations integrate their economies, industrial production exceeds pre-war levels by 1952, and the political left loses ground in France and Italy. The plan is later credited with creating the conditions for NATO and the EEC.",
      impactB:     "Soviet participation creates immediate Congressional opposition. Several Republican senators move to block funding entirely, arguing the US is rebuilding a potential enemy. The plan passes in a diluted form eighteen months later. The delay costs Western Europe a critical winter and allows Communist parties to consolidate further.",
      impactC:     "Bilateral deals move faster but produce uncoordinated recovery plans. West Germany and France pursue incompatible industrial strategies. The absence of a multilateral framework means no common market emerges. European recovery proceeds but the political architecture that prevents future war — the EEC, the OECD — does not.",
      impactD:     "The reduced package passes Congress easily but is insufficient to prevent economic collapse in Greece and Turkey. The Truman Doctrine must be invoked as a stopgap. Stalin interprets the scaled-back offer as a sign of American retrenchment and moves more aggressively in Czechoslovakia. The Iron Curtain falls faster than the historical timeline.",
      pointsA:     85,
      pointsB:     40,
      pointsC:     50,
      pointsD:     25,
      imageUrl:    null,
      createdAt:   new Date().toISOString()
    },

    // ─────────────────────────────────────────────────────────────
    // FICTIONAL SCENARIOS × 1
    // ─────────────────────────────────────────────────────────────

    {
      category:    "Fictional Scenarios",
      title:       "The Adrion Accords: Brokering Peace on a Fractured Continent",
      difficulty:  "Hard",
      description: "The Republic of Valcourt and the Federated States of Ostmark have been at war for eleven years over the Adrion Basin — a disputed mineral-rich region claimed by both nations. Three million people have been displaced. A fragile ceasefire is now in its seventh month, brokered by the neutral city-state of Meridenne. You are the lead mediator from the International Conciliation Bureau. Both delegations are in the same building for the first time. The Valcourt delegation insists on sovereignty over the entire basin as a precondition for any agreement. Ostmark demands a referendum — which polling suggests they would lose — before any territorial settlement. A hardline faction in Valcourt's military is publicly threatening to resume hostilities if the talks produce 'concessions'. The ceasefire expires in nine days.",
      question:    "As lead mediator with nine days until the ceasefire expires, what is your primary negotiating strategy?",
      optionA:     "Propose a shared sovereignty framework: both nations co-administer the Adrion Basin under an international oversight commission for twenty years, with full sovereignty status reviewed by referendum at the end of the period.",
      optionB:     "Separate the delegations into parallel working groups focused on economic arrangements — revenue-sharing from mineral extraction — rather than sovereignty, deferring the territorial question to a later stage.",
      optionC:     "Invite a third-party guarantor nation to provide security forces in the basin as a buffer, allowing both sides to step back from the sovereignty question without formally conceding it.",
      optionD:     "Present both delegations with a detailed cost analysis of resumed conflict — economic, demographic, and reputational — and issue a public deadline: if no framework is agreed in seven days, the ICB withdraws its mediation entirely.",
      impactA:     "The shared sovereignty proposal is initially rejected by Valcourt but survives as a working draft. After six days of intense negotiation, a modified version is accepted: joint administration for fifteen years, with a binding arbitration clause replacing the referendum. The military hardliners in Valcourt denounce it but lack the political support to resume war. The Adrion Accords are signed. Implementation is imperfect but the killing stops.",
      impactB:     "The economic working groups make rapid progress and build an unexpected working relationship between the two finance ministers. However, the unresolved sovereignty question allows Valcourt's military faction to characterise any deal as a sellout. When the full agreement is eventually presented, it collapses at ratification. The ceasefire is extended by sixty days but no final agreement is reached during your tenure.",
      impactC:     "Neither side accepts a third-party military presence on what each considers their sovereign territory. The proposal is read as an implicit acknowledgement that neither side can win, which hardens domestic opposition in both capitals. The talks break down on day six. The ceasefire lapses. Hostilities resume at a lower intensity, producing a frozen conflict that persists for another decade.",
      impactD:     "The public deadline galvanises both delegations — but not in the intended direction. Ostmark leaks the ultimatum to the press, framing it as ICB pressure to accept Valcourt's terms. Public opinion in Ostmark hardens. The Valcourt military faction uses the leak to justify a hardline posture. You are forced to retract the deadline on day five. The ICB's credibility as a neutral broker is damaged.",
      pointsA:     85,
      pointsB:     55,
      pointsC:     30,
      pointsD:     20,
      imageUrl:    null,
      createdAt:   new Date().toISOString()
    },

    // ─────────────────────────────────────────────────────────────
    // GLOBAL DIPLOMACY × 3
    // ─────────────────────────────────────────────────────────────

    {
      category:    "Global Diplomacy",
      title:       "The Arctic Council Impasse: Sovereignty Over Melting Ice",
      difficulty:  "Medium",
      description: "The retreat of Arctic sea ice has opened previously inaccessible shipping lanes and exposed vast untapped hydrocarbon reserves beneath the seabed. Five Arctic coastal states — Russia, Canada, the United States, Norway, and Denmark (via Greenland) — have overlapping territorial claims that existing international law does not clearly resolve. Russia has planted a titanium flag on the seabed beneath the North Pole. Canada is asserting exclusive control over the Northwest Passage. The Arctic Council is meeting in emergency session. You represent a major non-Arctic state with significant shipping interests. Three Arctic members have approached you privately: Russia wants a bilateral deal; Canada wants multilateral arbitration; the US wants the status quo preserved indefinitely.",
      question:    "As a non-Arctic state with shipping interests, how do you engage with the Arctic sovereignty dispute?",
      optionA:     "Support Canada's call for binding UNCLOS arbitration, aligning with the rules-based framework even at the cost of antagonising Russia and potentially slowing access to Arctic routes.",
      optionB:     "Accept Russia's bilateral offer: negotiate guaranteed access to the Northern Sea Route in exchange for quiet support for Russia's expanded continental shelf claim.",
      optionC:     "Propose a new multilateral Arctic treaty modelled on the Antarctic Treaty — internationalising the region and removing military and sovereign claims — and build a coalition of non-Arctic states to pressure the five coastal nations.",
      optionD:     "Publicly support the status quo as recommended by the US, maintaining existing relationships while investing privately in Arctic shipping infrastructure to lock in commercial advantage regardless of the sovereignty outcome.",
      impactA:     "The UNCLOS arbitration path is accepted by four of the five Arctic states; Russia refuses and begins asserting exclusive claims over disputed lanes unilaterally. The legal process takes eight years. In the interim, your shipping companies are denied Northern Sea Route access. The rules-based outcome eventually prevails but at significant near-term commercial cost.",
      impactB:     "The bilateral deal delivers ten years of preferential access to the Northern Sea Route. However, when the arrangement becomes public — as it does — it is seen as legitimising Russian territorial expansion. Two allied governments demand you withdraw from the agreement. The commercial gain is real but the diplomatic cost proves higher than anticipated.",
      impactC:     "The Antarctic Treaty model gains traction among 34 non-Arctic states and generates significant diplomatic attention. However, all five coastal nations oppose it. The coalition lacks the leverage to compel their participation. The proposal dies in committee but establishes your state as a principled advocate for international governance — a reputational asset that pays dividends in other multilateral forums.",
      impactD:     "The status quo position preserves all existing relationships at zero political cost. Your shipping companies continue operating through southern routes at higher cost. Five years later, when Russia and Canada reach a bilateral maritime boundary deal that excludes non-Arctic states from key lanes, you have no leverage and no prior investment in the outcome. The cost of inaction compounds.",
      pointsA:     70,
      pointsB:     40,
      pointsC:     60,
      pointsD:     30,
      imageUrl:    null,
      createdAt:   new Date().toISOString()
    },

    {
      category:    "Global Diplomacy",
      title:       "The Sanctions Dilemma: When Pressure Becomes Collective Punishment",
      difficulty:  "Hard",
      description: "A major regional power has conducted a series of political assassinations of opposition figures abroad and is credibly accused of supplying weapons to a non-state actor responsible for civilian massacres in a neighbouring conflict. The UN Security Council has imposed targeted sanctions on named individuals. Your government is being pressed by allies to go further: secondary sanctions that would cut the country's economy off from the global financial system. Your own intelligence assessment says the regime is stable and will not be destabilised by economic pressure alone. The country's civilian population is already experiencing significant hardship. Three allies have sent private messages: they will follow your lead, whatever you decide.",
      question:    "How do you respond to allied pressure to impose broad secondary sanctions?",
      optionA:     "Implement targeted 'smart sanctions' — expand the list of sanctioned individuals, freeze specific state assets tied to the weapons programme, and deny visas to senior officials — without applying broad economic measures.",
      optionB:     "Join the allied coalition in imposing full secondary sanctions, including financial system exclusion, accepting the humanitarian cost in order to maintain alliance cohesion and maximise economic pressure.",
      optionC:     "Negotiate a conditional framework: offer a twelve-month suspension of any new sanctions in exchange for verifiable steps — a ceasefire in the conflict zone, a halt to assassinations — with automatic escalation if conditions are breached.",
      optionD:     "Oppose secondary sanctions publicly and call for a humanitarian exemption framework within the existing UN sanctions regime, breaking with your allies on this issue but building credibility with non-aligned states.",
      impactA:     "The targeted measures are legally precise and harder to evade than blanket sanctions. The named individuals lose access to property and financial services in twenty-eight jurisdictions. The regime continues, but the weapons programme is disrupted when three procurement front companies are shut down. Three allies are disappointed but accept the outcome; two follow your model rather than applying full secondary sanctions.",
      impactB:     "The secondary sanctions are imposed. The regime's GDP contracts 18% over two years. The civilian population bears the brunt: food imports fall by 30%, hospital supplies are delayed. The regime blames the West and tightens internal repression. The assassinations continue. Humanitarian organisations report a crisis. You are asked in Parliament to justify the civilian cost.",
      impactC:     "The conditional framework is accepted as a negotiating framework after three weeks of back-channel discussion. A ceasefire in the conflict zone holds for four months before collapsing. The automatic escalation clause is triggered but by then the political moment for maximum pressure has passed. The outcome is ambiguous — less harm than full sanctions, less deterrence than hoped.",
      impactD:     "Your public opposition fractures the allied coalition. Two partners proceed with sanctions without you; one follows your lead. The humanitarian exemption framework is adopted in modified form at the Security Council. You gain credibility among the G77 but are seen by core allies as an unreliable partner. The reputational trade-off plays out across three subsequent multilateral negotiations.",
      pointsA:     80,
      pointsB:     35,
      pointsC:     65,
      pointsD:     45,
      imageUrl:    null,
      createdAt:   new Date().toISOString()
    },

    {
      category:    "Global Diplomacy",
      title:       "The Strait Incident: Navigating Freedom of Navigation",
      difficulty:  "Medium",
      description: "A naval vessel from your country was conducting a freedom of navigation operation through an internationally recognised strait when it was intercepted by two patrol boats from a coastal state that claims the strait as internal waters. The crew of twelve was detained. Your country does not recognise the coastal state's claim and international law — specifically UNCLOS — supports your position. However, the coastal state is an important trade partner, hosts a military base your forces use, and is in the middle of its own domestic political crisis. The detained crew is unharmed but being held at an undisclosed location. Allied governments are watching how you respond. The incident is not yet public.",
      question:    "With the crew detained and the incident still unpublicised, how do you respond in the first 48 hours?",
      optionA:     "Issue an immediate public statement asserting the crew's rights under international law, demanding their release within 24 hours, and dispatching two additional naval vessels to the strait.",
      optionB:     "Engage privately through the diplomatic channel: contact the coastal state's foreign minister directly, seek assurances on crew welfare, and negotiate a quiet release in exchange for a mutual agreement to de-escalate.",
      optionC:     "Refer the incident to the International Maritime Organization and the UN Secretary-General, creating an international record and building multilateral pressure without a direct bilateral confrontation.",
      optionD:     "Accept a face-saving formula: your government privately acknowledges the sensitivity of the transit, the coastal state releases the crew and describes them as 'guests', and both sides agree not to publicise the incident.",
      impactA:     "The public statement and naval dispatch produce a rapid result: the crew is released within 36 hours as the coastal state backs down under international scrutiny. However, the base agreement is suspended for review, three trade negotiations are put on hold, and the coastal state's domestic hardliners use the confrontation to strengthen their position. The principle is upheld; the relationship is damaged.",
      impactB:     "Private diplomacy secures the crew's release within 72 hours with no conditions. The foreign minister confirms it as a miscommunication. The trade relationship and base agreement are preserved. The coastal state's government, grateful for discretion during its domestic crisis, proves cooperative in three subsequent negotiations. This is the outcome that best balances principle and interest.",
      impactC:     "The IMO referral creates a formal record but the process moves slowly. The crew is held for eleven days while the international machinery deliberates. Domestic pressure builds for a stronger response. When the release finally comes — through a separate bilateral channel — it is seen as a diplomatic failure dressed up as a legal victory.",
      impactD:     "The face-saving formula gets the crew home in 48 hours. But the coastal state's hardliners leak a version of the agreement that makes it appear your government conceded the legal point. Parliament demands a statement. You are forced to publicly deny having conceded anything — which technically you didn't, but the ambiguity of the private understanding means the denial is questioned. The worst outcome: diplomatic cost without clarity.",
      pointsA:     50,
      pointsB:     90,
      pointsC:     35,
      pointsD:     25,
      imageUrl:    null,
      createdAt:   new Date().toISOString()
    },

    // ─────────────────────────────────────────────────────────────
    // NUCLEAR BRINKMANSHIP × 4
    // ─────────────────────────────────────────────────────────────

    {
      category:    "Nuclear Brinkmanship",
      title:       "Able Archer 83: When a War Game Almost Became a War",
      difficulty:  "Hard",
      description: "It is November 1983. NATO is conducting Able Archer 83, a command-post exercise simulating escalation to nuclear war. Soviet intelligence, already at a heightened state of alert following the shoot-down of KAL 007 and the deployment of US Pershing II missiles in Europe, has misread the exercise as preparation for an actual nuclear first strike. KGB intercepts indicate Soviet nuclear forces have been placed on an elevated alert status — bombers are being loaded with weapons and submarines are moving to launch positions. A British intelligence asset inside Soviet intelligence has passed a warning to MI6: Moscow genuinely believes it may be under imminent attack. Your advisers are divided: some say the intelligence is exaggerated; others say it is the most dangerous moment since the Cuban Missile Crisis.",
      question:    "As the NATO Supreme Allied Commander, what do you do with this intelligence during the exercise?",
      optionA:     "Continue the exercise exactly as planned — halting or modifying it would signal weakness and confirm to Soviet hard-liners that NATO's exercises are limited by fear of Soviet reaction.",
      optionB:     "Quietly modify the exercise: reduce the number of participating nations, cancel the simulated nuclear release phase, and extend the timeline — making it less realistic and less alarming without publicly acknowledging the reason.",
      optionC:     "Terminate the exercise immediately and request an urgent private back-channel communication with Soviet military leadership to clarify that Able Archer is not a cover for a real strike.",
      optionD:     "Brief allied heads of government and request a presidential call to Moscow — putting the de-escalation at the political level rather than the military level.",
      impactA:     "The exercise proceeds. Soviet forces remain at elevated alert for its duration. Two Soviet nuclear-armed aircraft are scrambled to the border of NATO airspace before being recalled. The world comes closer to accidental nuclear war than at any point since 1962. The full extent of the danger is not known until classified documents are declassified decades later.",
      impactB:     "The quiet modifications reduce the alarm in Moscow. The exercise concludes without incident. The Soviet alert status is stood down. The intelligence asset's warning is later cited as one of the most consequential intelligence reports of the Cold War. The de-escalation succeeds without either side having to publicly acknowledge the crisis — the ideal outcome.",
      impactC:     "The termination of the exercise is leaked by a disgruntled NATO official. Soviet state media announces that the West 'blinked'. The political cost is significant in domestic politics on both sides. However, the direct communication with Soviet military leadership establishes a working back-channel that proves useful in the arms control negotiations of 1985–1987.",
      impactD:     "The presidential call reaches Moscow but is handled by an acting foreign minister during a period of Soviet leadership transition. The message is received but the chain of communication is slow. Soviet forces remain at elevated alert for four more days before standing down. The political intervention succeeds but more slowly than the military back-channel option would have.",
      pointsA:     5,
      pointsB:     90,
      pointsC:     60,
      pointsD:     70,
      imageUrl:    null,
      createdAt:   new Date().toISOString()
    },

    {
      category:    "Nuclear Brinkmanship",
      title:       "The Pakistani Dilemma: Ally with Nuclear Secrets",
      difficulty:  "Hard",
      description: "Intelligence agencies have confirmed that a Pakistani nuclear scientist with access to weapons designs has made contact with representatives of two non-state organisations — one a militant group operating in central Asia, the other an unidentified broker. The scientist has not transferred any material but the contacts are ongoing. Pakistan is a formal ally in the current counter-terrorism campaign, hosts critical military transit routes, and its government has cooperated — imperfectly — on nuclear security. Confronting Pakistan directly risks the transit routes and a government crisis in Islamabad. Saying nothing risks catastrophic proliferation. Three options are on the table before the National Security Council meets in two hours.",
      question:    "As National Security Adviser, what do you recommend to the President?",
      optionA:     "Present the intelligence directly to the Pakistani army chief in a private meeting, making clear the US expects the scientist to be immediately removed from his post and monitored, without making any public statement.",
      optionB:     "Conduct a unilateral covert operation to surveil the scientist and intercept any transfer attempt, without informing Pakistan, to preserve operational security and avoid compromising the intelligence source.",
      optionC:     "Raise the issue through formal diplomatic channels — ambassador to foreign minister — triggering the standard bilateral nuclear security consultation framework, accepting that Pakistan will manage the response at its own pace.",
      optionD:     "Brief key allies — UK, France, Israel — and build a multilateral dossier before approaching Pakistan, maximising pressure but increasing the number of parties who know about the intelligence source.",
      impactA:     "The army chief acts within 48 hours: the scientist is placed under surveillance, his access is revoked, and the contacts cease. Pakistan does not publicise the intervention. The transit routes remain open. The intelligence source is protected. Six months later, the same army chief cooperates on a second proliferation matter — the relationship of trust established in this intervention proves durable.",
      impactB:     "The covert surveillance operation is partially detected by Pakistani intelligence. Islamabad protests the violation of sovereignty and suspends transit route cooperation for three months. The scientist's contacts are not interdicted in time — he passes a document, later recovered, before the operation can act. The unilateral approach fails on both dimensions: alliance and security.",
      impactC:     "The formal diplomatic channel triggers an internal Pakistani review process that takes six weeks. During that time, the scientist makes a second contact. The formal framework produces a result but too slowly for the urgency of the threat. Pakistan later claims the formal channel shows the US trusted its institutions — a useful political point, but one that cost six weeks of exposure.",
      impactD:     "The multilateral briefing is contained for nine days before the intelligence is leaked by a European partner. Pakistani intelligence traces the leak and identifies the source within the agency — an asset who is subsequently killed. The proliferation threat is neutralised but the intelligence loss is catastrophic. Never share a source you are not prepared to burn.",
      pointsA:     90,
      pointsB:     20,
      pointsC:     50,
      pointsD:     10,
      imageUrl:    null,
      createdAt:   new Date().toISOString()
    },

    {
      category:    "Nuclear Brinkmanship",
      title:       "Second Strike Doctrine: Rethinking Deterrence",
      difficulty:  "Medium",
      description: "Your country's Nuclear Posture Review is underway. A faction within the defence establishment is pushing for a significant shift: moving from a 'launch on warning' posture — retaliating before incoming missiles land — to a 'second strike only' doctrine, meaning your country would absorb a nuclear first strike before retaliating. Advocates argue it removes the danger of accidental nuclear war triggered by false alarms, of which there have been three documented near-misses in the past decade. Opponents argue it invites a first strike by signalling that retaliation is not guaranteed. Allies are divided. Two of your NATO partners have privately said they would feel less secure under a no-first-use, second-strike-only framework.",
      question:    "As the senior defence official drafting the Nuclear Posture Review, what posture do you recommend?",
      optionA:     "Recommend adopting a formal 'sole purpose' doctrine: nuclear weapons will only be used to deter or respond to nuclear attacks, removing the option of nuclear first use against conventional threats.",
      optionB:     "Maintain the existing 'launch on warning' posture but invest heavily in improving the false alarm prevention systems — better sensors, longer verification windows, dual-person authorisation — without changing the doctrine.",
      optionC:     "Adopt a 'no first use' pledge as official policy while keeping launch-on-warning capability operationally in place, using the declaratory policy to signal restraint without actually reducing capability.",
      optionD:     "Recommend reducing the nuclear arsenal and extending the decision timeline to 72 hours minimum, explicitly removing the launch-on-warning option and accepting higher risk in exchange for greater stability.",
      impactA:     "The sole purpose doctrine is adopted. Two allies publicly welcome it. One ally activates a clause in its bilateral treaty requesting reassurance consultations. Russia's initial response is sceptical but arms control talks resume on a more productive basis within eighteen months. The long-term stability gain is real; the short-term alliance management cost is manageable.",
      impactB:     "The improved systems — particularly the upgraded early warning satellites and the extended verification window — reduce the false alarm risk substantially. Three allies remain comfortable. Russia interprets the investment as preparation for enhanced first-strike capability and accelerates its own modernisation. The safety gain is real; the strategic stability effect is ambiguous.",
      impactC:     "The declaratory / operational gap is identified within six months by two analytical organisations that publish detailed assessments. Adversaries discount the pledge as meaningless. Allies who wanted reassurance get none because the operational posture is unchanged. Critics at home call it dishonest. The worst outcome: the costs of change without the benefits.",
      impactD:     "The 72-hour minimum decision timeline is described by one ally as 'unilateral disarmament' and the domestic political reaction forces a partial rollback within a year. The reduced arsenal is welcomed in arms control forums. The net result is a more restrained posture than before — which may be the right outcome — but reached through a politically costly process that damages civil-military relations.",
      pointsA:     75,
      pointsB:     65,
      pointsC:     20,
      pointsD:     50,
      imageUrl:    null,
      createdAt:   new Date().toISOString()
    },

    {
      category:    "Nuclear Brinkmanship",
      title:       "The Rogue Launch: A Submarine Commander's Dilemma",
      difficulty:  "Hard",
      description: "You are the captain of a nuclear-armed submarine on patrol in the North Atlantic. You have lost communication with command for 14 hours — longer than the protocol threshold for considering an authorisation to act independently. You have just received what appears to be a valid Emergency Action Message ordering a nuclear strike on three targets. However, two anomalies exist: the authentication codes are correct but the message was transmitted on a non-standard frequency, and your executive officer has informed you that one member of the crew — a signals officer — has been behaving erratically following personal news received before departure. This is the exact scenario that protocol is designed to govern. Your crew is watching you.",
      question:    "How do you respond to the Emergency Action Message?",
      optionA:     "Authenticate the message using the full two-person authorisation protocol, and if it passes, proceed to launch preparation — protocol exists for exactly this scenario and must be followed.",
      optionB:     "Attempt to re-establish contact with command using every available means — including surfacing if necessary — before taking any action, accepting the risk that the delay may be operationally significant.",
      optionC:     "Convene a formal review with your executive officer and the senior weapons officer to assess both anomalies before making any decision, treating the non-standard frequency and the crew member's behaviour as disqualifying until explained.",
      optionD:     "Stand down the alert, secure all weapons systems, and surface immediately — treating the ambiguity of the message as sufficient grounds to override the order rather than risk an unauthorised nuclear launch.",
      impactA:     "Authentication passes all protocol checks. Launch preparation begins. An emergency signal from a second source — a back-channel relay that the non-standard frequency was itself a test of communication resilience — reaches you 22 minutes into launch preparation and halts the sequence. You followed protocol correctly but the protocol itself was insufficient for the ambiguity of the situation.",
      impactB:     "You surface after four hours of unsuccessful communication attempts. Command is reached. The Emergency Action Message was a result of a compromised relay station that transmitted an outdated drill scenario using valid current codes. The launch would have been an error. The delay was correct. Your career is complicated by having surfaced in a contested maritime zone, but no missiles were launched.",
      impactC:     "The formal review takes 38 minutes. Your executive officer concurs: the anomalies are disqualifying. You log your decision and continue attempting to re-establish contact. Command is reached six hours later. The message was genuine — a real escalation had occurred — but the situation had been resolved diplomatically before the launch window. You did not know that. Your decision was right for the wrong reasons, which is the most common kind of right decision in a crisis.",
      impactD:     "Surfacing immediately is the most conservative response. It removes the risk of an unauthorised launch entirely. It also exposes your position in a hostile maritime environment. The message was not genuine. Your decision was correct. Three colleagues in equivalent command positions subsequently cite your decision in their own protocols — it is later codified as best practice for ambiguous EAM receipt.",
      pointsA:     20,
      pointsB:     75,
      pointsC:     85,
      pointsD:     80,
      imageUrl:    null,
      createdAt:   new Date().toISOString()
    },

    // ─────────────────────────────────────────────────────────────
    // HUMANITARIAN & HUMAN RIGHTS × 3
    // ─────────────────────────────────────────────────────────────

    {
      category:    "Humanitarian & Human Rights",
      title:       "The Deportation Pipeline: Migrants at the Border",
      difficulty:  "Hard",
      description: "Your country shares a long border with a conflict zone. Over the past eight months, 340,000 people have crossed irregularly, overwhelming processing centres designed for 40,000. A significant number are economic migrants from a third country using the conflict as cover. Your government faces an election in four months and polling shows immigration is the top public concern. The Home Secretary is proposing a fast-track deportation programme that would return all irregular arrivals to a third country — not their country of origin — within 72 hours of crossing, without individual asylum assessments. Legal opinion is divided. The UNHCR has issued a formal objection. Two allied governments have done something similar and face ongoing legal challenges.",
      question:    "As the official responsible for border and asylum policy, how do you respond?",
      optionA:     "Implement the 72-hour fast-track programme as proposed, accepting legal challenges as manageable and prioritising the political need to demonstrate control over arrivals.",
      optionB:     "Replace the fast-track with an accelerated assessment system: trained caseworkers process claims in 21 days rather than the standard 18 months, deporting those whose claims fail while protecting genuine refugees.",
      optionC:     "Negotiate a comprehensive returns agreement with the conflict-zone country and two transit nations, focusing on reducing the driver of migration rather than processing speed at the border.",
      optionD:     "Accept the UNHCR framework: process all arrivals under standard asylum procedures, expand detention capacity, and pursue criminal prosecutions of smuggling networks as the primary deterrent.",
      impactA:     "The fast-track programme is implemented. A court injunction is obtained within three weeks, halting deportations. The legal challenge takes 22 months to resolve — ruling the programme unlawful — during which 60,000 people are held in temporary accommodation at higher cost than standard processing. The political benefit is short-lived; the legal and humanitarian cost is not.",
      impactB:     "The accelerated assessment system is operationally demanding but legally defensible. Processing time falls to 23 days on average. Deportation of failed claimants proceeds without legal challenge. Genuine refugees are protected and integrated more quickly. The political message — fast, firm, fair — proves durable. Two allied governments subsequently adopt a modified version of the model.",
      impactC:     "Returns agreement negotiations take fourteen months and produce a partial deal covering one of three transit countries. Migration volumes fall 18% — meaningful but not the decisive reduction promised. The political pressure continues. The negotiation investment pays off in reduced long-term flows but not in time for the election.",
      impactD:     "Standard processing, even with expanded capacity, creates a backlog of 180,000 cases within six months. Criminal prosecutions of smuggling networks secure 34 convictions, disrupting three major routes. The UNHCR endorses the approach. The political cost is severe: the government loses the election on an immigration platform. The policy was legally and ethically correct; politically, it was insufficient.",
      pointsA:     15,
      pointsB:     85,
      pointsC:     55,
      pointsD:     40,
      imageUrl:    null,
      createdAt:   new Date().toISOString()
    },

    {
      category:    "Humanitarian & Human Rights",
      title:       "Famine as a Weapon: Aid Access in an Active Conflict",
      difficulty:  "Hard",
      description: "A regional government in an ongoing civil war is deliberately obstructing humanitarian aid convoys to opposition-held territory. Satellite imagery and NGO reports confirm that 1.2 million civilians in the besieged region are at acute risk of famine. The government denies the blockade and frames humanitarian aid as material support for terrorists. The opposition controls the only viable land route and is demanding political recognition in exchange for safe passage. You are the head of the UN Office for the Coordination of Humanitarian Affairs (OCHA). You have convoys at the border. Your mandate requires neutrality but the delay is costing lives. The Security Council is deadlocked.",
      question:    "With convoys stalled at the border and the Security Council paralysed, what is your primary course of action?",
      optionA:     "Engage the regional government directly and accept its offer to allow aid distribution through government-controlled channels only, accepting that some aid will not reach besieged areas in exchange for getting some in.",
      optionB:     "Negotiate directly with the opposition for safe passage of convoys, bypassing the government, accepting the political risk that this legitimises the opposition's role as a governing authority.",
      optionC:     "Call a press conference presenting the satellite evidence publicly and naming the blockade as a potential crime against humanity, using media pressure to force a Security Council vote.",
      optionD:     "Coordinate with member states to airdrop food and medicine into the besieged region, bypassing the ground corridor entirely, accepting the risk of aerial interdiction by the regional government.",
      impactA:     "Government-channel distribution delivers approximately 35% of needed supplies, heavily weighted toward government-aligned communities. Aid to the most acutely affected besieged areas does not arrive. The famine kills an estimated 90,000 people over four months. The arrangement gives the government international cover for the blockade and is later cited as a case study in humanitarian access being weaponised against its own beneficiaries.",
      impactB:     "The opposition agrees to safe passage in exchange for OCHA publicly acknowledging their de facto administrative capacity in the region — falling short of political recognition but close to it. Convoys move. The famine is averted. The regional government expels OCHA from its territory and files a complaint with the Security Council. Six months later, OCHA re-enters under a revised agreement. The access was worth the cost.",
      impactC:     "The press conference generates front-page coverage in 40 countries for three days. A Security Council session is convened. Russia vetoes the resolution. A presidential statement — non-binding — passes and is largely ignored. Media attention shifts to another crisis within two weeks. The public pressure bought exactly seven days and a Security Council meeting that changed nothing. The famine continues.",
      impactD:     "Three member states agree to provide cargo aircraft. The regional government fires on the first flight, killing two crew members. The airdrop programme is suspended. International outrage at the shootdown achieves what the Security Council vote could not: Russia agrees to abstain, allowing a humanitarian resolution to pass. The deaths of the crew open the access that months of diplomacy could not. The outcome is achieved at the worst possible cost.",
      pointsA:     20,
      pointsB:     85,
      pointsC:     40,
      pointsD:     55,
      imageUrl:    null,
      createdAt:   new Date().toISOString()
    },

    {
      category:    "Humanitarian & Human Rights",
      title:       "Corporate Complicity: Holding Business Accountable in Conflict Zones",
      difficulty:  "Medium",
      description: "A major multinational corporation headquartered in your jurisdiction is operating a mining concession in a region controlled by a government credibly accused of using forced labour — including children — in the supply chain. The corporation's internal audits, obtained by a journalist, show that management knew of the practice for at least three years and made no changes. The corporation employs 12,000 people in your country and is the largest private-sector employer in two constituencies held by the governing party. The CEO has offered to 'cooperate' and is lobbying for a negotiated settlement. International partners are watching how your government responds. A proposed Business and Human Rights Act — which would create mandatory human rights due diligence requirements — is currently before Parliament.",
      question:    "As the minister responsible for both trade and human rights compliance, how do you respond?",
      optionA:     "Negotiate a binding remediation agreement with the corporation: supply chain audit, exit from forced labour supply chains within 18 months, and a victim compensation fund — in exchange for no prosecution.",
      optionB:     "Refer the matter to the public prosecutor's office for a full criminal investigation under existing corporate liability law, and accelerate passage of the Business and Human Rights Act.",
      optionC:     "Impose trade restrictions on the corporation's imported products until the supply chain is independently certified as clean, without initiating criminal proceedings.",
      optionD:     "Commission an independent parliamentary inquiry into the corporation's conduct, delaying any enforcement action until the inquiry reports in approximately twelve months.",
      impactA:     "The remediation agreement is signed. The corporation exits the forced labour supply chain within 20 months — two months late. The victim compensation fund is established but underfunded. No one is prosecuted. Three years later, a different corporation in the same sector makes similar calculations, noting that the consequence of getting caught was a negotiated settlement. The precedent is permissive.",
      impactB:     "The criminal referral results in a 28-month investigation. The corporation's share price falls 22%. Two competitors publicly announce enhanced due diligence in response. The Business and Human Rights Act passes with cross-party support, strengthened by the political context of the case. The CEO is not charged — corporate liability is difficult to prove — but three senior managers are. The standard in your jurisdiction is permanently raised.",
      impactC:     "The trade restrictions are challenged at the WTO by the corporation's host country as disguised protectionism. The challenge takes 18 months and is partially upheld. During that time, the corporation continues operating. The restrictions are eventually replaced by a negotiated compliance framework. The tool was available but not optimally deployed.",
      impactD:     "The parliamentary inquiry becomes a forum for the corporation's lawyers to delay, discredit the journalists' evidence, and negotiate the terms of eventual cooperation. Twelve months later, the inquiry recommends exactly what Option A offered — a remediation agreement — but now without the political momentum that existed at the time of the initial disclosure. The delay cost the outcome.",
      pointsA:     50,
      pointsB:     80,
      pointsC:     45,
      pointsD:     20,
      imageUrl:    null,
      createdAt:   new Date().toISOString()
    }

  ];

  // ── Upload ──────────────────────────────────────────────────
  console.log("📡 Uploading " + scenarios.length + " scenarios to Firestore...");
  let success = 0, failed = 0;

  for (const s of scenarios) {
    try {
      const ref = await db.collection("scenarios").add(s);
      console.log("✅ [" + s.category + "] " + s.title + " → " + ref.id);
      success++;
    } catch (err) {
      console.error("❌ FAILED: " + s.title + " — " + err.message);
      failed++;
    }
  }

  console.log("\n══════════════════════════════════════");
  console.log("Upload complete: " + success + " succeeded, " + failed + " failed.");
  console.log("══════════════════════════════════════");
})();
