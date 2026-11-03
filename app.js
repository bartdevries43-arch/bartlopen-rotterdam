/* ================================================================== *
 *  Bart en Michael, Run Coach · samen onder 3:30 in Rotterdam
 *  21 weken vanaf ma 16 nov 2026, CPC op 14 maart, marathon op zondag 11 april 2027.
 *  2 flexibele trainingen per week: snelheid en rustig langer.
 *  Gebouwd op de hoofdapp van Kim. Alles lokaal in de browser.
 * ================================================================== */

const CONFIG = {
  unit:       "km",
  zonePaceSuffix: "/km",
  footEmoji:  "🏃‍♂️",
  mottos: [
    "Zet 'm op, strijders!",
    "Lekker begonnen, strijders!",
    "Het bouwt, strijders.",
    "Halverwege, op naar de Coolsingel! ⚡",
    "Rotterdam komt eraan, strijders!",
    "Rotterdam! Wat een duo 🏅",
  ],
  appName:    "Rotterdam 3:30",
  runner:     "Bart & Michael",
  goal:       "3:30",
  startDate:  new Date(2026, 10, 16),
  storeKey:   "rotterdam330.log.v1",
  coachName:  "Coach Bart",
  coachHandle:"@bartlopen",
  coachPhoto: "coach.jpg",
  athleteWord:"strijder",
  catchphrase:"Samen onder 3:30, strijders 💪",
};

const RUNNER = CONFIG.runner;
const GOAL = CONFIG.goal;
const START_DATE = CONFIG.startDate;
const STORE_KEY = CONFIG.storeKey;
const TOTAL_WEEKS = 21;
const UNIT = CONFIG.unit === "min" ? "min" : "km";
const UNIT_LABEL = UNIT;
const nlNum = (v) => String(v).replace(".", ",");
const ZONE_SUFFIX = CONFIG.zonePaceSuffix ?? "/km";
const COACH_INITIAL = (CONFIG.coachName.replace(/^coach\s+/i, "")[0] || "C").toUpperCase();

const ZONES = [
  { key: "herstel",  name: "Heel rustig",   pace: "langzamer dan 6:15", info: "RPE 2 · los en makkelijk" },
  { key: "duur",     name: "Rustig",        pace: "5:40–6:10",          info: "RPE 3-4 · praten kan makkelijk" },
  { key: "lang",     name: "Lange loop",    pace: "5:35–6:10",          info: "RPE 3-4 · tijd op de benen" },
  { key: "doel",     name: "Racetempo",     pace: "4:55–5:00",          info: "RPE 5-6 · dit is 3:30" },
  { key: "tempo",    name: "Drempel",       pace: "4:35–4:45",          info: "RPE 7 · stevig, korte zinnen" },
  { key: "interval", name: "Snel",          pace: "4:10–4:25",          info: "RPE 8 · snel en beheerst" },
];
const zoneByKey = Object.fromEntries(ZONES.map((z) => [z.key, z]));

const COACH = {
  herstel: [
    "Vandaag echt rustig, strijders. Hier worden jullie sterker van.",
    "Makkelijk moet makkelijk zijn. Geen tempo-ego vandaag.",
    "Lichte dag. Zo staan jullie fris aan de volgende sleuteltraining.",
    "Slim rusten is ook trainen.",
  ],
  duur: [
    "Praattempo, strijders. Lekker bijkletsen hoort erbij.",
    "Rustige kilometers zijn de basis onder 3:30.",
    "Ontspannen schouders, rustige adem.",
    "De snelheid komt op andere dagen.",
  ],
  lang: [
    "Lange loop, strijders. Rustiger starten dan jullie willen.",
    "Elke lange loop maakt Rotterdam echter.",
    "Eten en drinken onderweg. Oefen het nu, dan klopt het in april.",
    "Hier winnen jullie de laatste 10 km van Rotterdam.",
  ],
  doel: [
    "Racetempo, strijders. Zo voelt 3:30.",
    "4:58 per kilometer. Vlak, vlak, vlak.",
    "Niet sneller dan afgesproken. Beheersing is de training.",
    "Dit tempo moet straks vanzelf gaan.",
  ],
  tempo: [
    "Drempel, strijders. Comfortabel oncomfortabel.",
    "Stevig maar beheerst, korte zinnen kunnen nog net.",
    "Dit tilt jullie duurvermogen omhoog.",
    "Tussen de blokken echt rustig joggen.",
  ],
  interval: [
    "Snel maar beheerst, strijders. Nooit sprinten.",
    "Gelijk tempo op elk blok, ook de laatste.",
    "Dit maakt 4:58 straks een stuk rustiger.",
    "Volle focus, dan rustig herstellen.",
  ],
};
const coachLine = (zone) => {
  const arr = COACH[zone] || COACH.duur;
  return arr[Math.floor(Math.random() * arr.length)];
};

const DONE = [
  "💪 Sterk gedaan, strijder!",
  "🔥 Weer eentje afgevinkt.",
  "👏 Lekker bezig.",
  "🏅 Weer een stap richting Rotterdam.",
  "✅ Weer een stukje sterker.",
  "⚡ Zo kom je onder de 3:30.",
];

const WHY = {
  herstel:  "Heel rustig lopen brengt bloed naar je spieren en ruimt vermoeidheid op, zonder nieuwe belasting. Bij drie stevige trainingen per week hoort dit erbij.",
  duur:     "Rustige kilometers bouwen de basis: een sterker hart, betere vetverbranding en pezen die aan de belasting wennen.",
  lang:     "De lange loop is de belangrijkste training van de week. Je lichaam leert energie sparen en je hoofd leert uren doorlopen. Hier wordt de marathon gewonnen.",
  doel:     "Lopen op racetempo maakt 4:58 vertrouwd. In Rotterdam moet het vanzelf gaan, zonder steeds op het horloge te kijken, en dat leer je hier.",
  tempo:    "Drempeltraining ligt net onder de verzuringsgrens. Daardoor houd je langer een hoog tempo vol en voelt racetempo rustiger.",
  interval: "Korte snelle blokken verbeteren je zuurstofopname en loopeconomie. Daardoor wordt 4:58 relatief makkelijker.",
};

/* --- Helpers: twee flexibele trainingen, de finale op de echte zondag --- */
/* Het label onder een training volgt de zone, tenzij een sessie zelf een kind meegeeft. */
const KIND_BY_ZONE = { herstel: "Heel rustig", duur: "Rustig", lang: "Lange loop", doel: "Racetempo", tempo: "Drempel", interval: "Snel" };
const d1 = (o) => ({ day: "d1", dayLabel: "Training 1 · snelheid", kind: KIND_BY_ZONE[o.zone], ...o });
const d2 = (o) => ({ day: "d2", dayLabel: "Training 2 · tempo",    kind: KIND_BY_ZONE[o.zone], ...o });
const d3 = (o) => ({ day: "d3", dayLabel: "Training 3 · lang",     kind: KIND_BY_ZONE[o.zone], ...o });
const zo = (o) => ({ day: "zo", dayLabel: "Zondag",                kind: KIND_BY_ZONE[o.zone], ...o });

