/**
 * Mathematics Lessons Seed
 * Features: emoji-visual counting, picture math, shapes, time, money
 */
export function getMathLessons(subjectId: any) {
  return [
    // ── 1. COUNTING: Picture Counting with Fruits ──────────────────────────
    {
      title: 'Picture Counting: Fruits & Animals 🍎',
      description: 'Count colourful fruits and cute animals to learn numbers 1–10!',
      subjectId, subjectSlug: 'mathematics', topicId: 'counting',
      ageGroup: 'preschool', grade: [0, 1], type: 'interactive', difficulty: 'easy',
      duration: 8, xpReward: 40, coinReward: 15, isPremium: false, isActive: true, order: 1,
      tags: ['counting', 'numbers', 'visual', 'preschool'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🍎 🍎 🍎\nHow many apples are there?',
          options: ['2', '3', '4', '5'], correctAnswer: '3',
          explanation: 'Count each apple: 1️⃣ 2️⃣ 3️⃣ — There are 3 apples!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🐥 🐥 🐥 🐥 🐥\nHow many chicks?',
          options: ['3', '4', '5', '6'], correctAnswer: '5',
          explanation: 'Count the chicks: 1, 2, 3, 4, 5 — There are 5 chicks! 🐥',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🍌 🍌\nHow many bananas?',
          options: ['1', '2', '3', '4'], correctAnswer: '2',
          explanation: 'There are 2 bananas! 🍌🍌',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 25,
          question: '🦋 🦋 🦋 🦋 🦋 🦋 🦋\nCount the butterflies!',
          options: ['5', '6', '7', '8'], correctAnswer: '7',
          explanation: 'Count carefully: 1-2-3-4-5-6-7 butterflies! 🦋',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '⭐ ⭐ ⭐ ⭐\nHow many stars?',
          options: ['3', '4', '5', '6'], correctAnswer: '4',
          explanation: 'There are 4 stars! ⭐⭐⭐⭐',
        },
        {
          id: 'q6', type: 'multiple_choice', points: 15, timeLimit: 25,
          question: '🐠 🐠 🐠 🐠 🐠 🐠 🐠 🐠 🐠 🐠\nCount all the fish!',
          options: ['8', '9', '10', '11'], correctAnswer: '10',
          explanation: 'There are 10 fish — count to 10! 🐠',
        },
      ],
    },

    // ── 2. COUNTING: Count to 20 ───────────────────────────────────────────
    {
      title: 'Counting to 20: Toy Box Challenge 🧸',
      description: 'Count toys in the toy box! Practice numbers from 10 to 20.',
      subjectId, subjectSlug: 'mathematics', topicId: 'counting',
      ageGroup: 'preschool', grade: [1], type: 'game', difficulty: 'easy',
      duration: 10, xpReward: 50, coinReward: 20, isPremium: false, isActive: true, order: 2,
      tags: ['counting', 'numbers', 'teens'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'What number comes AFTER 10?',
          options: ['9', '11', '12', '10'], correctAnswer: '11',
          explanation: '10 → 11 → 12... After 10 comes 11!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🚗 🚗 🚗 🚗 🚗 🚗 🚗 🚗 🚗 🚗 🚗 🚗\nCount the toy cars!',
          options: ['10', '11', '12', '13'], correctAnswer: '12',
          explanation: 'There are 12 toy cars! After 10, count on: 11, 12.',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'Which number is BIGGER — 15 or 19?',
          options: ['15', '19', 'They are equal', 'Cannot tell'], correctAnswer: '19',
          explanation: '19 is bigger than 15. On the number line, 19 comes after 15!',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 25,
          question: '🎈 🎈 🎈 🎈 🎈 🎈 🎈 🎈 🎈 🎈 🎈 🎈 🎈 🎈 🎈\nCount the balloons!',
          options: ['13', '14', '15', '16'], correctAnswer: '15',
          explanation: 'There are 15 balloons! Count in groups of 5: 5, 10, 15!',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: 'Fill in: 16, 17, ___, 19',
          options: ['15', '18', '20', '17'], correctAnswer: '18',
          explanation: '16, 17, 18, 19 — the missing number is 18!',
        },
      ],
    },

    // ── 3. ADDITION: Fruit Shop Adventure ─────────────────────────────────
    {
      title: 'Addition Adventure: Fruit Shop 🛒',
      description: 'Help the shopkeeper add fruits! Visual addition with numbers up to 10.',
      subjectId, subjectSlug: 'mathematics', topicId: 'addition',
      ageGroup: 'lower_primary', grade: [1, 2], type: 'quiz', difficulty: 'easy',
      duration: 10, xpReward: 60, coinReward: 20, isPremium: false, isActive: true, order: 3,
      tags: ['addition', 'visual', 'fruit'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🍊🍊🍊 + 🍊🍊 = ?\n3 oranges + 2 oranges',
          options: ['4', '5', '6', '7'], correctAnswer: '5',
          explanation: '3 + 2 = 5. Count them all: 🍊🍊🍊🍊🍊 = 5!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🍇🍇🍇🍇 + 🍇🍇🍇 = ?\n4 grapes + 3 grapes',
          options: ['5', '6', '7', '8'], correctAnswer: '7',
          explanation: '4 + 3 = 7. Four and three makes seven! 🍇',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'What is 5 + 5?',
          options: ['8', '9', '10', '11'], correctAnswer: '10',
          explanation: '5 + 5 = 10. Five fingers on each hand = 10 fingers! ✋✋',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 25,
          question: '🍒🍒 + 🍒🍒🍒🍒🍒🍒 = ?\n2 cherries + 6 cherries',
          options: ['7', '8', '9', '10'], correctAnswer: '8',
          explanation: '2 + 6 = 8. Start from 6 and count up 2 more: 7, 8!',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 25,
          question: 'There are 4 🍎 in a bag.\nMama adds 6 more 🍎.\nHow many apples now?',
          options: ['8', '9', '10', '11'], correctAnswer: '10',
          explanation: '4 + 6 = 10. That makes 10 apples! 🍎',
        },
      ],
    },

    // ── 4. SUBTRACTION: Safari Subtraction ────────────────────────────────
    {
      title: 'Subtraction Safari: Animals Run Away 🦁',
      description: 'Animals are running away! Learn subtraction by counting what\'s left.',
      subjectId, subjectSlug: 'mathematics', topicId: 'subtraction',
      ageGroup: 'lower_primary', grade: [1, 2], type: 'quiz', difficulty: 'easy',
      duration: 10, xpReward: 60, coinReward: 20, isPremium: false, isActive: true, order: 4,
      tags: ['subtraction', 'visual', 'animals'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🐘🐘🐘🐘🐘\n5 elephants. 2 walk away 🚶🚶\nHow many are left?',
          options: ['2', '3', '4', '5'], correctAnswer: '3',
          explanation: '5 − 2 = 3. Three elephants are still there! 🐘🐘🐘',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'What is 8 − 3?',
          options: ['4', '5', '6', '7'], correctAnswer: '5',
          explanation: '8 − 3 = 5. Start at 8, count back 3: 7, 6, 5!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 25,
          question: '🐦🐦🐦🐦🐦🐦🐦\n7 birds on a tree.\n4 birds fly away 🕊️\nHow many stay?',
          options: ['2', '3', '4', '5'], correctAnswer: '3',
          explanation: '7 − 4 = 3. Three birds stay on the tree! 🐦🐦🐦',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '10 − 6 = ?',
          options: ['3', '4', '5', '6'], correctAnswer: '4',
          explanation: '10 − 6 = 4. Ten minus six equals four!',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 25,
          question: 'Ali has 9 🍬 sweets.\nHe gives 5 🍬 to his friend.\nHow many does Ali have left?',
          options: ['3', '4', '5', '6'], correctAnswer: '4',
          explanation: '9 − 5 = 4. Ali has 4 sweets left! 🍬🍬🍬🍬',
        },
      ],
    },

    // ── 5. SHAPES: Shape Explorer 🔷 ───────────────────────────────────────
    {
      title: 'Shape Explorer: 2D Shapes Around Us 🔷',
      description: 'Find circles, squares, triangles and rectangles in the world around you!',
      subjectId, subjectSlug: 'mathematics', topicId: 'counting',
      ageGroup: 'preschool', grade: [0, 1, 2], type: 'interactive', difficulty: 'easy',
      duration: 8, xpReward: 45, coinReward: 15, isPremium: false, isActive: true, order: 5,
      tags: ['shapes', 'geometry', '2d shapes'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🔴\nWhat shape is this?',
          options: ['Square', 'Circle', 'Triangle', 'Rectangle'], correctAnswer: 'Circle',
          explanation: 'A circle is perfectly round with no corners! 🔴',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'A 🍕 pizza slice looks like which shape?',
          options: ['Circle', 'Square', 'Triangle', 'Rectangle'], correctAnswer: 'Triangle',
          explanation: 'A pizza slice has 3 sides — it looks like a triangle! 🍕',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'How many corners (vertices) does a square have?',
          options: ['2', '3', '4', '5'], correctAnswer: '4',
          explanation: 'A square has 4 corners and 4 equal sides! ▪️',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'Which shape has 3 sides?',
          options: ['Circle', 'Square', 'Triangle', 'Rectangle'], correctAnswer: 'Triangle',
          explanation: 'A triangle has exactly 3 sides and 3 corners! 🔺',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: 'A door is usually shaped like a ___',
          options: ['Circle', 'Triangle', 'Rectangle', 'Star'], correctAnswer: 'Rectangle',
          explanation: 'Doors are rectangles — 4 sides, with 2 long and 2 short sides!',
        },
        {
          id: 'q6', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'Which shape has NO corners and NO straight sides?',
          options: ['Square', 'Triangle', 'Rectangle', 'Circle'], correctAnswer: 'Circle',
          explanation: 'A circle has no corners and no straight sides — it is completely round!',
        },
      ],
    },

    // ── 6. MULTIPLICATION: Times Tables 2s & 5s ───────────────────────────
    {
      title: 'Multiplication Magic: 2s & 5s Tables 🪄',
      description: 'Master the 2× and 5× tables with patterns, songs, and challenges!',
      subjectId, subjectSlug: 'mathematics', topicId: 'multiplication',
      ageGroup: 'lower_primary', grade: [2, 3], type: 'game', difficulty: 'medium',
      duration: 15, xpReward: 80, coinReward: 25, isPremium: false, isActive: true, order: 6,
      tags: ['multiplication', 'times tables', '2s', '5s'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 15,
          question: '🦶🦶 Pairs of socks: 4 pairs\n2 × 4 = ?',
          options: ['6', '7', '8', '9'], correctAnswer: '8',
          explanation: '2 × 4 = 8. Each pair has 2 socks, 4 pairs = 8 socks! 🧦🧦🧦🧦🧦🧦🧦🧦',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 15,
          question: '2 × 7 = ?',
          options: ['12', '13', '14', '15'], correctAnswer: '14',
          explanation: '2 × 7 = 14. Two sevens are fourteen!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 15,
          question: '⭐⭐⭐⭐⭐ × 3 groups\n5 × 3 = ?',
          options: ['10', '12', '15', '18'], correctAnswer: '15',
          explanation: '5 × 3 = 15. Three groups of 5 stars = 15 stars! ⭐',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 15,
          question: '5 × 6 = ?',
          options: ['25', '28', '30', '35'], correctAnswer: '30',
          explanation: '5 × 6 = 30. Count in 5s: 5, 10, 15, 20, 25, 30!',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 10, timeLimit: 15,
          question: '2 × ___ = 18\nWhat is the missing number?',
          options: ['7', '8', '9', '10'], correctAnswer: '9',
          explanation: '2 × 9 = 18. Nine twos make eighteen!',
        },
        {
          id: 'q6', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: '5 × 9 = ?',
          options: ['40', '42', '45', '48'], correctAnswer: '45',
          explanation: '5 × 9 = 45. Count in 5s nine times: 5,10,15,20,25,30,35,40,45!',
        },
      ],
    },

    // ── 7. MULTIPLICATION: Times Tables 3s & 4s (Premium) ─────────────────
    {
      title: 'Times Tables Challenge: 3s & 4s 🏆',
      description: 'Level up with the 3× and 4× tables — patterns, tricks, and a final boss round!',
      subjectId, subjectSlug: 'mathematics', topicId: 'multiplication',
      ageGroup: 'lower_primary', grade: [3, 4], type: 'game', difficulty: 'hard',
      duration: 20, xpReward: 100, coinReward: 35, isPremium: true, isActive: true, order: 7,
      tags: ['multiplication', 'times tables', '3s', '4s', 'challenge'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 15,
          question: '🌟🌟🌟 × 4\n3 × 4 = ?',
          options: ['10', '11', '12', '13'], correctAnswer: '12',
          explanation: '3 × 4 = 12. Four groups of 3 = 12!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 15,
          question: '3 × 7 = ?',
          options: ['18', '20', '21', '24'], correctAnswer: '21',
          explanation: '3 × 7 = 21. Three, six, nine, twelve, fifteen, eighteen, twenty-one!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 15,
          question: '4 × 5 = ?',
          options: ['18', '20', '22', '24'], correctAnswer: '20',
          explanation: '4 × 5 = 20. Four fives are twenty!',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 15,
          question: '4 × 8 = ?',
          options: ['28', '30', '32', '34'], correctAnswer: '32',
          explanation: '4 × 8 = 32. Thirty-two!',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: '3 × ___ = 27',
          options: ['7', '8', '9', '10'], correctAnswer: '9',
          explanation: '3 × 9 = 27. Nine threes make twenty-seven!',
        },
        {
          id: 'q6', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: '4 × ___ = 36',
          options: ['7', '8', '9', '10'], correctAnswer: '9',
          explanation: '4 × 9 = 36. Nine fours make thirty-six!',
        },
      ],
    },

    // ── 8. FRACTIONS: Pizza Fractions 🍕 ──────────────────────────────────
    {
      title: 'Fractions: Pizza Party! 🍕',
      description: 'Share pizzas with friends and learn about halves, quarters and thirds!',
      subjectId, subjectSlug: 'mathematics', topicId: 'fractions',
      ageGroup: 'lower_primary', grade: [3, 4], type: 'interactive', difficulty: 'medium',
      duration: 12, xpReward: 80, coinReward: 25, isPremium: true, isActive: true, order: 8,
      tags: ['fractions', 'halves', 'quarters', 'pizza'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🍕 You cut a pizza into 2 EQUAL pieces.\nEach piece is called a ___',
          options: ['quarter', 'third', 'half', 'whole'], correctAnswer: 'half',
          explanation: 'When you cut something into 2 equal parts, each part is ONE HALF (½)!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'Which fraction means ONE out of FOUR equal parts?',
          options: ['½', '⅓', '¼', '⅔'], correctAnswer: '¼',
          explanation: '¼ (one quarter) means 1 out of 4 equal pieces!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🍕 A pizza has 8 slices.\nYou eat 2 slices.\nWhat fraction did you eat?',
          options: ['2/4', '2/8', '4/8', '1/2'], correctAnswer: '2/8',
          explanation: 'You ate 2 slices out of 8 total = 2/8 (which also equals ¼)!',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: 'Which is BIGGER — ½ or ¼ of the same pizza?',
          options: ['¼', '½', 'They are equal', 'Cannot tell'], correctAnswer: '½',
          explanation: '½ is bigger! Half a pizza is bigger than a quarter of a pizza!',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 25,
          question: '½ + ½ = ?',
          options: ['½', '1 whole', '¼', '2 wholes'], correctAnswer: '1 whole',
          explanation: 'Two halves make ONE WHOLE! ½ + ½ = 1 🍕',
        },
      ],
    },

    // ── 9. TIME: Telling Time ⏰ ───────────────────────────────────────────
    {
      title: "What's the Time? O'Clock & Half Past ⏰",
      description: "Learn to read the clock! Master o'clock and half past times.",
      subjectId, subjectSlug: 'mathematics', topicId: 'counting',
      ageGroup: 'lower_primary', grade: [1, 2], type: 'quiz', difficulty: 'easy',
      duration: 10, xpReward: 55, coinReward: 20, isPremium: false, isActive: true, order: 9,
      tags: ['time', 'clock', "o'clock", 'half past'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: "⏰ When the minute hand points to 12 and hour hand to 3,\nwhat time is it?",
          options: ["12 o'clock", "3 o'clock", "6 o'clock", "Half past 12"], correctAnswer: "3 o'clock",
          explanation: "When the short hand (hours) is on 3 and long hand on 12 — it's 3 o'clock!",
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'School starts at 7:30 in the morning.\n7:30 is also called ___',
          options: ["7 o'clock", 'Half past 7', 'Quarter past 7', 'Quarter to 8'], correctAnswer: 'Half past 7',
          explanation: '7:30 = half past 7. The minute hand is on 6 = 30 minutes = half an hour!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'How many minutes are in 1 hour?',
          options: ['30', '45', '60', '100'], correctAnswer: '60',
          explanation: 'There are 60 minutes in 1 hour! ⏰',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 15, timeLimit: 25,
          question: 'Recess is at 10:00 and ends at 10:30.\nHow long is recess?',
          options: ['15 minutes', '20 minutes', '30 minutes', '60 minutes'], correctAnswer: '30 minutes',
          explanation: 'From 10:00 to 10:30 is 30 minutes = half an hour of play time! 🎮',
        },
      ],
    },

    // ── 10. MONEY: Malaysian Ringgit 💰 ──────────────────────────────────
    {
      title: 'Money Time: Malaysian Ringgit & Sen 💰',
      description: 'Learn to count Malaysian money — RM1, RM5, 10 sen, 50 sen!',
      subjectId, subjectSlug: 'mathematics', topicId: 'counting',
      ageGroup: 'lower_primary', grade: [2, 3], type: 'quiz', difficulty: 'medium',
      duration: 12, xpReward: 70, coinReward: 25, isPremium: false, isActive: true, order: 10,
      tags: ['money', 'ringgit', 'sen', 'malaysia'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '💰 How many sen are in RM 1.00?',
          options: ['10 sen', '50 sen', '100 sen', '1000 sen'], correctAnswer: '100 sen',
          explanation: 'RM 1.00 = 100 sen. One hundred sen makes one ringgit!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'A drink costs RM 2.50.\nYou pay RM 5.00.\nHow much change do you get?',
          options: ['RM 1.50', 'RM 2.00', 'RM 2.50', 'RM 3.00'], correctAnswer: 'RM 2.50',
          explanation: 'RM 5.00 − RM 2.50 = RM 2.50 change!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'You have: 50 sen + 50 sen + 50 sen\nHow much money do you have?',
          options: ['RM 1.00', 'RM 1.50', 'RM 2.00', 'RM 2.50'], correctAnswer: 'RM 1.50',
          explanation: '50 sen × 3 = 150 sen = RM 1.50!',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 15, timeLimit: 25,
          question: '🏪 A pen costs RM 1.20.\nA ruler costs RM 2.80.\nTotal cost?',
          options: ['RM 3.00', 'RM 3.80', 'RM 4.00', 'RM 4.20'], correctAnswer: 'RM 4.00',
          explanation: 'RM 1.20 + RM 2.80 = RM 4.00. The pen and ruler cost RM 4 together!',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 25,
          question: 'Which is MORE money?\nOption A: Two RM 5 notes\nOption B: Eleven RM 1 coins',
          options: ['Two RM 5 notes (RM 10)', 'Eleven RM 1 (RM 11)', 'They are equal', 'Cannot tell'], correctAnswer: 'Eleven RM 1 (RM 11)',
          explanation: '2 × RM 5 = RM 10, but 11 × RM 1 = RM 11. RM 11 is more!',
        },
      ],
    },
  ]
}
