// Семья в нескольких поколениях, здоровье, увлечения, соседи, поздняя жизнь, региональные сцены и новые события.
(() => {
const L = window.tr;
const he = (p, m, f) => p.sex === "f" ? f : m;
const kidAge = (p, k) => p.age - k.born;
const kidOf = (p, from, to) => p.kids.find(k => kidAge(p, k) >= from && kidAge(p, k) <= to);
const kidW = k => k.sex === "f" ? L("дочь", "daughter") : L("сын", "son");
const kidHe = (k, m, f) => k.sex === "f" ? f : m;
const married = p => p.married ? p.age - (p.f.marriedAt ?? p.age) : 0;
const pt = p => p.partner ? p.partner.first : "";

window.CARDS.push(
  // ===== Любовь и брак =====
  { id: "distance", from: 18, to: 40, if: p => p.partner && !p.married && !p.f.distance, t: L("Расстояние", "Distance"), q: p => L(`${pt(p)} получает работу в другом городе.`, `${pt(p)} got a job in another city.`), o: [
    { l: L("Переехать вместе", "Move together"), tags: ["love", "move"], ch: () => .8, yes: { t: 6, j: 6, m: -4 }, no: { j: -4 }, ys: L("Новый город на двоих.", "A new city for two."), ns: L("На новом месте ссоримся чаще.", "You argue more in the new place."), set: p => p.f.distance = true },
    { l: L("Встречаться на выходных", "See each other on weekends"), tags: ["love"], ch: () => .5, yes: { j: 4, m: -4 }, no: { j: -8, t: -6 }, ys: L("Поезда и долгие звонки. Выдержали.", "Trains and long calls. You made it."), ns: L("Расстояние победило.", "The distance won."), set: p => p.f.distance = true, setNo: p => { p.f.distance = true; p.partner = null; } },
    { l: L("Отпустить", "Let go"), ch: () => 1, yes: { j: -6, k: 3 }, ys: L("Расстались друзьями.", "You parted as friends."), set: p => { p.f.distance = true; p.partner = null; } },
  ]},
  { id: "anniversary", from: 30, to: 85, repeat: 10, if: p => p.married && married(p) >= 5, t: L("Годовщина", "Anniversary"), q: p => L(`${married(p)} лет вместе с ${pt(p)}.`, `${married(p)} years with ${pt(p)}.`), o: [
    { l: L("Устроить праздник", "Throw a party"), tags: ["social", "love"], ch: () => 1, yes: { t: 6, j: 6, m: -5 }, ys: L("Танцевали под ту самую песню.", "You danced to that song.") },
    { l: L("Ужин вдвоём", "Dinner for two"), tags: ["love"], ch: () => 1, yes: { t: 4, j: 5, m: -2 }, ys: L("Как в первый раз.", "Like the very first time.") },
    { l: L("Забыть", "Forget"), ch: () => 1, yes: { t: -6, j: -4 }, ys: L("Неловкий вечер.", "An awkward evening.") },
  ]},
  { id: "golden", prio: true, from: 68, to: 109, if: p => married(p) >= 50 && !p.f.golden, t: L("Золотая свадьба", "Golden anniversary"), q: p => L(`Полвека с ${pt(p)}. Дети хотят устроить праздник.`, `Half a century with ${pt(p)}. The children want to celebrate.`), o: [
    { l: L("Собрать всех", "Gather everyone"), tags: ["social"], ch: () => 1, yes: { t: 12, j: 12 }, ys: L("Три поколения за одним столом.", "Three generations at one table."), set: p => p.f.golden = true, fx: "gold" },
    { l: L("Тихо, вдвоём", "Quietly, just the two of you"), tags: ["love"], ch: () => 1, yes: { j: 12, t: 4 }, ys: L("Те же руки, что и пятьдесят лет назад.", "The same hands as fifty years ago."), set: p => p.f.golden = true, fx: "gold" },
  ]},
  { id: "partnerill", from: 40, to: 95, if: p => p.partner && !p.f.partnerIll, w: .7, t: L("Болезнь близкого", "When they fall ill"), q: p => L(`${pt(p)} серьёзно заболевает.`, `${pt(p)} falls seriously ill.`), o: [
    { l: L("Ухаживать самому", "Care for them yourself"), tags: ["care", "love"], ch: p => .5 + .3 * p.c.d, yes: { t: 10, h: -6, j: -2 }, no: { h: -6, j: -10 }, ys: L("Вы справились вместе.", "You got through it together."), ns: L("Тяжёлые месяцы.", "Hard months."), set: p => p.f.partnerIll = true, setNo: p => p.f.partnerIll = true },
    { l: L("Лучшие врачи", "The best doctors"), if: p => p.r.m >= 40, tags: ["health"], ch: p => .45 + .45 * p.c.d, yes: { t: 6, m: -14 }, no: { m: -14, j: -8 }, ys: L("Лечение помогло.", "The treatment worked."), ns: L("Деньги не всесильны.", "Money can't do everything."), set: p => p.f.partnerIll = true, setNo: p => p.f.partnerIll = true },
  ]},
  { id: "reconcile", from: 35, to: 85, if: p => p.f.divorced && !p.f.reconciled, t: L("Бывший", "The ex"), q: () => L("Человек, с которым вы развелись, зовёт поговорить.", "The person you divorced asks to talk."), o: [
    { l: L("Остаться друзьями", "Stay friends"), tags: ["social"], ch: () => .7, yes: { t: 6, j: 6 }, no: { j: -3 }, ys: L("Старые обиды отпустили.", "Old hurts let go."), ns: L("Опять поругались.", "Another argument."), set: p => p.f.reconciled = true, setNo: p => p.f.reconciled = true },
    { l: L("Нет, это в прошлом", "No, it's the past"), ch: () => 1, yes: { j: 1 }, ys: L("Каждый своей дорогой.", "Each on their own road."), set: p => p.f.reconciled = true },
  ]},

  // ===== Дети и внуки =====
  { id: "firststeps", prio: true, from: 18, to: 60, if: p => p.kids.some(k => p.age === k.born) && !p.f.firstSteps, t: L("Бессонные ночи", "Sleepless nights"), q: p => L(`${p.kids.at(-1).first} плачет по ночам. Кто-то должен вставать.`, `${p.kids.at(-1).first} cries every night. Someone has to get up.`), o: [
    { l: L("Вставать самому", "Get up yourself"), tags: ["social"], ch: () => 1, yes: { t: 8, j: 4, h: -3 }, ys: L("Первая улыбка досталась тебе.", "The first smile was for you."), set: p => p.f.firstSteps = true },
    { l: L("Работать: деньги нужнее", "Work: money matters more now"), tags: ["work"], ch: () => 1, yes: { m: 6, t: -2 }, ys: L("Первые шаги ты увидел на видео.", "You saw the first steps on video."), set: p => p.f.firstSteps = true },
    { l: L("Позвать бабушку", "Call grandma"), if: p => p.parents.mAlive || p.parents.fAlive, tags: ["social"], ch: () => .85, yes: { t: 6, j: 3 }, no: { t: -2 }, ys: L("Бабушка переехала на полгода. Все выспались.", "Grandma moved in for six months. Everyone slept."), ns: L("Бабушке самой нужна помощь.", "Grandma needs help herself."), set: p => p.f.firstSteps = true, setNo: p => p.f.firstSteps = true },
  ]},
  { id: "teenkid", from: 28, to: 75, if: p => kidOf(p, 13, 18) && !p.f.teenKid, t: L("Подросток", "Teenager"), q: p => { const k = kidOf(p, 13, 18); return L(`${k.first} хлопает дверью и не разговаривает с тобой неделю.`, `${k.first} slams the door and hasn't spoken to you in a week.`); }, o: [
    { l: L("Поговорить по душам", "Have a heart-to-heart"), tags: ["social"], ch: p => .45 + p.r.t / 250, yes: { t: 10, j: 4 }, no: { t: -4, j: -4 }, ys: L("Выяснилось, что дело в первой любви.", "Turns out it was first love."), ns: L("Разговора не вышло.", "The talk went nowhere."), set: p => p.f.teenKid = true, setNo: p => p.f.teenKid = true },
    { l: L("Запретить телефон", "Take away the phone"), ch: () => .4, yes: { k: 2 }, no: { t: -8, j: -3 }, ys: L("Неожиданно помогло.", "Surprisingly, it worked."), ns: L("Стало только хуже.", "It only made things worse."), set: p => p.f.teenKid = true, setNo: p => p.f.teenKid = true },
    { l: L("Дать время", "Give it time"), ch: () => .7, yes: { t: 4 }, no: { t: -3 }, ys: L("Через месяц всё наладилось.", "A month later it was fine."), ns: L("Стена между вами осталась.", "A wall remained between you."), set: p => p.f.teenKid = true, setNo: p => p.f.teenKid = true },
  ]},
  { id: "kidwedding", from: 40, to: 90, if: p => kidOf(p, 21, 45) && !p.f.kidWed, t: L("Свадьба детей", "Your child's wedding"), q: p => { const k = kidOf(p, 21, 45); return L(`${k.first} женится или выходит замуж. Нужна помощь со свадьбой.`, `${k.first} is getting married and needs help with the wedding.`); }, o: [
    { l: L("Оплатить большую свадьбу", "Pay for a big wedding"), tags: ["social"], ch: () => 1, yes: { t: 10, j: 8, m: -12 }, ys: L("Ты плакал громче всех.", "You cried the loudest."), set: p => p.f.kidWed = true, fx: "love" },
    { l: L("Помочь чем можешь", "Help as you can"), tags: ["social"], ch: () => 1, yes: { t: 6, j: 6, m: -4 }, ys: L("Твой тост запомнили все.", "Everyone remembers your toast."), set: p => p.f.kidWed = true, fx: "love" },
  ]},
  { id: "kidabroad", from: 40, to: 90, if: p => kidOf(p, 18, 40) && !p.f.kidAway, t: L("Отъезд", "Leaving"), q: p => { const k = kidOf(p, 18, 40); return L(`${k.first} хочет уехать жить в другую страну.`, `${k.first} wants to move to another country.`); }, o: [
    { l: L("Благословить", "Give your blessing"), tags: ["social"], ch: () => 1, yes: { t: 4, j: -2 }, ys: p => L(`Теперь у тебя есть повод съездить в страну ${p._trip}.`, `Now you have a reason to visit ${p._trip}.`), pre: p => p._trip = pickCountry(p, c => c !== p.c && c.d > .6).name, set: p => p.f.kidAway = true },
    { l: L("Отговаривать", "Talk them out of it"), ch: () => .4, yes: { t: 2 }, no: { t: -8, j: -4 }, ys: L("Остались. Но иногда смотрят на карту.", "They stayed. But sometimes they look at the map."), ns: L("Уехали, обидевшись.", "They left, hurt."), set: p => p.f.kidAway = true, setNo: p => p.f.kidAway = true },
  ]},
  { id: "kidfollow", from: 45, to: 85, if: p => p.kids.length && p.job && !p.f.kidFollow && p.kids.some(k => kidAge(p, k) >= 16), t: L("По твоим стопам", "In your footsteps"), q: p => L(`Твой ребёнок хочет стать как ты: ${jobName(p).toLowerCase()}.`, `Your child wants to follow you: ${jobName(p).toLowerCase()}.`), o: [
    { l: L("Учить всему, что знаешь", "Teach them everything"), tags: ["social"], ch: () => 1, yes: { t: 8, j: 8 }, ys: L("Династия продолжается.", "The family trade continues."), set: p => { p.f.kidFollow = true; p.f.mentor = true; } },
    { l: L("Отговорить: пусть ищет своё", "Tell them to find their own way"), ch: () => 1, yes: { t: 2, j: 2 }, ys: L("Пусть будет лучше, чем у тебя.", "Let them have it better than you."), set: p => p.f.kidFollow = true },
  ]},
  { id: "greatgrand", from: 70, to: 109, if: p => p.f.grandkids && !p.f.greatgrand, w: 2, t: L("Правнук", "Great-grandchild"), q: () => L("Внучка звонит: у неё родился сын.", "Your granddaughter calls: she's had a baby boy."), o: [
    { l: L("Поехать знакомиться", "Go and meet him"), tags: ["social"], ch: p => .6 + p.r.h / 250, yes: { t: 12, j: 14 }, no: { j: 6 }, ys: L("Четыре поколения на одной фотографии.", "Four generations in one photo."), ns: L("Сил на дорогу нет, но фото висит над кроватью.", "No strength for the trip, but the photo hangs over your bed."), set: p => p.f.greatgrand = true, setNo: p => p.f.greatgrand = true, fx: "baby" },
    { l: L("Связать ему шапку", "Knit him a hat"), ch: () => 1, yes: { j: 10, t: 6 }, ys: L("Шапка велика, но это пока.", "The hat's too big, but not for long."), set: p => p.f.greatgrand = true, fx: "baby" },
  ]},
  { id: "dinner", from: 30, to: 90, repeat: 15, if: p => p.kids.length || p.siblings > 0, t: L("Семейный ужин", "Family dinner"), q: () => L("Давно вся семья не собиралась вместе.", "The whole family hasn't been together in ages."), o: [
    { l: L("Позвать всех", "Invite everyone"), tags: ["social"], ch: () => .85, yes: { t: 8, j: 6, m: -3 }, no: { t: -2, j: -2 }, ys: L("Спорили о политике, но разошлись довольные.", "You argued about politics but parted happy."), ns: L("Дядя опять всех перессорил.", "Your uncle started a fight again.") },
    { l: L("Позвонить каждому", "Call each one"), ch: () => 1, yes: { t: 3 }, ys: L("Хотя бы голоса.", "At least you heard their voices.") },
  ]},
  { id: "sibling", from: 25, to: 70, if: p => p.siblings > 0 && !p.f.siblingHelp, t: L("Брат", "Your brother"), q: () => L("Брат открывает мастерскую и просит войти в долю.", "Your brother is opening a workshop and asks you to go in on it."), o: [
    { l: L("Войти в долю", "Go in on it"), tags: ["business", "social"], ch: () => .55, yes: { m: 10, t: 8 }, no: { m: -10, t: -6 }, ys: L("Мастерская кормит две семьи.", "The workshop feeds two families."), ns: L("Прогорели. Отношения испортились.", "It went under. Things soured between you."), set: p => p.f.siblingHelp = true, setNo: p => p.f.siblingHelp = true },
    { l: L("Дать в долг", "Lend him money"), tags: ["social"], ch: () => .7, yes: { t: 6, m: -3 }, no: { m: -8 }, ys: L("Вернул через два года. С процентами.", "He paid it back in two years. With interest."), ns: L("Денег так и не вернул.", "He never paid it back."), set: p => p.f.siblingHelp = true, setNo: p => p.f.siblingHelp = true },
    { l: L("Отказать", "Say no"), ch: () => 1, yes: { t: -4 }, ys: L("Брат обиделся.", "Your brother was hurt."), set: p => p.f.siblingHelp = true },
  ]},

  // ===== Здоровье =====
  { id: "burnout", from: 26, to: 58, if: p => p.job && !p.retired && !p.f.burnout, t: L("Выгорание", "Burnout"), q: () => L("По утрам не хочется вставать. Работа больше не радует.", "You don't want to get up in the mornings. Work brings no joy anymore."), o: [
    { l: L("Взять длинный отпуск", "Take a long break"), tags: ["rest"], ch: () => .85, yes: { j: 10, h: 4, m: -6 }, no: { m: -6 }, ys: L("Вернулся другим человеком.", "You came back a different person."), ns: L("Отпуск прошёл, усталость осталась.", "The break ended; the tiredness didn't."), set: p => p.f.burnout = true },
    { l: L("Пойти к психологу", "See a therapist"), tags: ["health"], ch: p => .3 + .6 * p.c.d, yes: { j: 12, t: 3, m: -4 }, no: { m: -4 }, ys: L("Научился говорить «нет».", "You learned to say no."), ns: L("Хорошего специалиста не нашлось.", "Couldn't find a good one."), set: p => p.f.burnout = true },
    { l: L("Терпеть", "Push through"), ch: () => 1, yes: { j: -8, h: -5, m: 4 }, ys: L("Как-то дотянули до пятницы. И до следующей.", "You made it to Friday. And the next."), set: p => p.f.burnout = true },
  ]},
  { id: "marathon", from: 22, to: 65, if: p => p.r.h >= 55 && !p.f.marathon, t: L("Марафон", "The marathon"), q: () => L("Друзья записались на марафон. Сорок два километра.", "Friends signed up for a marathon. Forty-two kilometers."), o: [
    { l: L("Готовиться полгода", "Train for six months"), tags: ["sport", "health"], ch: p => .3 + p.r.h / 200, yes: { h: 8, j: 10 }, no: { h: -4, j: -3 }, ys: L("Финиш! Ноги не слушаются, улыбка не сходит.", "The finish line! Legs gone, smile stuck on."), ns: L("Сошёл на тридцатом километре.", "Dropped out at kilometer thirty."), set: p => p.f.marathon = true },
    { l: L("Болеть за друзей", "Cheer for your friends"), ch: () => 1, yes: { t: 4 }, ys: L("Самый громкий плакат на трассе.", "The loudest sign on the course.") },
  ]},
  { id: "back", from: 30, to: 70, if: p => !p.f.back, t: L("Спина", "Your back"), q: () => L("Спину прихватило так, что не разогнуться.", "Your back seized up so badly you can't straighten."), o: [
    { l: L("Лечебная физкультура", "Physical therapy"), tags: ["health"], ch: () => .7, yes: { h: 6 }, no: { h: -2 }, ys: L("Через месяц как новенький.", "Good as new in a month."), ns: L("Лень победила.", "Laziness won."), set: p => p.f.back = true },
    { l: L("Таблетки и диван", "Pills and the couch"), ch: () => 1, yes: { h: -3, j: -2 }, ys: L("Теперь болит иногда.", "Now it aches now and then."), set: p => p.f.back = true },
  ]},
  { id: "pressure", from: 38, to: 80, if: p => !p.f.pressure, t: L("Давление", "Blood pressure"), q: () => L("Врач хмурится, глядя на цифры давления.", "The doctor frowns at your blood pressure."), o: [
    { l: L("Сесть на диету", "Go on a diet"), tags: ["health"], ch: () => .55, yes: { h: 8, j: -2 }, no: { j: -3 }, ys: L("Минус десять килограммов.", "Ten kilos lighter."), ns: L("Сорвался на первом празднике.", "You broke it at the first party."), set: p => p.f.pressure = true },
    { l: L("Ходить пешком каждый день", "Walk every day"), tags: ["health", "sport"], ch: () => .75, yes: { h: 7, j: 3 }, no: { h: 1 }, ys: L("Десять тысяч шагов, и голова ясная.", "Ten thousand steps and a clear head."), ns: L("Погода всегда мешала.", "The weather always got in the way."), set: p => p.f.pressure = true },
    { l: L("Не обращать внимания", "Ignore it"), ch: () => 1, yes: { h: -4 }, ys: L("Само пройдёт. Наверное.", "It'll pass. Probably."), set: p => { p.f.pressure = true; p.f.ignoredBP = true; } },
  ]},
  { id: "mountain", from: 22, to: 58, if: p => p.r.h >= 55 && p.r.m >= 35 && !p.f.summitTried, t: L("Горы", "The mountains"), q: () => L("Знакомые альпинисты зовут в экспедицию на большую вершину.", "Climber friends invite you on an expedition to a great peak."), o: [
    { l: L("Идти на вершину", "Go for the summit"), tags: ["sport", "risk"], ch: p => .2 + p.r.h / 250, yes: { j: 14, h: 2, m: -8 }, no: { h: -10, m: -8 }, ys: L("Вершина. Облака под ногами.", "The summit. Clouds below your feet."), ns: L("Повернули за триста метров до вершины.", "You turned back three hundred meters short."), set: p => { p.f.summitTried = true; p.f.summit = true; p.f.trips = (p.f.trips || 0) + 1; }, setNo: p => p.f.summitTried = true },
    { l: L("Дойти до базового лагеря", "Trek to base camp"), tags: ["rest"], ch: () => .9, yes: { j: 8, h: 3, m: -5 }, no: { h: -3 }, ys: L("Палатки, флажки и тишина.", "Tents, prayer flags and silence."), ns: L("Горная болезнь, пришлось спуститься.", "Altitude sickness. You had to go down."), set: p => { p.f.summitTried = true; p.f.trips = (p.f.trips || 0) + 1; } },
    { l: L("Это не для меня", "Not for me"), ch: () => 1, yes: {}, ys: L("Горы красивы и на фото.", "Mountains look great in photos too."), set: p => p.f.summitTried = true },
  ]},
  { id: "dance", from: 30, to: 85, if: p => !p.f.dance, t: L("Танцы", "Dancing"), q: () => L("Рядом открылась студия танцев для взрослых.", "A dance studio for adults opened nearby."), o: [
    { l: L("Записаться", "Sign up"), tags: ["sport", "social"], ch: () => .8, yes: { h: 5, j: 6, t: 4 }, no: { j: 1 }, ys: L("Танго по четвергам.", "Tango on Thursdays."), ns: L("Две левые ноги.", "Two left feet."), set: p => p.f.dance = true },
    { l: L("Танцевать только на кухне", "Dance in the kitchen only"), ch: () => 1, yes: { j: 3 }, ys: L("Зато без зрителей.", "No audience, at least."), set: p => p.f.dance = true },
  ]},
  { id: "meditate", from: 25, to: 85, if: p => !p.f.meditate, t: L("Тишина", "Stillness"), q: () => L("Подруга советует каждое утро десять минут сидеть в тишине.", "A friend suggests ten minutes of silence every morning."), o: [
    { l: L("Попробовать", "Try it"), tags: ["health", "rest"], ch: () => .6, yes: { j: 8, h: 3 }, no: { j: 1 }, ys: L("Мысли стали тише.", "Your thoughts got quieter."), ns: L("Засыпаешь на третьей минуте.", "You fall asleep by minute three."), set: p => p.f.meditate = true },
    { l: L("Мне некогда", "No time for that"), ch: () => 1, yes: {}, ys: L("Может, на пенсии.", "Maybe in retirement."), set: p => p.f.meditate = true },
  ]},

  // ===== Увлечения и соседи =====
  { id: "chess", from: 18, to: 95, if: p => p.f.chess && !p.f.chessCup, t: L("Турнир", "The tournament"), q: () => L("В клубе турнир по шахматам. Ты в форме.", "There's a chess tournament at the club. You're in form."), o: [
    { l: L("Играть на победу", "Play to win"), tags: ["study"], ch: p => .25 + p.r.k / 200, yes: { j: 8, k: 4 }, no: { j: -2 }, ys: L("Кубок стоит на полке.", "The cup sits on your shelf."), ns: L("Зевнул ферзя в финале.", "You blundered your queen in the final."), set: p => p.f.chessCup = true },
    { l: L("Играть для удовольствия", "Play for fun"), ch: () => 1, yes: { j: 4, t: 2 }, ys: L("Новые знакомые за доской.", "New friends across the board.") },
  ]},
  { id: "fishing", from: 25, to: 95, repeat: 20, t: L("Рыбалка", "Fishing"), q: () => L("Друг зовёт на рыбалку на все выходные.", "A friend invites you fishing for the whole weekend."), o: [
    { l: L("Поехать", "Go"), tags: ["rest", "social"], ch: () => .6, yes: { j: 8, t: 4 }, no: { j: 4 }, ys: L("Вот такая рыба! Фото есть.", "A fish this big! There's a photo."), ns: L("Ничего не поймал, но было хорошо.", "Caught nothing, but it was lovely.") },
    { l: L("Остаться дома", "Stay home"), ch: () => 1, yes: { m: 2 }, ys: L("Дома тоже дел полно.", "Plenty to do at home.") },
  ]},
  { id: "photo", from: 16, to: 80, if: p => !p.f.photo, t: L("Фотография", "Photography"), q: () => L("В руки попала старая плёночная камера.", "An old film camera falls into your hands."), o: [
    { l: L("Снимать всё вокруг", "Shoot everything"), tags: ["art"], ch: () => .7, yes: { j: 6, k: 3 }, no: { j: 1 }, ys: L("Твой снимок взяли на городскую выставку.", "Your photo made the city exhibition."), ns: L("Плёнка засветилась.", "The film got exposed."), set: p => p.f.photo = true },
    { l: L("Отдать на полку", "Put it on a shelf"), ch: () => 1, yes: {}, ys: L("Красивая вещь.", "A pretty object."), set: p => p.f.photo = true },
  ]},
  { id: "shelter", from: 25, to: 85, if: p => !p.f.pet, t: L("Приют", "The shelter"), q: () => L("В приюте для животных день открытых дверей.", "The animal shelter is having an open day."), o: [
    { l: L("Взять собаку", "Adopt a dog"), tags: ["care"], ch: () => 1, yes: { j: 8, h: 3, m: -2 }, ys: L("Прогулки дважды в день, хочешь или нет.", "Walks twice a day, like it or not."), set: p => p.f.pet = p.age },
    { l: L("Взять кошку", "Adopt a cat"), tags: ["care"], ch: () => 1, yes: { j: 7, m: -1 }, ys: L("Кошка выбрала тебя сама.", "The cat chose you."), set: p => { p.f.pet = p.age; p.f.cat = true; } },
    { l: L("Помочь деньгами", "Donate instead"), ch: () => 1, yes: { j: 3, m: -2 }, ys: L("Корм на месяц для всего приюта.", "A month of food for the whole shelter.") },
  ]},
  { id: "fence", from: 25, to: 90, if: p => !p.f.fence, t: L("Забор", "The fence"), q: () => L("Сосед поставил забор на полметра на твоей земле.", "The neighbor built a fence half a meter onto your land."), o: [
    { l: L("Поговорить по-соседски", "Talk it over as neighbors"), tags: ["social"], ch: p => .5 + p.r.t / 250, yes: { t: 6, j: 3 }, no: { t: -4, j: -4 }, ys: L("Перенёс забор и принёс яблок.", "He moved the fence and brought apples."), ns: L("Теперь не здороваетесь.", "Now you don't say hello."), set: p => p.f.fence = true, setNo: p => p.f.fence = true },
    { l: L("Подать в суд", "Sue"), tags: ["risk"], ch: p => .3 + .5 * p.c.d, yes: { j: 2, t: -4, m: -2 }, no: { m: -8, j: -6 }, ys: L("Суд на твоей стороне. Соседи нет.", "The court sided with you. The neighbors didn't."), ns: L("Суд затянулся на три года.", "The case dragged on for three years."), set: p => p.f.fence = true, setNo: p => p.f.fence = true },
    { l: L("Махнуть рукой", "Let it go"), ch: () => 1, yes: { j: -2 }, ys: L("Полметра не жалко.", "It's only half a meter."), set: p => p.f.fence = true },
  ]},
  { id: "election", from: 18, to: 95, repeat: 15, t: L("Выборы", "Election day"), q: () => L("Сегодня выборы.", "It's election day."), o: [
    { l: L("Пойти голосовать", "Go and vote"), tags: ["social"], ch: () => 1, yes: { j: 2, t: 2 }, ys: L("Маленький вклад, но твой.", "A small contribution, but yours.") },
    { l: L("Стать наблюдателем", "Be an election observer"), tags: ["politics", "risk"], ch: p => .5 + .4 * p.c.d, yes: { t: 5, k: 3 }, no: { j: -4 }, ys: L("Всё прошло честно на твоём участке.", "Everything was fair at your polling station."), ns: L("Видел то, о чём лучше молчать.", "You saw things better left unsaid."), set: p => p.f.activist = true },
    { l: L("Остаться дома", "Stay home"), ch: () => 1, yes: {}, ys: L("Всё решат без тебя.", "They'll decide without you.") },
  ]},
  { id: "festival", from: 8, to: 85, repeat: 20, t: L("Праздник", "Festival"), q: () => L("В городе большой праздник. Музыка на каждой улице.", "There's a big festival in town. Music on every street."), o: [
    { l: L("Гулять до утра", "Celebrate till dawn"), tags: ["rest", "social"], ch: () => 1, yes: { j: 7, t: 3, h: -1 }, ys: L("Фейерверк отражался в реке.", "Fireworks reflected in the river.") },
    { l: L("Помогать организаторам", "Help the organizers"), tags: ["social"], ch: () => .9, yes: { t: 6, j: 4 }, no: { j: 1 }, ys: L("Без тебя бы не справились.", "They couldn't have done it without you."), ns: L("Всё пошло не по плану.", "Nothing went to plan.") },
  ]},
  { id: "charity", from: 30, to: 95, if: p => p.r.m >= 50 && !p.f.charity, t: L("Фонд", "The foundation"), q: () => L("Можно ежемесячно помогать фонду, который лечит детей.", "You could give monthly to a foundation that treats children."), o: [
    { l: L("Помогать каждый месяц", "Give every month"), tags: ["care"], ch: () => 1, yes: { j: 8, t: 4, m: -6 }, ys: L("Пришло письмо с детским рисунком.", "A letter came with a child's drawing."), set: p => p.f.charity = true },
    { l: L("Не сейчас", "Not now"), ch: () => 1, yes: {}, ys: L("Может, позже.", "Maybe later."), set: p => p.f.charity = true },
  ]},
  { id: "river", from: 14, to: 65, if: p => !p.f.river, w: .15, t: L("На реке", "At the river"), q: () => L("Кто-то барахтается на середине реки и зовёт на помощь.", "Someone is struggling in the middle of the river, calling for help."), o: [
    { l: L("Прыгнуть в воду", "Jump in"), tags: ["risk", "sport"], ch: p => .35 + p.r.h / 250, yes: { j: 12, t: 8 }, no: { h: -12, j: -6 }, ys: L("Вытащил. Мальчику двенадцать лет.", "You pulled him out. He's twelve."), ns: L("Течение было сильнее. Спасли вас обоих лодочники.", "The current was too strong. Boatmen saved you both."), set: p => { p.f.river = true; p.f.savedLife = true; }, setNo: p => p.f.river = true },
    { l: L("Звать на помощь и бросить верёвку", "Shout for help and throw a rope"), tags: ["social"], ch: () => .6, yes: { j: 8, t: 4 }, no: { j: -8 }, ys: L("Верёвка долетела. Человек жив.", "The rope reached. The man is alive."), ns: L("Не успели.", "Too late."), set: p => { p.f.river = true; p.f.savedLife = true; }, setNo: p => p.f.river = true },
  ]},
  { id: "wallet", from: 10, to: 90, if: p => !p.f.wallet, t: L("Кошелёк", "The wallet"), q: () => L("На тротуаре лежит кошелёк. Внутри деньги и паспорт.", "There's a wallet on the sidewalk. Money and an ID inside."), o: [
    { l: L("Вернуть владельцу", "Return it"), tags: ["social"], ch: () => .9, yes: { t: 5, j: 5 }, no: { j: 2 }, ys: L("Владелец обнял тебя и не хотел отпускать.", "The owner hugged you and wouldn't let go."), ns: L("Владельца не нашли, отнёс в полицию.", "Couldn't find the owner. You took it to the police."), set: p => p.f.wallet = true },
    { l: L("Оставить деньги себе", "Keep the money"), ch: () => 1, yes: { m: 5, j: -4 }, ys: L("Каждый раз вспоминаешь, когда видишь такой же кошелёк.", "You remember every time you see a wallet like that."), set: p => p.f.wallet = true },
  ]},
  { id: "bookclub", from: 30, to: 95, if: p => p.r.k >= 40 && !p.f.bookclub, t: L("Книжный клуб", "Book club"), q: () => L("В библиотеке собирается книжный клуб.", "There's a book club at the library."), o: [
    { l: L("Ходить каждую неделю", "Go every week"), tags: ["study", "social"], ch: () => 1, yes: { k: 5, t: 5, j: 3 }, ys: L("Спорили о Толстом до закрытия.", "You argued about Tolstoy until closing."), set: p => p.f.bookclub = true },
    { l: L("Читать одному", "Read alone"), ch: () => 1, yes: { k: 3 }, ys: L("Книги не спорят.", "Books don't argue back."), set: p => p.f.bookclub = true },
  ]},

  // ===== Старость =====
  { id: "smartphone", from: 60, to: 95, if: p => p.c.d > .2 && !p.f.phone, t: L("Смартфон", "Smartphone"), q: () => L("Внук дарит смартфон и хочет научить им пользоваться.", "Your grandson gives you a smartphone and wants to teach you."), o: [
    { l: L("Учиться", "Learn"), tags: ["study"], ch: p => .5 + p.r.k / 250, yes: { k: 5, t: 5, j: 4 }, no: { j: -2 }, ys: L("Теперь ты в семейном чате. И шлёшь открытки по утрам.", "Now you're in the family chat. Sending good-morning cards."), ns: L("Слишком мелкие буквы.", "The letters are too small."), set: p => p.f.phone = true },
    { l: L("Мне и кнопочного хватает", "My old phone is fine"), ch: () => 1, yes: {}, ys: L("Зато батарея неделю держит.", "At least the battery lasts a week."), set: p => p.f.phone = true },
  ]},
  { id: "carehome", from: 78, to: 109, if: p => (!p.kids.length || p.r.t < 40) && !p.f.careHome, t: L("Одному тяжело", "Hard on your own"), q: () => L("Справляться одному всё труднее.", "It's getting harder to manage alone."), o: [
    { l: L("Переехать в дом престарелых", "Move into a care home"), tags: ["health", "social"], ch: p => .3 + .6 * p.c.d, yes: { h: 6, t: 6, j: 2 }, no: { j: -6 }, ys: L("Соседка по столу оказалась из твоего города.", "The woman at your table turned out to be from your home town."), ns: L("Хорошего места не нашлось.", "There was no good place."), set: p => p.f.careHome = true, setNo: p => p.f.careHome = true },
    { l: L("Остаться дома", "Stay at home"), ch: () => 1, yes: { j: 2, h: -3 }, ys: L("Свои стены лечат.", "Your own walls heal."), set: p => p.f.careHome = true },
  ]},
  { id: "lasttrip", from: 70, to: 95, if: p => p.r.m >= 25 && !p.f.lastTrip, t: L("Ещё одна поездка", "One more trip"), q: () => L("Хочется съездить куда-то ещё раз, пока есть силы.", "You want to travel once more while you still can."), o: [
    { l: L("К морю", "To the sea"), tags: ["rest"], ch: p => .6 + p.r.h / 250, yes: { j: 10, h: 2, m: -6 }, no: { h: -4, m: -6 }, ys: L("Ноги в тёплой воде. Больше ничего не нужно.", "Feet in warm water. Nothing else needed."), ns: L("Дорога вымотала.", "The journey wore you out."), set: p => { p.f.lastTrip = true; p.f.trips = (p.f.trips || 0) + 1; } },
    { l: L("На родину", "Back to where you were born"), if: p => p.f.emigrated && !p.f.returned, tags: ["move"], ch: () => .9, yes: { j: 12, t: 6, m: -6 }, no: { j: 4 }, ys: p => L(`${p.home.name}. Дом детства ещё стоит.`, `${p.home.name}. Your childhood home is still standing.`), ns: L("Всё изменилось до неузнаваемости.", "Everything changed beyond recognition."), set: p => { p.f.lastTrip = true; p.f.rootsTrip = true; } },
    { l: L("Остаться дома", "Stay home"), ch: () => 1, yes: {}, ys: L("Мир можно смотреть и по телевизору.", "You can see the world on TV."), set: p => p.f.lastTrip = true },
  ]},
  { id: "century", prio: true, from: 99, to: 109, if: p => p.age >= 100 && !p.f.centuryParty, t: L("Сто лет", "One hundred"), q: () => L("Тебе сто лет. Пришли даже журналисты.", "You're a hundred years old. Even journalists showed up."), o: [
    { l: L("Рассказать секрет долголетия", "Share the secret of long life"), tags: ["social"], ch: () => 1, yes: { j: 12, t: 8 }, ys: L("«Не спешить и не злиться». Цитата в газете.", "\"Don't rush and don't stay angry.\" Quoted in the paper."), set: p => p.f.centuryParty = true, fx: "gold" },
    { l: L("Просто съесть торт", "Just eat the cake"), ch: () => 1, yes: { j: 10 }, ys: L("Сто свечей задули всей семьёй.", "The whole family blew out a hundred candles."), set: p => p.f.centuryParty = true, fx: "gold" },
  ]},
  { id: "lateLove", from: 68, to: 100, if: p => !p.partner && !p.f.lateLove, t: L("Встреча в санатории", "A meeting at the spa"), q: () => L("В санатории кто-то каждый день садится рядом за ужином.", "At the spa, someone sits next to you at dinner every day."), o: [
    { l: L("Пригласить на прогулку", "Ask them for a walk"), tags: ["love"], ch: () => .6, yes: { j: 14, t: 8 }, no: { j: -3 }, ys: p => L(`${p.partner.first}. Кто бы мог подумать, в таком возрасте.`, `${p.partner.first}. Who would have thought, at this age.`), ns: L("Уехали в разные города.", "You left for different cities."), pre: p => meetPartner(p), set: p => { p.f.lateLove = true; p.f.widowed = false; p.f.divorced = false; }, setNo: p => { p.partner = null; p.f.lateLove = true; }, fx: "love" },
    { l: L("Просто болтать за ужином", "Just chat at dinner"), ch: () => 1, yes: { t: 4, j: 3 }, ys: L("Хороший собеседник дороже золота.", "Good company is worth more than gold."), set: p => p.f.lateLove = true },
  ]},
  { id: "homecoming", from: 58, to: 90, if: p => p.f.emigrated && !p.f.returned && !p.f.homecoming, t: L("Вернуться?", "Go back?"), q: p => L(`Всё чаще снится ${p.home.name}. Может, вернуться доживать на родину?`, `You dream of ${p.home.name} more and more. Go back home to live out your years?`), o: [
    { l: L("Вернуться", "Go back"), tags: ["move"], ch: () => 1, yes: { j: 8, t: 6 }, ys: p => L(`Возвращение: ${p.home.name}. Соседи помнят твоё имя.`, `Back home to ${p.home.name}. The neighbors remember your name.`), set: p => { p.f.homecoming = true; returnHome(p); } },
    { l: L("Остаться: здесь уже дом", "Stay: this is home now"), ch: () => 1, yes: { t: 3 }, ys: L("Дом там, где твои дети.", "Home is where your children are."), set: p => p.f.homecoming = true },
  ]},
  { id: "advice", from: 62, to: 100, if: p => p.f.grandkids && !p.f.advice, t: L("Совет", "Advice"), q: () => L("Внук спрашивает: учиться дальше или идти работать?", "Your grandson asks: keep studying or start working?"), o: [
    { l: L("«Учись, пока можешь»", "\"Study while you can\""), tags: ["social"], ch: () => 1, yes: { t: 6, j: 4 }, ys: L("Через пять лет он прислал фото с диплома.", "Five years later he sent a graduation photo."), set: p => { p.f.advice = true; p.f.mentor = true; } },
    { l: L("«Делай то, что любишь»", "\"Do what you love\""), tags: ["social"], ch: () => 1, yes: { t: 6, j: 5 }, ys: L("Он стал поваром. И счастлив.", "He became a cook. And he's happy."), set: p => { p.f.advice = true; p.f.mentor = true; } },
  ]},
  { id: "dacha", from: 58, to: 85, if: p => p.retired && !p.f.dacha, t: L("На пенсии", "In retirement"), q: () => L("Свободного времени теперь сколько угодно.", "Now you have all the free time you want."), o: [
    { l: L("Огород и дача", "A vegetable garden"), tags: ["health"], ch: () => 1, yes: { h: 5, j: 5, m: 2 }, ys: L("Помидоры лучше, чем у соседа.", "Better tomatoes than the neighbor's."), set: p => p.f.dacha = true },
    { l: L("Волонтёрство", "Volunteering"), tags: ["care", "social"], ch: () => 1, yes: { t: 8, j: 6 }, ys: L("Читаешь детям в больнице по средам.", "You read to kids in the hospital on Wednesdays."), set: p => { p.f.dacha = true; p.f.care = true; } },
    { l: L("Подработка", "A little paid work"), tags: ["work"], ch: () => .8, yes: { m: 6 }, no: { j: -2 }, ys: L("Пенсия плюс зарплата.", "A pension plus a paycheck."), ns: L("Пожилых не берут.", "They don't hire older people."), set: p => p.f.dacha = true },
  ]},

  // ===== Регионы =====
  { id: "carnival", from: 8, to: 75, repeat: 20, if: p => p.c.part === "Америка" && p.c.d < .8, t: L("Карнавал", "Carnival"), q: () => L("Весь город готовится к карнавалу.", "The whole city is getting ready for carnival."), o: [
    { l: L("Танцевать в колонне", "Dance in the parade"), tags: ["social", "art"], ch: () => .85, yes: { j: 10, t: 5, m: -3 }, no: { j: 3 }, ys: L("Перья, барабаны и три дня без сна.", "Feathers, drums and three sleepless days."), ns: L("Костюм порвался на старте.", "Your costume tore at the start.") },
    { l: L("Торговать едой для толпы", "Sell food to the crowds"), tags: ["business"], ch: () => .8, yes: { m: 8 }, no: { m: -3 }, ys: L("Продали всё. Дважды.", "Sold out. Twice."), ns: L("Дождь разогнал всех.", "Rain scattered everyone.") },
  ]},
  { id: "bigwedding", from: 18, to: 70, repeat: 20, if: p => p.c.part === "Азия" && ["Индия", "Пакистан", "Бангладеш", "Непал", "Шри-Ланка", "Афганистан", "Иран", "Турция", "Узбекистан", "Таджикистан", "Кыргызстан", "Казахстан"].includes(p.c.n), t: L("Свадьба родни", "A family wedding"), q: () => L("Двоюродный брат женится. Гостей ждут пятьсот человек.", "Your cousin is getting married. Five hundred guests are expected."), o: [
    { l: L("Помочь деньгами", "Help with money"), tags: ["social"], ch: () => 1, yes: { t: 8, j: 4, m: -6 }, ys: L("Неделя праздника, ты в первом ряду.", "A week of celebration, you in the front row.") },
    { l: L("Помочь руками", "Help with your hands"), tags: ["work", "social"], ch: () => 1, yes: { t: 6, h: -2 }, ys: L("Носил стулья три дня.", "You carried chairs for three days.") },
    { l: L("Отправить подарок", "Send a gift"), ch: () => 1, yes: { t: -2, m: -2 }, ys: L("Тётя запомнила твоё отсутствие.", "Your aunt remembered you weren't there.") },
  ]},
  { id: "rugby", from: 10, to: 35, if: p => (p.c.part === "Океания" || ["Новая Зеландия", "Фиджи", "ЮАР", "Ирландия", "Великобритания", "Франция", "Аргентина"].includes(p.c.n)) && !p.f.rugby, t: L("Регби", "Rugby"), q: () => L("Местная команда по регби ищет новичков.", "The local rugby team is looking for new players."), o: [
    { l: L("Пойти на тренировку", "Go to practice"), tags: ["sport", "social"], ch: () => .75, yes: { h: 6, t: 6 }, no: { h: -5 }, ys: L("Команда теперь твоя вторая семья.", "The team is your second family now."), ns: L("Сломанный нос в первую же игру.", "A broken nose in your first game."), set: p => { p.f.rugby = true; p.f.sport = true; } },
    { l: L("Болеть с трибуны", "Cheer from the stands"), ch: () => 1, yes: { j: 4, t: 2 }, ys: L("Голос сорван, команда победила.", "You lost your voice; the team won."), set: p => p.f.rugby = true },
  ]},
  { id: "icefish", from: 15, to: 85, repeat: 20, if: p => inC(p, WINTER), t: L("На льду", "On the ice"), q: () => L("Озеро замёрзло. Мужики уже сверлят лунки.", "The lake has frozen. People are already drilling holes."), o: [
    { l: L("Пойти на подлёдную рыбалку", "Go ice fishing"), tags: ["rest"], ch: () => .7, yes: { j: 6, t: 3 }, no: { h: -3 }, ys: L("Чай из термоса и окунь на ужин.", "Tea from a thermos and perch for dinner."), ns: L("Промёрз до костей.", "Frozen to the bone.") },
    { l: L("Кататься на коньках", "Go skating"), tags: ["sport"], ch: () => .85, yes: { h: 4, j: 5 }, no: { h: -3 }, ys: L("Как в детстве.", "Just like when you were a kid."), ns: L("Упал. Синяк на полбедра.", "You fell. A bruise the size of a plate.") },
  ]},
  { id: "monsoonwed", from: 15, to: 70, repeat: 25, if: p => inC(p, MONSOON) && p.c.d < .6, t: L("Дожди", "The rains"), q: () => L("Муссон пришёл на месяц раньше. Улица превратилась в реку.", "The monsoon came a month early. The street is a river."), o: [
    { l: L("Помочь соседям поднять вещи", "Help neighbors lift their things"), tags: ["social"], ch: () => 1, yes: { t: 6, h: -2 }, ys: L("Вся улица таскала мешки вместе.", "The whole street hauled sacks together.") },
    { l: L("Спасать своё", "Save your own things"), ch: () => .8, yes: { m: 2 }, no: { m: -6 }, ys: L("Успел поднять всё на крышу.", "You got everything onto the roof."), ns: L("Вода оказалась быстрее.", "The water was faster.") },
  ]},
);

// Главные развилки жизни должны выпадать так же часто, как до расширения, поэтому их вес выше.
const CORE = { school: 4, after: 4, firstjob: 3, love: 2.5, kids: 2.5, career: 2, house: 2, trip: 2, abroad: 1.8, promo: 1.8, talent: 2, teen: 1.5, crisis: 1.5, habits: 1.5, parents: 1.5, grandkids: 2.5, old: 1.5, midlife: 1.5, invest: 1.5 };
// Продолжения из старых карточек: отметки для новых веток, праздничные эффекты, вес письма-пасхалки.
for (const c of window.CARDS) {
  if (CORE[c.id]) { const w = c.w, k = CORE[c.id]; c.w = p => (txt(w, p) ?? 1) * k; }
  if (c.id === "activism") c.o[1].set = p => p.f.activist = true;
  if (c.id === "letter") c.w = p => p.f.diary ? .3 : .02;
  if (c.id === "wedding") c.o.forEach(o => o.fx = "love");
  if (c.id === "kids") c.o.slice(0, 2).forEach(o => o.fx = "baby");
  if (c.id === "graduate") c.o.forEach(o => o.fx = "grad");
  if (c.id === "house") c.o.slice(0, 2).forEach(o => o.fx = "home");
  if (c.id === "fame") c.o[0].fx = "star";
  if (c.id === "love" || c.id === "newlove") c.o[0].fx = "love";
  if (c.id === "grandkids") c.o.forEach(o => o.fx = "baby");
  if (c.id === "give") c.o.slice(0, 2).forEach(o => o.fx = "star");
}

// ---------- События ----------
window.EVENTS.push(
  { id: "bonus", w: p => p.job && !p.retired ? .07 : 0, e: { m: 6, j: 3 }, s: L("Премия по итогам года.", "A year-end bonus."), ic: "💰" },
  { id: "kitchenfire", w: () => .025, e: { m: -8, j: -3 }, s: L("Пожар на кухне. Все целы, ремонт дорогой.", "A kitchen fire. Everyone's fine, but repairs are expensive."), ic: "🔥" },
  { id: "phone", heavy: true, w: p => p.age >= 12 && p.c.d > .2 ? .03 : 0, e: { m: -4, j: -2 }, s: L("Украли телефон в автобусе.", "Your phone was stolen on the bus."), ic: "📱" },
  { id: "goodharvest", w: p => p.job === "farmer" || p.c.d < .4 ? .07 : 0, e: { m: 8, j: 4 }, s: L("Урожайный год. Амбар полон.", "A bumper year. The barn is full."), ic: "🌾" },
  { id: "kidwin", w: p => p.kids.some(k => p.age - k.born >= 8 && p.age - k.born <= 18) ? .1 : 0, e: { j: 8, t: 3 }, s: p => { const k = p.kids.find(k => p.age - k.born >= 8 && p.age - k.born <= 18); return L(`${k.first} ${k.sex === "f" ? "победила" : "победил"} на олимпиаде.`, `${k.first} won an academic olympiad.`); }, ic: "🏅" },
  { id: "award", w: p => p.job && p.jobLvl >= 2 ? .05 : 0, e: { j: 5, t: 2 }, s: L("Грамота за многолетнюю работу.", "An award for years of service."), ic: "🎖" },
  { id: "celebrity", rare: true, w: () => .004, e: { j: 8 }, s: L("Встретил в кафе знаменитость. Селфи на память.", "You ran into a celebrity at a café. A selfie to remember."), ic: "🌟", act: p => p.f.celebrity = true },
  { id: "meteors", rare: true, w: p => p.age >= 8 ? .004 : 0, e: { j: 12 }, s: L("Звездопад. Ты успел загадать желание.", "A meteor shower. You managed to make a wish."), ic: "☄", act: p => p.f.meteors = true },
  { id: "nephews", w: p => p.siblings > 0 && p.age >= 20 && p.age <= 60 ? .05 : 0, e: { t: 4, j: 2 }, s: L("У сестры родились двойняшки.", "Your sister had twins."), ic: "✿" },
  { id: "firstphone", w: p => p.c.d > .15 && p.age >= 10 && p.age < 70 && !p.f.firstPhone ? .12 : 0, e: { k: 4, t: 2 }, s: L("Первый смартфон. Весь мир в кармане.", "Your first smartphone. The whole world in your pocket."), ic: "📱", act: p => p.f.firstPhone = true },
  { id: "ai", w: p => p.c.d > .5 && p.age >= 20 && p.age < 65 && !p.f.ai ? .07 : 0, e: { k: 4, j: -2 }, s: L("Нейросети поменяли работу. Пришлось переучиваться.", "AI changed your job. You had to retrain."), ic: "🤖", act: p => p.f.ai = true },
  { id: "power", w: p => p.c.d < .4 ? .06 : 0, e: { m: -3, j: -3 }, s: L("Свет отключают каждый вечер.", "The power goes out every evening."), ic: "🕯" },
  { id: "road", w: p => p.c.d < .5 && !p.f.road ? .05 : 0, e: { m: 5, k: 2 }, s: L("К деревне наконец проложили асфальт.", "They finally paved the road to the village."), ic: "🛣", act: p => p.f.road = true },
  { id: "newschool", w: p => p.c.d < .5 && p.age < 14 && !p.f.newSchool ? .08 : 0, e: { k: 6 }, s: L("В деревне открыли новую школу.", "A new school opened in the village."), ic: "🏫", act: p => p.f.newSchool = true },
  { id: "clinic", w: p => p.c.d < .6 && !p.f.clinic ? .04 : 0, e: { h: 4 }, s: L("Рядом открыли новую больницу.", "A new hospital opened nearby."), ic: "🏥", act: p => p.f.clinic = true },
  { id: "devalue", w: p => p.c.d > .15 && p.c.d < .7 && p.age >= 18 ? .05 : 0, e: { m: -10, j: -3 }, s: L("Деньги обесценились за одну ночь.", "Money lost half its value overnight."), ic: "📉" },
  { id: "raise", w: p => p.job && !p.retired ? .06 : 0, e: { m: 6 }, s: L("Зарплату подняли.", "You got a raise."), ic: "💰" },
  { id: "neighbor", w: () => .05, e: { t: 4, j: 2 }, s: L("Соседка выручила, когда было совсем туго.", "A neighbor helped out when things were really tight."), ic: "🤝" },
  { id: "reconnect", w: p => p.age >= 30 && p.c.d > .3 && !p.f.reconnect ? .05 : 0, e: { t: 5, j: 4 }, s: L("Нашёл в соцсети друга детства. Созвонились.", "You found a childhood friend online. You talked for hours."), ic: "💬", act: p => p.f.reconnect = true },
  { id: "surprise", w: p => p.age >= 20 ? .04 : 0, e: { j: 6, t: 3 }, s: L("Друзья устроили тебе праздник-сюрприз.", "Friends threw you a surprise party."), ic: "🎉" },
  { id: "kidhome", w: p => p.age >= 55 && p.kids.some(k => p.age - k.born >= 25) ? .04 : 0, e: { t: 5, m: -3 }, s: L("Дети с внуками переехали к тебе на время.", "Your kids and grandkids moved in for a while."), ic: "🏠" },
  { id: "partnerjob", w: p => p.married && p.age < 60 ? .05 : 0, e: { m: 6, j: 2 }, s: p => L(`${p.partner.first} получает повышение.`, `${p.partner.first} got a promotion.`), ic: "💼" },
  { id: "stray", w: p => !p.f.pet && p.age >= 6 ? .03 : 0, e: { j: 6 }, s: L("Бездомный пёс увязался за тобой до дома. И остался.", "A stray dog followed you home. And stayed."), ic: "🐕", act: p => p.f.pet = p.age },
  { id: "inflation", w: p => p.age >= 18 ? .06 : 0, e: { m: -5 }, s: L("Цены выросли, а зарплата нет.", "Prices went up. Wages didn't."), ic: "📈" },
  { id: "heat", w: p => p.age >= 60 ? .07 : .02, e: { h: -4 }, s: L("Аномальная жара. Три недели без передышки.", "A record heat wave. Three weeks without a break."), ic: "🌡" },
  { id: "flu", w: () => .05, e: { h: -5 }, s: L("Тяжёлый грипп. Две недели в постели.", "A bad flu. Two weeks in bed."), ic: "🤒" },
  { id: "studentback", w: p => p.f.mentor && p.age >= 45 && !p.f.studentBack ? .15 : 0, e: { j: 8, t: 6 }, s: L("Бывший ученик пришёл сказать спасибо. Теперь он сам учит других.", "A former student came by to say thank you. Now they teach others."), ic: "🎓", act: p => p.f.studentBack = true },
  { id: "prize", rare: true, w: p => p.f.discovery && p.age >= 45 && !p.f.prize ? .12 : 0, e: { j: 15, m: 15, k: 5 }, s: L("Международная премия за твоё открытие. Речь на трёх языках.", "An international prize for your discovery. A speech in three languages."), ic: "🏆", act: p => { p.f.prize = true; p.f.famous = true; } },
  { id: "bestseller", w: p => p.f.book && !p.f.bestseller ? .12 : 0, e: { m: 14, j: 10 }, s: L("Твоя книга стала бестселлером. Переводят на восемь языков.", "Your book became a bestseller. It's being translated into eight languages."), ic: "📚", act: p => { p.f.bestseller = true; p.f.famous = true; } },
  { id: "cyclone", w: p => p.c.part === "Океания" || inC(p, STORM) ? .04 : 0, e: { m: -8, j: -4 }, s: L("Циклон сорвал крыши по всей улице.", "A cyclone tore the roofs off the whole street."), ic: "🌀", act: p => p.f.disaster = (p.f.disaster || 0) + 1 },
  { id: "locusts", w: p => (p.c.part === "Африка" || p.c.part === "Азия") && p.c.d < .35 ? .04 : 0, e: { m: -8, h: -2 }, s: L("Саранча съела поля за два дня.", "Locusts stripped the fields in two days."), ic: "🦗" },
  { id: "blizzard", w: p => inC(p, WINTER) ? .05 : 0, e: { h: -3, j: -2 }, s: L("Метель. Неделю не могли выйти из дома.", "A blizzard. You were snowed in for a week."), ic: "❄" },
  { id: "rain", w: p => inC(p, DROUGHT) ? .06 : 0, e: { j: 6, m: 3 }, s: L("После долгой засухи пошёл дождь. Дети танцевали на улице.", "After a long drought, rain came. Children danced in the street."), ic: "🌧" },
  { id: "honored", w: p => p.f.philanthropy && !p.f.honored ? .2 : 0, e: { j: 8, t: 6 }, s: L("Родная деревня назвала улицу твоим именем.", "Your home village named a street after you."), ic: "🏅", act: p => p.f.honored = true },
  { id: "pettrick", w: p => p.f.pet != null ? .06 : 0, e: { j: 4 }, s: L("Питомец научился открывать холодильник.", "Your pet learned to open the fridge."), ic: "🐾" },
  { id: "grandbirth", w: p => p.f.grandkids && p.age < 90 ? .08 : 0, e: { t: 6, j: 6 }, s: L("Родился ещё один внук.", "Another grandchild was born."), ic: "✿" },
  { id: "firstlove", w: p => p.age >= 40 && !p.f.firstLoveMet ? .03 : 0, e: { j: 4 }, s: L("Случайно встретил первую любовь. Посмеялись над прошлым.", "You bumped into your first love. You laughed about the old days."), ic: "♥", act: p => p.f.firstLoveMet = true },
  { id: "heirloom", rare: true, w: p => p.f.house ? .006 : 0, e: { m: 12, j: 6 }, s: L("На чердаке нашлись старинные часы прадеда. Антиквар ахнул.", "In the attic you found your great-grandfather's antique clock. The appraiser gasped."), ic: "🕰", act: p => p.f.heirloom = true },
  { id: "treasure", rare: true, w: () => .0012, e: { m: 25, j: 10 }, s: L("Копали огород и нашли горшок со старыми монетами!", "Digging the garden, you found a pot of old coins!"), ic: "🏺", act: p => p.f.treasure = true },
  { id: "oldschool", w: p => p.age >= 50 && !p.f.oldSchool ? .03 : 0, e: { j: -3 }, s: L("Твою школу закрыли. Здание продали.", "Your old school closed. The building was sold."), ic: "🏚", act: p => p.f.oldSchool = true },
  { id: "rainbow", rare: true, w: () => .003, e: { j: 8 }, s: L("Двойная радуга над домом. Соседи выбежали на улицу.", "A double rainbow over the house. The neighbors ran outside."), ic: "🌈", act: p => p.f.rainbow = true },
);
for (const e of window.EVENTS) if (e.id === "lottery" || e.id === "stars") e.rare = true;
const ICONS = { ill: "🤒", heart: "🫀", crisis: "📉", layoff: "📦", windfall: "💰", lottery: "🎟", inherit: "📜", harvest: "🌾", flood: "🌊", father: "🕯", mother: "🕯", widow: "🕯", newfriend: "🤝", teacher: "📖", war: "⚠", crash: "🚑", robbed: "👜", internet: "🌐", kiduni: "🎓", kidtrouble: "⚡", pension: "📉", loan: "🧾", release: "🔓", pandemic: "😷", tv: "📺", oldfriend: "🕯", quake: "🌋", typhoon: "🌀", monsoon: "🌧", drought: "☀", malaria: "🦟", winter: "❄", oilup: "🛢", oildown: "🛢", fwed: "💍", fhelp: "🤝", faway: "🧳", fdeath: "🕯", petdeath: "🐾", stars: "✨" };
for (const e of window.EVENTS) if (!e.ic && ICONS[e.id]) e.ic = ICONS[e.id];
})();