const PLAN = [
  /* ---------- Fase 1 · Terugkomen en basis ---------- */
  { week: 1, dates: "16–22 nov", phase: "Fase 1 · Terugkomen en basis", recovery: true, note: "De Zevenheuvelenloop zit nog in de benen, en bij Michael ook Den Haag. Deze week alleen maar rustig: de eerste winst is goed herstel.", sessions: [
    d1({ zone: "herstel", km: 7, title: "Losjes terugkomen", goal: "De benen weer wakker maken", why: "Na een marathon zijn je spieren snel weer fit, maar pezen en botten hebben langer nodig. Daarom beginnen jullie dit blok bewust licht. Hier win je de hele winter mee.", blocks: [
      "7 km langzamer dan 6:15/km",
      "Geen horloge nodig, gewoon samen bijkletsen",
    ] }),
    d2({ zone: "duur", km: 8, title: "Rustig doorlopen", goal: "Ritme terugvinden", blocks: [
      "8 km op 5:40–6:10/km",
      "Michael: zeurt je kniepees? Dan korter",
    ] }),
    d3({ zone: "lang", km: 12, title: "Start van de lange lopen", goal: "De eerste steen van 33 km", blocks: [
      "12 km op 5:35–6:10/km",
      "Rustig praten moet de hele loop kunnen",
    ] }),
  ]},
  { week: 2, dates: "23–29 nov", phase: "Fase 1 · Terugkomen en basis", note: "Korte versnellingen brengen het gevoel van snelheid terug, zonder dat het pijn doet.", sessions: [
    d1({ zone: "interval", km: 8, title: "6× 1 min vlot", goal: "Snelheid wakker maken", blocks: [
      "2 km rustig inlopen",
      "6× 1 min op 4:20–4:35/km, met 2 min rustig joggen ertussen",
      "Rustig uitlopen tot 8 km",
    ] }),
    d2({ zone: "duur", km: 9, title: "Rustig doorlopen", goal: "Basis", blocks: ["9 km op 5:40–6:10/km"] }),
    d3({ zone: "lang", km: 14, title: "Lange loop", goal: "Tijd op de benen", blocks: ["14 km op 5:35–6:10/km"], bart: "Deze loop je alleen: maandag is Michaels Hyrox in Utrecht.", michael: "Deze sla je over, maandag is jouw Hyrox in Utrecht. Maximaal 20 minuten heel rustig losjes als je wilt." }),
  ]},
  { week: 3, dates: "30 nov–6 dec", phase: "Fase 1 · Terugkomen en basis", event: { day: "ma", titel: "HYROX Utrecht", wanneer: "maandag 30 november", tekst: "Michael doet maandag Hyrox. De dag erna rust of heel rustig, en donderdag op gevoel." }, note: "Eerste heuvels en eerste tempo. Heuveltraining is krachttraining op hardloopschoenen, en de Erasmusbrug komt er vanzelf aan.", sessions: [
    d1({ zone: "interval", kind: "Heuvels", km: 9, title: "8× de brug op", goal: "Kracht in de benen", why: "Heuvels maken je sterker en je looppas krachtiger, zonder de harde klappen van snelheid op de vlakte. In Rotterdam zijn bruggen de heuvels: kies een brug of viaduct van 45 tot 60 seconden.", blocks: [
      "2,5 km rustig inlopen",
      "8× 1 min stevig omhoog, rustig terug naar beneden",
      "Rustig uitlopen tot 9 km",
      "Michael: bergaf extra rustig, dat scheelt je kniepees",
    ], michael: "De dag na je Hyrox: geen heuvels. Rust, of 5 km heel rustig als het goed voelt." }),
    d2({ zone: "tempo", km: 10, title: "2× 10 min tempo", goal: "Duurvermogen omhoog", blocks: [
      "2,5 km rustig inlopen",
      "2× 10 min op 4:35–4:45/km, met 3 min rustig ertussen",
      "Rustig uitlopen tot 10 km",
    ], bart: "Jij bepaalt het tempo: 4:40 op je horloge, half stapje voor Michael.", michael: "Drie dagen na je Hyrox. Zijn de benen nog zwaar? Dan 8 km rustig. Voelt het goed, volg dan Bart en kijk niet op je horloge." }),
    d3({ zone: "lang", km: 16, title: "Lange loop", goal: "Tijd op de benen", blocks: ["16 km op 5:35–6:10/km", "Neem drinken mee"] }),
  ]},
  { week: 4, dates: "7–13 dec", phase: "Fase 1 · Terugkomen en basis", recovery: true, note: "Rustweek. Korter en lichter, zodat de eerste drie weken kunnen landen.", sessions: [
    d1({ zone: "duur", km: 7, title: "Rustig met 4 versnellingen", goal: "Licht en soepel", blocks: ["6,5 km op 5:40–6:10/km", "4× 20 sec soepel versnellen"] }),
    d2({ zone: "tempo", km: 8, title: "3× 5 min tempo", goal: "Scherp blijven", blocks: ["2 km rustig inlopen", "3× 5 min op 4:35–4:45/km, met 2 min rustig ertussen", "Rustig uitlopen tot 8 km"] }),
    d3({ zone: "lang", km: 13, title: "Korte lange loop", goal: "Lekker ontspannen", blocks: ["13 km op 5:35–6:10/km"] }),
  ]},

  /* ---------- Fase 2 · Sneller en sterker ---------- */
  { week: 5, dates: "14–20 dec", phase: "Fase 2 · Sneller en sterker", note: "Nu begint het echte werk: snelheid op dinsdag, tempo op donderdag, en de zondagen groeien door.", sessions: [
    d1({ zone: "interval", km: 10, title: "6× 800 m", goal: "Sneller dan racetempo", why: "Als 4:15 per km went, voelt 4:58 straks een stuk rustiger. Dat is waarom jullie ook met een marathondoel snelheid trainen.", blocks: ["2,5 km rustig inlopen", "6× 800 m op 4:10–4:25/km, met 2 min joggen ertussen", "Rustig uitlopen tot 10 km"] }),
    d2({ zone: "tempo", km: 11, title: "2× 15 min tempo", goal: "Langer op drempel", blocks: ["2,5 km rustig inlopen", "2× 15 min op 4:35–4:45/km, met 3 min rustig ertussen", "Rustig uitlopen tot 11 km"], bart: "Hou het strak op 4:40. Laat niet zakken in de laatste minuten.", michael: "Comfortabel oncomfortabel: korte zinnen kunnen nog net." }),
    d3({ zone: "lang", km: 18, title: "Lange loop", goal: "Op weg naar 20", blocks: ["18 km op 5:35–6:10/km", "Oefen met een gel na een uur"] }),
  ]},
  { week: 6, dates: "21–27 dec", phase: "Fase 2 · Sneller en sterker", note: "Kerstweek, maar wel een mooie: zondag jullie eerste 20 km van dit blok. Daarna kan die kerststol er ook weer af.", sessions: [
    d1({ zone: "interval", km: 10, title: "5× 1 km", goal: "Snelheid volhouden", blocks: ["2,5 km rustig inlopen", "5× 1 km op 4:15–4:25/km, met 2,5 min joggen ertussen", "Rustig uitlopen tot 10 km"] }),
    d2({ zone: "duur", km: 9, title: "Rustig kerstrondje", goal: "Lekker bewegen", blocks: ["9 km op 5:40–6:10/km"] }),
    d3({ zone: "lang", km: 20, title: "Eerste 20 km", goal: "Het eerste ijkpunt", blocks: ["20 km op 5:35–6:10/km", "Gel om de 40 min, drinken mee"], bart: "Hou het praattempo vast, ook als het lekker gaat.", michael: "Merk je dat je hele zinnen niet meer haalt? Dan gaat het te hard." }),
  ]},
  { week: 7, dates: "28 dec–3 jan", phase: "Fase 2 · Sneller en sterker", recovery: true, note: "Rustweek rond oud en nieuw. En voor het eerst voelen hoe 4:58 per kilometer loopt.", sessions: [
    d1({ zone: "duur", km: 8, title: "Rustig met 4 versnellingen", goal: "Licht en soepel", blocks: ["7,5 km op 5:40–6:10/km", "4× 20 sec soepel versnellen"] }),
    d2({ zone: "doel", km: 10, title: "Eerste keer racetempo", goal: "Zo voelt 3:30", why: "Dit is het tempo waar het allemaal om draait. Voor nu is het een kennismaking: twee keer drie kilometer. Het hoort beheerst te voelen, niet zwaar.", blocks: ["2 km rustig inlopen", "2× 3 km op 4:55–5:00/km, met 3 min rustig ertussen", "Rustig uitlopen tot 10 km"], bart: "4:58 is jouw metronoom. Elke kilometer gelijk, niet 4:50 en dan 5:05.", michael: "Horloge los. Leer hoe dit tempo in je lijf voelt." }),
    d3({ zone: "lang", km: 15, title: "Korte lange loop", goal: "Rustig het jaar in", blocks: ["15 km op 5:35–6:10/km"] }),
  ]},
  { week: 8, dates: "4–10 jan", phase: "Fase 2 · Sneller en sterker", note: "Gelukkig nieuwjaar! Nog 14 weken. De intervallen worden langer en de zondagen gaan richting de 30.", sessions: [
    d1({ zone: "interval", km: 11, title: "6× 1 km", goal: "Snelheid volhouden", blocks: ["2,5 km rustig inlopen", "6× 1 km op 4:15–4:25/km, met 2 min joggen ertussen", "Rustig uitlopen tot 11 km"] }),
    d2({ zone: "tempo", km: 12, title: "3× 12 min tempo", goal: "Drempel omhoog", blocks: ["2,5 km rustig inlopen", "3× 12 min op 4:35–4:45/km, met 2 min rustig ertussen", "Rustig uitlopen tot 12 km"] }),
    d3({ zone: "lang", km: 22, title: "Lange loop", goal: "Verder dan de halve", blocks: ["22 km op 5:35–6:10/km", "Gel om de 40 min"] }),
  ]},
  { week: 9, dates: "11–17 jan", phase: "Fase 2 · Sneller en sterker", note: "Pittige week voor de tijdrit van volgende week. Eet en slaap er goed bij.", sessions: [
    d1({ zone: "interval", km: 12, title: "5× 1,2 km", goal: "Langer snel", blocks: ["2,5 km rustig inlopen", "5× 1,2 km op 4:20–4:30/km, met 2,5 min joggen ertussen", "Rustig uitlopen tot 12 km"] }),
    d2({ zone: "doel", km: 13, title: "8 km racetempo", goal: "Racetempo aan één stuk", blocks: ["2,5 km rustig inlopen", "8 km op 4:55–5:00/km", "Rustig uitlopen tot 13 km"], bart: "Roep elke kilometer de split. Afwijken mag maximaal 3 seconden.", michael: "Ontspannen schouders, rustige ademhaling. Dit moet makkelijker gaan voelen." }),
    d3({ zone: "lang", km: 24, title: "Lange loop", goal: "Tijd op de benen", blocks: ["24 km op 5:35–6:10/km", "Gel om de 40 min, oefen met wat je op de racedag gebruikt"] }),
  ]},
  { week: 10, dates: "18–24 jan", phase: "Fase 2 · Sneller en sterker", recovery: true, tuneup: true, tuneupTag: "Tijdrit", raceLabel: "IJkpunt · 10 km tijdrit", raceSub: "10 km tijdrit · doel onder 46:00", note: "Rustweek met een eerste echte test. Michael onder de 46:00 is precies op schema voor 3:30.", sessions: [
    d1({ zone: "duur", km: 8, title: "Rustig met 4 versnellingen", goal: "Benen fris maken", blocks: ["7,5 km op 5:40–6:10/km", "4× 20 sec soepel versnellen"] }),
    d2({ zone: "herstel", km: 6, title: "Heel rustig", goal: "Fris naar de tijdrit", blocks: ["6 km langzamer dan 6:15/km"] }),
    d3({ zone: "tempo", kind: "Testloop", km: 13, title: "10 km tijdrit", goal: "IJkpunt: onder de 46:00", why: "Een eerlijke meting halverwege. 46:00 is 4:36 per km en past bij een marathon rond 3:30. Lukt het ruim, dan zitten jullie voor op schema. Lukt het net niet, dan is er nog alle tijd.", blocks: ["2 km rustig inlopen met 3 versnellingen", "10 km tijdrit: kies een vlak stuk", "1 km rustig uitlopen", "Vul de tijd van de 10 km in"], bart: "Pace hem vlak op 4:36. De laatste 2 km laat je hem los.", michael: "Dit is jouw meting. Volgen tot km 8, en dan alles eruit." }),
  ]},

  /* ---------- Fase 3 · Marathonspecifiek ---------- */
  { week: 11, dates: "25–31 jan", phase: "Fase 3 · Marathonspecifiek", note: "Vanaf nu draait alles om 4:58. Steeds langere blokken racetempo, en zondagen tot 33 km.", sessions: [
    d1({ zone: "interval", km: 12, title: "8× 800 m", goal: "Snelheid onderhouden", blocks: ["2,5 km rustig inlopen", "8× 800 m op 4:10–4:25/km, met 90 sec joggen ertussen", "Rustig uitlopen tot 12 km"] }),
    d2({ zone: "doel", km: 14, title: "2× 5 km racetempo", goal: "Tien kilometer op 4:58", blocks: ["2 km rustig inlopen", "2× 5 km op 4:55–5:00/km, met 3 min rustig ertussen", "Rustig uitlopen tot 14 km"], bart: "Twee keer dezelfde 5 km: 24:50. Daar stuur je op.", michael: "Het tweede blok moet net zo voelen als het eerste." }),
    d3({ zone: "lang", km: 26, title: "Lange loop", goal: "Op weg naar 30", blocks: ["26 km op 5:35–6:10/km", "Gel om de 35 tot 40 min"] }),
  ]},
  { week: 12, dates: "1–7 feb", phase: "Fase 3 · Marathonspecifiek", note: "Tempo en lang in dezelfde week: dit zijn de weken die een marathon maken.", sessions: [
    d1({ zone: "tempo", km: 13, title: "4× 2 km tempo", goal: "Drempel scherp", blocks: ["2,5 km rustig inlopen", "4× 2 km op 4:35–4:45/km, met 2 min rustig ertussen", "Rustig uitlopen tot 13 km"] }),
    d2({ zone: "doel", km: 15, title: "10 km racetempo", goal: "Tien kilometer aan één stuk", blocks: ["2,5 km rustig inlopen", "10 km op 4:55–5:00/km", "Rustig uitlopen tot 15 km"], bart: "49:40 is het doel, zo vlak mogelijk. Oefen bij een bidon ook meteen de drinkpost.", michael: "Oefen drinken op tempo. Dat gaat in Rotterdam precies zo." }),
    d3({ zone: "lang", km: 28, title: "Lange loop", goal: "Bijna de 30", blocks: ["28 km op 5:35–6:10/km", "Gel om de 35 tot 40 min"] }),
  ]},
  { week: 13, dates: "8–14 feb", phase: "Fase 3 · Marathonspecifiek", note: "Zondag de eerste 30. Vanaf nu weten jullie hoe de laatste kilometers voelen.", sessions: [
    d1({ zone: "interval", km: 13, title: "6× 1,2 km", goal: "Langer snel", blocks: ["2,5 km rustig inlopen", "6× 1,2 km op 4:20–4:30/km, met 2 min joggen ertussen", "Rustig uitlopen tot 13 km"] }),
    d2({ zone: "doel", km: 12, title: "8 km racetempo", goal: "Beheerst, want zondag is lang", blocks: ["2 km rustig inlopen", "8 km op 4:55–5:00/km", "Rustig uitlopen tot 12 km"] }),
    d3({ zone: "lang", km: 30, title: "Eerste 30 km", goal: "Het tweede ijkpunt", blocks: ["30 km op 5:35–6:10/km", "Gel om de 35 min, drink bij elke stop"], bart: "Vanaf km 25 is het jouw moment als pacer: praten, afleiden, ritme houden.", michael: "Na km 25 mag het zwaar voelen. Blijf bij Bart, dat is de oefening." }),
  ]},
  { week: 14, dates: "15–21 feb", phase: "Fase 3 · Marathonspecifiek", recovery: true, note: "Rustweek. Goed slapen en de benen de tijd geven, want de zwaarste twee weken komen eraan.", sessions: [
    d1({ zone: "duur", km: 9, title: "Rustig met 4 versnellingen", goal: "Licht en soepel", blocks: ["8,5 km op 5:40–6:10/km", "4× 20 sec soepel versnellen"] }),
    d2({ zone: "tempo", km: 10, title: "2× 10 min tempo", goal: "Scherp blijven", blocks: ["2,5 km rustig inlopen", "2× 10 min op 4:35–4:45/km, met 3 min rustig ertussen", "Rustig uitlopen tot 10 km"] }),
    d3({ zone: "lang", km: 20, title: "Ontspannen lange loop", goal: "Korter, en lekker genieten", blocks: ["20 km op 5:35–6:10/km"] }),
  ]},
  { week: 15, dates: "22–28 feb", phase: "Fase 3 · Marathonspecifiek", note: "De grootste week van het blok: ruim 60 km op drie lopen, met zondag de langste loop van de hele voorbereiding.", sessions: [
    d1({ zone: "interval", km: 13, title: "4× 1,6 km", goal: "De mijl op kracht", blocks: ["2,5 km rustig inlopen", "4× 1,6 km op 4:25–4:35/km, met 3 min joggen ertussen", "Rustig uitlopen tot 13 km"] }),
    d2({ zone: "doel", km: 16, title: "12 km racetempo", goal: "Twaalf kilometer op 4:58", blocks: ["2 km rustig inlopen", "12 km op 4:55–5:00/km", "Rustig uitlopen tot 16 km"], bart: "Zo vlak als je kunt: 59:36 over de 12. Neem je racegel mee en oefen het moment.", michael: "Dit is de training die je vertrouwen geeft. Voelt het beheerst? Dan ben je op schema." }),
    d3({ zone: "lang", km: 33, title: "33 km, de langste", goal: "De piek van jullie blok", why: "Dit is de langste loop van jullie voorbereiding. Hij staat bewust hier: zes dagen voor Michaels Hyrox in Mechelen, zodat er daarna nog ruimte is om te herstellen. Verder hoeft niet: de rest komt op de racedag.", blocks: ["33 km op 5:35–6:10/km", "Gel om de 35 min, drinken bij elke kans", "Kleding en schoenen van de racedag aan"], bart: "Hou het rustig, ook als het lekker gaat. Na km 25 is het jouw moment als pacer.", michael: "Kniepees checken: napijn de volgende ochtend? Laat het direct weten. Daarna gaat alles richting Mechelen." }),
  ]},
  { week: 16, dates: "1–7 mrt", phase: "Fase 3 · Marathonspecifiek", event: { day: "za", titel: "HYROX solo Mechelen", wanneer: "zaterdag 6 maart", tekst: "Michael doet Hyrox solo in België. Daarom is deze week voor jullie allebei lichter. Zondag rust voor Michael." }, note: "Lichtere week na de piek. Michael richt zich op zaterdag, Bart houdt de kilometers vast.", sessions: [
    d1({ zone: "tempo", km: 10, title: "2× 10 min tempo", goal: "Scherp blijven, niet moe worden", blocks: ["2,5 km rustig inlopen", "2× 10 min op 4:35–4:45/km, met 3 min rustig ertussen", "Rustig uitlopen tot 10 km"], michael: "Op dinsdag kan dit nog, maar stop als de 33 km van zondag nog in je benen zit." }),
    d2({ zone: "doel", km: 10, title: "4 km racetempo", goal: "Even voelen", blocks: ["3 km rustig inlopen", "4 km op 4:55–5:00/km", "Rustig uitlopen tot 10 km"], michael: "Twee dagen voor je Hyrox: doe 5 km heel rustig met een paar versnellingen." }),
    d3({ zone: "lang", km: 20, title: "Ontspannen lange loop", goal: "Bart loopt, Michael rust", blocks: ["20 km op 5:35–6:10/km"], bart: "Deze loop je alleen. Kijk zondag even hoe Michael erbij loopt, volgende week is de CPC.", michael: "De dag na je Hyrox. Rust, of maximaal 5 km heel rustig als het echt goed voelt. Niet meer." }),
  ]},

  { week: 17, dates: "8–14 mrt", phase: "Fase 3 · Marathonspecifiek", tuneup: true, tuneupTag: "CPC", raceLabel: "IJkpunt · CPC halve marathon", raceSub: "CPC Den Haag · doel onder 1:40", note: "CPC-week! Vier weken voor Rotterdam de perfecte generale, met startnummer en alles erop en eraan.", sessions: [
    d1({ zone: "duur", km: 9, title: "Rustig met 4 versnellingen", goal: "Fris naar de CPC", blocks: ["8,5 km op 5:40–6:10/km", "4× 20 sec soepel versnellen"], michael: "Drie dagen na je Hyrox: zijn de benen nog zwaar, dan alleen 6 km heel rustig." }),
    d2({ zone: "doel", km: 8, title: "3× 1 km racetempo", goal: "Even voelen, verder niets", blocks: ["3 km rustig inlopen", "3× 1 km op 4:55–5:00/km, met 2 min rustig ertussen", "Rustig uitlopen tot 8 km"] }),
    zo({ zone: "doel", km: 21.1, kind: "Wedstrijd", title: "CPC Loop Den Haag", goal: "Zondag 14 maart · onder de 1:40", why: "De belangrijkste test van het blok. 1:40 is 4:44 per km en past bij een marathon rond 3:30. Lukt dit, dan is 3:30 in Rotterdam echt haalbaar. Oefen ook alles van de racedag: ontbijt, gels, kleding en de startvak-routine.", blocks: [
      "Rustig inlopen, 10 min plus een paar versnellingen",
      "Eerste 5 km op 4:48: drukte en bochten kosten tijd, niet jagen",
      "Dan op 4:42–4:45/km tot km 18",
      "Laatste 3 km: alles wat over is",
      "Controleer of je startbewijs geregeld is, de inschrijving is al open",
    ], bart: "Jouw generale als pacer: vlak lopen door de drukte, splits doorgeven, drinkposten oefenen.", michael: "Dit is acht dagen na je Hyrox. Volg Bart tot km 18, dan mag je los. Onder 1:40 is top. Net erboven met Hyrox in de benen zegt nog niets over Rotterdam." }),
  ]},
  { week: 18, dates: "15–21 mrt", phase: "Fase 3 · Marathonspecifiek", note: "De laatste grote: 32 km met 12 km op racetempo. Hierna begint het afbouwen.", sessions: [
    d1({ zone: "herstel", km: 8, title: "Heel rustig na de CPC", goal: "Bijkomen", blocks: ["8 km langzamer dan 6:15/km"] }),
    d2({ zone: "tempo", km: 11, title: "2× 15 min tempo", goal: "Nog één keer scherp", blocks: ["2,5 km rustig inlopen", "2× 15 min op 4:35–4:45/km, met 3 min rustig ertussen", "Rustig uitlopen tot 11 km"] }),
    d3({ zone: "doel", km: 32, title: "De generale: 32 km", goal: "Laatste 12 km op racetempo", why: "De belangrijkste training van het hele schema. 20 km rustig en dan 12 km op 4:58 op vermoeide benen: precies het gevoel van km 30 in Rotterdam. Lukt dit, dan weten jullie het zeker.", blocks: ["20 km op 5:35–6:00/km", "12 km op 4:55–5:00/km", "Gel om de 35 min, oefen precies je racedag", "Goed eten en goed slapen erna"], bart: "Na km 20 begint de race: 59:36 over de laatste 12, en praat hem er doorheen.", michael: "Vertrouw op Bart en blijf klein lopen. Hier leer je dat het kan." }),
  ]},

  /* ---------- Fase 4 · Scherp naar Rotterdam ---------- */
  { week: 19, dates: "22–28 mrt", phase: "Fase 4 · Scherp naar Rotterdam", taper: true, note: "Afbouwen begint. Minder kilometers, wel het tempo erin houden. Pasen op zondag, dus plan de lange loop slim.", sessions: [
    d1({ zone: "interval", km: 11, title: "5× 1 km", goal: "Scherp, niet moe", blocks: ["2,5 km rustig inlopen", "5× 1 km op 4:15–4:25/km, met 2,5 min joggen ertussen", "Rustig uitlopen tot 11 km"] }),
    d2({ zone: "doel", km: 12, title: "6 km racetempo", goal: "Vertrouwd houden", blocks: ["3 km rustig inlopen", "6 km op 4:55–5:00/km", "Rustig uitlopen tot 12 km"] }),
    d3({ zone: "lang", km: 22, title: "Lange loop, korter", goal: "Frisser worden", blocks: ["22 km op 5:35–6:10/km"] }),
  ]},
  { week: 20, dates: "29 mrt–4 apr", phase: "Fase 4 · Scherp naar Rotterdam", taper: true, note: "Het voelt misschien gek, zo weinig. Dat hoort. De benen laden nu op.", sessions: [
    d1({ zone: "tempo", km: 9, title: "2× 2 km tempo", goal: "Benen scherp", blocks: ["2,5 km rustig inlopen", "2× 2 km op 4:35–4:45/km, met 2 min rustig ertussen", "Rustig uitlopen tot 9 km"] }),
    d2({ zone: "doel", km: 10, title: "5 km racetempo", goal: "Even voelen", blocks: ["2,5 km rustig inlopen", "5 km op 4:55–5:00/km", "Rustig uitlopen tot 10 km"], bart: "24:50, en geen seconde sneller. Beheersing is nu de training.", michael: "Voelt dit makkelijk? Mooi, dan werkt de afbouw." }),
    d3({ zone: "lang", km: 14, title: "Laatste lange loop", goal: "Kort en ontspannen", blocks: ["14 km op 5:35–6:10/km", "Geen krachttraining meer voor de benen"] }),
  ]},
  { week: 21, dates: "5–11 apr", phase: "Fase 4 · Scherp naar Rotterdam", taper: true, race: true, raceLabel: "Doelrace · Rotterdam", raceSub: "Marathon Rotterdam · samen onder 3:30", note: "Raceweek. Het werk is gedaan. Slapen, eten, en zondag samen over die finish.", sessions: [
    d1({ zone: "doel", km: 8, title: "3× 1 km racetempo", goal: "Laatste prikkel", blocks: ["3 km rustig inlopen", "3× 1 km op 4:55–5:00/km, met 2 min rustig ertussen", "Rustig uitlopen tot 8 km"] }),
    d2({ zone: "herstel", km: 5, title: "5 km los + 4 versnellingen", goal: "Benen wakker", blocks: ["5 km heel rustig", "4× 20 sec soepel versnellen", "Doe deze uiterlijk vrijdag", "Twee dagen extra koolhydraten voor zondag"] }),
    zo({ zone: "doel", km: 42.2, kind: "Doelrace", title: "Marathon Rotterdam", goal: "Zondag 11 april · samen onder 3:30", why: "21 weken, honderden kilometers, samen. Bart loopt vooraan, Michael volgt, en de Coolsingel wacht. Begin rustig, loop vlak, eet en drink op tijd, en laat de laatste 10 km zien wat jullie hebben opgebouwd.", blocks: [
      "Ontbijt 3 uur voor de start, wat je geoefend hebt",
      "Eerste 5 km op 5:00: drukte en de Erasmusbrug kosten tijd, niet inhalen",
      "Daarna vlak op 4:58/km, zie de racekaart in de app",
      "Gel om de 35 min, drinken bij elke post",
      "Bij km 30 begint de echte marathon: klein lopen, ritme houden",
      "Laatste 2 km: Michael mag los. Zet 'm op! 🏅",
    ], bart: "Vandaag draait het om Michael. Vlak lopen, splits roepen, bidon aangeven, praten als het zwaar wordt. Bij km 40 laat je hem los.", michael: "Niet op je horloge kijken. Bart heeft het tempo, jij hoeft alleen te volgen. Vanaf km 40 is het van jou." }),
  ]},
];

