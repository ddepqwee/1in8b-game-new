// Сквозные линии: люди и решения, которые возвращаются через годы.
// 1) Сквозные герои: соперник с детства, первая любовь, лучший друг, малыш из драки.
// 2) Последствия: что сделал в детстве или молодости, отзывается через 15–30 лет.
// 3) Династия глубже: семейное дело, родовой дом, реликвия, слава фамилии (переходят детям).
// Тексты на двух языках: L("по-русски", "in English"). Подключается после content-eras.js.
(() => {
const L = window.tr;
const he = (p, m, f) => p.sex === "f" ? f : m;
const sx = (o, m, f) => o.sex === "f" ? f : m;
const since = (p, k) => p.f[k] == null ? -1 : p.age - p.f[k];
const someone = (p, sex) => ({ first: pick(nameSet(p.home.reg)[sex]), sex, alive: true });
const other = p => p.sex === "f" ? "m" : "f";
const working = p => p.job && !p.retired;
// дописать действие к варианту существующей карточки, не трогая его текст
const hook = (id, i, yes, no) => {
  const c = window.CARDS.find(x => x.id === id), o = c && c.o[i];
  if (!o) return;
  if (yes) { const s = o.set; o.set = p => { if (s) s(p); yes(p); }; }
  if (no) { const s = o.setNo; o.setNo = p => { if (s) s(p); no(p); }; }
};

// ---------- 1. Сквозные герои ----------
// первая любовь запоминается по имени
const flame = p => { if (!p.flame) p.flame = { ...someone(p, other(p)), age: p.age }; };
hook("crush", 0, flame);
hook("firstkiss", 0, flame);
// малыш из драки вырастет
hook("fight", 0, p => p.f.protege = p.age, p => p.f.protege = p.age);
// последствия детства и молодости
hook("window", 0, p => p.f.honestKid = p.age, p => p.f.honestKid = p.age);
hook("window", 1, null, p => p.f.windowRun = p.age);
hook("orchard", 1, p => p.f.orchardHelp = p.age);
hook("volunteerabroad", 0, p => p.f.volunteered = p.age);
hook("layoffs", 0, p => p.f.stoodAside = p.age);
hook("pen", 0, p => p.f.penAt = p.age);

const rvNew = p => p._rv || (p._rv = someone(p, p.sex));
const rv = p => p.rival.first, fl = p => p.flame.first, fr = p => p.friend.first;
window.CARDS.push(
  // --- соперник ---
  { id: "rival", ic: "🏁", from: 6, to: 14, if: p => !p.rival && p.f.school !== false, w: 1.4, t: L("Соперник", "The rival"), q: p => { rvNew(p); return L(`${rvNew(p).first} всегда на шаг впереди: лучшие оценки, быстрее на физре, громче на перемене.`, `${rvNew(p).first} is always one step ahead: better grades, faster in gym, louder at recess.`); }, o: [
    { l: L("Обогнать любой ценой", "Beat them, whatever it takes"), tags: ["study", "risk"], ch: () => .5, yes: { k: 8, j: 4 }, no: { k: 4, j: -4 }, ys: p => L(`В этот раз первым был ты. ${rvNew(p).first} смотрел${sx(rvNew(p), "", "а")} волком.`, `This time you came first. ${rvNew(p).first} glared at you.`), ns: L("Второе место. Опять.", "Second place. Again."), set: p => { p.rival = { ...rvNew(p), score: 1 }; }, setNo: p => { p.rival = { ...rvNew(p), score: -1 }; } },
    { l: L("Предложить дружбу", "Offer friendship"), tags: ["social"], ch: () => .4, yes: { t: 8, j: 4 }, no: { j: -3 }, ys: p => L(`${rvNew(p).first} удивил${sx(rvNew(p), "ся", "ась")}, но руку пожал${sx(rvNew(p), "", "а")}.`, `${rvNew(p).first} was surprised, but shook your hand.`), ns: L("«Ещё чего». Соперничество только начинается.", "\"As if.\" The rivalry has only begun."), set: p => { if (!p.friend) p.friend = rvNew(p); else p.f.rivalFriend = true; }, setNo: p => { p.rival = { ...rvNew(p), score: 0 }; } },
    { l: L("Не обращать внимания", "Ignore them"), ch: () => 1, yes: { j: 1 }, ys: L("У каждого своя дорога. Но имя ты запомнил.", "Everyone has their own road. But you remembered the name."), set: p => { p.rival = { ...rvNew(p), score: 0 }; } },
  ]},
  { id: "rival2", ic: "🏁", from: 25, to: 45, if: p => p.rival && p.rival.alive && working(p), w: 1.6, t: L("Снова он", "Them again"), q: p => L(`На новой работе знакомое лицо. ${rv(p)}. И вы претендуете на одно место.`, `A familiar face at the new job. ${rv(p)}. And you're up for the same position.`), o: [
    { l: L("Работать вдвое больше", "Work twice as hard"), tags: ["work"], ch: p => .4 + p.r.k / 250 + p.rival.score * .05, yes: { m: 10, j: 6, h: -3 }, no: { j: -6, h: -3 }, ys: L("Должность твоя. Детский счёт сравнялся.", "The job is yours. The childhood score is evened."), ns: p => L(`${rv(p)} опять первым. Как в пятом классе.`, `${rv(p)} wins again. Just like in fifth grade.`), set: p => { p.rival.score++; p.jobLvl++; }, setNo: p => p.rival.score-- },
    { l: L("Предложить работать вместе", "Suggest working together"), tags: ["social"], ch: () => .55, yes: { t: 8, m: 5 }, no: { t: -2 }, ys: L("Вдвоём вы обошли весь отдел.", "Together you outran the whole department."), ns: L("Вежливый отказ. Холодный кофе.", "A polite no. Cold coffee."), set: p => p.rival.allied = true },
  ]},
  { id: "rival3", ic: "🏁", from: 50, to: 70, if: p => p.rival && p.rival.alive, w: 1.4, t: L("Звонок через годы", "A call across the years"), q: p => L(`Звонит ${rv(p)}. Голос другой, тише. Болезнь, просит помочь найти врача.`, `${rv(p)} calls. The voice is different, quieter. An illness; asks for help finding a doctor.`), o: [
    { l: L("Бросить всё и помочь", "Drop everything and help"), tags: ["care"], ch: () => .7, yes: { t: 10, j: 6, m: -4 }, no: { j: -4, m: -4 }, ys: L("Врача нашли. Вы проговорили до ночи и смеялись над старым.", "You found the doctor. You talked late into the night, laughing about the old days."), ns: L("Помочь не успели, но ты был рядом.", "You couldn't save the day, but you were there."), set: p => p.rival.peace = true, setNo: p => { p.rival.peace = true; p.rival.alive = false; } },
    { l: L("Дать телефон и попрощаться", "Give a number and say goodbye"), ch: () => 1, yes: { k: 1 }, ys: L("Каждый остался при своём.", "Each kept to their own."), set: p => p.rival.cold = true },
  ]},
  { id: "rival4", ic: "🏁", from: 75, to: 95, if: p => p.rival && p.rival.alive, w: 2, t: L("Последний забег", "The last race"), q: p => L(`Встреча выпускников. Пришли двое: ты и ${rv(p)}.`, `The class reunion. Only two showed up: you and ${rv(p)}.`), o: [
    { l: L("Наперегонки до скамейки", "Race to the bench"), tags: ["risk"], ch: p => .3 + p.r.h / 200, yes: { j: 12, t: 6 }, no: { j: 8, h: -2 }, ys: L("Пришли одновременно. Ничья спустя семьдесят лет.", "A dead heat. A draw, seventy years on."), ns: L("Ты споткнулся, и вы хохотали до слёз.", "You stumbled and you both laughed till you cried."), set: p => p.rival.peace = true, setNo: p => p.rival.peace = true },
    { l: L("Признать, что без него было бы скучно", "Admit life would have been dull without them"), tags: ["social"], ch: () => 1, yes: { t: 10, j: 8 }, ys: p => L(`«Без тебя тоже», — сказал${sx(p.rival, "", "а")} ${rv(p)}.`, `"Same here," said ${rv(p)}.`), set: p => p.rival.peace = true },
  ]},

  // --- первая любовь ---
  { id: "flame", ic: "💌", from: 35, to: 65, if: p => p.flame && !p.f.flameMet && p.age - p.flame.age >= 20, w: 2, t: L("Первая любовь", "First love"), q: p => L(`На вокзале кто-то окликает тебя по-школьному. ${fl(p)}. Столько лет.`, `At the station someone calls your school nickname. ${fl(p)}. After all these years.`), o: [
    { l: L("Выпить кофе и вспомнить всё", "Have coffee and remember it all"), tags: ["social"], ch: () => 1, yes: { j: 10, t: 4 }, ys: L("Поезд ушёл, а вы всё сидели.", "Your train left, and you kept sitting there."), set: p => p.f.flameMet = true },
    { l: L("Начать всё сначала", "Start over together"), if: p => !p.married && !p.partner, tags: ["love", "risk"], ch: () => .55, yes: { j: 16, t: 10 }, no: { j: -6 }, ys: p => L(`Через месяц ${fl(p)} переехал${sx(p.flame, "", "а")} к тебе. Будто и не расставались.`, `A month later ${fl(p)} moved in. As if you'd never parted.`), ns: L("Слишком разные жизни. Но тепло осталось.", "Lives too different now. But the warmth stayed."), set: p => { p.f.flameMet = true; p.f.flameBack = true; p.partner = { first: p.flame.first, last: p.last, sex: p.flame.sex }; p.married = true; }, setNo: p => p.f.flameMet = true },
    { l: L("Сделать вид, что не узнал", "Pretend not to recognize them"), ch: () => 1, yes: { j: -2 }, ys: L("Весь день думал, правильно ли.", "You wondered all day if you'd done right."), set: p => p.f.flameMet = true },
  ]},
  { id: "flamelate", ic: "💌", from: 70, to: 95, if: p => p.flame && p.f.flameMet && !p.f.flameBack && !p.married && !p.f.flameLate, w: 1.2, t: L("Письмо", "A letter"), q: p => L(`Конверт без обратного адреса. Почерк ${fl(p)}: «Я так и не сказал${sx(p.flame, "", "а")} тебе спасибо».`, `An envelope with no return address. ${fl(p)}'s handwriting: "I never said thank you."`), o: [
    { l: L("Ответить длинным письмом", "Write a long reply"), tags: ["social"], ch: () => .8, yes: { j: 10, t: 6 }, no: { j: -2 }, ys: L("Переписка до самого конца. Каждую среду.", "Letters until the very end. Every Wednesday."), ns: L("Ответ вернулся: адресат выбыл.", "The reply came back: recipient moved."), set: p => p.f.flameLate = true, setNo: p => p.f.flameLate = true },
  ]},

  // --- лучший друг ---
  { id: "friendrift", ic: "💢", from: 30, to: 50, if: p => p.friend && p.friend.alive && !p.f.friendRift, w: 1.2, t: L("Ссора", "The falling out"), q: p => L(`Вы с ${fr(p)} наговорили друг другу лишнего. Полгода тишины.`, `You and ${fr(p)} said too much. Six months of silence.`), o: [
    { l: L("Позвонить первым", "Call first"), tags: ["social"], ch: () => .75, yes: { t: 8, j: 6 }, no: { t: -4, j: -4 }, ys: L("«Я тоже хотел позвонить». Обоим стало легче.", "\"I was about to call too.\" You both breathed out."), ns: L("Трубку не взяли. Ты попробуешь ещё.", "No answer. You'll try again."), set: p => p.f.friendRift = "mend", setNo: p => p.f.friendRift = "open" },
    { l: L("Ждать, кто первый", "Wait for them to call"), ch: () => .4, yes: { t: 4 }, no: { t: -8, j: -6 }, ys: p => L(`${fr(p)} позвонил${sx(p.friend, "", "а")} в твой день рождения.`, `${fr(p)} called on your birthday.`), ns: L("Так и не позвонили. Оба.", "Neither of you ever called."), set: p => p.f.friendRift = "mend", setNo: p => { p.f.friendRift = "lost"; p.friend.lost = true; } },
  ]},
  { id: "friendmend", ic: "🤝", from: 40, to: 75, if: p => p.friend && p.friend.alive && p.f.friendRift === "open" && !p.f.friendMend, prio: true, t: L("Вторая попытка", "Second try"), q: p => L(`Ты стоишь у двери ${fr(p)} с бутылкой и старой фотографией.`, `You're at ${fr(p)}'s door with a bottle and an old photo.`), o: [
    { l: L("Постучать", "Knock"), tags: ["social"], ch: () => .8, yes: { t: 10, j: 10 }, no: { j: -6 }, ys: L("Обнялись прямо на пороге.", "You hugged right there on the doorstep."), ns: L("Дома никого. Ты оставил фото под дверью.", "No one home. You left the photo under the door."), set: p => { p.f.friendMend = true; p.f.friendRift = "mend"; }, setNo: p => p.f.friendMend = true },
  ]},
  { id: "godfriend", ic: "🍼", from: 25, to: 50, if: p => p.friend && p.friend.alive && !p.friend.lost && !p.f.godparent, w: 1, t: L("Крёстный", "Godparent"), q: p => L(`У ${fr(p)} родился ребёнок. Тебя просят стать для него вторым родителем, если что.`, `${fr(p)} had a baby. They ask you to be the guardian, just in case.`), o: [
    { l: L("Согласиться", "Say yes"), tags: ["care"], ch: () => 1, yes: { t: 8, j: 6 }, ys: L("Маленькая ладонь сжала твой палец.", "A tiny hand gripped your finger."), set: p => p.f.godparent = p.age },
    { l: L("Отказаться: не готов", "Decline: not ready"), ch: () => 1, yes: { t: -4 }, ys: L("Друг понял. Или сделал вид.", "Your friend understood. Or pretended to.") },
  ]},
  { id: "godchild", ic: "🎓", from: 45, to: 75, if: p => since(p, "godparent") >= 20, prio: true, t: L("Крестник", "Godchild"), q: () => L("Твой крестник пришёл за советом: куда идти учиться.", "Your godchild came to you for advice: where to study."), o: [
    { l: L("Помочь с учёбой деньгами", "Help pay for school"), if: p => p.r.m >= 30, tags: ["care"], ch: () => 1, yes: { t: 8, j: 6, m: -8 }, ys: L("На выпускном тебя назвали в речи.", "You were named in the graduation speech."), set: p => p.f.godparent = -99 },
    { l: L("Рассказать, как ошибался сам", "Tell them how you got it wrong"), tags: ["social"], ch: () => 1, yes: { t: 6, k: 2 }, ys: L("Слушал, не перебивая. Редкость.", "Listened without interrupting. Rare."), set: p => p.f.godparent = -99 },
  ]},
  { id: "friendbench", ic: "♟", from: 65, to: 95, if: p => p.friend && p.friend.alive && !p.friend.lost, w: 1.4, repeat: 15, t: L("Скамейка", "The bench"), q: p => L(`Вы с ${fr(p)} каждый четверг играете в шахматы в парке.`, `Every Thursday you and ${fr(p)} play chess in the park.`), o: [
    { l: L("Сыграть на интерес", "Play for bragging rights"), tags: ["rest"], ch: () => .5, yes: { j: 8, k: 2 }, no: { j: 4 }, ys: L("Мат в двенадцать ходов. Неделю будешь напоминать.", "Checkmate in twelve. You'll mention it all week."), ns: L("Проиграл, но ворчать приятно.", "You lost, but grumbling is half the fun.") },
    { l: L("Просто болтать", "Just talk"), tags: ["social"], ch: () => 1, yes: { t: 6, j: 4 }, ys: L("Партия не закончена уже третий год.", "This game has been unfinished for three years.") },
  ]},
  { id: "friendback", ic: "🧳", from: 35, to: 80, if: p => p.friend && p.friend.alive && p.f.friendAway && !p.f.friendBack, w: 1.2, t: L("Вернулся", "Back in town"), q: p => L(`${fr(p)} вернул${sx(p.friend, "ся", "ась")} в город. Звонит прямо с вокзала.`, `${fr(p)} is back in town. Calling straight from the station.`), o: [
    { l: L("Встретить с цветами", "Meet them with flowers"), tags: ["social"], ch: () => 1, yes: { t: 10, j: 8 }, ys: L("Будто и не было этих лет.", "As if those years never happened."), set: p => p.f.friendBack = true },
  ]},

  // --- малыш из драки ---
  { id: "protege", ic: "🥊", from: 28, to: 60, if: p => since(p, "protege") >= 18 && !p.f.protegeBack, w: 2.2, t: L("Ты меня не помнишь?", "Don't you remember me?"), q: () => L("Незнакомец в хорошем костюме останавливает тебя на улице: «Вы за меня тогда вступились. Во дворе школы».", "A stranger in a good suit stops you on the street: \"You stood up for me once. In the schoolyard.\""), o: [
    { l: L("Обнять", "Hug him"), tags: ["social"], ch: () => 1, yes: { t: 8, j: 10 }, ys: L("Теперь у него своя фирма. Тебе есть куда позвонить в трудный день.", "He runs his own firm now. You have someone to call on a hard day."), set: p => { p.f.protegeBack = true; p.bonus = p.bonus || {}; p.bonus.tags = p.bonus.tags || {}; p.bonus.tags.work = (p.bonus.tags.work || 0) + .05; } },
    { l: L("Попросить работу", "Ask for a job"), if: p => !working(p) || p.r.m < 35, tags: ["work"], ch: () => .8, yes: { m: 12, j: 6 }, no: { j: -2 }, ys: L("«Завтра в девять, я предупрежу охрану».", "\"Tomorrow at nine, I'll tell security.\""), ns: L("Вакансий нет, но он дал денег на первое время.", "No openings, but he lent you money to get by."), set: p => { p.f.protegeBack = true; if (!working(p)) setJob(p, "official"); }, setNo: p => p.f.protegeBack = true },
  ]},

  // ---------- 2. Последствия через годы ----------
  { id: "neighborjob", ic: "🪟", from: 22, to: 45, if: p => since(p, "honestKid") >= 12 && !p.f.neighborJob, w: 1.8, t: L("Та самая соседка", "That neighbor"), q: () => L("Тебе звонит сын соседки, чьё окно ты когда-то разбил. «Мама говорит, вы честный. У меня как раз ищут человека».", "The son of the neighbor whose window you broke calls. \"Mom says you're honest. We happen to be hiring.\""), o: [
    { l: L("Прийти на собеседование", "Go to the interview"), tags: ["work"], ch: () => .8, yes: { m: 10, j: 6 }, no: { j: -2 }, ys: L("Взяли без испытательного срока. Окно окупилось.", "Hired with no probation. That window paid off."), ns: L("Место заняли, но визитку ты сохранил.", "The spot was taken, but you kept the card."), set: p => { p.f.neighborJob = true; p.jobLvl = Math.max(p.jobLvl, 1) + (working(p) ? 1 : 0); if (!working(p)) setJob(p, "official"); }, setNo: p => p.f.neighborJob = true },
  ]},
  { id: "windowtruth", ic: "🪟", from: 25, to: 60, if: p => since(p, "windowRun") >= 15 && !p.f.windowTruth, w: 1, t: L("Старый должок", "An old debt"), q: () => L("На похоронах соседки её дочь говорит: «Мама всегда знала, что окно разбил ты. Ждала, что придёшь».", "At the neighbor's funeral her daughter says: \"Mom always knew it was you who broke the window. She was waiting for you to come.\""), o: [
    { l: L("Признаться наконец", "Finally own up"), tags: ["social"], ch: () => 1, yes: { t: 6, j: -2 }, ys: L("Поздно, но стало легче.", "Late, but lighter."), set: p => p.f.windowTruth = true },
    { l: L("Промолчать", "Say nothing"), ch: () => 1, yes: { j: -6 }, ys: L("Стекло давно вставили. А осадок остался.", "The glass was replaced long ago. The feeling wasn't."), set: p => p.f.windowTruth = true },
  ]},
  { id: "orchardwill", ic: "🍎", from: 30, to: 70, if: p => since(p, "orchardHelp") >= 20 && !p.f.orchard, w: 2, t: L("Сад по завещанию", "An orchard in the will"), q: () => L("Нотариус зачитывает: «Сад отходит тому, кто в детстве помогал собирать яблоки».", "The notary reads: \"The orchard goes to the child who helped with the apple harvest.\""), o: [
    { l: L("Взять и ухаживать", "Take it and tend it"), tags: ["work"], ch: () => .85, yes: { j: 10, h: 4, m: 4 }, no: { j: 4, m: -4 }, ys: L("Первый урожай раздал всей улице.", "You gave the first harvest to the whole street."), ns: L("Деревья старые, нужно время.", "The trees are old; it'll take time."), set: p => { p.f.orchard = true; p.f.farmLand = p.f.farmLand || true; }, setNo: p => p.f.orchard = true },
    { l: L("Продать участок", "Sell the plot"), ch: () => 1, yes: { m: 12, j: -2 }, ys: L("Яблони спилили через неделю.", "The trees were cut down a week later."), set: p => p.f.orchard = "sold" },
  ]},
  { id: "penmeet", ic: "✉", from: 28, to: 55, if: p => since(p, "penAt") >= 18 && !p.f.penMet, w: 1.8, t: L("Друг по переписке", "The pen pal"), q: () => L("Двадцать лет писем. И вот приглашение: «Приезжай, я покажу тебе мой город».", "Twenty years of letters. And now an invitation: \"Come, I'll show you my city.\""), o: [
    { l: L("Поехать", "Go"), tags: ["move", "social"], ch: () => .85, yes: { j: 12, t: 6, k: 4, m: -6 }, no: { m: -6, j: -2 }, ys: L("Узнали друг друга по почерку на табличке в аэропорту.", "You recognized each other by the handwriting on the airport sign."), ns: L("Визу не дали. Письма продолжаются.", "Visa denied. The letters go on."), set: p => { p.f.penMet = true; p.f.trips = (p.f.trips || 0) + 1; }, setNo: p => p.f.penMet = true },
    { l: L("Позвать к себе", "Invite them over"), tags: ["social"], ch: () => .7, yes: { j: 10, t: 8, m: -3 }, no: { j: -2 }, ys: L("Неделю показывал свой город. Увидел его заново.", "A week showing off your city. You saw it anew."), ns: L("Не смогли прилететь. Может, в следующем году.", "They couldn't fly in. Maybe next year."), set: p => p.f.penMet = true, setNo: p => p.f.penMet = true },
  ]},
  { id: "volunteerback", ic: "🌍", from: 35, to: 70, if: p => since(p, "volunteered") >= 15 && !p.f.volBack, w: 1.8, t: L("Тебя помнят", "They remember you"), q: () => L("Из деревни, где ты был волонтёром, пришло письмо. Девочка, которую ты учил читать, теперь директор школы. Зовёт на открытие.", "A letter from the village where you volunteered. The girl you taught to read is now the headmistress. She invites you to the opening."), o: [
    { l: L("Лететь", "Fly out"), tags: ["move", "care"], ch: () => .9, yes: { j: 14, t: 6, m: -6 }, no: { m: -6 }, ys: L("Над дверью новой школы табличка с твоим именем.", "A plaque with your name hangs over the new school's door."), ns: L("Рейс отменили. Прислали видео.", "The flight was canceled. They sent a video."), set: p => { p.f.volBack = true; p.f.trips = (p.f.trips || 0) + 1; }, setNo: p => p.f.volBack = true },
    { l: L("Отправить книги", "Send books"), tags: ["care"], ch: () => 1, yes: { j: 6, m: -3 }, ys: L("Двести книг. Каждая подписана.", "Two hundred books. Each one signed."), set: p => p.f.volBack = true },
  ]},
  { id: "rehired", ic: "📦", from: 40, to: 66, if: p => since(p, "stoodAside") >= 8 && !p.f.rehired, prio: true, t: L("Тот самый молодой", "That young colleague"), q: () => L("Коллега, ради которого ты когда-то ушёл, теперь руководит компанией. Звонит сам.", "The colleague you once stepped aside for now runs the company. He calls himself."), o: [
    { l: L("Вернуться", "Come back"), tags: ["work"], ch: () => 1, yes: { m: 14, j: 10, t: 4 }, ys: L("«Я обещал себе, что верну долг».", "\"I promised myself I'd repay you.\""), set: p => { p.f.rehired = true; if (!working(p) && !p.retired) setJob(p, p.job || "official"); p.jobLvl = Math.max(p.jobLvl, 2); } },
    { l: L("Поблагодарить и отказаться", "Thank him and decline"), ch: () => 1, yes: { j: 8, t: 4 }, ys: L("Приятно знать, что не зря.", "Good to know it wasn't for nothing."), set: p => p.f.rehired = true },
  ]},
  { id: "tree", ic: "🌱", from: 5, to: 40, if: p => !p.f.tree, w: .9, t: L("Саженец", "The sapling"), q: () => L("Во дворе пустое место. В руках маленький саженец дуба.", "An empty patch in the yard. A tiny oak sapling in your hands."), o: [
    { l: L("Посадить и поливать", "Plant it and water it"), tags: ["care"], ch: () => .75, yes: { j: 5, h: 1 }, no: { j: -2 }, ys: L("Ростом с карандаш. Но живой.", "Pencil-sized. But alive."), ns: L("Засох за лето. Ты посадишь другой.", "It dried out over the summer. You'll plant another."), set: p => p.f.tree = p.age },
    { l: L("Отдать соседям", "Give it to the neighbors"), ch: () => 1, yes: { t: 2 }, ys: L("Пусть растёт у них.", "Let it grow at their place.") },
  ]},
  { id: "treegrown", ic: "🌳", from: 30, to: 99, if: p => since(p, "tree") >= 25 && !p.f.treeGrown, w: 2, t: L("Дуб", "The oak"), q: p => L(`Дуб, который ты посадил в ${p.f.tree ?? 10}, выше крыши. В его тени играют чужие дети.`, `The oak you planted at ${p.f.tree ?? 10} is taller than the roof. Strangers' kids play in its shade.`), o: [
    { l: L("Повесить качели", "Hang a swing"), tags: ["care"], ch: () => 1, yes: { j: 10, t: 4 }, ys: L("Очередь на качели с утра.", "There's a line for the swing every morning."), set: p => p.f.treeGrown = true },
    { l: L("Посидеть под ним одному", "Sit under it alone"), tags: ["rest"], ch: () => 1, yes: { j: 8, h: 2 }, ys: L("Листья шумят так же, как в детстве.", "The leaves rustle just like in childhood."), set: p => p.f.treeGrown = true },
  ]},
  { id: "envelope", ic: "💵", from: 28, to: 55, if: p => working(p) && ["official", "lawyer", "doctor", "engineer", "diplomat", "architect"].includes(p.job) && !p.f.envelope, w: .9, t: L("Конверт", "The envelope"), q: () => L("Посетитель оставляет на столе конверт: «Это чтобы бумаги прошли побыстрее».", "A visitor leaves an envelope on your desk: \"Just so the papers go through faster.\""), o: [
    { l: L("Взять", "Take it"), tags: ["risk"], ch: () => 1, yes: { m: 10, j: -3 }, ys: L("Никто не видел. Пока.", "No one saw. For now."), set: p => p.f.envelope = p.age },
    { l: L("Вернуть и выгнать", "Hand it back and show him out"), ch: () => 1, yes: { t: 2, j: 3 }, ys: L("Неделю ходил гордый и бедный.", "A week of pride and poverty."), set: p => p.f.envelope = "no" },
    { l: L("Сообщить куда следует", "Report it"), tags: ["social", "risk"], ch: () => .6, yes: { t: 6, j: 4 }, no: { t: -6, j: -4 }, ys: L("Посетителя задержали. Тебе вынесли благодарность.", "The visitor was arrested. You got a commendation."), ns: L("Коллеги перестали с тобой здороваться.", "Colleagues stopped greeting you."), set: p => { p.f.envelope = "no"; p.f.honest = true; }, setNo: p => p.f.envelope = "no" },
  ]},
  { id: "envelopeback", ic: "📰", from: 40, to: 75, if: p => typeof p.f.envelope === "number" && p.age - p.f.envelope >= 12 && !p.f.scandal, prio: true, heavy: true, t: L("Старые бумаги", "Old papers"), q: () => L("Журналист раскопал дело пятнадцатилетней давности. В деле твоя подпись.", "A journalist dug up a fifteen-year-old case. Your signature is on it."), o: [
    { l: L("Признать и извиниться", "Admit it and apologize"), tags: ["social"], ch: () => .6, yes: { t: -4, j: -6, m: -6 }, no: { t: -10, j: -10, m: -10 }, ys: L("Штраф и тишина. Люди ценят честность, даже позднюю.", "A fine, then quiet. People value honesty, even late."), ns: L("Уволили. Фамилию полоскали месяц.", "Fired. Your name was dragged for a month."), set: p => p.f.scandal = true, setNo: p => { p.f.scandal = true; p.f.disgrace = true; p.jobLvl = Math.max(1, p.jobLvl - 1); } },
    { l: L("Всё отрицать", "Deny everything"), tags: ["risk"], ch: () => .4, yes: { j: -4 }, no: { t: -12, j: -14, m: -14 }, ys: L("Дело развалилось. Но соседи шепчутся.", "The case fell apart. But the neighbors whisper."), ns: L("Нашлись свидетели. Суд.", "Witnesses came forward. Court."), set: p => p.f.scandal = true, setNo: p => { p.f.scandal = true; p.f.disgrace = true; p.job = null; } },
  ]},

  // ---------- 3. Династия ----------
  { id: "keepsake", ic: "⌚", from: 30, to: 75, if: p => !p.f.relic && !p.heirOf, w: .8, t: L("Вещь для внуков", "Something for the grandkids"), q: () => L("У тебя есть вещь, которую жалко продавать: часы, кольцо, старая книга с пометками.", "There's one thing you'd never sell: a watch, a ring, an old book full of notes."), o: [
    { l: L("Сберечь для детей", "Keep it for the children"), tags: ["care"], ch: () => 1, yes: { j: 4, t: 2 }, ys: L("Завернул в платок и спрятал в шкаф. Пусть ждёт.", "Wrapped it in a handkerchief, hid it in the wardrobe. Let it wait."), set: p => p.f.relic = 1 },
    { l: L("Носить каждый день", "Use it every day"), ch: () => 1, yes: { j: 3 }, ys: L("Вещи нужны, чтобы ими пользоваться.", "Things are meant to be used.") },
  ]},
  { id: "relic", ic: "⌚", from: 18, to: 70, if: p => p.f.relic >= 2 && !p.f.relicSeen, w: 3, t: L("Реликвия рода", "The family relic"), q: p => L(`Тебе достались часы, что передают в семье уже ${p.f.relic || 2} ${(p.f.relic || 2) < 5 ? "поколения" : "поколений"}. Антиквар называет сумму.`, `You inherited the watch that has passed down ${p.f.relic || 2} generations. An antiques dealer names a price.`), o: [
    { l: L("Хранить и передать дальше", "Keep it and pass it on"), tags: ["care"], ch: () => 1, yes: { j: 6, t: 4 }, ys: L("Завёл. Идут.", "You wound it. Still ticking."), set: p => p.f.relicSeen = true },
    { l: L("Продать", "Sell it"), tags: ["business"], ch: () => 1, yes: { m: 18, j: -6 }, ys: L("Деньги кончатся. А часов больше нет.", "The money will run out. The watch is gone."), set: p => { p.f.relicSeen = true; p.f.relic = 0; } },
  ]},
  { id: "familybiz", ic: "🏪", prio: true, from: 18, to: 30, if: p => p.f.famBiz && !p.f.famBizDone, t: L("Семейное дело", "The family business"), q: p => L(`Дело, которое начинали родители, ждёт хозяина. ${p.f.famBizGen > 1 ? `Ему уже ${p.f.famBizGen} поколения.` : ""}`, `The business your parents started needs an owner. ${p.f.famBizGen > 1 ? `It's ${p.f.famBizGen} generations old.` : ""}`), o: [
    { l: L("Встать за прилавок", "Take over"), tags: ["business"], ch: p => .55 + p.r.k / 300, yes: { m: 12, j: 6 }, no: { m: -6, j: -4 }, ys: L("Старые клиенты узнают тебя с порога.", "Old customers recognize you at the door."), ns: L("Первый год в убыток, но вывеска висит.", "A loss the first year, but the sign stays up."), set: p => { setJob(p, "business"); p.f.biz = Math.max(p.f.biz || 1, p.f.famBiz); p.f.famBizDone = true; p.f.famBizGen = (p.f.famBizGen || 1) + 1; }, setNo: p => { setJob(p, "business"); p.f.famBizDone = true; p.f.famBizGen = (p.f.famBizGen || 1) + 1; } },
    { l: L("Продать и жить своей жизнью", "Sell it and live your own life"), ch: () => 1, yes: { m: 14, j: -2 }, ys: L("Вывеску сняли. Новые хозяева перекрасили фасад.", "The sign came down. The new owners repainted."), set: p => { p.f.famBizDone = true; p.f.famBizGen = 0; } },
    { l: L("Оставить управляющему", "Hand it to a manager"), tags: ["risk"], ch: () => .6, yes: { m: 8 }, no: { m: -8 }, ys: L("Дело живёт, а ты свободен.", "The business lives on, and you're free."), ns: L("Управляющий оказался нечист на руку.", "The manager had sticky fingers."), set: p => { p.f.famBizDone = true; p.f.biz = p.f.biz || 1; p.f.famBizGen = (p.f.famBizGen || 1) + 1; }, setNo: p => p.f.famBizDone = true },
  ]},
  { id: "familyhouse", ic: "🏡", from: 20, to: 60, if: p => p.f.famHouse && !p.f.famHouseDone, w: 2.5, t: L("Родовой дом", "The family house"), q: () => L("Дом, где выросли родители. Скрипучие ступени, отметки роста на косяке.", "The house your parents grew up in. Creaky stairs, height marks on the door frame."), o: [
    { l: L("Переехать и отремонтировать", "Move in and restore it"), tags: ["work"], ch: () => .8, yes: { j: 10, m: -6 }, no: { m: -10 }, ys: L("Отметки на косяке ты оставил. Добавил свои.", "You kept the height marks. And added your own."), ns: L("Крыша оказалась хуже, чем казалась.", "The roof was worse than it looked."), set: p => { p.f.famHouseDone = true; p.f.house = true; }, setNo: p => { p.f.famHouseDone = true; p.f.house = true; } },
    { l: L("Сдавать", "Rent it out"), tags: ["business"], ch: () => 1, yes: { m: 8 }, ys: L("В доме снова кто-то живёт.", "Someone lives in the house again."), set: p => { p.f.famHouseDone = true; p.f.house = true; } },
    { l: L("Продать", "Sell"), ch: () => 1, yes: { m: 14, j: -4 }, ys: L("Новые хозяева спилили яблоню.", "The new owners cut down the apple tree."), set: p => p.f.famHouseDone = true },
  ]},
  { id: "famname", ic: "📜", from: 18, to: 45, if: p => (p.rep || 0) >= 3 && !p.f.famName, w: 2.5, t: L("Фамилия на слуху", "A known name"), q: p => L(`«${p.last}? Из тех самых?» Двери открываются раньше, чем ты стучишь.`, `"${p.last}? Of those ${p.last}s?" Doors open before you knock.`), o: [
    { l: L("Пользоваться", "Use it"), tags: ["social"], ch: () => 1, yes: { m: 8, t: 6 }, ys: L("Удобно. Немного стыдно.", "Convenient. A little embarrassing."), set: p => p.f.famName = "used" },
    { l: L("Доказать, что можешь сам", "Prove you can do it yourself"), tags: ["work"], ch: () => .55, yes: { k: 6, j: 8 }, no: { j: -4 }, ys: L("Теперь говорят: «Это тот самый, который сам».", "Now they say: \"That's the one who made it on their own.\""), ns: L("Без фамилии вышло медленнее. Но честно.", "Slower without the name. But honest."), set: p => { p.f.famName = "own"; p.rep = (p.rep || 0) + 1; }, setNo: p => p.f.famName = "own" },
  ]},
  { id: "famshadow", ic: "🌑", from: 15, to: 40, if: p => (p.rep || 0) <= -2 && !p.f.famName, w: 2.5, t: L("Тень фамилии", "The family shadow"), q: p => L(`«${p.last}? Это не ваш ли отец…» Фраза обрывается, но всё понятно.`, `"${p.last}? Wasn't your father the one who…" The sentence trails off, but you get it.`), o: [
    { l: L("Сменить фамилию", "Change your name"), ch: () => 1, yes: { j: 2, t: -4 }, ys: L("Новая подпись, старое лицо.", "A new signature, the same face."), set: p => { p.f.famName = "changed"; p.rep = 0; } },
    { l: L("Отмыть её делами", "Clear it with deeds"), tags: ["care", "work"], ch: () => .5, yes: { t: 8, j: 6 }, no: { j: -4 }, ys: L("Через десять лет говорили уже о тебе.", "Ten years on, they talked about you instead."), ns: L("Люди помнят долго.", "People have long memories."), set: p => { p.f.famName = "own"; p.rep = 2; }, setNo: p => p.f.famName = "own" },
  ]},
  { id: "oldfeud", ic: "🏁", from: 15, to: 50, if: p => p.f.oldFeud && !p.f.feudDone, w: 2, t: L("Старая вражда", "An old feud"), q: p => L(`Внук того самого ${p.f.oldFeud || "…"}, с которым всю жизнь соперничал твой родитель, учится с тобой.`, `The grandchild of ${p.f.oldFeud || "…"}, your parent's lifelong rival, is in your class.`), o: [
    { l: L("Продолжить традицию", "Keep the tradition going"), tags: ["risk"], ch: () => .5, yes: { k: 6, j: 4 }, no: { j: -4 }, ys: L("Счёт в пользу нашей семьи.", "Score one for our family."), ns: L("Счёт в пользу их семьи.", "Score one for theirs."), set: p => p.f.feudDone = "on", setNo: p => p.f.feudDone = "on" },
    { l: L("Закончить это", "End it"), tags: ["social"], ch: () => .7, yes: { t: 10, j: 6 }, no: { t: -2 }, ys: L("Две семьи впервые за полвека сели за один стол.", "Two families at one table for the first time in half a century."), ns: L("Не готовы. Пока.", "Not ready. Yet."), set: p => p.f.feudDone = "peace", setNo: p => p.f.feudDone = "on" },
  ]},
  { id: "oldfriendkid", ic: "🤝", from: 20, to: 50, if: p => p.f.parentFriend && !p.f.pfDone, w: 1.6, t: L("Друг семьи", "A friend of the family"), q: p => L(`${p.f.parentFriend || "Старый друг"}, лучший друг твоего родителя, зовёт в гости. «Ты так похож».`, `${p.f.parentFriend || "An old friend"}, your parent's best friend, invites you over. "You look just like them."`), o: [
    { l: L("Прийти и слушать истории", "Go and listen to the stories"), tags: ["social"], ch: () => 1, yes: { t: 8, j: 8, k: 2 }, ys: L("Ты узнал о родителе больше, чем за всю жизнь.", "You learned more about your parent than in your whole life."), set: p => p.f.pfDone = true },
    { l: L("Попросить совета в делах", "Ask for advice on work"), tags: ["work"], ch: () => .8, yes: { m: 8, k: 4 }, no: { j: -2 }, ys: L("Пара звонков, и всё сдвинулось.", "A couple of calls, and things moved."), ns: L("Времена другие, связи старые.", "Different times; old connections."), set: p => p.f.pfDone = true, setNo: p => p.f.pfDone = true },
  ]},
);

// репутация рода: копится по поколениям, половина переходит детям
window.REP_OF = p => {
  let r = (p.rep || 0) * .5;
  const f = p.f;
  if (f.famous) r += 3;
  if (f.philanthropy) r += 3;
  if (f.honored) r += 2;
  if (f.honest) r += 1;
  if (p.jobLvl >= 4) r += 1;
  if (f.disgrace) r -= 4;
  if (f.jail) r -= 3;
  if (f.scandal && !f.disgrace) r -= 1;
  return Math.round(r * 10) / 10;
};
window.HEIR_HOOKS = (window.HEIR_HOOKS || []).concat((parent, p) => {
  const f = parent.f || {};
  p.rep = parent.rep || 0;
  if (f.biz) { p.f.famBiz = f.biz; p.f.famBizGen = f.famBizGen || 1; }
  if (f.house) p.f.famHouse = true;
  if (f.relic) p.f.relic = f.relic + 1;
  else if (f.heirloom) p.f.relic = 2;
  if (parent.friend && parent.friend.alive && !parent.friend.lost) p.f.parentFriend = parent.friend.first;
  if (parent.rival && !parent.rival.peace) p.f.oldFeud = parent.rival.first;
});

// ---------- Итоги и достижения ----------
window.ENDINGS.push(
  { id: "firstlove", rank: 38, n: L("Первая и последняя", "First and last"), d: p => L(`Вы с ${p.flame.first} потеряли друг друга в юности и нашли через двадцать лет. Остаток жизни прошёл вдвоём.`, `You and ${p.flame.first} lost each other young and found each other twenty years later. You spent the rest together.`), hint: L("Вернуться к первой любви", "Find your first love again"), ok: p => p.f.flameBack && p.married && p.age >= 60 },
  { id: "rivals", rank: 35, n: L("Достойный соперник", "A worthy rival"), d: p => L(`${p.rival.first} гнал${sx(p.rival, "", "а")} тебя вперёд всю жизнь. В конце вы пожали друг другу руки.`, `${p.rival.first} pushed you forward your whole life. In the end you shook hands.`), hint: L("Пройти всю жизнь с соперником и помириться", "Keep a rival for life and make peace"), ok: p => p.rival && p.rival.peace && p.rival.score >= 0 && p.age >= 70 },
  { id: "oldname", rank: 57.5, n: L("Старая фамилия", "An old name"), d: p => L(`Фамилию ${p.last} знают уже несколько поколений. Ты добавил к ней свою главу.`, `The ${p.last} name has been known for generations. You added your own chapter.`), hint: L("Поднять славу рода через поколения", "Build the family name across generations"), ok: p => (p.gen || 1) >= 3 && window.REP_OF(p) >= 6 },
);
window.ACHIEVEMENTS.push(
  { id: "rivalpeace", n: L("Ничья", "A draw"), d: L("Помириться с соперником детства", "Make peace with your childhood rival"), ok: p => p.rival && p.rival.peace },
  { id: "flameback", n: L("Через двадцать лет", "Twenty years later"), d: L("Вернуться к первой любви", "Get back together with your first love"), ok: p => p.f.flameBack },
  { id: "protege", n: L("Добро возвращается", "What goes around"), d: L("Встретить малыша, за которого вступился", "Meet the kid you once stood up for"), ok: p => p.f.protegeBack },
  { id: "oak", n: L("Тень от дуба", "In the oak's shade"), d: L("Посидеть под деревом, которое посадил сам", "Sit under a tree you planted"), ok: p => p.f.treeGrown },
  { id: "orchard", n: L("Яблоки соседа", "The neighbor's apples"), d: L("Получить сад по завещанию", "Inherit an orchard"), ok: p => p.f.orchard === true },
  { id: "relic4", n: L("Часы идут", "Still ticking"), d: L("Передать реликвию рода в четвёртое поколение", "Pass the family relic to a fourth generation"), ok: p => p.f.relic >= 4 && p.f.relicSeen },
  { id: "famBiz3", n: L("С основания", "Since the founding"), d: L("Семейное дело в третьем поколении", "Run the family business in its third generation"), ok: p => p.f.famBizGen >= 3 },
  { id: "cleanname", n: L("Честное имя", "A clean name"), d: L("Отмыть тень фамилии делами", "Clear the family shadow with deeds"), ok: p => p.f.famName === "own" && (p.rep || 0) >= 2 && p.heirOf },
);
})();
