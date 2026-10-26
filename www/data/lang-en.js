// English version: country names, all content text, events and achievements.
// Loaded after content.js and content-world.js; replaces the text in place when LANG is "en".
// Cards: per option [label, success text, failure text], in the same order as in content.js.

window.COUNTRY_EN = {
  "Индия": "India", "Китай": "China", "Нигерия": "Nigeria", "Пакистан": "Pakistan", "Индонезия": "Indonesia", "ДР Конго": "DR Congo",
  "Эфиопия": "Ethiopia", "США": "United States", "Бангладеш": "Bangladesh", "Бразилия": "Brazil", "Египет": "Egypt", "Танзания": "Tanzania",
  "Мексика": "Mexico", "Филиппины": "Philippines", "Уганда": "Uganda", "Судан": "Sudan", "Кения": "Kenya", "Афганистан": "Afghanistan",
  "Вьетнам": "Vietnam", "Йемен": "Yemen", "Ангола": "Angola", "Россия": "Russia", "Мозамбик": "Mozambique", "ЮАР": "South Africa",
  "Иран": "Iran", "Ирак": "Iraq", "Нигер": "Niger", "Турция": "Turkey", "Мадагаскар": "Madagascar", "Кот-д’Ивуар": "Côte d’Ivoire",
  "Камерун": "Cameroon", "Мали": "Mali", "Узбекистан": "Uzbekistan", "Алжир": "Algeria", "Мьянма": "Myanmar", "Гана": "Ghana",
  "Чад": "Chad", "Сомали": "Somalia", "Япония": "Japan", "Буркина-Фасо": "Burkina Faso", "Германия": "Germany", "Колумбия": "Colombia",
  "Великобритания": "United Kingdom", "Замбия": "Zambia", "Малави": "Malawi", "Франция": "France", "Марокко": "Morocco", "Таиланд": "Thailand",
  "Непал": "Nepal", "Саудовская Аравия": "Saudi Arabia", "Перу": "Peru", "Сенегал": "Senegal", "Сирия": "Syria", "Аргентина": "Argentina",
  "Зимбабве": "Zimbabwe", "Гвинея": "Guinea", "Бенин": "Benin", "Бурунди": "Burundi", "Малайзия": "Malaysia", "Венесуэла": "Venezuela",
  "Казахстан": "Kazakhstan", "Руанда": "Rwanda", "Италия": "Italy", "Гватемала": "Guatemala", "Камбоджа": "Cambodia", "Канада": "Canada",
  "Северная Корея": "North Korea", "Испания": "Spain", "Южный Судан": "South Sudan", "Шри-Ланка": "Sri Lanka", "Польша": "Poland",
  "Австралия": "Australia", "Таджикистан": "Tajikistan", "Эквадор": "Ecuador", "Того": "Togo", "Боливия": "Bolivia", "Сьерра-Леоне": "Sierra Leone",
  "Гаити": "Haiti", "Папуа — Новая Гвинея": "Papua New Guinea", "Центральноафриканская Республика": "Central African Republic",
  "Южная Корея": "South Korea", "Иордания": "Jordan", "Гондурас": "Honduras", "Украина": "Ukraine", "Доминиканская Республика": "Dominican Republic",
  "Республика Конго": "Republic of the Congo", "Румыния": "Romania", "Чили": "Chile", "Мавритания": "Mauritania", "Израиль": "Israel",
  "Либерия": "Liberia", "Нидерланды": "Netherlands", "Тунис": "Tunisia", "Лаос": "Laos", "Туркменистан": "Turkmenistan", "Кыргызстан": "Kyrgyzstan",
  "Палестина": "Palestine", "Парагвай": "Paraguay", "Тайвань": "Taiwan", "Никарагуа": "Nicaragua", "Азербайджан": "Azerbaijan", "Ливия": "Libya",
  "ОАЭ": "United Arab Emirates", "Бельгия": "Belgium", "Сальвадор": "El Salvador", "Эритрея": "Eritrea", "Швеция": "Sweden", "Куба": "Cuba",
  "Ливан": "Lebanon", "Чехия": "Czechia", "Португалия": "Portugal", "Венгрия": "Hungary", "Оман": "Oman", "Швейцария": "Switzerland",
  "Гамбия": "Gambia", "Австрия": "Austria", "Намибия": "Namibia", "Греция": "Greece", "Панама": "Panama", "Габон": "Gabon", "Беларусь": "Belarus",
  "Монголия": "Mongolia", "Гвинея-Бисау": "Guinea-Bissau", "Болгария": "Bulgaria", "Ботсвана": "Botswana", "Сербия": "Serbia",
  "Новая Зеландия": "New Zealand", "Дания": "Denmark", "Лесото": "Lesotho", "Экваториальная Гвинея": "Equatorial Guinea", "Ирландия": "Ireland",
  "Словакия": "Slovakia", "Коста-Рика": "Costa Rica", "Норвегия": "Norway", "Кувейт": "Kuwait", "Сингапур": "Singapore", "Грузия": "Georgia",
  "Финляндия": "Finland", "Гонконг": "Hong Kong", "Армения": "Armenia", "Уругвай": "Uruguay", "Ямайка": "Jamaica", "Молдова": "Moldova",
  "Хорватия": "Croatia", "Тимор-Лесте": "Timor-Leste", "Эсватини": "Eswatini", "Катар": "Qatar", "Албания": "Albania",
  "Босния и Герцеговина": "Bosnia and Herzegovina", "Коморы": "Comoros", "Джибути": "Djibouti", "Соломоновы Острова": "Solomon Islands",
  "Литва": "Lithuania", "Косово": "Kosovo", "Бахрейн": "Bahrain", "Словения": "Slovenia", "Северная Македония": "North Macedonia",
  "Гайана": "Guyana", "Фиджи": "Fiji", "Тринидад и Тобаго": "Trinidad and Tobago", "Кипр": "Cyprus", "Латвия": "Latvia", "Маврикий": "Mauritius",
  "Эстония": "Estonia", "Суринам": "Suriname", "Бутан": "Bhutan", "Черногория": "Montenegro", "Люксембург": "Luxembourg", "Кабо-Верде": "Cabo Verde",
  "Мальдивы": "Maldives", "Макао": "Macau", "Мальта": "Malta",
};
window.PART_EN = { "Азия": "Asia", "Америка": "the Americas", "Африка": "Africa", "Европа": "Europe", "Океания": "Oceania" };

