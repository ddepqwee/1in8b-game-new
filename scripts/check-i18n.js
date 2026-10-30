// Проверка переводов: загружает игру на английском и ищет русские буквы во всех текстах,
// а на русском — пустые строки. Тексты-функции вызываются на «полном» персонаже (партнёр, дети, друг).
// node scripts/check-i18n.js
const fs = require("fs"), path = require("path"), vm = require("vm");
const www = path.join(__dirname, "..", "www");
const html = fs.readFileSync(path.join(www, "index.html"), "utf8");
const FILES = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]).filter(f => !f.startsWith("vendor/"));

function load(lang) {
  const ctx = { console, Math, JSON, Date, Object, Array, String, Number, Set, Map };
  ctx.window = ctx;
  ctx.localStorage = { getItem: k => k === "lottery.lang" ? JSON.stringify(lang) : null, setItem() {} };
  ctx.navigator = { language: lang }; ctx.document = { documentElement: {} };
  vm.createContext(ctx);
  for (const f of FILES) vm.runInContext(fs.readFileSync(path.join(www, f), "utf8"), ctx, { filename: f });
  return ctx;
}

let bad = 0;
for (const lang of ["en", "ru"]) {
  const ctx = load(lang);
  const run = code => vm.runInContext(code, ctx);
  run("setSeed(1)");
  const p = run(`(() => { const p = newPerson(COUNTRIES[0]); p.age = 50; meetPartner(p); p.married = true; p.f.marriedAt = 20;
    p.kids = [makeKid(p), makeKid(p)]; p.kids[0].born = 25; p.kids[1].born = 35; makeFriend(p); p.job = "doctor"; p.f.trips = 2;
    p.dream = DREAMS[0]; p._trip = "X"; p._kid = p.kids[0]; p.f.biz = 1; p.home = COUNTRIES[5]; return p; })()`);
  const check = (where, v) => {
    if (typeof v === "function") { try { v = v(p); } catch (e) { return; } }
    if (v == null) return;
    if (typeof v !== "string") { console.log(`${lang} ${where}: не строка`); bad++; return; }
    if (!v.trim() || v.includes("undefined")) { console.log(`${lang} ${where}: пусто или undefined: «${v}»`); bad++; }
    if (lang === "en" && /[а-яё]/i.test(v)) { console.log(`en ${where}: «${v}»`); bad++; }
  };
  for (const c of ctx.CARDS) {
    check(`card ${c.id}.t`, c.t); check(`card ${c.id}.q`, c.q);
    c.o.forEach((o, i) => { check(`card ${c.id}[${i}].l`, o.l); check(`card ${c.id}[${i}].ys`, o.ys); check(`card ${c.id}[${i}].ns`, o.ns); });
  }
  for (const e of ctx.EVENTS) check(`event ${e.id}`, e.s);
  for (const [id, t] of Object.entries(ctx.TRAITS)) { check(`trait ${id}.n`, t.n); check(`trait ${id}.d`, t.d); }
  for (const [id, j] of Object.entries(ctx.JOBS)) { check(`job ${id}`, j.n); if (lang === "en" && (j.nf || j.nm)) { console.log(`en job ${id}: лишняя женская или мужская форма`); bad++; } }
  for (const d of ctx.DREAMS) { check(`dream ${d.id}.t`, d.t); check(`dream ${d.id}.d`, d.d); }
  for (const a of ctx.ACHIEVEMENTS) { check(`ach ${a.id}.n`, a.n); check(`ach ${a.id}.d`, a.d); }
  for (const e of ctx.ENDINGS || []) { check(`ending ${e.id}.n`, e.n); check(`ending ${e.id}.d`, e.d); check(`ending ${e.id}.hint`, e.hint); }
  for (const c of ctx.CHALLENGES || []) { check(`challenge ${c.id}.n`, c.n); check(`challenge ${c.id}.d`, c.d); check(`challenge ${c.id}.goal`, c.goal); }
  for (const f of ctx.FOCUS) { check(`focus ${f.id}`, f.n); check(`focus ${f.id}.d`, f.d); }
  const ids = new Set();
  for (const c of ctx.CARDS) { if (ids.has(c.id)) { console.log(`${lang} повтор id карточки: ${c.id}`); bad++; } ids.add(c.id); }
  const eids = new Set();
  for (const e of ctx.EVENTS) { if (eids.has(e.id)) { console.log(`${lang} повтор id события: ${e.id}`); bad++; } eids.add(e.id); }
}
// Steam: каждое достижение есть в списке для Steamworks
const ctx = load("ru");
const csv = fs.readFileSync(path.join(__dirname, "..", "store", "steam-achievements.csv"), "utf8");
for (const a of ctx.ACHIEVEMENTS) if (!csv.includes("ACH_" + a.id.toUpperCase() + ",")) { console.log(`нет в store/steam-achievements.csv: ACH_${a.id.toUpperCase()}`); bad++; }
console.log(bad ? `проблем: ${bad}` : "переводы в порядке");
process.exit(bad ? 1 : 0);
