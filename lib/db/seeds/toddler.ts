/**
 * Little Ones (1–3 years) Lessons Seed
 *
 * Toddlers learn by COLOR, PICTURE, and SOUND — not words. Every question here:
 *  - uses giant emoji pictures as the answer options (rendered extra-large in QuizGame)
 *  - is auto-read aloud by text-to-speech (littleKidMode)
 *  - has NO time limit (no pressure for tiny learners)
 *  - is designed to be played together with a parent
 */
export function getToddlerLessons(subjectMap: Record<string, unknown>) {
  const base = {
    ageGroup: 'toddler', grade: [0], type: 'game', difficulty: 'easy',
    isPremium: false, isActive: true,
  }

  return [
    // ── COLORS (Art) ────────────────────────────────────────────────────────
    {
      ...base,
      title: 'Find the Color! 🌈',
      description: 'Listen and touch the right color. Big, bright, and fun!',
      subjectId: subjectMap['art'], subjectSlug: 'art', topicId: 'coloring',
      duration: 5, xpReward: 20, coinReward: 10, order: 30,
      tags: ['toddler', 'colors', 'visual', 'sound'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10,
          question: 'Touch the RED one! ❤️',
          options: ['🔴', '🔵', '🟢', '🟡'], correctAnswer: '🔴',
          explanation: 'Red! Like an apple 🍎 and a fire truck 🚒!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10,
          question: 'Which one is YELLOW like the sun? ☀️',
          options: ['🟣', '🟡', '🔵', '🟢'], correctAnswer: '🟡',
          explanation: 'Yellow! Like the sun ☀️ and a banana 🍌!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10,
          question: 'Find BLUE, like the sky!',
          options: ['🔵', '🔴', '🟡', '🟠'], correctAnswer: '🔵',
          explanation: 'Blue! Like the sky and the sea 🌊!',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10,
          question: 'Where is GREEN, like the grass?',
          options: ['🟠', '🟣', '🟢', '🔴'], correctAnswer: '🟢',
          explanation: 'Green! Like grass and leaves 🌿!',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 10,
          question: 'Touch the ORANGE one, like a carrot! 🥕',
          options: ['🟢', '🟠', '🔵', '🟣'], correctAnswer: '🟠',
          explanation: 'Orange! Like a carrot 🥕 and an orange 🍊!',
        },
      ],
    },

    // ── ANIMAL SOUNDS (Science) ─────────────────────────────────────────────
    {
      ...base,
      title: 'What Does the Animal Say? 🐮',
      description: 'Moo! Meow! Woof! Listen and find the animal that makes the sound.',
      subjectId: subjectMap['science'], subjectSlug: 'science', topicId: 'animals',
      duration: 5, xpReward: 20, coinReward: 10, order: 30,
      tags: ['toddler', 'animals', 'sounds', 'visual'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10,
          question: 'Which animal says MOO, MOO?',
          options: ['🐮', '🐱', '🐶', '🦆'], correctAnswer: '🐮',
          explanation: 'The cow says moo! 🐮',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10,
          question: 'Which animal says MEOW, MEOW?',
          options: ['🐷', '🐱', '🐴', '🐸'], correctAnswer: '🐱',
          explanation: 'The cat says meow! 🐱',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10,
          question: 'Which animal says WOOF, WOOF?',
          options: ['🐔', '🐟', '🐶', '🐮'], correctAnswer: '🐶',
          explanation: 'The dog says woof woof! 🐶',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10,
          question: 'Which animal says QUACK, QUACK?',
          options: ['🦆', '🐱', '🐘', '🐍'], correctAnswer: '🦆',
          explanation: 'The duck says quack quack! 🦆',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 10,
          question: 'Which animal says ROAR?',
          options: ['🐭', '🦁', '🐰', '🐢'], correctAnswer: '🦁',
          explanation: 'The lion says ROAR! 🦁 The king of the jungle!',
        },
      ],
    },

    // ── FIND THE ANIMAL (Science) ───────────────────────────────────────────
    {
      ...base,
      title: 'Where Do Animals Live? 🐠',
      description: 'Fish swim, birds fly! Touch the right animal.',
      subjectId: subjectMap['science'], subjectSlug: 'science', topicId: 'animals',
      duration: 5, xpReward: 20, coinReward: 10, order: 31,
      tags: ['toddler', 'animals', 'visual'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10,
          question: 'Which one swims in the water?',
          options: ['🐠', '🐦', '🐱', '🐰'], correctAnswer: '🐠',
          explanation: 'The fish swims in the water! 🐠💦',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10,
          question: 'Which one can fly in the sky?',
          options: ['🐷', '🐟', '🐦', '🐄'], correctAnswer: '🐦',
          explanation: 'The bird flies up high in the sky! 🐦☁️',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10,
          question: 'Which one is very, very BIG?',
          options: ['🐘', '🐭', '🐜', '🐞'], correctAnswer: '🐘',
          explanation: 'The elephant is the biggest! 🐘 So big!',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10,
          question: 'Which one hops and jumps?',
          options: ['🐢', '🐌', '🐰', '🐠'], correctAnswer: '🐰',
          explanation: 'The rabbit hops, hop hop hop! 🐰',
        },
      ],
    },

    // ── COUNTING 1-2-3 (Math) ───────────────────────────────────────────────
    {
      ...base,
      title: 'Count with Me: 1, 2, 3! 🍎',
      description: 'Count the yummy fruits together — one, two, three!',
      subjectId: subjectMap['mathematics'], subjectSlug: 'mathematics', topicId: 'counting',
      duration: 5, xpReward: 20, coinReward: 10, order: 30,
      tags: ['toddler', 'counting', 'numbers', 'visual'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10,
          question: '🍎\nHow many apples? Count with me!',
          options: ['1', '2', '3'], correctAnswer: '1',
          explanation: 'One apple! 🍎 Just one!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10,
          question: '🍌 🍌\nHow many bananas?',
          options: ['1', '2', '3'], correctAnswer: '2',
          explanation: 'Two bananas! 🍌🍌 One... two!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10,
          question: '🍊 🍊 🍊\nHow many oranges?',
          options: ['1', '2', '3'], correctAnswer: '3',
          explanation: 'Three oranges! 🍊🍊🍊 One... two... three!',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10,
          question: '⭐ ⭐\nHow many stars?',
          options: ['1', '2', '3'], correctAnswer: '2',
          explanation: 'Two shiny stars! ⭐⭐',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 10,
          question: '🐤 🐤 🐤\nHow many little chicks?',
          options: ['1', '2', '3'], correctAnswer: '3',
          explanation: 'Three little chicks! 🐤🐤🐤 Cheep cheep!',
        },
      ],
    },

    // ── FIRST WORDS (English) ───────────────────────────────────────────────
    {
      ...base,
      title: 'My First Words 🍌⚽🚗',
      description: 'Listen to the word and touch the right picture!',
      subjectId: subjectMap['english'], subjectSlug: 'english', topicId: 'vocabulary',
      duration: 5, xpReward: 20, coinReward: 10, order: 30,
      tags: ['toddler', 'first-words', 'vocabulary', 'visual', 'sound'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10,
          question: 'Where is the BANANA?',
          options: ['🍌', '🍎', '🥕', '🍇'], correctAnswer: '🍌',
          explanation: 'Banana! 🍌 Yellow and yummy!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10,
          question: 'Find the BALL!',
          options: ['🧸', '⚽', '🚗', '📚'], correctAnswer: '⚽',
          explanation: 'Ball! ⚽ Let\'s play!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10,
          question: 'Where is the CAR? Vroom vroom!',
          options: ['✈️', '🚲', '🚗', '⛵'], correctAnswer: '🚗',
          explanation: 'Car! 🚗 Vroom vroom!',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10,
          question: 'Touch the TEDDY BEAR!',
          options: ['🧸', '🪁', '🎈', '🥁'], correctAnswer: '🧸',
          explanation: 'Teddy bear! 🧸 So soft and cuddly!',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 10,
          question: 'Where is the HOUSE?',
          options: ['🌳', '🏠', '🌙', '🌸'], correctAnswer: '🏠',
          explanation: 'House! 🏠 Home sweet home!',
        },
      ],
    },

    // ── WARNA (Bahasa Malaysia — read aloud with the Malay voice) ──────────
    {
      ...base,
      title: 'Jom Kenal Warna! 🎨',
      description: 'Belajar warna dalam Bahasa Melayu — merah, biru, kuning, hijau!',
      subjectId: subjectMap['bahasa-malaysia'], subjectSlug: 'bahasa-malaysia', topicId: 'bacaan',
      language: 'ms',
      duration: 5, xpReward: 20, coinReward: 10, order: 30,
      tags: ['toddler', 'warna', 'colors', 'visual'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10,
          question: 'Yang mana MERAH?',
          options: ['🔴', '🔵', '🟢', '🟡'], correctAnswer: '🔴',
          explanation: 'Merah! Seperti epal 🍎!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10,
          question: 'Yang mana BIRU?',
          options: ['🟡', '🔵', '🟠', '🟢'], correctAnswer: '🔵',
          explanation: 'Biru! Seperti langit dan laut 🌊!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10,
          question: 'Yang mana KUNING?',
          options: ['🟢', '🔴', '🟡', '🟣'], correctAnswer: '🟡',
          explanation: 'Kuning! Seperti pisang 🍌!',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10,
          question: 'Yang mana HIJAU?',
          options: ['🟢', '🟠', '🔵', '🔴'], correctAnswer: '🟢',
          explanation: 'Hijau! Seperti daun 🌿!',
        },
      ],
    },

    // ── 数一数 (Mandarin — read aloud with the Chinese voice) ───────────────
    {
      ...base,
      title: '数一数：一、二、三！🐼',
      description: 'Belajar mengira dalam Mandarin! Count in Chinese — yī, èr, sān!',
      subjectId: subjectMap['mandarin'], subjectSlug: 'mandarin', topicId: 'pinyin',
      language: 'zh', isPremium: false,
      duration: 5, xpReward: 20, coinReward: 10, order: 30,
      tags: ['toddler', 'mandarin', 'counting', 'sound'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10,
          question: '🍎\n有几个苹果？',
          options: ['1', '2', '3'], correctAnswer: '1',
          explanation: '一个苹果！Yī — one! 🍎',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10,
          question: '🐼 🐼\n有几只熊猫？',
          options: ['1', '2', '3'], correctAnswer: '2',
          explanation: '两只熊猫！Èr — two! 🐼🐼',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10,
          question: '⭐ ⭐ ⭐\n有几颗星星？',
          options: ['1', '2', '3'], correctAnswer: '3',
          explanation: '三颗星星！Sān — three! ⭐⭐⭐',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10,
          question: '哪一个是红色？',
          options: ['🔴', '🔵', '🟡', '🟢'], correctAnswer: '🔴',
          explanation: '红色！Hóng sè — red! 🔴',
        },
      ],
    },

    // ── الأرقام (Arabic — read aloud with the Arabic voice) ─────────────────
    {
      ...base,
      title: 'العَدّ: ١، ٢، ٣! 🌙',
      description: 'Belajar mengira dalam Bahasa Arab! Count in Arabic — wahid, ithnan, thalatha!',
      subjectId: subjectMap['mathematics'], subjectSlug: 'mathematics', topicId: 'counting',
      language: 'ar',
      duration: 5, xpReward: 20, coinReward: 10, order: 31,
      tags: ['toddler', 'arabic', 'counting', 'sound'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10,
          question: '🍎\nكَمْ تُفَّاحَة؟',
          options: ['1', '2', '3'], correctAnswer: '1',
          explanation: 'وَاحِد — Wahid means one! 🍎',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10,
          question: '🐪 🐪\nكَمْ جَمَلًا؟',
          options: ['1', '2', '3'], correctAnswer: '2',
          explanation: 'اِثْنَان — Ithnan means two! 🐪🐪',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10,
          question: '⭐ ⭐ ⭐\nكَمْ نَجْمَة؟',
          options: ['1', '2', '3'], correctAnswer: '3',
          explanation: 'ثَلَاثَة — Thalatha means three! ⭐⭐⭐',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10,
          question: 'أَيْنَ الْقَمَر؟',
          options: ['🌙', '☀️', '⭐', '☁️'], correctAnswer: '🌙',
          explanation: 'قَمَر — Qamar means moon! 🌙',
        },
      ],
    },
  ]
}
