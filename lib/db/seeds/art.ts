/**
 * Art (Seni Visual) Lessons Seed
 * Covers: colours, shapes, famous art, Malaysian art (batik)
 */
export function getArtLessons(subjectId: any) {
  return [
    // ── 1. PRIMARY COLOURS ─────────────────────────────────────────────────
    {
      title: 'Primary & Secondary Colours 🎨',
      description: 'Mix red, blue and yellow to create ALL the colours of the rainbow!',
      subjectId, subjectSlug: 'art', topicId: 'coloring',
      ageGroup: 'preschool', grade: [0, 1, 2], type: 'interactive', difficulty: 'easy',
      duration: 8, xpReward: 35, coinReward: 15, isPremium: false, isActive: true, order: 1,
      tags: ['colours', 'primary colours', 'colour mixing', 'art basics'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🎨 The THREE primary colours are ___',
          options: [
            'Green, Orange, Purple',
            'Red, Blue, Yellow',
            'Pink, Brown, Grey',
            'Black, White, Grey',
          ], correctAnswer: 'Red, Blue, Yellow',
          explanation: 'RED, BLUE, and YELLOW are the 3 primary colours! You cannot make them by mixing other colours.',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🔴🔵 RED + BLUE = ___',
          options: ['Green', 'Orange', 'Purple', 'Brown'], correctAnswer: 'Purple',
          explanation: 'Red + Blue = PURPLE! Try it with paints! 💜',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🔴🟡 RED + YELLOW = ___',
          options: ['Purple', 'Orange', 'Green', 'Brown'], correctAnswer: 'Orange',
          explanation: 'Red + Yellow = ORANGE! Like the colour of the fruit! 🍊',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🔵🟡 BLUE + YELLOW = ___',
          options: ['Purple', 'Orange', 'Green', 'Pink'], correctAnswer: 'Green',
          explanation: 'Blue + Yellow = GREEN! Like the colour of leaves and grass! 🌿',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: 'Green, Orange, and Purple are called ___',
          options: ['Primary colours', 'Secondary colours', 'Warm colours', 'Cool colours'],
          correctAnswer: 'Secondary colours',
          explanation: 'Green, Orange and Purple are SECONDARY COLOURS — made by mixing 2 primary colours!',
        },
      ],
    },

    // ── 2. BASIC SHAPES IN ART ─────────────────────────────────────────────
    {
      title: 'Shapes in Art: Drawing with Basic Shapes ✏️',
      description: 'Every drawing starts with circles, squares and triangles — learn to see them everywhere!',
      subjectId, subjectSlug: 'art', topicId: 'drawing',
      ageGroup: 'preschool', grade: [0, 1, 2], type: 'game', difficulty: 'easy',
      duration: 8, xpReward: 35, coinReward: 15, isPremium: false, isActive: true, order: 2,
      tags: ['shapes', 'drawing', 'art basics'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '☀️ The sun is usually drawn as which basic shape?',
          options: ['Square', 'Triangle', 'Circle', 'Rectangle'], correctAnswer: 'Circle',
          explanation: 'The sun is drawn as a CIRCLE with lines for rays! ☀️',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🏠 A house roof is usually shaped like a ___',
          options: ['Circle', 'Triangle', 'Rectangle', 'Star'], correctAnswer: 'Triangle',
          explanation: 'Rooftops are TRIANGLES! The two sloping sides make a triangle shape! 🔺',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🌲 The trunk of a tree is usually drawn as a ___',
          options: ['Triangle', 'Circle', 'Rectangle', 'Star'], correctAnswer: 'Rectangle',
          explanation: 'Tree trunks are RECTANGLES — tall and thin! 🌳',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'Which 2D shape has ALL sides of the SAME length?',
          options: ['Rectangle', 'Triangle', 'Square', 'Oval'], correctAnswer: 'Square',
          explanation: 'A SQUARE has 4 equal sides — all the same length! ▪️',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: 'How many shapes does a snowman use? 🌨️\n(Look at a classic snowman drawing)',
          options: ['1 circle', '2 circles', '3 circles', '4 circles'], correctAnswer: '3 circles',
          explanation: 'A snowman has 3 circles — one big, one medium, one small for the head! ⛄',
        },
      ],
    },

    // ── 3. BATIK: Malaysian Traditional Art ────────────────────────────────
    {
      title: 'Batik Malaysia: Traditional Art Heritage 🎭',
      description: 'Discover the beautiful art of Batik — Malaysia\'s traditional fabric craft!',
      subjectId, subjectSlug: 'art', topicId: 'art-challenges',
      ageGroup: 'lower_primary', grade: [3, 4, 5], type: 'quiz', difficulty: 'medium',
      duration: 12, xpReward: 60, coinReward: 22, isPremium: false, isActive: true, order: 3,
      tags: ['batik', 'Malaysian art', 'traditional', 'heritage'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🎨 Batik is made by applying ___',
          options: ['paint', 'hot wax and dye', 'ink', 'chalk'], correctAnswer: 'hot wax and dye',
          explanation: 'Batik is made using HOT WAX — it is applied to fabric to block dye, creating beautiful patterns!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'Batik clothing is commonly worn in Malaysia on ___',
          options: ['Sports Day only', 'Cultural events, festivals and formal occasions', 'Swimming only', 'Cold weather'],
          correctAnswer: 'Cultural events, festivals and formal occasions',
          explanation: 'Batik is worn during FESTIVALS, formal occasions and cultural events — it is a symbol of Malaysian heritage!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'Which Malaysian state is most famous for Batik production?',
          options: ['Sabah', 'Selangor', 'Kelantan', 'Penang'], correctAnswer: 'Kelantan',
          explanation: 'KELANTAN is famous for its traditional Batik art! Kelantan Batik is known for its vibrant colours and intricate patterns!',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: 'Batik patterns often feature which common motifs?',
          options: [
            'Spaceships and robots',
            'Flowers, leaves, birds and geometric patterns',
            'Cars and buildings',
            'Only stripes and dots',
          ], correctAnswer: 'Flowers, leaves, birds and geometric patterns',
          explanation: 'Traditional Batik features FLOWERS (especially hibiscus), LEAVES, BIRDS, and GEOMETRIC patterns — inspired by nature!',
        },
      ],
    },

    // ── 4. FAMOUS ARTWORKS ─────────────────────────────────────────────────
    {
      title: 'Famous Art Around the World 🖼️',
      description: 'Explore amazing artworks and the incredible artists who made them!',
      subjectId, subjectSlug: 'art', topicId: 'art-challenges',
      ageGroup: 'lower_primary', grade: [3, 4, 5, 6], type: 'quiz', difficulty: 'medium',
      duration: 12, xpReward: 60, coinReward: 22, isPremium: false, isActive: true, order: 4,
      tags: ['famous art', 'art history', 'artists', 'masterpieces'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🎨 Who painted the Mona Lisa?',
          options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'],
          correctAnswer: 'Leonardo da Vinci',
          explanation: 'LEONARDO DA VINCI painted the Mona Lisa (around 1503-1519)! He was also a scientist, inventor and architect!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🌻 Who painted "The Sunflowers" (1888)?',
          options: ['Leonardo da Vinci', 'Vincent van Gogh', 'Claude Monet', 'Salvador Dali'],
          correctAnswer: 'Vincent van Gogh',
          explanation: 'VINCENT VAN GOGH painted the famous Sunflowers! He is known for his thick, swirling brushstrokes and bright colours!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'The Mona Lisa is famous for her mysterious ___',
          options: ['red dress', 'smile', 'crown', 'blue eyes'], correctAnswer: 'smile',
          explanation: 'The Mona Lisa is famous for her mysterious SMILE — people still debate whether she is smiling or not! 😐😊',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: '🏛️ The Mona Lisa is displayed in which famous museum?',
          options: ['The British Museum', 'The Louvre, Paris', 'The Vatican Museums', 'The Met, New York'],
          correctAnswer: 'The Louvre, Paris',
          explanation: 'The Mona Lisa is at THE LOUVRE in Paris, France! It is the most visited painting in the world! 🇫🇷',
        },
      ],
    },
  ]
}
