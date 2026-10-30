// Наследие второго расширения: черты, мечты, итоги жизни, достижения и испытания для новых дорог,
// будней и мест. Подключается после content-meta.js, потому что дополняет её списки.
(() => {
const L = window.tr;
const he = (p, m, f) => p.sex === "f" ? f : m;

// ---------- Черты ----------
Object.assign(window.TRAITS, {
  brave:     { n: L("Смелость", "Courage"), d: L("+10% к рискованным решениям, когда помогаешь другим", "+10% to risky choices when helping others"), ch: { risk: .06, care: .06 } },
  patient:   { n: L("Терпение", "Patience"), d: L("Неудачи меньше бьют по счастью, +5% в учёбе", "Setbacks hurt happiness less; +5% in study"), loss: { j: .8 }, ch: { study: .05 } },
  funny:     { n: L("Чувство юмора", "Sense of humor"), d: L("+8% с людьми, счастье растёт быстрее", "+8% with people; happiness grows faster"), ch: { social: .08 }, gain: { j: 1.05 } },
  handy:     { n: L("Золотые руки", "Handy"), d: L("+8% в работе и делах, деньги чуть быстрее", "+8% at work and in business; money a bit faster"), ch: { work: .08, business: .03 }, gain: { m: 1.05 } },
  outdoors:  { n: L("Любовь к природе", "Love of nature"), d: L("+8% к отдыху и здоровью", "+8% to rest and health"), ch: { rest: .08, health: .05 }, gain: { h: 1.05 } },
  loyal:     { n: L("Верность", "Loyalty"), d: L("+10% в любви, связи слабеют медленнее", "+10% in love; relationships fade more slowly"), ch: { love: .1 }, loss: { t: .8 } },
  storyteller: { n: L("Рассказчик", "Storyteller"), d: L("+6% в искусстве и с людьми", "+6% in art and with people"), ch: { art: .06, social: .06 } },
  // редкие: открываются достижениями
  stargazer: { n: L("Звёздный взгляд", "Starry-eyed"), d: L("+8% в учёбе и риске, знания растут быстрее", "+8% in study and risk; knowledge grows faster"), ch: { study: .08, risk: .08 }, gain: { k: 1.1 }, unlock: "space" },
  guardian:  { n: L("Хранитель", "Guardian"), d: L("+12% когда спасаешь и лечишь", "+12% when rescuing and healing"), ch: { care: .12 }, unlock: "rescuer" },
  bridge:    { n: L("Мост", "Bridge-builder"), d: L("+10% в политике и переездах", "+10% in politics and moving"), ch: { politics: .1, move: .1 }, unlock: "treaty" },
});

// ---------- Мечты ----------
window.DREAMS.push(
  { id: "space", t: L("Увидеть Землю из космоса", "See Earth from space"), d: L("Полететь в космос", "Fly to space"), ok: p => p.f.space, need: p => p.r.k >= 55 && p.c.d > .45 },
  { id: "peace", t: L("Остановить войну", "Stop a war"), d: L("Добиться мира на переговорах", "Broker a peace deal"), ok: p => p.f.treaty, need: p => p.r.k >= 50 },
  { id: "screen", t: L("Сыграть в кино", "Be in the movies"), d: L("Получить приз за роль", "Win a prize for a role"), ok: p => p.f.filmAward, need: p => p.f.art || p.traits.includes("artist") || p.traits.includes("charm") },
  { id: "build", t: L("Построить то, что переживёт тебя", "Build something that outlives you"), d: L("Мост или здание по твоему проекту", "A bridge or building of your design"), ok: p => p.f.landmark, need: p => p.r.k >= 45 },
  { id: "game", t: L("Сделать свою игру", "Make your own game"), d: L("Выпустить игру своей студии", "Ship a game from your own studio"), ok: p => p.f.game, need: p => p.c.d > .3 },
  { id: "rescue", t: L("Спасти чью-то жизнь", "Save someone's life"), d: L("Вынести человека из беды", "Pull someone out of danger"), ok: p => p.f.rescuer || p.f.savedLife || p.f.friendSaved },
  { id: "sea", t: L("Своё судно", "A vessel of your own"), d: L("Стать капитаном", "Become a captain"), ok: p => p.f.captain, need: p => ["Океания", "Азия", "Европа"].includes(p.c.part) || ["la", "br", "waf", "ea", "us"].includes(p.c.reg) },
  { id: "animals", t: L("Лечить животных", "Heal animals"), d: L("Своя ветклиника или зоопарк", "A vet clinic of your own or a zoo"), ok: p => p.f.vetClinic || p.f.zoo, need: p => p.f.pet != null || p.f.cat },
  { id: "justice", t: L("Добиться справедливости", "Win justice"), d: L("Выиграть громкое дело или стать судьёй", "Win a landmark case or become a judge"), ok: p => p.f.bigCase || p.f.judge, need: p => p.r.k >= 45 },
  { id: "invent", t: L("Изобрести что-то полезное", "Invent something useful"), d: L("Изобретение, которым пользуются люди", "An invention people actually use"), ok: p => p.f.invention, need: p => p.r.k >= 40 },
  { id: "water", t: L("Вода в каждый дом", "Water for every home"), d: L("Построить колодец для деревни", "Build a well for the village"), ok: p => p.f.well, need: p => p.c.part === "Африка" && p.c.d < .25 },
  { id: "friend", t: L("Настоящий друг", "A true friend"), d: L("Быть рядом, когда другу плохо", "Be there when a friend needs you"), ok: p => p.f.friendSaved },
);

// ---------- Итоги жизни ----------
window.ENDINGS.push(
  { id: "starman", rank: 97, n: L("Видевший Землю", "One who saw the Earth"), d: L("Ты смотрел на планету сверху и не увидел ни одной границы.", "You looked down at the planet and couldn't see a single border."), hint: L("Полететь в космос", "Fly to space"), ok: p => p.f.space },
  { id: "peacemaker", rank: 93, n: L("Миротворец", "Peacemaker"), d: L("Где-то живут люди, которые так и не узнали, что могла начаться война.", "Somewhere live people who never learned a war almost began."), hint: L("Добиться мира на переговорах", "Broker a peace deal"), ok: p => p.f.treaty },
  { id: "moviestar", rank: 86, n: L("Лицо с экрана", "A face on the screen"), d: L("Тебя пересматривают по праздникам и цитируют на кухнях.", "People rewatch you on holidays and quote you in kitchens."), hint: L("Приз за роль в кино", "Win a film award"), ok: p => p.f.filmAward },
  { id: "rescuer", rank: 79, n: L("Спасатель", "Rescuer"), d: L("Ты шёл туда, откуда все бежали.", "You went where everyone else was running from."), hint: L("Вытащить людей из огня или из-под завала", "Pull people out of a fire or a cave-in"), ok: p => p.f.rescuer },
  { id: "builder", rank: 77, n: L("Строитель городов", "City builder"), d: L("По твоему мосту каждое утро идут люди, которые не знают твоего имени.", "Every morning people cross your bridge without knowing your name."), hint: L("Построить мост или здание по своему проекту", "Build a bridge or building of your design"), ok: p => p.f.landmark },
  { id: "creator", rank: 75, n: L("Создатель миров", "World maker"), d: L("Тысячи людей прожили жизни в мире, который ты придумал.", "Thousands lived lives in a world you made up."), hint: L("Выпустить игру своей студии", "Ship a game from your own studio"), ok: p => p.f.game },
  { id: "justice", rank: 73, n: L("Справедливость", "Justice"), d: L("Ты верил, что закон должен защищать слабых. И иногда так и было.", "You believed the law should protect the weak. Sometimes it did."), hint: L("Громкое дело или мантия судьи", "A landmark case or a judge's robe"), ok: p => p.f.judge || p.f.bigCase },
  { id: "inventor", rank: 71, n: L("Изобретатель", "Inventor"), d: L("Твоя вещь работает в домах, где о тебе никогда не слышали.", "Your invention works in homes that never heard of you."), hint: L("Изобретение, которым пользуются", "An invention people use"), ok: p => p.f.invention },
  { id: "wellmaker", rank: 69, n: L("Вода для деревни", "Water for the village"), d: L("Девочки в твоей деревне больше не ходят за водой. Они ходят в школу.", "Girls in your village no longer walk for water. They walk to school."), hint: L("Построить колодец всей деревней", "Build a village well"), ok: p => p.f.well },
  { id: "couture", rank: 67, n: L("Законодатель моды", "Trendsetter"), d: L("Твой цвет носили целый сезон на трёх континентах.", "Your color was worn for a whole season on three continents."), hint: L("Показ на неделе моды", "Show at fashion week"), ok: p => p.f.fashionWeek },
  { id: "powergrid", rank: 65, n: L("Свет в трёх городах", "Light in three towns"), d: L("Когда включили ток, никто не знал, что это ты.", "When the power came on, nobody knew it was you."), hint: L("Построить электростанцию", "Build a power plant"), ok: p => p.f.megaproject },
  { id: "seawolf", rank: 61, n: L("Морская душа", "Sea soul"), d: L("Море забирало и отдавало. Ты всегда возвращался.", "The sea took and gave back. You always came home."), hint: L("Стать капитаном своего судна", "Captain your own vessel"), ok: p => p.f.captain },
  { id: "beastfriend", rank: 59, n: L("Друг всех зверей", "Friend to all creatures"), d: L("Собаки района узнавали тебя за квартал.", "The neighborhood dogs knew you from a block away."), hint: L("Своя ветклиника или зоопарк", "Your own vet clinic or a zoo"), ok: p => p.f.zoo || (p.f.vetClinic && p.f.vetSaved) },
  { id: "influencer", rank: 57, n: L("Миллион подписчиков", "A million followers"), d: L("Тебя знали в лицо люди, которых ты никогда не видел.", "People you never met knew your face."), hint: L("Блог, который стал работой", "A channel that became a job"), ok: p => p.f.viral },
  { id: "wordbridge", rank: 54, n: L("Мост между языками", "A bridge between languages"), d: L("Великую книгу на твоём языке читают твоими словами.", "A great book is read in your language, in your words."), hint: L("Перевести великую книгу", "Translate a great book"), ok: p => p.f.translatedBook },
  { id: "kindhands", rank: 52, n: L("Добрые руки", "Kind hands"), d: L("Тысячи людей впервые увидели свет у тебя на руках.", "Thousands first saw the light in your hands."), hint: L("Роддом или старшая медсестра", "The maternity ward or head nurse"), ok: p => p.f.midwife || p.f.headNurse },
  { id: "unionvoice", rank: 50, n: L("Голос рабочих", "The workers' voice"), d: L("Каска на стене и договор, по которому работают до сих пор.", "A hard hat on the wall and a contract people still work under."), hint: L("Возглавить профсоюз", "Lead the union"), ok: p => p.f.union },
  { id: "pilgrim", rank: 48, n: L("Паломник", "Pilgrim"), d: L("Ты прошёл путь, о котором мечтали твои деды.", "You walked the road your grandparents dreamed of."), hint: L("Совершить паломничество", "Make the pilgrimage"), ok: p => p.f.hajj },
  { id: "innkeeper", rank: 43, n: L("Дом для путников", "A house for travelers"), d: L("На стене фотографии гостей из сорока стран. Все они помнят тебя.", "Photos of guests from forty countries on the wall. They all remember you."), hint: L("Открыть хостел", "Open a hostel"), ok: p => p.f.hostel },
  { id: "merchant", rank: 41, n: L("Купец", "Merchant"), d: L("Твоя вывеска висит на пяти улицах.", "Your sign hangs on five streets."), hint: L("Сеть лавок", "A chain of shops"), ok: p => p.f.shopChain },
  { id: "truefriend", rank: 39, n: L("Верный друг", "A true friend"), d: L("Ты приезжал в два часа ночи. Это помнят дольше любых подарков.", "You showed up at 2 a.m. That's remembered longer than any gift."), hint: L("Спасти друга и сохранить близких", "Save a friend and keep your loved ones close"), ok: p => p.f.friendSaved && p.r.t >= 60 },
  { id: "watcher", rank: 34, n: L("Наблюдатель", "The observer"), d: L("Ты замечал птиц, звёзды и рыб, мимо которых другие проходили.", "You noticed the birds, stars and fish others walked past."), hint: L("Птицы, звёзды или риф", "Birds, stars or a reef"), ok: p => (p.f.birds || p.f.reef || p.f.stargazer) && p.age >= 60 },
  { id: "memory", rank: 31, n: L("Хранитель памяти", "Keeper of memory"), d: L("Благодаря тебе правнуки знают, как звали их прадедов.", "Thanks to you, the great-grandkids know their ancestors' names."), hint: L("Записать истории родных или подписать альбом", "Record your family's stories or label the album"), ok: p => (p.f.recorded || p.f.album || p.f.futureLetter) && p.age >= 75 },
  { id: "yard", rank: 28, n: L("Душа двора", "Heart of the courtyard"), d: L("Без тебя на скамейке во дворе стало как-то пусто.", "The courtyard bench feels empty without you."), hint: L("Скамейка, хор и близкие рядом", "The bench, the choir and loved ones close"), ok: p => (p.f.bench || p.f.choir) && p.r.t >= 55 && p.age >= 70 },
  { id: "yielded", rank: 26, n: L("Тот, кто уступил", "The one who stepped aside"), d: L("Ты отдал своё место другому. Он вырастил на нём целую жизнь.", "You gave up your place for someone else. They grew a whole life in it."), hint: L("Уйти самому, чтобы остался другой", "Step aside so someone else could stay"), ok: p => p.f.selfless },
);

// ---------- Достижения ----------
window.ACHIEVEMENTS.push(
  { id: "space", n: L("Поехали!", "Liftoff!"), d: L("Полететь в космос", "Fly to space"), ok: p => p.f.space },
  { id: "spacewalk", n: L("Открытый космос", "Open space"), d: L("Выйти в открытый космос", "Do a spacewalk"), ok: p => p.f.spacewalk },
  { id: "treaty", n: L("Голубь мира", "Dove of peace"), d: L("Добиться мира на переговорах", "Broker a peace deal"), ok: p => p.f.treaty },
  { id: "film", n: L("Мотор!", "Action!"), d: L("Получить приз кинофестиваля", "Win a festival prize"), ok: p => p.f.filmAward },
  { id: "rescuer", n: L("Сквозь огонь", "Through the fire"), d: L("Вытащить людей из огня или из-под завала", "Pull people out of a fire or a cave-in"), ok: p => p.f.rescuer },
  { id: "landmark", n: L("Памятник", "Landmark"), d: L("Построить здание или мост по своему проекту", "Build a building or bridge of your design"), ok: p => p.f.landmark },
  { id: "bridge", n: L("Мост через реку", "Across the river"), d: L("Построить мост, о котором мечтали сто лет", "Build the bridge people dreamed of for a century"), ok: p => p.f.bridge },
  { id: "game", n: L("Игра в игре", "A game within a game"), d: L("Выпустить свою игру", "Ship your own game"), ok: p => p.f.game },
  { id: "judge", n: L("Ваша честь", "Your Honor"), d: L("Стать судьёй", "Become a judge"), ok: p => p.f.judge },
  { id: "invention", n: L("Эврика", "Eureka"), d: L("Изобрести что-то полезное", "Invent something useful"), ok: p => p.f.invention },
  { id: "fashion", n: L("Подиум", "Runway"), d: L("Показ на неделе моды", "Show at fashion week"), ok: p => p.f.fashionWeek },
  { id: "captain", n: L("Капитан", "Captain"), d: L("Своё судно", "Your own vessel"), ok: p => p.f.captain },
  { id: "zoo", n: L("Доктор Айболит", "Doctor of beasts"), d: L("Вылечить жирафа", "Treat a giraffe"), ok: p => p.f.zoo },
  { id: "viral", n: L("Вирусное", "Viral"), d: L("Миллион просмотров за ночь", "A million views overnight"), ok: p => p.f.viral },
  { id: "translator", n: L("Слово в слово", "Word for word"), d: L("Перевести великую книгу", "Translate a great book"), ok: p => p.f.translatedBook },
  { id: "midwife", n: L("Тысяча рождений", "A thousand births"), d: L("Работать в роддоме", "Work on the maternity ward"), ok: p => p.f.midwife },
  { id: "union", n: L("Солидарность", "Solidarity"), d: L("Возглавить профсоюз", "Lead the union"), ok: p => p.f.union },
  { id: "power", n: L("Да будет свет", "Let there be light"), d: L("Построить электростанцию", "Build a power plant"), ok: p => p.f.megaproject },
  { id: "hostel", n: L("Добро пожаловать", "Welcome"), d: L("Открыть хостел", "Open a hostel"), ok: p => p.f.hostel },
  { id: "chain", n: L("Сеть", "Chain"), d: L("Пять лавок с твоей вывеской", "Five shops under your sign"), ok: p => p.f.shopChain },
  { id: "well", n: L("Живая вода", "Living water"), d: L("Построить колодец для деревни", "Build a well for the village"), ok: p => p.f.well },
  { id: "hajj", n: L("Паломничество", "Pilgrimage"), d: L("Совершить хадж", "Make the hajj"), ok: p => p.f.hajj },
  { id: "aurora", n: L("Небесный огонь", "Sky fire"), d: L("Увидеть северное сияние", "See the northern lights"), ok: p => p.f.aurora },
  { id: "eclipse", n: L("Звёзды днём", "Stars at noon"), d: L("Увидеть полное солнечное затмение", "See a total solar eclipse"), ok: p => p.f.eclipse },
  { id: "volcano", n: L("Огненная гора", "Mountain of fire"), d: L("Увидеть извержение вулкана", "See a volcano erupt"), ok: p => p.f.volcano },
  { id: "comet", n: L("Раз в жизни", "Once in a lifetime"), d: L("Увидеть комету днём", "See a comet in daylight"), ok: p => p.f.comet },
  { id: "friend2", n: L("В два часа ночи", "At 2 a.m."), d: L("Приехать к другу, когда ему плохо", "Show up for a friend in crisis"), ok: p => p.f.friendSaved },
  { id: "eighty", n: L("Восемьдесят свечей", "Eighty candles"), d: L("Отпраздновать восьмидесятилетие", "Celebrate your eightieth birthday"), ok: p => p.age >= 80 },
  { id: "allroads", n: L("Мастер на все руки", "Jack of all trades"), d: L("Сменить 4 профессии за жизнь", "Hold 4 different jobs in one life"), ok: p => (p.f.jobsHeld || []).length >= 4 },
  // мета: копятся через много жизней
  { id: "atlas60", n: L("Гражданин мира", "Citizen of the world"), d: L("Родиться в 60 разных странах", "Be born in 60 different countries"), ok: (p, a) => a.length >= 60 },
  { id: "endings50", n: L("Книга судеб", "Book of fates"), d: L("Собрать 50 итогов жизни", "Collect 50 life endings"), ok: (p, a, m) => (m && m.endings || 0) >= 50 },
  { id: "lives100", n: L("Сто жизней", "A hundred lives"), d: L("Прожить 100 жизней", "Live 100 lives"), ok: (p, a, m) => (m && m.lives || 0) >= 100 },
  { id: "rare10", n: L("Музей чудес", "Museum of wonders"), d: L("Увидеть 10 разных редких моментов", "See 10 different rare moments"), ok: (p, a, m) => (m && m.rares || 0) >= 10 },
);
for (const a of window.ACHIEVEMENTS) if (["atlas60", "endings50", "lives100", "rare10"].includes(a.id)) a.meta = true;

// ---------- Испытания ----------
window.CHALLENGES.push(
  { id: "stars", lvl: 12, n: L("Мечта о звёздах", "Reach for the stars"), d: L("Богатая страна, острый ум и крепкое здоровье", "A rich country, a sharp mind and strong health"), goal: L("Полететь в космос", "Fly to space"), country: c => c.d > .7, setup: p => { if (!p.traits.includes("bright")) p.traits = ["bright"].concat(p.traits.filter(t => t !== "frail").slice(0, 1)); p.h0 = clamp(p.h0 + 8, 15, 98); p.r.h = clamp(p.r.h + 8); }, ok: p => p.f.space, reward: 3000 },
  { id: "bigfamily", lvl: 9, n: L("Большая семья", "A big family"), d: L("Черта «Верность» с рождения", "Born with the Loyalty trait"), goal: L("Четверо детей и внуки", "Four children and grandchildren"), setup: p => { if (!p.traits.includes("loyal")) p.traits = ["loyal"].concat(p.traits.slice(0, 1)); }, ok: p => p.kids.length >= 4 && p.f.grandkids, reward: 1800 },
  { id: "voice", lvl: 14, n: L("Голос народа", "Voice of the people"), d: L("Бедная страна и бедная семья", "A poor country and a poor family"), goal: L("Стать мэром, министром или главой профсоюза", "Become a mayor, a minister or a union leader"), country: c => c.d < .45, setup: p => { p.q = Math.min(p.q, 2); }, ok: p => p.f.mayor || p.f.minister || p.f.union, reward: 2400 },
  { id: "rescue", lvl: 15, n: L("Спасатель", "Rescuer"), d: L("Черта «Смелость» с рождения", "Born with the Courage trait"), goal: L("Спасти чью-то жизнь и дожить до 60", "Save a life and live to 60"), setup: p => { if (!p.traits.includes("brave")) p.traits = ["brave"].concat(p.traits.slice(0, 1)); }, ok: p => (p.f.rescuer || p.f.savedLife) && p.age >= 60, reward: 2200 },
  { id: "polyglot", lvl: 17, n: L("Кругосветка", "Around the world"), d: L("Черта «Любознательность» с рождения", "Born with the Curiosity trait"), goal: L("Пять путешествий и три языка", "Five trips and three languages"), setup: p => { if (!p.traits.includes("curious")) p.traits = ["curious"].concat(p.traits.slice(0, 1)); }, ok: p => (p.f.trips || 0) >= 5 && (p.f.langs || 1) >= 3, reward: 2600 },
  { id: "builder", lvl: 19, n: L("Своими руками", "With your own hands"), d: L("Черта «Золотые руки», семья среднего достатка", "Born Handy into a middle-income family"), goal: L("Построить мост, здание или электростанцию", "Build a bridge, a building or a power plant"), setup: p => { p.q = 3; if (!p.traits.includes("handy")) p.traits = ["handy"].concat(p.traits.slice(0, 1)); }, ok: p => p.f.landmark || p.f.megaproject, reward: 2800 },
);
// «Сам по себе» обходит стороной и новые любовные карточки
for (const c of window.CHALLENGES) if (c.id === "solo") { const s = c.setup; c.setup = p => { s(p); p.mods.ban = p.mods.ban.concat("firstkiss", "lastdance", "datenight", "honeymoon2", "breakup"); }; }

// ---------- Подстройка частот ----------
// Карточек стало вдвое больше, и главные развилки (учёба, работа, любовь, дети, переезд) тонули в будничных сценах.
// Поднимаем их вес, чтобы семья, карьера и эмиграция случались так же часто, как до расширения.
const CORE2 = { school: 1.6, after: 1.6, firstjob: 1.7, love: 1.8, kids: 1.9, career: 1.5, house: 1.5, abroad: 1.9, promo: 1.4, talent: 1.4, teen: 1.3, parents: 1.3, grandkids: 1.6, old: 1.3, midlife: 1.3, invest: 1.3, major: 1.6, graduate: 1.5, wedding: 1.6, newlove: 1.4, trade: 1.4, migrantwork: 1.5, relocate: 1.4 };
for (const c of window.CARDS) if (CORE2[c.id]) { const w = c.w, k = CORE2[c.id]; c.w = p => (txt(w, p) ?? 1) * k; }
// подстройка новых веток
for (const c of window.CARDS) {
  if (["firestation", "mine"].includes(c.id)) c.w = .5;
  if (c.id === "union") { const f = c.if; c.if = p => f(p) && p.age >= 35; c.w = .5; c.o[0].ch = p => .25 + p.r.t / 300; }
  if (c.id === "cosmos") c.if = p => ["pilot", "engineer", "scientist", "doctor", "officer", "it"].includes(p.job) && p.r.k >= 62 && p.r.h >= 58 && p.c.d > .45 && !p.f.cosmosTried;
  if (c.id === "treaty") c.if = p => p.job === "diplomat" && p.f.posted && p.age >= 38 && !p.f.treatyTried;
}
for (const e of window.ENDINGS) {
  if (e.id === "truefriend") e.ok = p => p.f.friendSaved && p.r.t >= 75 && p.age >= 60;
  if (e.id === "rescuer") { e.ok = p => p.f.rescuer && (p.f.fireChief || p.f.blaze && p.f.collapse || p.age >= 50); }
}
// премия за открытие выпадала слишком редко: итог «Светило науки» почти никто не видел
for (const e of window.EVENTS) if (e.id === "prize") e.w = p => p.f.discovery && p.age >= 40 && !p.f.prize ? .3 : 0;
})();
