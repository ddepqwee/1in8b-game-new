// Движок: рождение, имена, решения, события, смертность, очки. Без интерфейса.

// ---------- Случайность ----------
function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function hashStr(s) { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
let rng = Math.random;
function setSeed(seed) { rng = seed == null ? Math.random : mulberry32(hashStr(String(seed))); }
const pick = arr => arr[Math.floor(rng() * arr.length)];
const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
function weighted(items, w) { const ws = items.map(w); let r = rng() * ws.reduce((s, x) => s + x, 0); for (let i = 0; i < items.length; i++) { r -= ws[i]; if (r <= 0) return items[i]; } return items[items.length - 1]; }
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const g = (p, m, f) => p.sex === "f" ? f : m;
const txt = (v, p) => typeof v === "function" ? v(p) : v;

// ---------- Страны ----------
const GOMPERTZ_B = 0.085;
// поправка: события и решения в среднем немного вредят здоровью, это возвращает среднюю длину жизни к данным ООН
const HAZARD_FIX = 0.85;
const COUNTRIES = window.COUNTRY_ROWS.trim().split("\n").map(line => {
  const [n, b, le, u5, gdp, reg, part] = line.split(";");
  const en = window.LANG === "en";
  // n — внутреннее имя (ключ в данных), name и partName — для показа на выбранном языке
  return { n, name: en ? window.COUNTRY_EN[n] || n : n, b: Math.max(+b, .003), le: +le, u5: +u5 / 100, g: +gdp, reg, part, partName: en ? window.PART_EN[part] || part : part };
});
const TOTAL_SHARE = COUNTRIES.reduce((s, c) => s + c.b, 0);
function e5(A) { let s = 1, sum = 0; for (let x = 5; x < 120; x++) { const p = 1 - Math.exp(-A * Math.exp(GOMPERTZ_B * x)); sum += s * (1 - p / 2); s *= 1 - p; } return sum; }
function calibrate(c) {
  const target = (c.le - c.u5 * 0.8) / (1 - c.u5) - 5;
  let lo = Math.log(1e-7), hi = Math.log(0.2);
  for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (e5(Math.exp(mid)) > target) lo = mid; else hi = mid; }
  return Math.exp((lo + hi) / 2);
}
COUNTRIES.forEach(c => {
  c.A = calibrate(c);
  c.d = clamp((Math.log(c.g) - Math.log(1400)) / (Math.log(75000) - Math.log(1400)), 0, 1);
  c.odds = Math.round(TOTAL_SHARE / c.b);
});
const pickCountry = (p, filter = c => c !== p.c) => weighted(COUNTRIES.filter(filter), c => Math.sqrt(c.b));

// ---------- Имена ----------
function nameSet(reg) { const all = window.LANG === "en" && window.NAMES_EN ? window.NAMES_EN : window.NAMES; return all[reg] || all.en; }
function surnameFor(base, sex) { return Array.isArray(base) ? base[sex === "f" ? 1 : 0] : base; }
function fullName(x) { return x.order === "sf" ? `${x.last} ${x.first}` : `${x.first} ${x.last}`; }
// family: { base, father } — общая фамилия семьи или имя отца для культур без фамилий
function personName(reg, sex, family) {
  const N = nameSet(reg);
  const first = pick(N[sex === "f" ? "f" : "m"]);
  let last;
  if (N.father) last = family.father;
  else { last = surnameFor(family.base, sex); if (N.two && family.base2) last += " " + family.base2; }
  return { first, last, order: N.order };
}
function newFamily(reg) {
  const N = nameSet(reg);
  if (N.father) return { father: pick(N.m), grand: pick(N.m), motherFather: pick(N.m) };
  return { base: pick(N.s), base2: N.two ? pick(N.s) : null, motherBase: pick(N.s) };
}

// ---------- Человек ----------
const RES = [["h", tr("Здоровье", "Health")], ["m", tr("Деньги", "Money")], ["k", tr("Знания", "Knowledge")], ["t", tr("Близкие", "Loved ones")], ["j", tr("Счастье", "Happiness")]];
const QUINTILE = tr(["", "очень бедной", "бедной", "средней", "обеспеченной", "богатой"], ["", "very poor", "poor", "middle-income", "well-off", "wealthy"]);
const CONFLICTS = [["strong", "frail"], ["charm", "loner"], ["careful", "daring"]];

function rollTraits() {
  const ids = Object.keys(window.TRAITS), out = [pick(ids)];
  if (rng() < .45) {
    const second = pick(ids.filter(id => id !== out[0] && !CONFLICTS.some(([a, b]) => (a === out[0] && b === id) || (b === out[0] && a === id))));
    out.push(second);
  }
  return out;
}

