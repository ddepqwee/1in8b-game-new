// Испытание недели: одно и то же рождение для всех игроков на неделю.
// Эпоха, часть света и цель выбираются из номера недели, поэтому их не нужно хранить на сервере.
// Тексты на двух языках: L("по-русски", "in English"). Подключается после content-arcs.js.
(() => {
const L = window.tr;
const YEARS = [1932, 1941, 1950, 1958, 1967, 1975, 1983, 1990, 1997, 2004, 2010, 2015];
const GOALS = [
  { n: L("Дожить до 80", "Live to 80"), ok: p => p.age >= 80 },
  { n: L("Вырастить троих детей", "Raise three children"), ok: p => p.kids.length >= 3 },
  { n: L("Сменить три профессии", "Work three different jobs"), ok: p => (p.f.jobsHeld || []).length >= 3 },
  { n: L("Пережить 4 исторических события", "Live through 4 historic events"), ok: p => (p.hist || []).length >= 4 },
  { n: L("Исполнить мечту", "Make your dream come true"), ok: p => p.dreamDone },
  { n: L("Уйти с деньгами 70 и больше", "Finish with 70+ money"), ok: p => p.r.m >= 70 },
  { n: L("Уйти с близкими 80 и больше", "Finish with 80+ family and friends"), ok: p => p.r.t >= 80 },
  { n: L("Уйти счастливым: счастье 75 и больше", "Finish happy: 75+ happiness"), ok: p => p.r.j >= 75 },
  { n: L("Переехать в другую страну", "Move to another country"), ok: p => !!p.f.emigrated },
  { n: L("Помириться с соперником детства", "Make peace with your childhood rival"), ok: p => !!(p.rival && p.rival.peace) },
  { n: L("Посадить дерево и дождаться тени", "Plant a tree and live to sit in its shade"), ok: p => !!p.f.treeGrown },
  { n: L("Получить знания 90 и больше", "Reach 90+ knowledge"), ok: p => (p.peak.k || 0) >= 90 },
];
// номер недели по ISO: понедельник — первый день, неделя 1 содержит первый четверг года
window.isoWeek = (d = new Date()) => {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return `${t.getUTCFullYear()}-W${String(Math.ceil(((t - y0) / 864e5 + 1) / 7)).padStart(2, "0")}`;
};
window.WEEKLY = (wk = isoWeek()) => {
  const r = mulberry32(hashStr("weekly-" + wk));
  const parts = [...new Set(COUNTRIES.map(c => c.part))];
  const year = YEARS[Math.floor(r() * YEARS.length)], part = parts[Math.floor(r() * parts.length)], goal = GOALS[Math.floor(r() * GOALS.length)];
  const partName = COUNTRIES.find(c => c.part === part).partName, num = +wk.split("W")[1];
  return {
    id: "week-" + wk, week: wk, year, part, reward: 400,
    n: L(`Неделя ${num}`, `Week ${num}`),
    d: L(`Рождение в ${year} году, ${partName}. У всех игроков на этой неделе одна и та же жизнь`, `Born in ${year}, ${partName}. Every player gets the same life this week`),
    goal: goal.n, ok: goal.ok,
  };
};
window.ACHIEVEMENTS.push(
  { id: "weekly3", meta: true, n: L("Три недели", "Three weeks"), d: L("Пройти испытание недели три раза", "Complete the weekly challenge three times"), ok: (p, a, m) => (m && m.weeks || 0) >= 3 },
);
})();
