// Взрослые будни и долгая старость: работа и коллеги, деньги и дом, друзья, дети-школьники, увлечения,
// соседи, родители, которые стареют, и всё, что случается после семидесяти. Маленькие сцены между большими развилками.
// Тексты на двух языках: L("по-русски", "in English"). Подключается после content-days.js.
(() => {
const L = window.tr;
const he = (p, m, f) => p.sex === "f" ? f : m;
const kidAge = (p, k) => p.age - k.born;
const kidOf = (p, from, to) => p.kids.find(k => kidAge(p, k) >= from && kidAge(p, k) <= to);
const pt = p => p.partner ? p.partner.first : "";
const working = p => p.job && !p.retired && !p.f.jail;
const office = p => working(p) && ["official", "it", "lawyer", "engineer", "business", "journalist", "translator", "designer", "architect", "diplomat", "gamedev", "scientist"].includes(p.job);

window.CARDS.push(
  // ===== Работа =====
  { id: "boss", ic: "👔", from: 22, to: 60, if: working, w: .8, repeat: 15, t: L("Новый начальник", "The new boss"), q: () => L("Пришёл новый начальник и сразу всё меняет.", "A new boss arrived and is changing everything."), o: [
    { l: L("Подстроиться", "Adapt"), tags: ["work"], ch: () => .8, yes: { m: 4, j: -2 }, no: { j: -4 }, ys: L("Через год он доверял тебе больше всех.", "A year later you were the one he trusted most."), ns: L("Не сработались.", "You never clicked.") },
    { l: L("Спорить по делу", "Argue your case"), tags: ["social", "risk"], ch: p => .4 + p.r.k / 300, yes: { j: 6, m: 4, k: 2 }, no: { m: -4, j: -4 }, ys: L("Он признал, что ты прав.", "He admitted you were right."), ns: L("Тебя перевели в дальний филиал.", "You got moved to a distant branch.") },
    { l: L("Искать новую работу", "Look for a new job"), tags: ["work", "risk"], ch: p => .4 + .3 * p.c.d, yes: { m: 6, j: 4 }, no: { j: -4 }, ys: L("Нашёл лучше.", "You found something better."), ns: L("Ничего достойного.", "Nothing worthwhile out there.") },
  ]},
  { id: "coworker", ic: "🤝", from: 22, to: 60, if: working, w: .7, t: L("Коллега", "A coworker"), q: () => L("Коллега выдаёт твою идею за свою на совещании.", "A coworker passes off your idea as their own in a meeting."), o: [
    { l: L("Сказать при всех", "Call it out in front of everyone"), tags: ["risk", "social"], ch: () => .5, yes: { j: 6, m: 3 }, no: { t: -4, j: -4 }, ys: L("Начальник запомнил, чья это идея.", "The boss remembered whose idea it was."), ns: L("Вышло некрасиво.", "It got ugly.") },
    { l: L("Поговорить с ним наедине", "Talk to them privately"), tags: ["social"], ch: () => .7, yes: { t: 4, j: 3 }, no: { j: -3 }, ys: L("Извинился. Теперь работаете вместе.", "They apologized. Now you work together."), ns: L("Сделал вид, что не понял.", "They pretended not to understand.") },
    { l: L("Промолчать", "Say nothing"), ch: () => 1, yes: { j: -3 }, ys: L("Обидно, но спокойно.", "It stings, but it's quiet.") },
  ]},
  { id: "officeparty", ic: "🎉", from: 22, to: 62, if: office, w: .6, repeat: 10, t: L("Корпоратив", "The office party"), q: () => L("Новогодний корпоратив. Начальник берёт микрофон караоке.", "The year-end party. The boss grabs the karaoke mic."), o: [
    { l: L("Спеть дуэтом", "Sing a duet"), tags: ["social", "risk"], ch: () => .7, yes: { t: 6, j: 6 }, no: { j: -4 }, ys: L("Это видео будут показывать новичкам.", "They'll show this video to new hires."), ns: L("Слова забыл ещё на первом куплете.", "Forgot the words in the first verse.") },
    { l: L("Уйти пораньше", "Leave early"), ch: () => 1, yes: { h: 2, t: -1 }, ys: L("Дома тишина.", "Quiet at home.") },
  ]},
  { id: "remote", ic: "💻", from: 24, to: 62, if: p => office(p) && p.c.d > .45 && !p.f.remote, w: .6, t: L("Из дома", "Working from home"), q: () => L("Можно работать из дома. Навсегда.", "You can work from home. Permanently."), o: [
    { l: L("Да, в пижаме", "Yes, in pajamas"), tags: ["rest"], ch: () => 1, yes: { j: 6, t: 3, h: -2 }, ys: L("Кот присутствует на всех совещаниях.", "The cat attends every meeting."), set: p => p.f.remote = true },
    { l: L("Нет, мне нужны люди", "No, I need people"), tags: ["social"], ch: () => 1, yes: { t: 4 }, ys: L("Обеды с коллегами остались.", "The office lunches stay."), set: p => p.f.remote = true },
  ]},
  { id: "nightshift", ic: "🌃", from: 18, to: 60, if: p => working(p) && ["worker", "nurse", "doctor", "driver", "firefighter", "soldier", "miner"].includes(p.job), w: .7, t: L("Ночная смена", "The night shift"), q: () => L("Ночные смены платят больше, но ты почти не видишь семью.", "Night shifts pay more, but you barely see your family."), o: [
    { l: L("Брать ночи", "Take the nights"), tags: ["work"], ch: () => 1, yes: { m: 8, t: -4, h: -3 }, ys: L("Рассветы ты видишь чаще всех.", "You see more sunrises than anyone."), set: p => p.f.nights = true },
    { l: L("Только дни", "Days only"), ch: () => 1, yes: { t: 3, h: 1 }, ys: L("Ужин вместе важнее.", "Dinner together matters more.") },
  ]},
  { id: "commute", ic: "🚌", from: 22, to: 60, if: p => working(p) && p.c.d > .3, w: .5, t: L("Дорога на работу", "The commute"), q: () => L("Два часа в дороге каждый день.", "Two hours of commuting every day."), o: [
    { l: L("Слушать аудиокниги", "Listen to audiobooks"), tags: ["study"], ch: () => 1, yes: { k: 6 }, ys: L("Двести книг за пять лет.", "Two hundred books in five years.") },
    { l: L("Переехать ближе", "Move closer"), tags: ["move"], ch: () => .6, yes: { j: 6, m: -6 }, no: { m: -4 }, ys: L("Пешком десять минут.", "A ten-minute walk now."), ns: L("Рядом всё слишком дорого.", "Everything nearby is too expensive.") },
    { l: L("Ездить на велосипеде", "Bike it"), tags: ["health"], ch: () => .8, yes: { h: 6, j: 2 }, no: { h: -2 }, ys: L("Ноги как у курьера.", "Legs like a bike messenger."), ns: L("Дождь шёл каждый день.", "It rained every day.") },
  ]},
  { id: "skills", ic: "🧠", from: 30, to: 58, if: working, w: .6, t: L("Новые навыки", "New skills"), q: () => L("Молодые коллеги умеют то, чего ты не понимаешь.", "Younger coworkers can do things you don't understand."), o: [
    { l: L("Попросить научить", "Ask them to teach you"), tags: ["study", "social"], ch: () => .85, yes: { k: 8, t: 3 }, no: { k: 2 }, ys: L("Теперь вы учите друг друга.", "Now you teach each other."), ns: L("Объясняли слишком быстро.", "They explained too fast.") },
    { l: L("Опыт важнее", "Experience matters more"), ch: () => .6, yes: { j: 2 }, no: { m: -4, j: -2 }, ys: L("Пока что важнее.", "For now, it does."), ns: L("Тебя обошли на повышении.", "You were passed over for promotion.") },
  ]},
  { id: "layoffs", ic: "📦", from: 30, to: 62, if: p => working(p) && p.job !== "business", w: .5, t: L("Сокращения", "Layoffs"), q: () => L("Ходят слухи о сокращениях. Нужно кого-то выбрать: тебя или молодого коллегу с ребёнком.", "There are rumors of layoffs. It's you or a young coworker with a baby."), o: [
    { l: L("Уйти самому", "Volunteer to go"), tags: ["social"], ch: () => 1, yes: { t: 8, j: 4, m: -10 }, ys: L("Он помнит это всю жизнь.", "He remembers it for the rest of his life."), set: p => { p.f.selfless = true; } },
    { l: L("Держаться за место", "Hold on to your job"), tags: ["work"], ch: () => .7, yes: { m: 2, j: -2 }, no: { m: -10, j: -6 }, ys: L("Оставили тебя.", "They kept you."), ns: L("Сократили обоих.", "They let you both go."), setNo: p => { p.job = null; p.jobLvl = 0; } },
  ]},

  // ===== Деньги и дом =====
  { id: "savings", ic: "🐷", from: 25, to: 60, if: p => p.r.m >= 35, w: .6, t: L("Подушка", "Rainy day fund"), q: () => L("Накопилась приличная сумма. Что с ней делать?", "You've saved a decent sum. What now?"), o: [
    { l: L("Отложить на чёрный день", "Keep it for a rainy day"), tags: ["work"], ch: () => 1, yes: { m: 4, j: 2 }, ys: L("Спишь спокойнее.", "You sleep easier."), set: p => p.f.cushion = true },
    { l: L("Ремонт мечты", "The dream renovation"), tags: ["rest"], ch: () => .8, yes: { j: 8, m: -8 }, no: { m: -10, j: -4 }, ys: L("Новая кухня, наконец.", "A new kitchen at last."), ns: L("Ремонт растянулся на год.", "The renovation dragged on for a year.") },
    { l: L("Свозить семью на море", "Take the family to the sea"), tags: ["rest", "social"], ch: () => 1, yes: { j: 8, t: 6, m: -8 }, ys: L("Фотографии висят до сих пор.", "The photos still hang on the wall."), set: p => p.f.trips = (p.f.trips || 0) + 1 },
  ]},
  { id: "rent", ic: "🏢", from: 22, to: 60, if: p => !p.f.house && p.c.d > .3, w: .6, t: L("Аренда", "The rent"), q: () => L("Хозяин квартиры поднимает аренду на треть.", "The landlord is raising the rent by a third."), o: [
    { l: L("Платить", "Pay it"), ch: () => 1, yes: { m: -6 }, ys: L("Дом есть дом.", "Home is home.") },
    { l: L("Переехать подальше", "Move further out"), tags: ["move"], ch: () => .8, yes: { m: 2, j: -2 }, no: { m: -4, j: -4 }, ys: L("Зато большой балкон.", "At least there's a big balcony."), ns: L("Новая квартира оказалась хуже.", "The new place turned out worse.") },
    { l: L("Торговаться", "Haggle"), tags: ["social"], ch: () => .45, yes: { m: 2, j: 2 }, no: { m: -6, j: -2 }, ys: L("Договорились на половину.", "You met halfway."), ns: L("Не уступил ни рубля.", "Not a penny off.") },
  ]},
  { id: "leak", ic: "🚿", from: 22, to: 85, w: .5, t: L("Потоп", "The flood"), q: () => L("Ночью ты затопил соседей снизу.", "During the night you flooded the neighbors below."), o: [
    { l: L("Пойти с извинениями и тортом", "Go down with apologies and a cake"), tags: ["social"], ch: () => .85, yes: { t: 6, m: -4 }, no: { m: -8 }, ys: L("Теперь вы пьёте чай по пятницам.", "Now you have tea together on Fridays."), ns: L("Счёт за их ремонт.", "You got the bill for their repairs.") },
    { l: L("Ждать, пока сами придут", "Wait for them to come up"), ch: () => 1, yes: { t: -4, m: -6 }, ys: L("Пришли. Злые.", "They came. Angry.") },
  ]},
  { id: "tax", ic: "🧾", from: 25, to: 70, if: p => p.c.d > .3 && p.r.m >= 25, w: .4, t: L("Налоги", "Taxes"), q: () => L("Пришло письмо из налоговой. Ты что-то не заплатил.", "A letter from the tax office. You missed something."), o: [
    { l: L("Разобраться самому", "Sort it out yourself"), tags: ["study"], ch: () => .6, yes: { k: 4 }, no: { m: -6, j: -3 }, ys: L("Это была их ошибка.", "It was their mistake."), ns: L("Штраф и пени.", "A fine plus interest.") },
    { l: L("Нанять бухгалтера", "Hire an accountant"), ch: () => .9, yes: { m: -2, j: 2 }, no: { m: -6 }, ys: L("Он ещё и вернул тебе переплату.", "They even got you a refund."), ns: L("Бухгалтер ошибся дважды.", "The accountant messed up twice.") },
  ]},
  { id: "neighbors", ic: "🔊", from: 22, to: 90, w: .5, t: L("Соседи", "The neighbors"), q: () => L("Соседи сверху делают ремонт уже полгода. Каждое утро в семь.", "The upstairs neighbors have been renovating for six months. Every morning at seven."), o: [
    { l: L("Позвать на чай и договориться", "Invite them for tea and work it out"), tags: ["social"], ch: () => .75, yes: { t: 6, j: 4 }, no: { j: -3 }, ys: L("Перенесли дрель на после обеда.", "They moved the drilling to the afternoon."), ns: L("Обещали. Забыли.", "They promised. Then forgot.") },
    { l: L("Беруши", "Earplugs"), ch: () => 1, yes: { j: -1, h: 1 }, ys: L("Лучшая покупка года.", "Best purchase of the year.") },
  ]},
  { id: "garage", ic: "🔧", from: 25, to: 80, if: p => p.f.handy || p.f.car, w: .5, t: L("Гараж", "The garage"), q: () => L("Сосед просит помочь с машиной. Говорит, на час.", "A neighbor asks for help with his car. Says it'll take an hour."), o: [
    { l: L("Помочь", "Help"), tags: ["social"], ch: () => 1, yes: { t: 5, k: 2, j: 2 }, ys: L("Час превратился в весь вечер. Хороший вечер.", "The hour became the whole evening. A good evening."), set: p => p.f.handy = true },
    { l: L("Отправить в сервис", "Send him to a mechanic"), ch: () => 1, yes: { t: -2 }, ys: L("Он справился. Но запомнил.", "He managed. But he remembered.") },
  ]},
  { id: "mortgage", ic: "🏦", from: 26, to: 48, if: p => !p.f.house && p.c.d > .45 && p.r.m >= 30 && p.job, w: .8, t: L("Ипотека", "The mortgage"), q: () => L("Банк одобрил ипотеку на двадцать лет.", "The bank approved a twenty-year mortgage."), o: [
    { l: L("Подписать", "Sign"), tags: ["risk"], ch: () => .8, yes: { j: 8, m: -10 }, no: { m: -14, j: -6 }, ys: L("Ключи от своей квартиры. Двадцать лет платежей.", "Keys to your own place. Twenty years of payments."), ns: L("Ставки выросли. Тяжело.", "Rates went up. It's tough."), set: p => p.f.house = true, setNo: p => p.f.house = true, fx: "home" },
    { l: L("Копить дальше", "Keep saving"), ch: () => 1, yes: { m: 3 }, ys: L("Аренда тоже не навсегда.", "Renting won't last forever either.") },
  ]},

  // ===== Друзья =====
  { id: "friendwed", ic: "💐", from: 22, to: 45, w: .6, t: L("Свадьба друга", "A friend's wedding"), q: () => L("Лучший друг женится и просит тебя быть свидетелем.", "Your best friend is getting married and wants you as the witness."), o: [
    { l: L("Сказать речь", "Give a speech"), tags: ["social", "risk"], ch: () => .7, yes: { t: 8, j: 6 }, no: { j: -3, t: 2 }, ys: L("Невеста плакала, жених тоже.", "The bride cried, the groom too."), ns: L("Шутка про бывшую была лишней.", "The joke about the ex was a mistake.") },
    { l: L("Тихо подержать кольца", "Just hold the rings"), ch: () => 1, yes: { t: 4 }, ys: L("Кольца не потерял. Это главное.", "Didn't lose the rings. That's what counts.") },
  ]},
  { id: "godparent", ic: "🕊", from: 24, to: 55, w: .5, t: L("Крёстный", "Godparent"), q: () => L("Друзья просят тебя стать крёстным их ребёнку.", "Friends ask you to be their child's godparent."), o: [
    { l: L("Согласиться", "Agree"), tags: ["social"], ch: () => 1, yes: { t: 8, j: 4 }, ys: L("Подарки на каждый день рождения. Двадцать лет.", "A present every birthday. For twenty years."), set: p => p.f.godparent = true },
    { l: L("Отказаться: я не готов", "Decline: not ready"), ch: () => 1, yes: { t: -3 }, ys: L("Поняли. Но немного обиделись.", "They understood. A little hurt, though.") },
  ]},
  { id: "classreunion", ic: "📸", from: 30, to: 60, repeat: 10, w: .6, t: L("Встреча выпускников", "Class reunion"), q: p => L(`${p.age - 17} лет после школы. Зовут на встречу.`, `${p.age - 17} years since school. There's a reunion.`), o: [
    { l: L("Пойти", "Go"), tags: ["social"], ch: () => .85, yes: { t: 6, j: 6 }, no: { j: -3 }, ys: L("Отличница стала клоуном, хулиган — профессором.", "The straight-A student became a clown, the troublemaker a professor."), ns: L("Все говорили только о деньгах.", "Everyone only talked about money.") },
    { l: L("Посмотреть фото в сети", "Look at the photos online"), ch: () => 1, yes: { j: -1 }, ys: L("Все постарели. Кроме тебя, конечно.", "Everyone got old. Except you, of course.") },
  ]},
  { id: "friendcrisis", ic: "☎", from: 25, to: 80, w: .5, t: L("Звонок в два ночи", "A 2 a.m. call"), q: () => L("Звонит старый друг. Голос странный. Говорит, что ему плохо.", "An old friend calls. Their voice sounds strange. They say they're not okay."), o: [
    { l: L("Ехать к нему сейчас", "Go to them right now"), tags: ["care", "social"], ch: () => 1, yes: { t: 10, j: 4, h: -2 }, ys: L("Проговорили до утра. Через год он сказал, что ты его спас.", "You talked till morning. A year later they said you saved them."), set: p => p.f.friendSaved = true },
    { l: L("Поговорить по телефону", "Talk on the phone"), tags: ["social"], ch: () => .8, yes: { t: 6 }, no: { t: -4, j: -4 }, ys: L("Голос стал спокойнее.", "Their voice grew calmer."), ns: L("Он повесил трубку. Утром ты поехал сам.", "They hung up. In the morning you went over yourself.") },
  ]},
  { id: "boardgames", ic: "🎲", from: 20, to: 85, w: .5, repeat: 15, t: L("Вечер игр", "Game night"), q: () => L("Друзья собираются по пятницам играть в настолки.", "Friends get together on Fridays for board games."), o: [
    { l: L("Стать постоянным игроком", "Become a regular"), tags: ["social"], ch: () => 1, yes: { t: 6, j: 5 }, ys: L("Монополия разрушила две дружбы и создала три.", "Monopoly ended two friendships and started three.") },
    { l: L("Иногда заглядывать", "Drop in sometimes"), ch: () => 1, yes: { t: 2, j: 2 }, ys: L("Тебя всегда ждут.", "You're always welcome.") },
  ]},

  // ===== Дети-школьники =====
  { id: "kidschool", ic: "🏫", from: 25, to: 60, if: p => kidOf(p, 5, 8) && !p.f.kidSchool, t: L("Первый класс", "First grade"), q: p => { const k = kidOf(p, 5, 8); return L(`${k.first} идёт в первый класс. Огромный рюкзак и маленькие плечи.`, `${k.first} is starting school. A huge backpack on small shoulders.`); }, o: [
    { l: L("Отвести за руку", "Walk them in holding hands"), tags: ["social"], ch: () => 1, yes: { t: 8, j: 6 }, ys: L("Ты плакал больше, чем ребёнок.", "You cried more than the kid did."), set: p => p.f.kidSchool = true, fx: "grad" },
    { l: L("Работа: отведёт бабушка", "Work: grandma will take them"), tags: ["work"], ch: () => 1, yes: { m: 3, t: -2 }, ys: L("Фото пришло в обеденный перерыв.", "The photo arrived on your lunch break."), set: p => p.f.kidSchool = true },
  ]},
  { id: "homework", ic: "➗", from: 28, to: 65, if: p => kidOf(p, 7, 14), w: .6, t: L("Домашка", "Homework"), q: p => { const k = kidOf(p, 7, 14); return L(`${k.first} плачет над задачей про поезда.`, `${k.first} is crying over a problem about trains.`); }, o: [
    { l: L("Разобраться вместе", "Work it out together"), tags: ["study", "social"], ch: p => .4 + p.r.k / 200, yes: { t: 6, k: 2 }, no: { t: -2, j: -3 }, ys: L("Поезда встретились. Вы обнялись.", "The trains met. So did you, in a hug."), ns: L("Ответ сошёлся только у соседей.", "Only the neighbors got the right answer.") },
    { l: L("Пусть учится сам", "Let them learn on their own"), ch: () => .6, yes: { k: 1 }, no: { t: -3 }, ys: L("Решил! Сам!", "Solved it! Alone!"), ns: L("Двойка. И обида.", "An F. And hurt feelings.") },
  ]},
  { id: "kiddog", ic: "🐕", from: 28, to: 65, if: p => kidOf(p, 6, 14) && p.f.pet == null, w: .6, t: L("Хочу собаку", "I want a dog"), q: p => { const k = kidOf(p, 6, 14); return L(`${k.first} третий месяц просит собаку и клянётся гулять с ней сам.`, `${k.first} has begged for a dog for three months and swears to walk it every day.`); }, o: [
    { l: L("Сдаться", "Give in"), tags: ["social"], ch: () => 1, yes: { j: 8, t: 6, m: -3 }, ys: L("Гуляешь с ней ты. Конечно.", "You're the one walking it. Of course."), set: p => p.f.pet = p.age, fx: "paw" },
    { l: L("Сначала рыбки", "Fish first"), ch: () => 1, yes: { t: -2, j: 1 }, ys: L("Рыбок назвали Тузик и Шарик.", "The fish were named Rex and Buddy.") },
  ]},
  { id: "kidsick", ic: "🌡", from: 25, to: 65, if: p => kidOf(p, 0, 12), w: .5, t: L("Ребёнок заболел", "A sick child"), q: p => { const k = kidOf(p, 0, 12); return L(`У ${k.first} высокая температура, а у тебя важная встреча.`, `${k.first} has a high fever, and you have an important meeting.`); }, o: [
    { l: L("Остаться дома", "Stay home"), tags: ["care"], ch: () => 1, yes: { t: 8, m: -3 }, ys: L("Мультики, чай с малиной и твоя рука на лбу.", "Cartoons, raspberry tea and your hand on their forehead.") },
    { l: L("Позвать няню", "Call a sitter"), if: p => p.r.m >= 30, tags: ["work"], ch: () => .85, yes: { m: 4, t: -2 }, no: { t: -5 }, ys: L("Встреча прошла отлично.", "The meeting went great."), ns: L("Няня не пришла.", "The sitter didn't show.") },
  ]},
  { id: "kidband", ic: "🥁", from: 30, to: 70, if: p => kidOf(p, 12, 18), w: .5, t: L("Гараж-группа", "The garage band"), q: p => { const k = kidOf(p, 12, 18); return L(`${k.first} собрал группу. Репетиции у вас дома.`, `${k.first} started a band. Rehearsals are at your place.`); }, o: [
    { l: L("Купить барабаны", "Buy a drum kit"), tags: ["social"], ch: () => 1, yes: { t: 8, j: 4, m: -4 }, ys: L("Соседи переехали. Группа осталась.", "The neighbors moved out. The band stayed.") },
    { l: L("Только в наушниках", "Headphones only"), ch: () => 1, yes: { t: -2, h: 1 }, ys: L("Электронные барабаны. Тишина.", "An electronic kit. Silence.") },
  ]},
  { id: "kiddrive", ic: "🚙", from: 33, to: 70, if: p => kidOf(p, 16, 19) && p.f.car, w: .5, t: L("За рулём", "Behind the wheel"), q: p => { const k = kidOf(p, 16, 19); return L(`${k.first} просит научить водить. На твоей машине.`, `${k.first} wants you to teach them to drive. In your car.`); }, o: [
    { l: L("Учить", "Teach them"), tags: ["social", "risk"], ch: () => .8, yes: { t: 8, j: 2 }, no: { m: -5, t: 2 }, ys: L("Ты понял, что такое страх. И гордость.", "You learned what fear is. And pride."), ns: L("Бампер о столб. Все целы.", "The bumper met a pole. Everyone's fine.") },
    { l: L("Пусть идёт в автошколу", "Send them to driving school"), ch: () => 1, yes: { m: -3 }, ys: L("Нервы целы.", "Your nerves survive.") },
  ]},
  { id: "parentmeet", ic: "🗣", from: 30, to: 60, if: p => kidOf(p, 7, 17), w: .4, t: L("Родительское собрание", "Parents' evening"), q: () => L("Учитель говорит, что твой ребёнок очень талантлив. И очень болтлив.", "The teacher says your kid is very talented. And very chatty."), o: [
    { l: L("Гордиться", "Be proud"), ch: () => 1, yes: { j: 4, t: 3 }, ys: L("Талантлив, весь в тебя.", "Talented. Takes after you.") },
    { l: L("Поговорить дома", "Have a talk at home"), tags: ["social"], ch: () => .7, yes: { t: 4, k: 1 }, no: { t: -2 }, ys: L("Пообещал болтать на переменах.", "They promised to chat only at break."), ns: L("Обиделся на весь вечер.", "Sulked all evening.") },
  ]},

  // ===== Пара =====
  { id: "datenight", ic: "🕯", from: 25, to: 75, if: p => p.married, w: .6, repeat: 10, t: L("Вечер вдвоём", "Date night"), q: p => L(`Вы с ${pt(p)} давно никуда не ходили вдвоём.`, `You and ${pt(p)} haven't been out alone in ages.`), o: [
    { l: L("Тот самый ресторан", "That restaurant"), tags: ["love"], ch: () => 1, yes: { t: 6, j: 6, m: -3 }, ys: L("Официант тот же. И вы те же.", "Same waiter. Same you.") },
    { l: L("Танцы", "Dancing"), tags: ["love", "health"], ch: () => .8, yes: { t: 6, j: 6, h: 2 }, no: { j: 2 }, ys: L("Наступил на ногу. Смеялись до слёз.", "You stepped on a foot. You laughed till you cried."), ns: L("Музыка не та.", "Wrong music.") },
    { l: L("Сериал на диване", "A show on the couch"), ch: () => 1, yes: { t: 3, j: 3 }, ys: L("Уснули на второй серии. Вместе.", "You both fell asleep in episode two. Together.") },
  ]},
  { id: "inlaws", ic: "🫖", from: 22, to: 60, if: p => p.married && !p.f.inlaws, w: .6, t: L("Родители супруга", "The in-laws"), q: p => L(`Родители ${pt(p)} приезжают на месяц.`, `${pt(p)}'s parents are coming to stay for a month.`), o: [
    { l: L("Принять как родных", "Welcome them like family"), tags: ["social"], ch: () => .75, yes: { t: 8, j: 2 }, no: { j: -6 }, ys: L("Свекровь научила тебя своему пирогу.", "Your mother-in-law taught you her pie."), ns: L("Месяц показался годом.", "The month felt like a year."), set: p => p.f.inlaws = true, setNo: p => p.f.inlaws = true },
    { l: L("Снять им квартиру рядом", "Rent them a flat nearby"), if: p => p.r.m >= 35, ch: () => 1, yes: { m: -6, j: 4, t: 2 }, ys: L("Лучшее решение брака.", "The best decision of the marriage."), set: p => p.f.inlaws = true },
  ]},
  { id: "honeymoon2", ic: "🏝", from: 40, to: 80, if: p => p.married && p.age - (p.f.marriedAt ?? p.age) >= 15 && !p.f.honeymoon2, w: .6, t: L("Второй медовый месяц", "Second honeymoon"), q: p => L(`${pt(p)} предлагает съездить туда, где вы были после свадьбы.`, `${pt(p)} suggests going back to where you went after the wedding.`), o: [
    { l: L("Ехать", "Go"), tags: ["love", "rest"], ch: () => .9, yes: { t: 10, j: 10, m: -6 }, no: { j: 2, m: -6 }, ys: L("Тот же пляж, морщинки, тот же закат.", "The same beach, a few more wrinkles, the same sunset."), ns: L("Там построили отель. Но вы рядом.", "They built a hotel there. But you're together."), set: p => { p.f.honeymoon2 = true; p.f.trips = (p.f.trips || 0) + 1; }, setNo: p => p.f.honeymoon2 = true, fx: "love" },
    { l: L("Некогда", "No time"), ch: () => 1, yes: { t: -4 }, ys: L("Может, на пенсии.", "Maybe after retirement."), set: p => p.f.honeymoon2 = true },
  ]},

  // ===== Здоровье и тело =====
  { id: "dentist", ic: "🦷", from: 20, to: 80, w: .5, repeat: 20, t: L("Зуб", "The tooth"), q: () => L("Зуб ноет уже неделю.", "A tooth has been aching for a week."), o: [
    { l: L("К стоматологу", "Go to the dentist"), tags: ["health"], ch: p => .6 + .35 * p.c.d, yes: { h: 3, m: -3 }, no: { h: -2, m: -3 }, ys: L("Пять минут страха, и всё.", "Five minutes of fear, and done."), ns: L("Пришлось удалить.", "It had to come out.") },
    { l: L("Терпеть", "Tough it out"), ch: () => .3, yes: { m: 1 }, no: { h: -4, j: -4 }, ys: L("Прошло само. Повезло.", "It went away. Lucky."), ns: L("Флюс на полщеки.", "Your cheek swelled up like a ball.") },
  ]},
  { id: "glasses", ic: "👓", from: 38, to: 60, if: p => !p.f.glasses, w: .7, t: L("Мелкий шрифт", "Small print"), q: () => L("Меню приходится держать на вытянутой руке.", "You have to hold the menu at arm's length."), o: [
    { l: L("Купить очки", "Get glasses"), tags: ["health"], ch: () => 1, yes: { k: 3, j: 2 }, ys: L("Оказывается, у деревьев есть листья.", "Turns out trees have leaves."), set: p => p.f.glasses = true },
    { l: L("Свет плохой", "It's just bad lighting"), ch: () => 1, yes: { j: -2 }, ys: L("Свет тут ни при чём.", "It's not the lighting."), set: p => p.f.glasses = true },
  ]},
  { id: "insomnia", ic: "🌙", from: 30, to: 75, w: .5, t: L("Бессонница", "Insomnia"), q: () => L("Ты не можешь уснуть до трёх ночи. Месяц подряд.", "You can't fall asleep before 3 a.m. For a month now."), o: [
    { l: L("Убрать экраны вечером", "No screens at night"), tags: ["health"], ch: () => .7, yes: { h: 5, j: 4 }, no: { h: -2 }, ys: L("Книга вместо телефона. Сон вернулся.", "A book instead of the phone. Sleep came back."), ns: L("Не помогло.", "It didn't help.") },
    { l: L("Вставать и работать", "Get up and work"), tags: ["work"], ch: () => 1, yes: { m: 4, h: -4 }, ys: L("Продуктивно. И очень устало.", "Productive. And very tired.") },
  ]},
  { id: "gym", ic: "🏋", from: 25, to: 65, if: p => p.c.d > .3, w: .6, t: L("Абонемент", "The gym pass"), q: () => L("Купил абонемент в спортзал на год.", "You bought a year-long gym pass."), o: [
    { l: L("Ходить три раза в неделю", "Go three times a week"), tags: ["health", "sport"], ch: p => .45 + p.r.h / 300, yes: { h: 8, j: 4 }, no: { h: 1, m: -3 }, ys: L("Брюки стали велики.", "Your trousers got too big."), ns: L("Ходил до февраля.", "You went until February.") },
    { l: L("Ходить «с понедельника»", "Start \"next Monday\""), ch: () => 1, yes: { m: -3, j: -1 }, ys: L("Понедельник так и не настал.", "Monday never came.") },
  ]},
  { id: "quitsmoke", ic: "🚭", from: 25, to: 75, if: p => p.f.smoker, w: 1.2, t: L("Последняя сигарета", "The last cigarette"), q: () => L("Врач показал снимок лёгких.", "The doctor showed you an X-ray of your lungs."), o: [
    { l: L("Бросить сегодня", "Quit today"), tags: ["health"], ch: p => .4 + (p.traits.includes("stubborn") ? .2 : 0), yes: { h: 10, j: 4, m: 3 }, no: { h: -2, j: -3 }, ys: L("Год без единой сигареты.", "A whole year without a cigarette."), ns: L("Сорвался через неделю.", "You relapsed after a week."), set: p => p.f.smoker = false },
    { l: L("Потом", "Later"), ch: () => 1, yes: { h: -2 }, ys: L("Потом так потом.", "Later, then.") },
  ]},
  { id: "blood", ic: "🩸", from: 18, to: 60, if: p => p.r.h >= 50, w: .5, t: L("Донор", "Blood donor"), q: () => L("Больнице не хватает крови твоей группы.", "The hospital is short of your blood type."), o: [
    { l: L("Сдать кровь", "Donate"), tags: ["care"], ch: () => 1, yes: { t: 4, j: 6, h: -1 }, ys: L("Где-то бьётся чьё-то сердце с твоей кровью.", "Somewhere a heart is beating with your blood."), set: p => p.f.donor = true },
    { l: L("Боюсь иголок", "Scared of needles"), ch: () => 1, yes: {}, ys: L("Может, в следующий раз.", "Maybe next time.") },
  ]},
  { id: "swim", ic: "🏊", from: 20, to: 70, if: p => !p.f.swim, w: .5, t: L("Плавать", "Learning to swim"), q: () => L("Ты так и не научился плавать. Стыдно, но факт.", "You never learned to swim. Embarrassing, but true."), o: [
    { l: L("Записаться в бассейн", "Sign up for lessons"), tags: ["health", "sport"], ch: () => .8, yes: { h: 5, j: 6 }, no: { j: -2 }, ys: L("Первые двадцать пять метров без рук инструктора.", "Your first twenty-five meters without the coach's hands."), ns: L("Вода в нос. Страшно.", "Water up your nose. Scary."), set: p => p.f.swim = true },
    { l: L("Мне хватит берега", "The shore is fine"), ch: () => 1, yes: {}, ys: L("Песок тоже приятный.", "Sand is nice too."), set: p => p.f.swim = true },
  ]},

  // ===== Увлечения =====
  { id: "choir", ic: "🎶", from: 25, to: 95, if: p => !p.f.choir, w: .5, t: L("Хор", "The choir"), q: () => L("В доме культуры набирают хор. Голос не важен, говорят они.", "The community center is starting a choir. Voice doesn't matter, they say."), o: [
    { l: L("Петь", "Sing"), tags: ["social", "music"], ch: () => 1, yes: { t: 6, j: 8 }, ys: L("Вы взяли второе место на городском конкурсе.", "You took second place at the city contest."), set: p => { p.f.choir = true; p.f.music = true; } },
    { l: L("Слушать из зала", "Listen from the audience"), ch: () => 1, yes: { j: 2 }, ys: L("Хлопал громче всех.", "You clapped the loudest."), set: p => p.f.choir = true },
  ]},
  { id: "pottery", ic: "🏺", from: 25, to: 90, if: p => !p.f.pottery, w: .4, t: L("Гончарный круг", "The potter's wheel"), q: () => L("Друг зовёт на мастер-класс по керамике.", "A friend invites you to a pottery class."), o: [
    { l: L("Пойти", "Go"), tags: ["art", "rest"], ch: () => .7, yes: { j: 8, k: 2 }, no: { j: 3 }, ys: L("Кривая чашка. Лучшая в доме.", "A wonky mug. The best in the house."), ns: L("Глина улетела в стену.", "The clay flew into the wall."), set: p => { p.f.pottery = true; p.f.art = true; }, setNo: p => p.f.pottery = true },
    { l: L("Нет", "No"), ch: () => 1, yes: {}, ys: L("Чашки можно купить.", "You can buy mugs."), set: p => p.f.pottery = true },
  ]},
  { id: "guitarlate", ic: "🎸", from: 30, to: 80, if: p => !p.f.music && !p.f.guitarLate, w: .5, t: L("Гитара", "The guitar"), q: () => L("Гитара пылится на шкафу с юности.", "The guitar has been gathering dust on the wardrobe since you were young."), o: [
    { l: L("Научиться наконец", "Finally learn"), tags: ["music", "art"], ch: () => .7, yes: { j: 8, k: 3 }, no: { j: 1 }, ys: L("Три аккорда. Этого хватает на всё.", "Three chords. That's enough for everything."), ns: L("Пальцы не слушаются.", "Your fingers won't cooperate."), set: p => { p.f.guitarLate = true; p.f.music = true; }, setNo: p => p.f.guitarLate = true },
    { l: L("Отдать племяннику", "Give it to a nephew"), tags: ["social"], ch: () => 1, yes: { t: 4 }, ys: L("Он играет. Хорошо играет.", "He plays. He plays well."), set: p => p.f.guitarLate = true },
  ]},
  { id: "birds", ic: "🐦", from: 30, to: 95, if: p => !p.f.birds, w: .4, t: L("Птицы", "Birds"), q: () => L("Ты заметил, что за окном живут шесть разных видов птиц.", "You noticed six different kinds of birds outside your window."), o: [
    { l: L("Завести бинокль и тетрадь", "Get binoculars and a notebook"), tags: ["study", "rest"], ch: () => 1, yes: { k: 4, j: 6 }, ys: L("Через год в тетради сто двадцать видов.", "A year later, a hundred and twenty species in the notebook."), set: p => p.f.birds = true },
    { l: L("Повесить кормушку", "Hang a feeder"), ch: () => 1, yes: { j: 4 }, ys: L("Синицы приходят по расписанию.", "The tits arrive on schedule."), set: p => p.f.birds = true },
  ]},
  { id: "puzzle", ic: "🧩", from: 30, to: 100, w: .4, repeat: 20, t: L("Пазл", "The jigsaw"), q: () => L("Подарили пазл на пять тысяч деталей.", "Someone gave you a five-thousand-piece jigsaw."), o: [
    { l: L("Собрать за зиму", "Finish it over winter"), tags: ["rest"], ch: () => .7, yes: { j: 6, k: 2 }, no: { j: -1 }, ys: L("Одна деталь пропала. Нашлась у кота.", "One piece was missing. The cat had it."), ns: L("Стол занят уже год.", "The table has been taken for a year.") },
    { l: L("Собирать с внуками или друзьями", "Do it with others"), tags: ["social"], ch: () => 1, yes: { t: 5, j: 4 }, ys: L("Каждый вечер кто-то заходит на «пару деталей».", "Every evening someone drops by for \"just a few pieces\".") },
  ]},
  { id: "bike2", ic: "🚴", from: 30, to: 75, if: p => p.r.h >= 45 && !p.f.cyclist, w: .4, t: L("Велопоход", "Bike tour"), q: () => L("Клуб велосипедистов едет на неделю вдоль реки.", "The cycling club is riding along the river for a week."), o: [
    { l: L("Ехать", "Go"), tags: ["sport", "health"], ch: p => .5 + p.r.h / 250, yes: { h: 6, j: 8, t: 4 }, no: { h: -3, j: 2 }, ys: L("Шестьсот километров и новая привычка.", "Six hundred kilometers and a new habit."), ns: L("Сошёл на третий день. Колени.", "You quit on day three. Knees."), set: p => p.f.cyclist = true, setNo: p => p.f.cyclist = true },
    { l: L("Махать с берега", "Wave from the bank"), ch: () => 1, yes: {}, ys: L("Доброго пути.", "Safe travels."), set: p => p.f.cyclist = true },
  ]},
  { id: "jury", ic: "⚖", from: 25, to: 70, if: p => p.c.d > .7 && !p.f.jury, w: .4, t: L("Присяжный", "Jury duty"), q: () => L("Тебя вызвали в присяжные. Дело о краже велосипеда.", "You've been called for jury duty. A stolen bicycle case."), o: [
    { l: L("Разобраться честно", "Weigh it fairly"), tags: ["study"], ch: () => 1, yes: { k: 4, j: 2 }, ys: L("Ты единственный заметил, что велосипед был женский.", "You were the only one who noticed it was a women's bike."), set: p => p.f.jury = true },
    { l: L("Взять самоотвод", "Get excused"), ch: () => .6, yes: { m: 2 }, no: { j: -2 }, ys: L("Освободили.", "Excused."), ns: L("Не освободили. Скучно.", "Not excused. Boring."), set: p => p.f.jury = true, setNo: p => p.f.jury = true },
  ]},
  { id: "cleanup", ic: "🧤", from: 15, to: 85, w: .4, repeat: 20, t: L("Субботник", "Cleanup day"), q: () => L("Соседи собираются убрать берег речки.", "The neighbors are cleaning up the riverbank."), o: [
    { l: L("Взять мешки и перчатки", "Grab bags and gloves"), tags: ["social"], ch: () => 1, yes: { t: 6, j: 4, h: 1 }, ys: L("Сорок мешков и шашлык в конце.", "Forty bags and a barbecue at the end.") },
    { l: L("Выспаться", "Sleep in"), tags: ["rest"], ch: () => 1, yes: { j: 2, t: -2 }, ys: L("Берег всё равно стал чище.", "The bank got cleaner anyway.") },
  ]},

  // ===== Родители стареют =====
  { id: "parentmove", ic: "🏡", from: 35, to: 70, if: p => (p.parents.mAlive || p.parents.fAlive) && !p.f.parentMove, w: .7, t: L("Мама одна", "Mom alone"), q: () => L("Родителям тяжело одним. Им нужна помощь каждый день.", "Your parents are struggling alone. They need help every day."), o: [
    { l: L("Забрать к себе", "Bring them to live with you"), tags: ["care", "social"], ch: () => .75, yes: { t: 10, j: 2, m: -4 }, no: { t: 4, j: -6 }, ys: L("Внуки узнали все семейные истории.", "The grandkids learned every family story."), ns: L("Тесно и нервно, но вместе.", "Cramped and tense, but together."), set: p => p.f.parentMove = true, setNo: p => p.f.parentMove = true },
    { l: L("Нанять сиделку", "Hire a caregiver"), if: p => p.r.m >= 35, tags: ["care"], ch: () => .85, yes: { m: -8, t: 4 }, no: { m: -8, t: -2 }, ys: L("Звонишь каждый вечер.", "You call every evening."), ns: L("Сиделка менялась трижды.", "The caregiver changed three times."), set: p => p.f.parentMove = true, setNo: p => p.f.parentMove = true },
    { l: L("Ездить по выходным", "Visit on weekends"), tags: ["social"], ch: () => 1, yes: { t: 4, h: -2 }, ys: L("Пятьсот километров каждую субботу.", "Five hundred kilometers every Saturday."), set: p => p.f.parentMove = true },
  ]},
  { id: "parentstory", ic: "🎙", from: 30, to: 70, if: p => p.parents.mAlive || p.parents.fAlive, w: .5, t: L("Записать голос", "Recording their voice"), q: () => L("Ты понял, что почти ничего не знаешь о молодости родителей.", "You realize you know almost nothing about your parents' youth."), o: [
    { l: L("Записать их рассказы", "Record their stories"), tags: ["social"], ch: () => 1, yes: { t: 8, k: 3, j: 4 }, ys: L("Двадцать часов записей. Ты будешь слушать их всю жизнь.", "Twenty hours of recordings. You'll listen to them for the rest of your life."), set: p => p.f.recorded = true },
    { l: L("Как-нибудь потом", "Some other time"), ch: () => 1, yes: {}, ys: L("Потом может не быть.", "There may not be a later.") },
  ]},

  // ===== Старость =====
  { id: "pensionplan", ic: "💼", from: 60, to: 72, if: p => p.retired && !p.f.pensionPlan, t: L("Первый день на пенсии", "First day of retirement"), q: () => L("Будильник больше не звонит. Что дальше?", "The alarm doesn't ring anymore. What now?"), o: [
    { l: L("Наконец-то путешествовать", "Finally travel"), if: p => p.r.m >= 30, tags: ["rest"], ch: () => .85, yes: { j: 10, m: -6, k: 3 }, no: { j: 2, m: -6 }, ys: L("Двенадцать стран за три года.", "Twelve countries in three years."), ns: L("Поездка вышла короче.", "The trip was shorter than planned."), set: p => { p.f.pensionPlan = true; p.f.trips = (p.f.trips || 0) + 1; } },
    { l: L("Подрабатывать", "Keep working part-time"), tags: ["work"], ch: () => 1, yes: { m: 6, t: 2 }, ys: L("Без дела ты не можешь.", "You can't sit still."), set: p => p.f.pensionPlan = true },
    { l: L("Внуки и сад", "Grandkids and the garden"), tags: ["social", "rest"], ch: () => 1, yes: { t: 6, j: 6 }, ys: L("Лучшая работа в жизни.", "The best job of your life."), set: p => p.f.pensionPlan = true },
  ]},
  { id: "computer", ic: "🖱", from: 62, to: 95, if: p => p.c.d > .25 && !p.f.computer, w: .7, t: L("Курсы компьютера", "Computer classes"), q: () => L("Внуки уговаривают тебя освоить видеозвонки.", "The grandkids are urging you to learn video calls."), o: [
    { l: L("Учиться", "Learn"), tags: ["study"], ch: () => .75, yes: { k: 6, t: 6, j: 4 }, no: { j: -2 }, ys: L("Теперь ты присылаешь всем открытки с котами.", "Now you send everyone cat greeting cards."), ns: L("Кнопок слишком много.", "Too many buttons."), set: p => p.f.computer = true, setNo: p => p.f.computer = true },
    { l: L("Звонить по старинке", "Call the old way"), ch: () => 1, yes: { t: 2 }, ys: L("Голос лучше картинки.", "A voice beats a picture."), set: p => p.f.computer = true },
  ]},
  { id: "hearing", ic: "👂", from: 65, to: 100, if: p => !p.f.hearing, w: .7, t: L("Громче", "Louder"), q: () => L("Все вокруг стали говорить тише. Или нет?", "Everyone's started speaking more quietly. Or have they?"), o: [
    { l: L("Слуховой аппарат", "Get a hearing aid"), tags: ["health"], ch: p => .6 + .35 * p.c.d, yes: { t: 6, j: 4, m: -3 }, no: { m: -3 }, ys: L("Птицы! Ты забыл, как они поют.", "Birds! You'd forgotten how they sing."), ns: L("Аппарат свистит.", "The aid whistles."), set: p => p.f.hearing = true, setNo: p => p.f.hearing = true },
    { l: L("Переспрашивать", "Just ask again"), ch: () => 1, yes: { t: -3 }, ys: L("«Что?» стало твоим любимым словом.", "\"What?\" became your favorite word."), set: p => p.f.hearing = true },
  ]},
  { id: "stories", ic: "📖", from: 65, to: 105, if: p => p.kids.length || p.f.grandkids, w: .7, repeat: 15, t: L("Сказка на ночь", "Bedtime story"), q: () => L("Внуки ночуют у тебя и требуют историю.", "The grandkids are sleeping over and demand a story."), o: [
    { l: L("Рассказать про свою молодость", "Tell them about your youth"), tags: ["social"], ch: () => 1, yes: { t: 8, j: 6 }, ys: L("«А дальше?» — до полуночи.", "\"And then?\" until midnight.") },
    { l: L("Сочинить на ходу", "Make one up on the spot"), tags: ["art"], ch: () => .8, yes: { t: 6, j: 8 }, no: { t: 3 }, ys: L("Дракон, который боялся темноты. Теперь это семейная легенда.", "A dragon afraid of the dark. It's a family legend now."), ns: L("Уснул раньше внуков.", "You fell asleep before they did.") },
  ]},
  { id: "album", ic: "🖼", from: 65, to: 105, w: .6, t: L("Старый альбом", "The old album"), q: () => L("Нашёлся альбом с чёрно-белыми фотографиями.", "You found an album of black-and-white photos."), o: [
    { l: L("Подписать каждую", "Label every one"), tags: ["social"], ch: () => 1, yes: { t: 6, j: 4, k: 2 }, ys: L("Теперь правнуки будут знать, кто есть кто.", "Now the great-grandkids will know who's who."), set: p => p.f.album = true },
    { l: L("Листать одному", "Leaf through alone"), ch: () => 1, yes: { j: 3, t: -1 }, ys: L("Сколько их уже нет.", "So many of them are gone.") },
  ]},
  { id: "birthday80", ic: "🎂", prio: true, from: 80, to: 80, t: L("Восемьдесят", "Eighty"), q: () => L("Тебе восемьдесят. Родные хотят устроить праздник.", "You're eighty. Your family wants a party."), o: [
    { l: L("Большой праздник", "A big party"), tags: ["social"], ch: () => .9, yes: { t: 10, j: 10 }, no: { j: 4 }, ys: L("Восемьдесят свечей. Задул с третьей попытки.", "Eighty candles. Blew them out on the third try."), ns: L("Пришли не все, но пришли.", "Not everyone came. But they came."), fx: "gold" },
    { l: L("Тихо, как обычный день", "Quietly, like any other day"), ch: () => 1, yes: { j: 4, h: 2 }, ys: L("Чай, газета и звонки весь день.", "Tea, the newspaper and calls all day.") },
  ]},
  { id: "firstflight", ic: "✈", from: 65, to: 90, if: p => !(p.f.trips > 0) && !p.f.firstFlight, w: .8, t: L("Первый полёт", "First flight"), q: () => L("Ты ни разу в жизни не летал. Внуки дарят билет.", "You've never flown in your life. The grandkids give you a ticket."), o: [
    { l: L("Лететь", "Fly"), tags: ["risk", "rest"], ch: () => .9, yes: { j: 12, k: 3 }, no: { j: 2, h: -2 }, ys: L("Ты смотрел в иллюминатор все четыре часа.", "You stared out the window for all four hours."), ns: L("Укачало, но долетел.", "Airsick, but you made it."), set: p => { p.f.firstFlight = true; p.f.trips = (p.f.trips || 0) + 1; }, setNo: p => p.f.firstFlight = true, fx: "travel" },
    { l: L("Поменять на поезд", "Swap it for a train"), ch: () => 1, yes: { j: 4 }, ys: L("Земля надёжнее.", "Solid ground is safer."), set: p => p.f.firstFlight = true },
  ]},
  { id: "oldfriends", ic: "♟", from: 68, to: 105, w: .6, t: L("Скамейка", "The bench"), q: () => L("Во дворе собираются старики играть в домино.", "The old folks gather in the yard to play dominoes."), o: [
    { l: L("Присоединиться", "Join them"), tags: ["social"], ch: () => 1, yes: { t: 8, j: 6 }, ys: L("Каждый день в четыре. Как на работу.", "Every day at four. Like clockwork."), set: p => p.f.bench = true },
    { l: L("Смотреть из окна", "Watch from the window"), ch: () => 1, yes: { t: -2 }, ys: L("Однажды тебя позовут. Или нет.", "One day they'll call you over. Or not.") },
  ]},
  { id: "oldpet", ic: "🐈", from: 68, to: 100, if: p => p.f.pet == null || p.age - p.f.pet > 15, w: .6, t: L("Кошка из приюта", "A shelter cat"), q: () => L("В приюте старая кошка. Её никто не берёт.", "There's an old cat at the shelter. Nobody wants her."), o: [
    { l: L("Взять", "Take her"), tags: ["care"], ch: () => 1, yes: { j: 10, h: 2 }, ys: L("Два старика на одном диване.", "Two old-timers on one couch."), set: p => p.f.pet = p.age, fx: "paw" },
    { l: L("Мне уже поздно", "Too late for me"), ch: () => 1, yes: {}, ys: L("Может быть.", "Maybe.") },
  ]},
  { id: "volunteerold", ic: "🧓", from: 62, to: 90, if: p => p.r.h >= 40, w: .5, t: L("Волонтёр", "Volunteering"), q: () => L("В школе нужны люди, которые будут читать с детьми.", "The school needs people to read with the children."), o: [
    { l: L("Ходить два раза в неделю", "Go twice a week"), tags: ["social", "care"], ch: () => 1, yes: { t: 8, j: 8 }, ys: L("Мальчик, который не умел читать, прочитал тебе сказку.", "The boy who couldn't read read you a story."), set: p => p.f.mentor = true },
    { l: L("Нет сил", "Not enough strength"), ch: () => 1, yes: { h: 1 }, ys: L("Отдых тоже важен.", "Rest matters too.") },
  ]},
  { id: "lastdance", ic: "💃", from: 70, to: 100, if: p => p.f.widowed || (!p.partner && p.age >= 70), w: .6, t: L("Танцы в парке", "Dancing in the park"), q: () => L("По воскресеньям в парке играет оркестр и танцуют пожилые пары.", "On Sundays an orchestra plays in the park and older couples dance."), o: [
    { l: L("Пригласить кого-нибудь", "Ask someone to dance"), tags: ["social", "love"], ch: () => .7, yes: { j: 10, t: 6, h: 2 }, no: { j: 2 }, ys: L("Вальс. Ты всё ещё помнишь шаги.", "A waltz. You still remember the steps."), ns: L("Партнёр устал после первого танца.", "Your partner tired after the first dance.") },
    { l: L("Сидеть и слушать", "Sit and listen"), ch: () => 1, yes: { j: 4 }, ys: L("Музыка твоей молодости.", "The music of your youth.") },
  ]},
  { id: "inheritance", ic: "📜", from: 70, to: 105, if: p => p.kids.length >= 2 && p.r.m >= 40 && !p.f.split, w: .6, t: L("Поровну", "Fair shares"), q: () => L("Дети спорят, кому что достанется.", "The kids are arguing over who gets what."), o: [
    { l: L("Собрать всех и решить вместе", "Gather everyone and decide together"), tags: ["social"], ch: () => .7, yes: { t: 8, j: 4 }, no: { t: -6, j: -4 }, ys: L("Обнялись. Договорились.", "They hugged. They agreed."), ns: L("Двое не разговаривают до сих пор.", "Two of them still aren't speaking."), set: p => p.f.split = true, setNo: p => p.f.split = true },
    { l: L("Отдать всё на благотворительность", "Give it all to charity"), tags: ["care"], ch: () => 1, yes: { j: 6, t: -4, m: -20 }, ys: L("Дети удивились. Потом поняли.", "The kids were surprised. Then they understood."), set: p => { p.f.split = true; p.f.philanthropy = true; } },
  ]},
  { id: "walker", ic: "🦯", from: 80, to: 109, if: p => p.r.h < 50 && !p.f.walker, w: .7, t: L("Палочка", "The cane"), q: () => L("Врач советует ходить с палочкой.", "The doctor suggests a cane."), o: [
    { l: L("Выбрать красивую", "Pick a fancy one"), tags: ["health"], ch: () => 1, yes: { h: 4, j: 3 }, ys: L("С серебряной ручкой. Как у графа.", "With a silver handle. Like a count's."), set: p => p.f.walker = true },
    { l: L("Ни за что", "Never"), ch: () => .6, yes: { j: 3 }, no: { h: -8 }, ys: L("Пока справляешься сам.", "You're managing on your own for now."), ns: L("Упал на лестнице.", "You fell on the stairs."), set: p => p.f.walker = true, setNo: p => p.f.walker = true },
  ]},
  { id: "letterfuture", ic: "💌", from: 75, to: 109, if: p => !p.f.futureLetter, w: .5, t: L("Письмо в будущее", "A letter to the future"), q: () => L("Правнуки откроют это письмо через тридцать лет.", "Your great-grandchildren will open this letter in thirty years."), o: [
    { l: L("Написать о главном", "Write about what matters"), tags: ["art", "social"], ch: () => 1, yes: { j: 8, t: 4 }, ys: L("Три страницы. Последняя строчка: «Не бойтесь».", "Three pages. The last line: \"Don't be afraid.\""), set: p => p.f.futureLetter = true },
    { l: L("Написать рецепт пирога", "Write down the pie recipe"), ch: () => 1, yes: { j: 5, t: 3 }, ys: L("Самое ценное, что у тебя есть.", "The most valuable thing you own."), set: p => p.f.futureLetter = true },
  ]},
  { id: "sunrise", ic: "🌅", from: 85, to: 109, w: .6, t: L("Рассвет", "Sunrise"), q: () => L("Ты проснулся в пять утра. Сон больше не идёт.", "You woke at five. Sleep won't come back."), o: [
    { l: L("Выйти встречать рассвет", "Go out to meet the dawn"), tags: ["rest"], ch: () => 1, yes: { j: 8, h: 1 }, ys: L("Небо такое же, как в детстве.", "The sky is the same as when you were a child.") },
    { l: L("Позвонить старому другу", "Call an old friend"), tags: ["social"], ch: () => .6, yes: { t: 8, j: 6 }, no: { j: -2 }, ys: L("Он тоже не спал. Проговорили час.", "They weren't asleep either. You talked for an hour."), ns: L("Никто не взял трубку.", "Nobody picked up.") },
  ]},
);

// ---------- События взрослой жизни и старости ----------
window.EVENTS.push(
  { id: "promoted2", w: p => p.job && !p.retired && p.jobLvl < 3 ? .03 : 0, e: { m: 6, j: 4 }, s: L("Неожиданное повышение: начальник ушёл на пенсию.", "An unexpected promotion: your boss retired."), ic: "📈", act: p => p.jobLvl++ },
  { id: "carcrash2", heavy: true, w: p => p.f.car && p.age >= 18 ? .025 : 0, e: { m: -8, h: -4 }, s: L("Кто-то въехал в тебя на светофоре. Машину жалко.", "Someone rear-ended you at a light. The car took the worst of it."), ic: "🚗" },
  { id: "wedding2", w: p => p.age >= 20 && p.age < 60 ? .04 : 0, e: { t: 4, j: 4, m: -2 }, s: L("Гулял на свадьбе двоюродного брата три дня.", "You partied at your cousin's wedding for three days."), ic: "💍" },
  { id: "inheritsmall", w: p => p.age >= 30 && p.age < 70 ? .03 : 0, e: { m: 8 }, s: L("Двоюродная тётя оставила тебе немного денег. Ты её почти не знал.", "A great-aunt you barely knew left you some money."), ic: "📜" },
  { id: "backpain", w: p => p.age >= 35 ? .05 : 0, e: { h: -3, j: -2 }, s: L("Спина. Неделю ходил как буква «Г».", "Your back. A week bent over like a question mark."), ic: "🩻" },
  { id: "bargain", w: p => p.age >= 20 ? .04 : 0, e: { m: 4, j: 2 }, s: L("Купил на распродаже то, что давно хотел.", "Found the thing you'd always wanted on sale."), ic: "🛍" },
  { id: "stolenbike", heavy: true, w: p => p.age >= 12 && p.c.d > .3 ? .025 : 0, e: { m: -3, j: -2 }, s: L("Украли велосипед прямо у подъезда.", "Your bike was stolen right outside the door."), ic: "🚲" },
  { id: "garden2", w: p => p.f.dacha || p.f.house ? .05 : 0, e: { j: 4, h: 2 }, s: L("Помидоры уродились такие, что соседи приходили фотографировать.", "The tomatoes came out so big the neighbors came to photograph them."), ic: "🍅" },
  { id: "kidcall", w: p => p.age >= 55 && p.kids.some(k => p.age - k.born >= 25) ? .06 : 0, e: { t: 4, j: 4 }, s: L("Дети позвонили просто так. Без повода.", "The kids called just because. No reason at all."), ic: "📞" },
  { id: "grandfirst", w: p => p.f.grandkids && p.age < 95 ? .05 : 0, e: { j: 6, t: 3 }, s: L("Внучка сказала первое слово. Это было твоё имя.", "Your granddaughter said her first word. It was your name."), ic: "👶" },
  { id: "storm2", w: p => inC(p, STORM) ? .04 : .01, e: { m: -5, j: -2 }, s: L("Гроза повалила дерево прямо на забор.", "A storm knocked a tree right onto the fence."), ic: "⛈" },
  { id: "powercut", w: p => p.c.d < .6 ? .04 : .01, e: { j: 2, t: 2 }, s: L("Весь вечер без света. Играли в карты при свечах.", "A whole evening without power. You played cards by candlelight."), ic: "🕯" },
  { id: "oldletter", w: p => p.age >= 50 ? .03 : 0, e: { j: 4, t: 2 }, s: L("Нашёл в книге письмо, которое писал себе в двадцать.", "In an old book you found a letter you wrote yourself at twenty."), ic: "✉" },
  { id: "doctorgood", w: p => p.age >= 50 ? .05 : 0, e: { j: 4, h: 2 }, s: L("Анализы в полном порядке. Врач удивился.", "Your tests came back perfect. The doctor was surprised."), ic: "🩺" },
  { id: "fall", heavy: true, w: p => p.age >= 70 ? .06 : 0, e: { h: -6 }, s: L("Поскользнулся на льду. Перелом.", "Slipped on the ice. A fracture."), ic: "🩹" },
  { id: "visit", w: p => p.age >= 70 && p.r.t >= 40 ? .08 : 0, e: { t: 4, j: 5 }, s: L("Внуки приехали на всё лето.", "The grandkids came for the whole summer."), ic: "🏡" },
  { id: "pensionup", w: p => p.retired ? .05 : 0, e: { m: 4 }, s: L("Пенсию немного подняли.", "Your pension went up a little."), ic: "💰" },
  { id: "friendgone", w: p => p.age >= 70 ? .06 : 0, e: { j: -5, t: -2 }, s: L("Не стало друга, с которым ты дружил шестьдесят лет.", "A friend of sixty years passed away."), ic: "🕯" },
  { id: "comet", rare: true, w: p => p.age >= 8 ? .002 : 0, e: { j: 10, k: 4 }, s: L("Яркая комета видна даже днём. Такое бывает раз в жизни.", "A comet so bright it's visible by day. Once in a lifetime."), ic: "☄", act: p => p.f.comet = true },
  { id: "lostring", rare: true, w: p => p.married ? .004 : 0, e: { j: 10, t: 4 }, s: L("Обручальное кольцо, потерянное двадцать лет назад, нашлось в саду.", "The wedding ring lost twenty years ago turned up in the garden."), ic: "💍", act: p => p.f.lostRing = true },
  { id: "twinsgrand", rare: true, w: p => p.f.grandkids ? .006 : 0, e: { j: 10, t: 6 }, s: L("У тебя родились внуки-двойняшки. В один день с тобой.", "Twin grandchildren were born. On your birthday."), ic: "👯", act: p => p.f.twinsGrand = true },
);
})();