function newPerson(country) {
  const c = country || weighted(COUNTRIES, x => x.b);
  const q = 1 + Math.floor(rng() * 5);
  const sex = rng() < 0.488 ? "f" : "m";
  const fam = newFamily(c.reg);
  const N = nameSet(c.reg);
  const nm = personName(c.reg, sex, fam);
  const ff = pick(N.m.filter(x => x !== nm.first));
  const father = N.father ? `${ff} ${fam.grand}` : fullName({ first: ff, last: surnameFor(fam.base, "m") + (N.two && fam.base2 ? " " + pick(N.s) : ""), order: N.order });
  const mf = pick(N.f.filter(x => x !== nm.first));
  const mother = N.father ? `${mf} ${fam.motherFather}` : fullName({ first: mf, last: N.two ? surnameFor(fam.base2, "f") : surnameFor(fam.base, "f"), order: N.order });
  if (N.father) nm.last = father.split(" ")[0];
  while (nm.first === nm.last) nm.first = pick(N[sex === "f" ? "f" : "m"]);
  const traits = rollTraits();
  const T = window.TRAITS;
  const h = clamp(Math.round(45 + (c.le - 55) * 1.3 + (rng() - .5) * 10 + traits.reduce((s, t) => s + (T[t].h0 || 0), 0)), 15, 98);
  return {
    c, home: c, q, sex, age: 0, alive: true, h0: h, traits, fam,
    first: nm.first, last: nm.last, order: nm.order,
    parents: { father, mother, fAlive: true, mAlive: true },
    siblings: Math.round(rng() * (1 + 5 * (1 - c.d))),
    r: { h, m: clamp(Math.round(8 + 55 * c.d + (q - 3) * 12 + (rng() - .5) * 8)), k: 5, t: clamp(Math.round(50 + (rng() - .5) * 30)), j: 55 },
    peak: {}, f: {}, job: null, jobLvl: 0, retired: false, partner: null, married: false, kids: [],
    focus: null, dream: null, dreamDone: false, log: [], seen: {}, deathAge: null, cause: null,
  };
}
function healthRef(p) { const a = p.age; return p.h0 - Math.max(0, a - 40) * 0.4 - Math.max(0, a - 60) * 0.6; }

function apply(p, eff, soft = 1) {
  const T = window.TRAITS, out = [];
  for (const [key, v0] of Object.entries(eff || {})) {
    if (!(key in p.r)) continue;
    let v = v0;
    if (v > 0) for (const t of p.traits) v *= (T[t].gain && T[t].gain[key]) || 1;
    else v *= soft;
    v = Math.round(v);
    if (!v) continue;
    p.r[key] = clamp(p.r[key] + v);
    p.peak[key] = Math.max(p.peak[key] || 0, p.r[key]);
    out.push([key, v]);
  }
  return out;
}

// ---------- Работа, переезд, семья ----------
function jobName(p, id = p.job) { const J = window.JOBS[id]; if (!J) return tr("Без работы", "Unemployed"); return p.sex === "f" ? (J.nf || J.n) : (J.nm || J.n); }
function setJob(p, id) {
  if (!id) return;
  p.job = id; p.jobLvl = 1; p.retired = false;
  if (id === "doctor") p.f.wasDoctor = true;
  if (id === "business") p.f.biz = p.f.biz || 1;
}
function pickBasicJob(p) {
  const d = p.c.d;
  return weighted(["farmer", "worker", "trader", "official"], j => ({ farmer: 3 * (1 - d) + .1, worker: 1.5, trader: 1, official: .3 + d })[j]);
}
function pickMidJob(p) {
  const opts = ["teacher", "trader", "master", "official"];
  if (p.r.k >= 60) opts.push("it", "engineer");
  return pick(opts.filter(j => j !== p.job));
}
function emigrate(p) {
  const dest = weighted(COUNTRIES.filter(c => c.d > .82 && c !== p.c), c => c.b);
  p.f.emigrated = true; p.f.returned = false; p.c = dest;
  p.log.push(["up", tr(`Переезд: ${dest.name}. Начинать заново тяжело, но возможностей больше.`, `Moved to ${dest.name}. Starting over is hard, but there are more opportunities.`), p.age]);
}
function returnHome(p) { p.c = p.home; p.f.returned = true; p.f.undocumented = false; }
function meetPartner(p) {
  const reg = p.c.reg, sex = p.sex === "f" ? "m" : "f";
  const fam = newFamily(reg);
  const nm = personName(reg, sex, fam);
  p.partner = { ...nm, sex, base: fam.base };
}
function makeKid(p) {
  const sex = rng() < .49 ? "f" : "m";
  const reg = p.f.emigrated && rng() < .5 ? p.c.reg : p.home.reg;
  const N = nameSet(p.home.reg);
  let last;
  if (N.father) last = p.sex === "m" ? p.first : (p.partner && p.partner.first) || p.first;
  else last = surnameFor(p.sex === "m" || !p.partner || !p.partner.base ? p.fam.base : p.partner.base, sex);
  return { first: pick(nameSet(reg)[sex]), last, sex, born: p.age };
}

