// Эпохи: каждая жизнь начинается в своём году (1930–2015), и через неё проходит история.
// 1) Карточки и события, которые возможны только в своё время (смартфон, интернет, нейросети), получают рамки лет.
// 2) Исторические события срабатывают, когда этап жизни (пять лет) накрывает их год, и только там, где они были.
// 3) Несколько решений, которые бывают только в своё время: дефицит, видеосалон, ваучер, доткомы, биткоин.
// Тексты на двух языках: L("по-русски", "in English"). Подключается после content-places.js.
(() => {
const L = window.tr;
const Y = p => yearOf(p);
const inPart = (...x) => p => x.includes(p.c.part);
const inReg = (...r) => p => r.includes(p.c.reg);
const inN = (...n) => p => n.includes(p.c.n);
const any = () => true;
const SOVIET = ["Россия", "Украина", "Беларусь", "Казахстан", "Узбекистан", "Таджикистан", "Туркменистан", "Кыргызстан", "Азербайджан", "Грузия", "Армения", "Молдова", "Литва", "Латвия", "Эстония"];
const soviet = p => SOVIET.includes(p.c.n);
const EAST = ["Польша", "Чехия", "Словакия", "Венгрия", "Румыния", "Болгария", "Германия", "Сербия", "Хорватия", "Словения", "Босния и Герцеговина", "Черногория", "Северная Македония", "Албания"];
const WEST = p => p.c.part === "Европа" && !SOVIET.includes(p.c.n) && !EAST.includes(p.c.n);
const AFRICA = p => p.c.part === "Африка";

// ---------- 1. Рамки лет для существующего контента ----------
// [с какого года, по какой год]; карточка или событие не выпадает вне этих лет
const CARD_YEARS = {
  smartphone: [2010, 2200], itboom: [1995, 2200], crypto: [2012, 2200], mobilemoney: [2007, 2200], channel: [2006, 2200], viral: [2008, 2200],
  phonejob: [2010, 2200], remote: [2020, 2200], computer: [1995, 2200], gamejam: [1990, 2200], studio: [1995, 2200], cosmos: [1959, 2200],
  scamcall: [2005, 2200], sidehustle: [2010, 2200], startup: [1985, 2200], funding: [1990, 2200], exit: [1995, 2200], pyramid: [1990, 2200],
  firstcar: [1950, 2200], tattoo: [1990, 2200], pen: [1950, 2015], interrail: [1972, 2200], volunteerabroad: [1965, 2200], kpop: [2000, 2200],
  diadelos: [1930, 2200], solar: [2005, 2200], crunch: [1995, 2200], haters: [2008, 2200], offline: [2010, 2200], gaokao: [1977, 2200],
  studentdebt: [1980, 2200], mortgage: [1960, 2200], gym: [1975, 2200],
};
const EVENT_YEARS = {
  firstphone: [2007, 2200], ai: [2022, 2200], internet: [1995, 2200], phone: [2005, 2200], reconnect: [2005, 2200], pandemic: [2020, 2022],
  kidcall: [1960, 2200], scholarship: [1950, 2200],
};
const fits = (p, [a, b]) => { const y = Y(p); return y + 4 >= a && y <= b; };
for (const c of window.CARDS) if (CARD_YEARS[c.id]) { const f = c.if, r = CARD_YEARS[c.id]; c.if = p => fits(p, r) && (!f || f(p)); }
for (const e of window.EVENTS) if (EVENT_YEARS[e.id]) { const w = e.w, r = EVENT_YEARS[e.id]; e.w = p => fits(p, r) ? w(p) * (e.id === "pandemic" ? 25 : 1) : 0; }

// ---------- 2. История ----------
// y — год, ok — где это было, ch — шанс, что это коснётся тебя, если этап накрывает год
// eff — что меняется, s — запись в биографии; heavy — не показывать в мягком режиме
window.HISTORY = [
  { id: "depression", y: 1930, ok: p => inPart("Америка", "Европа")(p) && p.c.d > .4, ch: .8, eff: { m: -10, j: -4 }, s: L("Великая депрессия. Отец ищет работу каждое утро.", "The Great Depression. Your father looks for work every morning."), ic: "📉" },
  { id: "ww2", y: 1941, heavy: true, ok: p => p.c.part === "Европа" || soviet(p) || inN("Китай", "Япония", "Филиппины", "Индонезия", "Вьетнам", "Мьянма", "Северная Корея", "Южная Корея")(p), ch: .95, eff: { h: -10, t: -6, j: -10, m: -8 }, s: L("Война. Сирены по ночам, хлеб по карточкам, письма с фронта.", "War. Sirens at night, bread on ration cards, letters from the front."), ic: "⚠", act: p => p.f.warChild = true },
  { id: "victory", y: 1945, ok: p => p.c.part === "Европа" || soviet(p) || inN("США", "Канада", "Китай", "Австралия", "Новая Зеландия", "Великобритания")(p), ch: .95, eff: { j: 12, t: 6 }, s: L("Конец войны. Незнакомые люди обнимались на улицах.", "The war is over. Strangers hugged in the streets."), ic: "🕊" },
  { id: "partition", y: 1947, heavy: true, ok: inN("Индия", "Пакистан", "Бангладеш"), ch: .7, eff: { t: -6, j: -8, m: -6 }, s: L("Раздел страны. Миллионы людей уходят на новые границы.", "Partition. Millions walk toward new borders."), ic: "🧳" },
  { id: "independence_in", y: 1947, ok: inN("Индия", "Пакистан"), ch: .9, eff: { j: 8 }, s: L("Независимость. Новый флаг над школой.", "Independence. A new flag over the school."), ic: "🏳" },
  { id: "prc", y: 1949, ok: inN("Китай"), ch: .9, eff: { j: 2, k: 2 }, s: L("Провозглашена Народная Республика. Всё будет по-новому.", "The People's Republic is proclaimed. Everything will be different now."), ic: "🏮" },
  { id: "tvfirst", y: 1958, ok: p => p.c.d > .6, ch: .7, eff: { j: 6, k: 3 }, s: L("В доме появился телевизор. Соседи приходили смотреть.", "A television arrived at home. The neighbors came over to watch."), ic: "📺" },
  { id: "sputnik", y: 1957, ok: any, ch: .5, eff: { j: 4, k: 3 }, s: L("Первый спутник. Вся улица смотрела в небо, искала движущуюся звезду.", "The first satellite. The whole street searched the sky for a moving star."), ic: "🛰" },
  { id: "africa60", y: 1960, ok: AFRICA, ch: .8, eff: { j: 10, t: 4 }, s: L("Год Африки: страна стала независимой. Танцы до утра.", "The Year of Africa: the country became independent. Dancing till dawn."), ic: "🏳" },
  { id: "gagarin", y: 1961, ok: any, ch: .6, eff: { j: 8, k: 2 }, s: L("Человек в космосе! Радио повторяло имя Гагарина весь день.", "A human in space! The radio repeated Gagarin's name all day."), ic: "🚀", act: p => p.f.gagarin = true },
  { id: "culturalrev", y: 1966, heavy: true, ok: inN("Китай"), ch: .9, eff: { k: -8, j: -8, t: -4 }, s: L("Культурная революция. Школы закрыты, учителей уводят.", "The Cultural Revolution. Schools shut, teachers taken away."), ic: "📕" },
  { id: "moon", y: 1969, ok: p => p.c.d > .3, ch: .7, eff: { j: 8, k: 3 }, s: L("Человек на Луне. Ты не спал, чтобы увидеть прямой эфир.", "A man on the Moon. You stayed up to watch it live."), ic: "🌕", act: p => p.f.moon = true },
  { id: "oil73", y: 1973, ok: p => p.c.d > .5, ch: .6, eff: { m: -6 }, s: L("Нефтяной кризис. Очереди на заправках.", "The oil crisis. Lines at the gas stations."), ic: "⛽" },
  { id: "smallpox", y: 1980, ok: any, ch: .4, eff: { h: 2, j: 3 }, s: L("Оспа побеждена. Первая болезнь, которую человечество стёрло с лица Земли.", "Smallpox is eradicated. The first disease humanity wiped off the Earth."), ic: "💉" },
  { id: "chernobyl", y: 1986, heavy: true, ok: inN("Украина", "Беларусь", "Россия"), ch: .6, eff: { h: -6, j: -6 }, s: L("Чернобыль. Детей увозят подальше, яблоки нельзя есть.", "Chernobyl. Children are sent away; you mustn't eat the apples."), ic: "☢" },
  { id: "wall", y: 1989, ok: p => p.c.part === "Европа", ch: .8, eff: { j: 10, t: 4 }, s: L("Пала Берлинская стена. Люди танцевали на бетоне.", "The Berlin Wall fell. People danced on the concrete."), ic: "🧱" },
  { id: "ussr", y: 1991, ok: soviet, ch: .95, eff: { m: -12, j: -6, k: 4 }, s: L("Распался Советский Союз. Зарплату платят тушёнкой, но можно говорить что думаешь.", "The Soviet Union collapsed. Wages paid in canned meat, but you can say what you think."), ic: "☭", act: p => p.f.ussr = true },
  { id: "apartheid", y: 1994, ok: inN("ЮАР"), ch: .9, eff: { j: 12, t: 6 }, s: L("Конец апартеида. Первые выборы для всех. Очереди на участки на километры.", "Apartheid ends. The first election for everyone. Lines to vote stretched for kilometers."), ic: "🗳" },
  { id: "asia97", y: 1997, ok: inN("Таиланд", "Индонезия", "Южная Корея", "Малайзия", "Филиппины"), ch: .8, eff: { m: -10, j: -4 }, s: L("Азиатский кризис. Люди сдавали золото, чтобы спасти страну.", "The Asian crisis. People donated gold to save the country."), ic: "📉" },
  { id: "default98", y: 1998, ok: inN("Россия"), ch: .9, eff: { m: -10, j: -4 }, s: L("Дефолт. Сбережения за одну неделю превратились в бумагу.", "The default. Savings turned to paper in a single week."), ic: "📉" },
  { id: "y2k", y: 2000, ok: p => p.c.d > .4, ch: .5, eff: { j: 4 }, s: L("Миллениум. Компьютеры не сломались, все выдохнули и пошли на салют.", "The millennium. Computers didn't crash; everyone exhaled and went to watch the fireworks."), ic: "🎆" },
  { id: "tsunami", y: 2004, heavy: true, ok: inN("Индонезия", "Шри-Ланка", "Таиланд", "Индия", "Мальдивы", "Сомали"), ch: .4, eff: { h: -6, m: -8, t: -6 }, s: L("Цунами. Море ушло, а потом вернулось стеной.", "The tsunami. The sea drew back, then returned as a wall."), ic: "🌊" },
  { id: "crisis08", y: 2008, ok: p => p.c.d > .45, ch: .7, eff: { m: -8, j: -3 }, s: L("Мировой кризис. На работе сокращения, цены на дома падают.", "The global crisis. Layoffs at work, house prices falling."), ic: "📉" },
  { id: "spring", y: 2011, heavy: true, ok: inN("Египет", "Тунис", "Ливия", "Сирия", "Йемен", "Бахрейн"), ch: .8, eff: { j: -4, k: 4, t: 4 }, s: L("Арабская весна. Площади полны людей с флагами.", "The Arab Spring. Squares full of people with flags."), ic: "📣" },
  { id: "covid", y: 2020, ok: any, ch: .95, eff: { j: -6, t: -3, m: -4 }, s: L("Пандемия. Маски, пустые улицы, бабушка по видеосвязи.", "The pandemic. Masks, empty streets, grandma on video calls."), ic: "😷" },
  { id: "evs", y: 2032, ok: p => p.c.d > .5, ch: .7, eff: { j: 3, h: 2 }, s: L("Электромобили на каждой улице. Город стал тише.", "Electric cars on every street. The city got quieter."), ic: "🔌" },
  { id: "heat40", y: 2040, ok: p => p.c.d < .6 || p.c.part === "Африка" || p.c.part === "Азия", ch: .6, eff: { h: -4, m: -4 }, s: L("Лето, которое побило все рекорды жары. Работать можно только ночью.", "A summer that broke every heat record. You can only work at night."), ic: "🌡" },
  { id: "mars", y: 2045, ok: any, ch: .7, eff: { j: 8, k: 4 }, s: L("Первые люди на Марсе. Внуки нарисовали ракету на обоях.", "The first people on Mars. The grandkids drew a rocket on the wallpaper."), ic: "🔴", act: p => p.f.mars = true },
  { id: "cure", y: 2055, ok: any, ch: .7, eff: { h: 6, j: 6 }, s: L("Лекарство от многих видов рака. Очереди в больницах стали короче.", "A cure for many kinds of cancer. Hospital lines got shorter."), ic: "🧬" },
  { id: "robots", y: 2065, ok: p => p.c.d > .4, ch: .7, eff: { h: 3, t: -2 }, s: L("Робот-помощник носит тебе чай и напоминает про таблетки.", "A robot helper brings you tea and reminds you about your pills."), ic: "🤖" },
];
// событие срабатывает, если его год попадает в эти пять лет; в мягком режиме тяжёлые не показываются
window.STAGE_HOOKS = (window.STAGE_HOOKS || []).concat(p => {
  const y0 = Y(p);
  for (const h of window.HISTORY) {
    if (h.y < y0 || h.y >= y0 + 5 || (h.heavy && window.SETTINGS && window.SETTINGS.soft) || !h.ok(p)) continue;
    if (rng() >= h.ch) continue;
    const ch = apply(p, h.eff);
    if (h.act) h.act(p);
    (p.hist || (p.hist = [])).push(h.id);
    p.log.push([ch.some(([, v]) => v < 0) ? "down" : "up", `${h.y}. ${txt(h.s, p)}`, p.age, h.ic, false]);
  }
});

// ---------- 3. Решения своего времени ----------
window.CARDS.push(
  { id: "deficit", ic: "🧾", from: 15, to: 70, if: p => soviet(p) && Y(p) >= 1965 && Y(p) <= 1990, w: 1.2, t: L("Дефицит", "Shortages"), q: () => L("В магазин завезли импортные сапоги. Очередь на три квартала.", "Imported boots arrived at the store. The line wraps three blocks."), o: [
    { l: L("Стоять с утра", "Queue from dawn"), tags: ["work"], ch: () => .6, yes: { j: 6, m: -2 }, no: { j: -4, h: -1 }, ys: L("Достались последние. Твой размер!", "You got the last pair. In your size!"), ns: L("Кончились за два человека до тебя.", "Sold out two people ahead of you.") },
    { l: L("Договориться с продавщицей", "Sweet-talk the clerk"), tags: ["social", "risk"], ch: () => .5, yes: { j: 5, t: 3 }, no: { j: -3 }, ys: L("Из-под прилавка, с улыбкой.", "From under the counter, with a smile."), ns: L("«Всем по одной, молодой человек».", "\"One per person, young man.\"") },
  ]},
  { id: "videosalon", ic: "📼", from: 10, to: 30, if: p => soviet(p) && Y(p) >= 1985 && Y(p) <= 1995, w: 1.2, t: L("Видеосалон", "The video parlor"), q: () => L("В подвале показывают кассеты с иностранными фильмами. Перевод гнусавым голосом.", "In a basement they show foreign films on tape, dubbed by one nasal voice."), o: [
    { l: L("Ходить каждую неделю", "Go every week"), tags: ["rest"], ch: () => 1, yes: { j: 8, k: 2, m: -2 }, ys: L("Ты знаешь все фильмы с одним актёром наизусть.", "You know every action movie by heart.") },
    { l: L("Открыть свой салон", "Open your own"), tags: ["business", "risk"], ch: () => .5, yes: { m: 10, j: 4 }, no: { m: -6 }, ys: L("Видеомагнитофон окупился за месяц.", "The VCR paid for itself in a month."), ns: L("Милиция забрала кассеты.", "The police took the tapes."), set: p => p.f.biz = p.f.biz || 1 },
  ]},
  { id: "voucher", ic: "🎟", from: 18, to: 80, if: p => inN("Россия", "Украина", "Беларусь", "Казахстан", "Чехия", "Польша")(p) && Y(p) >= 1990 && Y(p) <= 1994, prio: true, t: L("Ваучер", "The voucher"), q: () => L("Каждому выдали бумагу: твоя доля в заводах страны. Что с ней делать?", "Everyone got a paper: your share of the country's factories. What now?"), o: [
    { l: L("Вложить в завод, где работаешь", "Invest in the plant where you work"), tags: ["business", "risk"], ch: () => .3, yes: { m: 14, j: 4 }, no: { m: -2, j: -2 }, ys: L("Через десять лет акции стоили как квартира.", "Ten years later the shares were worth a flat."), ns: L("Завод обанкротился.", "The plant went bankrupt.") },
    { l: L("Продать за две бутылки", "Sell it for two bottles"), ch: () => 1, yes: { j: 2 }, ys: L("Вечер удался. Будущее нет.", "The evening was great. The future, not so much.") },
    { l: L("Отдать в фонд по телевизору", "Hand it to a fund from TV ads"), tags: ["risk"], ch: () => .15, yes: { m: 8 }, no: { m: -3, j: -4 }, ys: L("Фонд, как ни странно, выжил.", "Strangely, the fund survived."), ns: L("Фонд исчез вместе с офисом.", "The fund vanished along with its office.") },
  ]},
  { id: "hippie", ic: "🌼", from: 15, to: 25, if: p => (WEST(p) || inN("США", "Канада", "Австралия")(p)) && Y(p) >= 1965 && Y(p) <= 1975, w: 1.2, t: L("Лето любви", "Summer of love"), q: () => L("Друзья едут автостопом на большой музыкальный фестиваль.", "Friends are hitchhiking to a huge music festival."), o: [
    { l: L("Цветы в волосах и в дорогу", "Flowers in your hair, hit the road"), tags: ["rest", "social"], ch: () => .85, yes: { j: 10, t: 6 }, no: { j: 2, h: -2 }, ys: L("Три дня музыки под дождём. Ты будешь рассказывать внукам.", "Three days of music in the rain. You'll tell your grandkids."), ns: L("Застряли в пробке на сорок километров.", "Stuck in a forty-kilometer traffic jam."), set: p => p.f.woodstock = true },
    { l: L("Остаться: экзамены", "Stay home: exams"), tags: ["study"], ch: () => 1, yes: { k: 4 }, ys: L("Слушал всё по радио.", "You heard it all on the radio.") },
  ]},
  { id: "pc", ic: "🖥", from: 10, to: 40, if: p => p.c.d > .35 && Y(p) >= 1983 && Y(p) <= 1998 && !p.f.coder, w: 1.2, t: L("Первый компьютер", "The first computer"), q: () => L("У друга появился компьютер. Чёрный экран и мигающий курсор.", "A friend got a computer. A black screen and a blinking cursor."), o: [
    { l: L("Научиться программировать", "Learn to program"), tags: ["study"], ch: () => .7, yes: { k: 10, j: 4 }, no: { k: 3 }, ys: L("Первая программа напечатала «Привет». Ты не спал до утра.", "Your first program printed \"Hello\". You stayed up till dawn."), ns: L("Ничего не понятно, но очень интересно.", "Understood nothing. Loved it anyway."), set: p => p.f.coder = true },
    { l: L("Играть в игры", "Play games"), tags: ["rest"], ch: () => 1, yes: { j: 8 }, ys: L("Тетрис снится по ночам.", "You dream of Tetris at night.") },
  ]},
  { id: "dotcom", ic: "💹", from: 22, to: 60, if: p => p.c.d > .6 && Y(p) >= 1996 && Y(p) <= 2000 && p.r.m >= 30, t: L("Акции интернета", "Internet stocks"), q: () => L("Все покупают акции интернет-компаний. Соседский сын стал миллионером за год.", "Everyone's buying internet stocks. The neighbor's son became a millionaire in a year."), o: [
    { l: L("Вложить всё", "Put everything in"), tags: ["business", "risk"], ch: () => .2, yes: { m: 20, j: 6 }, no: { m: -18, j: -8 }, ys: L("Продал за месяц до обвала. Чистое везение.", "You sold a month before the crash. Pure luck."), ns: L("Пузырь лопнул. Деньги тоже.", "The bubble burst. So did your money.") },
    { l: L("Не трогать", "Stay out"), ch: () => 1, yes: { j: 1 }, ys: L("Скучно, но спокойно.", "Boring, but safe.") },
  ]},
  { id: "bitcoin", ic: "🪙", from: 15, to: 60, if: p => p.c.d > .3 && Y(p) >= 2010 && Y(p) <= 2013 && !p.f.btc, t: L("Странные монеты", "Strange coins"), q: () => L("Друг-программист предлагает купить цифровые монеты по доллару.", "A programmer friend offers you digital coins for a dollar each."), o: [
    { l: L("Купить на сто долларов и забыть", "Buy a hundred dollars' worth and forget"), tags: ["risk"], ch: () => .5, yes: { m: 25, j: 10 }, no: { m: -2, j: -6 }, ys: L("Через десять лет ты вспомнил пароль. Хватило на дом.", "Ten years later you remembered the password. Enough for a house."), ns: L("Пароль потерян вместе со старым ноутбуком.", "The password was lost with the old laptop."), set: p => { p.f.btc = true; p.f.btcRich = true; }, setNo: p => p.f.btc = true },
    { l: L("Это же игрушка", "It's just a toy"), ch: () => 1, yes: {}, ys: L("Ну-ну.", "Sure.") , set: p => p.f.btc = true },
  ]},
  { id: "letters_war", ic: "✉", from: 5, to: 30, if: p => p.f.warChild && !p.f.warLetters, prio: true, t: L("Письмо с фронта", "A letter from the front"), q: () => L("Пришёл треугольник письма. Почерк отца.", "A folded letter arrived. Your father's handwriting."), o: [
    { l: L("Читать вслух всей семье", "Read it aloud to the family"), tags: ["social"], ch: () => .7, yes: { t: 10, j: 8 }, no: { j: -10, t: 4 }, ys: L("Жив. Обещает вернуться к весне.", "He's alive. He promises to be home by spring."), ns: L("Это было последнее письмо.", "It was the last letter."), set: p => p.f.warLetters = true, setNo: p => { p.f.warLetters = true; p.parents.fAlive = false; } },
  ]},
);

// ---------- Мечты и достижения эпох ----------
window.ACHIEVEMENTS.push(
  { id: "moon", n: L("Один маленький шаг", "One small step"), d: L("Увидеть высадку на Луну", "Watch the Moon landing"), ok: p => p.f.moon },
  { id: "mars", n: L("Красная планета", "The red planet"), d: L("Дожить до людей на Марсе", "Live to see people on Mars"), ok: p => p.f.mars },
  { id: "century2", n: L("Через век", "Across a century"), d: L("Прожить жизнь в двух веках: до 2000 и после 2050", "Live from before 2000 to after 2050"), ok: p => p.born < 2000 && yearOf(p) >= 2050 },
  { id: "btc", n: L("Ранняя пташка", "Early adopter"), d: L("Разбогатеть на странных монетах", "Get rich on strange coins"), ok: p => p.f.btcRich },
  { id: "history5", n: L("Свидетель истории", "Witness to history"), d: L("Пережить 5 исторических событий за одну жизнь", "Live through 5 historic events in one life"), ok: p => (p.hist || []).length >= 5 },
);
window.ENDINGS.push(
  { id: "witness", rank: 37, n: L("Свидетель эпохи", "Witness to an era"), d: p => L(`С ${p.born} по ${yearOf(p)}. Ты видел, как менялся мир, и помнишь, как было раньше.`, `From ${p.born} to ${yearOf(p)}. You watched the world change and remember how it used to be.`), hint: L("Пережить 8 исторических событий", "Live through 8 historic events"), ok: p => (p.hist || []).length >= 8 },
);
})();
