// Места: сцены, которые бывают только в определённых частях мира. Рынки Западной Африки, чайные Китая,
// рамадан, фестивали красок, сибирские морозы, ранчо, острова Тихого океана. И события, привязанные к месту.
// Тексты на двух языках: L("по-русски", "in English"). Подключается после content-everyday.js.
(() => {
const L = window.tr;
const reg = (...r) => p => r.includes(p.c.reg);
const ctry = (...n) => p => n.includes(p.c.n);
const part = x => p => p.c.part === x;
const and = (...f) => p => f.every(x => x(p));
const poorC = p => p.c.d < .4;
const richC = p => p.c.d > .7;
const AFR = p => p.c.part === "Африка";
const MUSLIM = ["Египет", "Судан", "Йемен", "Ирак", "Алжир", "Марокко", "Саудовская Аравия", "Сирия", "Иордания", "Мавритания", "Тунис", "Палестина", "Ливия", "ОАЭ", "Ливан", "Оман", "Кувейт", "Катар", "Коморы", "Бахрейн", "Пакистан", "Бангладеш", "Индонезия", "Малайзия", "Афганистан", "Иран", "Турция", "Узбекистан", "Казахстан", "Таджикистан", "Туркменистан", "Кыргызстан", "Азербайджан", "Сенегал", "Мали", "Нигер", "Сомали", "Джибути", "Гвинея", "Гамбия", "Чад", "Мальдивы", "Албания", "Косово"];
const muslim = p => MUSLIM.includes(p.c.n);
const CN = reg("cn"), JP = reg("jp"), KR = ctry("Южная Корея"), SA = reg("in", "pk", "bd", "np", "lk"), SEA = reg("id", "ph", "vn", "th", "kh", "mm");
const LATAM = reg("la", "br"), USCAN = ctry("США", "Канада"), CIS = reg("ru", "ua", "tk", "ge", "am"), PAC = reg("pac");
const NORD = reg("no", "fi"), MED = reg("it", "es", "gr", "pt", "fr");

window.CARDS.push(
  // ===== Африка =====
  { id: "market_waf", ic: "🧺", from: 10, to: 70, repeat: 20, if: and(AFR, poorC), t: L("Базарный день", "Market day"), q: () => L("Рынок шумит с рассвета. Тётя просит помочь с прилавком.", "The market's been buzzing since dawn. Your aunt asks for help at her stall."), o: [
    { l: L("Зазывать покупателей", "Call out to buyers"), tags: ["business", "social"], ch: () => .8, yes: { m: 5, t: 4 }, no: { m: 1 }, ys: L("Продали все манго к полудню.", "Sold all the mangoes by noon."), ns: L("Конкурентка через ряд пела громче.", "The rival two rows over sang louder.") },
    { l: L("Торговаться за ткань для себя", "Haggle for fabric for yourself"), tags: ["social"], ch: () => .6, yes: { j: 6, m: -2 }, no: { m: -3 }, ys: L("Лучший отрез на рынке за полцены.", "The best cloth on the market at half price."), ns: L("Переплатил вдвое. Продавец улыбался.", "Paid double. The seller smiled.") },
  ]},
  { id: "water_afr", ic: "💧", from: 5, to: 40, if: and(AFR, p => p.c.d < .25), w: 1.2, t: L("Колодец", "The well"), q: () => L("До колодца два часа пешком. Каждый день.", "The well is a two-hour walk. Every day."), o: [
    { l: L("Ходить на рассвете, пока прохладно", "Go at dawn while it's cool"), tags: ["work", "health"], ch: () => 1, yes: { h: 2, t: 3, k: -2 }, ys: L("По дороге вы с сёстрами поёте.", "You and your sisters sing on the way.") },
    { l: L("Собрать деревню на новый колодец", "Rally the village for a new well"), tags: ["social", "politics"], ch: () => .35, yes: { t: 10, h: 6, j: 8 }, no: { j: -3 }, ys: L("Через год вода пошла прямо в деревне.", "A year later, water flowed right in the village."), ns: L("Денег не собрали.", "Not enough money was raised."), set: p => p.f.well = true },
  ]},
  { id: "football_afr", ic: "⚽", from: 6, to: 22, if: p => AFR(p) || LATAM(p), w: .9, t: L("Мяч из пакетов", "A ball of plastic bags"), q: () => L("Мяч из пакетов и верёвки. Ворота из двух камней.", "A ball made of plastic bags and string. Goalposts of two rocks."), o: [
    { l: L("Играть до темноты", "Play till dark"), tags: ["sport", "social"], ch: () => 1, yes: { h: 4, t: 5, j: 6 }, ys: L("Скаут из города смотрел с обочины.", "A scout from the city watched from the roadside."), set: p => p.f.streetBall = true },
    { l: L("Сделать настоящий мяч для всех", "Make a proper ball for everyone"), tags: ["work", "social"], ch: () => .6, yes: { t: 8, j: 4 }, no: { j: 1 }, ys: L("Мяч прожил целый сезон.", "The ball lasted a whole season."), ns: L("Лопнул в первый день.", "It burst on day one.") },
  ]},
  { id: "drought_cattle", ic: "🐂", heavy: true, from: 15, to: 70, if: p => inC(p, DROUGHT), w: .8, t: L("Стадо", "The herd"), q: () => L("Третий год без дождей. Коровы худеют.", "The third year without rain. The cattle are wasting away."), o: [
    { l: L("Гнать стадо на юг", "Drive the herd south"), tags: ["risk", "move"], ch: () => .55, yes: { m: 6, j: 4 }, no: { m: -10, h: -4 }, ys: L("Нашли зелёную долину.", "You found a green valley."), ns: L("Половина стада не дошла.", "Half the herd didn't make it.") },
    { l: L("Продать, пока есть цена", "Sell while there's a price"), tags: ["business"], ch: () => 1, yes: { m: 4, j: -4 }, ys: L("Грустно, но семья сыта.", "Sad, but the family eats.") },
  ]},
  { id: "mobile_afr", ic: "📲", from: 18, to: 65, if: and(reg("ea", "waf", "ng", "gh", "za", "lus"), p => p.c.d < .5), w: .6, t: L("Перевод на телефон", "Money by text"), q: () => L("Родственник в городе может присылать деньги прямо на телефон.", "A relative in the city can send money straight to your phone."), o: [
    { l: L("Открыть счёт", "Open an account"), tags: ["business"], ch: () => .9, yes: { m: 5, k: 2 }, no: { m: -2 }, ys: L("Больше не нужно ехать за деньгами в город.", "No more trips to town to collect cash."), ns: L("Связь пропадает каждый день.", "The signal drops every day.") },
    { l: L("Наличные надёжнее", "Cash is safer"), ch: () => 1, yes: {}, ys: L("Под матрасом как-то спокойнее.", "Under the mattress feels safer.") },
  ]},

  // ===== Ближний Восток и мусульманский мир =====
  { id: "ramadan", ic: "🌙", from: 10, to: 95, repeat: 20, if: muslim, t: L("Рамадан", "Ramadan"), q: () => L("Месяц поста. Вечером вся улица садится за общий стол.", "The month of fasting. In the evening the whole street shares one table."), o: [
    { l: L("Готовить ифтар для соседей", "Cook iftar for the neighbors"), tags: ["social", "care"], ch: () => 1, yes: { t: 8, j: 6, m: -3 }, ys: L("Финики, суп и сорок человек за столом.", "Dates, soup and forty people at the table.") },
    { l: L("Встречать рассвет с семьёй", "Share the pre-dawn meal with family"), tags: ["social"], ch: () => 1, yes: { t: 6, j: 4 }, ys: L("Чай в темноте и тихие разговоры.", "Tea in the dark and quiet talk.") },
  ]},
  { id: "eid", ic: "🎁", from: 5, to: 14, if: muslim, w: 1, t: L("Праздник", "The holiday"), q: () => L("Праздник окончания поста. Новая одежда и подарки от всех родственников.", "The feast at the end of the fast. New clothes and gifts from every relative."), o: [
    { l: L("Обойти всех родственников", "Visit every relative"), tags: ["social"], ch: () => 1, yes: { t: 6, j: 8, m: 2 }, ys: L("Карманы полны монет и сладостей.", "Pockets full of coins and sweets.") },
    { l: L("Поделиться с бедными детьми", "Share with poorer kids"), tags: ["care"], ch: () => 1, yes: { t: 6, j: 6 }, ys: L("Папа сказал, что гордится тобой.", "Dad said he was proud of you."), set: p => p.f.honest = true },
  ]},
  { id: "desert", ic: "🏜", from: 12, to: 70, if: ctry("Саудовская Аравия", "ОАЭ", "Оман", "Иордания", "Египет", "Марокко", "Алжир", "Ливия", "Мавритания", "Мали", "Нигер", "Чад", "Монголия"), w: .7, t: L("Пустыня", "The desert"), q: () => L("Дядя зовёт на ночь в пустыню, как ходили предки.", "Your uncle invites you to spend a night in the desert, the way your ancestors did."), o: [
    { l: L("Ехать", "Go"), tags: ["rest", "risk"], ch: () => .9, yes: { j: 10, t: 4, k: 2 }, no: { h: -2, j: 2 }, ys: L("Столько звёзд ты не видел никогда.", "You've never seen so many stars."), ns: L("Песчаная буря. Но было что вспомнить.", "A sandstorm. But what a story."), set: p => p.f.desertNight = true },
    { l: L("Жарко. Лучше кондиционер", "Too hot. Air conditioning, please"), ch: () => 1, yes: { h: 1 }, ys: L("Пустыня никуда не денется.", "The desert isn't going anywhere.") },
  ]},
  { id: "oil_gulf", ic: "🛢", from: 22, to: 60, if: ctry("Саудовская Аравия", "ОАЭ", "Кувейт", "Катар", "Оман", "Бахрейн"), w: .6, t: L("Стеклянная башня", "The glass tower"), q: () => L("Город растёт так быстро, что карта устаревает за год.", "The city grows so fast that maps are out of date within a year."), o: [
    { l: L("Вложиться в квартиру в новой башне", "Invest in a flat in the new tower"), tags: ["business", "risk"], ch: () => .6, yes: { m: 12, j: 4 }, no: { m: -10 }, ys: L("Цена выросла вдвое.", "The price doubled."), ns: L("Башню так и не достроили.", "The tower was never finished.") },
    { l: L("Купить кусок земли у моря", "Buy land by the sea"), tags: ["business"], ch: () => .7, yes: { m: 8, j: 4 }, no: { m: -4 }, ys: L("Внуки скажут спасибо.", "Your grandchildren will thank you."), ns: L("Документы оказались поддельными.", "The papers were fake.") },
  ]},
  { id: "bazaar_iran", ic: "🫖", from: 15, to: 85, if: p => ["fa", "tr", "tk", "af"].includes(p.c.reg), w: .7, repeat: 20, t: L("Чайхана", "The teahouse"), q: () => L("Старики в чайхане спорят о поэзии.", "Old men in the teahouse are arguing about poetry."), o: [
    { l: L("Прочитать стихи наизусть", "Recite a poem from memory"), tags: ["art", "social"], ch: () => .6, yes: { t: 6, j: 6, k: 2 }, no: { j: -2 }, ys: L("Старики притихли, а потом налили тебе чай.", "The old men fell quiet, then poured you tea."), ns: L("Перепутал строки. Поправили хором.", "You mixed up the lines. They corrected you in chorus.") },
    { l: L("Сыграть в нарды", "Play backgammon"), tags: ["social", "risk"], ch: () => .5, yes: { j: 6, m: 1 }, no: { j: -1 }, ys: L("Обыграл чемпиона квартала.", "You beat the neighborhood champion."), ns: L("Проиграл и заплатил за весь чай.", "Lost and paid for everyone's tea.") },
  ]},

  // ===== Южная Азия =====
  { id: "holi", ic: "🎨", from: 5, to: 80, repeat: 15, if: reg("in", "np"), t: L("Холи", "Holi"), q: () => L("Праздник красок. Весь город в цветном порошке.", "The festival of colors. The whole city is covered in powder."), o: [
    { l: L("Броситься в толпу", "Dive into the crowd"), tags: ["social"], ch: () => 1, yes: { j: 10, t: 6 }, ys: L("Ты розовый ещё три дня.", "You stay pink for three days.") },
    { l: L("Смотреть с крыши", "Watch from the roof"), ch: () => 1, yes: { j: 4 }, ys: L("Сверху город похож на радугу.", "From above, the city looks like a rainbow.") },
  ]},
  { id: "cricket", ic: "🏏", from: 7, to: 40, if: p => SA(p) || ctry("Великобритания", "Австралия", "Новая Зеландия", "Ямайка", "Тринидад и Тобаго", "ЮАР", "Зимбабве")(p), w: .8, t: L("Крикет", "Cricket"), q: () => L("Матч на пустыре. Не хватает одного игрока.", "A match on the vacant lot. They're one player short."), o: [
    { l: L("Встать с битой", "Take the bat"), tags: ["sport", "risk"], ch: p => .4 + p.r.h / 250, yes: { j: 8, t: 5, h: 2 }, no: { j: -2 }, ys: L("Шесть очков! Мяч улетел в окно шестого этажа.", "A six! The ball flew into a sixth-floor window."), ns: L("Выбит первым мячом.", "Out on the first ball.") },
    { l: L("Судить", "Umpire"), tags: ["social"], ch: () => 1, yes: { t: 3, k: 1 }, ys: L("Обе команды недовольны. Значит, честно.", "Both teams are unhappy. So it was fair.") },
  ]},
  { id: "monsoonplant", ic: "🌾", from: 12, to: 70, if: p => inC(p, MONSOON) && p.c.d < .5, w: .9, t: L("Посадка риса", "Rice planting"), q: () => L("Пришли дожди. Пора сажать рис, всей деревней.", "The rains have come. Time to plant rice, the whole village together."), o: [
    { l: L("Работать в поле с рассвета", "Work the paddies from dawn"), tags: ["work", "social"], ch: () => .9, yes: { m: 5, t: 5, h: -1 }, no: { m: 1 }, ys: L("Спина болит, но поле зелёное.", "Your back aches, but the field is green."), ns: L("Дождей оказалось слишком много.", "Too much rain.") },
    { l: L("Попробовать новый сорт", "Try a new variety"), tags: ["study", "risk"], ch: () => .55, yes: { m: 10, k: 4 }, no: { m: -6 }, ys: L("Урожай вдвое больше, соседи пришли за семенами.", "Double the harvest; the neighbors came asking for seeds."), ns: L("Новый сорт не прижился.", "The new variety failed.") },
  ]},
  { id: "trainroof", ic: "🚂", from: 14, to: 40, if: reg("in", "bd", "pk"), w: .6, heavy: true, t: L("Поезд", "The train"), q: () => L("Поезд переполнен. Люди едут на крыше.", "The train is packed. People are riding on the roof."), o: [
    { l: L("Тоже на крышу", "Climb up too"), tags: ["risk"], ch: () => .8, yes: { j: 6 }, no: { h: -10 }, ys: L("Ветер, поля и весёлые попутчики.", "Wind, fields and cheerful companions."), ns: L("Ветка дерева. Больница.", "A tree branch. Hospital.") },
    { l: L("Ждать следующий", "Wait for the next one"), ch: () => 1, yes: { j: -2 }, ys: L("Шесть часов на платформе.", "Six hours on the platform.") },
  ]},

  // ===== Восточная Азия =====
  { id: "gaokao", ic: "📝", prio: true, from: 15, to: 19, if: p => CN(p) && !p.f.gaokao, t: L("Гаокао", "The gaokao"), q: () => L("Главный экзамен страны. Десять миллионов школьников в один день.", "The country's great exam. Ten million students on one day."), o: [
    { l: L("Готовиться по 14 часов", "Study 14 hours a day"), tags: ["study"], ch: p => .3 + p.r.k / 160, yes: { k: 12, j: 4, h: -3 }, no: { k: 4, j: -8, h: -3 }, ys: L("Лучший университет провинции.", "The best university in the province."), ns: L("Не хватило трёх баллов.", "Three points short."), set: p => { p.f.gaokao = true; p.f.examGood = true; }, setNo: p => p.f.gaokao = true, fx: "grad" },
    { l: L("Готовиться спокойно", "Prepare at a steady pace"), tags: ["study"], ch: p => .25 + p.r.k / 200, yes: { k: 8, j: 6 }, no: { k: 2, j: -4 }, ys: L("Хороший университет и здоровый сон.", "A good university and healthy sleep."), ns: L("Колледж в соседнем городе.", "A college in the next town."), set: p => p.f.gaokao = true, setNo: p => p.f.gaokao = true },
  ]},
  { id: "newyear_cn", ic: "🧧", from: 5, to: 95, repeat: 15, if: p => CN(p) || reg("vn")(p) || KR(p), t: L("Новый год по луне", "Lunar New Year"), q: () => L("Сотни миллионов людей едут домой к родителям.", "Hundreds of millions of people travel home to their parents."), o: [
    { l: L("Ехать домой, сколько бы ни стоило", "Go home whatever it costs"), tags: ["social"], ch: () => .85, yes: { t: 10, j: 8, m: -4 }, no: { j: -4, m: -4 }, ys: L("Пельмени, фейерверки и вопросы о свадьбе.", "Dumplings, fireworks and questions about marriage."), ns: L("Билетов не было. Видеозвонок с мамой.", "No tickets. A video call with mom.") },
    { l: L("Встретить в городе с друзьями", "Celebrate in the city with friends"), tags: ["social"], ch: () => 1, yes: { t: 4, j: 4 }, ys: L("Красные конверты пришли по телефону.", "Red envelopes arrived by phone.") },
  ]},
  { id: "salaryman", ic: "🏙", from: 22, to: 60, if: p => (JP(p) || KR(p)) && p.job && !p.retired, w: .7, t: L("Последняя электричка", "The last train"), q: () => L("Девять вечера. Начальник ещё не ушёл, значит, и ты не можешь.", "9 p.m. The boss hasn't left, so you can't either."), o: [
    { l: L("Остаться", "Stay"), tags: ["work"], ch: () => 1, yes: { m: 4, h: -3, t: -3 }, ys: L("Успел на последнюю электричку. Спал стоя.", "Caught the last train. Slept standing up.") },
    { l: L("Уйти вовремя", "Leave on time"), tags: ["rest", "risk"], ch: () => .6, yes: { j: 6, t: 4 }, no: { j: -3, m: -2 }, ys: L("Коллеги переглянулись. Через месяц ушли так же.", "Coworkers exchanged looks. A month later they did the same."), ns: L("На утренней планёрке был холодок.", "There was a chill at the morning meeting.") },
  ]},
  { id: "sakura", ic: "🌸", from: 5, to: 100, repeat: 10, if: p => JP(p) || KR(p), w: .8, t: L("Сакура", "Cherry blossoms"), q: () => L("Зацвела сакура. Неделю, не больше.", "The cherry trees are blooming. A week, no more."), o: [
    { l: L("Пикник под деревьями", "Picnic under the trees"), tags: ["social", "rest"], ch: () => 1, yes: { j: 8, t: 5 }, ys: L("Лепестки падали прямо в чай.", "Petals fell right into your tea.") },
    { l: L("Встать до рассвета и гулять одному", "Rise before dawn and walk alone"), tags: ["rest"], ch: () => 1, yes: { j: 8, h: 2 }, ys: L("Пустой парк и розовый туман.", "An empty park and pink mist.") },
  ]},
  { id: "kpop", ic: "🎤", from: 12, to: 22, if: KR, w: .6, t: L("Прослушивание в агентство", "Agency audition"), q: () => L("Музыкальное агентство ищет новых стажёров.", "A music agency is looking for new trainees."), o: [
    { l: L("Пробоваться", "Audition"), tags: ["music", "art", "risk"], ch: () => .15, yes: { j: 10, k: 2 }, no: { j: -4 }, ys: L("Взяли! Семь лет тренировок впереди.", "You're in! Seven years of training ahead."), ns: L("Один из десяти тысяч. Не ты.", "One in ten thousand. Not you."), set: p => p.f.music = true },
    { l: L("Петь в караоке с друзьями", "Sing karaoke with friends"), tags: ["social"], ch: () => 1, yes: { t: 5, j: 5 }, ys: L("Король караоке-кабинки номер четыре.", "The king of karaoke booth number four.") },
  ]},
  { id: "mahjong", ic: "🀄", from: 40, to: 105, if: p => CN(p) || ctry("Сингапур", "Малайзия", "Тайвань", "Гонконг")(p), w: .7, t: L("Маджонг", "Mahjong"), q: () => L("Соседки зовут на маджонг по средам.", "The neighbors invite you to mahjong on Wednesdays."), o: [
    { l: L("Играть на мелочь", "Play for small change"), tags: ["social", "risk"], ch: () => .5, yes: { t: 6, j: 6, m: 1 }, no: { t: 4, m: -1 }, ys: L("Звон костей слышен на весь двор.", "The clatter of tiles carries across the courtyard."), ns: L("Проиграл. Но угостили пельменями.", "You lost. But they fed you dumplings.") },
    { l: L("Только смотреть и болтать", "Just watch and chat"), tags: ["social"], ch: () => 1, yes: { t: 5 }, ys: L("Все новости района первым узнаёшь ты.", "You're first to hear all the neighborhood news.") },
  ]},

  // ===== Юго-Восточная Азия и Океания =====
  { id: "scooter", ic: "🛵", from: 15, to: 60, if: SEA, w: .7, t: L("Мопед", "The scooter"), q: () => L("Вся семья ездит на одном мопеде. Пятеро.", "The whole family rides one scooter. All five of you."), o: [
    { l: L("Купить второй", "Buy a second one"), tags: ["work"], ch: () => .8, yes: { j: 6, m: -4 }, no: { m: -5 }, ys: L("Теперь вас только трое на одном.", "Now it's only three per scooter."), ns: L("Продавец подсунул краденый.", "The seller passed you a stolen one.") },
    { l: L("Как-нибудь поместимся", "We'll squeeze in"), ch: () => 1, yes: { t: 3 }, ys: L("Собака тоже едет.", "The dog rides too.") },
  ]},
  { id: "streetfood", ic: "🍜", from: 18, to: 70, if: p => SEA(p) || CN(p) || reg("in")(p), w: .6, t: L("Уличная еда", "Street food"), q: () => L("Твой суп на углу хвалят все таксисты района.", "Every taxi driver in the district praises your corner soup."), o: [
    { l: L("Поставить второй котёл", "Add a second pot"), tags: ["business"], ch: () => .7, yes: { m: 8, j: 4 }, no: { m: -3 }, ys: L("Очередь до перекрёстка.", "The line reaches the intersection."), ns: L("Полиция попросила убрать лишний стол.", "The police asked you to remove the extra table."), set: p => p.f.kitchen = true },
    { l: L("Остаться маленькими", "Stay small"), ch: () => 1, yes: { t: 4, j: 3 }, ys: L("Каждого знаешь в лицо.", "You know every face.") },
  ]},
  { id: "jeepney", ic: "🚐", from: 18, to: 60, if: reg("ph"), w: .6, t: L("Джипни", "The jeepney"), q: () => L("Друг продаёт свой джипни с маршрутом.", "A friend is selling his jeepney along with its route."), o: [
    { l: L("Купить и раскрасить", "Buy it and paint it"), tags: ["business", "art"], ch: () => .65, yes: { m: 8, j: 6 }, no: { m: -8 }, ys: L("Самый яркий джипни в Маниле.", "The brightest jeepney in Manila."), ns: L("Двигатель старше тебя.", "The engine is older than you are.") },
    { l: L("Ездить пассажиром", "Ride as a passenger"), ch: () => 1, yes: {}, ys: L("Десять песо до работы.", "Ten pesos to work.") },
  ]},
  { id: "reef", ic: "🐠", from: 10, to: 70, if: p => PAC(p) || ctry("Фиджи", "Мальдивы", "Индонезия", "Филиппины", "Австралия")(p), w: .7, t: L("Риф", "The reef"), q: () => L("Кораллы у острова начали белеть.", "The corals around the island are turning white."), o: [
    { l: L("Сажать новые кораллы", "Plant new corals"), tags: ["care", "study"], ch: () => .6, yes: { j: 8, t: 4, k: 4 }, no: { j: -2 }, ys: L("Через пять лет туда вернулись рыбы.", "Five years later, the fish came back."), ns: L("Шторм смыл саженцы.", "A storm washed the seedlings away."), set: p => p.f.reef = true },
    { l: L("Нырять, пока есть что смотреть", "Dive while there's still something to see"), tags: ["rest"], ch: () => 1, yes: { j: 6, h: 2 }, ys: L("Черепаха плыла рядом пять минут.", "A turtle swam beside you for five minutes.") },
  ]},
  { id: "islandleave", ic: "🏝", from: 18, to: 45, if: PAC, w: .7, t: L("Остров", "The island"), q: () => L("Молодёжь уезжает с острова в большие города. Ты тоже думаешь.", "Young people are leaving the island for big cities. You're thinking about it too."), o: [
    { l: L("Уехать в Австралию", "Leave for Australia"), tags: ["move", "risk"], ch: () => .4, yes: { m: 12, j: -2, k: 4 }, no: { m: -4, j: -4 }, ys: L("Работа на стройке и звонки домой по воскресеньям.", "Construction work and calls home on Sundays."), ns: L("Визу не дали.", "Visa denied."), set: p => p.f.seasonal = true },
    { l: L("Остаться с семьёй", "Stay with family"), tags: ["social"], ch: () => 1, yes: { t: 8, j: 4 }, ys: L("Остров держится на тех, кто остался.", "The island holds on through those who stay.") },
  ]},
  { id: "outback", ic: "🦘", from: 10, to: 70, if: ctry("Австралия"), w: .7, t: L("Буш", "The bush"), q: () => L("Друзья едут на неделю в глубину континента.", "Friends are driving into the outback for a week."), o: [
    { l: L("Ехать", "Go"), tags: ["risk", "rest"], ch: () => .85, yes: { j: 10, k: 3 }, no: { h: -4, j: 2 }, ys: L("Кенгуру, красная земля и тишина на сотни километров.", "Kangaroos, red earth and silence for hundreds of kilometers."), ns: L("Пробили колесо в двухстах километрах от всего.", "A flat tire two hundred kilometers from anything.") },
    { l: L("Пляж ближе", "The beach is closer"), ch: () => 1, yes: { j: 3 }, ys: L("Серфинг до заката.", "Surfing till sunset.") },
  ]},

  // ===== Америка =====
  { id: "quince", ic: "👑", from: 15, to: 15, if: p => LATAM(p) && p.sex === "f", t: L("Кинсеаньера", "Quinceañera"), q: () => L("Тебе пятнадцать. Семья готовит большой праздник.", "You're fifteen. Your family is preparing a big celebration."), o: [
    { l: L("Платье, вальс и все родственники", "The dress, the waltz and every relative"), tags: ["social"], ch: () => 1, yes: { t: 8, j: 10, m: -4 }, ys: L("Ты танцевала с отцом, и он плакал.", "You danced with your father, and he cried."), fx: "star" },
    { l: L("Попросить деньги на учёбу", "Ask for money for school instead"), tags: ["study"], ch: () => 1, yes: { k: 4, m: 6, t: -2 }, ys: L("Бабушка ворчала, но поддержала.", "Grandma grumbled, but backed you."), set: p => p.f.saver = true },
  ]},
  { id: "diadelos", ic: "💀", from: 5, to: 100, repeat: 15, if: ctry("Мексика", "Гватемала", "Боливия", "Перу", "Эквадор"), w: .8, t: L("День мёртвых", "Day of the Dead"), q: () => L("Семья строит алтарь для тех, кого уже нет.", "The family builds an altar for those who are gone."), o: [
    { l: L("Принести фото прабабушки", "Bring great-grandma's photo"), tags: ["social"], ch: () => 1, yes: { t: 6, j: 4 }, ys: L("Бархатцы, свечи и её любимый хлеб.", "Marigolds, candles and her favorite bread.") },
    { l: L("Раскрасить лицо и идти на парад", "Paint your face and join the parade"), tags: ["social", "art"], ch: () => 1, yes: { j: 8, t: 3 }, ys: L("Скелеты танцуют до утра.", "Skeletons dance till dawn.") },
  ]},
  { id: "telenovela", ic: "📺", from: 30, to: 100, if: LATAM, w: .5, t: L("Сериал", "The telenovela"), q: () => L("Весь квартал смотрит один сериал. Сегодня финал.", "The whole block watches the same soap. Tonight is the finale."), o: [
    { l: L("Смотреть у соседей всем двором", "Watch at the neighbors' with everyone"), tags: ["social"], ch: () => 1, yes: { t: 6, j: 6 }, ys: L("Двадцать человек кричали на экран.", "Twenty people yelled at the screen.") },
    { l: L("Узнать финал заранее", "Find out the ending early"), ch: () => 1, yes: { k: 1, t: -2 }, ys: L("Никому не говори.", "Don't tell anyone.") },
  ]},
  { id: "favela", ic: "🏘", from: 15, to: 50, if: p => LATAM(p) && p.q <= 2 && p.c.d > .3, w: .6, t: L("Холм", "The hill"), q: () => L("На холме, где ты вырос, открывают школу самбы для детей.", "A samba school for kids is opening on the hill where you grew up."), o: [
    { l: L("Учить детей бесплатно", "Teach the kids for free"), tags: ["social", "care"], ch: () => .85, yes: { t: 10, j: 8 }, no: { j: 2 }, ys: L("Твои ученики открывали карнавал.", "Your students opened the carnival."), set: p => p.f.mentor = true },
    { l: L("Спонсировать костюмы", "Sponsor the costumes"), if: p => p.r.m >= 30, tags: ["care"], ch: () => 1, yes: { t: 6, j: 6, m: -5 }, ys: L("Перья, блёстки и твоё имя на афише.", "Feathers, sequins and your name on the poster.") },
  ]},
  { id: "roadtrip", ic: "🛣", from: 18, to: 75, if: USCAN, w: .7, t: L("Через всю страну", "Coast to coast"), q: () => L("Можно проехать страну на машине от океана до океана.", "You could drive across the country from ocean to ocean."), o: [
    { l: L("Ехать", "Go"), tags: ["rest", "risk"], ch: () => .85, yes: { j: 10, t: 4, m: -5 }, no: { m: -6, j: 2 }, ys: L("Пять тысяч километров, сорок закусочных, одна песня на повторе.", "Five thousand kilometers, forty diners, one song on repeat."), ns: L("Сломались в пустыне.", "Broke down in the desert."), set: p => p.f.trips = (p.f.trips || 0) + 1 },
    { l: L("Самолётом быстрее", "Flying is faster"), ch: () => 1, yes: { m: -2 }, ys: L("Облака тоже красивые.", "Clouds are pretty too.") },
  ]},
  { id: "studentdebt", ic: "🎓", from: 22, to: 50, if: p => USCAN(p) && p.f.uni && !p.f.studentDebt, t: L("Студенческий долг", "Student debt"), q: () => L("Учёба закончилась. Долг остался. Большой.", "School is over. The debt isn't. It's big."), o: [
    { l: L("Платить по графику", "Pay on schedule"), tags: ["work"], ch: () => 1, yes: { m: -8, j: -2 }, ys: L("Двенадцать лет. Последний платёж ты отметил тортом.", "Twelve years. You celebrated the last payment with a cake."), set: p => p.f.studentDebt = true },
    { l: L("Работать там, где списывают долг", "Work where the debt gets forgiven"), tags: ["care", "work"], ch: () => .7, yes: { t: 4, m: -2 }, no: { m: -8 }, ys: L("Десять лет в бедном районе. Долг списали.", "Ten years in a poor district. The debt was forgiven."), ns: L("Программу закрыли.", "The program was shut down."), set: p => p.f.studentDebt = true, setNo: p => p.f.studentDebt = true },
  ]},
  { id: "ranch", ic: "🤠", from: 12, to: 70, if: p => ctry("США", "Канада", "Аргентина", "Уругвай", "Мексика", "Бразилия", "Австралия")(p) && p.c.d > .35, w: .5, t: L("Ранчо", "The ranch"), q: () => L("Дядя зовёт на лето на ранчо.", "Your uncle invites you to his ranch for the summer."), o: [
    { l: L("Скакать с пастухами", "Ride with the cowhands"), tags: ["sport", "risk"], ch: () => .75, yes: { h: 5, j: 8 }, no: { h: -4 }, ys: L("Конь по имени Гром признал тебя.", "A horse called Thunder accepted you."), ns: L("Упал с лошади в первый же день.", "You fell off the horse on day one."), set: p => p.f.horse = true },
    { l: L("Чинить заборы", "Mend fences"), tags: ["work"], ch: () => 1, yes: { m: 4, h: 2 }, ys: L("Сто столбов и загар до локтей.", "A hundred posts and a farmer's tan."), set: p => p.f.handy = true },
  ]},

  // ===== Европа =====
  { id: "interrail", ic: "🚆", from: 17, to: 30, if: and(part("Европа"), p => p.c.d > .5), w: .7, t: L("Поезда по Европе", "Interrail"), q: () => L("Один билет на месяц и все поезда континента.", "One pass for a month and every train on the continent."), o: [
    { l: L("Ехать с рюкзаком", "Go with a backpack"), tags: ["rest", "study"], ch: () => .9, yes: { j: 10, k: 6, m: -5 }, no: { j: 2, m: -5 }, ys: L("Двенадцать городов, шесть языков, одна любовь в Лиссабоне.", "Twelve cities, six languages, one romance in Lisbon."), ns: L("Забастовка железной дороги. Неделя в одном городе.", "A rail strike. A week stuck in one city."), set: p => { p.f.trips = (p.f.trips || 0) + 1; p.f.langs = Math.max(p.f.langs || 1, 2); } },
    { l: L("Летом работать", "Work over summer"), tags: ["work"], ch: () => 1, yes: { m: 5 }, ys: L("Европа никуда не денется.", "Europe isn't going anywhere.") },
  ]},
  { id: "siesta", ic: "😴", from: 20, to: 95, if: MED, w: .5, t: L("Сиеста", "Siesta"), q: () => L("Жара. Весь город закрыт с двух до пяти.", "The heat. The whole town shuts from two to five."), o: [
    { l: L("Спать, как положено", "Nap, as one should"), tags: ["rest", "health"], ch: () => 1, yes: { h: 3, j: 4 }, ys: L("Ставни, прохлада и цикады.", "Shutters, coolness and cicadas.") },
    { l: L("Работать, пока все спят", "Work while everyone sleeps"), tags: ["work"], ch: () => 1, yes: { m: 4, h: -1 }, ys: L("Тихо, как в библиотеке.", "As quiet as a library.") },
  ]},
  { id: "sauna", ic: "🧖", from: 8, to: 100, repeat: 20, if: p => NORD(p) || ctry("Россия", "Эстония", "Латвия", "Литва", "Беларусь")(p), w: .7, t: L("Баня", "The sauna"), q: () => L("Сто градусов, потом прорубь.", "A hundred degrees, then the ice hole."), o: [
    { l: L("Нырнуть в прорубь", "Jump in the ice hole"), tags: ["health", "risk"], ch: () => .9, yes: { h: 4, j: 8 }, no: { h: -3 }, ys: L("Кричал так, что слышали в соседней деревне.", "You yelled so loud the next village heard."), ns: L("Простудился.", "Caught a cold.") },
    { l: L("Сидеть и говорить о жизни", "Sit and talk about life"), tags: ["social"], ch: () => 1, yes: { t: 6, h: 2 }, ys: L("Самые честные разговоры бывают в бане.", "The most honest conversations happen in the sauna.") },
  ]},
  { id: "vineyard", ic: "🍇", from: 15, to: 90, if: ctry("Франция", "Италия", "Испания", "Португалия", "Грузия", "Молдова", "Армения", "Греция", "Венгрия", "Чили", "Аргентина", "ЮАР"), w: .6, t: L("Сбор винограда", "Grape harvest"), q: () => L("Виноград созрел. Вся семья выходит в поле.", "The grapes are ripe. The whole family heads to the vines."), o: [
    { l: L("Собирать и петь", "Pick and sing"), tags: ["work", "social"], ch: () => 1, yes: { t: 6, j: 6, m: 3 }, ys: L("Руки фиолетовые до ноября.", "Purple hands until November.") },
    { l: L("Делать своё вино", "Make your own wine"), tags: ["business", "art"], ch: () => .5, yes: { m: 6, j: 8 }, no: { m: -2 }, ys: L("Соседи просят ещё бутылку.", "The neighbors want another bottle."), ns: L("Получился уксус.", "You made vinegar.") },
  ]},
  { id: "bikecity", ic: "🚲", from: 15, to: 80, if: ctry("Нидерланды", "Дания", "Бельгия", "Германия", "Швеция"), w: .5, t: L("Город велосипедов", "City of bikes"), q: () => L("Твой третий велосипед украли. Купить четвёртый?", "Your third bike got stolen. Buy a fourth?"), o: [
    { l: L("Купить старый за копейки", "Buy an old one for pennies"), tags: ["health"], ch: () => 1, yes: { h: 4, m: -1 }, ys: L("На этот никто не позарится.", "Nobody will want this one.") },
    { l: L("Ходить пешком", "Walk"), ch: () => 1, yes: { h: 2, j: -1 }, ys: L("Медленно, но надёжно.", "Slow, but reliable.") },
  ]},

  // ===== Россия и соседи =====
  { id: "frost", ic: "🥶", from: 5, to: 95, repeat: 15, if: p => inC(p, WINTER), w: .8, t: L("Минус сорок", "Forty below"), q: () => L("Минус сорок. Машина не заводится, школу отменили.", "Forty below. The car won't start and school is cancelled."), o: [
    { l: L("Чай, плед и книга", "Tea, a blanket and a book"), tags: ["rest"], ch: () => 1, yes: { j: 5, k: 3 }, ys: L("Узоры на окне как в сказке.", "Frost patterns on the window, like a fairy tale.") },
    { l: L("Помочь соседу завести машину", "Help a neighbor start his car"), tags: ["social"], ch: () => .7, yes: { t: 6, j: 2 }, no: { h: -2 }, ys: L("Завели с третьего раза. Он теперь твой должник.", "Started on the third try. He owes you now."), ns: L("Отморозил пальцы.", "Frostbitten fingers.") },
  ]},
  { id: "newyear_ru", ic: "🎄", from: 5, to: 100, repeat: 10, if: CIS, t: L("Новый год", "New Year's Eve"), q: () => L("Тридцать первое декабря. Оливье, ёлка и бой курантов.", "December 31st. Salads, the tree and the chiming clock."), o: [
    { l: L("Вся семья за одним столом", "The whole family at one table"), tags: ["social"], ch: () => 1, yes: { t: 8, j: 6, m: -2 }, ys: L("Загадал желание и сжёг бумажку под куранты.", "You made a wish and burned the note as the clock struck."), set: p => p.f.nyWish = true },
    { l: L("Встретить с друзьями на площади", "Celebrate with friends on the square"), tags: ["social"], ch: () => .9, yes: { t: 5, j: 8 }, no: { h: -2 }, ys: L("Салют над городом и шампанское из горла.", "Fireworks over the city and champagne from the bottle."), ns: L("Замёрз и потерял шапку.", "You froze and lost your hat.") },
  ]},
  { id: "mushrooms", ic: "🍄", from: 8, to: 95, repeat: 20, if: p => CIS(p) || ctry("Польша", "Чехия", "Словакия", "Финляндия", "Литва", "Латвия", "Эстония")(p), w: .7, t: L("По грибы", "Mushroom hunting"), q: () => L("После дождя в лесу полно грибов.", "After the rain, the woods are full of mushrooms."), o: [
    { l: L("Встать в пять и идти в лес", "Get up at five and head to the woods"), tags: ["rest", "health"], ch: () => .85, yes: { j: 6, h: 3, m: 2 }, no: { j: 1 }, ys: L("Полная корзина белых.", "A basket full of porcini."), ns: L("Грибники из соседней деревни были раньше.", "The pickers from the next village got there first.") },
    { l: L("Поверить соседу, что это съедобно", "Trust a neighbor that it's edible"), tags: ["risk"], ch: () => .7, yes: { j: 4 }, no: { h: -8 }, ys: L("Вкусно.", "Delicious."), ns: L("Ночь в больнице. Сосед извинялся.", "A night in hospital. The neighbor apologized.") },
  ]},
  { id: "steppe", ic: "🐎", from: 8, to: 80, if: p => p.c.reg === "tk" || p.c.n === "Монголия", w: .7, t: L("Степь", "The steppe"), q: () => L("На празднике скачки, борьба и стрельба из лука.", "The festival has horse racing, wrestling and archery."), o: [
    { l: L("Участвовать в скачках", "Enter the horse race"), tags: ["sport", "risk"], ch: p => .35 + p.r.h / 300, yes: { j: 12, t: 6 }, no: { h: -4, j: 2 }, ys: L("Твой конь пришёл первым. Тебе подарили барана.", "Your horse came first. They gave you a sheep."), ns: L("Конь сбросил на повороте.", "The horse threw you on the turn."), set: p => p.f.horse = true },
    { l: L("Готовить плов на всех", "Cook plov for everyone"), tags: ["social"], ch: () => 1, yes: { t: 8, j: 4 }, ys: L("Казан на сто человек.", "A cauldron for a hundred people."), set: p => p.f.kitchen = true },
  ]},
  { id: "supra", ic: "🥂", from: 18, to: 95, if: ctry("Грузия", "Армения", "Азербайджан"), w: .7, repeat: 15, t: L("Застолье", "The feast"), q: () => L("Друзья выбрали тебя тамадой.", "Your friends chose you as the toastmaster."), o: [
    { l: L("Говорить тосты до утра", "Toast till morning"), tags: ["social", "art"], ch: () => .8, yes: { t: 10, j: 8, h: -2 }, no: { h: -4 }, ys: L("Тост за мам довёл всех до слёз.", "Your toast to the mothers had everyone in tears."), ns: L("К двадцатому тосту голос пропал.", "By the twentieth toast your voice was gone.") },
    { l: L("Отказаться: я лучше спою", "Decline: I'd rather sing"), tags: ["music"], ch: () => 1, yes: { t: 6, j: 6 }, ys: L("Многоголосие под звёздами.", "Polyphony under the stars.") },
  ]},
);

// ---------- События, привязанные к месту ----------
window.EVENTS.push(
  { id: "harmattan", w: p => reg("waf", "ng", "gh", "wae")(p) ? .05 : 0, e: { h: -2, j: -2 }, s: L("Харматтан: пыльный ветер из Сахары на два месяца.", "The harmattan: a dusty Saharan wind for two months."), ic: "🌫" },
  { id: "typhoon2", w: p => reg("ph", "vn", "jp")(p) || ctry("Тайвань")(p) ? .05 : 0, e: { m: -6, j: -2 }, s: L("Тайфун. Неделю без света и с мешками песка у двери.", "A typhoon. A week without power and sandbags at the door."), ic: "🌀" },
  { id: "cherry", w: p => JP(p) ? .05 : 0, e: { j: 4 }, s: L("Друзья по всему миру прислали фото сакуры из твоего города.", "Friends worldwide shared photos of cherry blossoms from your city."), ic: "🌸" },
  { id: "worldcup", w: p => p.age >= 6 && (LATAM(p) || part("Европа")(p) || AFR(p)) ? .03 : 0, e: { j: 8, t: 3 }, s: L("Сборная выиграла важный матч. Вся страна на улицах.", "The national team won a huge match. The whole country poured into the streets."), ic: "⚽" },
  { id: "carnaval2", w: p => ctry("Бразилия", "Тринидад и Тобаго", "Колумбия")(p) ? .05 : 0, e: { j: 6, t: 3, m: -2 }, s: L("Карнавал прошёл мимо твоего дома три ночи подряд.", "Carnival danced past your house three nights running."), ic: "🎭" },
  { id: "diwali", w: p => reg("in", "np", "lk")(p) ? .06 : 0, e: { j: 6, t: 4 }, s: L("Дивали: тысяча огоньков на крышах и сладости от соседей.", "Diwali: a thousand lamps on the roofs and sweets from the neighbors."), ic: "🪔" },
  { id: "hajj", rare: true, w: p => muslim(p) && p.age >= 40 && p.r.m >= 40 && !p.f.hajj ? .05 : 0, e: { j: 12, t: 6 }, s: L("Паломничество в Мекку. Миллионы людей в белом, и ты среди них.", "The pilgrimage to Mecca. Millions in white, and you among them."), ic: "🕋", act: p => { p.f.hajj = true; p.f.trips = (p.f.trips || 0) + 1; } },
  { id: "migration", rare: true, w: p => reg("ea")(p) ? .01 : 0, e: { j: 10 }, s: L("Миллион антилоп гну переходит реку прямо у твоей деревни.", "A million wildebeest cross the river right by your village."), ic: "🦓", act: p => p.f.migration = true },
  { id: "whiteNights", w: p => ctry("Россия", "Финляндия", "Норвегия", "Швеция", "Исландия")(p) ? .05 : 0, e: { j: 5 }, s: L("Белые ночи. Гулял до утра, а утро так и не наступило.", "White nights. You walked till morning, and the night never came."), ic: "🌆" },
  { id: "sandstorm", w: p => ctry("Саудовская Аравия", "ОАЭ", "Кувейт", "Ирак", "Египет", "Судан", "Чад", "Нигер", "Мали")(p) ? .05 : 0, e: { h: -2, j: -2 }, s: L("Песчаная буря закрыла солнце на два дня.", "A sandstorm blotted out the sun for two days."), ic: "🌪" },
  { id: "volcano", rare: true, w: p => ctry("Индонезия", "Филиппины", "Япония", "Италия", "Исландия", "Гватемала", "Эквадор", "Новая Зеландия")(p) ? .006 : 0, e: { j: 6, k: 4, m: -4 }, s: L("Проснулся вулкан. Ночью небо было красным, а пепел шёл как снег.", "The volcano woke. The night sky glowed red and ash fell like snow."), ic: "🌋", act: p => p.f.volcano = true },
  { id: "lunarparade", w: p => CN(p) ? .05 : 0, e: { j: 4, t: 2 }, s: L("Танец дракона прошёл по твоей улице. Дети бежали следом.", "A dragon dance came down your street. Children ran behind it."), ic: "🐉" },
  { id: "monsoonfood", w: p => inC(p, MONSOON) ? .04 : 0, e: { m: 4, j: 3 }, s: L("Дожди пришли вовремя. Рис будет.", "The rains came on time. There will be rice."), ic: "🌾" },
  { id: "election2", w: p => p.age >= 18 && p.c.d > .3 ? .03 : 0, e: { j: 2, k: 1 }, s: L("Выборы. Очередь на участке тянулась до угла.", "Election day. The line at the polling station reached the corner."), ic: "🗳" },
);
})();