// ---------- Решения ----------
function chanceOf(p, opt) {
  const base = opt.ch(p);
  if (base >= 1) return 1;
  const T = window.TRAITS;
  let bonus = 0;
  for (const tag of opt.tags || []) {
    for (const t of p.traits) bonus += (T[t].ch && T[t].ch[tag]) || 0;
    const F = window.FOCUS.find(f => f.id === p.focus);
    if (F && F.tag === tag) bonus += .06;
  }
  return clamp(base + bonus + (p.bonus && p.bonus.luck || 0), .03, .97);
}
const softMode = () => !!(window.SETTINGS && window.SETTINGS.soft);
function eligible(p, card) {
  if (card.heavy && softMode()) return false;
  if (p.age < card.from || p.age > card.to) return false;
  if (card.if && !card.if(p)) return false;
  const seen = p.seen[card.id];
  if (seen != null && !(card.repeat && p.age - seen >= card.repeat)) return false;
  return card.o.some(o => !o.if || o.if(p));
}
function cardsFor(p) {
  const all = window.CARDS.filter(c => eligible(p, c));
  const prio = all.filter(c => c.prio).slice(0, 2);
  const rest = all.filter(c => !c.prio);
  const out = prio.slice();
  const want = Math.min(3, prio.length + 2);
  while (out.length < want && rest.length) {
    const c = weighted(rest, x => txt(x.w, p) ?? 1);
    out.push(c); rest.splice(rest.indexOf(c), 1);
  }
  return out;
}
// продолжение ветки сразу после решения (не больше одной вставки за этап)
function followUp(p, used) {
  return window.CARDS.find(c => c.prio && !used.includes(c.id) && eligible(p, c));
}
function optionsOf(p, card) { return card.o.filter(o => !o.if || o.if(p)); }
function resolve(p, card, opt) {
  if (opt.pre) opt.pre(p);
  const chance = chanceOf(p, opt);
  const ok = rng() < chance;
  const soft = p.traits.includes("careful") ? window.TRAITS.careful.soft : 1;
  const changes = apply(p, ok ? opt.yes : (opt.no || {}), ok ? 1 : soft);
  if (ok && opt.set) opt.set(p);
  if (!ok && opt.setNo) opt.setNo(p);
  const text = txt(ok ? opt.ys : opt.ns, p);
  if (text) p.log.push([ok ? "up" : "down", `${card.t}: ${text}`, p.age]);
  p.seen[card.id] = p.age;
  return { ok, changes, text, chance };
}

// ---------- Ход времени ----------
function incomeFor(p) {
  if (p.age < 15 || p.f.jail) return 0;
  const d = p.c.d;
  let pay;
  if (p.retired) pay = 2 + 7 * d;
  else if (p.job) {
    const J = window.JOBS[p.job];
    pay = J.pay * (.45 + .8 * d) * (1 + .35 * (p.jobLvl - 1)) * (.8 + p.r.k / 250);
    if (p.job === "business") pay *= .7 + .4 * (p.f.biz || 1);
    if (p.f.famous) pay *= 1.5;
    if (p.f.undocumented) pay *= .6;
  } else pay = 2 + 2 * d;
  const cost = 3 + 4 * d + 1.5 * p.kids.filter(k => p.age - k.born < 20).length;
  return Math.round((pay - cost) / 1.2);
}

