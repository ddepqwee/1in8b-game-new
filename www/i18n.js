// Язык игры: русский или английский. Выбор хранится в lottery.lang, по умолчанию берётся из языка системы.
window.LANG = (() => {
  try { const s = JSON.parse(localStorage.getItem("lottery.lang")); if (s === "ru" || s === "en") return s; } catch (e) {}
  return /^(ru|be|kk|ky|uz|tg)\b/i.test(navigator.language || "") ? "ru" : "en";
})();
// tr("по-русски", "in English") — короткие строки интерфейса и движка
window.tr = (ru, en) => window.LANG === "en" ? en : ru;
document.documentElement.lang = window.LANG;
