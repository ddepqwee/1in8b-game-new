// Пересобирает store/steam-achievements.csv из данных игры: имя API, название и описание на русском и английском.
// node scripts/steam-achievements.js
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
  return ctx.ACHIEVEMENTS;
}
const ru = load("ru"), en = load("en");
const q = s => /[",]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
const rows = ["api_name,название,описание,name_en,description_en"];
ru.forEach((a, i) => rows.push([`ACH_${a.id.toUpperCase()}`, a.n, a.d, en[i].n, en[i].d].map(q).join(",")));
fs.writeFileSync(path.join(__dirname, "..", "store", "steam-achievements.csv"), rows.join("\n") + "\n");
console.log(`store/steam-achievements.csv: ${ru.length} достижений`);
