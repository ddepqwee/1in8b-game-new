// Кладёт в www/vendor всё, что раньше грузилось из интернета: шрифты, конфетти, мост к платформе.
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, ".."), out = path.join(root, "www", "vendor");
fs.mkdirSync(path.join(out, "fonts"), { recursive: true });
const FONTS = [["Unbounded", "unbounded", [400, 600, 800]], ["Manrope", "manrope", [400, 500, 700]], ["JetBrains Mono", "jetbrains-mono", [400, 600]]];
const RANGES = {
  cyrillic: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116",
  latin: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
};
let css = "";
for (const [family, pkg, weights] of FONTS) for (const w of weights) for (const [sub, range] of Object.entries(RANGES)) {
  const file = `${pkg}-${sub}-${w}-normal.woff2`;
  fs.copyFileSync(path.join(root, "node_modules/@fontsource", pkg, "files", file), path.join(out, "fonts", file));
  css += `@font-face{font-family:"${family}";font-style:normal;font-display:swap;font-weight:${w};src:url(fonts/${file}) format("woff2");unicode-range:${range}}\n`;
}
fs.writeFileSync(path.join(out, "fonts.css"), css);
fs.copyFileSync(path.join(root, "node_modules/canvas-confetti/dist/confetti.browser.js"), path.join(out, "confetti.js"));
require("esbuild").buildSync({ entryPoints: [path.join(root, "src/platform.js")], bundle: true, minify: true, format: "iife", outfile: path.join(out, "platform.js"), target: ["safari15", "chrome100"] });
console.log("vendor: fonts, confetti, platform готовы");