(function () {
  if (window.LANG !== "en") return;
  const he = (p, m, f) => p.sex === "f" ? f : m;
  const fr = p => p.friend.first;
  const EXAMS_EN = { cn: "the gaokao", kr: "the suneung", ru: "the EGE", jp: "university entrance exams", in: "the JEE", fa: "the Konkur", tr: "the YKS", vn: "the national exam", ua: "the ZNO", bg: "the matura", pl: "the matura", fr: "the baccalauréat", de: "the Abitur", gr: "the Panhellenic exams", ng: "the WAEC exams", gh: "the WASSCE", ea: "the KCSE", ar: "the tawjihi", br: "the ENEM", la: "the entrance exam" };
  const examEN = p => EXAMS_EN[p.home.reg] || "final exams";
  const cap = s => s[0].toUpperCase() + s.slice(1);

  const TRAITS = {
    stubborn: ["Persistence", "+8% to odds in study and work"],
    charm: ["Charm", "+10% in love and with people; relationships grow faster"],
    strong: ["Strong health", "Starting health +12"],
    frail: ["Frail health", "Starting health −12, but more time for books"],
    bright: ["Sharp mind", "Knowledge grows 30% faster"],
    hustler: ["Enterprising", "+12% to odds in business and trade"],
    artist: ["Creative soul", "Opens a path into art"],
    athletic: ["Athletic", "Opens a path into sport; slightly better health"],
    careful: ["Caution", "Setbacks hurt a third less"],
    daring: ["Courage", "+10% to risky decisions and moving"],
    optimist: ["Optimism", "Happiness stays higher"],
    loner: ["Introvert", "Relationships grow slower, knowledge faster"],
  };
  for (const [id, [n, d]] of Object.entries(TRAITS)) Object.assign(window.TRAITS[id], { n, d });

  const JOBS = { farmer: "Farmer", worker: "Laborer", trader: "Trader", master: "Craftsperson", nurse: "Nurse", soldier: "Soldier", official: "Civil servant", teacher: "Teacher", engineer: "Engineer", it: "Programmer", lawyer: "Lawyer", doctor: "Doctor", scientist: "Scientist", artist: "Artist", athlete: "Athlete", business: "Entrepreneur" };
  for (const [id, n] of Object.entries(JOBS)) { const J = window.JOBS[id]; J.n = n; delete J.nf; delete J.nm; }

  const FOCUS = { study: ["Study", "+knowledge, easier to learn"], work: ["Work", "+money, easier at work"], people: ["Loved ones", "+relationships and happiness"], health: ["Health", "+health"], rest: ["Rest", "+happiness"] };
  for (const F of window.FOCUS) [F.n, F.d] = FOCUS[F.id];

  const DREAMS = {
    edu: ["Get a good education", "Knowledge 75+ by age 35"], uni: ["Graduate from university", "Earn a degree"],
    rich: ["Make it to prosperity", "Money 70+ after age 30"], family: ["A big, warm family", "Marriage, two children and Loved ones 70+"],
    long: ["Live to a ripe old age", "Reach 80"], happy: ["A calm, happy old age", "Happiness 70+ at 60 or later"],
    away: ["Start a life in another country", "Move abroad and settle in"], doctor: ["Become a doctor", "Work as a doctor"],
    biz: ["Build your own business", "Grow a business to level 3"], home: ["A home of your own", "Buy or build a house"],
    fame: ["Become famous", "Fame in sport or art"], one: ["One love for life", "Married with no divorce until 65"],
    world: ["See the world", "Take 3 trips"], give: ["Help your home town", "Build a school or a well back home"],
  };
  for (const D of window.DREAMS) [D.t, D.d] = DREAMS[D.id];

  const ACH = {
    c100: ["A hundred years", "Live to 100"], c90: ["Long life", "Live to 90"],
    rare: ["One in a thousand", "Be born in a country with odds rarer than 1 in 1,000"],
    under: ["Against all odds", "Make your dream come true with a ×2 multiplier or higher"],
    kids4: ["Big family", "Four or more children"], migr: ["New homeland", "Move to another country and settle in"],
    rich: ["Well-off", "Money 100"], wise: ["Sage", "Knowledge 95+"], loved: ["Loved by all", "Loved ones 95+"],
    happy: ["A happy life", "End with happiness 80+"], doctor: ["White coat", "Become a doctor"], famous: ["Celebrity", "Become famous"],
    biz3: ["Empire", "Level 3 business"], giver: ["Patron", "Help your home town"], trips3: ["Traveler", "Three trips"],
    lucky: ["Lucky one", "Win the lottery"], one: ["Together forever", "Married with no divorce until 70"],
    atlas10: ["Citizen of the world", "Be born in 10 different countries"], atlas30: ["Half the atlas", "Be born in 30 different countries"],
    exam: ["Top of the class", "Ace your national exam"], friend: ["Friends forever", "Reach 70 with your best friend still by your side"],
    survivor: ["Weathered the storm", "Survive two natural disasters and live to 70"],
    egg: ["Easter egg", "Find the letter you wrote to yourself at fifteen"],
  };
  for (const A of window.ACHIEVEMENTS) [A.n, A.d] = ACH[A.id];

  const kidG = k => k.sex === "f";
  const CARDS = {
    school: ["School", "Your family is deciding whether to send you to school.", [
      ["Go to the local school", "School is going well.", "The school is far away. Lots of missed days."],
      ["Private school", "Strong teachers and new friends.", "Expensive, and not much use."],
      ["Help the family at home", "You learned to work early."]]],
    yard: ["Outside", "Free time after chores.", [
      ["Play with the neighbors' kids", "Friends for life.", "It didn't click, but it was fun."],
      ["Stay in with books", "Books opened up a new world.", "There are hardly any books at home."],
      ["Kick a ball around until dark", "Strong legs and loud laughter.", "A broken arm, but a good story."]]],
    talent: ["Talent", "The adults have noticed you're better at something than the other kids.", [
      ["Draw and play music", "Something of your own to love.", "There's nothing to practice on."],
      ["Take up sport seriously", "A coach takes you on.", "There's no sports club nearby."],
      ["Puzzles and chess", "You win the school olympiad.", "The interest faded fast."]]],
    siblings: ["Little ones", p => `There are ${p.siblings + 1} children in the family. Your parents need help.`, [
      ["Look after the younger ones", "The little ones adore you."],
      ["Talk them into letting you study", "Your parents agreed.", "Your parents said no."]]],
    bully: ["Bullies", "Older kids are picking on your friend.", [
      ["Stand up for them", "Your friend won't forget it.", "You got beaten up, but your friend stood by you."],
      ["Get an adult", "The adults sorted it out.", "The adults had no time for it."],
      ["Stay quiet", "You're still ashamed of it."]]],
    hard: ["A hard year", "The family is short of money. Your father says you should quit school and work.", [
      ["Quit school and work", "Adult life started early."],
      ["Study and work on the side", "It's hard, but it's working.", "No strength left for anything."],
      ["Ask relatives for help", "An uncle helped out with money.", "The relatives are struggling too."]]],
    teen: ["Teenager", "A teacher offers you extra lessons.", [
      ["Study in the evenings", "Your grades went up.", "You didn't have the energy."],
      ["Get a part-time job", "Your first money of your own.", "They cheated you out of your pay."],
      ["Hang out with friends", "Best summer of your life.", "Wrong crowd."]]],
    smoke: ["The crowd", "Friends behind the garages offer you a cigarette.", [
      ["Try it", "The habit stuck for years."],
      ["Say no", "They laughed, then let it go."]]],
    after: ["After school", "What next?", [
      ["Apply to university", "You got in!", "You didn't make the cut."],
      ["Vocational college", "You got into college.", "Not enough places."],
      ["Start working right away", "You found a steady job.", "Only odd jobs."],
      ["Join the army", "The service taught you discipline.", "Hard service, and an injury."]]],
    major: ["Major", "Which subject will you take?", [
      ["Medicine", "Six years of anatomy.", "Dropped out after the second year."],
      ["Engineering", "Drawings and calculations.", "Structural mechanics won."],
      ["Computer science", "Your first code that works.", "Not for you."],
      ["Law and economics", "Useful connections.", "Boring. You left."],
      ["Teaching", "You loved your school placement.", "Not enough patience."],
      ["Art", "Art academy.", "You failed the portfolio review."]]],
    graduate: ["Diploma", "Your studies are behind you. What next?", [
      ["Work in your field", p => `First job: ${jobName(p, p.f.major).toLowerCase()}.`, "No jobs in your field, so you took whatever you could find."],
      ["Stay in research", "Grad school and a first paper.", "No grant."],
      ["Go abroad to work", null, "Your papers were rejected."]]],
    trade: ["Trade", "What will you study at college?", [
      ["Electrician or mechanic", "Your hands remember everything.", "You quit halfway."],
      ["Nursing", "The hospital is glad of an extra pair of hands.", "The night shifts were too much."],
      ["Cook", "Your own signature soup.", "The kitchen's not for you."]]],
    firstjob: ["Work", "You need to earn money. Where?", [
      ["Farming and livestock", "Work from dawn to dusk.", "Drought."],
      ["Construction or a factory", "A steady wage.", "Only seasonal work."],
      ["Trade at the market", "You have regular customers now.", "The goods didn't sell."],
      ["Get a government job", "A quiet job full of rubber stamps.", "No connections, no job."]]],
    love: ["Love", "There's someone around who's easy to be with.", [
      ["Start dating", p => `You and ${p.partner.first} are together now.`, "It didn't work out."],
      ["Take it slow", "You spent the time on yourself."]]],
    wedding: ["Wedding", p => `${p.partner.first} is waiting for a proposal.`, [
      ["A big wedding for the whole family", "The party lasted three days.", "You fought over the guest list, but you got married."],
      ["A small ceremony", "Just the closest people."],
      ["Live together without marrying", "A piece of paper isn't what matters."]]],
    abroad: ["Going abroad", "Friends are inviting you to work in another country.", [
      ["Work visa", null, "Visa denied, money lost."],
      ["Go illegally", null, "A dangerous journey. You came back with nothing."],
      ["Study abroad", null, "No scholarship."],
      ["Stay home", "There's no place like home."]]],
    adapt: ["A foreign land", p => `${p.c.name}. Nothing around you makes sense.`, [
      ["Learn the language every evening", "The language gave in.", "The language is hard going."],
      ["Stick with people from home", "People from home helped you find a place to live."],
      ["Go back home", p => `Back home: ${p.home.name}.`]]],
    papers: ["Papers", "Without papers, every check is dangerous.", [
      ["Apply for legal status", "Your papers are ready.", "Rejected. You had to go home."],
      ["Keep your head down", "Five more years in the shadows.", "Deported."]]],
    remit: ["Family back home", p => `Your family in ${p.home.name} is counting on your help.`, [
      ["Send money every month", "They put a new roof on the house back home."],
      ["Save for yourself", "Your family took offense."]]],
    sportcareer: ["Big-time sport", "Your coach says you have a shot.", [
      ["Go pro", "A contract with a club.", "A knee injury ended it."],
      ["Keep sport as a hobby", "Training on weekends."]]],
    artcareer: ["Art", "Can you make a living from art?", [
      ["Give it a try", "Your first exhibition.", "Nobody buys your canvases."],
      ["Keep it as a hobby", "Drawing in the evenings."]]],
    fame: ["A shot at fame", p => p.job === "athlete" ? "You've been invited to a major tournament." : "A gallery in the capital wants to show your work.", [
      ["Give it everything", "People recognize you on the street.", "Nobody noticed."],
      ["Turn it down, not now", "Maybe next time."]]],
    activism: ["Change", "People unhappy with the government are gathering in town.", [
      ["Volunteer instead of protesting", "You helped the sick and the elderly.", "The organizers vanished."],
      ["Join the protest", "Your voice was heard.", "Detained for a few days."],
      ["Stay out of it", "Politics isn't your thing."]]],
    crime: ["Easy money", "An acquaintance offers you a \"job\". Quick and lucrative.", [
      ["Agree", "You got lucky. But you sleep worse.", "Caught. A few years behind bars."],
      ["Refuse", "That acquaintance went to prison later."]]],
    career: ["Work", "A chance to change jobs has come up.", [
      ["Start your own business", "Business took off.", "The business went bust."],
      ["Hold on to your job", "A bonus.", "Wages are paid late."],
      ["Keep studying", "A new qualification.", "The course turned out to be weak."]]],
    promo: ["Promotion", "Your boss is offering you more responsibility.", [
      ["Accept", p => `New position: ${jobName(p)}, level ${p.jobLvl}.`, "The job went to someone else."],
      ["Stay where you are", "Less money, more evenings at home."]]],
    bizgrow: ["Your business", p => `Your business has been running for a while (level ${p.f.biz}). What next?`, [
      ["Expand", "You opened a second location.", "Expansion ate all the money."],
      ["Sell the business", "A good deal.", "Sold for less than you hoped."],
      ["Keep it as it is", "Stability."]]],
    debt: ["Debt", "There isn't even enough money for food.", [
      ["Borrow from family", "They helped, but they keep reminding you.", "Your family said no."],
      ["Take out a loan", "You have money now, and interest too.", "The bank said no."],
      ["Tighten your belt", "You got through this too."]]],
    kids: ["Children", p => p.kids.length ? `You have ${p.kids.length === 1 ? "one child" : p.kids.length + " children"}. Another one?` : "You're thinking about a baby.", [
      ["Have a baby", p => { const k = p.kids.at(-1); return `A baby ${kidG(k) ? "girl" : "boy"} is born. You name ${kidG(k) ? "her" : "him"} ${k.first}.`; }, "Not yet."],
      ["Adopt a child", p => `${p._kid.first} joins the family as your ${kidG(p._kid) ? "daughter" : "son"}.`, "The paperwork drags on for years."],
      ["No more", "You decided that's enough."]]],
    kidsedu: ["Kids and school", p => `${p.kids[0].first} is growing up. What about school?`, [
      ["Pay for a good school", "Your kids are doing better at school than you did.", "The money's gone, and it didn't help much."],
      ["Let them help at home", "Just like you as a kid."]]],
    house: ["Home", "You want a place of your own.", [
      ["Buy with a mortgage", "The keys to your own home.", "Not enough for the down payment."],
      ["Build it yourself", "A house where every nail is yours.", "The build dragged on."],
      ["Keep renting", "At least you're free."]]],
    crisis: ["Family", p => `You and ${p.partner.first} argue more and more.`, [
      ["Sit down and talk", "You hear each other again.", "Talking didn't help."],
      ["Divorce", "Divorced. Starting over."],
      ["Stay for the kids", "The silence at home is heavy."]]],
    newlove: ["Someone new", "It feels like your heart is open again.", [
      ["Take the chance", p => `${p.partner.first} is by your side now.`, "It didn't work out."],
      ["I'm fine on my own", "Quiet and books."]]],
    body: ["Workload", "Lots of work, little energy.", [
      ["Look after your health", "You feel better.", "Rest didn't help."],
      ["Work without days off", "More money.", "Burnout."],
      ["Take a vacation", "Two weeks by the sea."]]],
    habits: ["Habits", p => p.f.smoker ? "Your doctor says it's time to quit smoking." : "Time to take care of yourself.", [
      ["Quit smoking", "Not a single cigarette for a year.", "You relapsed after a month."],
      ["Run every morning", "Your first half marathon.", "It lasted a week."],
      ["Leave it", "You only live once."]]],
    treat: ["Illness", "A serious diagnosis. How will you treat it?", [
      ["The best clinic, whatever it costs", "The treatment worked.", "Even the best doctors can't do everything."],
      ["A regular hospital", "Discharged home.", "Long queues and not enough medicine."],
      ["Herbs and prayer", "The illness went away on its own.", "It got worse."]]],
    relatives: ["Relatives", "Your relatives need help.", [
      ["Help with money and time", "The family will remember this."],
      ["Save for old age", "Money put aside for a rainy day."]]],
    parents: ["Parents", p => `${p.parents.mAlive ? p.parents.mother.split(" ")[0] : p.parents.father.split(" ")[0]} is getting old and struggling to cope alone.`, [
      ["Move them in with you", "Three generations under one roof."],
      ["Hire a caregiver", "Help every day."],
      ["Call and visit on holidays", "Every goodbye is harder."]]],
    midlife: ["Midlife", "Forty-something. You want something new.", [
      ["Change careers", p => `New career: ${jobName(p).toLowerCase()}.`, "The new job didn't work out."],
      ["Fulfil an old wish", "Finally."],
      ["Change nothing", "Everything's fine as it is."]]],
    relocate: ["Where to live", "Noisy, expensive and cramped. Time to move?", [
      ["To the countryside", "Your own garden and some quiet.", "Boring and far from everything."],
      ["To the capital, for the opportunities", "Big city, big money.", "The capital turned out too expensive."],
      ["Stay", "Everything here feels like home."]]],
    leader: ["Neighbors", "The neighbors ask you to lead a community project.", [
      ["Take it on", "The whole street respects you.", "You couldn't please everyone."],
      ["Help, but don't lead", "Quiet help."]]],
    invest: ["Savings", "You have some spare money.", [
      ["Invest in land or stocks", "The investment grew.", "You lost it all."],
      ["Put it aside", "Let it sit."],
      ["Spend it on the family", "A celebration for everyone."]]],
    trip: ["Travel", "You could go somewhere you've never been.", [
      ["Go", p => `Went to ${p._trip}.`],
      ["Another time", "There's still time."]]],
    give: ["Home town", p => `Your home village in ${p.home.name} has no school and no well.`, [
      ["Build a school", "The school is named after your mother.", "The money was stolen."],
      ["Dig a well", "Water for the whole village.", "The water turned out to be undrinkable."],
      ["Not now", "Maybe later."]]],
    retire: ["Retirement", "Time to retire?", [
      ["Retire", "Your first morning without an alarm clock."],
      ["Keep working", "You can't sit idle.", "Your health is hinting it's time."]]],
    grandkids: ["Grandchildren", p => `${p.kids[0].first} has had a baby.`, [
      ["Babysit the grandchildren", "The house is full of children's laughter again."],
      ["Live for yourself", "They visit on weekends."]]],
    old: ["Old age", "How will you live from here?", [
      ["Move in with your children", "The grandkids are close by.", "Cramped and complicated."],
      ["Start a project with the neighbors", "New friends in old age.", "Less energy than before."],
      ["Live quietly and save your strength", "Peaceful years."]]],
    memoir: ["Memory", "So much has happened. Write it down?", [
      ["Write a memoir", "A hundred-page notebook for the grandchildren.", "The words wouldn't come."],
      ["Teach the young your trade", "Your students still come by."]]],
    will: ["Inheritance", "Time to decide who gets what.", [
      ["Split it equally among family", "Nobody feels left out."],
      ["Leave it to a good cause", "The money will go to a hospital."]]],
    checkup: ["Doctor", "It's been a while since your last checkup.", [
      ["Get a checkup", "Something was caught and treated in time.", "The good clinic is too far away."],
      ["Skip the doctors", "Saved some money."]]],
    // content-world.js
    exam: ["Exams", p => `${cap(examEN(p))} ${/s$/.test(examEN(p)) ? "are" : "is"} coming up. It decides where you can study.`, [
      ["Cram day and night", "Top score! University doors are open.", "Lower than you hoped."],
      ["Hire a tutor", "The tutor knew every trick.", "Money spent, average result."],
      ["Take it as it comes", "No stress, no records."]]],
    bestfriend: ["Friend", "There's a new kid in class, sitting alone.", [
      ["Sit down and say hi", p => `${fr(p)} is your best friend now.`, "You didn't hit it off."],
      ["Leave it", "Everyone for themselves."]]],
    friendloan: ["A friend asks", p => `${fr(p)} is in trouble and asks to borrow money.`, [
      ["Lend the money", p => `${fr(p)} paid it all back and never forgot it.`, "You never got the money back, but the friendship survived."],
      ["Say no", "Things cooled between you."]]],
    friendbiz: ["Partners", p => `${fr(p)} wants to start a business with you.`, [
      ["Agree", "Business is good. You make a great team.", "You went bust and fell out."],
      ["Friendship comes first", "You stayed just friends."]]],
    pet: ["Puppy", "The neighbors' dog had puppies. One is looking right at you.", [
      ["Take it home", "Now someone is always waiting for you at home."],
      ["Not now", "Maybe someday."]]],
    oiljob: ["Oil", "The oil field is hiring. Good pay, but the rotations are tough.", [
      ["Go work the rotation", "Two years of rotations, and money to live on.", "Injured on the rig."],
      ["Stay home", "Close to family."]]],
    migrantwork: ["Working away", "Half the people you know have gone away for work. They're asking you to come for a season.", [
      ["Go for the season", "You brought back enough for half a year.", "The employer didn't pay."],
      ["Look for work at home", "Found work close by.", "There's no work at home."]]],
    itboom: ["New career", "Friends are learning to code from online videos and want you to join.", [
      ["Take the course", "First gig, then a first job.", "Stuck on lesson three."],
      ["Not for me", "To each their own."]]],
    village: ["Village or city", "There's no work in the village, but everyone here is family.", [
      ["Move to the city", "A room on the outskirts, but there's work.", "The city didn't take to you. You came back."],
      ["Stay and keep the farm", "Your own land feeds you.", "A bad harvest."]]],
    reunion: ["Reunion", "Your school friends invite you to a class reunion.", [
      ["Go and remember your youth", "You laughed until you cried, like at school."],
      ["Stay home", "Maybe next year."]]],
    garden: ["Garden", "Spring. The soil under the window is already warm.", [
      ["Plant something", "The first shoots have come up."],
      ["Sit and watch", "A warm day, and nothing else is needed."]]],
    legacy: ["Legacy", "What do you want to pass on to your children and grandchildren?", [
      ["The family's story", "You wrote it all down, starting from the very first house."],
      ["Money and a house", "All in the will, no arguments."]]],
    letter: ["A letter", "In a box of documents you find a letter. You wrote it to yourself at fifteen.", [
      ["Read it aloud to the grandchildren", "You laughed at how serious you were.", null],
      ["Read it in silence", "That boy or girl knew what they wanted.", null],
      ["Write back to yourself", "You wrote a reply. Someone may read it in fifty years.", null]]],
    walk: ["Walk", "Evening, the embankment, familiar faces.", [
      ["Walk the whole loop", "Your legs are tired, but your head is clear.", "Dizzy. You had to sit down."],
      ["Sit on a bench", "You watched the lights come on."]]],
    wish: ["Last wish", "There's one wish you've been putting off your whole life.", [
      ["Make it come true, even if it's late", "Better late than never."],
      ["Leave it for later", "There's still time."]]],
  };
  for (const card of window.CARDS) {
    const tr = CARDS[card.id];
    if (!tr) continue;
    [card.t, card.q] = [tr[0], tr[1]];
    card.o.forEach((o, i) => {
      const [l, ys, ns] = tr[2][i];
      o.l = l;
      if (ys !== undefined) o.ys = ys;
      if (ns !== undefined || o.ns) o.ns = ns ?? null;
    });
  }

  const EVENTS = {
    ill: "A serious illness.", heart: "Heart trouble.", crisis: "An economic crisis.", layoff: "Laid off at work.",
    windfall: "An unexpected bit of money.", lottery: "You won the lottery!", inherit: "An inheritance from distant relatives.",
    harvest: "A failed harvest and rising prices.", flood: "A flood washed away half the house.",
    father: p => `Your father, ${p.parents.father}, died.`, mother: p => `Your mother, ${p.parents.mother}, died.`,
    widow: p => `${p.partner.first} passed away. You're a ${he(p, "widower", "widow")} now.`,
    newfriend: "You made a new close friend.", teacher: "You met a great teacher.",
    war: "Armed conflict in the region. The family had to leave home.", crash: "A road accident.", robbed: "Robbed on the way home.",
    internet: "The internet opened new doors.", kiduni: p => `${p.kids[0].first} got into university.`,
    kidtrouble: p => `${p.kids.at(-1).first} is in trouble.`, pension: "Your pension was cut.", loan: "Loan interest is eating everything.",
    release: "Free after prison. Starting over.", pandemic: "A pandemic. A year in lockdown.", tv: "A TV interview.",
    oldfriend: "An old friend died.", none: null,
    quake: "An earthquake. The house was damaged, but everyone is alive.", typhoon: "A typhoon tore off the roof and flooded the yard.",
    monsoon: "Monsoon rains flooded the streets for a week.", drought: "Drought. The livestock died, and there's no harvest.",
    malaria: "Malaria. Weeks of fever and delirium.", winter: "A brutal winter, and heating costs are up.",
    oilup: "Oil prices went up, and there's money in the country.", oildown: "Oil prices crashed, and wages were cut.",
    fwed: p => `${fr(p)} is getting married and wants you at their side.`, fhelp: p => `${fr(p)} helped you out with money when things were hard.`,
    faway: p => `${fr(p)} moved to another city. Now it's just phone calls.`, fdeath: p => `Your best friend, ${fr(p)}, passed away.`,
    petdeath: "Your old dog went to sleep and didn't wake up.",
    stars: "A cloudless night. Stars over the desert, the kind you can't see in a city.",
  };
  for (const e of window.EVENTS) if (e.id in EVENTS) e.s = EVENTS[e.id];
})();