const INFO = [
  { icon: "🎯", title: "Het plan: samen onder 3:30", items: [
    "3:30 is 4:58 per kilometer. Michael liep in Den Haag 3:40, dus er moet 10 minuten af. Dat is 14 seconden per kilometer: stevig, maar haalbaar in 21 weken.",
    "Bart liep vorig jaar 3:18. Hij heeft dus ruimte over, en die ruimte is precies wat een goede pacer nodig heeft.",
    "Eén schema, drie keer per week, en elke training telt. Er zit geen vulling in.",
    "De tempo's staan op 3:30. Loopt de CPC veel beter of slechter dan 1:40, dan schuiven we ze bij.",
  ]},
  { icon: "🎽", title: "Bart als pacer", items: [
    "Loop een half stapje voor Michael, aan de kant waar hij je makkelijk ziet.",
    "Vlak lopen is de hele kunst. 4:58 per kilometer, niet 4:50 en dan 5:05.",
    "Hou de splits bij zodat Michael dat niet hoeft. Hij kijkt niet op zijn horloge, hij volgt jou.",
    "Regel de drinkposten: jij pakt, jij geeft aan, Michael hoeft niet te zigzaggen.",
    "Praat als het zwaar wordt, zwijg als hij in zijn ritme zit. Vanaf km 30 is dat het halve werk.",
    "Oefen het allemaal in de sleuteltrainingen, dan is het in Rotterdam vanzelfsprekend.",
  ]},
  { icon: "🗓️", title: "Zo werkt jullie week", items: [
    "Training 1 is snelheid: intervallen en heuvels. Training 2 is tempo of racetempo. Training 3 is de lange loop.",
    "De dagen zijn flexibel, maar houd minstens één dag tussen de trainingen. De lange loop past het best op zondag, net als de race.",
    "Samen lopen is mooi voor de sleuteltrainingen. Lukt dat een keer niet, dan loopt ieder voor zich op hetzelfde tempo.",
    "Elke training heeft een eigen stukje voor Bart en voor Michael. Kies bovenaan de app wie jij bent, dan staat jouw taak vooraan.",
    "Moet een week anders? Zet het in jullie planning. Rotterdam schuift natuurlijk niet mee, dus gebruik de schuifknop liever niet.",
  ]},
  { icon: "🧭", title: "De ijkpunten", items: [
    "10 km tijdrit in de week van 18 januari: onder 46:00 is op schema.",
    "CPC Den Haag op zondag 14 maart: onder 1:40 is op schema. Voor Michael is dat acht dagen na zijn Hyrox, dus reken dat mee. Regel je startbewijs, de inschrijving is open.",
    "De generale in de week van 15 maart: 32 km met de laatste 12 op 4:58.",
    "Haalt Michael deze drie, dan is 3:30 geen hoop meer maar een plan.",
    "Lukt het net niet? Dan is 3:33 ook een dikke PR. Beslis samen na de CPC op welk tempo jullie vertrekken.",
  ]},
  { icon: "🦵", title: "Michael: je kniepees", items: [
    "Blijf (bijna) dagelijks je isometrische oefening doen: Spanish squat of wall-sit, 5× 45 sec.",
    "2 à 3× per week zwaar en langzaam: leg extension of split squat. Voer het gewicht rustig op.",
    "Bergaf en bruggen af altijd rustig, ook in de heuveltraining.",
    "Napijn de volgende ochtend die toeneemt? Rustiger of korter, en laat het Bart weten. Liever een training minder dan een blessure in maart.",
  ]},
  { icon: "🏋️", title: "Michael: Hyrox naast de marathon", items: [
    "Maandag 30 november HYROX Utrecht en zaterdag 6 maart HYROX solo in Mechelen. De trainingen eromheen hebben een eigen stukje voor jou.",
    "Hyrox is zwaarder dan het lijkt: 8 km lopen plus lunges, sleds en wall balls. Reken op een paar dagen herstel.",
    "Die lunges en wall balls vragen veel van je kniepees. Bouw ze rustig op in de weken ervoor en let op de ochtend erna.",
    "Eerlijk: Mechelen, de CPC en de generale liggen binnen 15 dagen, vijf weken voor Rotterdam. Dat is het spannendste stuk van het schema. Doe Mechelen liever op 90% en bewaar de rest voor 11 april.",
  ]},
  { icon: "💪", title: "Kracht naast drie keer lopen", items: [
    "Met drie looptrainingen is er ruimte voor 1 à 2× kracht per week: squats, lunges, kuiten, heupen en core.",
    "Zin in meer conditie? Fietsen of zwemmen op een vrije dag geeft extra zonder klappen op je benen.",
    "Geen zware benen op de dag vóór een sleuteltraining of lange loop.",
    "De laatste twee weken voor Rotterdam alleen nog licht.",
  ]},
  { icon: "🥤", title: "Eten en drinken", items: [
    "Lange lopen vanaf 75 minuten: drinken mee, en elke 35 tot 40 minuten een gel.",
    "Train je darmen: ga rustig naar 60 g koolhydraten per uur, ongeveer 2 gels.",
    "Gebruik op de racedag precies wat je getest hebt, dus oefen in de lange lopen en op de CPC.",
    "De laatste twee dagen voor de marathon extra koolhydraten: pasta, rijst, brood, en genoeg drinken.",
  ]},
  { icon: "🏁", title: "Afbouwen en de racedag", items: [
    "De laatste drie weken loop je minder, niet langzamer. Het tempo blijft, alleen de kilometers gaan omlaag.",
    "Rotterdam staat op zondag 11 april 2027. Check de startgegevens op de site van de marathon.",
    "Bij de start is het druk en vroeg in de race komt de Erasmusbrug. Geen zigzag, geen inhaalrace: de eerste 5 km op 5:00.",
    "Daarna vlak. Op de racekaart in de app staan alle doorkomsttijden.",
    "Bij km 30 begint de echte marathon. Daar maakt een goede pacer het verschil.",
  ]},
  { icon: "⏱️", title: "Racetempo op gevoel", items: [
    "Op de racedag kan je horloge ernaast zitten: tussen de hoge gebouwen en onder de bruggen springt gps soms weg. Vertrouw daarom ook op je gevoel en de kilometerborden.",
    "Bij 4:58 hoort: rustige ademhaling, korte zinnen kunnen nog, en het voelt in de eerste 10 km bijna te makkelijk.",
    "Voelt racetempo in het begin zwaar? Dan zit je te hard, of je hebt te weinig hersteld.",
    "Gebruik de racekaart: de tijd bij elke 5 km is betrouwbaarder dan het tempo op je horloge.",
  ]},
  { icon: "🦶", title: "Looptechniek", items: [
    "Kijk vooruit, niet naar je voeten. Een rechte houding geeft je longen ruimte.",
    "Laat je schouders laag en je handen los. Bij vermoeidheid gaan die als eerste omhoog.",
    "Korte, lichte passen sparen je knieën beter dan lange stappen. Dat is ook fijn voor Michaels kniepees.",
    "Wordt het zwaar? Maak je pas kleiner en houd je ritme vast, in plaats van harder te duwen.",
  ]},
  { icon: "👟", title: "Schoenen", items: [
    "Loop de meeste kilometers op je trainingsschoenen en wissel het liefst tussen twee paar.",
    "Raceschoenen test je op racetempo en op een lange loop. Nooit voor het eerst op de racedag.",
    "Schoenen gaan meestal zo'n 600 tot 800 km mee. Dit schema is 879 km, dus reken op een nieuw paar in de winter.",
    "Koop dat nieuwe paar op tijd, zodat je het voor de CPC al ingelopen hebt.",
  ]},
  { icon: "🌙", title: "Koud en donker lopen", items: [
    "Dit schema loopt dwars door de winter. Een lampje en reflectie zijn geen luxe.",
    "Trek een laag minder aan dan je denkt, en neem een muts en handschoenen mee.",
    "Glad? Dan vervalt het tempo. Loop rustig op een veilige route of schuif de training een dag op.",
    "Bij harde wind: eerst tegen, dan mee terug. Loop op gevoel in plaats van op je tempo.",
  ]},
  { icon: "📋", title: "De laatste week", items: [
    "Maandag tot en met donderdag: normaal eten, veel slapen en zo min mogelijk op de benen.",
    "Vrijdag en zaterdag: extra koolhydraten, zo'n 8 tot 10 gram per kilo lichaamsgewicht per dag. Pasta, rijst, brood en sportdrank.",
    "Zaterdag: niets nieuws eten, startnummer regelen en daarna vooral zitten.",
    "Leg zaterdagavond alles klaar: schoenen, startnummer, gels, horloge en een oud shirt voor bij de start.",
  ]},
  { icon: "🏁", title: "Racedag: het draaiboek", items: [
    "Ontbijt 3 uur voor de start, precies wat je op de CPC hebt gegeten.",
    "Op tijd bij de start, met een oud shirt dat je weg kunt gooien. Check het startvak en de starttijd vooraf op de site van de marathon.",
    "Laatste gel vlak voor de start, en dan om de 35 minuten. Drink bij elke post een paar slokjes.",
    "Km 0 tot 5: rustig door de drukte. Km 5 tot 30: vlak op 4:58, praten mag nog. Km 30 tot 40: alleen ritme en de volgende kilometer.",
    "Bij km 40 mag Michael los. Dan gaat het om de laatste twee kilometer, en die kun je altijd.",
  ]},
  { icon: "🧠", title: "De laatste 12 km", items: [
    "De man met de hamer komt vaak na km 30. Goed eten en een rustige eerste helft zijn de beste bescherming.",
    "Knip het op: niet nog 12 km, maar alleen tot de volgende drinkpost.",
    "Kies vooraf een zin die je in je hoofd herhaalt. Klein, licht, door.",
    "Glimlachen helpt echt: het ontspant je gezicht en schouders, en het kost niets.",
    "Dit ken je al: de generale van 32 km was precies dit gevoel, en toen liep je het ook gewoon uit.",
  ]},
  { icon: "🩹", title: "Als het even tegenzit", items: [
    "Eén training gemist? Gewoon doorgaan, niet inhalen.",
    "Een week ziek? Begin rustig opnieuw en haal niets in. Overleg dan samen of de tempo's nog kloppen.",
    "Pijn die je loopje verandert: stoppen. Pijn die de volgende dag erger is: rust, en houdt het aan, ga dan naar de fysio.",
    "Koorts of iets op je borst: niet lopen. Alleen een loopneus mag rustig, als je je verder goed voelt.",
  ]},
  { icon: "😴", title: "Herstel en slaap", items: [
    "Bij drie harde trainingen per week is herstel de vierde training. Zeven tot negen uur slapen doet meer dan elke extra kilometer.",
    "Na de lange loop binnen een half uur iets met koolhydraten en eiwit.",
    "Ziek of echt moe? Dan schrap je de eerstvolgende training. Eén gemiste training doet niets, doorgaan op lege benen wel.",
  ]},
];

