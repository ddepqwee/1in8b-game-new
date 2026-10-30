// Большое расширение для Steam: новые черты, профессии и мечты, ветки карьеры (медицина, наука, политика,
// музыка, книги, кухня, армия, стартапы, школа, спорт, земля), детство с первых лет, семья в нескольких поколениях,
// деньги, здоровье, увлечения, старость, региональные сцены и события. Тексты на двух языках прямо здесь:
// tr("по-русски", "in English"), поэтому переводы не расходятся. Подключается после content-world.js.
(() => {
const L = window.tr;
const he = (p, m, f) => p.sex === "f" ? f : m;
const kidAge = (p, k) => p.age - k.born;
const kidOf = (p, from, to) => p.kids.find(k => kidAge(p, k) >= from && kidAge(p, k) <= to);
const kidW = k => k.sex === "f" ? L("дочь", "daughter") : L("сын", "son");
const AFRICA = p => p.c.part === "Африка", ASIA = p => p.c.part === "Азия", AMERICA = p => p.c.part === "Америка", EUROPE = p => p.c.part === "Европа", OCEANIA = p => p.c.part === "Океания";
const langs = p => p.f.langs || 1;
const married = p => p.married ? p.age - (p.f.marriedAt ?? p.age) : 0;

// ---------- Черты ----------
Object.assign(window.TRAITS, {
  musical:   { n: L("Музыкальный слух", "Musical ear"), d: L("Открывает путь в музыку, +10% в искусстве", "Opens a path into music; +10% in art"), ch: { music: .15, art: .1 }, gain: { j: 1.05 } },
  leader:    { n: L("Лидерство", "Leadership"), d: L("+15% в политике, +6% с людьми", "+15% in politics, +6% with people"), ch: { politics: .15, social: .06 } },
  thrifty:   { n: L("Бережливость", "Thrift"), d: L("Денежные потери меньше на 30%", "Money losses are 30% smaller"), loss: { m: .7 } },
  compassion:{ n: L("Сострадание", "Compassion"), d: L("+12% когда помогаешь людям, связи растут быстрее", "+12% when caring for people; relationships grow faster"), ch: { care: .12, social: .04 }, gain: { t: 1.1 } },
  curious:   { n: L("Любознательность", "Curiosity"), d: L("Знания растут быстрее, легче в поездках", "Knowledge grows faster; trips come easier"), gain: { k: 1.15 }, ch: { rest: .05, study: .04 } },
  cool:      { n: L("Хладнокровие", "Composure"), d: L("+8% к рискованным решениям, неудачи меньше бьют по счастью", "+8% to risky decisions; setbacks hit happiness less"), ch: { risk: .08 }, loss: { j: .8 } },
  early:     { n: L("Ранняя пташка", "Early bird"), d: L("+6% в работе, +4% к здоровью", "+6% at work, +4% for health"), ch: { work: .06, health: .04 } },
  dreamer:   { n: L("Мечтатель", "Dreamer"), d: L("Счастье растёт быстрее, +6% в искусстве", "Happiness grows faster; +6% in art"), gain: { j: 1.1 }, ch: { art: .06 } },
  // редкие: открываются достижениями
  heir:      { n: L("Наследник рода", "Family heir"), d: L("Деньги и близкие растут на 10% быстрее", "Money and loved ones grow 10% faster"), gain: { m: 1.1, t: 1.1 }, unlock: "dyn3" },
  phoenix:   { n: L("Второе дыхание", "Second wind"), d: L("Удары по здоровью слабее на 20%", "Health losses are 20% smaller"), loss: { h: .8 }, unlock: "comeback" },
  polyglot:  { n: L("Полиглот", "Polyglot"), d: L("+10% к переездам, языки даются легче", "+10% to moving; languages come easier"), ch: { move: .1, study: .05 }, unlock: "langs3" },
});

// ---------- Профессии ----------
Object.assign(window.JOBS, {
  politician: { n: L("Политик", "Politician"), pay: 10 },
  musician:   { n: L("Музыкант", "Musician"), pay: 5 },
  writer:     { n: L("Писатель", "Writer"), nf: L("Писательница", undefined), pay: 5 },
  chef:       { n: L("Шеф-повар", "Chef"), pay: 8 },
  officer:    { n: L("Офицер", "Officer"), pay: 9 },
  coach:      { n: L("Тренер", "Coach"), pay: 7 },
  pilot:      { n: L("Пилот", "Pilot"), pay: 13 },
  driver:     { n: L("Водитель", "Driver"), pay: 5 },
  journalist: { n: L("Журналист", "Journalist"), nf: L("Журналистка", undefined), pay: 7 },
});
for (const id of ["writer", "journalist"]) if (!window.JOBS[id].nf) delete window.JOBS[id].nf;

// ---------- Мечты ----------
window.DREAMS.push(
  { id: "book", t: L("Написать книгу", "Write a book"), d: L("Издать свою книгу", "Get your own book published"), ok: p => p.f.book },
  { id: "stage", t: L("Выйти на большую сцену", "Play a big stage"), d: L("Большой тур с музыкой", "A big tour with your music"), ok: p => p.f.bigstage, need: p => p.f.music },
  { id: "change", t: L("Изменить жизнь в своей стране", "Change life in your country"), d: L("Стать мэром или министром", "Become a mayor or a minister"), ok: p => p.f.mayor || p.f.minister },
  { id: "science", t: L("Сделать открытие", "Make a discovery"), d: L("Научное открытие", "A scientific discovery"), ok: p => p.f.discovery, need: p => p.r.k >= 45 },
  { id: "food", t: L("Свой ресторан", "A restaurant of your own"), d: L("Открыть своё кафе или ресторан", "Open your own café or restaurant"), ok: p => p.f.restaurant },
  { id: "golden", t: L("Золотая свадьба", "A golden anniversary"), d: L("Прожить в браке 50 лет", "Stay married for 50 years"), ok: p => married(p) >= 50 },
  { id: "peak", t: L("Покорить вершину", "Climb a great peak"), d: L("Подняться на большую гору", "Reach the top of a great mountain"), ok: p => p.f.summit, need: p => p.r.h >= 50 },
  { id: "langs", t: L("Говорить на трёх языках", "Speak three languages"), d: L("Выучить ещё два языка", "Learn two more languages"), ok: p => langs(p) >= 3 },
  { id: "hero", t: L("Спасти чью-то жизнь", "Save someone's life"), d: L("Хотя бы одну", "Even just one"), ok: p => p.f.savedLife },
  { id: "century", t: L("Встретить столетие", "See a hundred"), d: L("Дожить до 100 лет", "Live to 100"), ok: p => p.age >= 100, need: p => p.c.le >= 70 },
  { id: "mentor", t: L("Вырастить учеников", "Raise students of your own"), d: L("Стать для кого-то наставником", "Become someone's mentor"), ok: p => p.f.mentor },
  { id: "greatgrand", t: L("Увидеть правнуков", "Meet your great-grandchildren"), d: L("Дожить до правнуков", "Live to see great-grandchildren"), ok: p => p.f.greatgrand },
);

window.CARDS.push(
  // ===== Первые годы (0–4): решения принимают родители =====
  { id: "firstword", from: 0, to: 4, w: 3, t: L("Первое слово", "First word"), q: () => L("Вся семья ждёт, что ты скажешь первым.", "The whole family is waiting to hear your first word."), o: [
    { l: L("«Мама»", "\"Mama\""), ch: () => 1, yes: { t: 4, j: 3 }, ys: L("Мама плакала от счастья.", "Mom cried with happiness.") },
    { l: L("«Папа»", "\"Dada\""), ch: () => 1, yes: { t: 4, j: 3 }, ys: L("Папа рассказывал об этом всем соседям.", "Dad told every neighbor about it.") },
    { l: L("«Нет!»", "\"No!\""), ch: () => 1, yes: { j: 5, k: 1 }, ys: L("Характер виден сразу.", "The personality shows right away.") },
  ]},
  { id: "vaccine", from: 0, to: 4, w: 3, t: L("Прививки", "Vaccines"), q: () => L("В поликлинике предлагают сделать прививки по графику.", "The clinic offers your scheduled vaccines."), o: [
    { l: L("Сделать все прививки", "Get all the vaccines"), tags: ["health"], ch: p => .35 + .6 * p.c.d + (p.q - 3) * .05, yes: { h: 8 }, no: { h: 1 }, ys: L("Один укол, громкий плач и защита на годы.", "One shot, a lot of crying, and protection for years."), ns: L("Вакцины до вашей деревни не довезли.", "The vaccines never reached your village.") },
    { l: L("Обойтись народными средствами", "Stick to home remedies"), ch: () => 1, yes: { h: -3 }, ys: L("Бабушкин чай и надежда на лучшее.", "Grandma's tea and hoping for the best.") },
  ]},
  { id: "kindergarten", from: 0, to: 4, w: 2, t: L("Детский сад", "Kindergarten"), q: () => L("Родителям нужно работать. Кто будет с тобой днём?", "Your parents need to work. Who looks after you during the day?"), o: [
    { l: L("Детский сад", "Kindergarten"), tags: ["social"], ch: p => .3 + .6 * p.c.d, yes: { t: 5, k: 4, m: -2 }, no: { m: 2 }, ys: L("Первые друзья и первая каша, которую ты не ешь.", "First friends and the first porridge you refuse to eat."), ns: L("Мест в садике нет, сидишь с соседкой.", "No places at the kindergarten. A neighbor watches you.") },
    { l: L("Бабушка с дедушкой", "Grandma and grandpa"), ch: () => .9, yes: { t: 8, j: 3 }, no: { t: 2 }, ys: L("Сказки, пирожки и огород.", "Fairy tales, pies and the vegetable patch."), ns: L("Бабушка болеет, приходится крутиться.", "Grandma is ill, so everyone juggles.") },
    { l: L("Старшие братья и сёстры", "Older siblings"), if: p => p.siblings > 0, ch: () => 1, yes: { t: 6, h: -1 }, ys: L("Тебя таскают по всей улице.", "They drag you all over the street.") },
  ]},
  { id: "toy", from: 0, to: 4, w: 2, t: L("Любимая игрушка", "Favorite toy"), q: () => L("На день рождения можно выбрать одну вещь.", "You can pick one thing for your birthday."), o: [
    { l: L("Книжка с картинками", "A picture book"), ch: () => 1, yes: { k: 4 }, ys: L("Зачитана до дыр.", "Read until it fell apart.") },
    { l: L("Мяч", "A ball"), ch: () => 1, yes: { h: 4 }, ys: L("Мяч переживёт три окна.", "The ball will outlive three windows.") },
    { l: L("Барабан", "A drum"), ch: () => 1, yes: { j: 4 }, ys: L("Соседи запомнят этот подарок.", "The neighbors will remember this gift."), set: p => p.f.rhythm = true },
  ]},

  // ===== Детство (5–14) =====
  { id: "lost", from: 5, to: 9, t: L("Потерялся", "Lost"), q: () => L("На большом рынке ты отстаёшь от мамы. Вокруг одни чужие.", "At the big market you lose sight of your mom. Strangers everywhere."), o: [
    { l: L("Стоять на месте и ждать", "Stay put and wait"), ch: () => .85, yes: { k: 2, t: 3 }, no: { j: -4 }, ys: L("Мама нашла тебя через пять минут.", "Mom found you five minutes later."), ns: L("Ждать пришлось долго и страшно.", "A long, scary wait.") },
    { l: L("Попросить продавца о помощи", "Ask a stall owner for help"), tags: ["social"], ch: () => .8, yes: { t: 4, j: 2 }, no: { j: -3 }, ys: L("Продавец объявил тебя в громкоговоритель.", "The stall owner announced you over the loudspeaker."), ns: L("Продавцу было не до тебя.", "The stall owner was too busy.") },
    { l: L("Искать самому", "Search on your own"), tags: ["risk"], ch: () => .5, yes: { k: 3, j: 4 }, no: { j: -6, t: -2 }, ys: L("Нашёл дорогу по запаху лепёшек.", "You found the way by the smell of fresh bread."), ns: L("Ушёл ещё дальше. Нашли только к вечеру.", "You wandered even further. They found you by evening.") },
  ]},
  { id: "summer", from: 5, to: 12, repeat: 5, t: L("Лето", "Summer"), q: () => L("Лето. Родители спрашивают, где ты хочешь его провести.", "Summer. Your parents ask where you want to spend it."), o: [
    { l: L("У бабушки в деревне", "At grandma's in the village"), ch: () => .95, yes: { h: 4, t: 5, j: 4 }, no: { j: 1 }, ys: L("Речка, коровы и звёзды над крышей.", "A river, cows and stars over the roof."), ns: L("Всё лето шли дожди.", "It rained all summer.") },
    { l: L("В лагере", "At a summer camp"), if: p => p.c.d > .3 || p.q >= 4, tags: ["social"], ch: () => .8, yes: { t: 6, j: 6, m: -3 }, no: { j: -3, m: -3 }, ys: L("Костёр, гитара и друзья по переписке.", "Campfires, a guitar and pen pals."), ns: L("Скучал по дому все три недели.", "Homesick for all three weeks.") },
    { l: L("Дома с книгами", "At home with books"), tags: ["study"], ch: () => 1, yes: { k: 6 }, ys: L("Прочитал всю полку.", "You read the whole shelf.") },
    { l: L("Помогать родителям", "Help your parents"), tags: ["work"], ch: () => 1, yes: { m: 4, t: 3 }, ys: L("Первые заработанные монеты.", "Your first earned coins.") },
  ]},
  { id: "play", from: 6, to: 11, t: L("Школьный спектакль", "School play"), q: () => L("В школе ставят спектакль. Учительница раздаёт роли.", "The school is putting on a play. The teacher is handing out parts."), o: [
    { l: L("Попросить главную роль", "Ask for the lead"), tags: ["art", "risk"], ch: () => .5, yes: { j: 8, t: 4 }, no: { j: -4 }, ys: L("Аплодисменты стоя. Родители снимали на телефон.", "A standing ovation. Your parents filmed it all."), ns: L("Забыл слова на самом важном месте.", "You forgot your lines at the big moment."), set: p => p.f.art = true },
    { l: L("Рисовать декорации", "Paint the scenery"), tags: ["art"], ch: () => .9, yes: { j: 5, k: 2 }, no: { j: 1 }, ys: L("Твой дракон висит в коридоре до сих пор.", "Your dragon still hangs in the hallway."), ns: L("Краска не высохла к премьере.", "The paint wasn't dry by opening night.") },
    { l: L("Быть суфлёром", "Be the prompter"), ch: () => 1, yes: { k: 3, t: 2 }, ys: L("Выучил весь текст за всех.", "You learned everyone's lines.") },
  ]},
  { id: "window", from: 7, to: 12, t: L("Разбитое окно", "Broken window"), q: () => L("Мяч улетел прямо в окно соседки. Звон слышала вся улица.", "The ball flew straight through the neighbor's window. The whole street heard it."), o: [
    { l: L("Пойти и признаться", "Go and own up"), tags: ["social"], ch: () => .7, yes: { t: 6, j: 2, m: -2 }, no: { t: 2, j: -3, m: -2 }, ys: L("Соседка простила и угостила вареньем.", "The neighbor forgave you and gave you jam."), ns: L("Отрабатывал стекло целый месяц.", "You worked off the glass for a month.") },
    { l: L("Убежать", "Run"), tags: ["risk"], ch: () => .5, yes: { j: 3 }, no: { t: -6, j: -5 }, ys: L("Никто так и не узнал.", "Nobody ever found out."), ns: L("Узнали. Стыдно вдвойне.", "They found out. Twice the shame.") },
  ]},
  { id: "crush", from: 10, to: 14, t: L("Первая любовь", "First crush"), q: () => L("Кто-то из класса не выходит из головы.", "Someone in your class won't leave your head."), o: [
    { l: L("Передать записку", "Pass a note"), tags: ["love", "risk"], ch: () => .5, yes: { j: 10, t: 3 }, no: { j: -6 }, ys: L("Ответ был «да». Целую неделю.", "The answer was yes. For a whole week."), ns: L("Записку прочитал весь класс.", "The whole class read the note.") },
    { l: L("Молчать и вздыхать", "Stay silent and sigh"), ch: () => 1, yes: { j: -1, k: 2 }, ys: L("Стихи в тетради по математике.", "Poems in your math notebook.") },
  ]},
  { id: "fair", from: 10, to: 14, if: p => p.f.school, t: L("Научная ярмарка", "Science fair"), q: () => L("В школе конкурс проектов. Что будешь делать?", "There's a project contest at school. What will you make?"), o: [
    { l: L("Вулкан из соды", "A baking soda volcano"), tags: ["study"], ch: () => .85, yes: { k: 5, j: 4 }, no: { j: -2 }, ys: L("Извергался даже на учителя.", "It even erupted on the teacher."), ns: L("Вулкан так и не проснулся.", "The volcano never woke up.") },
    { l: L("Собрать радио", "Build a radio"), tags: ["study", "risk"], ch: p => .3 + p.r.k / 200, yes: { k: 10, j: 6 }, no: { k: 3 }, ys: L("Первое место и поездка на областной конкурс.", "First place and a trip to the regional contest."), ns: L("Шипит, но не ловит.", "It hisses, but won't tune in."), set: p => p.f.math = true },
    { l: L("Помочь другу с его проектом", "Help a friend with theirs"), tags: ["social"], ch: () => 1, yes: { t: 6, k: 2 }, ys: L("Друг получил грамоту и поделился с тобой.", "Your friend won a certificate and shared it with you.") },
  ]},
  { id: "games", from: 8, to: 14, if: p => p.c.d > .3, t: L("Видеоигры", "Video games"), q: () => L("Друзья подсели на новую игру.", "Your friends are hooked on a new game."), o: [
    { l: L("Играть до ночи", "Play until midnight"), ch: () => 1, yes: { j: 6, k: -3, h: -2 }, ys: L("Лучший в классе. В игре.", "Best in class. In the game.") },
    { l: L("Понемногу по выходным", "A little on weekends"), ch: () => 1, yes: { j: 3, t: 2 }, ys: L("Сыграли с папой. Он проиграл.", "You played with dad. He lost.") },
    { l: L("Сделать свою игру", "Make your own game"), tags: ["study"], ch: p => .25 + p.r.k / 200, yes: { k: 9, j: 5 }, no: { k: 3 }, ys: L("Простая игра про кота. Друзья в восторге.", "A simple game about a cat. Your friends love it."), ns: L("Код оказался сложнее, чем казалось.", "Code turned out to be harder than it looked."), set: p => p.f.coder = true },
  ]},
  { id: "club", from: 8, to: 14, t: L("Кружок", "After-school club"), q: () => L("После уроков есть бесплатные кружки.", "There are free clubs after school."), o: [
    { l: L("Шахматы", "Chess"), tags: ["study"], ch: () => .9, yes: { k: 7 }, no: { k: 2 }, ys: L("Обыграл тренера в блиц.", "You beat the coach at blitz."), ns: L("Слишком долго думать.", "Too much thinking."), set: p => p.f.chess = true },
    { l: L("Танцы", "Dance"), tags: ["sport", "art"], ch: () => .85, yes: { h: 5, j: 5 }, no: { j: 1 }, ys: L("Первое выступление на городском празднике.", "Your first performance at the town festival."), ns: L("Ноги не слушались.", "Your feet wouldn't cooperate.") },
    { l: L("Хор", "Choir"), tags: ["music", "art"], ch: () => .85, yes: { j: 6, t: 3 }, no: { j: 1 }, ys: L("Голос оказался что надо.", "Your voice turned out just right."), ns: L("Поставили в последний ряд.", "They put you in the back row."), set: p => p.f.music = true },
    { l: L("Кружок рукоделия", "Crafts club"), tags: ["work"], ch: () => .95, yes: { k: 3, j: 4 }, ys: L("Табуретка, на которой сидит вся семья.", "A stool the whole family sits on.") },
  ]},
  { id: "instrument", from: 7, to: 13, w: p => p.traits.includes("musical") || p.f.rhythm ? 3 : .8, t: L("Музыка", "Music"), q: () => L("Дома нашлась старая гитара. Или можно записаться в музыкальную школу.", "There's an old guitar at home. Or you could sign up for music school."), o: [
    { l: L("Учиться на гитаре самому", "Teach yourself guitar"), tags: ["music"], ch: () => .7, yes: { j: 6, k: 2 }, no: { j: 1 }, ys: L("Три аккорда, и уже песня.", "Three chords and you've got a song."), ns: L("Пальцы болят, бросил.", "Sore fingers. You gave up."), set: p => p.f.music = true },
    { l: L("Музыкальная школа", "Music school"), if: p => p.q >= 3 || p.c.d > .5, tags: ["music", "study"], ch: p => .5 + .3 * p.c.d, yes: { k: 6, j: 4, m: -3 }, no: { m: -3 }, ys: L("Гаммы каждый день. Зато слух.", "Scales every day. But what an ear."), ns: L("Строгая учительница отбила охоту.", "A strict teacher killed the joy."), set: p => p.f.music = true },
    { l: L("Петь во дворе с ребятами", "Sing in the yard with friends"), tags: ["social", "music"], ch: () => 1, yes: { t: 5, j: 4 }, ys: L("Вечера, которые помнят все.", "Evenings everyone remembers.") },
  ]},
  { id: "market", from: 6, to: 12, if: p => p.c.d < .5 || p.q <= 2, t: L("Рынок", "Market day"), q: () => L("Мама берёт тебя торговать на рынок.", "Mom takes you to sell at the market."), o: [
    { l: L("Зазывать покупателей", "Call out to customers"), tags: ["business"], ch: () => .75, yes: { m: 5, t: 3 }, no: { j: -2 }, ys: L("Продали всё до обеда.", "You sold out before lunch."), ns: L("Покупатели проходили мимо.", "Customers walked right past.") },
    { l: L("Считать деньги", "Count the money"), tags: ["study"], ch: () => 1, yes: { k: 4, m: 2 }, ys: L("Ни одной ошибки в сдаче.", "Not one mistake with the change.") },
  ]},
  { id: "rivalry", from: 6, to: 14, if: p => p.siblings > 0, t: L("Ссора", "A fight"), q: () => L("Брат сломал твою любимую вещь. Говорит, случайно.", "Your brother broke your favorite thing. He says it was an accident."), o: [
    { l: L("Простить", "Forgive him"), tags: ["social"], ch: () => 1, yes: { t: 6 }, ys: L("Через час уже играли вместе.", "An hour later you were playing together.") },
    { l: L("Отомстить", "Get even"), tags: ["risk"], ch: () => .6, yes: { j: 3, t: -3 }, no: { t: -6, j: -3 }, ys: L("Счёт равный.", "Now you're even."), ns: L("Наказали обоих.", "You both got punished.") },
    { l: L("Пожаловаться родителям", "Tell your parents"), ch: () => .7, yes: { j: 2, t: -2 }, no: { t: -4 }, ys: L("Брата отправили мыть посуду.", "Your brother got dish duty."), ns: L("«Разбирайтесь сами».", "\"Sort it out yourselves.\"") },
  ]},
  { id: "cheat", from: 10, to: 14, if: p => p.f.school, t: L("Контрольная", "The test"), q: () => L("Завтра контрольная, а ты ничего не понимаешь. Сосед по парте предлагает списать.", "There's a test tomorrow and you don't get any of it. Your deskmate offers to let you copy."), o: [
    { l: L("Сидеть над учебником", "Hit the textbook"), tags: ["study"], ch: p => .4 + p.r.k / 200, yes: { k: 8 }, no: { k: 3, j: -3 }, ys: L("Четвёрка. Своя.", "A good grade. Your own."), ns: L("Не успел разобраться.", "Not enough time to get it.") },
    { l: L("Списать", "Copy"), tags: ["risk"], ch: () => .6, yes: { j: 2 }, no: { j: -6, t: -2 }, ys: L("Пронесло.", "You got away with it."), ns: L("Учитель заметил. Двойка обоим.", "The teacher noticed. You both failed.") },
  ]},
  { id: "kitten", from: 6, to: 14, if: p => !p.f.pet, t: L("Котёнок", "Kitten"), q: () => L("У подъезда пищит мокрый котёнок.", "A wet kitten is mewing by the door."), o: [
    { l: L("Принести домой", "Bring it home"), tags: ["care"], ch: p => .6 + p.r.t / 300, yes: { j: 8, t: 3 }, no: { j: -3 }, ys: L("Мама поворчала и налила молока.", "Mom grumbled and poured some milk."), ns: L("Родители не разрешили. Отнесли соседке.", "Your parents said no. You took it to a neighbor."), set: p => { p.f.pet = p.age; p.f.cat = true; } },
    { l: L("Покормить и уйти", "Feed it and go"), ch: () => 1, yes: { j: 2 }, ys: L("Котёнок теперь ждёт тебя каждый день.", "Now the kitten waits for you every day.") },
  ]},
  { id: "move", from: 5, to: 14, if: p => !p.f.childMove, w: .7, t: L("Переезд семьи", "Family move"), q: () => L("Отцу предложили работу в другом городе. Семья переезжает.", "Your father was offered a job in another city. The family is moving."), o: [
    { l: L("Помогать собирать вещи", "Help pack"), tags: ["social"], ch: () => .8, yes: { t: 4, m: 3, k: 2 }, no: { j: -4 }, ys: L("Новый город, новая школа, новые друзья.", "A new city, a new school, new friends."), ns: L("На новом месте долго было одиноко.", "It was lonely in the new place for a long time."), set: p => p.f.childMove = true },
    { l: L("Устроить бунт", "Protest"), ch: () => .3, yes: { t: 3 }, no: { j: -6, t: -2 }, ys: L("Переезд отложили. Ты победил.", "The move was postponed. You won."), ns: L("Всё равно переехали, а ты злишься.", "You moved anyway, and you're still angry."), set: p => p.f.childMove = true, setNo: p => p.f.childMove = true },
  ]},
  { id: "diary", from: 9, to: 14, if: p => !p.f.diary, t: L("Дневник", "Diary"), q: () => L("Тебе подарили толстую тетрадь с замочком.", "Someone gave you a thick notebook with a little lock."), o: [
    { l: L("Писать каждый вечер", "Write in it every night"), ch: () => .6, yes: { k: 4, j: 4 }, no: { k: 1 }, ys: L("Пятьдесят страниц тайн.", "Fifty pages of secrets."), ns: L("Хватило на две недели.", "It lasted two weeks."), set: p => p.f.diary = true },
    { l: L("Рисовать в ней", "Draw in it"), tags: ["art"], ch: () => 1, yes: { j: 4 }, ys: L("Каждая страница как окно.", "Every page is a window.") },
  ]},
  { id: "teentourney", from: 11, to: 17, if: p => p.f.sport, t: L("Соревнования", "Competition"), q: () => L("Первые серьёзные соревнования в области.", "Your first serious regional competition."), o: [
    { l: L("Тренироваться через боль", "Train through the pain"), tags: ["sport"], ch: p => .3 + p.r.h / 250, yes: { h: 4, j: 8 }, no: { h: -5 }, ys: L("Медаль. Пусть бронзовая.", "A medal. Bronze, but still."), ns: L("Растяжение за неделю до старта.", "A sprain a week before the start.") },
    { l: L("Выступить для опыта", "Compete for the experience"), ch: () => 1, yes: { j: 3, t: 2 }, ys: L("Узнал, на что способен.", "You learned what you're made of.") },
  ]},

  // ===== Юность =====
  { id: "parttime", from: 14, to: 18, t: L("Подработка", "Part-time job"), q: () => L("Хочется своих денег.", "You want money of your own."), o: [
    { l: L("Курьером на велосипеде", "Bike courier"), tags: ["work", "health"], ch: () => .85, yes: { m: 6, h: 2 }, no: { m: 2, h: -3 }, ys: L("Знаешь каждый двор в городе.", "You know every courtyard in town."), ns: L("Упал с велосипеда в первый же день.", "You fell off the bike on day one.") },
    { l: L("Помогать в кафе", "Help out at a café"), tags: ["work", "social"], ch: () => .8, yes: { m: 5, t: 3 }, no: { m: 1 }, ys: L("Научился варить кофе и улыбаться.", "You learned to make coffee and smile."), ns: L("Хозяин не заплатил за последний месяц.", "The owner didn't pay the last month."), set: p => p.f.kitchen = true },
    { l: L("Репетитор для младших", "Tutor younger kids"), if: p => p.r.k >= 40, tags: ["study"], ch: () => .85, yes: { m: 5, k: 4 }, no: { m: 1 }, ys: L("Объясняя, понял сам.", "Explaining it, you finally understood it yourself."), ns: L("Ученики не слушались.", "The kids wouldn't listen.") },
  ]},
  { id: "license", from: 16, to: 24, if: p => !p.f.license && p.c.d > .25, t: L("Права", "Driver's license"), q: () => L("Можно пойти учиться на водительские права.", "You could take driving lessons."), o: [
    { l: L("Учиться и сдавать", "Take lessons and the test"), tags: ["study"], ch: p => .55 + p.r.k / 400, yes: { k: 3, j: 4, m: -4 }, no: { m: -4, j: -3 }, ys: L("Сдал с первого раза!", "Passed on the first try!"), ns: L("Завалил параллельную парковку.", "Failed the parallel parking."), set: p => p.f.license = true },
    { l: L("Потом", "Later"), ch: () => 1, yes: { m: 2 }, ys: L("Автобус тоже ездит.", "The bus runs too.") },
  ]},
  { id: "party", from: 15, to: 19, t: L("Вечеринка", "The party"), q: () => L("Все идут на вечеринку. Родители против.", "Everyone's going to the party. Your parents say no."), o: [
    { l: L("Сбежать тайком", "Sneak out"), tags: ["risk", "social"], ch: () => .55, yes: { t: 6, j: 8 }, no: { t: -4, j: -4 }, ys: L("Танцевали до рассвета.", "You danced until dawn."), ns: L("Попался на обратном пути.", "Caught on the way back.") },
    { l: L("Уговорить родителей", "Talk your parents round"), tags: ["social"], ch: p => .3 + p.r.t / 200, yes: { t: 5, j: 6 }, no: { j: -3 }, ys: L("Отпустили до одиннадцати.", "They let you go until eleven."), ns: L("Нет значит нет.", "No means no.") },
    { l: L("Остаться дома", "Stay home"), ch: () => 1, yes: { k: 3 }, ys: L("Потом все показывали фотографии.", "Later everyone showed photos.") },
  ]},
  { id: "gapyear", from: 17, to: 22, if: p => !p.f.gap, t: L("Год на поиски", "A year to find yourself"), q: () => L("Можно взять год паузы перед взрослой жизнью.", "You could take a year off before adult life."), o: [
    { l: L("Путешествовать автостопом", "Hitchhike around"), tags: ["move", "risk"], ch: () => .65, yes: { j: 10, k: 4, t: 3 }, no: { m: -6, j: -3 }, ys: p => L(`Дорога довела до страны ${p._trip}.`, `The road took you all the way to ${p._trip}.`), ns: L("Застрял на трассе и вернулся домой.", "You got stuck on the highway and came home."), pre: p => p._trip = pickCountry(p).name, set: p => { p.f.gap = true; p.f.trips = (p.f.trips || 0) + 1; }, setNo: p => p.f.gap = true },
    { l: L("Волонтёром", "Volunteer"), tags: ["care", "social"], ch: () => .85, yes: { t: 8, j: 6 }, no: { j: 1 }, ys: L("Год, который изменил тебя.", "A year that changed you."), ns: L("Организация закрылась через месяц.", "The organization shut down after a month."), set: p => { p.f.gap = true; p.f.care = true; } },
    { l: L("Нет, сразу к делу", "No, get on with it"), ch: () => 1, yes: { m: 3 }, ys: L("Без пауз.", "No breaks."), set: p => p.f.gap = true },
  ]},
  { id: "exchange", from: 15, to: 23, if: p => p.c.d > .4 && p.f.school && !p.f.exchange, t: L("Обмен", "Exchange program"), q: () => L("Можно уехать учиться на семестр в другую страну.", "You could study abroad for a semester."), o: [
    { l: L("Подать заявку", "Apply"), tags: ["study", "move"], ch: p => .2 + p.r.k / 200 + .2 * p.c.d, yes: { k: 10, t: 5, j: 8, m: -5 }, no: { j: -3 }, ys: p => L(`Семестр в стране ${p._trip}. Новый язык, новые друзья.`, `A semester in ${p._trip}. A new language, new friends.`), ns: L("Место отдали другому.", "Someone else got the spot."), pre: p => p._trip = pickCountry(p, c => c !== p.c && c.d > .5).name, set: p => { p.f.exchange = true; p.f.langs = langs(p) + 1; p.f.trips = (p.f.trips || 0) + 1; } },
    { l: L("Не уезжать", "Stay"), ch: () => 1, yes: { t: 2 }, ys: L("Здесь тоже есть чему учиться.", "There's plenty to learn here too."), set: p => p.f.exchange = true },
  ]},
  { id: "language", from: 12, to: 60, repeat: 15, if: p => langs(p) < 4, t: L("Новый язык", "A new language"), q: () => L("Можно выучить ещё один язык.", "You could learn another language."), o: [
    { l: L("Курсы по вечерам", "Evening classes"), tags: ["study"], ch: p => .35 + p.r.k / 250 + (p.traits.includes("polyglot") ? .2 : 0), yes: { k: 7, m: -4 }, no: { m: -4 }, ys: L("Заговорил! С акцентом, но заговорил.", "You can speak it! With an accent, but you can."), ns: L("Застрял на неправильных глаголах.", "Stuck on irregular verbs."), set: p => p.f.langs = langs(p) + 1 },
    { l: L("Смотреть фильмы с субтитрами", "Watch films with subtitles"), tags: ["rest"], ch: () => .3, yes: { k: 5, j: 3 }, no: { j: 3 }, ys: L("Однажды субтитры стали не нужны.", "One day you didn't need the subtitles."), ns: L("Фильмы понравились, язык нет.", "You liked the films, not the grammar."), set: p => p.f.langs = langs(p) + 1 },
    { l: L("Не нужно", "No need"), ch: () => 1, yes: {}, ys: L("Обходишься жестами.", "Gestures will do.") },
  ]},
  { id: "faith", from: 15, to: 70, if: p => !p.f.faithDone, w: .6, t: L("Вера", "Faith"), q: () => L("Друзья зовут тебя в свою общину по выходным.", "Friends invite you to their community on weekends."), o: [
    { l: L("Ходить вместе с ними", "Go with them"), tags: ["social"], ch: () => 1, yes: { t: 8, j: 5 }, ys: L("Люди, которые всегда подставят плечо.", "People who'll always have your back."), set: p => p.f.faithDone = true },
    { l: L("Искать свой путь", "Find your own way"), ch: () => 1, yes: { k: 4, j: 3 }, ys: L("Много книг и долгих разговоров.", "Lots of books and long talks."), set: p => p.f.faithDone = true },
    { l: L("Это не моё", "Not for me"), ch: () => 1, yes: {}, ys: L("Каждый верит во что-то своё.", "Everyone believes in something."), set: p => p.f.faithDone = true },
  ]},
  { id: "heartbreak", from: 16, to: 30, if: p => !p.partner && !p.f.heartbreak, t: L("Без ответа", "Unrequited"), q: () => L("Человек, о котором ты думаешь, выбрал другого.", "The person you think about chose someone else."), o: [
    { l: L("Уйти в работу", "Throw yourself into work"), tags: ["work"], ch: () => 1, yes: { m: 6, j: -3 }, ys: L("Работа не задаёт вопросов.", "Work doesn't ask questions."), set: p => p.f.heartbreak = true },
    { l: L("Поговорить с друзьями", "Talk to friends"), tags: ["social"], ch: () => .9, yes: { t: 6, j: 3 }, no: { j: -3 }, ys: L("Друзья вытащили на море.", "Friends dragged you to the seaside."), ns: L("Друзья не поняли.", "Your friends didn't get it."), set: p => p.f.heartbreak = true },
    { l: L("Написать песню", "Write a song"), if: p => p.f.music, tags: ["music"], ch: () => .7, yes: { j: 8, k: 2 }, no: { j: -2 }, ys: L("Лучшая песня, что у тебя есть.", "The best song you've ever written."), ns: L("Слишком больно, чтобы петь.", "Too raw to sing."), set: p => { p.f.heartbreak = true; p.f.song = true; } },
  ]},
  { id: "volunteer", from: 16, to: 35, if: p => !p.f.care, t: L("Больница", "The hospital"), q: () => L("В больнице не хватает рук. Ищут волонтёров.", "The hospital is short-handed. They need volunteers."), o: [
    { l: L("Помогать по выходным", "Help on weekends"), tags: ["care", "social"], ch: () => .85, yes: { t: 6, k: 3, j: 4 }, no: { j: -2 }, ys: L("Старик из палаты 4 ждёт тебя каждую субботу.", "The old man in room 4 waits for you every Saturday."), ns: L("Тяжело. Ушёл через месяц.", "Too hard. You quit after a month."), set: p => p.f.care = true },
    { l: L("Сдать кровь", "Give blood"), tags: ["care"], ch: () => 1, yes: { t: 2, j: 4 }, ys: L("Пакет крови где-то спас чью-то жизнь.", "That bag of blood saved someone, somewhere."), set: p => p.f.donor = true },
    { l: L("Нет времени", "No time"), ch: () => 1, yes: {}, ys: L("Может, в другой раз.", "Maybe another time.") },
  ]},
);
})();
