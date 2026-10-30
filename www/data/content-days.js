// Будни детства и юности: первые годы, двор, школа, каникулы, первые деньги и первые ошибки.
// Это не развилки судьбы, а маленькие сцены, из которых складывается жизнь, поэтому вес у них ниже обычного.
// Тексты на двух языках: L("по-русски", "in English"). Подключается после content-roads.js.
(() => {
const L = window.tr;
const he = (p, m, f) => p.sex === "f" ? f : m;
const sib = p => p.siblings > 0;
const rich = p => p.q >= 4 || p.c.d > .7;
const poor = p => p.q <= 2 && p.c.d < .5;
const city = p => p.c.d > .45;

window.CARDS.push(
  // ===== Первые годы (этап 0–4) =====
  { id: "firststep", ic: "👣", from: 0, to: 4, w: 2, t: L("Первые шаги", "First steps"), q: () => L("Ты держишься за край стола. До мамы три шага.", "You're holding the edge of the table. Mom is three steps away."), o: [
    { l: L("Отпустить стол", "Let go of the table"), tags: ["risk"], ch: () => .7, yes: { h: 3, j: 4 }, no: { j: -1 }, ys: L("Три шага и прямо в объятия.", "Three steps, straight into her arms."), ns: L("Шлёпнулся. Попробуешь завтра.", "You fell on your bottom. Tomorrow, then.") },
    { l: L("Ползти, так надёжнее", "Crawl: it's safer"), ch: () => 1, yes: { k: 1, j: 2 }, ys: L("Быстрее всех в доме на четвереньках.", "The fastest crawler in the house.") },
  ]},
  { id: "lullaby", ic: "🌙", from: 0, to: 4, w: 1.5, t: L("Колыбельная", "Lullaby"), q: () => L("Ты не спишь уже третью ночь подряд.", "You haven't slept for three nights in a row."), o: [
    { l: L("Слушать бабушкину песню", "Listen to grandma's song"), ch: () => 1, yes: { t: 4, j: 3 }, ys: L("Эту песню ты потом будешь петь своим детям.", "You'll sing this song to your own children one day."), set: p => p.f.lullaby = true },
    { l: L("Смотреть на звёзды в окне", "Watch the stars in the window"), ch: () => 1, yes: { k: 2, j: 3 }, ys: L("Первые звёзды в твоей жизни.", "The first stars of your life.") },
  ]},
  { id: "fever", ic: "🤒", from: 0, to: 4, w: p => 1.5 - p.c.d, t: L("Жар", "Fever"), q: () => L("Ночью у тебя поднимается температура. Родители не спят.", "At night your temperature spikes. Your parents are up all night."), o: [
    { l: L("Везти к врачу", "Take you to a doctor"), if: p => p.c.d > .25 || p.q >= 3, tags: ["health"], ch: p => .7 + .25 * p.c.d, yes: { h: 4, m: -2 }, no: { h: -6 }, ys: L("Обычная простуда. Все выдохнули.", "Just a cold. Everyone exhaled."), ns: L("Неделя в больнице.", "A week in hospital.") },
    { l: L("Лечить травами, как прабабушка", "Herbal remedies, like great-grandma"), tags: ["health"], ch: p => .55 + p.h0 / 400, yes: { h: 2, t: 2 }, no: { h: -8 }, ys: L("К утру жар спал.", "By morning the fever broke."), ns: L("Стало хуже, но обошлось.", "It got worse, then passed.") },
  ]},
  { id: "babysib", ic: "🍼", from: 0, to: 4, if: sib, w: 1.5, t: L("Новый человек", "A new person"), q: () => L("Родители принесли домой свёрток. Он кричит и занимает твою кроватку.", "Your parents bring home a bundle. It screams and takes your crib."), o: [
    { l: L("Отдать ему свою игрушку", "Give it your toy"), tags: ["social"], ch: () => 1, yes: { t: 5, j: 2 }, ys: L("Первый подарок в жизни. От тебя.", "Its first gift ever. From you.") },
    { l: L("Ревновать", "Be jealous"), ch: () => 1, yes: { j: -2, t: -1, k: 1 }, ys: L("Пришлось научиться делиться мамой.", "You had to learn to share mom.") },
  ]},
  { id: "puddle", ic: "💧", from: 0, to: 4, w: 1.2, t: L("Лужа", "The puddle"), q: () => L("После дождя во дворе самая большая лужа в мире.", "After the rain, the yard holds the biggest puddle in the world."), o: [
    { l: L("Прыгнуть в середину", "Jump right in the middle"), ch: () => 1, yes: { j: 6, h: -1 }, ys: L("Мама ругалась, но сфотографировала.", "Mom scolded you, then took a photo.") },
    { l: L("Пускать кораблики", "Float paper boats"), ch: () => 1, yes: { j: 3, k: 2 }, ys: L("Один доплыл до забора.", "One made it all the way to the fence.") },
  ]},
  { id: "grandpa", ic: "👴", from: 0, to: 4, w: 1.2, t: L("Дедушкины руки", "Grandpa's hands"), q: () => L("Дедушка берёт тебя с собой в мастерскую.", "Grandpa takes you to his workshop."), o: [
    { l: L("Держать молоток вместе", "Hold the hammer together"), ch: () => 1, yes: { k: 3, t: 3 }, ys: L("Первый гвоздь в жизни. Кривой, но твой.", "Your first nail. Crooked, but yours."), set: p => p.f.handy = true },
    { l: L("Слушать его истории", "Listen to his stories"), ch: () => 1, yes: { t: 4, k: 2 }, ys: L("Война, любовь и рыба размером с лодку.", "War, love, and a fish the size of a boat.") },
  ]},
  { id: "dark", ic: "🕯", from: 0, to: 4, w: 1, t: L("Темнота", "The dark"), q: () => L("Под кроватью точно кто-то живёт.", "Something definitely lives under the bed."), o: [
    { l: L("Звать родителей", "Call your parents"), ch: () => 1, yes: { t: 3 }, ys: L("Папа проверил. Там только носок.", "Dad checked. Only a sock.") },
    { l: L("Подружиться с монстром", "Befriend the monster"), ch: () => 1, yes: { j: 4, k: 1 }, ys: L("Монстра звали Бубу. Он боялся пылесоса.", "The monster was called Boo. It was afraid of the vacuum.") },
  ]},

  // ===== Детство (5–14) =====
  { id: "bike", ic: "🚲", from: 5, to: 12, if: p => p.c.d > .15 || p.q >= 3, t: L("Велосипед", "The bike"), q: () => L("Старший брат соседей учит тебя кататься.", "The neighbor's older kid is teaching you to ride."), o: [
    { l: L("Без рук!", "No hands!"), tags: ["risk"], ch: () => .55, yes: { j: 8, h: 2 }, no: { h: -4, j: 2 }, ys: L("Весь двор видел.", "The whole yard saw it."), ns: L("Шрам на коленке на всю жизнь.", "A knee scar for life.") },
    { l: L("Аккуратно, вдоль забора", "Carefully, along the fence"), ch: () => .9, yes: { h: 3, j: 4 }, no: { j: -1 }, ys: L("К вечеру ехал сам.", "By evening you were riding alone."), ns: L("Ещё немного боязно.", "Still a little scary.") },
  ]},
  { id: "treehouse", ic: "🌳", from: 6, to: 13, w: .8, t: L("Шалаш", "The hideout"), q: () => L("С друзьями решили построить штаб.", "You and your friends decide to build a secret base."), o: [
    { l: L("На дереве", "Up a tree"), tags: ["risk", "social"], ch: () => .7, yes: { t: 6, j: 6 }, no: { h: -4, j: 2 }, ys: L("Пароль знали только трое.", "Only three people knew the password."), ns: L("Ветка не выдержала.", "The branch gave way.") },
    { l: L("В старом сарае", "In an old shed"), tags: ["social"], ch: () => 1, yes: { t: 5, j: 4 }, ys: L("Карта сокровищ на стене.", "A treasure map on the wall.") },
  ]},
  { id: "broken", ic: "🪟", from: 6, to: 13, w: .8, t: L("Разбитое окно", "The broken window"), q: () => L("Мяч улетел прямо в окно соседа.", "The ball went straight through the neighbor's window."), o: [
    { l: L("Пойти и признаться", "Go and confess"), tags: ["social"], ch: () => .8, yes: { t: 6, k: 2 }, no: { j: -3 }, ys: L("Сосед оценил честность и вернул мяч.", "The neighbor appreciated the honesty and gave the ball back."), ns: L("Месяц без карманных денег.", "No pocket money for a month.") },
    { l: L("Бежать", "Run"), tags: ["risk"], ch: () => .5, yes: { j: 3 }, no: { t: -5, j: -3 }, ys: L("Никто не узнал. Совесть узнала.", "Nobody found out. Your conscience did."), ns: L("Сосед узнал тебя по кепке.", "The neighbor recognized your cap.") },
  ]},
  { id: "chores", ic: "🧹", from: 6, to: 13, w: .8, t: L("Обязанности", "Chores"), q: p => poor(p) ? L("Нужно носить воду и смотреть за младшими.", "You need to fetch water and watch the little ones.") : L("Родители дают тебе обязанности по дому.", "Your parents give you chores around the house."), o: [
    { l: L("Делать без напоминаний", "Do them without being asked"), tags: ["work"], ch: () => 1, yes: { t: 4, k: 1, j: -1 }, ys: L("Родители стали доверять тебе больше.", "Your parents began trusting you more.") },
    { l: L("Отлынивать", "Dodge them"), ch: () => .6, yes: { j: 4 }, no: { t: -4 }, ys: L("Как-то обошлось.", "Somehow you got away with it."), ns: L("Скандал на весь вечер.", "An evening-long row.") },
  ]},
  { id: "firstmoney", ic: "🪙", from: 7, to: 13, w: .9, t: L("Первые деньги", "First money"), q: () => L("Тётя дала тебе денег на праздник. Твои собственные!", "Your aunt gave you money for the holiday. Your very own!"), o: [
    { l: L("Копить в банке", "Save them in a jar"), tags: ["work"], ch: () => 1, yes: { m: 3, k: 1 }, ys: L("Банка тяжелеет. Ты чувствуешь себя богачом.", "The jar is getting heavy. You feel rich."), set: p => p.f.saver = true },
    { l: L("Купить сладостей на всех", "Buy sweets for everyone"), tags: ["social"], ch: () => 1, yes: { t: 5, j: 4 }, ys: L("Самый щедрый человек во дворе.", "The most generous kid on the block.") },
    { l: L("Купить книгу", "Buy a book"), tags: ["study"], ch: () => 1, yes: { k: 4, j: 2 }, ys: L("Про динозавров. Зачитана до дыр.", "About dinosaurs. Read to pieces.") },
  ]},
  { id: "stars", ic: "🔭", from: 7, to: 14, w: .7, t: L("Ночное небо", "The night sky"), q: () => L("Отец показывает тебе созвездия.", "Your father shows you the constellations."), o: [
    { l: L("Запомнить все названия", "Learn all the names"), tags: ["study"], ch: () => 1, yes: { k: 5, t: 3 }, ys: L("Орион, Кассиопея и Большая Медведица.", "Orion, Cassiopeia and the Great Bear."), set: p => p.f.stargazer = true },
    { l: L("Придумать свои", "Make up your own"), ch: () => 1, yes: { j: 5, t: 3 }, ys: L("Созвездие Кота до сих пор есть на твоём небе.", "The Cat constellation is still in your sky.") },
  ]},
  { id: "spelling", ic: "📝", from: 7, to: 12, if: p => p.f.school !== false, w: .8, t: L("Диктант", "The dictation"), q: () => L("Завтра контрольный диктант. Ты путаешь половину букв.", "There's a dictation test tomorrow. You mix up half the letters."), o: [
    { l: L("Учить весь вечер", "Study all evening"), tags: ["study"], ch: () => .75, yes: { k: 5, j: 2 }, no: { k: 2, j: -2 }, ys: L("Пятёрка! Повесили на холодильник.", "Top marks! It went on the fridge."), ns: L("Тройка. Но уже не двойка.", "A C. Not an F, at least.") },
    { l: L("Надеяться на удачу", "Hope for the best"), tags: ["risk"], ch: () => .35, yes: { j: 4 }, no: { k: -1, j: -4 }, ys: L("Слова попались лёгкие.", "The words were easy."), ns: L("Красная ручка везде.", "Red ink everywhere.") },
  ]},
  { id: "newkid", ic: "🧒", from: 6, to: 14, w: .8, t: L("Новенький", "The new kid"), q: () => L("В класс пришёл новенький. Он сидит один и молчит.", "A new kid joined the class. They sit alone and say nothing."), o: [
    { l: L("Сесть рядом", "Sit next to them"), tags: ["social"], ch: () => .9, yes: { t: 6, j: 3 }, no: { t: 1 }, ys: L("Оказалось, он умеет показывать фокусы.", "Turns out they can do magic tricks."), ns: L("Он ещё не готов дружить.", "They're not ready for friends yet.") },
    { l: L("Посмотреть, что скажут другие", "See what the others do"), ch: () => 1, yes: {}, ys: L("Через месяц он уже был своим.", "A month later he fit right in.") },
  ]},
  { id: "camp", ic: "⛺", from: 8, to: 14, if: p => p.c.d > .3 || p.q >= 4, w: .8, t: L("Поход", "The hike"), q: () => L("Класс идёт в поход с ночёвкой.", "Your class is going on an overnight hike."), o: [
    { l: L("Нести самый тяжёлый рюкзак", "Carry the heaviest pack"), tags: ["sport"], ch: () => .8, yes: { h: 4, t: 5 }, no: { h: -2 }, ys: L("Учитель назвал тебя главным по костру.", "The teacher made you head of the campfire."), ns: L("Натёр ноги в кровь.", "Blisters on both feet.") },
    { l: L("Рассказывать страшилки", "Tell ghost stories"), tags: ["social", "art"], ch: () => 1, yes: { t: 6, j: 6 }, ys: L("Никто не спал до утра.", "Nobody slept till dawn.") },
  ]},
  { id: "lie", ic: "🤥", from: 7, to: 14, w: .7, t: L("Враньё", "The lie"), q: () => L("Ты сказал родителям, что сделал уроки. Не сделал.", "You told your parents your homework was done. It wasn't."), o: [
    { l: L("Признаться утром", "Confess in the morning"), ch: () => 1, yes: { t: 3, k: 2, j: -2 }, ys: L("Мама вздохнула и помогла.", "Mom sighed and helped."), set: p => p.f.honest = true },
    { l: L("Сделать ночью под одеялом", "Do it at night under the blanket"), tags: ["study"], ch: () => .7, yes: { k: 3, h: -1 }, no: { j: -3, h: -2 }, ys: L("Фонарик сел, но успел.", "The flashlight died, but you finished."), ns: L("Уснул на третьей задаче.", "Fell asleep on problem three.") },
  ]},
  { id: "drawing", ic: "🖍", from: 5, to: 11, w: .7, t: L("Рисунок", "The drawing"), q: () => L("В школе конкурс рисунков «Мой дом».", "The school is holding a drawing contest: \"My home\"."), o: [
    { l: L("Нарисовать свой дом как есть", "Draw your home as it is"), tags: ["art"], ch: () => .5, yes: { j: 6, k: 2 }, no: { j: 1 }, ys: L("Первое место! Висел в коридоре год.", "First prize! It hung in the hallway for a year."), ns: L("Не победил, но маме понравилось.", "Didn't win, but mom loved it.") },
    { l: L("Нарисовать дворец мечты", "Draw your dream palace"), tags: ["art"], ch: () => .5, yes: { j: 6 }, no: { j: 1 }, ys: L("Учительница сказала: «Обязательно построишь».", "The teacher said, \"You'll build it one day.\""), ns: L("Слишком много башен.", "Too many towers.") },
  ]},
  { id: "fight", ic: "🥊", from: 8, to: 14, heavy: true, w: .6, t: L("Драка", "The fight"), q: () => L("После уроков старшеклассник отбирает у младшего деньги.", "After school an older kid is taking money from a younger one."), o: [
    { l: L("Вступиться", "Step in"), tags: ["risk", "social"], ch: p => .4 + p.r.h / 250, yes: { t: 8, j: 6 }, no: { h: -4, j: -2, t: 4 }, ys: L("Он отступил. Малыш ходит за тобой хвостом.", "He backed off. The little one follows you everywhere now."), ns: L("Синяк под глазом. Но малыш запомнил.", "A black eye. But the little one remembers.") },
    { l: L("Позвать учителя", "Get a teacher"), tags: ["social"], ch: () => .8, yes: { t: 3 }, no: { j: -2 }, ys: L("Учитель успел.", "The teacher made it in time."), ns: L("Учителя не нашлось.", "No teacher around.") },
  ]},
  { id: "radio", ic: "📻", from: 8, to: 14, if: p => p.f.handy || p.r.k >= 45, w: .6, t: L("Старое радио", "The old radio"), q: () => L("На чердаке валяется сломанное радио.", "There's a broken radio in the attic."), o: [
    { l: L("Разобрать и починить", "Take it apart and fix it"), tags: ["study"], ch: () => .5, yes: { k: 8, j: 6 }, no: { k: 3 }, ys: L("Заговорило! Дед не поверил.", "It talks! Grandpa couldn't believe it."), ns: L("Осталось три лишних винтика.", "Three screws left over."), set: p => p.f.handy = true },
    { l: L("Сделать из него сундук для сокровищ", "Turn it into a treasure chest"), ch: () => 1, yes: { j: 3 }, ys: L("Внутри: стёклышки, марки, зуб.", "Inside: sea glass, stamps, a tooth.") },
  ]},
  { id: "snowday", ic: "⛄", from: 5, to: 14, if: p => inC(p, WINTER) || p.c.part === "Европа", w: .8, repeat: 5, t: L("Снег", "Snow"), q: () => L("Ночью выпал снег по колено. Школу отменили!", "Knee-deep snow overnight. School is cancelled!"), o: [
    { l: L("Строить крепость", "Build a fort"), tags: ["social"], ch: () => 1, yes: { j: 7, t: 4 }, ys: L("Война снежками до темноты.", "A snowball war till dark.") },
    { l: L("Кататься с горки", "Go sledding"), tags: ["sport", "risk"], ch: () => .85, yes: { j: 8, h: 2 }, no: { h: -3, j: 3 }, ys: L("Самая быстрая горка в районе.", "The fastest hill in the district."), ns: L("Въехал в сугроб головой.", "Headfirst into a snowdrift.") },
  ]},
  { id: "rainseason", ic: "🌧", from: 5, to: 14, if: p => p.c.d < .5 && !inC(p, WINTER), w: .7, repeat: 5, t: L("Сезон дождей", "Rainy season"), q: () => L("Дороги размыло. До школы теперь три часа по грязи.", "The roads are washed out. School is now three hours away through mud."), o: [
    { l: L("Всё равно идти", "Go anyway"), tags: ["study"], ch: () => .7, yes: { k: 5, h: -2 }, no: { h: -4 }, ys: L("Учитель поставил тебя в пример.", "The teacher held you up as an example."), ns: L("Простудился на неделю.", "Caught a cold for a week.") },
    { l: L("Помогать дома", "Help at home"), tags: ["work"], ch: () => 1, yes: { t: 4, m: 1 }, ys: L("Крыша больше не течёт.", "The roof doesn't leak anymore.") },
  ]},
  { id: "comics", ic: "📚", from: 8, to: 14, w: .6, t: L("Комиксы", "Comics"), q: () => L("Друг даёт на неделю целую стопку комиксов.", "A friend lends you a whole stack of comics for a week."), o: [
    { l: L("Прочитать все за ночь", "Read them all overnight"), ch: () => 1, yes: { j: 6, k: 2, h: -1 }, ys: L("Теперь ты знаешь, кто сильнее.", "Now you know who'd win."), set: p => p.f.reader = true },
    { l: L("Нарисовать свой", "Draw your own"), tags: ["art"], ch: () => .7, yes: { j: 6, k: 3 }, no: { j: 2 }, ys: L("Супергерой по имени Ты.", "A superhero named You."), ns: L("Застрял на втором кадре.", "Stuck on the second panel."), set: p => p.f.art = true },
  ]},
  { id: "pen", ic: "✉", from: 9, to: 16, if: p => p.c.d > .2, w: .6, t: L("Друг по переписке", "Pen pal"), q: () => L("Школа нашла вам друзей по переписке в другой стране.", "The school matched you with pen pals in another country."), o: [
    { l: L("Писать каждый месяц", "Write every month"), tags: ["social", "study"], ch: () => .8, yes: { k: 5, t: 4 }, no: { j: -1 }, ys: L("Двадцать лет переписки. Потом вы встретились.", "Twenty years of letters. Then you met."), ns: L("Ответ пришёл один раз.", "One reply, then silence."), set: p => p.f.penpal = true, setNo: p => p.f.penpal = false },
    { l: L("Отправить одно письмо и забыть", "Send one letter and forget"), ch: () => 1, yes: { k: 1 }, ys: L("Марка была красивая.", "The stamp was nice.") },
  ]},
  { id: "grandma", ic: "👵", from: 5, to: 14, w: .8, t: L("Бабушка", "Grandma"), q: () => L("Бабушка учит тебя готовить своё фирменное блюдо.", "Grandma teaches you her signature dish."), o: [
    { l: L("Записать рецепт", "Write down the recipe"), tags: ["study"], ch: () => 1, yes: { k: 3, t: 4 }, ys: L("Листок в жирных пятнах будет жить у тебя всю жизнь.", "The grease-stained page will stay with you all your life."), set: p => p.f.recipe = true },
    { l: L("Запоминать на вкус", "Learn it by taste"), ch: () => 1, yes: { j: 4, t: 4 }, ys: L("«На глаз», говорит бабушка. «Как у меня».", "\"By eye,\" says grandma. \"Like mine.\""), set: p => { p.f.recipe = true; p.f.kitchen = true; } },
  ]},
  { id: "birthday", ic: "🎂", from: 5, to: 14, w: .9, repeat: 5, t: L("День рождения", "Birthday"), q: p => poor(p) ? L("Денег на праздник нет, но мама что-то придумала.", "There's no money for a party, but mom has an idea.") : L("Как отметить день рождения?", "How do you want to celebrate your birthday?"), o: [
    { l: L("Позвать весь двор", "Invite the whole street"), tags: ["social"], ch: () => .9, yes: { t: 6, j: 6 }, no: { j: -2 }, ys: L("Торт кончился за минуту.", "The cake was gone in a minute."), ns: L("Пришли не все.", "Not everyone came.") },
    { l: L("Тихо с семьёй", "Quietly with family"), ch: () => 1, yes: { t: 4, j: 3 }, ys: L("Свечи, песня и папина шутка.", "Candles, a song and dad's joke.") },
  ]},
  { id: "trick", ic: "🪄", from: 6, to: 13, w: .5, t: L("Фокус", "The magic trick"), q: () => L("Ты научился прятать монету в рукаве.", "You've learned to hide a coin up your sleeve."), o: [
    { l: L("Показать на школьном концерте", "Perform at the school concert"), tags: ["art", "risk"], ch: () => .6, yes: { j: 8, t: 4 }, no: { j: -4 }, ys: L("Зал ахнул. Ты поклонился, как настоящий.", "The hall gasped. You bowed like a pro."), ns: L("Монета покатилась по сцене.", "The coin rolled across the stage.") },
    { l: L("Дурить младших", "Fool the little kids"), ch: () => 1, yes: { j: 4 }, ys: L("Великий волшебник двора.", "The great wizard of the yard.") },
  ]},
  { id: "orchard", ic: "🍎", from: 6, to: 13, w: .6, t: L("Чужой сад", "The neighbor's orchard"), q: () => L("Яблоки в соседском саду самые вкусные. Это все знают.", "The apples in the neighbor's orchard are the best. Everyone knows that."), o: [
    { l: L("Лезть через забор", "Climb the fence"), tags: ["risk"], ch: () => .55, yes: { j: 6 }, no: { j: -3, t: -2 }, ys: L("Полная майка яблок.", "A shirt full of apples."), ns: L("Собака оказалась быстрее.", "The dog was faster.") },
    { l: L("Попросить", "Ask"), tags: ["social"], ch: () => .8, yes: { t: 4, j: 4 }, no: { j: -1 }, ys: L("Сосед дал ведро и позвал помогать на сборе.", "The neighbor gave you a bucket and asked you to help at harvest."), ns: L("Сосед был не в духе.", "The neighbor was in a bad mood.") },
  ]},

  // ===== Юность (10–24) =====
  { id: "phonejob", ic: "📱", from: 12, to: 18, if: p => p.c.d > .25, w: .7, t: L("Экран", "The screen"), q: () => L("Ты сидишь в телефоне по семь часов в день.", "You spend seven hours a day on your phone."), o: [
    { l: L("Поставить ограничение", "Set a limit"), tags: ["health"], ch: () => .6, yes: { k: 4, h: 2, j: 2 }, no: { j: -2 }, ys: L("Вспомнил, что на улице тоже интересно.", "You remembered outside is interesting too."), ns: L("Продержался два дня.", "You lasted two days.") },
    { l: L("Это моя жизнь", "This is my life"), ch: () => 1, yes: { t: 2, h: -2, k: -1 }, ys: L("Знаешь все мемы, но плохо спишь.", "You know every meme but sleep badly.") },
  ]},
  { id: "firstkiss", ic: "💋", from: 12, to: 18, w: .9, t: L("Первый поцелуй", "First kiss"), q: () => L("Школьная дискотека. Медленный танец.", "The school dance. A slow song."), o: [
    { l: L("Пригласить", "Ask them to dance"), tags: ["love", "risk"], ch: p => .45 + p.r.j / 300, yes: { j: 10, t: 4 }, no: { j: -5 }, ys: L("Ты не помнишь песню. Только этот момент.", "You don't remember the song. Just the moment."), ns: L("«Я с подругой». Ну и ладно.", "\"I'm with my friend.\" Fine, whatever.") },
    { l: L("Стоять у стены", "Hold up the wall"), ch: () => 1, yes: { k: 1 }, ys: L("Следующая дискотека будет твоей.", "Next dance will be yours.") },
  ]},
  { id: "concert", ic: "🎸", from: 13, to: 22, if: p => city(p) || p.q >= 3, w: .7, t: L("Концерт", "The concert"), q: () => L("Любимая группа приезжает в город. Билеты дорогие.", "Your favorite band is coming to town. Tickets are pricey."), o: [
    { l: L("Копить и пойти", "Save up and go"), tags: ["rest"], ch: () => .85, yes: { j: 10, t: 3, m: -3 }, no: { j: -3 }, ys: L("Сорвал голос. Лучший вечер года.", "You lost your voice. Best night of the year."), ns: L("Концерт отменили.", "The show got cancelled.") },
    { l: L("Слушать у стадиона снаружи", "Listen from outside the stadium"), tags: ["social"], ch: () => 1, yes: { j: 5, t: 3 }, ys: L("Сотня таких же на траве. Тоже концерт.", "A hundred others on the grass. Still a concert.") },
  ]},
  { id: "tattoo", ic: "🖋", from: 16, to: 30, if: p => p.c.d > .3, w: .5, t: L("Татуировка", "The tattoo"), q: () => L("Друзья идут делать одинаковые татуировки.", "Your friends are getting matching tattoos."), o: [
    { l: L("Идти со всеми", "Go with them"), tags: ["social", "risk"], ch: () => .8, yes: { t: 6, j: 4, m: -2 }, no: { j: -3 }, ys: L("Маленькая звезда на запястье.", "A small star on your wrist."), ns: L("Звезда вышла похожей на краба.", "The star came out looking like a crab."), set: p => p.f.tattoo = true, setNo: p => p.f.tattoo = true },
    { l: L("Подождать", "Wait"), ch: () => 1, yes: { m: 1 }, ys: L("Мама выдохнула.", "Mom exhaled.") },
  ]},
  { id: "allnighter", ic: "📖", from: 15, to: 24, if: p => p.f.uni || p.f.college || p.age < 19, w: .8, t: L("Сессия", "Exam week"), q: () => L("Завтра экзамен, а ты открыл учебник только сегодня.", "The exam is tomorrow, and you opened the book today."), o: [
    { l: L("Учить всю ночь", "Pull an all-nighter"), tags: ["study"], ch: () => .6, yes: { k: 6, h: -2 }, no: { k: 2, h: -3, j: -3 }, ys: L("Сдал. Не помнишь как.", "Passed. No idea how."), ns: L("Уснул на экзамене.", "Fell asleep in the exam.") },
    { l: L("Выспаться и импровизировать", "Sleep and improvise"), tags: ["risk"], ch: p => .3 + p.r.k / 250, yes: { k: 3, j: 4 }, no: { j: -4 }, ys: L("Попался единственный билет, который ты знал.", "You drew the one question you knew."), ns: L("Пересдача.", "A resit.") },
  ]},
  { id: "roommate", ic: "🛋", from: 17, to: 26, if: p => p.f.uni || p.f.college || p.f.cityMove, w: .7, t: L("Сосед по комнате", "The roommate"), q: () => L("Сосед по общежитию храпит, ест твою еду и играет на трубе.", "Your dorm roommate snores, eats your food and plays the trumpet."), o: [
    { l: L("Подружиться", "Make friends"), tags: ["social"], ch: () => .7, yes: { t: 8, j: 4 }, no: { j: -4 }, ys: L("Друг на всю жизнь. Труба осталась.", "A friend for life. The trumpet stayed."), ns: L("Терпели друг друга до диплома.", "You put up with each other till graduation.") },
    { l: L("Переехать в другую комнату", "Move to another room"), ch: () => .8, yes: { j: 4, h: 2 }, no: { j: -3 }, ys: L("Тишина бесценна.", "Silence is priceless."), ns: L("Свободных комнат нет.", "No free rooms.") },
  ]},
  { id: "firstcar", ic: "🚗", from: 18, to: 28, if: p => p.f.license && !p.f.car && p.r.m >= 25, w: .7, t: L("Первая машина", "First car"), q: () => L("Старая машина за копейки. Ржавая, но заводится.", "An old car for next to nothing. Rusty, but it starts."), o: [
    { l: L("Купить", "Buy it"), tags: ["risk"], ch: () => .6, yes: { j: 8, m: -6 }, no: { m: -8, j: -2 }, ys: L("Ты сам её перекрасил. Криво, но гордо.", "You repainted it yourself. Badly, but proudly."), ns: L("Встала через неделю. Навсегда.", "It died a week later. For good."), set: p => p.f.car = true },
    { l: L("Ездить на автобусе", "Take the bus"), ch: () => 1, yes: { m: 2 }, ys: L("Зато читаешь в дороге.", "At least you read on the way.") },
  ]},
  { id: "backpack", ic: "🎒", from: 18, to: 28, if: p => p.r.m >= 20 && p.c.d > .3, w: .6, t: L("Автостоп", "Hitchhiking"), q: () => L("Друг зовёт объехать страну автостопом.", "A friend wants to hitchhike across the country."), o: [
    { l: L("Ехать", "Go"), tags: ["risk", "rest"], ch: () => .75, yes: { j: 10, k: 4, t: 4 }, no: { m: -4, j: -2 }, ys: L("Ночёвки у незнакомцев, которые стали друзьями.", "Nights with strangers who became friends."), ns: L("Неделю простояли на одной трассе.", "Stuck on one highway for a week."), set: p => p.f.trips = (p.f.trips || 0) + 1 },
    { l: L("Работать летом", "Work through summer"), tags: ["work"], ch: () => 1, yes: { m: 5 }, ys: L("Деньги пригодятся.", "The money will come in handy.") },
  ]},
  { id: "army", ic: "🎖", from: 18, to: 20, if: p => p.sex === "m" && ["Россия", "Украина", "Беларусь", "Казахстан", "Израиль", "Южная Корея", "Турция", "Египет", "Иран", "Вьетнам", "Греция", "Финляндия", "Армения", "Азербайджан", "Узбекистан"].includes(p.c.n) && !p.f.service, t: L("Повестка", "The draft notice"), q: () => L("В почтовом ящике повестка. Год службы.", "There's a draft notice in the mailbox. A year of service."), o: [
    { l: L("Служить", "Serve"), tags: ["work"], ch: () => .85, yes: { h: 4, t: 4, k: 2 }, no: { h: -4, j: -4 }, ys: L("Друзья из казармы звонят до сих пор.", "Your barracks friends still call."), ns: L("Тяжёлый год.", "A hard year."), set: p => p.f.service = true, setNo: p => p.f.service = true },
    { l: L("Отсрочка: учёба", "Defer for studies"), if: p => p.f.uni || p.f.college, tags: ["study"], ch: () => .9, yes: { k: 3 }, no: { j: -4 }, ys: L("Учёба продолжается.", "Studies continue."), ns: L("Отсрочку не дали.", "Deferral refused."), set: p => p.f.service = true, setNo: p => p.f.service = true },
  ]},
  { id: "firstpay", ic: "💵", from: 15, to: 25, if: p => p.job && !p.f.firstPay, w: 1, t: L("Первая зарплата", "First paycheck"), q: () => L("В руках первая зарплата.", "Your first paycheck is in your hands."), o: [
    { l: L("Подарок родителям", "A gift for your parents"), tags: ["social"], ch: () => 1, yes: { t: 8, j: 4, m: -3 }, ys: L("Отец сделал вид, что не плачет.", "Dad pretended not to cry."), set: p => p.f.firstPay = true },
    { l: L("Отложить всё", "Save all of it"), tags: ["work"], ch: () => 1, yes: { m: 5 }, ys: L("Начало подушки безопасности.", "The start of a safety net."), set: p => p.f.firstPay = true },
    { l: L("Погулять с друзьями", "Celebrate with friends"), tags: ["social"], ch: () => 1, yes: { t: 4, j: 6, m: -3 }, ys: L("Счёт поделили на всех. Почти.", "You split the bill. Mostly."), set: p => p.f.firstPay = true },
  ]},
  { id: "mentor", ic: "🧑‍🏫", from: 15, to: 28, if: p => p.job || p.f.uni, w: .7, t: L("Наставник", "A mentor"), q: () => L("Опытный коллега предлагает научить тебя всему, что знает.", "An experienced colleague offers to teach you everything they know."), o: [
    { l: L("Слушать и записывать", "Listen and take notes"), tags: ["study", "work"], ch: () => 1, yes: { k: 7, t: 3 }, ys: L("Через годы ты будешь повторять его слова своим ученикам.", "Years later you'll repeat their words to your own students."), set: p => p.f.hadMentor = true },
    { l: L("Сам разберусь", "I'll figure it out myself"), tags: ["risk"], ch: () => .5, yes: { k: 5, j: 3 }, no: { k: 2, j: -3 }, ys: L("Набил шишек, но научился.", "Bruises, but you learned."), ns: L("Год ушёл на ошибки.", "A year lost to mistakes.") },
  ]},
  { id: "protest", ic: "📣", heavy: true, from: 16, to: 30, if: p => p.c.d > .2, w: .5, t: L("Площадь", "The square"), q: () => L("Тысячи людей вышли на площадь. Друзья зовут.", "Thousands are out in the square. Your friends are going."), o: [
    { l: L("Идти", "Go"), tags: ["politics", "risk"], ch: p => .5 + .3 * p.c.d, yes: { t: 6, j: 6, k: 2 }, no: { j: -6, h: -3 }, ys: L("Ты впервые почувствовал, что голос что-то значит.", "For the first time you felt your voice mattered."), ns: L("Ночь в отделении. Родители приехали за тобой.", "A night at the station. Your parents came to get you."), set: p => p.f.activist = true },
    { l: L("Смотреть новости", "Watch the news"), ch: () => 1, yes: {}, ys: L("История случилась без тебя.", "History happened without you.") },
  ]},
  { id: "volunteerabroad", ic: "🌍", from: 18, to: 28, if: p => p.c.d > .55 && p.r.m >= 30, w: .5, t: L("Волонтёром за границу", "Volunteering abroad"), q: () => L("Можно поехать на год строить школы в другой стране.", "You could spend a year building schools in another country."), o: [
    { l: L("Ехать", "Go"), tags: ["care", "move"], ch: () => .8, yes: { t: 6, k: 6, j: 6, m: -6 }, no: { m: -6, h: -3 }, ys: L("Ты увидел, как живёт большая часть мира.", "You saw how most of the world lives."), ns: L("Малярия за месяц до конца.", "Malaria a month before the end."), set: p => { p.f.trips = (p.f.trips || 0) + 1; p.f.volunteered = true; } },
    { l: L("Сначала карьера", "Career first"), tags: ["work"], ch: () => 1, yes: { m: 4 }, ys: L("Может быть, потом.", "Maybe later.") },
  ]},
  { id: "breakup", ic: "💔", from: 16, to: 30, if: p => p.partner && !p.married, w: .5, t: L("Сомнения", "Doubts"), q: p => L(`С ${p.partner.first} всё чаще молчите за ужином.`, `You and ${p.partner.first} sit through more and more silent dinners.`), o: [
    { l: L("Поговорить честно", "Talk honestly"), tags: ["love", "social"], ch: () => .6, yes: { t: 6, j: 6 }, no: { j: -6 }, ys: L("Оказалось, вы оба боялись. Теперь нет.", "Turns out you were both scared. Not anymore."), ns: L("Решили расстаться.", "You decided to split."), setNo: p => p.partner = null },
    { l: L("Ничего не делать", "Do nothing"), ch: () => .5, yes: {}, no: { j: -4 }, ys: L("Прошло само.", "It passed on its own."), ns: L("Однажды ушёл без слов.", "One day they left without a word."), setNo: p => p.partner = null },
  ]},
  { id: "cooking", ic: "🍳", from: 16, to: 25, if: p => !p.f.kitchen, w: .6, t: L("Своя кухня", "Your own kitchen"), q: () => L("Ты впервые живёшь один. Холодильник пуст.", "You're living alone for the first time. The fridge is empty."), o: [
    { l: L("Научиться готовить", "Learn to cook"), tags: ["health"], ch: () => .7, yes: { h: 4, j: 4, m: 2 }, no: { j: -2 }, ys: L("Твой суп хвалят гости.", "Guests praise your soup."), ns: L("Сжёг три кастрюли.", "You burned three pots."), set: p => p.f.kitchen = true },
    { l: L("Лапша быстрого приготовления", "Instant noodles"), ch: () => 1, yes: { m: 2, h: -3 }, ys: L("Сорок вкусов, один результат.", "Forty flavors, one result.") },
  ]},
);

// ---------- События детства и юности ----------
window.EVENTS.push(
  { id: "tooth", w: p => p.age >= 5 && p.age < 10 ? .12 : 0, e: { j: 3 }, s: L("Выпал первый зуб. Под подушкой нашлась монетка.", "Your first tooth fell out. A coin turned up under the pillow."), ic: "🦷" },
  { id: "chickenpox", w: p => p.age < 12 ? .08 : 0, e: { h: -3, j: -2 }, s: L("Ветрянка. Весь в зелёных точках.", "Chickenpox. Covered in spots."), ic: "🤒" },
  { id: "kitten2", w: p => p.age >= 5 && p.age < 15 && !p.f.cat ? .04 : 0, e: { j: 6 }, s: L("Во дворе нашёлся котёнок. Мама сказала «нет», а потом «ладно».", "You found a kitten in the yard. Mom said no, then fine."), ic: "🐈", act: p => p.f.cat = true },
  { id: "bestgrade", w: p => p.age >= 5 && p.age < 18 && p.r.k >= 40 ? .08 : 0, e: { k: 3, j: 3 }, s: L("Лучший табель в классе.", "The best report card in your class."), ic: "📜" },
  { id: "brokenarm", heavy: true, w: p => p.age >= 5 && p.age < 16 ? .04 : 0, e: { h: -4, j: -2 }, s: L("Сломал руку, упав с забора. Гипс расписали все друзья.", "Broke your arm falling off a fence. All your friends signed the cast."), ic: "🩹" },
  { id: "newsibling", w: p => p.age < 12 && p.q >= 2 ? .05 : 0, e: { t: 3 }, s: L("Родился младший брат.", "A little brother was born."), ic: "✿", act: p => p.siblings++ },
  { id: "parentsfight", w: p => p.age < 16 && !p.f.parentsSplit ? .03 : 0, e: { j: -6, t: -3 }, s: L("Родители развелись. Теперь у тебя два дома.", "Your parents divorced. Now you have two homes."), ic: "🏠", act: p => p.f.parentsSplit = true },
  { id: "moveapt", w: p => p.age < 15 && p.c.d > .3 ? .04 : 0, e: { j: -2, k: 2 }, s: L("Семья переехала в другой район. Новая школа.", "The family moved to another district. A new school."), ic: "📦" },
  { id: "snowfirst", w: p => p.age < 10 && inC(p, WINTER) && !p.f.snowFirst ? .2 : 0, e: { j: 5 }, s: L("Первый снег, который ты помнишь.", "The first snow you remember."), ic: "❄", act: p => p.f.snowFirst = true },
  { id: "seaFirst", w: p => p.age < 15 && !p.f.seaFirst && p.q >= 3 ? .05 : 0, e: { j: 8 }, s: L("Первый раз увидел море. Оно огромное.", "You saw the sea for the first time. It's enormous."), ic: "🌊", act: p => p.f.seaFirst = true },
  { id: "scholarship", w: p => p.age >= 15 && p.age < 25 && p.r.k >= 65 && !p.f.scholarship ? .08 : 0, e: { k: 4, m: 6 }, s: L("Дали стипендию за отличную учёбу.", "You won a scholarship for top grades."), ic: "🎓", act: p => p.f.scholarship = true },
  { id: "acne", w: p => p.age >= 12 && p.age < 20 ? .06 : 0, e: { j: -3 }, s: L("Прыщ на носу перед выпускным. Катастрофа.", "A pimple on your nose before prom. A disaster."), ic: "😖" },
  { id: "teamwin", w: p => p.age >= 8 && p.age < 20 && p.r.h >= 50 ? .06 : 0, e: { j: 5, t: 3 }, s: L("Школьная команда выиграла кубок города.", "The school team won the city cup."), ic: "🏆" },
  { id: "firstjobfired", w: p => p.age >= 15 && p.age < 25 && p.job ? .03 : 0, e: { j: -4, k: 2 }, s: L("Опоздал третий раз и потерял подработку. Урок усвоен.", "Late for the third time, you lost the side job. Lesson learned."), ic: "⏰" },
  { id: "eclipse", rare: true, w: () => .003, e: { j: 8, k: 3 }, s: L("Полное солнечное затмение. Птицы замолчали, днём вышли звёзды.", "A total solar eclipse. The birds went silent, and stars came out at noon."), ic: "🌑", act: p => p.f.eclipse = true },
  { id: "dolphins", rare: true, w: p => coastal(p) ? .004 : 0, e: { j: 10 }, s: L("Стая дельфинов плыла рядом с лодкой целый час.", "A pod of dolphins swam beside the boat for a whole hour."), ic: "🐬", act: p => p.f.dolphins = true },
  { id: "aurora", rare: true, w: p => inC(p, WINTER) || ["Исландия", "Норвегия", "Швеция", "Финляндия"].includes(p.c.n) ? .008 : 0, e: { j: 10 }, s: L("Северное сияние на полнеба. Зелёные волны над крышами.", "Northern lights across half the sky. Green waves over the roofs."), ic: "🌌", act: p => p.f.aurora = true },
);
function coastal(p) { return ["Океания", "Азия", "Европа"].includes(p.c.part) || ["la", "br", "waf", "ea", "us"].includes(p.c.reg); }
})();