const BADGES = [
  { id: "first",  icon: "👟", name: "Begonnen",        desc: "1 training afgevinkt",    test: (s) => s.done >= 1 },
  { id: "week",   icon: "✅", name: "Week compleet",   desc: "Een hele week afgerond",  test: (s) => s.fullWeeks >= 1 },
  { id: "streak", icon: "🔥", name: "Vier weken vol",  desc: "Reeks van 12 trainingen", test: (s) => s.streak >= 12 },
  { id: "half",   icon: "⚡", name: "Halverwege",      desc: "50% van het schema",      test: (s) => s.done >= s.total / 2 },
  { id: "sub46",  icon: "⏱️", name: "Onder 46:00",     desc: "10 km tijdrit gehaald",   test: (s) => s.sub46 },
  { id: "dertig", icon: "🏔️", name: "Dertig",          desc: "30 km in één training",   test: (s) => s.maxDist >= 30 },
  { id: "km500",  icon: "🚀", name: "Vijfhonderd km",  desc: "500 km totaal gelopen",   test: (s) => s.km >= 500 },
  { id: "cpc",    icon: "🎯", name: "CPC onder 1:40",  desc: "Op schema voor 3:30",     test: (s) => s.sub140 },
  { id: "finish", icon: "🏅", name: "Rotterdam",       desc: "Marathon uitgelopen",     test: (s) => s.marathonDone },
  { id: "sub330", icon: "👑", name: "Onder 3:30",      desc: "Doel gehaald, samen",     test: (s) => s.sub330 },
];

/* ================================================================== *
 *  State
 * ================================================================== */
const LEGACY_KEYS = CONFIG.legacyKeys || [];

function leesSleutel(k) {
  try { const v = JSON.parse(localStorage.getItem(k)); return v && typeof v === "object" ? v : null; }
  catch { return null; }
}
function aantalSessies(o) { return o ? Object.keys(o).filter((k) => /^w\d+-/.test(k)).length : 0; }
function samenvoegen(hoofd, extra) { return { ...extra, ...hoofd }; }

/* Voortgang laden. Staat er iets onder een oudere opslagsleutel, dan nemen we
   dat over, zodat niemand zijn afgevinkte trainingen kwijtraakt. */
function loadLog() {
  let uit = leesSleutel(STORE_KEY) || {};
  const eigen = aantalSessies(uit);
  LEGACY_KEYS.forEach((k) => {
    const oud = leesSleutel(k);
    if (aantalSessies(oud)) uit = samenvoegen(uit, oud);
  });
  if (aantalSessies(uit) > eigen) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(uit)); } catch {}
  }
  return uit;
}
function saveLog() {
  log.__saved = Date.now();
  try { localStorage.setItem(STORE_KEY, JSON.stringify(log)); } catch {}
  idbZet(log);
  renderLaatstOpgeslagen();
}

/* ----- Tweede back-up in IndexedDB ---------------------------------- *
 *  localStorage kan door de browser worden opgeruimd. Elke opslag gaat
 *  daarom ook naar IndexedDB; bij opstarten halen we terug wat vollediger is.
 * -------------------------------------------------------------------- */
const IDB_NAAM = "bartlopen-runcoach", IDB_STORE = "logs";
function idbOpen() {
  return new Promise((ok, nee) => {
    if (!window.indexedDB) return nee(new Error("geen indexedDB"));
    const r = indexedDB.open(IDB_NAAM, 1);
    r.onupgradeneeded = () => {
      if (!r.result.objectStoreNames.contains(IDB_STORE)) r.result.createObjectStore(IDB_STORE);
    };
    r.onsuccess = () => ok(r.result);
    r.onerror = () => nee(r.error);
  });
}
async function idbZet(data) {
  try {
    const db = await idbOpen();
    await new Promise((ok, nee) => {
      const t = db.transaction(IDB_STORE, "readwrite");
      t.objectStore(IDB_STORE).put(JSON.parse(JSON.stringify(data)), STORE_KEY);
      t.oncomplete = ok; t.onerror = () => nee(t.error);
    });
  } catch {}
}
async function idbHaal() {
  try {
    const db = await idbOpen();
    return await new Promise((ok, nee) => {
      const t = db.transaction(IDB_STORE, "readonly");
      const q = t.objectStore(IDB_STORE).get(STORE_KEY);
      q.onsuccess = () => ok(q.result || null);
      q.onerror = () => nee(q.error);
    });
  } catch { return null; }
}
function herstelUitBackup() {
  return idbHaal().then((kopie) => {
    if (!kopie) { idbZet(log); return false; }
    if (aantalSessies(kopie) > aantalSessies(log)) {
      log = samenvoegen(log, kopie);
      saveLog(); renderAll();
      toast("Je voortgang is teruggehaald 🔄");
      return true;
    }
    idbZet(log);
    return false;
  }).catch(() => false);
}
function renderLaatstOpgeslagen() {
  const el = document.getElementById("lastSaved");
  if (!el) return;
  const t = log.__saved;
  if (!t) { el.textContent = ""; return; }
  const d = new Date(t), pad = (n) => String(n).padStart(2, "0");
  el.textContent = `Laatst opgeslagen: ${d.getDate()}-${pad(d.getMonth() + 1)} om ${pad(d.getHours())}:${pad(d.getMinutes())} · ${aantalSessies(log)} trainingen ingevuld`;
}
let log = loadLog();

const sid = (week, day) => `w${week}-${day}`;
const flatSessions = PLAN.flatMap((w) => w.sessions.map((s) => ({ ...s, week: w.week })));
const totalSessions = flatSessions.length;
const LAST_SESSION = flatSessions[flatSessions.length - 1];
/* Vaste ankers, zodat behaalde badges niet verschuiven als er weken bijkomen. */
const TIJDRIT_SESSION = { week: 10, day: "d3" };  /* 10 km tijdrit, week van 18 jan */
const CPC_SESSION = { week: 17, day: "zo" };      /* CPC Den Haag, 14 mrt */
const MARATHON_SESSION = { week: 21, day: "zo" }; /* marathon Rotterdam, 11 apr */
/* In de agenda: snelheid op dinsdag, tempo op donderdag, de lange loop op zondag. */
const DAY_OFFSET = { ma: 0, di: 1, wo: 2, do: 3, vr: 4, za: 5, zo: 6, d1: 1, d2: 3, d3: 6, d4: 6 };

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

function dateAtDay(dayIndex) {
  const date = new Date(schedStartMs());
  date.setDate(date.getDate() + dayIndex);
  date.setHours(12, 0, 0, 0);
  return date;
}

function sessionDate(week, day) {
  return dateAtDay((week - 1) * 7 + (DAY_OFFSET[day] ?? 0));
}

function isoDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function planningEntries() {
  return Array.isArray(log.__planning) ? log.__planning : [];
}

function planningForWeek(week) {
  const start = isoDate(dateAtDay((week - 1) * 7));
  const end = isoDate(dateAtDay((week - 1) * 7 + 6));
  return planningEntries().filter((entry) => entry.start <= end && (entry.end || entry.start) >= start);
}

function parseTime(str) {
  if (!str) return null;
  const parts = String(str).split(":").map((p) => parseInt(p, 10));
  if (parts.some((n) => Number.isNaN(n))) return null;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] * 60;
}

function durationParts(str) {
  const total = parseTime(str) || 0;
  return { minutes: Math.floor(total / 60), seconds: total % 60 };
}

function durationValue(minutes, seconds) {
  const m = Math.max(0, parseInt(minutes, 10) || 0);
  const s = Math.min(59, Math.max(0, parseInt(seconds, 10) || 0));
  return `${m}:${String(s).padStart(2, "0")}`;
}
function paceSeconds(distance, timeStr) {
  const d = parseFloat(String(distance).replace(",", "."));
  const sec = parseTime(timeStr);
  if (!d || !sec) return null;
  return sec / d;
}
function fmtPace(perKm) {
  if (!perKm) return null;
  const m = Math.floor(perKm / 60);
  const s = Math.round(perKm % 60);
  return `${m}:${String(s).padStart(2, "0")} /km`;
}

