// Мост к платформе: телефон (Capacitor), десктоп для Steam (Electron) или обычный браузер.
// Собирается в www/vendor/platform.js командой `npm run vendor`.
import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { Preferences } from "@capacitor/preferences";
import { App } from "@capacitor/app";

const native = Capacitor.isNativePlatform();
const desktop = typeof window !== "undefined" && !!window.desktop;
const KEYS = ["lottery.lives", "lottery.atlas", "lottery.ach", "lottery.sound", "lottery.music", "lottery.settings", "lottery.points", "lottery.owned", "lottery.equip", "lottery.xp", "lottery.endings", "lottery.codex", "lottery.rares", "lottery.challenges", "lottery.dynasty", "lottery.heirs", "lottery.livesTotal", "lottery.dailies", "lottery.dayBest", "lottery.lang"];

async function ready() {
  if (!native) return;
  try {
    await StatusBar.setStyle({ style: Style.Dark });
    if (Capacitor.getPlatform() === "android") await StatusBar.setBackgroundColor({ color: "#0f1424" });
  } catch (e) {}
  // iOS может очистить localStorage веб-вью; сохранения дублируются в нативное хранилище
  for (const key of KEYS) {
    try {
      const { value } = await Preferences.get({ key });
      if (value != null && localStorage.getItem(key) == null) localStorage.setItem(key, value);
    } catch (e) {}
  }
  App.addListener("backButton", () => { if (typeof window.onBack === "function" && window.onBack()) return; App.minimizeApp(); });
  try { await SplashScreen.hide(); } catch (e) {}
}

function haptic(kind = "light") {
  if (native) {
    if (kind === "fail") return Haptics.notification({ type: NotificationType.Error }).catch(() => {});
    if (kind === "success") return Haptics.notification({ type: NotificationType.Success }).catch(() => {});
    return Haptics.impact({ style: kind === "heavy" ? ImpactStyle.Heavy : ImpactStyle.Light }).catch(() => {});
  }
  try { navigator.vibrate && navigator.vibrate(kind === "heavy" ? 120 : kind === "fail" ? 60 : 20); } catch (e) {}
}

function mirror(key, value) { if (native) Preferences.set({ key, value }).catch(() => {}); }
function unlock(ids) { if (desktop && ids.length) window.desktop.unlock(ids).catch(() => {}); }
function quit() { if (desktop) window.desktop.quit(); }

window.Platform = { native, desktop, name: desktop ? "desktop" : native ? Capacitor.getPlatform() : "web", ready: ready(), haptic, mirror, unlock, quit };
