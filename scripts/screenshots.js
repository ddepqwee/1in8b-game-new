// Скриншоты для магазинов: App Store (iPhone 6.9", iPad 13"), Google Play, Steam.
// Запуск: npm run vendor && npm run shots → store/screenshots/<платформа>/NN-сцена.png
const { chromium } = require("playwright");
const path = require("path"), fs = require("fs");
const root = path.join(__dirname, "..");
const SIZES = {
  "ios-6.9": { width: 440, height: 956, scale: 3 },      // 1320×2868
  "ios-ipad-13": { width: 1032, height: 1376, scale: 2 }, // 2064×2752
  "android-phone": { width: 412, height: 915, scale: 2.625 }, // 1082×2402
  "steam": { width: 1920, height: 1080, scale: 1 },
};
const SEED = {
  "lottery.atlas": ["Индия", "Нигерия", "Бразилия", "Россия", "Япония", "Эфиопия", "Мексика", "Вьетнам", "Германия", "Египет", "Перу", "Кения"],
  "lottery.ach": ["c90", "rare", "migr", "trips3", "giver"],
  "lottery.lives": [
    { name: "Аарав Шарма", country: "Индия", age: 78, score: 1326, date: "2026-10-24" },
    { name: "Чиамака Оконкво", country: "Нигерия", age: 61, score: 2054, date: "2026-10-24" },
    { name: "Мария Силва", country: "Бразилия", age: 84, score: 1580, date: "2026-10-23" },
  ],
};
(async () => {
  const browser = await chromium.launch();
  for (const [name, s] of Object.entries(SIZES)) {
    const dir = path.join(root, "store", "screenshots", name);
    fs.mkdirSync(dir, { recursive: true });
    const pg = await browser.newPage({ viewport: { width: s.width, height: s.height }, deviceScaleFactor: s.scale });
    await pg.addInitScript(seed => { for (const [k, v] of Object.entries(seed)) localStorage.setItem(k, JSON.stringify(v)); localStorage.setItem("lottery.sound", "false"); }, SEED);
    await pg.goto("file://" + path.join(root, "www", "index.html"));
    await pg.waitForSelector("#b-random"); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(1200);
    await pg.screenshot({ path: path.join(dir, "01-start.png") });

    await pg.evaluate(() => { setSeed("promo-7"); P = newPerson(COUNTRIES.find(c => c.n === "Нигерия")); twins = [0, 1, 2, 3].map(() => newPerson()); screenBirth(); });
    await pg.waitForTimeout(3500);
    await pg.screenshot({ path: path.join(dir, "02-birth.png") });

    await pg.evaluate(() => {
      Object.assign(P.r, { h: 72, m: 38, k: 64, t: 58, j: 61 }); P.age = 20; P.dream = DREAMS.find(d => d.id === "away"); P.f.uni = true; P.f.school = true;
      renderGame(); queue = [CARDS.find(c => c.id === "abroad")]; used = []; extraLeft = 0; playCard();
    });
    await pg.waitForTimeout(900);
    await pg.click("#stage .option >> nth=0");
    await pg.waitForTimeout(1900);
    await pg.screenshot({ path: path.join(dir, "03-choice.png") });

    await pg.evaluate(() => { queue = []; finishStage(); });
    await pg.waitForTimeout(4200);
    await pg.screenshot({ path: path.join(dir, "04-years.png") });

    await pg.evaluate(() => { setSeed("promo-end"); while (P.alive) { P.focus = "health"; liveStage(P); } screenEnd(); });
    await pg.waitForTimeout(5000);
    await pg.screenshot({ path: path.join(dir, "05-finale.png") });
    await pg.close();
    console.log("скриншоты:", name);
  }
  await browser.close();
})();
