// Ветки карьеры, которые тянутся через всю жизнь: медицина, наука, политика, музыка, книги, кухня, армия,
// стартапы, школа, спорт, земля, небо, журналистика. И деньги: вложения, ловушки, подработки.
// Каждая ветка — цепочка карточек с prio: следующий шаг выпадает сразу, как только выполнено условие.
(() => {
const L = window.tr;
const he = (p, m, f) => p.sex === "f" ? f : m;

window.CARDS.push(
  // ===== Медицина =====
  { id: "residency", prio: true, from: 22, to: 40, if: p => p.job === "doctor" && !p.f.residency, t: L("Ординатура", "Residency"), q: () => L("Диплом врача на руках. Какую специальность выбрать?", "You have your medical degree. Which specialty?"), o: [
    { l: L("Хирургия", "Surgery"), tags: ["study", "risk"], ch: p => .35 + p.r.k / 200, yes: { k: 10, h: -4, m: 4 }, no: { k: 4, j: -4 }, ys: L("Первые операции под присмотром профессора.", "Your first operations under a professor's eye."), ns: L("Не взяли. Остался терапевтом.", "Didn't get in. You stayed in general practice."), set: p => { p.f.residency = true; p.f.surgeon = true; }, setNo: p => p.f.residency = true },
    { l: L("Педиатрия", "Pediatrics"), tags: ["study", "care"], ch: () => .75, yes: { k: 8, t: 6, j: 4 }, no: { k: 3 }, ys: L("Дети зовут тебя доктором-волшебником.", "The kids call you the wizard doctor."), ns: L("Мест в ординатуре не хватило.", "Not enough residency spots."), set: p => p.f.residency = true, setNo: p => p.f.residency = true },
    { l: L("Сельский врач", "Rural doctor"), tags: ["care"], ch: () => .95, yes: { t: 10, j: 6, m: -4 }, no: { j: -3 }, ys: L("Один врач на десять деревень. Тебя знает каждый.", "One doctor for ten villages. Everyone knows you."), ns: L("Тяжело и одиноко.", "Hard and lonely."), set: p => { p.f.residency = true; p.f.rural = true; }, setNo: p => p.f.residency = true },
  ]},
  { id: "outbreak", from: 26, to: 64, if: p => ["doctor", "nurse"].includes(p.job) && !p.f.outbreak, t: L("Вспышка", "Outbreak"), q: () => L("В городе вспышка опасной инфекции. Больницы переполнены.", "A dangerous infection is spreading in the city. The hospitals are full."), o: [
    { l: L("Работать в красной зоне", "Work on the front line"), tags: ["care", "risk"], ch: p => .5 + p.r.h / 300, yes: { t: 10, j: 8, h: -6, m: 4 }, no: { h: -16, j: -4 }, ys: L("Десятки людей вернулись домой благодаря тебе.", "Dozens of people went home because of you."), ns: L("Заразился сам. Выкарабкался не сразу.", "You caught it yourself. A slow recovery."), set: p => { p.f.outbreak = true; p.f.savedLife = true; }, setNo: p => p.f.outbreak = true },
    { l: L("Остаться на приёме в поликлинике", "Stay at the clinic"), tags: ["work"], ch: () => 1, yes: { h: 2, j: -2 }, ys: L("Кто-то должен лечить и обычные болезни.", "Someone has to treat ordinary illnesses too."), set: p => p.f.outbreak = true },
  ]},
  { id: "surgery", prio: true, from: 30, to: 66, if: p => p.f.surgeon && !p.f.bigOp, t: L("Операция", "The operation"), q: () => L("Привезли ребёнка после аварии. Опытный хирург в отпуске, остаёшься только ты.", "A child arrives after an accident. The senior surgeon is away. It's just you."), o: [
    { l: L("Оперировать", "Operate"), tags: ["care", "risk"], ch: p => .3 + p.r.k / 160, yes: { j: 14, t: 8, k: 4 }, no: { j: -12, h: -4 }, ys: L("Девять часов. Ребёнок будет жить.", "Nine hours. The child will live."), ns: L("Сделал всё, что мог. Этого не хватило.", "You did everything you could. It wasn't enough."), set: p => { p.f.bigOp = true; p.f.savedLife = true; }, setNo: p => p.f.bigOp = true },
    { l: L("Везти в областную больницу", "Transfer to the regional hospital"), ch: () => .6, yes: { k: 2 }, no: { j: -8 }, ys: L("Довезли вовремя.", "They made it in time."), ns: L("Дорога оказалась слишком долгой.", "The drive was too long."), set: p => p.f.bigOp = true, setNo: p => p.f.bigOp = true },
  ]},
  { id: "headdoc", from: 40, to: 62, if: p => p.job === "doctor" && (p.jobLvl >= 2 || p.age >= 45) && !p.f.headDoc, t: L("Главврач", "Chief physician"), q: () => L("Тебе предлагают возглавить больницу.", "You're offered the job of running the hospital."), o: [
    { l: L("Согласиться", "Accept"), tags: ["work", "social"], ch: p => .4 + p.r.t / 250 + .2 * p.c.d, yes: { m: 10, j: 4, h: -4 }, no: { j: -4 }, ys: L("Новое крыло больницы откроется при тебе.", "The new hospital wing will open on your watch."), ns: L("Выбрали человека со связями.", "They picked someone with connections."), set: p => { p.f.headDoc = true; p.jobLvl = Math.min(3, p.jobLvl + 1); }, setNo: p => p.f.headDoc = true },
    { l: L("Остаться у операционного стола", "Stay with patients"), ch: () => 1, yes: { j: 4, k: 3 }, ys: L("Руки нужнее, чем подпись.", "Your hands matter more than your signature."), set: p => p.f.headDoc = true },
  ]},

  // ===== Наука =====
  { id: "grant", prio: true, from: 24, to: 55, if: p => p.job === "scientist" && !p.f.grant, t: L("Грант", "The grant"), q: () => L("Можно подать заявку на большой грант.", "You can apply for a major research grant."), o: [
    { l: L("Смелая гипотеза", "A bold hypothesis"), tags: ["study", "risk"], ch: p => .2 + p.r.k / 200 + .2 * p.c.d, yes: { k: 12, m: 8, j: 6 }, no: { j: -6 }, ys: L("Деньги на пять лет работы. Лаборатория твоя.", "Five years of funding. The lab is yours."), ns: L("Рецензенты сочли идею безумной.", "The reviewers called it crazy."), set: p => { p.f.grant = true; p.f.boldGrant = true; } },
    { l: L("Надёжная тема", "A safe topic"), tags: ["study"], ch: p => .45 + p.r.k / 300 + .2 * p.c.d, yes: { k: 8, m: 5 }, no: { j: -3 }, ys: L("Скромно, но стабильно.", "Modest but steady."), ns: L("Денег хватило не всем.", "There wasn't enough money for everyone."), set: p => p.f.grant = true },
  ]},
  { id: "discovery", prio: true, from: 28, to: 75, if: p => p.f.grant && !p.f.discTried, t: L("Странный результат", "A strange result"), q: () => L("Опыт дал результат, которого не может быть. Или может?", "The experiment gave a result that can't be right. Or can it?"), o: [
    { l: L("Проверить всё ещё раз", "Check everything again"), tags: ["study"], ch: p => .3 + p.r.k / 250 + (p.f.boldGrant ? .1 : 0), yes: { k: 14, j: 12, m: 6 }, no: { k: 6, j: -4 }, ys: L("Это открытие. Статья выходит в главном журнале.", "It's a discovery. The paper goes to the top journal."), ns: L("Ошибка в приборе. Год работы ушёл.", "A faulty instrument. A year of work gone."), set: p => { p.f.discTried = true; p.f.discovery = true; }, setNo: p => p.f.discTried = true },
    { l: L("Публиковать сразу", "Publish right away"), tags: ["risk"], ch: () => .25, yes: { k: 10, j: 10, m: 8 }, no: { j: -10, t: -6 }, ys: L("Успел первым! Коллеги подтвердили.", "You got there first! Colleagues confirmed it."), ns: L("Опровергли через месяц. Неловко.", "Debunked a month later. Awkward."), set: p => { p.f.discTried = true; p.f.discovery = true; }, setNo: p => p.f.discTried = true },
  ]},
  { id: "lab", from: 35, to: 70, if: p => p.f.discovery && !p.f.labDone, t: L("Своя школа", "Your own school"), q: () => L("Молодые учёные хотят работать именно у тебя.", "Young scientists want to work with you specifically."), o: [
    { l: L("Взять аспирантов", "Take on students"), tags: ["social", "study"], ch: () => 1, yes: { t: 8, k: 4, j: 5 }, ys: L("Твои ученики уже пишут свои статьи.", "Your students are writing papers of their own."), set: p => { p.f.labDone = true; p.f.mentor = true; } },
    { l: L("Работать одному", "Work alone"), ch: () => 1, yes: { k: 6 }, ys: L("Тишина и формулы.", "Silence and equations."), set: p => p.f.labDone = true },
  ]},

  // ===== Политика =====
  { id: "council", from: 26, to: 60, if: p => (p.f.leader || p.f.activist) && !p.f.politics && !p.f.councilTried, t: L("Выборы в совет", "Council election"), q: () => L("Соседи уговаривают тебя выдвинуться в городской совет.", "Your neighbors urge you to run for the city council."), o: [
    { l: L("Выдвинуться", "Run"), tags: ["politics", "social"], ch: p => .25 + p.r.t / 200 + p.r.k / 400, yes: { t: 8, j: 6, m: 2 }, no: { j: -6, m: -4 }, ys: L("Победа с перевесом в двести голосов.", "A win by two hundred votes."), ns: L("Проиграл кандидату от власти.", "You lost to the establishment's candidate."), set: p => { p.f.politics = true; p.f.councilTried = true; setJob(p, "politician"); }, setNo: p => p.f.councilTried = true },
    { l: L("Политика не для меня", "Politics isn't for me"), ch: () => 1, yes: {}, ys: L("Помогать можно и без мандата.", "You can help without a seat."), set: p => p.f.councilTried = true },
  ]},
  { id: "campaign", prio: true, from: 30, to: 68, if: p => p.job === "politician" && !p.f.campaign, t: L("Выборы мэра", "Mayoral race"), q: () => L("Можно побороться за пост мэра.", "You could run for mayor."), o: [
    { l: L("Честная кампания", "Run a clean campaign"), tags: ["politics", "social"], ch: p => .2 + p.r.t / 250 + .2 * p.c.d, yes: { t: 10, j: 8, m: 4 }, no: { j: -6 }, ys: L("Мэр! Люди поверили тебе.", "Mayor! People believed in you."), ns: L("Денег у соперника было больше.", "Your opponent had more money."), set: p => { p.f.campaign = true; p.f.mayor = true; }, setNo: p => p.f.campaign = true },
    { l: L("Взять деньги у спонсоров", "Take money from backers"), tags: ["politics", "risk"], ch: () => .6, yes: { m: 8, j: 4, t: -4 }, no: { m: -6, j: -6 }, ys: L("Мэр. Но спонсоры звонят каждый день.", "Mayor. But the backers call every day."), ns: L("Деньги не помогли.", "The money didn't help."), set: p => { p.f.campaign = true; p.f.mayor = true; p.f.sponsors = true; }, setNo: p => p.f.campaign = true },
    { l: L("Остаться в совете", "Stay on the council"), ch: () => 1, yes: { t: 3 }, ys: L("Маленькие дела тоже дела.", "Small things matter too."), set: p => p.f.campaign = true },
  ]},
  { id: "scandal", prio: true, from: 32, to: 75, if: p => p.f.sponsors && !p.f.scandal, t: L("Расследование", "The investigation"), q: () => L("Журналисты раскопали, кто платил за твою кампанию.", "Journalists found out who paid for your campaign."), o: [
    { l: L("Признать и извиниться", "Admit it and apologize"), tags: ["social"], ch: p => .4 + p.r.t / 250, yes: { t: 4, j: -2 }, no: { t: -8, j: -6 }, ys: L("Люди оценили честность. Не все, но многие.", "People valued the honesty. Not all, but many."), ns: L("Пришлось уйти в отставку.", "You had to resign."), set: p => p.f.scandal = true, setNo: p => { p.f.scandal = true; p.job = null; } },
    { l: L("Всё отрицать", "Deny everything"), tags: ["risk"], ch: () => .45, yes: { j: -3 }, no: { t: -12, j: -10, m: -8 }, ys: L("Шум утих через месяц.", "The noise died down in a month."), ns: L("Нашлись документы. Отставка и суд.", "Documents surfaced. Resignation and a trial."), set: p => p.f.scandal = true, setNo: p => { p.f.scandal = true; p.job = null; } },
  ]},
  { id: "minister", prio: true, from: 38, to: 72, if: p => p.f.mayor && !p.f.ministerTried && !(p.f.scandal && !p.job), t: L("Правительство", "The government"), q: () => L("Тебя зовут министром в столицу.", "You're invited to the capital to serve as a minister."), o: [
    { l: L("Согласиться", "Accept"), tags: ["politics"], ch: p => .3 + p.r.k / 300 + p.r.t / 300, yes: { m: 10, j: 6, t: -4, h: -4 }, no: { j: -4 }, ys: L("Твой закон о школах приняли с первого раза.", "Your schools bill passed on the first vote."), ns: L("Назначение сорвалось в последний момент.", "The appointment fell through at the last minute."), set: p => { p.f.ministerTried = true; p.f.minister = true; p.jobLvl = 3; }, setNo: p => p.f.ministerTried = true },
    { l: L("Остаться в родном городе", "Stay in your home town"), ch: () => 1, yes: { t: 6, j: 3 }, ys: L("Здесь тебя знает каждый.", "Here everyone knows you."), set: p => p.f.ministerTried = true },
  ]},

  // ===== Музыка =====
  { id: "band", from: 13, to: 22, if: p => p.f.music && !p.f.band, t: L("Группа", "The band"), q: () => L("Друзья хотят собрать группу. Репетировать можно в гараже.", "Friends want to start a band. You could rehearse in a garage."), o: [
    { l: L("Собрать группу", "Start the band"), tags: ["music", "social"], ch: () => .8, yes: { j: 8, t: 6 }, no: { j: -2 }, ys: L("Название придумывали дольше, чем первую песню.", "Choosing the name took longer than the first song."), ns: L("Барабанщик уехал, всё развалилось.", "The drummer moved away and it fell apart."), set: p => p.f.band = true },
    { l: L("Играть одному", "Play solo"), tags: ["music"], ch: () => 1, yes: { k: 3, j: 3 }, ys: L("Песни в тетради ждут своего часа.", "Songs in a notebook wait their turn.") },
  ]},
  { id: "gig", prio: true, from: 15, to: 32, if: p => p.f.band && !p.f.gig, t: L("Первый концерт", "First gig"), q: () => L("Вас зовут сыграть в баре. Полсотни человек.", "A bar invites you to play. About fifty people."), o: [
    { l: L("Играть свои песни", "Play your own songs"), tags: ["music", "risk"], ch: p => .4 + (p.traits.includes("musical") ? .1 : 0) + p.r.j / 400, yes: { j: 10, t: 4, m: 2 }, no: { j: -6 }, ys: L("Зал подпевал припев.", "The crowd sang the chorus back."), ns: L("Тишина между песнями. Долгая.", "Silence between songs. Long silence."), set: p => { p.f.gig = true; p.f.gigGood = true; }, setNo: p => p.f.gig = true },
    { l: L("Играть каверы", "Play covers"), tags: ["music"], ch: () => .85, yes: { j: 6, m: 3 }, no: { j: -2 }, ys: L("Хозяин бара позвал ещё раз.", "The bar owner asked you back."), ns: L("Звук был ужасный.", "The sound was awful."), set: p => p.f.gig = true },
  ]},
  { id: "record", prio: true, from: 17, to: 38, if: p => p.f.gigGood && !p.f.recordTried, t: L("Контракт", "Record deal"), q: () => L("Небольшой лейбл предлагает записать альбом.", "A small label offers to record your album."), o: [
    { l: L("Подписать", "Sign"), tags: ["music", "risk"], ch: p => .35 + .2 * p.c.d, yes: { j: 10, m: 6 }, no: { m: -6, j: -6 }, ys: L("Альбом вышел. Песню крутят на радио.", "The album is out. A song is on the radio."), ns: L("Лейбл обанкротился до выхода альбома.", "The label went bust before the release."), set: p => { p.f.recordTried = true; p.f.record = true; setJob(p, "musician"); }, setNo: p => p.f.recordTried = true },
    { l: L("Записать самим в интернет", "Self-release online"), tags: ["music"], ch: p => .3 + .3 * p.c.d, yes: { j: 8, m: 3 }, no: { j: -3 }, ys: L("Сто тысяч прослушиваний за месяц!", "A hundred thousand plays in a month!"), ns: L("Прослушали в основном мама и друзья.", "Mostly mom and friends listened."), set: p => { p.f.recordTried = true; p.f.record = true; setJob(p, "musician"); }, setNo: p => p.f.recordTried = true },
    { l: L("Оставить музыку для души", "Keep music for fun"), ch: () => 1, yes: { j: 3 }, ys: L("По пятницам в том же баре.", "Fridays at the same bar."), set: p => p.f.recordTried = true },
  ]},
  { id: "tour", prio: true, from: 20, to: 55, if: p => p.f.record && p.job === "musician" && !p.f.toured, t: L("Тур", "The tour"), q: () => L("Зовут в большой тур по стране. Двадцать городов.", "You're invited on a big national tour. Twenty cities."), o: [
    { l: L("Поехать", "Go"), tags: ["music", "risk"], ch: p => .45 + p.r.h / 400, yes: { j: 12, m: 12, h: -6, t: -4 }, no: { h: -8, m: -4 }, ys: L("Стадион пел вместе с тобой.", "A stadium sang along with you."), ns: L("Сорвал голос на третьем концерте.", "You lost your voice at the third show."), set: p => { p.f.toured = true; p.f.bigstage = true; if (rng() < .4) p.f.famous = true; }, setNo: p => p.f.toured = true },
    { l: L("Остаться с семьёй", "Stay with family"), ch: () => 1, yes: { t: 6 }, ys: L("Концерты могут подождать.", "The shows can wait."), set: p => p.f.toured = true },
  ]},

  // ===== Книги =====
  { id: "write", from: 18, to: 75, if: p => p.r.k >= 45 && !p.f.writeTried, t: L("Рукопись", "The manuscript"), q: () => L("В голове давно живёт история. Может, записать?", "A story has been living in your head for years. Write it down?"), o: [
    { l: L("Писать по вечерам", "Write every evening"), tags: ["art", "study"], ch: p => .45 + p.r.k / 300, yes: { k: 5, j: 6, h: -2 }, no: { j: -3 }, ys: L("Триста страниц. Последняя точка.", "Three hundred pages. The final full stop."), ns: L("Застрял на середине.", "Stuck in the middle."), set: p => { p.f.writeTried = true; p.f.manuscript = true; }, setNo: p => p.f.writeTried = true },
    { l: L("Не сейчас", "Not now"), ch: () => 1, yes: {}, ys: L("История подождёт.", "The story will wait.") },
  ]},
  { id: "publish", prio: true, from: 19, to: 85, if: p => p.f.manuscript && !p.f.pubTried, t: L("Издательство", "The publisher"), q: () => L("Рукопись готова. Что с ней делать?", "The manuscript is done. What now?"), o: [
    { l: L("Разослать в издательства", "Send it to publishers"), tags: ["art", "risk"], ch: p => .25 + p.r.k / 300 + .15 * p.c.d, yes: { j: 12, m: 6 }, no: { j: -6 }, ys: L("Книга в магазинах! Первый тираж — три тысячи.", "The book is in stores! A first print run of three thousand."), ns: L("Сорок отказов. Ни одного «да».", "Forty rejections. Not one yes."), set: p => { p.f.pubTried = true; p.f.book = true; } },
    { l: L("Издать самому", "Self-publish"), tags: ["art"], ch: () => .9, yes: { j: 8, m: -4 }, no: { m: -4 }, ys: L("Двести экземпляров. Все раздарил.", "Two hundred copies. You gave them all away."), ns: L("Типография напутала с обложкой.", "The printer botched the cover."), set: p => { p.f.pubTried = true; p.f.book = true; } },
    { l: L("Положить в стол", "Put it in a drawer"), ch: () => 1, yes: { j: -2 }, ys: L("Может, внуки найдут.", "Maybe the grandkids will find it."), set: p => p.f.pubTried = true },
  ]},
  { id: "authorlife", from: 25, to: 80, if: p => p.f.book && !p.f.authorDone, t: L("Писательство", "Writing for a living"), q: () => L("Читатели ждут вторую книгу. Можно уйти с работы и писать.", "Readers want a second book. You could quit your job and write."), o: [
    { l: L("Стать писателем", "Become a writer"), tags: ["art", "risk"], ch: p => .3 + p.r.k / 300, yes: { j: 10, m: 4 }, no: { m: -10, j: -4 }, ys: L("Вторая книга лучше первой.", "The second book is better than the first."), ns: L("Денег не хватает. Пришлось вернуться на работу.", "Not enough money. Back to the day job."), set: p => { p.f.authorDone = true; setJob(p, "writer"); }, setNo: p => p.f.authorDone = true },
    { l: L("Писать по выходным", "Write on weekends"), ch: () => 1, yes: { j: 4 }, ys: L("Медленно, но верно.", "Slowly but surely."), set: p => p.f.authorDone = true },
  ]},

  // ===== Кухня =====
  { id: "cafe", from: 20, to: 55, if: p => (p.f.kitchen || p.job === "master" || p.job === "trader") && !p.f.cafeTried && p.r.m >= 20, t: L("Своё кафе", "Your own café"), q: () => L("Пустует помещение на углу. Идеально для маленького кафе.", "The corner shop is empty. Perfect for a little café."), o: [
    { l: L("Открыть кафе", "Open the café"), tags: ["business", "risk"], ch: p => .3 + p.r.m / 300 + .15 * p.c.d, yes: { m: 8, j: 10, h: -3 }, no: { m: -14, j: -6 }, ys: L("Очередь за твоими пирогами по утрам.", "There's a morning line for your pies."), ns: L("Через полгода пришлось закрыться.", "You had to close after six months."), set: p => { p.f.cafeTried = true; p.f.restaurant = true; setJob(p, "chef"); }, setNo: p => p.f.cafeTried = true },
    { l: L("Готовить для друзей", "Cook for friends"), ch: () => 1, yes: { t: 5, j: 3 }, ys: L("Лучшие ужины в округе.", "The best dinners around."), set: p => p.f.cafeTried = true },
  ]},
  { id: "critic", prio: true, from: 22, to: 70, if: p => p.f.restaurant && p.job === "chef" && !p.f.critic, t: L("Критик", "The critic"), q: () => L("В зал зашёл известный ресторанный критик.", "A famous food critic just walked in."), o: [
    { l: L("Фирменное блюдо", "The signature dish"), tags: ["work"], ch: () => .7, yes: { m: 10, j: 8 }, no: { j: -4 }, ys: L("«Лучший суп в городе». Очередь до угла.", "\"The best soup in town.\" The line goes round the block."), ns: L("Сдержанный отзыв.", "A lukewarm review."), set: p => p.f.critic = true, setNo: p => p.f.critic = true },
    { l: L("Новое, рискованное", "Something new and risky"), tags: ["art", "risk"], ch: () => .4, yes: { m: 16, j: 12 }, no: { m: -6, j: -6 }, ys: L("Твоё имя в путеводителе для гурманов.", "Your name in the gourmet guide."), ns: L("«Смело, но несъедобно».", "\"Bold, but inedible.\""), set: p => { p.f.critic = true; p.f.starChef = true; }, setNo: p => p.f.critic = true },
  ]},

  // ===== Армия =====
  { id: "officer", prio: true, from: 19, to: 35, if: p => p.job === "soldier" && !p.f.officerTried, t: L("Офицерская школа", "Officer school"), q: () => L("Командир советует поступать в офицерскую школу.", "Your commander suggests officer school."), o: [
    { l: L("Поступать", "Apply"), tags: ["study", "work"], ch: p => .35 + p.r.k / 200, yes: { k: 8, m: 6 }, no: { j: -3 }, ys: L("Лейтенантские погоны.", "Lieutenant's insignia."), ns: L("Не прошёл по баллам.", "Your scores fell short."), set: p => { p.f.officerTried = true; setJob(p, "officer"); }, setNo: p => p.f.officerTried = true },
    { l: L("Отслужить и уйти", "Serve your term and leave"), ch: () => 1, yes: { t: 4 }, ys: L("Дисциплина осталась на всю жизнь.", "The discipline stayed for life."), set: p => { p.f.officerTried = true; setJob(p, pickBasicJob(p)); } },
  ]},
  { id: "mission", heavy: true, from: 20, to: 50, if: p => ["soldier", "officer"].includes(p.job) && !p.f.mission, t: L("Миссия", "The mission"), q: () => L("Набирают добровольцев в миротворческую миссию за границей.", "Volunteers are needed for a peacekeeping mission abroad."), o: [
    { l: L("Поехать", "Go"), tags: ["risk", "move"], ch: p => .55 + p.r.h / 400, yes: { m: 14, k: 4, t: -6 }, no: { h: -16, j: -10 }, ys: L("Вернулся целым. С медалью и тишиной внутри.", "You came back in one piece. With a medal and a quiet inside."), ns: L("Ранение. Долгий путь домой.", "Wounded. A long road home."), set: p => { p.f.mission = true; p.f.veteran = true; }, setNo: p => { p.f.mission = true; p.f.veteran = true; } },
    { l: L("Остаться дома", "Stay home"), ch: () => 1, yes: { t: 4 }, ys: L("Служба продолжается здесь.", "Your service continues here."), set: p => p.f.mission = true },
  ]},
  { id: "veterans", from: 40, to: 90, repeat: 15, if: p => p.f.veteran, t: L("Сослуживцы", "Old comrades"), q: () => L("Сослуживцы собираются, как каждый год.", "Your old unit is getting together, like every year."), o: [
    { l: L("Поехать на встречу", "Go to the reunion"), tags: ["social"], ch: () => 1, yes: { t: 8, j: 6 }, ys: L("Пели старые песни до утра.", "You sang the old songs until morning.") },
    { l: L("Помогать тем, кому тяжелее", "Help those who have it harder"), tags: ["care"], ch: () => 1, yes: { t: 6, j: 4, m: -4 }, ys: L("Ты нужен им. Они нужны тебе.", "They need you. You need them.") },
  ]},

  // ===== Стартап =====
  { id: "startup", from: 22, to: 48, if: p => (p.job === "it" || p.f.coder) && !p.f.startupTried && p.c.d > .3, t: L("Стартап", "The startup"), q: () => L("Однокурсник зовёт делать своё приложение.", "A classmate wants you to build an app together."), o: [
    { l: L("Уйти с работы ради стартапа", "Quit your job for it"), tags: ["business", "risk"], ch: p => .35 + p.r.k / 300, yes: { j: 8, m: -4, k: 6 }, no: { m: -10, j: -6 }, ys: L("Первая версия готова. Первые пользователи довольны.", "Version one is out. The first users love it."), ns: L("Идея не взлетела.", "The idea never took off."), set: p => { p.f.startupTried = true; p.f.startup = true; setJob(p, "business"); p.f.biz = p.f.biz || 1; }, setNo: p => p.f.startupTried = true },
    { l: L("Помогать по вечерам", "Help in the evenings"), tags: ["work"], ch: () => 1, yes: { k: 4, h: -2 }, ys: L("Без риска, но и без доли.", "No risk, but no stake either."), set: p => p.f.startupTried = true },
  ]},
  { id: "funding", prio: true, from: 23, to: 55, if: p => p.f.startup && !p.f.fundTried, t: L("Инвесторы", "Investors"), q: () => L("Инвестор готов дать денег, но хочет треть компании.", "An investor will put in money, but wants a third of the company."), o: [
    { l: L("Взять деньги", "Take the money"), tags: ["business"], ch: () => .8, yes: { m: 10, j: 6 }, no: { j: -4 }, ys: L("Команда выросла до тридцати человек.", "The team grew to thirty people."), ns: L("Инвестор передумал в последний момент.", "The investor backed out at the last minute."), set: p => { p.f.fundTried = true; p.f.funded = true; p.f.biz = Math.max(p.f.biz || 1, 2); }, setNo: p => p.f.fundTried = true },
    { l: L("Расти на свои", "Grow on your own"), tags: ["business", "risk"], ch: p => .3 + p.r.k / 300, yes: { m: 8, j: 8 }, no: { m: -8, j: -4 }, ys: L("Медленно, зато всё твоё.", "Slow, but it's all yours."), ns: L("Деньги кончились раньше, чем пришли клиенты.", "The money ran out before customers came."), set: p => { p.f.fundTried = true; p.f.funded = true; }, setNo: p => p.f.fundTried = true },
  ]},
  { id: "exit", prio: true, from: 26, to: 60, if: p => p.f.funded && !p.f.exitTried, t: L("Предложение", "The offer"), q: () => L("Большая компания хочет купить твой стартап.", "A big company wants to buy your startup."), o: [
    { l: L("Продать", "Sell"), tags: ["business"], ch: () => .85, yes: { m: 30, j: 8 }, no: { m: 6, j: -4 }, ys: L("Сделка века. Можно больше никогда не работать.", "The deal of a lifetime. You never have to work again."), ns: L("Сделку урезали вдвое.", "The deal was cut in half."), set: p => { p.f.exitTried = true; p.f.exit = true; p.job = null; p.f.biz = 0; }, setNo: p => { p.f.exitTried = true; p.job = null; p.f.biz = 0; } },
    { l: L("Идти до конца", "Go all the way"), tags: ["business", "risk"], ch: p => .3 + p.r.k / 400, yes: { m: 20, j: 10, h: -4 }, no: { m: -16, j: -8 }, ys: L("Компания стала лидером рынка.", "The company became the market leader."), ns: L("Конкуренты обошли. Пришлось закрыться.", "Competitors overtook you. You had to close."), set: p => { p.f.exitTried = true; p.f.biz = 3; }, setNo: p => { p.f.exitTried = true; p.f.biz = 1; } },
  ]},

  // ===== Школа =====
  { id: "hardclass", from: 24, to: 58, if: p => p.job === "teacher" && !p.f.hardClass, t: L("Трудный класс", "The tough class"), q: () => L("Тебе дали класс, от которого отказались все.", "You got the class everyone else refused."), o: [
    { l: L("Найти подход к каждому", "Reach each kid"), tags: ["care", "social"], ch: p => .4 + p.r.t / 250, yes: { t: 10, j: 8, h: -2 }, no: { j: -6, h: -3 }, ys: L("Через год это лучший класс школы.", "A year later it's the best class in school."), ns: L("Не получилось. Выгорел.", "It didn't work. You burned out."), set: p => { p.f.hardClass = true; p.f.mentor = true; }, setNo: p => p.f.hardClass = true },
    { l: L("Строгая дисциплина", "Strict discipline"), tags: ["work"], ch: () => .6, yes: { k: 3, j: 2 }, no: { j: -5 }, ys: L("Тишина на уроках. Уважение, но не любовь.", "Silence in class. Respect, if not love."), ns: L("Бунт на задней парте.", "A revolt in the back row."), set: p => p.f.hardClass = true, setNo: p => p.f.hardClass = true },
  ]},
  { id: "principal", from: 40, to: 63, if: p => p.job === "teacher" && p.jobLvl >= 2 && !p.f.principal, t: L("Директор", "Head teacher"), q: () => L("Тебя предлагают назначить директором школы.", "You're offered the head teacher's job."), o: [
    { l: L("Согласиться", "Accept"), tags: ["work", "social"], ch: () => .65, yes: { m: 6, t: 4, h: -3 }, no: { j: -3 }, ys: L("В школе наконец новая крыша и компьютерный класс.", "The school finally gets a new roof and a computer lab."), ns: L("Назначили человека из управления.", "They appointed someone from the district office."), set: p => { p.f.principal = true; p.jobLvl = 3; }, setNo: p => p.f.principal = true },
    { l: L("Остаться в классе", "Stay in the classroom"), ch: () => 1, yes: { j: 4 }, ys: L("Дети важнее бумаг.", "The kids matter more than paperwork."), set: p => p.f.principal = true },
  ]},

  // ===== Спорт =====
  { id: "olympics", prio: true, from: 18, to: 34, if: p => p.job === "athlete" && !p.f.olyTried, t: L("Сборная", "National team"), q: () => L("Тебя взяли в сборную страны. Впереди большие игры.", "You made the national team. The big games are ahead."), o: [
    { l: L("Бороться за медаль", "Go for a medal"), tags: ["sport", "risk"], ch: p => .15 + p.r.h / 300 + .1 * p.c.d, yes: { j: 16, m: 14, t: 6 }, no: { j: -6, h: -4 }, ys: L("Медаль! Гимн, флаг и слёзы.", "A medal! The anthem, the flag and tears."), ns: L("Четвёртое место. Самое обидное.", "Fourth place. The cruelest one."), set: p => { p.f.olyTried = true; p.f.medal = true; p.f.famous = true; }, setNo: p => p.f.olyTried = true },
    { l: L("Просто участвовать", "Just take part"), tags: ["sport"], ch: () => 1, yes: { j: 8, t: 3 }, ys: L("Ты был там. Это навсегда.", "You were there. That's forever."), set: p => p.f.olyTried = true },
  ]},
  { id: "coachcareer", prio: true, from: 31, to: 50, if: p => p.job === "athlete" && p.age >= 31 && !p.f.coachDecided, t: L("Конец карьеры", "Hanging up the boots"), q: () => L("Тело говорит, что пора заканчивать.", "Your body says it's time to stop."), o: [
    { l: L("Стать тренером", "Become a coach"), tags: ["sport", "social"], ch: () => .8, yes: { t: 8, j: 6 }, no: { j: -3 }, ys: L("Твои ученики уже выигрывают.", "Your students are already winning."), ns: L("Места тренера не нашлось.", "No coaching job opened up."), set: p => { p.f.coachDecided = true; setJob(p, "coach"); p.f.mentor = true; }, setNo: p => { p.f.coachDecided = true; setJob(p, pickMidJob(p)); } },
    { l: L("Начать с нуля в другом деле", "Start over in something else"), tags: ["study"], ch: () => .7, yes: { k: 6, m: 2 }, no: { m: -4 }, ys: p => L(`Новое дело: ${jobName(p).toLowerCase()}.`, `A new path: ${jobName(p).toLowerCase()}.`), ns: L("Тяжело начинать заново.", "Starting over is hard."), set: p => { p.f.coachDecided = true; setJob(p, pickMidJob(p)); }, setNo: p => p.f.coachDecided = true },
  ]},

  // ===== Земля =====
  { id: "land", from: 25, to: 60, if: p => p.job === "farmer" && !p.f.landDone, t: L("Земля", "The land"), q: () => L("Сосед продаёт свой участок.", "Your neighbor is selling his land."), o: [
    { l: L("Купить и расшириться", "Buy it and expand"), tags: ["business", "risk"], ch: p => .3 + p.r.m / 200, yes: { m: 12, h: -3 }, no: { m: -10, j: -4 }, ys: L("Теперь у тебя работают трое.", "Now three people work for you."), ns: L("Взяли кредит, а урожай подвёл.", "You took a loan, and the harvest failed."), set: p => { p.f.landDone = true; p.jobLvl = Math.min(3, p.jobLvl + 1); }, setNo: p => p.f.landDone = true },
    { l: L("Кооператив с соседями", "Form a co-op with neighbors"), tags: ["social"], ch: () => .7, yes: { m: 8, t: 8 }, no: { t: -4 }, ys: L("Вместе купили трактор.", "Together you bought a tractor."), ns: L("Поссорились из-за делёжки.", "You fell out over the split."), set: p => p.f.landDone = true, setNo: p => p.f.landDone = true },
    { l: L("Жить как жили", "Carry on as before"), ch: () => 1, yes: { j: 2 }, ys: L("Своего хватает.", "What you have is enough."), set: p => p.f.landDone = true },
  ]},
  { id: "seeds", from: 22, to: 70, repeat: 15, if: p => p.job === "farmer", t: L("Семена", "Seeds"), q: () => L("Агроном предлагает новый сорт: урожайнее, но дороже.", "An agronomist offers a new variety: higher yield, but pricier."), o: [
    { l: L("Посеять новый сорт", "Plant the new variety"), tags: ["study", "risk"], ch: p => .4 + p.r.k / 250, yes: { m: 10, k: 3 }, no: { m: -8 }, ys: L("Урожай вдвое больше.", "Double the harvest."), ns: L("Новый сорт не прижился.", "The new variety didn't take."), set: p => p.f.goodHarvest = true },
    { l: L("Сеять по-старому", "Stick with the old seed"), ch: () => 1, yes: { m: 3 }, ys: L("Дедовский способ не подводит.", "Grandfather's way never fails.") },
  ]},
  { id: "mobilemoney", from: 18, to: 65, if: p => (p.c.part === "Африка" || p.c.part === "Азия") && p.c.d < .55 && !p.f.mobileMoney, t: L("Телефон-кошелёк", "Mobile money"), q: () => L("Теперь деньги можно хранить и переводить прямо в телефоне.", "Now you can keep and send money right on your phone."), o: [
    { l: L("Попробовать", "Try it"), tags: ["study"], ch: () => .85, yes: { m: 6, k: 3 }, no: { m: -3 }, ys: L("Брат в городе получил деньги за минуту.", "Your brother in the city got the money in a minute."), ns: L("Перевёл не тому номеру.", "You sent it to the wrong number."), set: p => p.f.mobileMoney = true },
    { l: L("Держать деньги под матрасом", "Keep cash under the mattress"), ch: () => 1, yes: {}, ys: L("Надёжнее некуда.", "Nothing safer."), set: p => p.f.mobileMoney = true },
  ]},
  { id: "solar", from: 20, to: 75, if: p => p.c.d < .45 && !p.f.solar && p.r.m >= 15, t: L("Солнечная панель", "Solar panel"), q: () => L("Электричество бывает два часа в день. Продают солнечные панели в рассрочку.", "Power comes two hours a day. Solar panels are sold on installments."), o: [
    { l: L("Купить", "Buy one"), tags: ["business"], ch: () => .85, yes: { j: 6, k: 3, m: -5 }, no: { m: -5 }, ys: L("Дети делают уроки при свете.", "The kids do homework with the light on."), ns: L("Панель сломалась через месяц.", "The panel broke after a month."), set: p => p.f.solar = true },
    { l: L("Обойтись свечами", "Make do with candles"), ch: () => 1, yes: { m: 2 }, ys: L("Как всегда.", "Same as ever."), set: p => p.f.solar = true },
  ]},

  // ===== Небо, дорога, газета =====
  { id: "pilot", from: 18, to: 30, if: p => p.r.k >= 55 && p.r.h >= 50 && p.c.d > .4 && !p.f.pilotTried, t: L("Лётное училище", "Flight school"), q: () => L("Авиакомпания набирает курсантов.", "An airline is recruiting cadets."), o: [
    { l: L("Поступать", "Apply"), tags: ["study", "risk"], ch: p => .2 + p.r.k / 250 + p.r.h / 400, yes: { k: 10, m: 8, j: 8 }, no: { j: -4 }, ys: L("Первый самостоятельный вылет. Город под крылом.", "Your first solo flight. The city beneath your wing."), ns: L("Не прошёл медкомиссию.", "Failed the medical."), set: p => { p.f.pilotTried = true; setJob(p, "pilot"); }, setNo: p => p.f.pilotTried = true },
    { l: L("Небо подождёт", "The sky can wait"), ch: () => 1, yes: {}, ys: L("Будешь летать пассажиром.", "You'll fly as a passenger."), set: p => p.f.pilotTried = true },
  ]},
  { id: "taxi", from: 20, to: 60, if: p => p.f.license && (!p.job || p.job === "worker") && !p.f.taxiTried, t: L("За рулём", "Behind the wheel"), q: () => L("Знакомый продаёт машину и советует таксовать.", "A friend is selling a car and says you should drive a taxi."), o: [
    { l: L("Стать водителем", "Become a driver"), tags: ["work"], ch: () => .85, yes: { m: 7, t: 2 }, no: { m: -5 }, ys: L("Знаешь город лучше навигатора.", "You know the city better than the GPS."), ns: L("Машина постоянно ломалась.", "The car kept breaking down."), set: p => { p.f.taxiTried = true; setJob(p, "driver"); p.f.car = true; }, setNo: p => p.f.taxiTried = true },
    { l: L("Нет", "No"), ch: () => 1, yes: {}, ys: L("Пешком полезнее.", "Walking is healthier."), set: p => p.f.taxiTried = true },
  ]},
  { id: "newsroom", from: 21, to: 42, if: p => p.r.k >= 55 && !p.f.journoTried && !["doctor", "scientist", "politician"].includes(p.job), t: L("Редакция", "The newsroom"), q: () => L("Местная газета ищет корреспондента.", "The local paper needs a reporter."), o: [
    { l: L("Пойти в журналистику", "Become a journalist"), tags: ["study", "social"], ch: () => .7, yes: { k: 6, t: 4, j: 4 }, no: { j: -3 }, ys: L("Первая статья на первой полосе.", "Your first story on the front page."), ns: L("Взяли стажёра с опытом.", "They took an intern with experience."), set: p => { p.f.journoTried = true; setJob(p, "journalist"); }, setNo: p => p.f.journoTried = true },
    { l: L("Писать только для себя", "Write just for yourself"), ch: () => 1, yes: { k: 2 }, ys: L("Блокнот всегда в кармане.", "The notebook stays in your pocket."), set: p => p.f.journoTried = true },
  ]},
  { id: "investigation", heavy: true, prio: true, from: 24, to: 65, if: p => p.job === "journalist" && !p.f.investigation, t: L("Расследование", "The exposé"), q: () => L("Источник принёс документы о воровстве в мэрии.", "A source brings documents about theft at city hall."), o: [
    { l: L("Публиковать", "Publish"), tags: ["risk"], ch: p => .3 + .4 * p.c.d, yes: { j: 10, t: 6, k: 4 }, no: { j: -8, m: -8, h: -4 }, ys: L("Чиновников уволили. Тебе дали премию.", "The officials were fired. You won an award."), ns: L("Газету закрыли, а тебе угрожали.", "The paper was shut down and you were threatened."), set: p => { p.f.investigation = true; if (rng() < .35) p.f.famous = true; }, setNo: p => { p.f.investigation = true; p.job = null; } },
    { l: L("Не рисковать", "Don't risk it"), ch: () => 1, yes: { j: -4 }, ys: L("Документы до сих пор лежат в ящике.", "The documents are still in a drawer."), set: p => p.f.investigation = true },
  ]},

  // ===== Деньги =====
  { id: "crypto", from: 20, to: 65, if: p => p.c.d > .3 && p.r.m >= 25 && !p.f.cryptoDone, t: L("Криптовалюта", "Crypto"), q: () => L("Друг разбогател на криптовалюте и уговаривает вложиться.", "A friend got rich on crypto and wants you to buy in."), o: [
    { l: L("Вложить всё", "Go all in"), tags: ["risk"], ch: () => .3, yes: { m: 25, j: 6 }, no: { m: -20, j: -10 }, ys: L("Курс улетел вверх. Ты успел продать.", "The price shot up. You sold in time."), ns: L("Курс рухнул за одну ночь.", "It crashed overnight."), set: p => p.f.cryptoDone = true, setNo: p => p.f.cryptoDone = true },
    { l: L("Чуть-чуть, на пробу", "Just a little, to try"), tags: ["risk"], ch: () => .5, yes: { m: 6 }, no: { m: -4 }, ys: L("Небольшой плюс.", "A small gain."), ns: L("Небольшой минус. Урок усвоен.", "A small loss. Lesson learned."), set: p => p.f.cryptoDone = true, setNo: p => p.f.cryptoDone = true },
    { l: L("Не верю", "Don't trust it"), ch: () => 1, yes: { m: 1 }, ys: L("Крепче спишь.", "You sleep better."), set: p => p.f.cryptoDone = true },
  ]},
  { id: "pyramid", from: 20, to: 70, if: p => p.r.m >= 20 && !p.f.pyramidDone, t: L("Выгодное предложение", "A great opportunity"), q: () => L("Соседка рассказывает о фонде: тридцать процентов в месяц, надо только привести друзей.", "A neighbor tells you about a fund: thirty percent a month, you just bring in friends."), o: [
    { l: L("Вложиться и позвать друзей", "Invest and bring friends"), tags: ["risk", "social"], ch: () => .12, yes: { m: 12, t: -4 }, no: { m: -16, t: -10, j: -8 }, ys: L("Успел забрать деньги до краха.", "You got your money out before it collapsed."), ns: L("Фонд исчез. Друзья тоже.", "The fund vanished. So did your friends."), set: p => p.f.pyramidDone = true, setNo: p => { p.f.pyramidDone = true; p.f.scammed = true; } },
    { l: L("Отказаться", "Say no"), ch: () => 1, yes: { k: 2 }, ys: L("Через год о фонде писали в новостях.", "A year later the fund was on the news."), set: p => p.f.pyramidDone = true },
  ]},
  { id: "sidehustle", from: 22, to: 60, repeat: 15, t: L("Вечерняя подработка", "Evening side gig"), q: () => L("Можно подрабатывать по вечерам.", "You could take on evening work."), o: [
    { l: L("Взяться", "Take it"), tags: ["work"], ch: () => .85, yes: { m: 8, h: -3, t: -2 }, no: { h: -3 }, ys: L("Отложили на отпуск.", "Saved up for a vacation."), ns: L("Заказчик пропал, не заплатив.", "The client vanished without paying.") },
    { l: L("Вечера для семьи", "Keep evenings for family"), tags: ["social"], ch: () => 1, yes: { t: 4, j: 2 }, ys: L("Ужин всегда вместе.", "Dinner together, always.") },
  ]},
  { id: "rentout", from: 35, to: 85, if: p => p.f.house && p.r.m < 60 && !p.f.rentDone, t: L("Комната", "Spare room"), q: () => L("В доме пустует комната.", "There's an empty room in the house."), o: [
    { l: L("Сдать студенту", "Rent it to a student"), tags: ["business"], ch: () => .8, yes: { m: 8, t: 2 }, no: { m: -2, j: -3 }, ys: L("Студент стал почти членом семьи.", "The student became almost family."), ns: L("Жилец съехал, не заплатив.", "The tenant left without paying."), set: p => p.f.rentDone = true, setNo: p => p.f.rentDone = true },
    { l: L("Оставить для гостей", "Keep it for guests"), ch: () => 1, yes: { t: 2 }, ys: L("Внуки любят эту комнату.", "The grandkids love that room."), set: p => p.f.rentDone = true },
  ]},
  { id: "car", from: 22, to: 65, if: p => !p.f.car && p.c.d > .25 && p.r.m >= 35, t: L("Машина", "A car"), q: () => L("Можно купить машину.", "You could buy a car."), o: [
    { l: L("Новую в кредит", "New, on credit"), tags: ["risk"], ch: p => .5 + .3 * p.c.d, yes: { j: 8, m: -10 }, no: { j: -3 }, ys: L("Запах нового салона.", "That new car smell."), ns: L("Кредит не одобрили.", "The loan was declined."), set: p => p.f.car = true },
    { l: L("Подержанную за наличные", "Used, for cash"), ch: () => .75, yes: { j: 5, m: -5 }, no: { m: -6, j: -3 }, ys: L("Старушка ещё побегает.", "The old girl still runs."), ns: L("Встала через месяц.", "It died after a month."), set: p => p.f.car = true },
    { l: L("Обойтись без машины", "Do without"), ch: () => 1, yes: { h: 2, m: 2 }, ys: L("Велосипед и метро.", "A bike and the subway.") },
  ]},
  { id: "scamcall", from: 35, to: 100, repeat: 20, w: p => p.age >= 65 ? 1.5 : .5, t: L("Звонок", "The call"), q: () => L("Звонят «из банка»: карту взломали, надо срочно назвать код из СМС.", "Someone calls \"from the bank\": your card's been hacked, read out the code from the text right now."), o: [
    { l: L("Назвать код", "Read out the code"), tags: ["risk"], ch: () => .05, yes: {}, no: { m: -14, j: -8 }, ys: L("Это и правда был банк. Повезло.", "It really was the bank. Lucky."), ns: L("Деньги ушли за минуту.", "The money was gone in a minute."), setNo: p => p.f.scammed = true },
    { l: L("Положить трубку и позвонить в банк", "Hang up and call the bank"), tags: ["study"], ch: () => 1, yes: { k: 2, j: 2 }, ys: L("В банке сказали: вы молодец.", "The bank said: well done.") },
  ]},
  { id: "ticket", from: 18, to: 95, repeat: 10, w: .6, t: L("Лотерейный билет", "Lottery ticket"), q: () => L("На кассе продают лотерейные билеты.", "They're selling lottery tickets at the checkout."), o: [
    { l: L("Купить один", "Buy one"), tags: ["risk"], ch: () => .04, yes: { m: 20, j: 10 }, no: { m: -1 }, ys: L("Выигрыш! Не миллион, но всё же.", "A win! Not a million, but still."), ns: L("Мимо. Как всегда.", "Nothing. As usual."), set: p => p.f.ticketWin = true },
    { l: L("Не тратить деньги", "Don't waste money"), ch: () => 1, yes: {}, ys: L("Шанс один на миллион. Ты знаешь статистику.", "The odds are one in a million. You know the statistics.") },
  ]},
  { id: "factory", from: 16, to: 35, if: p => p.c.part === "Азия" && p.c.d > .25 && p.c.d < .65 && !p.f.factory && !p.f.uni, t: L("Фабрика", "The factory"), q: () => L("В большом городе фабрики набирают тысячи людей. Общежитие и смены по двенадцать часов.", "Factories in the big city are hiring thousands. Dorm beds and twelve-hour shifts."), o: [
    { l: L("Поехать", "Go"), tags: ["work", "move"], ch: () => .8, yes: { m: 10, h: -4, t: -6 }, no: { m: -2, h: -4 }, ys: L("Каждый месяц отправляешь деньги родителям.", "Every month you send money to your parents."), ns: L("Работы оказалось меньше, чем обещали.", "There was less work than promised."), set: p => { p.f.factory = true; setJob(p, "worker"); } },
    { l: L("Остаться в родном городе", "Stay in your home town"), ch: () => 1, yes: { t: 4 }, ys: L("Меньше денег, больше своих.", "Less money, more of your own people."), set: p => p.f.factory = true },
  ]},
  { id: "tontine", from: 18, to: 70, if: p => p.c.d < .5 && !p.f.tontine, t: L("Касса взаимопомощи", "Savings circle"), q: () => L("Соседи раз в месяц скидываются в общий котёл, и по очереди каждый забирает всё.", "Every month the neighbors pool money, and each takes the whole pot in turn."), o: [
    { l: L("Вступить", "Join"), tags: ["social"], ch: p => .7 + p.r.t / 500, yes: { m: 8, t: 6 }, no: { m: -6, t: -4 }, ys: L("На свою очередь купил швейную машинку.", "When your turn came, you bought a sewing machine."), ns: L("Казначей сбежал с деньгами.", "The treasurer ran off with the money."), set: p => p.f.tontine = true, setNo: p => p.f.tontine = true },
    { l: L("Копить самому", "Save on your own"), ch: () => 1, yes: { m: 3 }, ys: L("Медленнее, зато спокойнее.", "Slower, but calmer."), set: p => p.f.tontine = true },
  ]},
);
})();
