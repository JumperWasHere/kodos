/**
 * English Lessons Seed
 * Covers: phonics, vocabulary, grammar, reading, spelling, writing
 */
export function getEnglishLessons(subjectId: any) {
  return [
    // ── 1. ALPHABET & PHONICS ───────────────────────────────────────────────
    {
      title: 'Alphabet Adventure: A to Z 🔤',
      description: 'Explore every letter with pictures, sounds, and fun examples!',
      subjectId, subjectSlug: 'english', topicId: 'phonics',
      ageGroup: 'preschool', grade: [0, 1], type: 'interactive', difficulty: 'easy',
      duration: 10, xpReward: 35, coinReward: 15, isPremium: false, isActive: true, order: 1,
      tags: ['alphabet', 'phonics', 'letters', 'beginner'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🍎 "Apple" starts with which letter?',
          options: ['B', 'A', 'P', 'E'], correctAnswer: 'A',
          explanation: 'A is for Apple! 🍎 A makes the "ah" sound.',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🐻 "Bear" starts with which letter?',
          options: ['D', 'P', 'B', 'V'], correctAnswer: 'B',
          explanation: 'B is for Bear! 🐻 B makes the "buh" sound.',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'Which of these is a VOWEL?',
          options: ['B', 'C', 'I', 'T'], correctAnswer: 'I',
          explanation: 'Vowels are A, E, I, O, U — I is a vowel!',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'Which letter comes BETWEEN N and P?',
          options: ['M', 'O', 'Q', 'L'], correctAnswer: 'O',
          explanation: 'M, N, O, P — O comes between N and P!',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🦓 "Zebra" starts with which letter?',
          options: ['X', 'Y', 'Z', 'S'], correctAnswer: 'Z',
          explanation: 'Z is for Zebra! 🦓 Z is the last letter of the alphabet.',
        },
        {
          id: 'q6', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: 'How many letters are in the English alphabet?',
          options: ['24', '25', '26', '27'], correctAnswer: '26',
          explanation: 'The English alphabet has 26 letters — from A to Z!',
        },
      ],
    },

    // ── 2. PHONICS: Short Vowel Sounds ─────────────────────────────────────
    {
      title: 'Phonics Fun: Short Vowel Sounds 🔊',
      description: 'Master the short vowel sounds A, E, I, O, U with CVC words!',
      subjectId, subjectSlug: 'english', topicId: 'phonics',
      ageGroup: 'lower_primary', grade: [1, 2], type: 'quiz', difficulty: 'easy',
      duration: 10, xpReward: 45, coinReward: 18, isPremium: false, isActive: true, order: 2,
      tags: ['phonics', 'vowels', 'sounds', 'CVC'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🐱 What vowel sound is in the word "CAT"?\n/c/ ___ /t/',
          options: ['short-e', 'short-a', 'short-i', 'short-u'], correctAnswer: 'short-a',
          explanation: 'C-A-T! The letter A in "cat" makes the short /a/ sound like in "apple"!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🐟 Which word has a short "I" sound?',
          options: ['cake', 'bike', 'fish', 'nine'], correctAnswer: 'fish',
          explanation: 'F-I-SH! The "i" in FISH is a short vowel sound: /i/ like in "it"!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🐸 Which word rhymes with "HOP"?',
          options: ['hat', 'top', 'hit', 'cup'], correctAnswer: 'top',
          explanation: 'HOP and TOP both end with the -OP sound! 🐸',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '☀️ What short vowel sound is in "SUN"?',
          options: ['short-a', 'short-e', 'short-o', 'short-u'], correctAnswer: 'short-u',
          explanation: 'S-U-N! The "u" in sun is a short vowel: /ŭ/ like in "up"!',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 25,
          question: 'Which group has ALL short vowel words?',
          options: ['cake, bike, bone', 'cat, sit, hop', 'train, feet, cube', 'play, see, go'], correctAnswer: 'cat, sit, hop',
          explanation: 'Cat /a/, Sit /i/, Hop /o/ — all short vowel CVC words!',
        },
      ],
    },

    // ── 3. VOCABULARY: Opposites Game ──────────────────────────────────────
    {
      title: 'Word Opposites: Hot & Cold, Big & Small 🔄',
      description: 'Learn opposite words (antonyms) through fun picture matching!',
      subjectId, subjectSlug: 'english', topicId: 'vocabulary',
      ageGroup: 'lower_primary', grade: [1, 2], type: 'game', difficulty: 'easy',
      duration: 8, xpReward: 40, coinReward: 15, isPremium: false, isActive: true, order: 3,
      tags: ['opposites', 'antonyms', 'vocabulary'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 15,
          question: '☀️ The opposite of HOT is ___',
          options: ['warm', 'cool', 'cold', 'mild'], correctAnswer: 'cold',
          explanation: '🔥 Hot ↔ ❄️ Cold — they are opposites!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 15,
          question: '🐘 The opposite of BIG is ___',
          options: ['large', 'tall', 'small', 'huge'], correctAnswer: 'small',
          explanation: '🐘 Big ↔ 🐜 Small — these are opposites!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 15,
          question: '⬆️ The opposite of UP is ___',
          options: ['side', 'left', 'down', 'right'], correctAnswer: 'down',
          explanation: '⬆️ Up ↔ ⬇️ Down — they are exact opposites!',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 15,
          question: '😊 The opposite of HAPPY is ___',
          options: ['joyful', 'sad', 'excited', 'tired'], correctAnswer: 'sad',
          explanation: '😊 Happy ↔ 😢 Sad — opposite feelings!',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 10, timeLimit: 15,
          question: '💡 The opposite of LIGHT (bright) is ___',
          options: ['dim', 'heavy', 'dark', 'bright'], correctAnswer: 'dark',
          explanation: '💡 Light ↔ 🌑 Dark — they are opposites!',
        },
        {
          id: 'q6', type: 'multiple_choice', points: 15, timeLimit: 15,
          question: '🐢 The opposite of FAST is ___',
          options: ['quick', 'slow', 'rapid', 'speedy'], correctAnswer: 'slow',
          explanation: '🐇 Fast ↔ 🐢 Slow! The tortoise and the hare!',
        },
      ],
    },

    // ── 4. VOCABULARY: Action Words (Verbs) ────────────────────────────────
    {
      title: "Action Words: Let's Move! 🏃",
      description: 'Learn action words (verbs) — run, jump, swim, eat and more!',
      subjectId, subjectSlug: 'english', topicId: 'vocabulary',
      ageGroup: 'lower_primary', grade: [1, 2], type: 'interactive', difficulty: 'easy',
      duration: 8, xpReward: 40, coinReward: 15, isPremium: false, isActive: true, order: 4,
      tags: ['verbs', 'action words', 'vocabulary'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 15,
          question: '🏃 Which word is an ACTION (verb)?',
          options: ['table', 'run', 'happy', 'blue'], correctAnswer: 'run',
          explanation: 'RUN is a verb — an action! You can DO it!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 15,
          question: '🐟 Fish can ___ in the water.',
          options: ['swim', 'fly', 'run', 'walk'], correctAnswer: 'swim',
          explanation: 'Fish SWIM in water! 🐟💧',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 15,
          question: '🦜 Birds can ___ in the sky.',
          options: ['swim', 'run', 'fly', 'dig'], correctAnswer: 'fly',
          explanation: 'Birds FLY in the sky with their wings! 🦜',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 15,
          question: 'Pick the VERB in: "The dog BARKS loudly."',
          options: ['dog', 'the', 'barks', 'loudly'], correctAnswer: 'barks',
          explanation: 'BARKS is the verb — it is the action the dog is doing!',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: 'Which sentence has an ACTION word?\n',
          options: ['The big tree.', 'A yellow banana.', 'She sings a song.', 'My happy dog.'], correctAnswer: 'She sings a song.',
          explanation: '"Sings" is the action (verb) — she is DOING something!',
        },
      ],
    },

    // ── 5. GRAMMAR: Nouns — People, Places, Things ─────────────────────────
    {
      title: 'Nouns: People, Places & Things 🏫',
      description: 'Identify nouns — the names of people, places, animals and things!',
      subjectId, subjectSlug: 'english', topicId: 'grammar',
      ageGroup: 'lower_primary', grade: [2, 3], type: 'quiz', difficulty: 'medium',
      duration: 10, xpReward: 55, coinReward: 20, isPremium: false, isActive: true, order: 5,
      tags: ['nouns', 'grammar', 'people places things'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'Which word is a NOUN (a thing)?',
          options: ['run', 'happy', 'book', 'quickly'], correctAnswer: 'book',
          explanation: 'BOOK is a noun — it is a thing you can hold and read! 📚',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '"She went to the PARK." — What type of noun is PARK?',
          options: ['Person', 'Place', 'Thing', 'Animal'], correctAnswer: 'Place',
          explanation: 'Park is a PLACE noun — a location you can visit!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🐯 Which word is a noun?',
          options: ['jump', 'tiger', 'slowly', 'tall'], correctAnswer: 'tiger',
          explanation: 'TIGER is a noun — it is the name of an animal!',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'How many nouns in: "The cat sat on the mat."?',
          options: ['1', '2', '3', '4'], correctAnswer: '2',
          explanation: 'CAT and MAT are the 2 nouns — they are things!',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 25,
          question: 'Which list has ONLY nouns?',
          options: ['run, jump, swim', 'happy, sad, tall', 'school, doctor, elephant', 'quickly, slowly, nicely'], correctAnswer: 'school, doctor, elephant',
          explanation: 'School (place), doctor (person), elephant (animal) — all nouns!',
        },
      ],
    },

    // ── 6. GRAMMAR: Adjectives — Describing Words ──────────────────────────
    {
      title: 'Adjectives: Describing Words 🌈',
      description: "Describe people, places and things using colourful adjectives!",
      subjectId, subjectSlug: 'english', topicId: 'grammar',
      ageGroup: 'lower_primary', grade: [2, 3], type: 'quiz', difficulty: 'medium',
      duration: 10, xpReward: 55, coinReward: 20, isPremium: false, isActive: true, order: 6,
      tags: ['adjectives', 'describing words', 'grammar'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🌹 "The BEAUTIFUL flower is red."\nWhich word is the adjective?',
          options: ['flower', 'beautiful', 'the', 'red'], correctAnswer: 'beautiful',
          explanation: 'BEAUTIFUL is the adjective — it describes how the flower looks!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'Which word DESCRIBES a noun?',
          options: ['run', 'tall', 'slowly', 'and'], correctAnswer: 'tall',
          explanation: 'TALL is an adjective — it describes how high something is!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'Fill in: "The ___ kitten is sleeping."\nWhich adjective fits best?',
          options: ['run', 'fluffy', 'quickly', 'the'], correctAnswer: 'fluffy',
          explanation: 'FLUFFY describes how the kitten feels — soft and furry!',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '"He drank the ___ juice."\nWhich is the best adjective?',
          options: ['drinks', 'sweet', 'fast', 'they'], correctAnswer: 'sweet',
          explanation: 'SWEET describes the taste of the juice — it is an adjective!',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 25,
          question: 'Which sentence uses an adjective CORRECTLY?',
          options: [
            'The happy runs.',
            'She sings the.',
            'The tall giraffe eats leaves.',
            'Run quickly and jump.',
          ], correctAnswer: 'The tall giraffe eats leaves.',
          explanation: 'TALL describes the giraffe — it is an adjective used correctly!',
        },
      ],
    },

    // ── 7. READING: Story Comprehension ────────────────────────────────────
    {
      title: 'Story Time: The Hungry Caterpillar 🐛',
      description: 'Read a short story about a caterpillar and answer questions!',
      subjectId, subjectSlug: 'english', topicId: 'reading',
      ageGroup: 'lower_primary', grade: [2, 3], type: 'quiz', difficulty: 'medium',
      duration: 12, xpReward: 65, coinReward: 25, isPremium: false, isActive: true, order: 7,
      tags: ['reading', 'comprehension', 'story', 'caterpillar'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 30,
          question: '📖 Story: "A tiny caterpillar hatched from an egg. It ate through one apple, two pears, and three plums. Then it made a cocoon. One day, a beautiful butterfly came out."\n\nWhat came out of the cocoon?',
          options: ['a caterpillar', 'a moth', 'a butterfly', 'a bee'], correctAnswer: 'a butterfly',
          explanation: '"A beautiful butterfly came out" — the caterpillar turned into a butterfly!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 25,
          question: 'How many PEARS did the caterpillar eat?',
          options: ['one', 'two', 'three', 'four'], correctAnswer: 'two',
          explanation: 'The story says "two pears" — the caterpillar ate 2 pears!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'What did the caterpillar make BEFORE becoming a butterfly?',
          options: ['a nest', 'a web', 'a cocoon', 'a shell'], correctAnswer: 'a cocoon',
          explanation: 'The caterpillar made a COCOON — a cosy covering to change inside!',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 15, timeLimit: 25,
          question: 'What is the MAIN IDEA of this story?',
          options: [
            'Fruit is healthy to eat.',
            'A caterpillar grows and changes into a butterfly.',
            'Butterflies are beautiful.',
            'Caterpillars hatch from cocoons.'
          ], correctAnswer: 'A caterpillar grows and changes into a butterfly.',
          explanation: 'The whole story is about the caterpillar\'s journey to become a butterfly — that\'s the main idea!',
        },
      ],
    },

    // ── 8. SPELLING: Animals Spelling Bee 🐝 ───────────────────────────────
    {
      title: 'Spelling Bee: Animal Names 🐝',
      description: 'Spell the names of your favourite animals correctly!',
      subjectId, subjectSlug: 'english', topicId: 'spelling',
      ageGroup: 'lower_primary', grade: [2, 3], type: 'game', difficulty: 'medium',
      duration: 10, xpReward: 60, coinReward: 22, isPremium: true, isActive: true, order: 8,
      tags: ['spelling', 'animals', 'vocabulary'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🐘 Choose the CORRECT spelling:',
          options: ['elefant', 'elephant', 'elaphant', 'elephont'], correctAnswer: 'elephant',
          explanation: 'E-L-E-P-H-A-N-T — elephant! The "ph" makes an /f/ sound!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🦒 Choose the CORRECT spelling:',
          options: ['jiraf', 'giraffe', 'giraf', 'jiraffe'], correctAnswer: 'giraffe',
          explanation: 'G-I-R-A-F-F-E — giraffe! Two Fs at the end!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🐋 Choose the CORRECT spelling:',
          options: ['wale', 'waile', 'whale', 'whail'], correctAnswer: 'whale',
          explanation: 'W-H-A-L-E — whale! The "wh" is silent W!',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🐒 Choose the CORRECT spelling:',
          options: ['monky', 'monkey', 'monkee', 'monkie'], correctAnswer: 'monkey',
          explanation: 'M-O-N-K-E-Y — monkey! Ends with -KEY!',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: '🦋 Choose the CORRECT spelling:',
          options: ['buterfly', 'butterflye', 'butterfly', 'butterfy'], correctAnswer: 'butterfly',
          explanation: 'B-U-T-T-E-R-F-L-Y — butterfly! Double T in the middle!',
        },
      ],
    },

    // ── SPELLING BEE (Fill-in-the-blank) ───────────────────────────────────
    {
      title: 'Spelling Bee: Type It Out! 🐝',
      description: 'No options this time — look at the picture clue and TYPE the word!',
      subjectId, subjectSlug: 'english', topicId: 'vocabulary',
      ageGroup: 'lower_primary', grade: [2, 3], type: 'game', difficulty: 'medium',
      duration: 10, xpReward: 55, coinReward: 22, isPremium: false, isActive: true, order: 20,
      tags: ['spelling', 'vocabulary', 'fill-blank', 'typing'],
      questions: [
        {
          id: 'q1', type: 'fill_blank', points: 10, timeLimit: 25,
          question: '🐘 This BIG grey animal has a long trunk.\nType its name:',
          correctAnswer: ['elephant', 'an elephant'],
          explanation: 'E-L-E-P-H-A-N-T — elephant! The "f" sound is spelled PH. 🐘',
        },
        {
          id: 'q2', type: 'fill_blank', points: 10, timeLimit: 25,
          question: '🌈 After the rain, you might see this colourful arc in the sky.\nType its name:',
          correctAnswer: ['rainbow', 'a rainbow'],
          explanation: 'R-A-I-N-B-O-W — rainbow! Rain + bow = rainbow. 🌈',
        },
        {
          id: 'q3', type: 'fill_blank', points: 10, timeLimit: 25,
          question: '🏫 The place where you go to learn every day.\nType its name:',
          correctAnswer: ['school', 'a school'],
          explanation: 'S-C-H-O-O-L — school! Remember the silent-looking CH. 🏫',
        },
        {
          id: 'q4', type: 'fill_blank', points: 15, timeLimit: 30,
          question: 'Finish the sentence:\n"The opposite of HOT is ___"',
          correctAnswer: ['cold'],
          explanation: 'Hot and COLD are opposites (antonyms)! 🥶🔥',
        },
        {
          id: 'q5', type: 'fill_blank', points: 15, timeLimit: 30,
          question: '🍌🍌 One banana, two ___\nType the plural word:',
          correctAnswer: ['bananas'],
          explanation: 'Just add -S: one banana, two bananaS! 🍌',
        },
      ],
    },
  ]
}
