/**
 * Geography Lessons Seed
 * Covers: Malaysian geography, continents, oceans, ASEAN
 */
export function getGeographyLessons(subjectId: any) {
  return [
    // ── 1. MALAYSIA: States & Capitals ─────────────────────────────────────
    {
      title: 'Malaysia: 13 States & 3 Federal Territories 🇲🇾',
      description: 'Discover all 16 states and territories that make up beautiful Malaysia!',
      subjectId, subjectSlug: 'geography', topicId: 'malaysia-geo',
      ageGroup: 'lower_primary', grade: [3, 4], type: 'quiz', difficulty: 'medium',
      duration: 15, xpReward: 70, coinReward: 25, isPremium: true, isActive: true, order: 1,
      tags: ['malaysia', 'states', 'capitals', 'geography'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 25,
          question: '🏙️ What is the CAPITAL CITY of Malaysia?',
          options: ['Johor Bahru', 'Georgetown', 'Kuala Lumpur', 'Kota Kinabalu'],
          correctAnswer: 'Kuala Lumpur',
          explanation: 'KUALA LUMPUR is the capital city of Malaysia! Home of the Petronas Twin Towers! 🗼',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🌊 Malaysia is divided into TWO main regions.\nThey are ___',
          options: [
            'East Malaysia and West Malaysia',
            'North Malaysia and South Malaysia',
            'Peninsular Malaysia and Sabah',
            'Sarawak and Peninsular Malaysia',
          ], correctAnswer: 'East Malaysia and West Malaysia',
          explanation: 'Malaysia has WEST MALAYSIA (Peninsular) and EAST MALAYSIA (Sabah & Sarawak on Borneo island)!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🦧 Orangutans are native to Malaysia\'s largest state ___',
          options: ['Selangor', 'Sabah', 'Perak', 'Johor'], correctAnswer: 'Sabah',
          explanation: 'SABAH is Malaysia\'s largest state by area and is home to famous orangutans! 🦧',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🏝️ The smallest state in Malaysia is ___',
          options: ['Penang', 'Perlis', 'Putrajaya', 'Melaka'], correctAnswer: 'Perlis',
          explanation: 'PERLIS is the smallest state in Malaysia, located in the north near the Thai border!',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 25,
          question: '🌆 Kuala Lumpur, Labuan, and Putrajaya are Malaysia\'s ___',
          options: ['Biggest states', 'Federal Territories', 'Island states', 'Royal capitals'],
          correctAnswer: 'Federal Territories',
          explanation: 'Kuala Lumpur, Putrajaya, and Labuan are Malaysia\'s 3 FEDERAL TERRITORIES — directly governed by the federal government!',
        },
      ],
    },

    // ── 2. SEVEN CONTINENTS 七大洲 ─────────────────────────────────────────
    {
      title: 'Seven Continents of the World 🌍',
      description: 'Explore all 7 continents — from Asia to Antarctica and beyond!',
      subjectId, subjectSlug: 'geography', topicId: 'continents',
      ageGroup: 'lower_primary', grade: [3, 4, 5], type: 'interactive', difficulty: 'medium',
      duration: 12, xpReward: 65, coinReward: 22, isPremium: true, isActive: true, order: 2,
      tags: ['continents', 'world geography', 'seven continents'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'How many continents are there on Earth?',
          options: ['5', '6', '7', '8'], correctAnswer: '7',
          explanation: 'There are 7 continents: Asia, Africa, North America, South America, Europe, Australia, Antarctica!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🌏 Malaysia is located in which continent?',
          options: ['Africa', 'Europe', 'Asia', 'Australia'], correctAnswer: 'Asia',
          explanation: 'Malaysia is in ASIA — the largest continent on Earth! We are in Southeast Asia specifically.',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🌍 The LARGEST continent by area is ___',
          options: ['Africa', 'Asia', 'North America', 'Europe'], correctAnswer: 'Asia',
          explanation: 'ASIA is the largest continent — covering about 30% of Earth\'s total land area! 🌏',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🧊 Which continent is covered mostly in ICE and has no permanent residents?',
          options: ['Arctic', 'Europe', 'Antarctica', 'Australia'], correctAnswer: 'Antarctica',
          explanation: 'ANTARCTICA is the frozen continent at the South Pole! Scientists visit but no one lives there permanently!',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: '🦘 Which continent is also a country?',
          options: ['Africa', 'Europe', 'Australia', 'South America'], correctAnswer: 'Australia',
          explanation: 'AUSTRALIA is unique — it is both a continent AND a country! Home of kangaroos and koalas! 🦘',
        },
      ],
    },

    // ── 3. ASEAN COUNTRIES ─────────────────────────────────────────────────
    {
      title: 'ASEAN: Our Neighbours 🌏',
      description: 'Get to know Malaysia\'s neighbours in Southeast Asia — the ASEAN family!',
      subjectId, subjectSlug: 'geography', topicId: 'malaysia-geo',
      ageGroup: 'lower_primary', grade: [4, 5, 6], type: 'quiz', difficulty: 'medium',
      duration: 15, xpReward: 70, coinReward: 25, isPremium: true, isActive: true, order: 3,
      tags: ['ASEAN', 'Southeast Asia', 'neighbouring countries'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'ASEAN stands for ___',
          options: [
            'Asian States And Eastern Nations',
            'Association of Southeast Asian Nations',
            'Allied Southeast Asian Networks',
            'Asian Society of Economic and Agricultural Nations',
          ], correctAnswer: 'Association of Southeast Asian Nations',
          explanation: 'ASEAN = Association of Southeast Asian Nations! It was founded in 1967 to promote cooperation!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'How many countries are in ASEAN?',
          options: ['8', '9', '10', '11'], correctAnswer: '10',
          explanation: 'ASEAN has 10 member countries: Malaysia, Indonesia, Singapore, Thailand, Philippines, Vietnam, Myanmar, Cambodia, Laos, Brunei!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🏙️ Singapore is a tiny island country that borders ___',
          options: ['Thailand', 'Indonesia', 'Malaysia', 'Philippines'], correctAnswer: 'Malaysia',
          explanation: 'Singapore is connected to MALAYSIA via the Johor-Singapore Causeway! It is just south of Johor!',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🌋 Indonesia is famous for having many ___',
          options: ['deserts', 'volcanoes', 'glaciers', 'tundras'], correctAnswer: 'volcanoes',
          explanation: 'Indonesia sits on the "Ring of Fire" and has over 130 active VOLCANOES! 🌋',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 25,
          question: 'The ASEAN flag has how many rings?',
          options: ['5', '8', '10', '12'], correctAnswer: '10',
          explanation: 'The ASEAN emblem has 10 stalks of paddy (rice) representing the 10 member nations!',
        },
      ],
    },

    // ── 4. NATIONAL SYMBOLS OF MALAYSIA ────────────────────────────────────
    {
      title: "Malaysia's National Symbols 🇲🇾",
      description: "Learn Malaysia's national animal, flower, bird and other proud symbols!",
      subjectId, subjectSlug: 'geography', topicId: 'malaysia-geo',
      ageGroup: 'lower_primary', grade: [3, 4, 5], type: 'game', difficulty: 'easy',
      duration: 10, xpReward: 55, coinReward: 20, isPremium: true, isActive: true, order: 4,
      tags: ['malaysia', 'national symbols', 'patriotism'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🌺 What is Malaysia\'s national flower?',
          options: ['Rose', 'Jasmine', 'Hibiscus (Bunga Raya)', 'Lotus'],
          correctAnswer: 'Hibiscus (Bunga Raya)',
          explanation: 'The HIBISCUS (Bunga Raya) 🌺 is Malaysia\'s national flower! Its 5 petals represent the Rukun Negara!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🐯 What is Malaysia\'s national animal?',
          options: ['Elephant', 'Orangutan', 'Malayan Tiger', 'Proboscis Monkey'],
          correctAnswer: 'Malayan Tiger',
          explanation: 'The MALAYAN TIGER (Harimau Malaya) 🐯 is Malaysia\'s national animal! It appears on the coat of arms (Jata Negara)!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🦅 Malaysia\'s national bird is the ___',
          options: ['Eagle', 'Rhinoceros Hornbill', 'Burung Enggang (Rhinoceros Hornbill)', 'Peacock'],
          correctAnswer: 'Burung Enggang (Rhinoceros Hornbill)',
          explanation: 'The RHINOCEROS HORNBILL (Burung Enggang) 🦅 is Malaysia\'s national bird — especially important in Sarawak!',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: '📅 Malaysia celebrates National Day (Hari Merdeka) on ___',
          options: ['31 August', '16 September', '1 January', '31 December'],
          correctAnswer: '31 August',
          explanation: 'HARI MERDEKA is on 31 AUGUST! In 1957, Tunku Abdul Rahman declared Malaysia\'s independence! Malaysia Boleh! 🇲🇾',
        },
      ],
    },
  ]
}