/* Afgeleide statistieken uit de log */
function computeStats() {
  let done = 0, km = 0, maxDist = 0, maxTime = 0, bestPace = 0, secs = 0, raceDone = false;
  flatSessions.forEach((s) => {
    const e = log[sid(s.week, s.day)];
    if (!e || !e.done) return;
    done++;
    const d = parseFloat(String(e.distance || "").replace(",", ".")) || 0;
    km += d;
    if (d > maxDist) maxDist = d;
    const t = parseTime(e.time) || 0;
    secs += t;
    if (t > maxTime) maxTime = t;
    const p = paceSeconds(e.distance, e.time);
    if (p && (bestPace === 0 || p < bestPace)) bestPace = p;
    if (s.week === LAST_SESSION.week && s.day === LAST_SESSION.day) raceDone = true;
  });
  let streak = 0, run = 0;
  flatSessions.forEach((s) => {
    const e = log[sid(s.week, s.day)];
    if (e && e.done) { run++; streak = Math.max(streak, run); } else run = 0;
  });
  let fullWeeks = 0;
  PLAN.forEach((w) => {
    if (w.sessions.every((s) => log[sid(w.week, s.day)]?.done)) fullWeeks++;
  });
  const tijdVan = (a) => { const e = log[sid(a.week, a.day)]; return e && e.done ? parseTime(e.time) || 0 : 0; };
  const onder = (a, sec) => { const t = tijdVan(a); return t > 0 && t < sec; };
  const marathonDone = !!log[sid(MARATHON_SESSION.week, MARATHON_SESSION.day)]?.done;
  return { done, total: totalSessions, km, maxDist, maxTime, bestPace, secs, raceDone, marathonDone, sub46: onder(TIJDRIT_SESSION, 46 * 60), sub140: onder(CPC_SESSION, 100 * 60), sub330: onder(MARATHON_SESSION, 210 * 60), streak, fullWeeks };
}

function currentWeek() {
  const diff = Math.floor((Date.now() - schedStartMs()) / (7 * 864e5));
  /* Uit PLAN afleiden, niet uit TOTAL_WEEKS: anders blijft de huidige week
     hangen op de oude laatste week zodra er weken bijkomen. */
  return Math.min(PLAN[PLAN.length - 1].week, Math.max(1, diff + 1));
}

/* ================================================================== *
 *  Rendering
 * ================================================================== */
const $ = (id) => document.getElementById(id);

