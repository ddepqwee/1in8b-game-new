// Долгая игра: итоги жизни (коллекция «Книга судеб»), новые достижения и испытания.
// Итог — короткое имя прожитой жизни. Из всех подходящих берётся тот, у кого rank выше.
(() => {
const L = window.tr;
const he = (p, m, f) => p.sex === "f" ? f : m;
const held = (p, id) => (p.f.jobsHeld || []).includes(id);
const yearsMarried = p => p.married ? p.age - (p.f.marriedAt ?? p.age) : 0;

window.ENDINGS = [
  { id: "infant", rank: 100, n: L("Слишком короткая жизнь", "Too short a life"), d: L("Мир не успел узнать это имя. Так случается гораздо чаще, чем принято думать.", "The world never got to learn this name. It happens far more often than most people think."), hint: L("Не дожить до пяти", "Not reach five"), ok: p => p.age < 5 },
  { id: "young", rank: 99, n: L("Оборванная юность", "Youth cut short"), d: L("Столько всего было впереди.", "So much was still ahead."), hint: L("Уйти до 25", "Die before 25"), ok: p => p.age < 25 },
  { id: "nobel", rank: 96, n: L("Светило науки", "Luminary"), d: L("Твоё имя стоит в учебниках, по которым будут учиться другие.", "Your name is in the textbooks others will learn from."), hint: L("Получить премию за открытие", "Win a prize for a discovery"), ok: p => p.f.prize },
  { id: "century", rank: 94, n: L("Свидетель века", "Witness to a century"), d: L("Сто лет. Ты видел, как менялся мир, и пережил почти всех, кого знал.", "A hundred years. You watched the world change and outlived almost everyone you knew."), hint: L("Дожить до ста", "Live to 100"), ok: p => p.age >= 100 },
  { id: "minister", rank: 92, n: L("Государственный человек", "Statesman"), d: L("Законы, которые ты писал, переживут тебя.", "The laws you wrote will outlive you."), hint: L("Стать министром", "Become a minister"), ok: p => p.f.minister },
  { id: "champion", rank: 90, n: L("Чемпион", "Champion"), d: L("Гимн, флаг и медаль в коробке, которую внуки будут показывать друзьям.", "An anthem, a flag, and a medal in a box the grandkids will show their friends."), hint: L("Медаль на больших играх", "A medal at the big games"), ok: p => p.f.medal },
  { id: "rockstar", rank: 89, n: L("Звезда сцены", "Star of the stage"), d: L("Где-то до сих пор поют твою песню, не зная, кто её написал.", "Somewhere people still sing your song without knowing who wrote it."), hint: L("Большой тур и слава", "A big tour and fame"), ok: p => p.f.bigstage && p.f.famous },
  { id: "voice", rank: 88, n: L("Голос поколения", "Voice of a generation"), d: L("Твою книгу читают в метро на восьми языках.", "Your book is read on subways in eight languages."), hint: L("Написать бестселлер", "Write a bestseller"), ok: p => p.f.bestseller },
  { id: "against", rank: 87, n: L("Вопреки всему", "Against all odds"), d: L("У тебя был один из самых трудных стартов на планете. И мечта всё равно сбылась.", "You had one of the hardest starts on the planet. And your dream came true anyway."), hint: L("Трудный старт, мечта и 70 лет", "A hard start, a dream come true and age 70"), ok: p => difficulty(p) >= 2.1 && p.dreamDone && p.age >= 70 },
  { id: "tycoon", rank: 82, n: L("Магнат", "Tycoon"), d: L("Компания с твоим именем работает и без тебя.", "A company with your name on it runs fine without you."), hint: L("Большая сделка или бизнес 3 уровня", "A big exit or a level 3 business"), ok: p => p.f.exit || (p.f.bizMax >= 3 && p.peak.m >= 85) },
  { id: "healer", rank: 80, n: L("Целитель", "Healer"), d: L("Где-то живут люди, которые живы только благодаря тебе.", "Somewhere there are people alive only because of you."), hint: L("Врач, который спас жизнь", "A doctor who saved a life"), ok: p => p.f.wasDoctor && p.f.savedLife },
  { id: "golden", rank: 78, n: L("Любовь длиною в жизнь", "A lifelong love"), d: L("Пятьдесят лет рядом с одним человеком. Это редкость больше, чем кажется.", "Fifty years beside one person. Rarer than it seems."), hint: L("Отметить золотую свадьбу", "Celebrate a golden anniversary"), ok: p => p.f.golden || yearsMarried(p) >= 50 },
  { id: "starchef", rank: 76, n: L("Шеф со звездой", "Starred chef"), d: L("Люди приезжали из других городов ради одного твоего блюда.", "People traveled from other cities for one of your dishes."), hint: L("Покорить ресторанного критика", "Win over the food critic"), ok: p => p.f.starChef },
  { id: "mayor", rank: 74, n: L("Хозяин города", "City father"), d: L("Новая школа, починенные дороги и твой портрет в мэрии.", "A new school, fixed roads and your portrait in city hall."), hint: L("Стать мэром", "Become mayor"), ok: p => p.f.mayor },
  { id: "hero", rank: 72, n: L("Тихий герой", "Quiet hero"), d: L("Однажды ты не прошёл мимо. Этого хватило, чтобы чья-то жизнь продолжилась.", "Once, you didn't walk past. That was enough for someone's life to go on."), hint: L("Спасти чью-то жизнь", "Save someone's life"), ok: p => p.f.savedLife },
  { id: "elder", rank: 70, n: L("Глава большого рода", "Head of a great family"), d: L("Четверо детей, внуки и правнуки. Целая улица родни.", "Four children, grandchildren and great-grandchildren. A whole street of family."), hint: L("Четверо детей и правнуки", "Four children and great-grandchildren"), ok: p => p.kids.length >= 4 && p.f.greatgrand },
  { id: "summit", rank: 68, n: L("Покоритель вершин", "Summit seeker"), d: L("Ты стоял там, где облака внизу.", "You stood where the clouds were below you."), hint: L("Подняться на большую вершину", "Climb a great peak"), ok: p => p.f.summit },
  { id: "teacher", rank: 66, n: L("Учитель учителей", "Teacher of teachers"), d: L("Твои ученики учат своих учеников твоим словам.", "Your students teach their students in your words."), hint: L("Наставник, к которому вернулся ученик", "A mentor whose student came back"), ok: p => p.f.mentor && p.f.studentBack },
  { id: "sage", rank: 64, n: L("Мудрец", "Sage"), d: L("К тебе приходили за советом до последнего дня.", "People came to you for advice until the very last day."), hint: L("Знания 90+ и 75 лет", "Knowledge 90+ and age 75"), ok: p => p.r.k >= 90 && p.age >= 75 },
  { id: "genius", rank: 63, n: L("Одинокий гений", "Solitary genius"), d: L("Голова, полная звёзд, и почти пустая записная книжка.", "A head full of stars and an almost empty address book."), hint: L("Знания 85+, близкие ниже 35", "Knowledge 85+, loved ones under 35"), ok: p => p.peak.k >= 85 && p.r.t < 35 },
  { id: "veteran", rank: 62, n: L("Солдат, вернувшийся домой", "The soldier who came home"), d: L("Ты редко рассказывал о службе. Но каждый год ездил к своим.", "You rarely talked about your service. But every year you went to see your comrades."), hint: L("Вернуться с миссии", "Come back from a mission"), ok: p => p.f.veteran && p.age >= 50 },
  { id: "second", rank: 60, n: L("Второй шанс", "Second chance"), d: L("Ты оступился и поднялся. Многим этого не дают.", "You fell and got back up. Many never get the chance."), hint: L("Выйти на свободу и дожить до 50", "Leave prison and live to 50"), ok: p => p.f.wasJailed && p.age >= 50 },
  { id: "gilded", rank: 58, n: L("Золотая клетка", "Gilded cage"), d: L("Денег хватало на всё, кроме людей рядом.", "Money enough for everything except people beside you."), hint: L("Деньги 85+, близкие ниже 35", "Money 85+, loved ones under 35"), ok: p => p.peak.m >= 85 && p.r.t < 35 },
  { id: "world", rank: 56, n: L("Гражданин мира", "Citizen of the world"), d: L("Карта на стене в булавках. Почти не осталось пустых мест.", "A map on the wall full of pins. Hardly any blank spots left."), hint: L("Четыре путешествия и больше", "Four or more trips"), ok: p => (p.f.trips || 0) >= 4 },
  { id: "simple", rank: 55, n: L("Простое счастье", "Simple happiness"), d: L("Без больших денег и громких дел. Просто хорошо.", "No big money, no grand deeds. Just good."), hint: L("Счастье 85+, деньги ниже 45", "Happiness 85+, money under 45"), ok: p => p.r.j >= 85 && p.r.m < 45 },
  { id: "homeland", rank: 53, n: L("Новая родина", "A new homeland"), d: p => L(`Ты родился в стране ${p.home.name}, а дома стал в стране ${p.c.name}.`, `You were born in ${p.home.name} and found home in ${p.c.name}.`), hint: L("Переехать, освоиться и остаться", "Move abroad, settle in and stay"), ok: p => p.f.adapted && !p.f.returned },
  { id: "return", rank: 51, n: L("Возвращение", "The return"), d: L("Ты уезжал, чтобы однажды вернуться.", "You left so that one day you could come back."), hint: L("Уехать и вернуться домой", "Leave and come back home"), ok: p => p.f.emigrated && p.f.returned },
  { id: "unbroken", rank: 49, n: L("Несгибаемый", "Unbreakable"), d: L("Болезни и стихии били не раз. Ты поднимался каждый раз.", "Illness and disaster struck more than once. You got up every time."), hint: L("Пережить две болезни или два бедствия и дожить до 65", "Survive two illnesses or two disasters and live to 65"), ok: p => ((p.f.illCount || 0) >= 2 || (p.f.disaster || 0) >= 2) && p.age >= 65 },
  { id: "fortune", rank: 47, n: L("Баловень судьбы", "Fortune's favorite"), d: L("Иногда жизнь просто улыбается.", "Sometimes life just smiles."), hint: L("Выиграть или найти клад", "Win big or find treasure"), ok: p => p.f.lottery || p.f.treasure || p.f.ticketWin },
  { id: "restless", rank: 46, n: L("Беспокойное сердце", "Restless heart"), d: L("Ты не умел молчать, когда видел несправедливость.", "You couldn't stay quiet in the face of injustice."), hint: L("Протест, политика или расследование", "Protests, politics or an exposé"), ok: p => p.f.activist && (p.f.politics || p.f.investigation) },
  { id: "artist", rank: 45, n: L("Человек искусства", "Artist at heart"), d: L("Ты оставил после себя то, что можно увидеть, услышать или прочитать.", "You left behind something people can see, hear or read."), hint: L("Книга, альбом или жизнь в искусстве", "A book, an album or a life in art"), ok: p => p.f.book || p.f.record || held(p, "artist") },
  { id: "longroad", rank: 44, n: L("Долгая дорога", "The long road"), d: L("Восемьдесят пять лет и больше. Длиннее, чем у большинства людей на Земле.", "Eighty-five years and more. Longer than most people on Earth."), hint: L("Дожить до 85", "Live to 85"), ok: p => p.age >= 85 },
  { id: "sky", rank: 42, n: L("Небо", "Sky-bound"), d: L("Тысячи часов над облаками.", "Thousands of hours above the clouds."), hint: L("Стать пилотом", "Become a pilot"), ok: p => held(p, "pilot") },
  { id: "hearth", rank: 40, n: L("Хранитель очага", "Keeper of the hearth"), d: L("Двери твоего дома всегда были открыты, и за столом всегда было тесно.", "Your door was always open and your table always crowded."), hint: L("Двое детей и близкие 70+", "Two children and loved ones 70+"), ok: p => p.kids.length >= 2 && p.r.t >= 70 },
  { id: "roots", rank: 36, n: L("Корни", "Roots"), d: L("Ты прожил жизнь там, где родился, и знал каждого в округе.", "You lived your life where you were born and knew everyone around."), hint: L("Не уезжать, близкие 75+, 70 лет", "Never move away, loved ones 75+, age 70"), ok: p => !p.f.emigrated && !p.f.cityMove && !p.f.childMove && p.r.t >= 75 && p.age >= 70 },
  { id: "land", rank: 33, n: L("Человек земли", "Of the land"), d: L("Земля кормила тебя, а ты её.", "The land fed you, and you fed it."), hint: L("Всю жизнь работать на земле", "Work the land all your life"), ok: p => held(p, "farmer") && p.age >= 60 },
  { id: "dream", rank: 30, n: L("Мечта сбылась", "A dream fulfilled"), d: L("Ты знал, чего хочешь в пятнадцать, и добился этого.", "You knew what you wanted at fifteen, and you got it."), hint: L("Исполнить мечту", "Make your dream come true"), ok: p => p.dreamDone },
  { id: "house", rank: 25, n: L("Свой дом", "A home of one's own"), d: L("Дом, сад и дети, которые выросли в этих стенах.", "A house, a garden and children who grew up within those walls."), hint: L("Дом, дети и деньги 50+", "A house, children and money 50+"), ok: p => p.f.house && p.kids.length && p.r.m >= 50 },
  { id: "hard", rank: 20, n: L("Тяжёлая доля", "A hard lot"), d: L("Жизнь не баловала. Но ты дошёл до конца, и это уже немало.", "Life wasn't kind. But you made it to the end, and that's no small thing."), hint: L("Счастье ниже 25 в конце", "End with happiness under 25"), ok: p => p.r.j < 25 },
  { id: "ordinary", rank: 0, n: L("Обычная жизнь", "An ordinary life"), d: L("Работа, близкие, вечера. Так живёт большинство из восьми миллиардов, и в этом нет ничего маленького.", "Work, loved ones, evenings. That's how most of the eight billion live, and there's nothing small about it."), hint: L("Просто прожить жизнь", "Simply live a life"), ok: () => true },
];

window.CHALLENGES = [
  { id: "upstream", lvl: 2, n: L("Против течения", "Upstream"), d: L("Родиться в одной из беднейших стран мира", "Be born in one of the world's poorest countries"), goal: L("Дожить до 65", "Live to 65"), country: c => c.d < .12, ok: p => p.age >= 65, reward: 1500 },
  { id: "nomad", lvl: 4, n: L("Кочевник", "Nomad"), d: L("Черта «Путник» с рождения", "Born with the Wanderer trait"), goal: L("Переехать, освоиться и съездить в 3 путешествия", "Move abroad, settle in and take 3 trips"), setup: p => { if (!p.traits.includes("wanderer")) p.traits = ["wanderer"].concat(p.traits.slice(0, 1)); }, country: c => c.d < .8, ok: p => p.f.adapted && (p.f.trips || 0) >= 3, reward: 1500 },
  { id: "broke", lvl: 6, n: L("Без гроша", "Penniless"), d: L("Самая бедная семья и ноль денег на старте", "The poorest family and zero money at the start"), goal: L("Деньги 70+ после 30 лет", "Money 70+ after age 30"), setup: p => { p.q = 1; p.r.m = 0; }, ok: p => p.f.richAfter30, reward: 1800 },
  { id: "frail", lvl: 8, n: L("Хрупкость", "Fragile"), d: L("Слабое здоровье и −10 к здоровью", "Frail health and −10 health"), goal: L("Дожить до 80", "Live to 80"), setup: p => { p.traits = ["frail"]; p.h0 -= 10; p.r.h = clamp(p.r.h - 22); }, ok: p => p.age >= 80, reward: 2000 },
  { id: "oneshot", lvl: 11, n: L("Ни шагу назад", "No second chances"), d: L("Все шансы на 10% ниже", "All odds 10% lower"), goal: L("Исполнить мечту", "Make your dream come true"), setup: p => p.mods = { chance: -.1 }, ok: p => p.dreamDone, reward: 2200 },
  { id: "blank", lvl: 13, n: L("Чистый лист", "Blank slate"), d: L("Ни одной черты характера", "No character traits at all"), goal: L("Набрать 2500 очков", "Score 2,500 points"), setup: p => { p.traits = []; p.h0 = clamp(p.h0, 15, 98); }, ok: p => score(p) >= 2500, reward: 2200 },
  { id: "solo", lvl: 16, n: L("Сам по себе", "On your own"), d: L("Любовь и брак обходят тебя стороной", "Love and marriage pass you by"), goal: L("Счастье 70+ после 70 лет", "Happiness 70+ after age 70"), setup: p => p.mods = { ban: ["love", "newlove", "lateLove", "wedding", "crush", "distance"] }, ok: p => p.age >= 70 && p.r.j >= 70, reward: 2500 },
  { id: "iron", lvl: 20, n: L("Железная воля", "Iron will"), d: L("Беднейшая страна, беднейшая семья, шансы на 5% ниже", "The poorest country, the poorest family, odds 5% lower"), goal: L("Исполнить мечту и дожить до 70", "Make your dream come true and live to 70"), country: c => c.d < .15, setup: p => { p.q = 1; p.r.m = clamp(p.r.m - 15); p.mods = { chance: -.05 }; }, ok: p => p.dreamDone && p.age >= 70, reward: 4000 },
];

window.ACHIEVEMENTS.push(
  { id: "dyn3", n: L("Три поколения", "Three generations"), d: L("Прожить три поколения одного рода", "Play three generations of one family"), ok: (p, a, m) => (m && m.gen || 1) >= 3 },
  { id: "dyn5", n: L("Пять поколений", "Five generations"), d: L("Прожить пять поколений одного рода", "Play five generations of one family"), ok: (p, a, m) => (m && m.gen || 1) >= 5 },
  { id: "comeback", n: L("Неудержимый", "Unstoppable"), d: L("Вылечиться от тяжёлой болезни дважды и дожить до 70", "Recover from a serious illness twice and live to 70"), ok: p => (p.f.illCount || 0) >= 2 && p.age >= 70 },
  { id: "langs3", n: L("Полиглот", "Polyglot"), d: L("Говорить на трёх языках", "Speak three languages"), ok: p => (p.f.langs || 1) >= 3 },
  { id: "prize", n: L("Лауреат", "Laureate"), d: L("Получить международную премию", "Win an international prize"), ok: p => p.f.prize },
  { id: "minister", n: L("Министр", "Minister"), d: L("Войти в правительство", "Join the government"), ok: p => p.f.minister },
  { id: "mayor", n: L("Мэр", "Mayor"), d: L("Выиграть выборы мэра", "Win a mayoral election"), ok: p => p.f.mayor },
  { id: "medal", n: L("Медалист", "Medalist"), d: L("Медаль на больших играх", "A medal at the big games"), ok: p => p.f.medal },
  { id: "stage", n: L("Большая сцена", "The big stage"), d: L("Отыграть большой тур", "Play a big tour"), ok: p => p.f.bigstage },
  { id: "author", n: L("Автор", "Author"), d: L("Издать книгу", "Publish a book"), ok: p => p.f.book },
  { id: "bestseller", n: L("Бестселлер", "Bestseller"), d: L("Книга, которую читает весь мир", "A book the whole world reads"), ok: p => p.f.bestseller },
  { id: "chef", n: L("Своя кухня", "Your own kitchen"), d: L("Открыть кафе или ресторан", "Open a café or restaurant"), ok: p => p.f.restaurant },
  { id: "starchef", n: L("Звезда гурманов", "Gourmet star"), d: L("Покорить ресторанного критика смелым блюдом", "Win over the critic with a bold dish"), ok: p => p.f.starChef },
  { id: "exit", n: L("Сделка века", "Deal of a lifetime"), d: L("Продать свой стартап", "Sell your startup"), ok: p => p.f.exit },
  { id: "surgeon", n: L("Золотые руки", "Golden hands"), d: L("Провести операцию, которая спасла жизнь", "Perform an operation that saves a life"), ok: p => p.f.bigOp && p.f.surgeon && p.f.savedLife },
  { id: "hero", n: L("Спасатель", "Lifesaver"), d: L("Спасти чью-то жизнь", "Save someone's life"), ok: p => p.f.savedLife },
  { id: "summit", n: L("Вершина", "Summit"), d: L("Подняться на большую гору", "Climb a great mountain"), ok: p => p.f.summit },
  { id: "marathon", n: L("Марафонец", "Marathoner"), d: L("Пробежать марафон", "Run a marathon"), ok: p => p.f.marathon },
  { id: "golden", n: L("Золотая свадьба", "Golden anniversary"), d: L("Пятьдесят лет в браке", "Fifty years of marriage"), ok: p => p.f.golden },
  { id: "greatgrand", n: L("Правнуки", "Great-grandchildren"), d: L("Дожить до правнуков", "Live to see great-grandchildren"), ok: p => p.f.greatgrand },
  { id: "kids6", n: L("Целая команда", "A whole team"), d: L("Шестеро детей", "Six children"), ok: p => p.kids.length >= 6 },
  { id: "pilot", n: L("Небо", "Up in the sky"), d: L("Стать пилотом", "Become a pilot"), ok: p => (p.f.jobsHeld || []).includes("pilot") },
  { id: "jobs5", n: L("Мастер на все руки", "Jack of all trades"), d: L("Сменить пять профессий за жизнь", "Hold five different jobs in one life"), ok: p => (p.f.jobsHeld || []).length >= 5 },
  { id: "mentor", n: L("Наставник", "Mentor"), d: L("Бывший ученик пришёл сказать спасибо", "A former student comes back to say thank you"), ok: p => p.f.studentBack },
  { id: "treasure", n: L("Клад", "Buried treasure"), d: L("Найти клад в огороде", "Find treasure in the garden"), ok: p => p.f.treasure },
  { id: "rags", n: L("Из грязи в князи", "Rags to riches"), d: L("Родиться в самой бедной семье и дойти до денег 90+", "Be born into the poorest family and reach money 90+"), ok: p => p.q === 1 && p.peak.m >= 90 },
  { id: "latelove", n: L("Поздняя любовь", "Late love"), d: L("Встретить любовь после 68", "Find love after 68"), ok: p => p.f.lateLove && p.partner },
  { id: "safe", n: L("Не на того напали", "Not today, scammer"), d: L("Не поддаться на телефонных мошенников", "Don't fall for phone scammers"), ok: p => p.f.scamSafe },
  { id: "principal", n: L("Директор", "Head teacher"), d: L("Возглавить школу", "Run a school"), ok: p => p.f.principal && p.job === "teacher" },
  { id: "endings10", n: L("Книга судеб", "Book of fates"), d: L("Собрать 10 разных итогов жизни", "Collect 10 different life endings"), ok: (p, a, m) => (m && m.endings || 0) >= 10 },
  { id: "endings25", n: L("Летописец", "Chronicler"), d: L("Собрать 25 разных итогов жизни", "Collect 25 different life endings"), ok: (p, a, m) => (m && m.endings || 0) >= 25 },
  { id: "level10", n: L("Опытная душа", "Seasoned soul"), d: L("Достичь 10 уровня души", "Reach soul level 10"), ok: (p, a, m) => (m && m.level || 1) >= 10 },
  { id: "level25", n: L("Старая душа", "Old soul"), d: L("Достичь 25 уровня души", "Reach soul level 25"), ok: (p, a, m) => (m && m.level || 1) >= 25 },
  { id: "chal1", n: L("Испытание пройдено", "Challenge complete"), d: L("Пройти любое испытание", "Complete any challenge"), ok: (p, a, m) => (m && m.challenges || 0) >= 1 },
  { id: "chal8", n: L("Железная воля", "Iron will"), d: L("Пройти все испытания", "Complete every challenge"), ok: (p, a, m) => (m && m.challenges || 0) >= window.CHALLENGES.length },
  { id: "lives50", n: L("Пятьдесят жизней", "Fifty lives"), d: L("Прожить 50 жизней", "Live 50 lives"), ok: (p, a, m) => (m && m.lives || 0) >= 50 },
  { id: "daily7", n: L("Каждый день", "Every day"), d: L("Сыграть «Рождение дня» в 7 разных дней", "Play the daily birth on 7 different days"), ok: (p, a, m) => (m && m.dailies || 0) >= 7 },
  { id: "codex", n: L("Энциклопедист", "Encyclopedist"), d: L("Открыть половину всех карточек и событий", "Discover half of all cards and events"), ok: (p, a, m) => (m && m.codex || 0) >= .5 },
  { id: "rare5", n: L("Собиратель редкостей", "Collector of wonders"), d: L("Увидеть 5 разных редких моментов", "See 5 different rare moments"), ok: (p, a, m) => (m && m.rares || 0) >= 5 },
);

// достижения за всю игру, а не за одну жизнь: в списке «Достижения этой жизни» показываются только когда новые
for (const a of window.ACHIEVEMENTS) if (["atlas10", "atlas30", "dyn3", "dyn5", "endings10", "endings25", "level10", "level25", "chal1", "chal8", "lives50", "daily7", "codex", "rare5"].includes(a.id)) a.meta = true;
// отметки, которые нужны достижениям и итогам
for (const c of window.CARDS) if (c.id === "scamcall") c.o[1].set = p => p.f.scamSafe = true;
for (const e of window.EVENTS) if (e.id === "release") { const act = e.act; e.act = p => { p.f.wasJailed = true; act && act(p); }; }
})();
