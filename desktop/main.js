// Десктопная версия для Steam: окно с игрой, полноэкранный режим, достижения Steam.
const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("path");
const fs = require("fs");

// ID игры в Steam: переменная окружения STEAM_APP_ID или файл steam_appid.txt рядом с программой.
// 480 — тестовое приложение Valve (Spacewar), им можно проверять интеграцию до получения своего ID.
function steamAppId() {
  if (process.env.STEAM_APP_ID) return +process.env.STEAM_APP_ID;
  for (const dir of [path.dirname(process.execPath), app.getAppPath(), process.cwd()]) {
    const file = path.join(dir, "steam_appid.txt");
    if (fs.existsSync(file)) return +fs.readFileSync(file, "utf8").trim();
  }
  return null;
}

let steam = null;
function initSteam() {
  const id = steamAppId();
  if (!id) return;
  try {
    steam = require("steamworks.js").init(id);
    console.log("Steam:", steam.localplayer.getName());
  } catch (e) {
    console.warn("Steam недоступен, игра работает без него:", e.message);
  }
}

// Игровые достижения → имена API в Steamworks (их нужно создать в панели Steamworks с такими же именами).
const ACH = id => "ACH_" + id.toUpperCase();

function createWindow() {
  const win = new BrowserWindow({
    width: 1280, height: 860, minWidth: 420, minHeight: 680,
    backgroundColor: "#0f1424", title: "Life by Chance", show: false, autoHideMenuBar: true,
    icon: path.join(__dirname, "..", "store", "icon-512.png"),
    webPreferences: { preload: path.join(__dirname, "preload.js"), contextIsolation: true, nodeIntegration: false },
  });
  Menu.setApplicationMenu(null);
  win.once("ready-to-show", () => win.show());
  win.webContents.on("before-input-event", (e, input) => {
    if (input.type === "keyDown" && (input.key === "F11" || (input.alt && input.key === "Enter"))) { win.setFullScreen(!win.isFullScreen()); e.preventDefault(); }
  });
  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  win.loadFile(path.join(__dirname, "..", "www", "index.html"));
}

ipcMain.handle("steam:unlock", (e, ids) => {
  if (!steam) return false;
  for (const id of ids) { try { steam.achievement.activate(ACH(id)); } catch (err) {} }
  return true;
});
ipcMain.handle("app:quit", () => app.quit());

app.whenReady().then(() => { initSteam(); createWindow(); });
app.on("window-all-closed", () => app.quit());
// нужно для оверлея Steam
try { require("steamworks.js").electronEnableSteamOverlay(); } catch (e) {}