function animateCount(el, to, suffix = "") {
  const dur = 700, t0 = performance.now();
  const dec = to % 1 !== 0;
  function step(t) {
    const k = Math.min(1, (t - t0) / dur);
    const v = to * (1 - Math.pow(1 - k, 3));
    el.textContent = (dec ? v.toFixed(1).replace(".", ",") : Math.round(v)) + suffix;
    if (k < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function renderHero(stats) {
  $("runnerName").textContent = RUNNER;
  $("goalText").textContent = GOAL;
  const pct = Math.round((stats.done / stats.total) * 100);
  $("ringPct").textContent = `${pct}%`;
  const r = 52, c = 2 * Math.PI * r;
  const fg = $("ringFg");
  fg.style.strokeDasharray = c;
  fg.style.strokeDashoffset = c;
  requestAnimationFrame(() => { fg.style.strokeDashoffset = c * (1 - pct / 100); });
  const mottos = CONFIG.mottos || ["Zet 'm op, strijder!", "Lekker bezig, strijder!", "Je bouwt 'm rustig op, strijder.", "Halverwege, knap volgehouden! ⚡", "Bijna race-klaar, strijder!", "Finisher! Wat een prestatie, strijder. 🏅"];
  $("heroMotto").textContent =
    stats.raceDone ? mottos[5] : pct >= 80 ? mottos[4] : pct >= 50 ? mottos[3] : pct >= 20 ? mottos[2] : pct > 0 ? mottos[1] : mottos[0];
  renderCountdown();
  renderSubgoal();
}

function raceTarget() {
  /* Het eerstvolgende doel dat nog moet komen. Gelopen = datum voorbij óf afgevinkt.
     Via dateAtDay rekenen, niet met milliseconden: dat schuift bij de zomertijd. */
  const vandaag = new Date().setHours(0, 0, 0, 0);
  const datumVan = (w) => {
    const d = w.sessions[w.sessions.length - 1].day;
    return dateAtDay((w.week - 1) * 7 + (DAY_OFFSET[d] ?? 6)).setHours(0, 0, 0, 0);
  };
  const doelen = PLAN.filter((w) => w.race || w.finish || w.tuneup);
  const gelopen = (w) => {
    const d = w.sessions[w.sessions.length - 1].day;
    return datumVan(w) < vandaag || !!log[sid(w.week, d)]?.done;
  };
  const volgende = doelen.find((w) => !gelopen(w));
  const rw = volgende || doelen[doelen.length - 1] || PLAN[PLAN.length - 1];
  const rs = rw.sessions[rw.sessions.length - 1];
  return { rw, rs, date: new Date(datumVan(rw)), allesGelopen: !volgende };
}

function raceInfo() {
  const { rs, date, allesGelopen } = raceTarget();
  const days = Math.round((new Date(date).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 864e5);
  return { days: allesGelopen ? -1 : days, name: rs.title.replace(/^[^\p{L}\d]+/u, "").trim() };
}

const NL_DAG = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
const NL_MAAND = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
function renderSubgoal() {
  const el = document.querySelector(".hero-subgoal");
  if (!el) return;
  const { rw, rs, date, allesGelopen } = raceTarget();
  const d = new Date(date);
  const voorbij = allesGelopen || new Date(date).setHours(12, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
  const soort = rw.race ? "Doelrace" : rw.finish ? "Finale" : "Volgend ijkpunt";
  /* Flexibele trainingen hebben geen vaste dag: dan noemen we de week. */
  const ma = dateAtDay((rw.week - 1) * 7);
  const wanneer = /^d\d+$/.test(rs.day)
    ? `week van ${ma.getDate()} ${NL_MAAND[ma.getMonth()]}`
    : `${NL_DAG[d.getDay()]} ${d.getDate()} ${NL_MAAND[d.getMonth()]}`;
  const kop = `${voorbij ? "Gelopen" : soort} · ${wanneer}`;
  el.innerHTML = `<span>${kop}</span><strong>${rw.raceSub || rs.title.replace(/^[^\p{L}\d]+/u, "").trim()}</strong>`;
}

function renderCountdown() {
  const motto = $("heroMotto");
  if (!motto) return;
  let el = $("raceCountdown");
  if (!el) {
    el = document.createElement("p");
    el.id = "raceCountdown";
    el.className = "hero-countdown";
    motto.after(el);
  }
  const { days, name } = raceInfo();
  const wks = Math.round(days / 7), mon = Math.round(days / 30);
  el.textContent =
    days > 180 ? `🗓️ jouw grote doel: over ~${mon} maanden, ${name}` :
    days > 14 ? `🗓️ nog ${wks} weken tot je ${name}` :
    days > 1 ? `🗓️ nog ${days} dagen tot je ${name}` :
    days === 1 ? `🗓️ morgen is het zover: ${name}!` :
    days === 0 ? `🔥 vandaag is het zover: ${name}!` :
    `🎉 ${name} volbracht, chapeau!`;
}

function renderStats(stats) {
  animateCount($("statDone"), stats.done);
  animateCount($("statKm"), Math.round(stats.km * 10) / 10, " km");
  animateCount($("statStreak"), stats.streak);
  const cw = currentWeek();
  const wk = PLAN.find((w) => w.week === cw);
  const wkDone = wk.sessions.filter((s) => log[sid(cw, s.day)]?.done).length;
  $("statWeek").textContent = `${wkDone}/${wk.sessions.length}`;
}

function renderNextUp() {
  const cw = currentWeek();
  const next =
    flatSessions.find((s) => s.week >= cw && !log[sid(s.week, s.day)]?.done) ||
    flatSessions.find((s) => !log[sid(s.week, s.day)]?.done);
  const box = $("nextUp");
  if (!next) {
    box.innerHTML = `<div class="nextup-card done"><span class="nextup-eyebrow">🏅 Schema compleet</span><strong>Alles afgevinkt, chapeau, ${RUNNER}!</strong></div>`;
    return;
  }
  const z = zoneByKey[next.zone];
  box.innerHTML = `
    <button class="nextup-card zone-${next.zone}" data-week="${next.week}" data-day="${next.day}">
      <span class="nextup-eyebrow">Volgende training · week ${next.week} · ${next.dayLabel}</span>
      <strong>${next.title}</strong>
      <span class="nextup-meta">${nlNum(next[UNIT])} ${UNIT_LABEL} · ${z.name}</span>
      <span class="nextup-go">Openen ›</span>
    </button>`;
  box.querySelector(".nextup-card").addEventListener("click", () => openDetail(next.week, next.day));
}

const PLANNING_META = {
  race: {
    icon: "🏁", label: "Tussentijdse race",
    advice: "Laat deze race je lange training vervangen. Houd de training ervoor rustig en plan daarna minimaal één hersteldag.",
  },
  vacation: {
    icon: "🌴", label: "Vakantie",
    advice: "Gemiste trainingen hoef je niet in te halen. Pak bij thuiskomst de eerstvolgende rustige training op.",
  },
  rest: {
    icon: "🩹", label: "Rust / blessure",
    advice: "Herstel gaat voor het schema. Hervat pas pijnvrij en bouw de eerste week extra rustig op.",
  },
};

function formatPlanDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00`);
  return date.toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
}

function renderPlanning() {
  const list = $("planningList");
  if (!list) return;
  const entries = [...planningEntries()].sort((a, b) => a.start.localeCompare(b.start));
  if (!entries.length) {
    list.innerHTML = `<div class="planning-empty"><span>🗓️</span><p>Nog niets gepland. Voeg een vakantie of oefenwedstrijd toe zodra je die weet.</p></div>`;
    return;
  }
  list.innerHTML = entries.map((entry) => {
    const meta = PLANNING_META[entry.type] || PLANNING_META.rest;
    const period = entry.end && entry.end !== entry.start
      ? `${formatPlanDate(entry.start)} – ${formatPlanDate(entry.end)}`
      : formatPlanDate(entry.start);
    return `<article class="planning-item plan-${entry.type}">
      <span class="planning-icon">${meta.icon}</span>
      <div class="planning-copy">
        <span class="planning-type">${meta.label} · ${period}</span>
        <strong>${escapeHtml(entry.title)}</strong>
        ${entry.note ? `<p>${escapeHtml(entry.note)}</p>` : ""}
        <p class="planning-advice"><b>Coachadvies:</b> ${meta.advice}</p>
      </div>
      <button class="planning-remove" type="button" data-plan-id="${escapeHtml(entry.id)}" aria-label="${escapeHtml(entry.title)} verwijderen">×</button>
    </article>`;
  }).join("");
  list.querySelectorAll(".planning-remove").forEach((button) => {
    button.addEventListener("click", () => {
      log.__planning = planningEntries().filter((entry) => entry.id !== button.dataset.planId);
      saveLog();
      renderAll();
      toast("Uit je planning verwijderd");
    });
  });
}

function renderZones() {
  $("zonesList").innerHTML = ZONES.map((z) => `
    <div class="zone-row zone-${z.key}">
      <span class="zone-dot"></span>
      <div class="zone-main"><strong>${z.name}</strong><span>${z.info}</span></div>
      <span class="zone-pace">${z.pace}${ZONE_SUFFIX ? `<small>${ZONE_SUFFIX}</small>` : ""}</span>
    </div>`).join("");
}

function renderChart() {
  const volumeSub = document.querySelector("#volumeChart")?.closest(".panel")?.querySelector(".panel-sub");
  if (volumeSub) volumeSub.textContent = `${(typeof UNIT !== "undefined" ? UNIT : "min") === "min" ? "minuten" : "kilometers"} · gepland · gedaan`;
  const cwBar = currentWeek();
  const max = Math.max(...PLAN.map((w) => w.sessions.reduce((n, s) => n + s[UNIT], 0)));
  $("volumeChart").innerHTML = PLAN.map((w) => {
    const planned = w.sessions.reduce((n, s) => n + s[UNIT], 0);
    const doneMin = w.sessions.reduce((n, s) => n + (log[sid(w.week, s.day)]?.done ? s[UNIT] : 0), 0);
    const h = Math.round((planned / max) * 100);
    const fill = planned ? Math.round((doneMin / planned) * 100) : 0;
    const cls = ((w.race || w.tuneup || w.finish) ? "is-race" : w.recovery ? "is-rest" : "") + (w.week === cwBar ? " is-now" : "");
    return `
      <div class="bar ${cls}" title="Week ${w.week}: ${nlNum(Math.round(planned * 10) / 10)} ${UNIT_LABEL} gepland">
        <div class="bar-track" style="height:${h}%">
          <div class="bar-fill" style="height:${fill}%"></div>
        </div>
        <span class="bar-x">${w.week}</span>
      </div>`;
  }).join("");
}

function tagOf(w) {
  if (w.finish) return `<span class="week-tag tag-race">Finale</span>`;
  if (w.race) return `<span class="week-tag tag-race">Raceweek</span>`;
  if (w.tuneup) return `<span class="week-tag tag-tuneup">${w.tuneupTag || "Wedstrijd"}</span>`;
  if (w.recovery) return `<span class="week-tag tag-rest">Herstel</span>`;
  if (w.taper) return `<span class="week-tag tag-taper">Afbouw</span>`;
  return "";
}

function renderWeeks() {
  const cw = currentWeek();
  const todayIso = isoDate(new Date());
  let html = "", lastPhase = "";
  PLAN.forEach((w, i) => {
    if (w.phase !== lastPhase) { html += `<h4 class="sub-phase reveal">${w.phase}</h4>`; lastPhase = w.phase; }
    const sess = w.sessions.map((s) => {
      const e = log[sid(w.week, s.day)] || {};
      const z = zoneByKey[s.zone];
      const pace = fmtPace(paceSeconds(e.distance, e.time));
      const bits = [];
      if (e.distance) bits.push(`${e.distance} km`);
      if (pace) bits.push(pace);
      if (e.hr) bits.push(`${e.hr} bpm`);
      const logged = bits.length ? `<span class="session-logged">📊 ${bits.join(" · ")}</span>` : "";
      const lastDay = w.sessions[w.sessions.length - 1].day;
      const isRaceSession = (w.race || w.tuneup || w.finish) && s.day === lastDay;
      const isToday = isoDate(sessionDate(w.week, s.day)) === todayIso;
      const raceKicker = isRaceSession
        ? `<span class="session-race-kicker">${w.raceLabel || (w.race ? "Doelrace" : w.tuneup ? "Wedstrijd" : "Finale")}</span>`
        : "";
      const isFlexibleSlot = /^d\d+$/.test(s.day);
      const badgeLabel = isFlexibleSlot ? s.day.slice(1) : s.dayLabel.slice(0, 2);
      return `
        <button class="session zone-${s.zone} ${isRaceSession ? "is-race-session" : ""} ${e.done ? "is-done" : ""} ${isToday ? "is-today" : ""}" data-week="${w.week}" data-day="${s.day}">
          <span class="session-day ${isFlexibleSlot ? "is-slot" : ""}" title="${s.dayLabel}">${badgeLabel}</span>
          <span class="session-body">
            ${raceKicker}
            <span class="session-title">${s.title}${isToday ? ' <span class="today-badge">Vandaag</span>' : ""}</span>
            <span class="session-meta">${nlNum(s[UNIT])} ${UNIT_LABEL} · ${s.kind}</span>
            ${logged}
          </span>
          <span class="session-check">${e.done ? "✓" : ""}</span>
        </button>`;
    }).join("");
    const weekPlans = planningForWeek(w.week);
    const planStrip = weekPlans.length ? `<div class="week-planning">${weekPlans.map((entry) => {
      const meta = PLANNING_META[entry.type] || PLANNING_META.rest;
      return `<span>${meta.icon} ${escapeHtml(entry.title)}</span>`;
    }).join("")}</div>` : "";
    html += `
      <article class="week-card reveal ${w.tuneup ? "is-tuneup-week" : ""} ${w.race ? "is-goal-race-week" : ""} ${w.week === cw ? "is-current" : ""} ${w.week < cw ? (w.sessions.every((x) => log[sid(w.week, x.day)]?.done) ? "is-complete" : "is-missed") : ""}" style="--i:${i % 4}">
        <header class="week-head">
          <div><span class="week-no">Week ${w.week}</span><span class="week-dates">${weekDateLabel(w)}</span></div>
          ${w.week === cw ? `<span class="week-tag tag-now">Nu</span>` : w.week < cw ? (w.sessions.every((x) => log[sid(w.week, x.day)]?.done) ? `<span class="week-tag tag-done">✓ af</span>` : `<span class="week-tag tag-missed">gemist</span>`) : tagOf(w)}
        </header>
        ${planStrip}
        ${w.event ? `<div class="week-event"><strong>Michael · ${w.event.titel}</strong><span>${w.event.wanneer}</span><p>${w.event.tekst}</p></div>` : ""}
        ${w.note ? `<p class="week-note">${w.note}</p>` : ""}
        ${WEEK_TIPS[w.week] ? `<p class="week-tip"><b>Tip</b> ${WEEK_TIPS[w.week]}</p>` : ""}
        <div class="session-list">${sess}</div>
      </article>`;
  });
  $("weeksList").innerHTML = html;
  /* Koppen altijd kloppend met het schema */
  const schemaKop = [...document.querySelectorAll(".phase-head")].find((e) => /Het schema/.test(e.textContent));
  if (schemaKop) schemaKop.textContent = `Het schema · ${PLAN.length} weken`;
  $("weeksList").querySelectorAll(".session").forEach((b) =>
    b.addEventListener("click", () => openDetail(+b.dataset.week, b.dataset.day)));
  observeReveals();
}

function renderBadges(stats) {
  $("badgeGrid").innerHTML = BADGES.map((b) => {
    const got = b.test(stats);
    return `
      <div class="badge ${got ? "got" : "locked"}" title="${b.desc}">
        <span class="badge-icon">${got ? b.icon : "🔒"}</span>
        <strong>${b.name}</strong>
        <span class="badge-desc">${b.desc}</span>
      </div>`;
  }).join("");
}

function renderInfo() {
  /* Open kaarten blijven open als de lijst opnieuw wordt getekend. */
  const open = new Set([...document.querySelectorAll("#infoList details[open]")].map((d) => d.dataset.i));
  const eerste = !document.querySelector("#infoList details");
  $("infoList").innerHTML = INFO.map((c, i) => `
    <details class="info-card" data-i="${i}" ${(eerste && i === 0) || open.has(String(i)) ? "open" : ""}>
      <summary><span class="info-nr">${String(i + 1).padStart(2, "0")}</span><span class="info-title">${c.title}</span></summary>
      <ul>${c.items.map((t) => `<li>${t}</li>`).join("")}</ul>
    </details>`).join("");
}

function addJumpButton() {
  const head = document.querySelector(".weeks .phase-head");
  if (!head || document.getElementById("jumpNow")) return;
  const btn = document.createElement("button");
  btn.id = "jumpNow";
  btn.type = "button";
  btn.className = "jump-now";
  btn.textContent = "Naar deze week ↓";
  btn.addEventListener("click", () =>
    document.querySelector(".week-card.is-current")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  head.insertAdjacentElement("afterend", btn);
}

/* ----- Extra's: begroeting, records, consistentie ------------------- */
function greetingWord() {
  const h = new Date().getHours();
  return h < 6 ? "Goedenacht" : h < 12 ? "Goedemorgen" : h < 18 ? "Goedemiddag" : "Goedenavond";
}
function renderGreeting() {
  const copy = document.querySelector(".hero-copy");
  if (!copy) return;
  let el = document.getElementById("heroGreeting");
  if (!el) {
    el = document.createElement("p");
    el.id = "heroGreeting";
    el.className = "hero-greeting";
    copy.insertBefore(el, copy.firstChild);
  }
  el.textContent = `${greetingWord()}, ${wieBenIk() || RUNNER}`;
}
function renderRecords(stats) {
  const anchor = document.querySelector(".weeks");
  if (!anchor) return;
  let sec = document.getElementById("recordsPanel");
  if (!sec) {
    sec = document.createElement("section");
    sec.id = "recordsPanel";
    sec.className = "panel reveal";
    anchor.parentNode.insertBefore(sec, anchor);
  }
  const pace = fmtPace(stats.bestPace);
  const longest = UNIT === "min"
    ? (stats.maxTime ? `${Math.round(stats.maxTime / 60)} min` : "–")
    : (stats.maxDist ? `${nlNum(stats.maxDist)} km` : "–");
  const totaalMin = stats.secs ? `${Math.round(stats.secs / 60)} min` : "–";
  const rows = UNIT === "min"
    ? [
        stats.bestPace ? ["Snelste tempo", pace] : ["Trainingen gedaan", String(stats.done)],
        ["Langste loop", longest],
        ["Totaal gelopen", totaalMin],
        ["Langste reeks", String(stats.streak)],
      ]
    : [
        ["Snelste tempo", pace || "–"],
        ["Verste loop", longest],
        ["Totaal gelopen", `${nlNum(Math.round(stats.km * 10) / 10)} km`],
        ["Langste reeks", String(stats.streak)],
      ];
  sec.innerHTML = `<h3 class="panel-head">Jouw records</h3>
    <div class="records">${rows.map(([l, v]) =>
      `<div class="record"><span class="record-val">${v}</span><span class="record-label">${l}</span></div>`).join("")}</div>`;
}
function renderConsistency() {
  const grid = document.querySelector(".stats-grid");
  if (!grid) return;
  let sec = document.getElementById("consistencyStrip");
  if (!sec) {
    sec = document.createElement("section");
    sec.id = "consistencyStrip";
    sec.className = "panel consistency-panel reveal";
    grid.parentNode.insertBefore(sec, grid.nextSibling);
  }
  const todayIso = isoDate(new Date());
  const cw = currentWeek();
  let done = 0, total = 0;
  const cols = PLAN.map((w) => {
    const cells = w.sessions.map((s) => {
      const e = log[sid(w.week, s.day)] || {};
      const dIso = isoDate(sessionDate(w.week, s.day));
      total++;
      if (e.done) done++;
      const cls = e.done ? "is-done" : dIso < todayIso ? "is-missed" : "is-todo";
      return `<span class="ccell ${cls}${dIso === todayIso ? " is-today" : ""}" title="Week ${w.week} \u00b7 ${s.dayLabel}"></span>`;
    }).join("");
    return `<div class="cweek${w.week === cw ? " is-current" : ""}"><div class="ccells">${cells}</div><span class="cweek-no">${w.week}</span></div>`;
  }).join("");
  const pct = total ? Math.round((done / total) * 100) : 0;
  sec.innerHTML = `
    <h3 class="panel-head">Consistentie <span class="panel-sub">elk blokje is een training</span></h3>
    <div class="cweeks">${cols}</div>
    <div class="cons-foot">
      <div class="cons-legend"><span><i class="ck ck-done"></i>afgerond</span><span><i class="ck ck-missed"></i>gemist</span><span><i class="ck ck-todo"></i>komt nog</span></div>
      <span class="cons-score"><strong>${done}/${total}</strong> gedaan \u00b7 ${pct}%</span>
    </div>`;
}

/* ----- Schema opschuiven (drukke week) ------------------------------ */
const NL_MND = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
function weekOffset() { return (log && log.__weekOffset) || 0; }
function schedStartMs() { return START_DATE.getTime() + weekOffset() * 7 * 864e5; }
function weekDateLabel(w) {
  if (!weekOffset()) return w.dates;
  const mon = dateAtDay((w.week - 1) * 7), sun = dateAtDay((w.week - 1) * 7 + 6);
  return `${mon.getDate()} ${NL_MND[mon.getMonth()]}–${sun.getDate()} ${NL_MND[sun.getMonth()]}`;
}
function renderShiftControl() {
  const head = document.querySelector(".weeks .phase-head");
  if (!head) return;
  let el = document.getElementById("shiftControl");
  if (!el) {
    el = document.createElement("div");
    el.id = "shiftControl";
    el.className = "shift-control reveal";
    head.insertAdjacentElement("afterend", el);
  }
  const off = weekOffset();
  const wk = (n) => `${n} week${n > 1 ? "en" : ""}`;
  el.innerHTML = off > 0
    ? `<div class="shift-copy"><strong>Schema ${wk(off)} opgeschoven</strong><span>Je hele schema loopt nu ${wk(off)} langer. Niks staat op gemist.</span></div><div class="shift-btns"><button id="shiftMore" type="button">Nog een week</button><button id="shiftReset" type="button" class="ghost">Ongedaan maken</button></div>`
    : `<div class="shift-copy"><strong>Drukke week gehad?</strong><span>Schuif je hele schema een week op, dan raak je niks kwijt.</span></div><div class="shift-btns"><button id="shiftMore" type="button">Schuif 1 week op ↦</button></div>`;
  el.querySelector("#shiftMore").addEventListener("click", () => {
    if (!confirm("Je hele schema een week opschuiven?\n\nAlle trainingen schuiven mee. Je kunt dit altijd terugzetten.")) return;
    log.__weekOffset = weekOffset() + 1; saveLog(); renderAll();
    toast("Schema een week opgeschoven 📅");
  });
  const rs = el.querySelector("#shiftReset");
  if (rs) rs.addEventListener("click", () => {
    log.__weekOffset = 0; saveLog(); renderAll();
    toast("Opschuiven ongedaan gemaakt");
  });

  /* Duidelijke melding bovenaan: een per ongeluk verschoven schema moet je
     meteen zien, niet pas als je ver naar beneden scrollt. */
  const hero = document.querySelector(".hero");
  let notice = document.getElementById("shiftNotice");
  if (off > 0 && hero) {
    if (!notice) {
      notice = document.createElement("div");
      notice.id = "shiftNotice";
      notice.className = "shift-notice";
      hero.insertAdjacentElement("afterend", notice);
    }
    notice.innerHTML = `<div class="shift-copy"><strong>\u{1F4C5} Je schema staat ${wk(off)} opgeschoven</strong><span>Daardoor sta je ${wk(off)} eerder in je schema dan de kalender. Klopt dat niet? Zet het gewoon terug.</span></div><div class="shift-btns"><button id="noticeReset" type="button">Zet terug</button></div>`;
    notice.querySelector("#noticeReset").addEventListener("click", () => {
      log.__weekOffset = 0; saveLog(); renderAll();
      toast("Schema teruggezet \u{1F4C5}");
    });
  } else if (notice) {
    notice.remove();
  }
}

/* ----- Duo: wie heeft de app open? ----------------------------------- *
 *  Bart en Michael volgen hetzelfde schema, ieder op zijn eigen telefoon.
 *  De keuze bepaalt de begroeting en welke taak bij een training vooraan staat.
 * --------------------------------------------------------------------- */
const WIE_KEY = "rotterdam330.wie";
function wieBenIk() {
  try { return localStorage.getItem(WIE_KEY) || ""; } catch { return ""; }
}
function renderDuo() {
  const el = $("duoSwitch");
  if (!el) return;
  /* Eén keer opbouwen: zo blijft de knop onder je vinger staan, ook tijdens het tikken. */
  if (!el.dataset.klaar) {
    el.dataset.klaar = "1";
    el.innerHTML = ["Bart", "Michael"].map((naam) => `<button type="button" class="duo-btn" data-wie="${naam}">${naam}</button>`).join("");
    el.addEventListener("click", (e) => {
      const knop = e.target.closest(".duo-btn");
      if (!knop) return;
      try { localStorage.setItem(WIE_KEY, knop.dataset.wie); } catch {}
      renderDuo();
      renderGreeting();
    });
  }
  const wie = wieBenIk();
  el.querySelectorAll(".duo-btn").forEach((b) => {
    const aan = b.dataset.wie === wie;
    b.classList.toggle("is-on", aan);
    b.setAttribute("aria-pressed", String(aan));
  });
}
function duoBlok(s) {
  if (!s.bart && !s.michael) return "";
  const wie = wieBenIk();
  const rijen = [["Bart", s.bart], ["Michael", s.michael]].filter((r) => r[1]);
  if (wie === "Michael") rijen.reverse();
  return `<section class="detail-block duo-block">
      <h4>Zo doen jullie dit samen</h4>
      ${rijen.map(([naam, tekst]) => `<div class="duo-row ${wie === naam ? "is-me" : ""}"><span class="duo-who">${naam}</span><p>${tekst}</p></div>`).join("")}
    </section>`;
}

/* ----- Tips ---------------------------------------------------------- */
const WEEK_TIPS = {
  1: "Laat je horloge deze week thuis. Loop op gevoel, dan herstel je echt.",
  2: "Zet je drie trainingen nu al vast in de agenda. Vaste momenten houden je de hele winter op koers.",
  3: "Bruggen zijn de heuvels van Rotterdam. Omhoog korte passen en armen mee, omlaag rustig.",
  4: "Een rustweek is geen gemiste week. Slaap een uur extra als het kan, dat doet meer dan een extra kilometer.",
  5: "Bij intervallen telt het laatste blok. Is dat het langzaamste, dan begon je te hard.",
  6: "Je eerste 20 km begint zaterdagavond: goed eten, genoeg drinken en op tijd naar bed.",
  7: "Leer 4:58 op gevoel: loop een kilometer zonder op je horloge te kijken, raad je tijd en check hem daarna.",
  8: "Donker en koud? Neem een lampje en reflectie mee, en trek een laag minder aan dan je denkt. Na 10 minuten heb je het warm.",
  9: "Test op je 24 km welke gel je maag aankan. Neem hem op tijd, niet pas als je leeg bent.",
  10: "Kies voor de tijdrit een vlak stuk met weinig wind, en doe de twee dagen ervoor geen krachttraining.",
  11: "Drinken op tempo is een vaardigheid. Knijp de beker tot een tuitje en neem kleine slokjes.",
  12: "Test nu je raceset, sokken inclusief. Wat op 15 km niet schuurt, kan dat op 35 km wel doen.",
  13: "Na km 25 wordt het mentaal. Hak het in stukjes: alleen de volgende kilometer telt.",
  14: "Even eerlijk checken: hoe zijn de benen, hoe slaap je, wat doet de kniepees? Bijsturen kan nu nog makkelijk.",
  15: "De zwaarste week. Eet binnen een half uur na de lange loop koolhydraten en eiwit, dan begint je herstel meteen.",
  16: "Een lichtere week, ook voor Bart. Gebruik hem om fris aan de CPC te beginnen.",
  17: "De CPC is je generale: hetzelfde ontbijt, dezelfde gels en dezelfde schoenen als straks. Niets nieuws.",
  18: "Na deze 32 km is het grootste werk gedaan. Vanaf nu gaat het vooral om fris worden.",
  19: "Afbouwen voelt raar. Zware benen en onrust horen erbij, je hebt niets verloren.",
  20: "Regel nu de praktische dingen: startbewijs, vervoer naar de start en kleding voor elk weer.",
  21: "Knip je teennagels, leg zaterdag alles klaar en loop de eerste kilometer langzamer dan je wil.",
};
const ZONE_TIPS = {
  herstel: ["Echt langzaam, ook als het te makkelijk voelt.", "Hoe zwaarder je vorige training, hoe rustiger vandaag.", "Zeurt er iets? Korter mag altijd."],
  duur: ["Doe de praattest: hele zinnen moeten kunnen.", "Ontspan je handen en schouders, dat scheelt energie.", "Liever korte, lichte passen dan lange stappen."],
  lang: ["De eerste 3 km extra rustig, dan gaat de rest vanzelf.", "Begin na 45 minuten met eten, niet pas als je honger hebt.", "Plan een route met water onderweg, of neem een bidon mee."],
  doel: ["Kijk pas na een kilometer op je horloge en leer het gevoel.", "Vlak is de kunst: elke kilometer binnen 3 seconden van 4:58.", "Oefen eten en drinken op dit tempo, net als in de race."],
  tempo: ["Begin beheerst: je laatste blok moet net zo snel zijn als je eerste.", "Korte zinnen moeten nog net lukken.", "Tussen de blokken rustig blijven joggen, niet stilstaan."],
  interval: ["Goed inlopen en een paar versnellingen voorkomen blessures.", "Op elk blok hetzelfde tempo, nooit sprinten.", "Bergop kort en krachtig, bergaf rustig. Fijn voor de kniepees."],
};
function renderTip() {
  const el = $("tipCard");
  if (!el) return;
  const cw = currentWeek();
  el.innerHTML = `<span class="tip-label">Tip van week ${cw}</span><p>${WEEK_TIPS[cw] || ""}</p>`;
}

/* ----- Racedashboard ------------------------------------------------- */
const MARATHON_DAG = () => dateAtDay((MARATHON_SESSION.week - 1) * 7 + 6);
function renderDash() {
  const el = $("dashDays");
  if (!el) return;
  const dagen = Math.round((new Date(MARATHON_DAG()).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 864e5);
  el.textContent = dagen > 0 ? String(dagen) : dagen === 0 ? "Nu!" : "✓";
  $("dashDaysLabel").textContent = dagen > 1 ? "dagen tot Rotterdam" : dagen === 1 ? "dag tot Rotterdam" : dagen === 0 ? "het is zover" : "Rotterdam gelopen";
  $("dashWeeks").textContent = String(PLAN.length);
  $("dashKm").textContent = String(Math.round(flatSessions.reduce((n, x) => n + x.km, 0)));
}

/* ----- Route naar Rotterdam: fases en ijkpunten ---------------------- */
const IJKPUNTEN = [
  { week: 3,  event: true, kort: "H", naam: "HYROX Utrecht", wanneer: "maandag 30 november", doel: "Michael" },
  { week: 6,  day: "d3", kort: "20", naam: "Eerste 20 km", doel: "Rustig, op praattempo" },
  { week: 10, day: "d3", kort: "10", naam: "10 km tijdrit", doel: "Onder 46:00" },
  { week: 13, day: "d3", kort: "30", naam: "Eerste 30 km", doel: "Door na km 25" },
  { week: 16, event: true, kort: "H", naam: "HYROX solo Mechelen", wanneer: "zaterdag 6 maart", doel: "Michael" },
  { week: 17, day: "zo", kort: "21", naam: "CPC Den Haag", doel: "Onder 1:40" },
  { week: 18, day: "d3", kort: "32", naam: "De generale", doel: "Laatste 12 op 4:58" },
  { week: 21, day: "zo", kort: "42", naam: "Marathon Rotterdam", doel: "Samen onder 3:30" },
];
function renderRoute() {
  const bar = $("routeBar"), lijst = $("routeList");
  if (!bar || !lijst) return;
  const cw = currentWeek();
  const fases = [];
  PLAN.forEach((w) => {
    const f = fases[fases.length - 1];
    if (f && f.naam === w.phase) f.tot = w.week;
    else fases.push({ naam: w.phase, van: w.week, tot: w.week });
  });
  const start = dateAtDay(0);
  const voorStart = new Date().setHours(0, 0, 0, 0) < new Date(start).setHours(0, 0, 0, 0);
  bar.innerHTML = `<div class="route-segs">${fases.map((f) => {
    const n = f.tot - f.van + 1;
    const klaar = voorStart ? 0 : Math.max(0, Math.min(n, cw - f.van + 1));
    return `<div class="route-seg ${!voorStart && cw >= f.van && cw <= f.tot ? "is-now" : ""}" style="flex:${n}"><span style="width:${Math.round((klaar / n) * 100)}%"></span></div>`;
  }).join("")}</div>
    <p class="route-now">${voorStart
      ? `We starten in de week van ${start.getDate()} ${NL_MAAND[start.getMonth()]}`
      : `${fases.find((f) => cw >= f.van && cw <= f.tot).naam} <em>week ${cw} van ${PLAN.length}</em>`}</p>`;
  let volgendeGezet = false;
  lijst.innerHTML = IJKPUNTEN.map((p) => {
    if (p.event) return `<div class="route-point is-event">
        <span class="route-dot">${p.kort}</span>
        <span class="route-text"><strong>${p.naam}</strong><small>${p.wanneer}</small></span>
        <span class="route-goal">${p.doel}</span>
      </div>`;
    const e = log[sid(p.week, p.day)] || {};
    const isVolgende = !e.done && !volgendeGezet;
    if (isVolgende) volgendeGezet = true;
    const dag = /^d\d+$/.test(p.day) ? dateAtDay((p.week - 1) * 7) : sessionDate(p.week, p.day);
    const wanneer = `${/^d\d+$/.test(p.day) ? "week van " : "zondag "}${dag.getDate()} ${NL_MAAND[dag.getMonth()]}`;
    return `<button type="button" class="route-point ${e.done ? "is-done" : ""} ${isVolgende ? "is-next" : ""}" data-week="${p.week}" data-day="${p.day}">
        <span class="route-dot">${e.done ? "✓" : p.kort}</span>
        <span class="route-text"><strong>${p.naam}</strong><small>${wanneer}</small></span>
        <span class="route-goal">${e.done && parseTime(e.time) ? `<b>${fmtTijd(parseTime(e.time))}</b>` : p.doel}</span>
      </button>`;
  }).join("");
  lijst.querySelectorAll(".route-point").forEach((b) => b.addEventListener("click", () => openDetail(+b.dataset.week, b.dataset.day)));
}

/* ----- Racekaart: doorkomsttijden voor de pacer ---------------------- */
function fmtTijd(sec) {
  const u = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = Math.round(sec % 60);
  return `${u ? u + ":" : ""}${String(m).padStart(u ? 2 : 1, "0")}:${String(s).padStart(2, "0")}`;
}
function renderPaceCard() {
  const el = $("paceCard");
  if (!el) return;
  const tijd = (km) => (km <= 5 ? km * 300 : 1500 + (km - 5) * 298);
  const rijen = [[5, "rustig, door de drukte"], [10, "vanaf nu vlak op 4:58"], [15, ""], [20, ""], [21.0975, "halverwege"], [25, ""], [30, "hier begint het echt"], [35, ""], [40, "Michael mag los"], [42.195, "finish"]];
  el.innerHTML = rijen.map(([km, tip]) => `<div class="pace-row ${km === 21.0975 || km === 42.195 ? "is-key" : ""}">
      <span class="pace-km">${km === 21.0975 ? "21,1" : km === 42.195 ? "42,2" : km} km</span>
      <span class="pace-tip">${tip}</span>
      <span class="pace-time">${fmtTijd(tijd(km))}</span>
    </div>`).join("");
}

function renderAll() {
  const stats = computeStats();
  renderHero(stats);
  renderDuo();
  renderDash();
  renderTip();
  renderRoute();
  renderPaceCard();
  renderStats(stats);
  renderGreeting();
  renderConsistency();
  renderNextUp();
  renderPlanning();
  renderChart();
  renderZones();
  renderWeeks();
  addJumpButton();
  renderShiftControl();
  renderBadges(stats);
  renderRecords(stats);
  renderInfo();
  observeReveals();
}

/* ----- Detailweergave ------------------------------------------------ */
function openDetail(week, day) {
  const w = PLAN.find((x) => x.week === week);
  const s = w.sessions.find((x) => x.day === day);
  /* Alleen de wedstrijd zelf is een wedstrijd, niet de andere trainingen in die week. */
  const isRaceDetail = (w.race || w.tuneup || w.finish) && s.day === w.sessions[w.sessions.length - 1].day;
  const id = sid(week, day);
  const e = log[id] || {};
  const z = zoneByKey[s.zone];
  const enteredTime = durationParts(e.time);

  $("detailTitle").textContent = `Week ${week} · ${s.dayLabel}`;
  $("detailBody").innerHTML = `
    <div class="detail-hero zone-${s.zone}">
      <span class="detail-kind">${s.kind} · ${nlNum(s[UNIT])} ${UNIT_LABEL}</span>
      <h2>${s.title}</h2>
      <p class="detail-goal">${s.goal}</p>
      <span class="detail-zone">${z.name} · ${z.info}</span>
    </div>

    <div class="coach-bubble">
      <div class="coach-ava">
        <img src="${CONFIG.coachPhoto}" alt="${CONFIG.coachName}" onerror="this.style.display='none'">
        <span>${COACH_INITIAL}</span>
      </div>
      <div class="coach-text">
        <strong>${CONFIG.coachName} <span class="coach-handle">${CONFIG.coachHandle}</span></strong>
        <p>${coachLine(s.zone)}</p>
      </div>
    </div>

    <section class="detail-block why">
      <h4>${isRaceDetail ? (s.kind === "Testloop" ? "Waarom deze testloop" : w.finish ? "Waarom deze mijlpaal" : "Waarom deze wedstrijd") : "Waarom deze training"}</h4>
      <p>${s.why || WHY[s.zone] || ""}</p>
    </section>

    ${duoBlok(s)}

    <section class="detail-block">
      <h4>Opbouw</h4>
      <ol class="block-list">${s.blocks.map((b) => `<li>${b}</li>`).join("")}</ol>
    </section>

    ${isRaceDetail ? "" : `<section class="detail-block tips-block">
      <h4>Zo haal je er het meeste uit</h4>
      <ul>${(ZONE_TIPS[s.zone] || []).map((t) => `<li>${t}</li>`).join("")}</ul>
    </section>`}

    <section class="detail-block">
      <h4>${isRaceDetail ? (s.kind === "Testloop" ? "Invullen na je testloop" : w.finish ? "Invullen na je mijlpaal" : "Invullen na de wedstrijd") : "Invullen na de training"}</h4>
      <div class="form-grid">
        <label>Afstand (km)
          <input id="fDistance" type="text" inputmode="decimal" placeholder="bv. 6,2" value="${escapeHtml(e.distance ?? "")}">
        </label>
        <label>Tijd
          <span class="duration-input">
            <input id="fTimeMinutes" type="number" inputmode="numeric" min="0" max="999" placeholder="36" value="${enteredTime.minutes || ""}" aria-label="Minuten">
            <span>min</span>
            <input id="fTimeSeconds" type="number" inputmode="numeric" min="0" max="59" placeholder="30" value="${enteredTime.seconds || ""}" aria-label="Seconden">
            <span>sec</span>
          </span>
        </label>
        <label class="full">Gemiddeld tempo
          <output id="fPace" class="pace-out">${fmtPace(paceSeconds(e.distance, e.time)) || "–"}</output>
        </label>
        <label>Hartslag (bpm)
          <input id="fHr" type="number" inputmode="numeric" placeholder="bv. 152" value="${escapeHtml(e.hr ?? "")}">
        </label>
        <label>Gevoel / zwaarte
          <select id="fFeel">
            ${["", "1 · heel licht", "2 · licht", "3 · prima", "4 · pittig", "5 · zwaar"]
              .map((o) => `<option value="${o}" ${String(e.feel ?? "") === o ? "selected" : ""}>${o || "Kies…"}</option>`).join("")}
          </select>
        </label>
        <label class="full">Notitie
          <textarea id="fNote" rows="2" placeholder="Hoe ging het?">${escapeHtml(e.note ?? "")}</textarea>
        </label>
      </div>
    </section>

    <div class="detail-actions">
      <button id="toggleDone" class="btn-primary ${e.done ? "is-done" : ""}">${e.done ? "✓ Gedaan" : "Markeer als gedaan"}</button>
      <button id="saveSession" class="btn-ghost">Opslaan</button>
    </div>`;

  const readTime = () => {
    if (!$("fTimeMinutes").value && !$("fTimeSeconds").value) return "";
    return durationValue($("fTimeMinutes").value, $("fTimeSeconds").value);
  };
  const recalc = () => ($("fPace").textContent = fmtPace(paceSeconds($("fDistance").value, readTime())) || "–");
  $("fDistance").addEventListener("input", recalc);
  $("fTimeMinutes").addEventListener("input", recalc);
  $("fTimeSeconds").addEventListener("input", () => {
    if (+$("fTimeSeconds").value > 59) $("fTimeSeconds").value = "59";
    recalc();
  });

  const collect = () => ({
    ...log[id],
    distance: $("fDistance").value.trim(),
    time: readTime(),
    hr: $("fHr").value.trim(),
    feel: $("fFeel").value,
    note: $("fNote").value.trim(),
  });

  $("saveSession").addEventListener("click", () => {
    log[id] = collect(); saveLog();
    toast("Opgeslagen 💾");
    closeDetail();
  });
  $("toggleDone").addEventListener("click", () => {
    const cur = collect();
    cur.done = !cur.done;
    log[id] = cur; saveLog();
    if (cur.done) {
      celebrate();
      toast(!isRaceDetail
        ? DONE[Math.floor(Math.random() * DONE.length)]
        : w.race
          ? "🏅 Rotterdam! Wat een duo, strijders!"
          : `${s.title} gedaan! Vul je tijd in, die verschijnt op de route.`);
    }
    closeDetail();
  });

  showView("detail");
}

function closeDetail() { renderAll(); showView("list"); }

function showView(name) {
  const list = $("listView"), detail = $("detailView"), back = $("backButton");
  if (name === "detail") {
    list.classList.add("hidden");
    detail.classList.remove("hidden");
    requestAnimationFrame(() => detail.classList.add("is-in"));
    back.classList.remove("hidden");
    window.scrollTo(0, 0);
  } else {
    detail.classList.remove("is-in");
    back.classList.add("hidden");
    setTimeout(() => {
      detail.classList.add("hidden");
      list.classList.remove("hidden");
      window.scrollTo(0, 0);
    }, 280);
  }
}

/* ----- Invliegende beelden -------------------------------------------- */
let io, initialRevealDone = false;
function observeReveals() {
  // Na de eerste keer: nieuw getekende blokken meteen tonen (geen her-animatie bij navigeren)
  if (initialRevealDone) {
    document.querySelectorAll(".reveal:not(.in)").forEach((el) => el.classList.add("in"));
    return;
  }
  io = io || new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
}

/* ----- Toast ----------------------------------------------------------- */
let toastT;
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ----- Confetti --------------------------------------------------------- */
function celebrate() {
  const cv = $("confetti");
  const ctx = cv.getContext("2d");
  cv.width = innerWidth; cv.height = innerHeight;
  const cs = getComputedStyle(document.documentElement);
  const colors = ["--volt", "--flame", "--pastel-blue", "--violet"]
    .map((v) => cs.getPropertyValue(v).trim()).filter(Boolean).concat("#ffffff");
  const parts = Array.from({ length: 140 }, () => ({
    x: innerWidth / 2, y: innerHeight / 3,
    vx: (Math.random() - 0.5) * 14, vy: Math.random() * -16 - 4,
    s: Math.random() * 7 + 4, c: colors[(Math.random() * colors.length) | 0],
    r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.4,
  }));
  let frame = 0;
  (function loop() {
    frame++;
    ctx.clearRect(0, 0, cv.width, cv.height);
    parts.forEach((p) => {
      p.vy += 0.45; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
      ctx.restore();
    });
    if (frame < 120) requestAnimationFrame(loop);
    else ctx.clearRect(0, 0, cv.width, cv.height);
  })();
}

/* ================================================================== *
 *  Init
 * ================================================================== */
/* Branding uit CONFIG zetten (zodat templaten makkelijk is) */
document.title = `${CONFIG.appName}, ${CONFIG.coachHandle}`;
if ($("appName")) $("appName").textContent = CONFIG.appName;
if ($("brandHandle")) $("brandHandle").textContent = CONFIG.coachHandle;
if ($("footCredit")) {
  $("footCredit").innerHTML =
    `<span class="catch">${CONFIG.catchphrase}</span>` +
    `Coaching door ${CONFIG.coachName} · TikTok <strong>${CONFIG.coachHandle}</strong> ${CONFIG.footEmoji || "🏃\u200d♀️"}`;
}

function setPlanningForm(open) {
  const form = $("planningForm");
  const toggle = $("togglePlanningForm");
  form.classList.toggle("hidden", !open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.textContent = open ? "× Sluiten" : "＋ Toevoegen";
  if (open && !$("planStart").value) $("planStart").value = isoDate(new Date());
}

$("togglePlanningForm").addEventListener("click", () => {
  setPlanningForm($("planningForm").classList.contains("hidden"));
});
$("cancelPlanning").addEventListener("click", () => setPlanningForm(false));
$("planningForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const start = $("planStart").value;
  const end = $("planEnd").value || start;
  if (end < start) {
    toast("De einddatum ligt vóór de startdatum");
    return;
  }
  const entry = {
    id: `plan-${Date.now()}`,
    type: $("planType").value,
    title: $("planTitle").value.trim(),
    start,
    end,
    note: $("planNote").value.trim(),
  };
  log.__planning = [...planningEntries(), entry];
  saveLog();
  $("planningForm").reset();
  setPlanningForm(false);
  renderAll();
  toast("Toegevoegd aan je schema 🗓️");
});

$("backButton").addEventListener("click", closeDetail);
$("resetButton").addEventListener("click", () => {
  if (confirm("Alle ingevulde voortgang wissen?")) { log = {}; saveLog(); renderAll(); toast("Voortgang gewist"); }
});

/* ----- Back-up: exporteren / importeren ------------------------------- */
function downloadJSON(filename, obj) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" }));
  a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function downloadText(filename, text, type) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function icsEscape(value) {
  return String(value || "")
    .replaceAll("\\", "\\\\")
    .replaceAll(/\r?\n/g, "\\n")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;");
}

function icsDay(value) {
  const date = typeof value === "string" ? new Date(`${value}T12:00:00`) : value;
  return isoDate(date).replaceAll("-", "");
}

function addDays(value, amount) {
  const date = typeof value === "string" ? new Date(`${value}T12:00:00`) : new Date(value);
  date.setDate(date.getDate() + amount);
  return date;
}

function calendarFile() {
  const stamp = new Date().toISOString().replaceAll(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "PRODID:-//bartlopen//Run Coach//NL",
    `X-WR-CALNAME:${icsEscape(CONFIG.appName)} · ${icsEscape(RUNNER)}`,
  ];
  flatSessions.forEach((session) => {
    const date = sessionDate(session.week, session.day);
    const z = zoneByKey[session.zone];
    lines.push(
      "BEGIN:VEVENT",
      `UID:${sid(session.week, session.day)}-${icsDay(date)}@bartlopen.nl`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${icsDay(date)}`,
      `DTEND;VALUE=DATE:${icsDay(addDays(date, 1))}`,
      `SUMMARY:${icsEscape(`${CONFIG.footEmoji || "🏃\u200d♀️"} ${session.title}`)}`,
      `DESCRIPTION:${icsEscape(`${nlNum(session[UNIT])} ${UNIT_LABEL} · ${z.name}\n${session.goal}\n\n${session.blocks.join("\n")}`)}`,
      "TRANSP:TRANSPARENT",
      "END:VEVENT",
    );
  });
  planningEntries().forEach((entry) => {
    const meta = PLANNING_META[entry.type] || PLANNING_META.rest;
    lines.push(
      "BEGIN:VEVENT",
      `UID:${icsEscape(entry.id)}@bartlopen.nl`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${icsDay(entry.start)}`,
      `DTEND;VALUE=DATE:${icsDay(addDays(entry.end || entry.start, 1))}`,
      `SUMMARY:${icsEscape(`${meta.icon} ${entry.title}`)}`,
      `DESCRIPTION:${icsEscape(`${entry.note ? `${entry.note}\n\n` : ""}Coachadvies: ${meta.advice}`)}`,
      "TRANSP:TRANSPARENT",
      "END:VEVENT",
    );
  });
  if (wieBenIk() !== "Bart") PLAN.filter((w) => w.event).forEach((w) => {
    const d = sessionDate(w.week, w.event.day);
    lines.push("BEGIN:VEVENT", `UID:event-w${w.week}-${icsDay(d)}@bartlopen.nl`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${icsDay(d)}`, `DTEND;VALUE=DATE:${icsDay(addDays(d, 1))}`,
      `SUMMARY:${icsEscape(`${w.event.titel} (Michael)`)}`, `DESCRIPTION:${icsEscape(w.event.tekst)}`, "TRANSP:TRANSPARENT", "END:VEVENT");
  });
  lines.push("END:VCALENDAR");
  return `${lines.join("\r\n")}\r\n`;
}
$("exportBtn").addEventListener("click", () => {
  downloadJSON(`${CONFIG.appName.replace(/\s+/g, "-")}-voortgang.json`, {
    app: "bartlopen-runcoach", storeKey: STORE_KEY, runner: RUNNER,
    exportedAt: new Date().toISOString(), log,
  });
  toast("Back-up opgeslagen ⬇︎");
});
$("importBtn").addEventListener("click", () => $("importFile").click());
$("importFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      const incoming = data && data.log ? data.log : data;
      if (!incoming || typeof incoming !== "object") throw new Error("ongeldig");
      log = { ...log, ...incoming };
      saveLog(); renderAll();
      toast("Back-up geladen ⬆︎, welkom terug!");
    } catch {
      toast("Kon dit bestand niet lezen");
    }
    e.target.value = "";
  };
  reader.readAsText(file);
});