const CAUSES = {
  ill: ["болезнь, с которой не удалось справиться", "an illness that could not be beaten"],
  infection: ["инфекция", "an infection"], birth: ["осложнения после рождения", "complications after birth"], hunger: ["недоедание и болезнь", "malnutrition and disease"],
  accident: ["несчастный случай", "an accident"], infectious: ["инфекционная болезнь", "an infectious disease"], road: ["авария на дороге", "a road accident"], violence: ["насилие", "violence"],
  heart: ["болезнь сердца", "heart disease"], stroke: ["инсульт", "a stroke"], cancer: ["рак", "cancer"], sleep: ["старость, во сне", "old age, in their sleep"],
};
function deathCause(p, x) {
  const d = p.c.d;
  let c;
  if (p.f.ill) c = "ill";
  else if (x < 5) c = weighted(["infection", "birth", "hunger"], c => c === "hunger" ? 1 - d : 1);
  else if (x < 40) c = weighted(["accident", "infectious", "road", "violence"], c => c === "infectious" ? 1.5 - d : c === "violence" ? (softMode() ? 0 : .4) : 1);
  else if (x < 70) c = weighted(["heart", "stroke", "cancer", "infectious"], c => c === "infectious" ? 1 - d : 1);
  else c = weighted(["heart", "stroke", "cancer", "sleep"], c => c === "sleep" ? (x >= 85 ? 2 : .5) : 1);
  return tr(...CAUSES[c]);
}

function liveStage(p) {
  const F = window.FOCUS.find(f => f.id === p.focus);
  if (F && p.age >= 10) apply(p, F.e);
  const inc = incomeFor(p);
  if (inc) apply(p, { m: inc });

  const nEvents = rng() < .3 ? 2 : 1;
  for (let i = 0; i < nEvents; i++) {
    const ev = weighted(window.EVENTS, x => x.heavy && softMode() ? 0 : x.w(p));
    if (!ev.s) continue;
    const text = txt(ev.s, p);
    const changes = apply(p, ev.e);
    if (ev.act) ev.act(p);
    p.log.push([changes.some(([, v]) => v < 0) ? "down" : "up", text, p.age]);
  }
  if (p.age >= 40) apply(p, { h: -2 - (p.age >= 60 ? 3 : 0) });
  if (p.age >= 20) p.r.t = clamp(p.r.t - 3); // связи понемногу слабеют, если о них не заботиться
  // здоровье частично возвращается к норме страны и возраста: средние риски страны уже заложены в A
  p.r.h = clamp(Math.round(p.r.h + (healthRef(p) - p.r.h) * .45));
  p.r.j = clamp(Math.round(p.r.j * .6 + .4 * (.35 * p.r.m + .35 * p.r.t + .3 * p.r.h) + (p.traits.includes("optimist") ? 3 : 0)));
  p.f.bizMax = Math.max(p.f.bizMax || 0, p.f.biz || 0);
  for (const [k] of RES) p.peak[k] = Math.max(p.peak[k] || 0, p.r[k]);

  let mult = clamp(Math.exp((healthRef(p) - p.r.h) / 25), .4, 4);
  if (p.f.ill) mult *= 1.3;
  if (p.f.smoker && p.age >= 35) mult *= 1.15;
  for (let x = p.age; x < p.age + 5; x++) {
    let die;
    if (x < 5) { const w = [1.45, 1.2, 1, .85, .7][p.q - 1]; die = x === 0 ? rng() < p.c.u5 * w * .65 : rng() < p.c.u5 * w * .35 / 4; }
    else die = rng() < 1 - Math.exp(-p.c.A * Math.exp(GOMPERTZ_B * x) * mult * HAZARD_FIX);
    if (die || x >= 109) { p.cause = deathCause(p, x); p.age = x; p.alive = false; checkDream(p); return; }
  }
  p.age += 5;
  checkDream(p);
}
function checkDream(p) {
  if (p.dream && !p.dreamDone && p.dream.ok(p)) { p.dreamDone = true; p.log.push(["up", tr(`Мечта сбылась: ${p.dream.t.toLowerCase()}.`, `Dream come true: ${p.dream.t.toLowerCase()}.`), p.age]); }
}
function dreamChoices(p) { return shuffle(window.DREAMS.filter(d => !d.need || d.need(p))).slice(0, 3); }

// жизнь близнеца: случайный фокус и случайные решения
function autoLife(p) {
  while (p.alive) {
    if (p.age === 15 && !p.dream) p.dream = pick(dreamChoices(p));
    p.focus = pick(window.FOCUS.filter(f => !f.min || p.age >= f.min)).id;
    const used = [];
    for (const card of cardsFor(p)) { if (!eligible(p, card)) continue; used.push(card.id); resolve(p, card, pick(optionsOf(p, card))); }
    const extra = followUp(p, used);
    if (extra) resolve(p, extra, pick(optionsOf(p, extra)));
    liveStage(p);
  }
  return p;
}

function difficulty(p) { return 1 + 1.3 * (1 - p.home.d) + (3 - p.q) * .1; }
function score(p) { return Math.round((p.age * 10 + (p.dreamDone ? 600 : 0)) * difficulty(p)); }
function achievementsOf(p, atlas) { return window.ACHIEVEMENTS.filter(a => a.ok(p, atlas)).map(a => a.id); }
