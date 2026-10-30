// Новые дороги в жизни: пожарные, актёры, архитекторы, ветеринары, моряки, блогеры, дипломаты, переводчики,
// гиды, дизайнеры, шахтёры, разработчики игр, юристы, инженеры, медсёстры, торговцы и космос.
// Каждая ветка: вход (профессия), развилка посередине и вершина, к которой привязан итог жизни.
// Тексты на двух языках прямо здесь: L("по-русски", "in English"). Подключается после content-family.js.
(() => {
const L = window.tr;
const he = (p, m, f) => p.sex === "f" ? f : m;
const noJob = p => !p.job || ["worker", "driver", "trader", "farmer"].includes(p.job);
const langs = p => p.f.langs || 1;
const coast = p => ["Океания", "Азия", "Европа"].includes(p.c.part) || ["la", "br", "waf", "ea", "us"].includes(p.c.reg);

// ---------- Профессии ----------
Object.assign(window.JOBS, {
  firefighter: { n: L("Пожарный", "Firefighter"), pay: 7 },
  actor:       { n: L("Актёр", "Actor"), nf: L("Актриса", undefined), pay: 6 },
  architect:   { n: L("Архитектор", "Architect"), pay: 11 },
  vet:         { n: L("Ветеринар", "Vet"), pay: 8 },
  fisher:      { n: L("Рыбак", "Fisher"), pay: 5 },
  blogger:     { n: L("Блогер", "Content creator"), pay: 6 },
  diplomat:    { n: L("Дипломат", "Diplomat"), pay: 12 },
  translator:  { n: L("Переводчик", "Translator"), nf: L("Переводчица", undefined), pay: 7 },
  guide:       { n: L("Гид", "Tour guide"), pay: 5 },
  designer:    { n: L("Дизайнер", "Designer"), pay: 8 },
  miner:       { n: L("Шахтёр", "Miner"), pay: 7 },
  gamedev:     { n: L("Разработчик игр", "Game developer"), nf: L("Разработчица игр", undefined), pay: 11 },
  astronaut:   { n: L("Космонавт", "Astronaut"), pay: 15 },
});
for (const id of ["actor", "translator", "gamedev"]) if (!window.JOBS[id].nf) delete window.JOBS[id].nf;

window.CARDS.push(
  // ===== Пожарные =====
  { id: "firestation", ic: "🚒", from: 18, to: 35, if: p => noJob(p) && p.r.h >= 50 && !p.f.fireTried, t: L("Пожарная часть", "The fire station"), q: () => L("В пожарную часть набирают новичков. Нужны крепкие руки и холодная голова.", "The fire station is hiring. Strong arms and a cool head required."), o: [
    { l: L("Пойти в пожарные", "Join the crew"), tags: ["work", "risk"], ch: p => .45 + p.r.h / 250, yes: { m: 6, t: 6, j: 4 }, no: { j: -3 }, ys: L("Шлем, куртка и дежурство сутки через трое.", "A helmet, a coat and a shift every fourth day."), ns: L("Не сдал нормативы по бегу.", "You failed the running test."), set: p => { p.f.fireTried = true; setJob(p, "firefighter"); }, setNo: p => p.f.fireTried = true },
    { l: L("Это не для меня", "Not for me"), ch: () => 1, yes: {}, ys: L("Пусть героями будут другие.", "Let someone else be the hero."), set: p => p.f.fireTried = true },
  ]},
  { id: "blaze", ic: "🔥", heavy: true, prio: true, from: 20, to: 55, if: p => p.job === "firefighter" && !p.f.blaze, t: L("Пожар", "The blaze"), q: () => L("Горит многоэтажка. На пятом этаже кто-то стучит в окно.", "An apartment block is on fire. Someone is banging on a fifth-floor window."), o: [
    { l: L("Идти внутрь", "Go in"), tags: ["risk", "care"], ch: p => .45 + p.r.h / 300, yes: { j: 14, t: 10, h: -4 }, no: { h: -14, j: -6 }, ys: L("Ты вынес на руках мальчика и его кота.", "You carried out a boy and his cat."), ns: L("Обрушилась лестница. Месяц в ожоговом.", "The stairs collapsed. A month in the burns unit."), set: p => { p.f.blaze = true; p.f.rescuer = true; }, setNo: p => p.f.blaze = true, fx: "fire" },
    { l: L("Ставить лестницу снаружи", "Raise the ladder outside"), tags: ["work"], ch: () => .7, yes: { j: 10, t: 6 }, no: { j: -8 }, ys: L("Лестница дотянулась. Все спасены.", "The ladder reached. Everyone was saved."), ns: L("Не хватило двух метров.", "Two meters short."), set: p => { p.f.blaze = true; p.f.rescuer = true; }, setNo: p => p.f.blaze = true, fx: "fire" },
  ]},
  { id: "firechief", ic: "🧯", prio: true, from: 35, to: 58, if: p => p.job === "firefighter" && p.f.blaze && !p.f.fireChief, t: L("Начальник части", "Station chief"), q: () => L("Старый начальник уходит на пенсию и зовёт тебя на своё место.", "The old chief is retiring and wants you to take over."), o: [
    { l: L("Принять часть", "Take command"), tags: ["work", "social"], ch: p => .55 + p.r.t / 300, yes: { m: 8, j: 6, t: 4 }, no: { j: -4 }, ys: L("Теперь ты отвечаешь за двадцать человек и весь район.", "Now you answer for twenty people and the whole district."), ns: L("Назначили человека из министерства.", "They appointed someone from the ministry."), set: p => { p.f.fireChief = true; p.jobLvl = Math.min(3, p.jobLvl + 1); }, setNo: p => p.f.fireChief = true },
    { l: L("Остаться в расчёте", "Stay on the truck"), ch: () => 1, yes: { j: 4, h: -2 }, ys: L("Твоё место у шланга.", "Your place is on the hose."), set: p => p.f.fireChief = true },
  ]},
  { id: "firekids", ic: "🧒", from: 30, to: 60, if: p => p.job === "firefighter" && !p.f.fireKids, t: L("Урок в школе", "A school visit"), q: () => L("Школа просит рассказать детям, что делать при пожаре.", "A school asks you to teach the kids what to do in a fire."), o: [
    { l: L("Приехать с машиной", "Bring the truck"), tags: ["social"], ch: () => 1, yes: { t: 6, j: 6 }, ys: L("Каждый ребёнок посидел в кабине и включил сирену.", "Every child sat in the cab and hit the siren."), set: p => p.f.fireKids = true },
    { l: L("Некогда", "No time"), ch: () => 1, yes: { m: 1 }, ys: L("Пришлют плакат.", "They'll get a poster."), set: p => p.f.fireKids = true },
  ]},

  // ===== Театр и кино =====
  { id: "audition", ic: "🎭", from: 16, to: 30, if: p => (p.f.art || p.traits.includes("artist") || p.traits.includes("charm")) && !p.f.actTried, t: L("Прослушивание", "The audition"), q: () => L("Театральное училище проводит открытое прослушивание.", "The drama school is holding open auditions."), o: [
    { l: L("Читать монолог", "Perform a monologue"), tags: ["art", "risk"], ch: p => .25 + p.r.j / 300 + (p.traits.includes("charm") ? .1 : 0), yes: { k: 6, j: 10 }, no: { j: -6 }, ys: L("Комиссия попросила прочитать ещё раз. Тебя взяли.", "The panel asked for an encore. You're in."), ns: L("«Спасибо, следующий».", "\"Thank you, next.\""), set: p => { p.f.actTried = true; setJob(p, "actor"); }, setNo: p => p.f.actTried = true },
    { l: L("Петь в любительском театре", "Join an amateur troupe"), tags: ["art", "social"], ch: () => 1, yes: { t: 6, j: 6 }, ys: L("Аплодисменты соседей тоже аплодисменты.", "Applause from neighbors is still applause."), set: p => { p.f.actTried = true; p.f.art = true; } },
  ]},
  { id: "role", ic: "🎬", prio: true, from: 20, to: 50, if: p => p.job === "actor" && !p.f.roleTried, t: L("Главная роль", "The lead role"), q: () => L("Режиссёр ищет лицо для нового фильма. Пробы завтра.", "A director is casting a new film. Screen tests tomorrow."), o: [
    { l: L("Готовиться всю ночь", "Prepare all night"), tags: ["art", "risk"], ch: p => .25 + p.r.k / 400 + p.r.j / 400 + .1 * p.c.d, yes: { m: 12, j: 12 }, no: { j: -8 }, ys: L("Твоё лицо на афишах по всей стране.", "Your face is on posters all over the country."), ns: L("Роль отдали звезде.", "The part went to a star."), set: p => { p.f.roleTried = true; p.f.film = true; p.f.famous = true; }, setNo: p => p.f.roleTried = true, fx: "film" },
    { l: L("Остаться в театре", "Stay with the stage"), tags: ["art"], ch: () => 1, yes: { j: 6, t: 4 }, ys: L("Сцена, где публика дышит рядом.", "A stage where the audience breathes beside you."), set: p => { p.f.roleTried = true; p.f.theater = true; } },
  ]},
  { id: "premiere", ic: "🏆", prio: true, from: 25, to: 75, if: p => p.f.film && !p.f.filmAward && !p.f.premiere, t: L("Кинофестиваль", "The film festival"), q: () => L("Фильм с тобой взяли в конкурс большого фестиваля.", "Your film got into the competition at a major festival."), o: [
    { l: L("Ехать на красную дорожку", "Walk the red carpet"), tags: ["art", "social"], ch: () => .35, yes: { j: 14, m: 10, t: 4 }, no: { j: 4 }, ys: L("Приз за лучшую роль. Ты забыл всю речь.", "Best performance. You forgot your whole speech."), ns: L("Приз ушёл другому, но фото вышли отличные.", "The prize went elsewhere, but the photos are great."), set: p => { p.f.premiere = true; p.f.filmAward = true; }, setNo: p => p.f.premiere = true, fx: "star" },
    { l: L("Смотреть трансляцию дома", "Watch the stream at home"), ch: () => 1, yes: { j: 2 }, ys: L("Твой фильм похвалили в новостях.", "The news praised your film."), set: p => p.f.premiere = true },
  ]},
  { id: "typecast", ic: "🎞", from: 35, to: 65, if: p => p.job === "actor" && !p.f.typecast, t: L("Одна и та же роль", "Typecast"), q: () => L("Тебе снова предлагают роль строгого полицейского. Двенадцатую.", "They offer you the strict police officer again. The twelfth time."), o: [
    { l: L("Взять: деньги есть деньги", "Take it: money is money"), tags: ["work"], ch: () => 1, yes: { m: 8, j: -3 }, ys: L("Тебя узнают на улице и просят показать документы.", "People recognize you and jokingly ask for your badge."), set: p => p.f.typecast = true },
    { l: L("Сыграть что-то совсем другое", "Play something completely different"), tags: ["art", "risk"], ch: () => .45, yes: { j: 12, k: 4 }, no: { m: -6, j: -4 }, ys: L("Комедия! Критики не верили своим глазам.", "A comedy! The critics couldn't believe it."), ns: L("Зритель не принял.", "The audience didn't buy it."), set: p => p.f.typecast = true, setNo: p => p.f.typecast = true },
  ]},

  // ===== Архитектура =====
  { id: "archschool", ic: "📐", from: 17, to: 25, if: p => p.r.k >= 50 && p.c.d > .25 && !p.f.archTried && !p.job, t: L("Архитектурный", "Architecture school"), q: () => L("Ты всё детство рисовал дома. Может, строить их по-настоящему?", "You spent your childhood drawing houses. Why not build them for real?"), o: [
    { l: L("Поступать на архитектора", "Study architecture"), tags: ["study", "art"], ch: p => .3 + p.r.k / 200, yes: { k: 12, m: -4 }, no: { j: -4 }, ys: L("Первый макет из картона и бессонных ночей.", "Your first model, made of cardboard and sleepless nights."), ns: L("Не прошёл по рисунку.", "Your drawing exam fell short."), set: p => { p.f.archTried = true; p.f.uni = true; setJob(p, "architect"); }, setNo: p => p.f.archTried = true },
    { l: L("Рисовать для себя", "Keep drawing for yourself"), ch: () => 1, yes: { j: 3 }, ys: L("Альбом с городами, которых нет.", "A sketchbook of cities that don't exist."), set: p => p.f.archTried = true },
  ]},
  { id: "competition", ic: "🏛", prio: true, from: 25, to: 58, if: p => p.job === "architect" && !p.f.compTried, t: L("Конкурс", "The competition"), q: () => L("Город объявил конкурс на новую библиотеку.", "The city announced a competition for a new library."), o: [
    { l: L("Смелый проект из стекла", "A bold glass design"), tags: ["art", "risk"], ch: p => .25 + p.r.k / 300, yes: { m: 12, j: 12, k: 4 }, no: { j: -6, m: -3 }, ys: L("Победа. Через пять лет туда придут первые читатели.", "You won. In five years the first readers will walk in."), ns: L("Жюри выбрало проект попроще.", "The jury chose something safer."), set: p => { p.f.compTried = true; p.f.landmark = true; }, setNo: p => p.f.compTried = true, fx: "home" },
    { l: L("Надёжный и тёплый проект", "A solid, warm design"), tags: ["work"], ch: () => .5, yes: { m: 8, j: 6 }, no: { j: -3 }, ys: L("Библиотека, где хочется остаться до закрытия.", "A library where you want to stay till closing."), ns: L("Второе место.", "Second place."), set: p => { p.f.compTried = true; p.f.landmark = true; }, setNo: p => p.f.compTried = true },
  ]},
  { id: "oldtown", ic: "🏚", from: 30, to: 70, if: p => p.job === "architect" && !p.f.oldTown, t: L("Старый квартал", "The old quarter"), q: () => L("Застройщик хочет снести старый квартал и заказывает тебе башни.", "A developer wants to tear down the old quarter and asks you for towers."), o: [
    { l: L("Отказаться и защищать квартал", "Refuse and defend the quarter"), tags: ["social", "risk"], ch: () => .4, yes: { t: 10, j: 8, m: -6 }, no: { m: -6, j: -4 }, ys: L("Квартал признали памятником. Бабушки пекли тебе пироги.", "The quarter became a heritage site. The grannies baked you pies."), ns: L("Квартал снесли без тебя.", "They tore it down without you."), set: p => p.f.oldTown = true, setNo: p => p.f.oldTown = true },
    { l: L("Построить башни", "Build the towers"), tags: ["business"], ch: () => 1, yes: { m: 14, j: -4 }, ys: L("Красиво. Но старых соседей там больше нет.", "Beautiful. But the old neighbors are gone."), set: p => p.f.oldTown = true },
  ]},
  { id: "bridge", ic: "🌉", prio: true, from: 40, to: 72, if: p => (p.job === "architect" || p.job === "engineer") && p.jobLvl >= 2 && !p.f.bridgeTried, t: L("Мост", "The bridge"), q: () => L("Через реку хотят построить мост, о котором говорили сто лет.", "They want to build the bridge across the river that people talked about for a century."), o: [
    { l: L("Взяться", "Take it on"), tags: ["work", "risk"], ch: p => .35 + p.r.k / 300, yes: { j: 14, m: 10, k: 6 }, no: { j: -8, m: -6 }, ys: L("В день открытия по мосту прошёл весь город.", "On opening day the whole town walked across."), ns: L("Проект заморозили на десять лет.", "The project was frozen for ten years."), set: p => { p.f.bridgeTried = true; p.f.bridge = true; p.f.landmark = true; }, setNo: p => p.f.bridgeTried = true, fx: "star" },
    { l: L("Отдать молодым", "Hand it to the young ones"), tags: ["social"], ch: () => 1, yes: { t: 6, j: 3 }, ys: L("Ты консультировал. Табличку повесили с их именами.", "You consulted. The plaque has their names on it."), set: p => { p.f.bridgeTried = true; p.f.mentor = true; } },
  ]},

  // ===== Ветеринария =====
  { id: "vetschool", ic: "🐶", from: 17, to: 26, if: p => (p.f.pet != null || p.f.cat) && p.r.k >= 40 && !p.f.vetTried && !p.job, t: L("Ветеринарный", "Vet school"), q: () => L("Ты всегда приносил домой раненых птиц. Может, это профессия?", "You always brought home injured birds. Maybe that's a calling?"), o: [
    { l: L("Учиться на ветеринара", "Train as a vet"), tags: ["study", "care"], ch: p => .4 + p.r.k / 250, yes: { k: 10, j: 6 }, no: { j: -3 }, ys: L("Первый пациент: хомяк с насморком.", "Your first patient: a hamster with a cold."), ns: L("Конкурс оказался огромным.", "The competition was huge."), set: p => { p.f.vetTried = true; setJob(p, "vet"); }, setNo: p => p.f.vetTried = true },
    { l: L("Просто любить животных", "Just love animals"), ch: () => 1, yes: { j: 3 }, ys: L("Все собаки района тебя знают.", "Every dog in the neighborhood knows you."), set: p => p.f.vetTried = true },
  ]},
  { id: "farmcall", ic: "🐄", prio: true, from: 22, to: 65, if: p => p.job === "vet" && !p.f.farmCall, t: L("Ночной вызов", "A night call"), q: () => L("Три часа ночи. У фермера тяжело телится корова.", "Three in the morning. A farmer's cow is having a hard calving."), o: [
    { l: L("Ехать", "Drive out"), tags: ["care", "work"], ch: p => .55 + p.r.k / 300, yes: { j: 10, t: 6, m: 3 }, no: { j: -6 }, ys: L("Двойня! Фермер назвал телят в твою честь.", "Twins! The farmer named the calves after you."), ns: L("Корову спасли, телёнка нет.", "The cow lived. The calf didn't."), set: p => { p.f.farmCall = true; p.f.vetSaved = true; }, setNo: p => p.f.farmCall = true, fx: "paw" },
    { l: L("Дать советы по телефону", "Advise by phone"), ch: () => .5, yes: { m: 2 }, no: { j: -6, t: -4 }, ys: L("Фермер справился сам.", "The farmer managed alone."), ns: L("Фермер больше не звонит.", "The farmer doesn't call anymore."), set: p => p.f.farmCall = true, setNo: p => p.f.farmCall = true },
  ]},
  { id: "vetclinic", ic: "🏥", from: 30, to: 65, if: p => p.job === "vet" && p.r.m >= 30 && !p.f.vetClinic, t: L("Своя клиника", "A clinic of your own"), q: () => L("Можно открыть свою ветклинику с приютом.", "You could open your own vet clinic with a shelter."), o: [
    { l: L("Открыть", "Open it"), tags: ["business", "care"], ch: p => .4 + .3 * p.c.d, yes: { m: 8, j: 10, t: 4 }, no: { m: -10 }, ys: L("Над входом нарисован кот в бинтах.", "There's a bandaged cat painted over the door."), ns: L("Аренда съела всё.", "The rent ate everything."), set: p => { p.f.vetClinic = true; p.f.biz = p.f.biz || 1; }, setNo: p => p.f.vetClinic = true },
    { l: L("Работать по найму", "Stay employed"), ch: () => 1, yes: { m: 3 }, ys: L("Меньше забот, больше сна.", "Fewer worries, more sleep."), set: p => p.f.vetClinic = true },
  ]},
  { id: "zoo", ic: "🦒", prio: true, from: 35, to: 70, if: p => p.job === "vet" && p.f.vetSaved && !p.f.zooTried, t: L("Зоопарк", "The zoo"), q: () => L("Зоопарку нужен врач. Первый пациент — жираф с больным зубом.", "The zoo needs a vet. First patient: a giraffe with a toothache."), o: [
    { l: L("Согласиться", "Accept"), tags: ["care", "risk"], ch: () => .6, yes: { j: 14, k: 6 }, no: { h: -4, j: -2 }, ys: L("Жираф теперь наклоняется, когда ты проходишь мимо.", "The giraffe now bends down whenever you walk by."), ns: L("Жираф лягнул. Обошлось синяком.", "The giraffe kicked. Just a bruise."), set: p => { p.f.zooTried = true; p.f.zoo = true; }, setNo: p => p.f.zooTried = true, fx: "paw" },
    { l: L("Мне хватает кошек", "Cats are enough for me"), ch: () => 1, yes: { j: 2 }, ys: L("Кошки, правда, не благодарят.", "Cats never say thank you, though."), set: p => p.f.zooTried = true },
  ]},

  // ===== Море =====
  { id: "boat", ic: "🛶", from: 15, to: 35, if: p => coast(p) && p.c.d < .65 && noJob(p) && !p.f.boatTried, t: L("Лодка", "The boat"), q: () => L("Дядя зовёт на свою лодку: рыба, сети и рассветы.", "Your uncle invites you onto his boat: fish, nets and sunrises."), o: [
    { l: L("Выйти в море", "Go to sea"), tags: ["work", "risk"], ch: () => .8, yes: { m: 5, h: 3, j: 4 }, no: { m: -2 }, ys: L("Руки в соли, но улов твой.", "Salt on your hands, but the catch is yours."), ns: L("Морская болезнь каждый день.", "Seasick every single day."), set: p => { p.f.boatTried = true; setJob(p, "fisher"); }, setNo: p => p.f.boatTried = true },
    { l: L("Остаться на берегу", "Stay ashore"), ch: () => 1, yes: {}, ys: L("Рыбу проще купить.", "Fish is easier to buy."), set: p => p.f.boatTried = true },
  ]},
  { id: "storm", ic: "🌊", heavy: true, prio: true, from: 18, to: 60, if: p => p.job === "fisher" && !p.f.storm, t: L("Шторм", "The storm"), q: () => L("Небо почернело за полчаса. До берега два часа.", "The sky turned black in half an hour. Shore is two hours away."), o: [
    { l: L("Бросить сети и плыть домой", "Cut the nets and run for home"), tags: ["risk"], ch: () => .8, yes: { m: -6, j: 4 }, no: { h: -12, m: -8 }, ys: L("Сети жалко. Себя нет.", "You miss the nets. Not as much as you'd miss yourself."), ns: L("Лодку разбило о камни. Ты доплыл.", "The boat broke on the rocks. You swam ashore."), set: p => p.f.storm = true, setNo: p => p.f.storm = true },
    { l: L("Переждать за островом", "Shelter behind the island"), tags: ["risk"], ch: p => .5 + p.r.k / 300, yes: { m: 6, j: 6, k: 4 }, no: { h: -14 }, ys: L("Наутро вернулся с полными сетями.", "You came back next morning with full nets."), ns: L("Ветер переменился. Чудом выжил.", "The wind turned. You survived by a miracle."), set: p => p.f.storm = true, setNo: p => p.f.storm = true },
  ]},
  { id: "captain", ic: "⚓", prio: true, from: 30, to: 62, if: p => p.job === "fisher" && p.f.storm && !p.f.captainTried, t: L("Своё судно", "A vessel of your own"), q: () => L("Старый капитан продаёт траулер. Дёшево, но он требует ремонта.", "An old captain is selling his trawler. Cheap, but it needs work."), o: [
    { l: L("Купить и стать капитаном", "Buy it and become captain"), tags: ["business", "risk"], ch: p => .35 + p.r.m / 250, yes: { m: 14, j: 10 }, no: { m: -12, j: -4 }, ys: L("Шесть человек команды и твоё имя на борту.", "A crew of six and your name on the bow."), ns: L("Двигатель умер в первом же рейсе.", "The engine died on the first trip."), set: p => { p.f.captainTried = true; p.f.captain = true; p.jobLvl = Math.min(3, p.jobLvl + 1); }, setNo: p => p.f.captainTried = true, fx: "travel" },
    { l: L("Работать на чужом", "Keep crewing for others"), ch: () => 1, yes: { m: 3 }, ys: L("Спокойнее спится.", "You sleep better."), set: p => p.f.captainTried = true },
  ]},

  // ===== Блог =====
  { id: "channel", ic: "📹", from: 13, to: 35, if: p => p.c.d > .3 && !p.f.channelTried, t: L("Свой канал", "Your own channel"), q: () => L("Друзья говорят, что ты смешно рассказываешь. Может, снимать видео?", "Friends say you're funny. Why not make videos?"), o: [
    { l: L("Снимать каждый день", "Post every day"), tags: ["art", "risk"], ch: p => .3 + p.r.j / 400, yes: { j: 8, t: 4, k: 2 }, no: { j: -4 }, ys: L("Тысяча подписчиков! Мама подписалась первой.", "A thousand subscribers! Mom was the first."), ns: L("Двенадцать просмотров, пять из них твои.", "Twelve views, five of them yours."), set: p => { p.f.channelTried = true; p.f.channel = true; }, setNo: p => p.f.channelTried = true },
    { l: L("Смотреть других", "Just watch others"), ch: () => 1, yes: { j: 2, k: -1 }, ys: L("Ещё одно видео, и спать.", "One more video, then bed."), set: p => p.f.channelTried = true },
  ]},
  { id: "viral", ic: "📈", prio: true, from: 15, to: 55, if: p => p.f.channel && !p.f.viralTried, t: L("Вирусное видео", "Going viral"), q: () => L("Видео разлетелось: миллион просмотров за ночь. Бренды пишут в личку.", "A video blew up: a million views overnight. Brands are in your inbox."), o: [
    { l: L("Сделать блог работой", "Go full-time"), tags: ["business", "risk"], ch: () => .5, yes: { m: 12, j: 8 }, no: { m: -6, j: -6 }, ys: L("Теперь это твоя работа. Свет, микрофон, монтаж до утра.", "Now it's your job. Lights, a mic, editing till dawn."), ns: L("Хайп прошёл за неделю.", "The hype was gone in a week."), set: p => { p.f.viralTried = true; p.f.viral = true; p.f.famous = true; setJob(p, "blogger"); }, setNo: p => p.f.viralTried = true, fx: "star" },
    { l: L("Оставить хобби хобби", "Keep it a hobby"), ch: () => 1, yes: { j: 6, t: 2 }, ys: L("Минута славы. Приятная минута.", "A minute of fame. A nice minute."), set: p => p.f.viralTried = true },
  ]},
  { id: "haters", ic: "💬", from: 18, to: 60, if: p => p.job === "blogger" && !p.f.haters, t: L("Комментарии", "The comments"), q: () => L("Под каждым видео пишут гадости. Сотни сообщений.", "Every video gets nasty comments. Hundreds of them."), o: [
    { l: L("Отключить комментарии и отдохнуть", "Turn off comments and rest"), tags: ["rest"], ch: () => 1, yes: { j: 4, m: -2 }, ys: L("Тишина оказалась лучшим подписчиком.", "Silence turned out to be your best follower."), set: p => p.f.haters = true },
    { l: L("Ответить смешным видео", "Answer with a funny video"), tags: ["art", "risk"], ch: () => .55, yes: { j: 8, m: 4 }, no: { j: -8 }, ys: L("Самое популярное видео канала.", "The channel's most popular video."), ns: L("Стало только хуже.", "It only got worse."), set: p => p.f.haters = true, setNo: p => p.f.haters = true },
  ]},
  { id: "offline", ic: "🌄", from: 30, to: 70, if: p => p.job === "blogger" && !p.f.offline, t: L("Без интернета", "Offline"), q: () => L("Ты не помнишь, когда последний раз ел без камеры.", "You can't remember the last meal you ate without filming it."), o: [
    { l: L("Уехать на месяц без телефона", "Go a month without the phone"), tags: ["rest"], ch: () => 1, yes: { j: 10, h: 4, m: -4 }, ys: L("Вернулся и снял о поездке лучший фильм.", "You came back and made your best film about it."), set: p => p.f.offline = true },
    { l: L("Нельзя: алгоритм забудет", "Can't: the algorithm will forget me"), ch: () => 1, yes: { m: 4, j: -4 }, ys: L("Ещё один ролик.", "One more upload."), set: p => p.f.offline = true },
  ]},

  // ===== Дипломатия и языки =====
  { id: "foreignservice", ic: "🕊", from: 22, to: 38, if: p => p.r.k >= 60 && langs(p) >= 2 && !p.f.dipTried && !["doctor", "scientist"].includes(p.job), t: L("Дипломатическая служба", "The foreign service"), q: () => L("Министерство иностранных дел набирает молодых сотрудников со знанием языков.", "The foreign ministry is recruiting young staff who speak languages."), o: [
    { l: L("Сдавать экзамены", "Take the exams"), tags: ["study", "social"], ch: p => .25 + p.r.k / 300 + langs(p) * .05, yes: { k: 8, m: 6, j: 4 }, no: { j: -4 }, ys: L("Первый костюм, первый пропуск, первая командировка.", "Your first suit, first badge, first posting."), ns: L("Срезался на собеседовании.", "You stumbled at the interview."), set: p => { p.f.dipTried = true; setJob(p, "diplomat"); }, setNo: p => p.f.dipTried = true },
    { l: L("Нет, мне ближе дом", "No, I'd rather stay home"), ch: () => 1, yes: {}, ys: L("Дипломатии хватает и в семье.", "There's enough diplomacy at home."), set: p => p.f.dipTried = true },
  ]},
  { id: "embassy", ic: "🏳", prio: true, from: 25, to: 58, if: p => p.job === "diplomat" && !p.f.posted, t: L("Назначение", "The posting"), q: p => { if (!p._post) p._post = pickCountry(p).name; return L(`Тебя отправляют в посольство: ${p._post}. На четыре года.`, `You're being posted to the embassy in ${p._post}. For four years.`); }, o: [
    { l: L("Ехать всей семьёй", "Go with the whole family"), tags: ["move", "social"], ch: () => .8, yes: { k: 8, j: 6, t: 2 }, no: { t: -6, j: -2 }, ys: L("Дети теперь говорят на трёх языках.", "The kids now speak three languages."), ns: L("Семье там было тяжело.", "It was hard on the family."), set: p => { p.f.posted = true; p.f.trips = (p.f.trips || 0) + 1; p.f.langs = langs(p) + 1; }, setNo: p => { p.f.posted = true; p.f.trips = (p.f.trips || 0) + 1; } },
    { l: L("Ехать одному", "Go alone"), tags: ["work", "move"], ch: () => 1, yes: { k: 8, m: 6, t: -6 }, ys: L("Звонки по воскресеньям.", "Sunday phone calls."), set: p => { p.f.posted = true; p.f.trips = (p.f.trips || 0) + 1; } },
  ]},
  { id: "treaty", ic: "📜", prio: true, from: 38, to: 72, if: p => p.job === "diplomat" && p.f.posted && p.jobLvl >= 2 && !p.f.treatyTried, t: L("Переговоры", "The negotiations"), q: () => L("Две соседние страны на грани войны. Тебя зовут посредником.", "Two neighboring countries are on the brink of war. You're asked to mediate."), o: [
    { l: L("Сесть за стол", "Sit down at the table"), tags: ["politics", "social"], ch: p => .3 + p.r.t / 300 + p.r.k / 400, yes: { j: 16, t: 8, k: 6 }, no: { j: -8, h: -3 }, ys: L("Сорок часов без сна. Подписали.", "Forty hours without sleep. They signed."), ns: L("Переговоры сорвались. Ты не спал неделю.", "The talks collapsed. You didn't sleep for a week."), set: p => { p.f.treatyTried = true; p.f.treaty = true; }, setNo: p => p.f.treatyTried = true, fx: "peace" },
    { l: L("Отказаться: слишком рискованно", "Decline: too risky"), ch: () => 1, yes: { h: 2 }, ys: L("Пусть рискуют другие.", "Let someone else take the risk."), set: p => p.f.treatyTried = true },
  ]},
  { id: "translate", ic: "🔤", from: 20, to: 55, if: p => langs(p) >= 2 && p.r.k >= 45 && noJob(p) && !p.f.transTried, t: L("Переводы", "Translation work"), q: () => L("Издательству нужен переводчик. Ты знаешь язык лучше многих.", "A publisher needs a translator. You know the language better than most."), o: [
    { l: L("Стать переводчиком", "Become a translator"), tags: ["study", "work"], ch: () => .75, yes: { k: 6, m: 5 }, no: { m: -2 }, ys: L("Словари на столе, кофе в руке.", "Dictionaries on the desk, coffee in hand."), ns: L("Тестовый перевод не приняли.", "The test translation was rejected."), set: p => { p.f.transTried = true; setJob(p, "translator"); }, setNo: p => p.f.transTried = true },
    { l: L("Только для друзей", "Only for friends"), ch: () => 1, yes: { t: 3 }, ys: L("Письма, инструкции, меню.", "Letters, manuals, menus."), set: p => p.f.transTried = true },
  ]},
  { id: "bigtranslation", ic: "📗", prio: true, from: 25, to: 75, if: p => p.job === "translator" && !p.f.bigTransTried, t: L("Великая книга", "The great book"), q: () => L("Тебе доверили перевести знаменитый роман, который сто лет не переводили.", "You're asked to translate a famous novel nobody has translated in a century."), o: [
    { l: L("Взяться на два года", "Spend two years on it"), tags: ["study", "art"], ch: p => .4 + p.r.k / 300, yes: { k: 10, j: 10, m: 4 }, no: { j: -6 }, ys: L("Теперь эту книгу читают на твоём языке.", "Now people read that book in your words."), ns: L("Издательство закрылось на середине.", "The publisher folded halfway through."), set: p => { p.f.bigTransTried = true; p.f.translatedBook = true; }, setNo: p => p.f.bigTransTried = true, fx: "book" },
    { l: L("Это слишком", "It's too much"), ch: () => 1, yes: {}, ys: L("Пусть переводят смелые.", "Let the brave ones do it."), set: p => p.f.bigTransTried = true },
  ]},
  { id: "summitbooth", ic: "🎧", from: 30, to: 65, if: p => (p.job === "translator" || p.job === "diplomat") && !p.f.booth, t: L("Синхрон", "The booth"), q: () => L("На международном саммите заболел синхронист. Нужен кто-то прямо сейчас.", "The interpreter at an international summit fell ill. Someone is needed right now."), o: [
    { l: L("Сесть в кабину", "Step into the booth"), tags: ["study", "risk"], ch: p => .35 + p.r.k / 250, yes: { k: 6, j: 10, m: 6 }, no: { j: -6 }, ys: L("Президенты слушали твой голос и кивали.", "Presidents listened to your voice and nodded."), ns: L("Перепутал «сокращение» и «сотрудничество». Неловко.", "You mixed up two key words. Awkward."), set: p => p.f.booth = true, setNo: p => p.f.booth = true },
    { l: L("Порекомендовать коллегу", "Recommend a colleague"), tags: ["social"], ch: () => 1, yes: { t: 4 }, ys: L("Коллега теперь твой должник.", "Your colleague owes you one."), set: p => p.f.booth = true },
  ]},

  // ===== Туризм =====
  { id: "guide", ic: "🗺", from: 18, to: 45, if: p => ((p.f.trips || 0) >= 1 || p.traits.includes("wanderer") || p.traits.includes("charm")) && noJob(p) && !p.f.guideTried, t: L("Экскурсии", "Leading tours"), q: () => L("Туристов в городе всё больше, а рассказать о нём некому.", "More tourists every year, and nobody to tell them about the town."), o: [
    { l: L("Водить экскурсии", "Lead tours"), tags: ["social", "work"], ch: () => .8, yes: { m: 5, t: 6, j: 4 }, no: { m: -2 }, ys: L("Твоя история про призрака на мосту стала легендой.", "Your story about the ghost on the bridge became a legend."), ns: L("Туристы ушли к конкурентам.", "The tourists went with the competition."), set: p => { p.f.guideTried = true; setJob(p, "guide"); }, setNo: p => p.f.guideTried = true },
    { l: L("Нет", "No"), ch: () => 1, yes: {}, ys: L("Пусть сами читают путеводители.", "Let them read guidebooks."), set: p => p.f.guideTried = true },
  ]},
  { id: "hostel", ic: "🛏", prio: true, from: 25, to: 62, if: p => p.job === "guide" && p.r.m >= 20 && !p.f.hostelTried, t: L("Хостел", "The hostel"), q: () => L("Старый дом у вокзала сдаётся. Можно сделать хостел.", "An old house by the station is for rent. It could be a hostel."), o: [
    { l: L("Открыть хостел", "Open a hostel"), tags: ["business", "social"], ch: p => .4 + .2 * p.c.d, yes: { m: 10, t: 8, j: 6 }, no: { m: -10 }, ys: L("Стена с фотографиями гостей из сорока стран.", "A wall of photos with guests from forty countries."), ns: L("Сезон выдался пустым.", "An empty season."), set: p => { p.f.hostelTried = true; p.f.hostel = true; p.f.biz = p.f.biz || 1; }, setNo: p => p.f.hostelTried = true, fx: "home" },
    { l: L("Остаться гидом", "Stay a guide"), ch: () => 1, yes: { j: 2 }, ys: L("Свобода дороже.", "Freedom matters more."), set: p => p.f.hostelTried = true },
  ]},

  // ===== Дизайн и мода =====
  { id: "sketchbook", ic: "✏", from: 15, to: 30, if: p => (p.f.art || p.traits.includes("artist") || p.traits.includes("dreamer")) && !p.f.designTried && (!p.job || p.job === "artist"), t: L("Эскизы", "Sketches"), q: () => L("Ты рисуешь одежду на полях тетрадей. Соседка шьёт и предлагает попробовать.", "You draw clothes in your notebook margins. A neighbor who sews offers to try."), o: [
    { l: L("Сшить первую коллекцию", "Sew your first collection"), tags: ["art", "work"], ch: () => .55, yes: { j: 8, m: 3 }, no: { j: -3 }, ys: L("Пять платьев и очередь из подруг.", "Five dresses and a queue of friends."), ns: L("Ткань кончилась раньше идей.", "The fabric ran out before the ideas."), set: p => { p.f.designTried = true; setJob(p, "designer"); }, setNo: p => p.f.designTried = true },
    { l: L("Оставить на полях", "Leave it in the margins"), ch: () => 1, yes: {}, ys: L("Тетради потом найдут внуки.", "The grandkids will find those notebooks."), set: p => p.f.designTried = true },
  ]},
  { id: "fashionweek", ic: "👗", prio: true, from: 22, to: 60, if: p => p.job === "designer" && !p.f.fashionTried, t: L("Неделя моды", "Fashion week"), q: () => L("Тебя пригласили показать коллекцию на неделе моды.", "You've been invited to show a collection at fashion week."), o: [
    { l: L("Сделать смелый показ", "Put on a daring show"), tags: ["art", "risk"], ch: p => .3 + .2 * p.c.d, yes: { m: 12, j: 12 }, no: { m: -8, j: -6 }, ys: L("Твой цвет назвали цветом сезона.", "Your color was named the color of the season."), ns: L("Критики написали «смело, но зачем».", "Critics wrote \"bold, but why\"."), set: p => { p.f.fashionTried = true; p.f.fashionWeek = true; p.f.famous = true; }, setNo: p => p.f.fashionTried = true, fx: "star" },
    { l: L("Показать классику", "Show the classics"), tags: ["work"], ch: () => .7, yes: { m: 8, j: 4 }, no: { j: -2 }, ys: L("Заказы на год вперёд.", "Orders booked a year ahead."), ns: L("Прошло незаметно.", "It went unnoticed."), set: p => p.f.fashionTried = true, setNo: p => p.f.fashionTried = true },
  ]},

  // ===== Шахта =====
  { id: "mine", ic: "⛏", from: 16, to: 35, if: p => p.c.d < .7 && p.c.d > .1 && noJob(p) && p.r.h >= 45 && !p.f.mineTried, t: L("Шахта", "The mine"), q: () => L("На шахте платят вдвое больше, чем на заводе.", "The mine pays twice what the factory does."), o: [
    { l: L("Спуститься в забой", "Go underground"), tags: ["work", "risk"], ch: () => .85, yes: { m: 10, h: -4, t: 4 }, no: { m: 2 }, ys: L("Тёмная работа, светлая зарплата.", "Dark work, bright paycheck."), ns: L("Взяли только на поверхность.", "They only took you for surface work."), set: p => { p.f.mineTried = true; setJob(p, "miner"); }, setNo: p => p.f.mineTried = true },
    { l: L("Нет, я хочу видеть солнце", "No, I want to see the sun"), ch: () => 1, yes: { j: 2 }, ys: L("Солнце бесплатно.", "The sun is free."), set: p => p.f.mineTried = true },
  ]},
  { id: "collapse", ic: "⚠", heavy: true, prio: true, from: 18, to: 60, if: p => p.job === "miner" && !p.f.collapse, t: L("Обвал", "Cave-in"), q: () => L("Обвал в соседнем штреке. Там остались трое.", "A cave-in in the next tunnel. Three men are trapped."), o: [
    { l: L("Идти на помощь", "Go to help"), tags: ["risk", "care"], ch: p => .5 + p.r.h / 300, yes: { t: 12, j: 10, h: -4 }, no: { h: -16 }, ys: L("Вывели всех троих. Их жёны плакали у ворот.", "You got all three out. Their wives wept at the gates."), ns: L("Второй обвал. Тебя достали через сутки.", "A second collapse. They dug you out a day later."), set: p => { p.f.collapse = true; p.f.rescuer = true; }, setNo: p => p.f.collapse = true, fx: "fire" },
    { l: L("Ждать спасателей", "Wait for the rescue team"), ch: () => 1, yes: { j: -4 }, ys: L("Спасатели успели. Но ты долго не мог спать.", "The rescuers made it. But you couldn't sleep for a long time."), set: p => p.f.collapse = true },
  ]},
  { id: "union", ic: "✊", prio: true, from: 28, to: 60, if: p => ["miner", "worker"].includes(p.job) && p.r.t >= 45 && !p.f.unionTried, t: L("Профсоюз", "The union"), q: () => L("Товарищи хотят, чтобы ты говорил за всех на переговорах с хозяевами.", "Your coworkers want you to speak for everyone in talks with the owners."), o: [
    { l: L("Возглавить профсоюз", "Lead the union"), tags: ["politics", "social"], ch: p => .35 + p.r.t / 250, yes: { t: 12, j: 8, m: 4 }, no: { m: -6, j: -4 }, ys: L("Новый договор: безопасность и прибавка для всех.", "A new contract: safety and a raise for everyone."), ns: L("Тебя перевели на худший участок.", "They moved you to the worst section."), set: p => { p.f.unionTried = true; p.f.union = true; p.f.leader = true; }, setNo: p => p.f.unionTried = true },
    { l: L("Не высовываться", "Keep your head down"), ch: () => 1, yes: { m: 2, t: -3 }, ys: L("Спокойно, но неуютно.", "Quiet, but uneasy."), set: p => p.f.unionTried = true },
  ]},

  // ===== Игры =====
  { id: "gamejam", ic: "🎮", from: 15, to: 45, if: p => (p.job === "it" || p.f.coder || p.f.math) && !p.f.jamTried, t: L("Геймджем", "The game jam"), q: () => L("Выходные, 48 часов, одна тема: «случайность».", "A weekend, 48 hours, one theme: \"chance\"."), o: [
    { l: L("Сделать игру про лотерею жизни", "Make a game about the lottery of life"), tags: ["art", "study"], ch: () => .6, yes: { k: 6, j: 10, t: 4 }, no: { j: -2 }, ys: L("Странное чувство: будто ты уже в такой играешь.", "A strange feeling, like you're already inside one."), ns: L("Не успели собрать билд.", "The build didn't compile in time."), set: p => { p.f.jamTried = true; p.f.jam = true; }, setNo: p => p.f.jamTried = true },
    { l: L("Выспаться", "Get some sleep"), tags: ["rest"], ch: () => 1, yes: { h: 2, j: 2 }, ys: L("Игры подождут.", "Games can wait."), set: p => p.f.jamTried = true },
  ]},
  { id: "studio", ic: "🕹", prio: true, from: 20, to: 55, if: p => p.f.jam && !p.f.studioTried, t: L("Своя студия", "Your own studio"), q: () => L("Друзья с геймджема предлагают делать игру всерьёз.", "Your game-jam friends want to make a real game."), o: [
    { l: L("Рискнуть", "Take the leap"), tags: ["business", "risk"], ch: p => .3 + p.r.k / 300 + .1 * p.c.d, yes: { m: 8, j: 10, k: 6 }, no: { m: -12, j: -6 }, ys: L("Три года, двести тысяч копий и отзыв «очень положительные».", "Three years, two hundred thousand copies, and \"Very Positive\" reviews."), ns: L("Издатель передумал. Деньги кончились.", "The publisher backed out. The money ran out."), set: p => { p.f.studioTried = true; p.f.game = true; setJob(p, "gamedev"); }, setNo: p => p.f.studioTried = true, fx: "star" },
    { l: L("Остаться в офисе", "Keep the day job"), ch: () => 1, yes: { m: 4 }, ys: L("Игры по вечерам, для себя.", "Games in the evenings, just for you."), set: p => p.f.studioTried = true },
  ]},
  { id: "crunch", ic: "☕", from: 22, to: 60, if: p => p.job === "gamedev" && !p.f.crunch, t: L("Кранч", "Crunch"), q: () => L("До релиза месяц. Все работают по 14 часов.", "A month to launch. Everyone's working 14-hour days."), o: [
    { l: L("Отпустить команду домой", "Send the team home"), tags: ["social"], ch: () => .6, yes: { t: 10, j: 6 }, no: { m: -8 }, ys: L("Релиз перенесли, но никто не уволился.", "The launch slipped, but nobody quit."), ns: L("Релиз провалился.", "The launch flopped."), set: p => p.f.crunch = true, setNo: p => p.f.crunch = true },
    { l: L("Дожать", "Push through"), tags: ["work"], ch: () => .7, yes: { m: 10, h: -6, t: -4 }, no: { h: -8, j: -6 }, ys: L("Успели. Ты спал под столом.", "You made it. You slept under the desk."), ns: L("И сроки сорвали, и здоровье.", "Missed the date and your health with it."), set: p => p.f.crunch = true, setNo: p => p.f.crunch = true },
  ]},

  // ===== Право =====
  { id: "bigcase", ic: "⚖", prio: true, from: 26, to: 62, if: p => p.job === "lawyer" && !p.f.caseTried, t: L("Громкое дело", "The big case"), q: () => L("Семья из бедного района судится с огромной компанией. Платить им нечем.", "A family from a poor district is suing a huge company. They can't pay you."), o: [
    { l: L("Взяться бесплатно", "Take it pro bono"), tags: ["social", "risk"], ch: p => .3 + p.r.k / 250, yes: { t: 10, j: 12, k: 4 }, no: { m: -6, j: -6 }, ys: L("Выиграли. О деле написали все газеты.", "You won. Every paper wrote about it."), ns: L("Проиграли. Но семья обняла тебя у дверей суда.", "You lost. The family hugged you outside the courthouse."), set: p => { p.f.caseTried = true; p.f.bigCase = true; }, setNo: p => p.f.caseTried = true },
    { l: L("Защищать компанию", "Represent the company"), tags: ["business"], ch: () => .8, yes: { m: 16, j: -4 }, no: { m: 4 }, ys: L("Гонорар как за три года.", "A fee worth three years' pay."), ns: L("Компания нашла юриста подороже.", "They found a pricier lawyer."), set: p => p.f.caseTried = true, setNo: p => p.f.caseTried = true },
  ]},
  { id: "judge", ic: "🔨", prio: true, from: 40, to: 70, if: p => p.job === "lawyer" && p.jobLvl >= 2 && p.r.k >= 60 && !p.f.judgeTried, t: L("Мантия", "The robe"), q: () => L("Тебя выдвигают в судьи.", "You've been nominated to the bench."), o: [
    { l: L("Согласиться", "Accept"), tags: ["work", "politics"], ch: p => .35 + p.r.t / 300 + .2 * p.c.d, yes: { m: 8, k: 6, j: 6 }, no: { j: -4 }, ys: L("Каждое решение ты пишешь так, будто его прочтут внуки.", "You write every ruling as if your grandchildren will read it."), ns: L("Кандидатуру отклонили.", "The nomination was rejected."), set: p => { p.f.judgeTried = true; p.f.judge = true; }, setNo: p => p.f.judgeTried = true },
    { l: L("Остаться адвокатом", "Stay an advocate"), ch: () => 1, yes: { m: 4 }, ys: L("Защищать интереснее, чем судить.", "Defending is more interesting than judging."), set: p => p.f.judgeTried = true },
  ]},

  // ===== Инженерия =====
  { id: "megaproject", ic: "🏗", prio: true, from: 30, to: 62, if: p => p.job === "engineer" && !p.f.megaTried, t: L("Большая стройка", "The megaproject"), q: () => L("Нужен главный инженер на строительство электростанции.", "A power plant needs a chief engineer."), o: [
    { l: L("Ехать на стройку", "Go to the site"), tags: ["work", "move"], ch: p => .4 + p.r.k / 300, yes: { m: 14, k: 8, t: -4 }, no: { m: -4, j: -4 }, ys: L("Когда включили ток, загорелся свет в трёх городах.", "When they switched it on, lights came on in three towns."), ns: L("Стройку остановили на полпути.", "The project stopped halfway."), set: p => { p.f.megaTried = true; p.f.megaproject = true; }, setNo: p => p.f.megaTried = true, fx: "star" },
    { l: L("Остаться в городе", "Stay in town"), ch: () => 1, yes: { t: 3 }, ys: L("Семья рядом.", "Family nearby."), set: p => p.f.megaTried = true },
  ]},
  { id: "invention", ic: "💡", from: 25, to: 70, if: p => (p.job === "engineer" || p.job === "master") && p.r.k >= 50 && !p.f.inventTried, t: L("Изобретение", "The invention"), q: () => L("В гараже ты придумал насос, который работает от солнца.", "In your garage you've built a pump that runs on sunlight."), o: [
    { l: L("Запатентовать", "Patent it"), tags: ["study", "business"], ch: () => .4, yes: { m: 14, k: 6, j: 8 }, no: { m: -6 }, ys: L("Насосы поливают поля в двенадцати странах.", "Your pumps water fields in twelve countries."), ns: L("Патент оказался занят.", "Someone already held the patent."), set: p => { p.f.inventTried = true; p.f.invention = true; }, setNo: p => p.f.inventTried = true, fx: "science" },
    { l: L("Раздать чертежи бесплатно", "Give the plans away"), tags: ["social"], ch: () => 1, yes: { t: 8, j: 8 }, ys: L("Чертежи разошлись по деревням всего континента.", "The plans spread to villages across the continent."), set: p => { p.f.inventTried = true; p.f.invention = true; p.f.philanthropy = true; } },
  ]},

  // ===== Медсёстры =====
  { id: "midwife", ic: "🍼", from: 22, to: 60, if: p => p.job === "nurse" && !p.f.midwifeTried, t: L("Родильное отделение", "The maternity ward"), q: () => L("В роддоме не хватает рук. Перейти туда?", "The maternity ward is short-staffed. Move there?"), o: [
    { l: L("Перейти", "Make the move"), tags: ["care"], ch: () => .9, yes: { j: 10, t: 6 }, no: { j: -2 }, ys: L("За годы через твои руки прошли тысячи новых людей.", "Over the years, thousands of new people passed through your hands."), ns: L("Ночные смены оказались не по силам.", "The night shifts were too much."), set: p => { p.f.midwifeTried = true; p.f.midwife = true; }, setNo: p => p.f.midwifeTried = true, fx: "baby" },
    { l: L("Остаться в своём отделении", "Stay on your ward"), ch: () => 1, yes: { t: 2 }, ys: L("Пациенты тебя ждут.", "Your patients are waiting."), set: p => p.f.midwifeTried = true },
  ]},
  { id: "headnurse", ic: "🩺", prio: true, from: 35, to: 62, if: p => p.job === "nurse" && p.age >= 35 && !p.f.headNurseTried, t: L("Старшая сестра", "Head nurse"), q: () => L("Отделению нужна старшая медсестра. Все смотрят на тебя.", "The ward needs a head nurse. Everyone is looking at you."), o: [
    { l: L("Взять отделение", "Take the ward"), tags: ["care", "work"], ch: () => .7, yes: { m: 6, t: 6, j: 4 }, no: { j: -3 }, ys: L("Молодые сёстры зовут тебя мамой.", "The young nurses call you mom."), ns: L("Назначили по знакомству.", "Someone got it through connections."), set: p => { p.f.headNurseTried = true; p.f.headNurse = true; p.jobLvl = Math.min(3, p.jobLvl + 1); }, setNo: p => p.f.headNurseTried = true },
    { l: L("Остаться у постели больных", "Stay at the bedside"), ch: () => 1, yes: { j: 3 }, ys: L("Бумаги пусть заполняют другие.", "Let others do the paperwork."), set: p => p.f.headNurseTried = true },
  ]},

  // ===== Торговля =====
  { id: "shopchain", ic: "🏪", prio: true, from: 30, to: 62, if: p => p.job === "trader" && p.r.m >= 40 && !p.f.chainTried, t: L("Вторая лавка", "A second shop"), q: () => L("Лавка приносит доход. Можно открыть вторую на другом конце города.", "The shop is profitable. You could open a second one across town."), o: [
    { l: L("Открыть сеть", "Build a chain"), tags: ["business", "risk"], ch: p => .35 + p.r.m / 300 + p.r.k / 400, yes: { m: 16, j: 6 }, no: { m: -12, j: -4 }, ys: L("Пять лавок с твоей вывеской.", "Five shops under your sign."), ns: L("Вторую пришлось закрыть.", "You had to close the second one."), set: p => { p.f.chainTried = true; p.f.shopChain = true; p.f.biz = Math.max(p.f.biz || 1, 2); }, setNo: p => p.f.chainTried = true, fx: "money" },
    { l: L("Одной хватит", "One is enough"), ch: () => 1, yes: { t: 3, j: 2 }, ys: L("Знаешь каждого покупателя по имени.", "You know every customer by name."), set: p => p.f.chainTried = true },
  ]},

  // ===== Космос =====
  { id: "cosmos", ic: "🛰", from: 27, to: 45, if: p => ["pilot", "engineer", "scientist", "doctor", "officer"].includes(p.job) && p.r.k >= 70 && p.r.h >= 65 && p.c.d > .45 && !p.f.cosmosTried, t: L("Отбор", "The selection"), q: () => L("Космическое агентство набирает новый отряд. Тысячи заявок на шесть мест.", "The space agency is picking a new crew. Thousands of applications for six seats."), o: [
    { l: L("Подать заявку", "Apply"), tags: ["study", "risk"], ch: p => .08 + p.r.k / 700 + p.r.h / 900, yes: { k: 10, j: 12 }, no: { j: -3 }, ys: L("Тебя взяли. Центрифуга, бассейн и три языка.", "You're in. Centrifuge, pool training and three languages."), ns: L("Не прошёл последний этап. Это уже честь.", "You didn't pass the last round. Still an honor."), set: p => { p.f.cosmosTried = true; p.f.cosmonaut = true; setJob(p, "astronaut"); }, setNo: p => p.f.cosmosTried = true, fx: "rocket" },
    { l: L("Смотреть на звёзды с земли", "Watch the stars from the ground"), ch: () => 1, yes: { j: 2 }, ys: L("Отсюда они тоже красивые.", "They're beautiful from here too."), set: p => p.f.cosmosTried = true },
  ]},
  { id: "launch", ic: "🚀", prio: true, from: 30, to: 55, if: p => p.f.cosmonaut && !p.f.launchTried, t: L("Старт", "Launch"), q: () => L("Через десять минут старт. Семья смотрит с трибуны.", "Ten minutes to launch. Your family is watching from the stands."), o: [
    { l: L("Ключ на старт", "Ignition"), tags: ["risk"], ch: () => .93, yes: { j: 20, k: 10, m: 10 }, no: { h: -20, j: -10 }, ys: L("Шесть месяцев на орбите. Ты видел свою страну целиком.", "Six months in orbit. You saw your whole country at once."), ns: L("Авария на старте. Капсула спасла экипаж.", "A launch abort. The capsule saved the crew."), set: p => { p.f.launchTried = true; p.f.space = true; p.f.famous = true; }, setNo: p => p.f.launchTried = true, fx: "rocket" },
  ]},
  { id: "spacewalk", ic: "👨‍🚀", prio: true, from: 30, to: 60, if: p => p.f.space && !p.f.walkTried, t: L("Выход в открытый космос", "The spacewalk"), q: () => L("Нужно починить антенну снаружи станции.", "An antenna outside the station needs fixing."), o: [
    { l: L("Выйти", "Go outside"), tags: ["risk"], ch: () => .85, yes: { j: 14, k: 6 }, no: { h: -8 }, ys: L("Под ногами Земля. Ты молчал целую минуту в эфире.", "Earth beneath your boots. You were silent on the radio for a full minute."), ns: L("Порвалась перчатка. Вернулись вовремя.", "A glove tore. You got back in time."), set: p => { p.f.walkTried = true; p.f.spacewalk = true; }, setNo: p => p.f.walkTried = true, fx: "rocket" },
  ]},
  { id: "earthtalk", ic: "🌍", from: 40, to: 85, if: p => p.f.space && !p.f.earthTalk, t: L("Рассказ о Земле", "Talking about Earth"), q: () => L("Школы по всей стране зовут тебя рассказать, как выглядит Земля сверху.", "Schools across the country want to hear what Earth looks like from above."), o: [
    { l: L("Объехать сто школ", "Visit a hundred schools"), tags: ["social"], ch: () => 1, yes: { t: 10, j: 10, h: -2 }, ys: L("Каждый раз ты говорил одно: границ сверху не видно.", "Every time you said the same thing: you can't see borders from up there."), set: p => { p.f.earthTalk = true; p.f.mentor = true; } },
    { l: L("Написать книгу", "Write a book"), tags: ["art"], ch: () => .7, yes: { j: 8, m: 6 }, no: { j: 2 }, ys: L("Книга про голубую точку стала бестселлером.", "Your book about the blue dot became a bestseller."), ns: L("Издали маленьким тиражом.", "A small print run."), set: p => { p.f.earthTalk = true; p.f.book = true; }, setNo: p => p.f.earthTalk = true },
  ]},
);
})();
