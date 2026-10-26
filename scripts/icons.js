// Рисует иконку и заставку (точки рождений и одна золотая — ты) и сохраняет PNG в store/ и assets/.
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
function art(size, { glow = .34, dots = 140, seed = 7 } = {}) {
  let s = seed; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const pts = Array.from({ length: dots }, () => `<circle cx="${(r() * size).toFixed(1)}" cy="${(r() * size).toFixed(1)}" r="${(size / 512 * (1 + r() * 2.2)).toFixed(1)}" fill="#e9e6f2" opacity="${(.15 + r() * .45).toFixed(2)}"/>`).join("");
  const c = size / 2, R = size * .11;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs><radialGradient id="bg" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="#1f2848"/><stop offset="1" stop-color="#0b1020"/></radialGradient>
  <radialGradient id="glow"><stop offset="0" stop-color="#f6d29a" stop-opacity="1"/><stop offset=".35" stop-color="#f2b45a" stop-opacity=".55"/><stop offset="1" stop-color="#f2b45a" stop-opacity="0"/></radialGradient></defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>${pts}
  <circle cx="${c}" cy="${c}" r="${size * glow}" fill="url(#glow)"/>
  <circle cx="${c}" cy="${c}" r="${R * 1.9}" fill="none" stroke="#f2b45a" stroke-opacity=".35" stroke-width="${size / 170}"/>
  <circle cx="${c}" cy="${c}" r="${R}" fill="#f2b45a"/></svg>`;
}
(async () => {
  const b = await chromium.launch(), pg = await b.newPage();
  const out = [["store/icon-1024.png", 1024], ["store/icon-512.png", 512], ["assets/icon-only.png", 1024], ["assets/icon-foreground.png", 1024, { dots: 0, glow: .3 }], ["assets/splash.png", 2732, { dots: 600, glow: .12 }], ["assets/splash-dark.png", 2732, { dots: 600, glow: .12 }]];
  for (const [file, size, opt] of out) {
    fs.mkdirSync(path.join(root, path.dirname(file)), { recursive: true });
    await pg.setViewportSize({ width: size, height: size });
    await pg.setContent(`<style>body{margin:0}</style>${art(size, opt)}`);
    await pg.screenshot({ path: path.join(root, file), omitBackground: false });
  }
  fs.writeFileSync(path.join(root, "assets/icon-background.png"), fs.readFileSync(path.join(root, "store/icon-1024.png")));
  await b.close(); console.log("иконки готовы");
})();
