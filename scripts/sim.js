// Прогон движка без интерфейса: тысячи случайных жизней. Проверяет, что ничего не падает,
// что средняя длина жизни близка к данным ООН, и считает, сколько контента видит игрок.
// node scripts/sim.js [жизней] [ru|en]
const fs = require("fs"), path = require("path"), vm = require("vm");
const N = +process.argv[2] || 3000, LANG = process.argv[3] || "ru";
const www = path.join(__dirname, "..", "www");
const store = {};
const ctx = { console, Math, JSON, Date, Object, Array, String, Number, Set, Map, Promise, isNaN };
ctx.window = ctx; ctx.globalThis = ctx;
ctx.localStorage = { getItem: k => k === "lottery.lang" ? JSON.stringify(LANG) : store[k] ?? null, setItem: (k, v) => store[k] = v };
ctx.navigator = { language: LANG };
ctx.document = { documentElement: {} };
vm.createContext(ctx);
const FILES = ["i18n.js", "data/countries.js", "data/names.js", "data/content.js", "data/content-world.js", "data/content-life.js", "data/content-career.js", "data/content-family.js", "data/content-roads.js", "data/content-days.js", "data/content-everyday.js", "data/content-places.js", "data/content-meta.js", "data/content-legacy.js", "data/content-eras.js", "data/content-arcs.js", "data/names-en.js", "data/lang-en.js", "engine.js"];
for (const f of FILES.filter(f => fs.existsSync(path.join(www, f)))) vm.runInContext(fs.readFileSync(path.join(www, f), "utf8") + "\n;Object.assign(window, {COUNTRIES: typeof COUNTRIES !== 'undefined' ? COUNTRIES : undefined})", ctx, { filename: f });
const run = code => vm.runInContext(code, ctx);

ctx.UNLOCKED = run("ACHIEVEMENTS.map(a => a.id)");
const cardsSeen = {}, eventsSeen = {}, endings = {}, dreams = {}, ach = {};
let ages = 0, choices = 0, stages = 0, errors = 0, heir = null;
const byCountry = {};
for (let i = 0; i < N; i++) {
  try {
    // примерно треть жизней с детьми продолжается за ребёнка, чтобы проверить династию
    const p = heir ? run("newHeir(__par, __kid)") : run("newPerson()");
    if (heir) p.gen = (heir.gen || 1) + 1;
    heir = null;
    ctx.__p = p;
    let st = 0;
    // как autoLife, но со счётом карточек
    while (p.alive) {
      if (p.age === 15 && !p.dream) p.dream = run("pick(dreamChoices(__p))");
      p.focus = run("pick(FOCUS.filter(f => !f.min || __p.age >= f.min)).id");
      const used = [];
      for (const card of run("cardsFor(__p)")) {
        ctx.__c = card;
        if (!run("eligible(__p, __c)")) continue;
        used.push(card.id); cardsSeen[card.id] = (cardsSeen[card.id] || 0) + 1; choices++;
        run("resolve(__p, __c, pick(optionsOf(__p, __c)))");
      }
      ctx.__used = used;
      const extra = run("followUp(__p, __used)");
      if (extra) { ctx.__c = extra; cardsSeen[extra.id] = (cardsSeen[extra.id] || 0) + 1; choices++; run("resolve(__p, __c, pick(optionsOf(__p, __c)))"); }
      run("liveStage(__p)"); st++;
      // каждая строка биографии и каждый текст должны собираться без ошибок
      for (const [, s] of p.log) if (typeof s !== "string" || /undefined|NaN|\[object/.test(s)) throw new Error("bad log: " + s);
    }
    for (const id of p.evs || []) eventsSeen[id] = (eventsSeen[id] || 0) + 1;
    const end = run("typeof endingOf === 'function' ? endingOf(__p) : null");
    if (end) endings[end.id] = (endings[end.id] || 0) + 1;
    if (p.dream) dreams[p.dream.id] = (dreams[p.dream.id] || 0) + (p.dreamDone ? 1 : 0);
    for (const id of run("achievementsOf(__p, [])")) ach[id] = (ach[id] || 0) + 1;
    ages += p.age; stages += st;
    if (p.kids.length && Math.random() < .35) {
      p.f.job = p.job; p.rep = run("REP_OF(__p)");
      heir = p; ctx.__par = p; ctx.__kid = p.kids[Math.floor(Math.random() * p.kids.length)];
    }
    const c = byCountry[p.home.n] || (byCountry[p.home.n] = { n: 0, s: 0, le: p.home.le });
    c.n++; c.s += p.age;
  } catch (e) { errors++; if (errors < 5) console.error(e.stack); }
}
const allCards = run("CARDS.map(c => c.id)"), allEvents = run("EVENTS.map(e => e.id)");
console.log(`жизней ${N}, ошибок ${errors}`);
console.log(`средний возраст ${(ages / N).toFixed(1)}, этапов на жизнь ${(stages / N).toFixed(1)}, решений на жизнь ${(choices / N).toFixed(1)}`);
console.log(`карточек ${allCards.length}, видели ${Object.keys(cardsSeen).length}; событий ${allEvents.length}, видели ${Object.keys(eventsSeen).length}`);
const never = allCards.filter(id => !cardsSeen[id]);
if (never.length) console.log("карточки, которые не выпали ни разу:", never.join(", "));
const neverE = allEvents.filter(id => !eventsSeen[id] && id !== "none");
if (neverE.length) console.log("события, которые не выпали ни разу:", neverE.join(", "));
const top = Object.entries(byCountry).sort((a, b) => b[1].n - a[1].n).slice(0, 8);
console.log("страны (сим / ООН):", top.map(([n, c]) => `${n} ${(c.s / c.n).toFixed(1)}/${c.le}`).join(", "));
if (Object.keys(endings).length) {
  const all = run("ENDINGS.map(e => e.id)");
  console.log(`итоги жизни: ${Object.keys(endings).length} из ${all.length}`);
  console.log(Object.entries(endings).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${(v / N * 100).toFixed(1)}%`).join(", "));
  const nE = all.filter(id => !endings[id]); if (nE.length) console.log("итоги, которые не выпали:", nE.join(", "));
}
const allA = run("ACHIEVEMENTS.map(a => a.id)");
console.log("достижения, которые не выпали:", allA.filter(id => !ach[id]).join(", ") || "нет");
process.exit(errors ? 1 : 0);