$("calendarBtn").addEventListener("click", () => {
  downloadText(`${CONFIG.appName.replace(/\s+/g, "-")}-schema.ics`, calendarFile(), "text/calendar;charset=utf-8");
  toast("Agenda-bestand staat klaar 🗓️");
});

$("pdfBtn").addEventListener("click", () => {
  document.body.classList.add("print-schema");
  const cleanup = () => document.body.classList.remove("print-schema");
  window.addEventListener("afterprint", cleanup, { once: true });
  window.print();
  setTimeout(cleanup, 1500);
});

/* Alles tekenen */
renderAll();
renderLaatstOpgeslagen();
herstelUitBackup();
/* Na de intro-animatie geen her-fade meer; failsafe die alles zeker toont */
setTimeout(() => { initialRevealDone = true; }, 900);
setTimeout(() => document.querySelectorAll(".reveal:not(.in)").forEach((el) => el.classList.add("in")), 1600);

/* Intro-splash netjes weg laten faden (tikken slaat 'm over) */
(function () {
  const splash = $("splash");
  if (!splash) return;
  const hide = () => splash.classList.add("gone");
  setTimeout(hide, 1100);
  splash.addEventListener("click", hide);
  setTimeout(() => splash.remove(), 1700);
})();

/* Service worker voor offline gebruik (alleen op http/https, niet via file://) */
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  /* Auto-verversen: nieuwe versie neemt over -> pagina herlaadt zichzelf een keer */
  const hadController = !!navigator.serviceWorker.controller;
  let autoReloaded = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController || autoReloaded) return;
    autoReloaded = true;
    window.location.reload();
  });
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

/* Vraag de browser om je voortgang echt te bewaren. Zonder dit mag een
   browser opgeslagen gegevens opruimen als er ruimte nodig is, en dan ben
   je je afgevinkte trainingen kwijt. */
if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persisted()
    .then((al) => (al ? true : navigator.storage.persist()))
    .catch(() => {});
}
