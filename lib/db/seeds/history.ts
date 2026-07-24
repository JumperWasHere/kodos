/**
 * History Lessons Seed
 * Covers: Malaysian history, independence, national heroes, formation of Malaysia
 */
export function getHistoryLessons(subjectId: any) {
  return [
    // ── 1. INDEPENDENCE DAY ────────────────────────────────────────────────
    {
      title: "Malaysia's Independence: Hari Merdeka 1957 🇲🇾",
      description: 'Discover how Malaysia gained independence from British rule on 31 August 1957!',
      subjectId, subjectSlug: 'history', topicId: 'malaysia-history',
      ageGroup: 'upper_primary', grade: [4, 5, 6], type: 'quiz', difficulty: 'medium',
      duration: 15, xpReward: 70, coinReward: 25, isPremium: true, isActive: true, order: 1,
      tags: ['independence', 'merdeka', '1957', 'malaysia history'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🇲🇾 Malaysia declared independence on which date?',
          options: ['16 September 1963', '31 August 1957', '1 February 1948', '26 January 1950'],
          correctAnswer: '31 August 1957',
          explanation: 'HARI MERDEKA — 31 AUGUST 1957! That\'s when the British left and Malaya became free! 🎉',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '👨‍💼 Who proclaimed Malaysia\'s independence and is known as "Bapa Malaysia"?',
          options: [
            'Tun Abdul Razak',
            'Tun Hussein Onn',
            'Tunku Abdul Rahman',
            'Tun Dr Mahathir',
          ], correctAnswer: 'Tunku Abdul Rahman',
          explanation: 'TUNKU ABDUL RAHMAN — the first Prime Minister of Malaysia — proclaimed independence and is called "Bapa Malaysia" (Father of Malaysia)!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'Before independence, Malaya was a colony of ___',
          options: ['France', 'Portugal', 'Britain (United Kingdom)', 'Netherlands'],
          correctAnswer: 'Britain (United Kingdom)',
          explanation: 'Malaya was under BRITISH colonial rule! The British came in the 18th century for trade and stayed for nearly 200 years.',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '"Merdeka! Merdeka! Merdeka!" was shouted 7 times.\nWhat does "Merdeka" mean?',
          options: ['Victory', 'Freedom / Independence', 'Unity', 'Peace'],
          correctAnswer: 'Freedom / Independence',
          explanation: 'MERDEKA means FREEDOM / INDEPENDENCE in Malay! Tunku shouted it 7 times at the Merdeka Stadium on 31 August 1957!',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 25,
          question: '🏟️ At which stadium was independence declared in 1957?',
          options: ['Stadium Nasional Bukit Jalil', 'Stadium Merdeka', 'Stadium Shah Alam', 'Stadium Putra'],
          correctAnswer: 'Stadium Merdeka',
          explanation: 'STADIUM MERDEKA in Kuala Lumpur is where independence was declared! It was specially built for this historic event!',
        },
      ],
    },

    // ── 2. FORMATION OF MALAYSIA ───────────────────────────────────────────
    {
      title: 'Formation of Malaysia: 16 September 1963 🌟',
      description: 'Learn how Malaya, Sabah, Sarawak and Singapore joined to form Malaysia!',
      subjectId, subjectSlug: 'history', topicId: 'malaysia-history',
      ageGroup: 'upper_primary', grade: [4, 5, 6], type: 'quiz', difficulty: 'medium',
      duration: 12, xpReward: 65, coinReward: 22, isPremium: true, isActive: true, order: 2,
      tags: ['formation of malaysia', '1963', 'malaysia day', 'sabah sarawak'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'Malaysia was formed on ___',
          options: ['31 August 1957', '16 September 1963', '8 August 1967', '1 January 1960'],
          correctAnswer: '16 September 1963',
          explanation: '16 SEPTEMBER 1963 — Malaysia Day! That\'s when Malaya, Singapore, Sabah and Sarawak united to form MALAYSIA!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'How many territories joined to form Malaysia in 1963?',
          options: ['2', '3', '4', '5'], correctAnswer: '4',
          explanation: '4 territories: MALAYA + SINGAPORE + SABAH + SARAWAK = MALAYSIA! (Singapore later left in 1965)',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'Singapore LEFT Malaysia in which year?',
          options: ['1963', '1964', '1965', '1966'], correctAnswer: '1965',
          explanation: 'Singapore separated from Malaysia on 9 August 1965, becoming an independent republic. That date is now Singapore\'s National Day! 🇸🇬',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 15, timeLimit: 25,
          question: '🗓️ "Malaysia Day" is celebrated on ___',
          options: ['31 August', '16 September', '1 May', '31 October'],
          correctAnswer: '16 September',
          explanation: '16 SEPTEMBER is MALAYSIA DAY — celebrating the formation of Malaysia in 1963! It is a public holiday!',
        },
      ],
    },

    // ── 3. NATIONAL HEROES ─────────────────────────────────────────────────
    {
      title: 'National Heroes of Malaysia 🏆',
      description: 'Meet the brave heroes who shaped Malaysian history!',
      subjectId, subjectSlug: 'history', topicId: 'historical-figures',
      ageGroup: 'upper_primary', grade: [4, 5, 6], type: 'quiz', difficulty: 'hard',
      duration: 15, xpReward: 80, coinReward: 30, isPremium: true, isActive: true, order: 3,
      tags: ['national heroes', 'malaysia history', 'tokoh sejarah'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 25,
          question: '⚔️ Hang Tuah was the famous warrior and laksamana (admiral) of ___',
          options: ['Kelantan', 'Melaka Sultanate', 'Johor', 'Selangor'],
          correctAnswer: 'Melaka Sultanate',
          explanation: 'HANG TUAH was the greatest warrior of the MELAKA SULTANATE (15th century), famous for his loyalty and bravery!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '"Tak Melayu Hilang Di Dunia" is associated with which hero?',
          options: ['Tunku Abdul Rahman', 'Hang Tuah', 'Mat Salleh', 'Dato Maharajalela'],
          correctAnswer: 'Hang Tuah',
          explanation: '"Tak Melayu Hilang Di Dunia" (Malays will never vanish from the earth) is the famous quote attributed to HANG TUAH!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🇲🇾 Tun Abdul Razak is known as "Bapa ___" (Father of ___)',
          options: ['Merdeka', 'Malaysia', 'Pembangunan (Development)', 'Perlembagaan'],
          correctAnswer: 'Pembangunan (Development)',
          explanation: 'Tun Abdul Razak is "BAPA PEMBANGUNAN" (Father of Development) — Malaysia\'s second PM who introduced FELDA and economic development!',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 15, timeLimit: 25,
          question: '🏗️ Who was the Prime Minister responsible for building the Petronas Twin Towers?',
          options: ['Tunku Abdul Rahman', 'Tun Abdul Razak', 'Tun Dr Mahathir Mohamad', 'Dato\' Seri Najib'],
          correctAnswer: 'Tun Dr Mahathir Mohamad',
          explanation: 'TUN DR MAHATHIR was PM when the Petronas Twin Towers were built (completed 1998)! He served as Malaysia\'s 4th and 7th PM.',
        },
      ],
    },

    // ── 4. ANCIENT KINGDOMS ────────────────────────────────────────────────
    {
      title: 'Ancient Kingdoms of the Malay World 👑',
      description: 'Journey back in time to the great kingdoms of Srivijaya and Melaka!',
      subjectId, subjectSlug: 'history', topicId: 'malaysia-history',
      ageGroup: 'upper_primary', grade: [5, 6], type: 'quiz', difficulty: 'hard',
      duration: 15, xpReward: 85, coinReward: 30, isPremium: true, isActive: true, order: 4,
      tags: ['ancient kingdoms', 'Srivijaya', 'Melaka', 'history'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 25,
          question: '⚓ The Melaka Sultanate was founded around ___',
          options: ['1200 CE', '1300 CE', '1400 CE', '1500 CE'], correctAnswer: '1400 CE',
          explanation: 'The MELAKA SULTANATE was founded around 1400 CE by PARAMESWARA! It became the most powerful trading port in Southeast Asia!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'The Melaka Sultanate attracted traders from all over the world.\nWhat made it so special?',
          options: [
            'Its army was the strongest',
            'Its strategic port location and trade-friendly policies',
            'It had the most gold',
            'It was the largest city',
          ], correctAnswer: 'Its strategic port location and trade-friendly policies',
          explanation: 'Melaka\'s strategic position on the Straits of Malacca + its welcoming trade policies made it the richest port in Asia!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 15, timeLimit: 25,
          question: 'Which European country conquered Melaka in 1511?',
          options: ['Spain', 'Britain', 'Portugal', 'Netherlands'],
          correctAnswer: 'Portugal',
          explanation: 'PORTUGAL conquered the Melaka Sultanate in 1511 under Alfonso de Albuquerque, ending 100 years of Malay glory!',
        },
      ],
    },
  ]
}
