/**
 * Mandarin Lessons Seed
 * Covers: pinyin, greetings, numbers, family, colours, animals
 */
export function getMandarinLessons(subjectId: any) {
  return [
    // ── 1. GREETINGS 问候 ──────────────────────────────────────────────────
    {
      title: '你好！Basic Chinese Greetings 问候语',
      description: 'Learn to say hello, goodbye and how are you in Mandarin!',
      subjectId, subjectSlug: 'mandarin', topicId: 'vocabulary-zh',
      ageGroup: 'preschool', grade: [0, 1], type: 'interactive', difficulty: 'easy',
      duration: 8, xpReward: 40, coinReward: 15, isPremium: true, isActive: true, order: 1,
      tags: ['greetings', 'mandarin basics', 'conversation'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🙋 "你好" (nǐ hǎo) means ___',
          options: ['Goodbye', 'Thank you', 'Hello', 'Sorry'], correctAnswer: 'Hello',
          explanation: '你好 (nǐ hǎo) = HELLO! The most common Chinese greeting! 你=you, 好=good.',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '👋 How do you say GOODBYE in Mandarin?',
          options: ['你好 (nǐ hǎo)', '谢谢 (xiè xie)', '再见 (zài jiàn)', '对不起 (duì bu qǐ)'],
          correctAnswer: '再见 (zài jiàn)',
          explanation: '再见 (zài jiàn) = GOODBYE! 再 = again, 见 = see. "See you again!"',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🙏 "谢谢" (xiè xie) means ___',
          options: ['Sorry', 'Please', 'Thank you', 'Welcome'], correctAnswer: 'Thank you',
          explanation: '谢谢 (xiè xie) = THANK YOU! Say it twice for extra politeness! 🙏',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'How do you ask "How are you?" in Mandarin?',
          options: ['你好吗？(nǐ hǎo ma?)', '谢谢！(xiè xie!)', '再见！(zài jiàn!)', '对不起 (duì bu qǐ)'],
          correctAnswer: '你好吗？(nǐ hǎo ma?)',
          explanation: '你好吗？(nǐ hǎo ma?) = "How are you?" — add 吗 (ma) to make a question!',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: '"对不起" (duì bu qǐ) means ___',
          options: ['Hello', 'Goodbye', "I'm sorry / Excuse me", 'Thank you'],
          correctAnswer: "I'm sorry / Excuse me",
          explanation: '对不起 (duì bu qǐ) = SORRY / EXCUSE ME! Use it when you make a mistake! 😊',
        },
      ],
    },

    // ── 2. NUMBERS 数字 ────────────────────────────────────────────────────
    {
      title: 'Numbers 1–10: 一到十 🔢',
      description: 'Count from 1 to 10 in Mandarin with characters and pinyin!',
      subjectId, subjectSlug: 'mandarin', topicId: 'vocabulary-zh',
      ageGroup: 'preschool', grade: [0, 1], type: 'game', difficulty: 'easy',
      duration: 10, xpReward: 45, coinReward: 18, isPremium: true, isActive: true, order: 2,
      tags: ['numbers', 'counting', '一二三', 'mandarin basics'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '1️⃣ The number 1 in Mandarin is written as ___',
          options: ['二', '三', '一', '四'], correctAnswer: '一',
          explanation: '一 (yī) = 1! It looks like a single horizontal line — easy! ✏️',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '三 (sān) = ___',
          options: ['1', '2', '3', '4'], correctAnswer: '3',
          explanation: '三 (sān) = 3! It looks like THREE horizontal lines — one for each number! ≡',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '五 (wǔ) = ___',
          options: ['4', '5', '6', '7'], correctAnswer: '5',
          explanation: '五 (wǔ) = 5! Hold up 5 fingers — wǔ! 🖐️',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'How do you write 10 in Mandarin?',
          options: ['九', '十', '八', '七'], correctAnswer: '十',
          explanation: '十 (shí) = 10! It looks like a PLUS SIGN (+) — 十! 🔟',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '七 (qī) = ___',
          options: ['5', '6', '7', '8'], correctAnswer: '7',
          explanation: '七 (qī) = 7! Remember: qī sounds like "chee"!',
        },
        {
          id: 'q6', type: 'multiple_choice', points: 15, timeLimit: 25,
          question: '🎂 "我有 三 个苹果" means "I have ___ apples"',
          options: ['1', '2', '3', '4'], correctAnswer: '3',
          explanation: '三 = 3! "我有三个苹果" = "I have 3 apples!" 🍎🍎🍎',
        },
      ],
    },

    // ── 3. COLOURS 颜色 ───────────────────────────────────────────────────
    {
      title: 'Colours in Mandarin: 颜色 🌈',
      description: 'Learn to say red, blue, green and more in Mandarin!',
      subjectId, subjectSlug: 'mandarin', topicId: 'vocabulary-zh',
      ageGroup: 'lower_primary', grade: [1, 2], type: 'quiz', difficulty: 'easy',
      duration: 10, xpReward: 45, coinReward: 18, isPremium: true, isActive: true, order: 3,
      tags: ['colours', 'vocabulary', '颜色'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🔴 RED in Mandarin is ___',
          options: ['蓝色 (lán sè)', '红色 (hóng sè)', '绿色 (lǜ sè)', '黄色 (huáng sè)'],
          correctAnswer: '红色 (hóng sè)',
          explanation: '红色 (hóng sè) = RED! 红 (hóng) means red — think of Hong Kong! 🔴',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🔵 BLUE in Mandarin is ___',
          options: ['红色 (hóng sè)', '黑色 (hēi sè)', '蓝色 (lán sè)', '白色 (bái sè)'],
          correctAnswer: '蓝色 (lán sè)',
          explanation: '蓝色 (lán sè) = BLUE! 蓝 (lán) means blue — like the blue sky!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🌿 What colour is 绿色 (lǜ sè)?',
          options: ['Red', 'Yellow', 'Green', 'Purple'], correctAnswer: 'Green',
          explanation: '绿色 (lǜ sè) = GREEN! Like the colour of leaves and grass! 🌿',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🌞 YELLOW in Mandarin is ___',
          options: ['黑色 (hēi sè)', '黄色 (huáng sè)', '白色 (bái sè)', '紫色 (zǐ sè)'],
          correctAnswer: '黄色 (huáng sè)',
          explanation: '黄色 (huáng sè) = YELLOW! 黄 (huáng) means yellow — like the warm sun! ☀️',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: '🍎 "苹果是红色的" means ___',
          options: ['Apples are green', 'Apples are red', 'I like apples', 'Apples are sweet'],
          correctAnswer: 'Apples are red',
          explanation: '苹果 (píng guǒ) = apple, 是 = is/are, 红色的 = red. "Apples are red!" 🍎',
        },
      ],
    },

    // ── 4. FAMILY 家人 ────────────────────────────────────────────────────
    {
      title: 'My Family: 我的家人 👨‍👩‍👧‍👦',
      description: 'Learn family member names in Mandarin — baba, mama, gege and more!',
      subjectId, subjectSlug: 'mandarin', topicId: 'vocabulary-zh',
      ageGroup: 'preschool', grade: [0, 1, 2], type: 'interactive', difficulty: 'easy',
      duration: 10, xpReward: 45, coinReward: 18, isPremium: true, isActive: true, order: 4,
      tags: ['family', '家人', 'vocabulary', 'mandarin basics'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '👨 "爸爸" (bà ba) means ___',
          options: ['Mother', 'Father', 'Brother', 'Sister'], correctAnswer: 'Father',
          explanation: '爸爸 (bà ba) = FATHER / DADDY! 爸 sounds like "ba" — easy to remember!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '👩 "妈妈" (mā ma) means ___',
          options: ['Grandmother', 'Aunt', 'Mother', 'Sister'], correctAnswer: 'Mother',
          explanation: '妈妈 (mā ma) = MOTHER / MUMMY! 妈 sounds like "ma" — same in many languages!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '👦 "哥哥" (gē ge) means ___',
          options: ['Younger brother', 'Older brother', 'Father', 'Grandfather'],
          correctAnswer: 'Older brother',
          explanation: '哥哥 (gē ge) = OLDER BROTHER! In Mandarin, we distinguish between older and younger siblings!',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '👧 "妹妹" (mèi mei) means ___',
          options: ['Older sister', 'Mother', 'Younger sister', 'Grandmother'],
          correctAnswer: 'Younger sister',
          explanation: '妹妹 (mèi mei) = YOUNGER SISTER! 💕',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: '👴 "爷爷" (yé ye) refers to your ___',
          options: ["Father's father (paternal grandfather)", 'Uncle', "Mother's father", 'Great-grandfather'],
          correctAnswer: "Father's father (paternal grandfather)",
          explanation: '爷爷 (yé ye) = paternal GRANDFATHER (your father\'s father)! 👴',
        },
      ],
    },

    // ── 5. ANIMALS 动物 ───────────────────────────────────────────────────
    {
      title: 'Animals in Mandarin: 动物 🐾',
      description: 'Learn to say your favourite animals in Mandarin Chinese!',
      subjectId, subjectSlug: 'mandarin', topicId: 'vocabulary-zh',
      ageGroup: 'lower_primary', grade: [1, 2], type: 'game', difficulty: 'medium',
      duration: 10, xpReward: 50, coinReward: 20, isPremium: true, isActive: true, order: 5,
      tags: ['animals', '动物', 'vocabulary'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🐱 CAT in Mandarin is ___',
          options: ['狗 (gǒu)', '猫 (māo)', '鱼 (yú)', '鸟 (niǎo)'], correctAnswer: '猫 (māo)',
          explanation: '猫 (māo) = CAT! 猫 sounds like "meow" — the sound a cat makes! 🐱',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🐶 "狗" (gǒu) means ___',
          options: ['Cat', 'Fish', 'Dog', 'Bird'], correctAnswer: 'Dog',
          explanation: '狗 (gǒu) = DOG! Man\'s best friend in any language! 🐶',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🐼 PANDA in Mandarin is ___',
          options: ['老虎 (lǎo hǔ)', '大象 (dà xiàng)', '熊猫 (xióng māo)', '猴子 (hóu zi)'],
          correctAnswer: '熊猫 (xióng māo)',
          explanation: '熊猫 (xióng māo) = PANDA! 熊 = bear, 猫 = cat. "Bear-cat"! China\'s national treasure! 🐼',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🐘 ELEPHANT in Mandarin is ___',
          options: ['大象 (dà xiàng)', '老虎 (lǎo hǔ)', '猴子 (hóu zi)', '鱼 (yú)'],
          correctAnswer: '大象 (dà xiàng)',
          explanation: '大象 (dà xiàng) = ELEPHANT! 大 = big, 象 = elephant. "Big elephant"! 🐘',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: '🐯 TIGER in Mandarin is ___',
          options: ['狮子 (shī zi)', '老虎 (lǎo hǔ)', '大象 (dà xiàng)', '猫 (māo)'],
          correctAnswer: '老虎 (lǎo hǔ)',
          explanation: '老虎 (lǎo hǔ) = TIGER! The tiger is one of the 12 Chinese zodiac animals! 🐯',
        },
      ],
    },
  ]
}
