import type { Question, Subject, SubjectId } from './types';

export const SUBJECTS: Subject[] = [
  {
    id: 'history',
    label: 'Історія України',
    icon: 'Landmark',
    topics: ['Київська Русь', 'Козацька доба', 'Національна революція 1917-1921', 'Друга світова війна', 'Незалежна Україна'],
  },
  {
    id: 'ukrainian',
    label: 'Українська мова',
    icon: 'BookOpen',
    topics: ['Орфографія', 'Пунктуація', 'Морфологія', 'Лексикологія', 'Синтаксис'],
  },
  {
    id: 'math',
    label: 'Математика',
    icon: 'Calculator',
    topics: ['Алгебра', 'Геометрія', 'Пропорції та відсотки', 'Рівняння', 'Логіка та послідовності'],
  },
  {
    id: 'english',
    label: 'Англійська мова',
    icon: 'Globe',
    topics: ['Grammar', 'Vocabulary', 'Tenses'],
  },
];

// Local question bank. Explanations are written in plain language.
export const QUESTIONS: Question[] = [
  // ---------- ІСТОРІЯ: Київська Русь ----------
  {
    id: 'h1',
    subject: 'history',
    topic: 'Київська Русь',
    prompt: 'Хто був засновником міста Київ, згідно з літописом?',
    options: ['Рюрик', 'Кий, Щек, Хорив та їх сестра Либідь', 'Олег', 'Святослав'],
    correctIndex: 1,
    explanation: 'За «Повістю минулих літ» Київ заснували три брати — Кий, Щек, Хорив — разом із сестрою Либідь.',
  },
  {
    id: 'h2',
    subject: 'history',
    topic: 'Київська Русь',
    prompt: 'У якому році відбулось хрещення Київської Русі?',
    options: ['1054', '988', '1240', '1453'],
    correctIndex: 1,
    explanation: 'Хрещення Русі князем Володимиром Великим відбулось у 988 році.',
  },
  {
    id: 'h3',
    subject: 'history',
    topic: 'Київська Русь',
    prompt: '«Повість минулих літ» — це:',
    options: ['Договір з Візантією', 'Церковний статут', 'Літописний звід', 'Військова грамота'],
    correctIndex: 2,
    explanation: '«Повість минулих літ» — найвідоміший давньоруський літописний звід початку XII ст.',
  },
  {
    id: 'h4',
    subject: 'history',
    topic: 'Київська Русь',
    prompt: 'Яку систему правління запровадив Ярослав Мудрий для своїх синів?',
    options: ['Сеньйорат (старший князь)', 'Єдиновладдя', 'Республіку', 'Обирну раду'],
    correctIndex: 0,
    explanation: 'Ярослав Мудрий запровадив сеньйорат — порядок, за яким старший у роді княжив у Києві.',
  },
  {
    id: 'h5',
    subject: 'history',
    topic: 'Київська Русь',
    prompt: 'Розпад Київської Русі на уділи почався після смерті:',
    options: ['Ярослава Мудрого (1054)', 'Володимира Великого (1015)', 'Святослава (972)', 'Мстислава Великого (1132)'],
    correctIndex: 0,
    explanation: 'Після смерті Ярослава Мудрого 1054 р. почався поступовий розпад єдиної держави на уділи.',
  },

  // ---------- ІСТОРІЯ: Козацька доба ----------
  {
    id: 'h6',
    subject: 'history',
    topic: 'Козацька доба',
    prompt: 'Хто був першим гетьманом Війська Запорозького?',
    options: ['Богдан Хмельницький', 'Дмитро Вишневецький', 'Петро Сагайдачний', 'Іван Мазепа'],
    correctIndex: 1,
    explanation: 'Дмитро Вишневецький (Байда) вважається першим гетьманом, який об’єднав козаків на Запоріжжі.',
  },
  {
    id: 'h7',
    subject: 'history',
    topic: 'Козацька доба',
    prompt: 'Національно-визвольна війна під проводом Б. Хмельницького розпочалась у:',
    options: ['1648 році', '1654 році', '1709 році', '1596 році'],
    correctIndex: 0,
    explanation: 'Війна розпочалась 1648 року з перемог при Жовтих Водах, Корсуні та Пилявцях.',
  },
  {
    id: 'h8',
    subject: 'history',
    topic: 'Козацька доба',
    prompt: 'Берестейська унія 1596 року об’єднала:',
    options: ['Православну та католицьку церкви', 'Дві православні церкви', 'Степ і місто', 'Два козацькі війська'],
    correctIndex: 0,
    explanation: 'Унія створила греко-католицьку церкву, підпорядковану Папі Римському, але зі східним обрядом.',
  },
  {
    id: 'h9',
    subject: 'history',
    topic: 'Козацька доба',
    prompt: 'Після якого договору козацька Україна потрапила під протекторат Московії?',
    options: ['Переяславська угода 1654', 'Зборівський договір', 'Бахчисарайський мир', 'Карловицький конгрес'],
    correctIndex: 0,
    explanation: 'Переяславська угода 1654 р. оформила військовий союз, що з часом переріс у підпорядкування.',
  },

  // ---------- ІСТОРІЯ: Національна революція 1917-1921 ----------
  {
    id: 'h10',
    subject: 'history',
    topic: 'Національна революція 1917-1921',
    prompt: 'Першим Універсалом Центральної Ради проголошено:',
    options: ['Незалежність України', 'Вступ до Антанти', 'Федерацію з Польщею', 'Автономію України у складі Росії'],
    correctIndex: 3,
    explanation: 'І Універсал (червень 1917) проголосив автономію України, не розриваючи з Росією.',
  },
  {
    id: 'h11',
    subject: 'history',
    topic: 'Національна революція 1917-1921',
    prompt: 'Акт проголошення незалежності України прийнято:',
    options: ['22 січня 1918 IV Універсалом', '24 серпня 1991', '1 грудня 1991', '7 листопада 1917'],
    correctIndex: 0,
    explanation: 'IV Універсал від 22 січня 1918 р. проголосив Українську Народну Республіку незалежною.',
  },
  {
    id: 'h12',
    subject: 'history',
    topic: 'Національна революція 1917-1921',
    prompt: 'Акт Злуки УНР та ЗУНР відбувся:',
    options: ['22 січня 1919', '1 листопада 1918', '24 серпня 1991', '9 листопада 1920'],
    correctIndex: 0,
    explanation: '22 січня 1919 р. на Софіївській площі проголошено Злуку УНР і ЗУНР в одну державу.',
  },

  // ---------- ІСТОРІЯ: Друга світова війна ----------
  {
    id: 'h13',
    subject: 'history',
    topic: 'Друга світова війна',
    prompt: 'Перша битва за яку Україна втратила територію у вересні 1939?',
    options: ['Вторгнення СРСР у Західну Україну', 'Битва за Київ 1941', 'Оборона Севастополя', 'Корсунь-Шевченківська операція'],
    correctIndex: 0,
    explanation: '17 вересня 1939 р. Червона армія вступила у Західну Україну за пактом Молотова-Ріббентропа.',
  },
  {
    id: 'h14',
    subject: 'history',
    topic: 'Друга світова війна',
    prompt: 'УПА — це:',
    options: ['Українська повстанська армія', 'Українська партія автономістів', 'Унітарний полк артилерії', 'Союз селян'],
    correctIndex: 0,
    explanation: 'Українська повстанська армія — збройний рух, що вів боротьбу на два фронти проти Німеччини й СРСР.',
  },
  {
    id: 'h15',
    subject: 'history',
    topic: 'Друга світова війна',
    prompt: 'Діяльність ОУН очолював у 1929-1938 роках:',
    options: ['Євген Коновалець', 'Степан Бандера', 'Андрій Мельник', 'Роман Шухевич'],
    correctIndex: 0,
    explanation: 'Євген Коновалець був першим головою ОУН до загибелі 1938 р.',
  },

  // ---------- ІСТОРІЯ: Незалежна Україна ----------
  {
    id: 'h16',
    subject: 'history',
    topic: 'Незалежна Україна',
    prompt: 'Акт проголошення незалежності України прийнято:',
    options: ['1 грудня 1991', '24 серпня 1991', '22 січня 1918', '28 червня 1996'],
    correctIndex: 1,
    explanation: '24 серпня 1991 р. Верховна Рада УРСР ухвалила Акт проголошення незалежності.',
  },
  {
    id: 'h17',
    subject: 'history',
    topic: 'Незалежна Україна',
    prompt: 'Конституцію України ухвалено:',
    options: ['28 червня 1996', '24 серпня 1991', '16 липня 1990', '1 грудня 1991'],
    correctIndex: 0,
    explanation: 'Конституція — Основний закон України — ухвалена 28 червня 1996 р.',
  },
  {
    id: 'h18',
    subject: 'history',
    topic: 'Незалежна Україна',
    prompt: 'Революція гідності відбулася у:',
    options: ['2013-2014 роках', '2004 році', '1990 році', '2019 році'],
    correctIndex: 0,
    explanation: 'Революція гідності — масові протести листопада 2013 — лютого 2014 проти диктатури Януковича.',
  },

  // ---------- УКРАЇНСЬКА МОВА: Орфографія ----------
  {
    id: 'u1',
    subject: 'ukrainian',
    topic: 'Орфографія',
    prompt: 'Виберіть правильний варіант:',
    options: ['приїхати вночі', 'приїхати в ночі', 'приїхати в нічі', 'приїхати вночі'],
    correctIndex: 0,
    explanation: 'Прислівник «вночі» пишеться разом, означає «уночі».',
  },
  {
    id: 'u2',
    subject: 'ukrainian',
    topic: 'Орфографія',
    prompt: 'Слово «не/дбалий» пишеться:',
    options: ['недбалий (разом)', 'не дбалий (окремо)', 'нє-дбалий', 'нєдбалий'],
    correctIndex: 0,
    explanation: 'Прикметник без протиставлення пишемо разом: недбалий.',
  },
  {
    id: 'u3',
    subject: 'ukrainian',
    topic: 'Орфографія',
    prompt: 'У якому слові вжито апостроф?',
    options: ['\u2018обід\u2019 — м\u2019який знак тут не потрібен', 'м\u2019який', "сім\u2019я", 'п\u2019ять'],
    correctIndex: 2,
    explanation: 'Апостроф ставиться перед я, ю, є, ї після приголосних на кінці префікса або кореня: сім\u2019я.',
  },
  {
    id: 'u4',
    subject: 'ukrainian',
    topic: 'Орфографія',
    prompt: 'Вкажіть прізвище, що відмінюється:',
    options: ['Коваленко — Коваленку', 'Симоненко — Симоненку', 'Шевченко — Шевченку', 'Усі вірні'],
    correctIndex: 3,
    explanation: 'Прізвища на -енко відмінюються за ІІ відміною: Коваленку, Симоненку, Шевченку.',
  },

  // ---------- УКРАЇНСЬКА МОВА: Пунктуація ----------
  {
    id: 'u5',
    subject: 'ukrainian',
    topic: 'Пунктуація',
    prompt: 'Де потрібна кома: «Я прочитав книгу___ і пішов гуляти»?',
    options: ['перед «і»', 'після «і»', 'кома не потрібна', 'двокрапка'],
    correctIndex: 2,
    explanation: 'Однорідні присудки, з’єднані одиничним «і», комою не розділяються.',
  },
  {
    id: 'u6',
    subject: 'ukrainian',
    topic: 'Пунктуація',
    prompt: '«Місто, у якому я народився, — Київ». Ця конструкція — це:',
    options: ['приєднувальний зворот', 'прикладка', 'вставне речення', 'підрядне речення'],
    correctIndex: 1,
    explanation: 'Вираз, що уточнює попереднє слово і береться в кому (тире), — прикладка.',
  },
  {
    id: 'u7',
    subject: 'ukrainian',
    topic: 'Пунктуація',
    prompt: 'Пряму мову вказано правильно у варіанті:',
    options: ['«Я йду, — сказав він. — Скоро повернуся»', 'Я йду сказав він скоро повернуся', '«Я йду сказав він скоро повернуся»', '«Я йду, сказав він, скоро повернуся»'],
    correctIndex: 0,
    explanation: 'Пряма мова з розділовими знаками й словами автора пишеться через тире та лапки.',
  },

  // ---------- УКРАЇНСЬКА МОВА: Морфологія ----------
  {
    id: 'u8',
    subject: 'ukrainian',
    topic: 'Морфологія',
    prompt: 'Слово «бігти» — це:',
    options: ['дієслово', 'іменник', 'прикметник', 'прислівник'],
    correctIndex: 0,
    explanation: '«Бігти» позначає дію і є дієсловом (інфінітив).',
  },
  {
    id: 'u9',
    subject: 'ukrainian',
    topic: 'Морфологія',
    prompt: 'До якої відміни належить іменник «дівчина»?',
    options: ['І відміна', 'ІІ відміна', 'ІІІ відміна', 'IV відміна'],
    correctIndex: 0,
    explanation: 'Іменники жіночого роду на -а належать до І відміни.',
  },
  {
    id: 'u10',
    subject: 'ukrainian',
    topic: 'Морфологія',
    prompt: 'Прикметник «найцікавіший» — це:',
    options: ['вищого ступеня', 'звичайного ступеня', 'вищого ступеня', 'найвищого ступеня'],
    correctIndex: 3,
    explanation: 'Префікс най- вказує на найвищий ступінь порівняння.',
  },

  // ---------- УКРАЇНСЬКА МОВА: Лексикологія ----------
  {
    id: 'u11',
    subject: 'ukrainian',
    topic: 'Лексикологія',
    prompt: 'Слова «гарячий» і «холодний» — це:',
    options: ['антоніми', 'синоніми', 'омоніми', 'пароніми'],
    correctIndex: 0,
    explanation: 'Слова з протилежним значенням — антоніми.',
  },
  {
    id: 'u12',
    subject: 'ukrainian',
    topic: 'Лексикологія',
    prompt: 'Слово «запам\u2019ятати» є:',
    options: ['прямим значенням', 'переносним значенням', 'фразеологізмом', 'омонімом'],
    correctIndex: 0,
    explanation: '«Запам\u2019ятати» вжито в прямому значенні.',
  },
  {
    id: 'u13',
    subject: 'ukrainian',
    topic: 'Лексикологія',
    prompt: 'Фразеологізм «задерти носа» означає:',
    options: ['зазнаватися', 'затято працювати', 'займатися спортом', 'йти вперед'],
    correctIndex: 0,
    explanation: '«Задерти носа» — цілісне стійке вираження зі значенням «зазнаватися».',
  },

  // ---------- УКРАЇНСЬКА МОВА: Синтаксис ----------
  {
    id: 'u14',
    subject: 'ukrainian',
    topic: 'Синтаксис',
    prompt: '«Підмет + присудок» — це:',
    options: ['означення', 'обставина', 'граматична основа', 'додаток'],
    correctIndex: 2,
    explanation: 'Підмет і присудок утворюють граматичну основу речення.',
  },
  {
    id: 'u15',
    subject: 'ukrainian',
    topic: 'Синтаксис',
    prompt: 'Речення «Світає.» за метою висловлювання — це:',
    options: ['розповідне', 'питальне', 'спонукальне', 'окличне'],
    correctIndex: 0,
    explanation: 'Розповідні речення містять повідомлення про факт.',
  },
  {
    id: 'u16',
    subject: 'ukrainian',
    topic: 'Синтаксис',
    prompt: 'Скільки головних членів речення в українській граматиці?',
    options: ['Два (підмет і присудок)', 'Три', 'Один', 'Чотири'],
    correctIndex: 0,
    explanation: 'Головних членів два: підмет і присудок.',
  },

  // ---------- МАТЕМАТИКА: Алгебра ----------
  {
    id: 'm1',
    subject: 'math',
    topic: 'Алгебра',
    prompt: 'Спростіть вираз: 2(x + 3) − x',
    options: ['2x + 3', 'x + 6', 'x + 3', '3x + 6'],
    correctIndex: 1,
    explanation: '2(x+3) − x = 2x + 6 − x = x + 6.',
  },
  {
    id: 'm2',
    subject: 'math',
    topic: 'Алгебра',
    prompt: 'Чому дорівнює (−3)² ?',
    options: ['9', '−9', '6', '−6'],
    correctIndex: 0,
    explanation: 'Квадрат будь-якого (навіть від\u2019ємного) числа додатній: (−3)² = 9.',
  },
  {
    id: 'm3',
    subject: 'math',
    topic: 'Алгебра',
    prompt: 'Розкладіть на множники: x² − 9',
    options: ['(x − 3)(x + 3)', '(x − 9)(x + 1)', '(x − 3)²', 'x(x − 9)'],
    correctIndex: 0,
    explanation: 'Це різниця квадратів: a² − b² = (a − b)(a + b).',
  },
  {
    id: 'm4',
    subject: 'math',
    topic: 'Алгебра',
    prompt: 'Значення виразу 5x − 2 при x = 4 дорівнює:',
    options: ['18', '22', '14', '8'],
    correctIndex: 0,
    explanation: '5·4 − 2 = 20 − 2 = 18.',
  },

  // ---------- МАТЕМАТИКА: Геометрія ----------
  {
    id: 'm5',
    subject: 'math',
    topic: 'Геометрія',
    prompt: 'Сума кутів трикутника дорівнює:',
    options: ['90°', '360°', '270°', '180°'],
    correctIndex: 3,
    explanation: 'Сума внутрішніх кутів будь-якого трикутника — 180°.',
  },
  {
    id: 'm6',
    subject: 'math',
    topic: 'Геометрія',
    prompt: 'Площа прямокутника зі сторонами 4 і 5 дорівнює:',
    options: ['20', '18', '9', '40'],
    correctIndex: 0,
    explanation: 'S = a · b = 4 · 5 = 20.',
  },
  {
    id: 'm7',
    subject: 'math',
    topic: 'Геометрія',
    prompt: 'Піфагорова теорема: c² =',
    options: ['a² − b²', 'a · b', 'a² + b²', 'a + b'],
    correctIndex: 2,
    explanation: 'У прямокутному трикутнику квадрат гіпотенузи дорівнює сумі квадратів катетів.',
  },
  {
    id: 'm8',
    subject: 'math',
    topic: 'Геометрія',
    prompt: 'Коло діаметром 10 має радіус:',
    options: ['5', '10', '20', '15'],
    correctIndex: 0,
    explanation: 'Радіус дорівнює половині діаметра: 10 : 2 = 5.',
  },

  // ---------- МАТЕМАТИКА: Пропорції та відсотки ----------
  {
    id: 'm9',
    subject: 'math',
    topic: 'Пропорції та відсотки',
    prompt: '20% від 80 дорівнює:',
    options: ['20', '8', '16', '40'],
    correctIndex: 2,
    explanation: '20% = 0,2; 0,2 · 80 = 16.',
  },
  {
    id: 'm10',
    subject: 'math',
    topic: 'Пропорції та відсотки',
    prompt: 'Розв\u2019яжіть пропорцію: x/6 = 2/3',
    options: ['4', '9', '12', '1'],
    correctIndex: 0,
    explanation: 'x = (6 · 2) : 3 = 4.',
  },
  {
    id: 'm11',
    subject: 'math',
    topic: 'Пропорції та відсотки',
    prompt: 'Якщо ціну 200 грн знижено на 25%, нова ціна:',
    options: ['150 грн', '175 грн', '50 грн', '160 грн'],
    correctIndex: 0,
    explanation: 'Знижка 25% від 200 = 50; 200 − 50 = 150 грн.',
  },
  {
    id: 'm12',
    subject: 'math',
    topic: 'Пропорції та відсотки',
    prompt: 'Десятковий дріб 0,75 у відсотках:',
    options: ['75%', '7,5%', '0,75%', '750%'],
    correctIndex: 0,
    explanation: 'Щоб перевести десятковий дріб у відсотки, множимо на 100: 0,75·100 = 75%.',
  },

  // ---------- МАТЕМАТИКА: Рівняння ----------
  {
    id: 'm13',
    subject: 'math',
    topic: 'Рівняння',
    prompt: 'Корінь рівняння 2x + 5 = 13 дорівнює:',
    options: ['9', '4', '3', '8'],
    correctIndex: 1,
    explanation: '2x = 8; x = 4.',
  },
  {
    id: 'm14',
    subject: 'math',
    topic: 'Рівняння',
    prompt: 'Корені рівняння x² − 4 = 0:',
    options: ['±2', '2', '4', '−2'],
    correctIndex: 0,
    explanation: 'x² = 4; x = ±2.',
  },
  {
    id: 'm15',
    subject: 'math',
    topic: 'Рівняння',
    prompt: 'Розв\u2019язок системи: x + y = 5, x − y = 1',
    options: ['x = 3, y = 2', 'x = 2, y = 3', 'x = 4, y = 1', 'x = 5, y = 0'],
    correctIndex: 0,
    explanation: 'Додавши рівняння: 2x = 6 → x = 3, тоді y = 2.',
  },

  // ---------- МАТЕМАТИКА: Логіка та послідовності ----------
  {
    id: 'm16',
    subject: 'math',
    topic: 'Логіка та послідовності',
    prompt: 'Продовжте послідовність: 2, 4, 8, 16, ...',
    options: ['24', '20', '18', '32'],
    correctIndex: 3,
    explanation: 'Кожне наступне число вдвічі більше: 16 · 2 = 32.',
  },
  {
    id: 'm17',
    subject: 'math',
    topic: 'Логіка та послідовності',
    prompt: 'Наступне число ряду 1, 3, 5, 7, ...',
    options: ['9', '8', '11', '10'],
    correctIndex: 0,
    explanation: 'Це послідовність непарних чисел, різниця 2; наступне — 9.',
  },
  {
    id: 'm18',
    subject: 'math',
    topic: 'Логіка та послідовності',
    prompt: 'У послідовності 1, 4, 9, 16, 25 наступне число:',
    options: ['36', '30', '26', '49'],
    correctIndex: 0,
    explanation: 'Це квадрати натуральних чисел: 6² = 36.',
  },

  // ---------- АНГЛІЙСЬКА: Grammar ----------
  {
    id: 'e1',
    subject: 'english',
    topic: 'Grammar',
    prompt: 'Choose the correct sentence:',
    options: ['She don\'t like tea.', 'She doesn\'t likes tea.', 'She doesn\'t like tea.', 'She not like tea.'],
    correctIndex: 2,
    explanation: 'With "she/he/it" we use "doesn\'t" + base verb: She doesn\'t like tea.',
  },
  {
    id: 'e2',
    subject: 'english',
    topic: 'Grammar',
    prompt: 'Which word is a comparative form of "good"?',
    options: ['gooder', 'more good', 'better', 'best'],
    correctIndex: 2,
    explanation: '"Good" is irregular: comparative — better, superlative — best.',
  },

  // ---------- АНГЛІЙСЬКА: Vocabulary ----------
  {
    id: 'e3',
    subject: 'english',
    topic: 'Vocabulary',
    prompt: 'What is the synonym of "happy"?',
    options: ['sad', 'joyful', 'angry', 'tired'],
    correctIndex: 1,
    explanation: '"Joyful" means feeling great pleasure — a synonym of "happy".',
  },
  {
    id: 'e4',
    subject: 'english',
    topic: 'Vocabulary',
    prompt: 'Choose the correct translation of "книга":',
    options: ['pen', 'book', 'copy', 'note'],
    correctIndex: 1,
    explanation: '"Книга" translates to "book" in English.',
  },

  // ---------- АНГЛІЙСЬКА: Tenses ----------
  {
    id: 'e5',
    subject: 'english',
    topic: 'Tenses',
    prompt: 'She ___ to school every day.',
    options: ['go', 'going', 'goes', 'gone'],
    correctIndex: 2,
    explanation: 'Present Simple for "she" adds -es: she goes.',
  },
  {
    id: 'e6',
    subject: 'english',
    topic: 'Tenses',
    prompt: 'They ___ dinner when I called.',
    options: ['eat', 'ate', 'were eating', 'have eaten'],
    correctIndex: 2,
    explanation: 'Past Continuous (were eating) shows an action in progress when interrupted.',
  },
];

export function getQuestionsFor(subject: SubjectId, topic: string | null, count: number): Question[] {
  const pool = QUESTIONS.filter((q) => {
    if (q.subject !== subject) return false;
    if (topic && q.topic !== topic) return false;
    return true;
  });
  // shuffle copy
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getRandomSprint(count: number): Question[] {
  const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
