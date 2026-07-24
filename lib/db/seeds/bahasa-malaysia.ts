/**
 * Bahasa Malaysia Lessons Seed
 * Covers: fonik, huruf, tatabahasa, bacaan, pemahaman, ejaan
 */
export function getBahasaMalaysiaLessons(subjectId: any) {
  return [
    // ── 1. HURUF VOKAL ─────────────────────────────────────────────────────
    {
      title: 'Huruf Vokal: A, E, I, O, U 🔤',
      description: 'Kenali huruf vokal dalam Bahasa Malaysia dengan cara yang seronok dan mudah!',
      subjectId, subjectSlug: 'bahasa-malaysia', topicId: 'fonik',
      ageGroup: 'preschool', grade: [0, 1], type: 'interactive', difficulty: 'easy',
      duration: 8, xpReward: 35, coinReward: 15, isPremium: false, isActive: true, order: 1,
      tags: ['huruf vokal', 'abjad', 'fonik', 'preschool'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'Huruf vokal dalam Bahasa Malaysia ialah:',
          options: ['A, B, C, D, E', 'A, E, I, O, U', 'B, D, F, H, J', 'C, G, K, M, N'],
          correctAnswer: 'A, E, I, O, U',
          explanation: 'Huruf vokal ialah A, E, I, O, U — 5 huruf istimewa yang boleh berdiri sendiri! 🌟',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🍎 "AYAM" — huruf pertama ialah?',
          options: ['E', 'A', 'I', 'U'], correctAnswer: 'A',
          explanation: 'A-Y-A-M — huruf pertama ialah A, huruf vokal!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'Perkataan manakah bermula dengan huruf vokal?',
          options: ['bola', 'pokok', 'ibu', 'meja'], correctAnswer: 'ibu',
          explanation: '"IBU" bermula dengan huruf I — huruf vokal! I-B-U',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '"BUKU" — berapa banyak huruf vokal dalam perkataan ini?',
          options: ['1', '2', '3', '0'], correctAnswer: '2',
          explanation: 'B-U-K-U — huruf U muncul DUA kali! Jadi ada 2 huruf vokal. 📚',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: 'Pilih perkataan yang mengandungi huruf vokal E:',
          options: ['buku', 'ibu', 'esok', 'unta'], correctAnswer: 'esok',
          explanation: '"ESOK" bermula dengan E — huruf vokal! Esok = tomorrow! 📅',
        },
      ],
    },

    // ── 2. KATA NAMA AM ────────────────────────────────────────────────────
    {
      title: 'Kata Nama Am: Orang, Tempat, Benda 🏫',
      description: 'Pelajari kata nama am dalam Bahasa Malaysia — nama orang, tempat, haiwan dan benda!',
      subjectId, subjectSlug: 'bahasa-malaysia', topicId: 'tatabahasa',
      ageGroup: 'lower_primary', grade: [2, 3], type: 'quiz', difficulty: 'medium',
      duration: 10, xpReward: 55, coinReward: 20, isPremium: false, isActive: true, order: 2,
      tags: ['kata nama', 'tatabahasa', 'orang tempat benda'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '📚 Manakah yang merupakan KATA NAMA AM?',
          options: ['berlari', 'cantik', 'buku', 'dengan'], correctAnswer: 'buku',
          explanation: '"BUKU" adalah kata nama am — ia adalah BENDA yang boleh kita pegang dan baca! 📚',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '"Saya pergi ke SEKOLAH."\n"Sekolah" adalah kata nama am jenis ___',
          options: ['orang', 'tempat', 'benda', 'haiwan'], correctAnswer: 'tempat',
          explanation: '"SEKOLAH" adalah kata nama am jenis TEMPAT — ia adalah sebuah lokasi!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🐯 "Harimau" adalah kata nama am jenis ___',
          options: ['orang', 'tempat', 'benda', 'haiwan'], correctAnswer: 'haiwan',
          explanation: '"HARIMAU" adalah kata nama am jenis HAIWAN — ia adalah seekor binatang buas!',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'Pilih kata nama am dalam ayat:\n"Budak itu berlari laju di padang."',
          options: ['itu', 'berlari', 'budak', 'laju'], correctAnswer: 'budak',
          explanation: '"BUDAK" adalah kata nama am jenis ORANG — merujuk kepada seorang kanak-kanak!',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 25,
          question: 'Senarai manakah yang mengandungi HANYA kata nama am?',
          options: [
            'kucing, makan, besar',
            'berlari, melompat, berenang',
            'sekolah, doktor, bunga',
            'cantik, pandai, rajin',
          ], correctAnswer: 'sekolah, doktor, bunga',
          explanation: 'Sekolah (tempat), doktor (orang), bunga (benda/tumbuhan) — semua kata nama am! ✅',
        },
      ],
    },

    // ── 3. KATA KERJA ─────────────────────────────────────────────────────
    {
      title: 'Kata Kerja: Aksi Seronok! 🏃',
      description: 'Pelajari kata kerja dalam BM — perkataan tindakan seperti berlari, melompat, makan!',
      subjectId, subjectSlug: 'bahasa-malaysia', topicId: 'tatabahasa',
      ageGroup: 'lower_primary', grade: [2, 3], type: 'game', difficulty: 'easy',
      duration: 8, xpReward: 45, coinReward: 18, isPremium: false, isActive: true, order: 3,
      tags: ['kata kerja', 'tatabahasa', 'perkataan tindakan'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 15,
          question: '🏃 Manakah yang merupakan KATA KERJA?',
          options: ['meja', 'berlari', 'cantik', 'buku'], correctAnswer: 'berlari',
          explanation: '"BERLARI" adalah kata kerja — ia adalah perbuatan/tindakan yang boleh dilakukan!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 15,
          question: '🐟 Ikan boleh ___ di dalam air.',
          options: ['terbang', 'berenang', 'memanjat', 'berlari'], correctAnswer: 'berenang',
          explanation: 'Ikan BERENANG di dalam air! Berenang adalah kata kerja. 🐟',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 15,
          question: 'Cari KATA KERJA dalam ayat:\n"Dia makan nasi goreng."',
          options: ['dia', 'makan', 'nasi', 'goreng'], correctAnswer: 'makan',
          explanation: '"MAKAN" adalah kata kerja — ia adalah tindakan yang dilakukan! Yummy! 😋',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 15,
          question: '🦅 Burung boleh ___',
          options: ['terbang', 'menyelam', 'memanjat', 'merangkak'], correctAnswer: 'terbang',
          explanation: 'Burung TERBANG di udara dengan sayapnya! ✈️',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: 'Senarai manakah mengandungi HANYA kata kerja?',
          options: [
            'meja, kerusi, almari',
            'cantik, pandai, bijak',
            'berlari, melompat, memasak',
            'itu, ini, sini',
          ], correctAnswer: 'berlari, melompat, memasak',
          explanation: 'Berlari, melompat, memasak — semua adalah tindakan! Semuanya KATA KERJA! ✅',
        },
      ],
    },

    // ── 4. KATA ADJEKTIF ──────────────────────────────────────────────────
    {
      title: 'Kata Adjektif: Sifat & Ciri Benda 🌈',
      description: 'Gambarkan orang, haiwan dan benda menggunakan kata adjektif yang menarik!',
      subjectId, subjectSlug: 'bahasa-malaysia', topicId: 'tatabahasa',
      ageGroup: 'lower_primary', grade: [2, 3], type: 'quiz', difficulty: 'medium',
      duration: 10, xpReward: 55, coinReward: 20, isPremium: false, isActive: true, order: 4,
      tags: ['kata adjektif', 'tatabahasa', 'sifat'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🌹 "Bunga itu CANTIK dan MERAH."\nManakah kata adjektif?',
          options: ['bunga', 'itu', 'cantik', 'dan'], correctAnswer: 'cantik',
          explanation: '"CANTIK" adalah kata adjektif — ia menerangkan sifat bunga itu!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'Pilih KATA ADJEKTIF daripada senarai ini:',
          options: ['berlari', 'sekolah', 'rajin', 'dan'], correctAnswer: 'rajin',
          explanation: '"RAJIN" adalah kata adjektif — ia menerangkan perangai seseorang!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '"Murid itu ___ dan suka belajar."\nPilih kata adjektif yang sesuai:',
          options: ['berlari', 'pintar', 'meja', 'dengan'], correctAnswer: 'pintar',
          explanation: '"PINTAR" adalah kata adjektif yang tepat — ia menggambarkan sifat murid tersebut!',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🐘 "Gajah itu ___." — Pilih kata adjektif terbaik:',
          options: ['berlari', 'makan', 'besar', 'pokok'], correctAnswer: 'besar',
          explanation: '"BESAR" adalah kata adjektif yang menggambarkan saiz gajah! 🐘',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 25,
          question: 'Ayat manakah menggunakan kata adjektif dengan BETUL?',
          options: [
            'Kucing itu berlari dengan pantas.',
            'Budak itu makan nasi.',
            'Buah mangga itu masam dan lazat.',
            'Dia pergi ke sekolah.',
          ], correctAnswer: 'Buah mangga itu masam dan lazat.',
          explanation: '"MASAM" dan "LAZAT" adalah kata adjektif yang menggambarkan rasa mangga! 🥭',
        },
      ],
    },

    // ── 5. BACAAN: Cerita Pendek ──────────────────────────────────────────
    {
      title: 'Bacaan: Cerita Kucing Manja 🐱',
      description: 'Baca cerita pendek tentang kucing dan jawab soalan pemahaman!',
      subjectId, subjectSlug: 'bahasa-malaysia', topicId: 'bacaan',
      ageGroup: 'lower_primary', grade: [2, 3], type: 'quiz', difficulty: 'medium',
      duration: 12, xpReward: 60, coinReward: 22, isPremium: false, isActive: true, order: 5,
      tags: ['bacaan', 'pemahaman', 'cerita', 'kucing'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 30,
          question: '📖 Cerita: "Nama kucing saya ialah Comel. Dia berwarna putih dan sangat manja. Setiap pagi, Comel suka bermain bola. Pada waktu malam, dia tidur di atas tilam."\n\nApakah nama kucing tersebut?',
          options: ['Putih', 'Manja', 'Comel', 'Bola'], correctAnswer: 'Comel',
          explanation: 'Ayat pertama menyatakan "Nama kucing saya ialah COMEL"!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 25,
          question: 'Apakah warna kucing Comel?',
          options: ['hitam', 'coklat', 'putih', 'kuning'], correctAnswer: 'putih',
          explanation: '"Dia berwarna PUTIH" — Comel adalah kucing putih yang comel!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'Pada waktu MALAM, Comel suka ___',
          options: ['bermain bola', 'makan ikan', 'tidur di atas tilam', 'berlari di taman'], correctAnswer: 'tidur di atas tilam',
          explanation: '"Pada waktu malam, dia TIDUR DI ATAS TILAM" — Comel tidur dengan nyenyak!',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 15, timeLimit: 25,
          question: 'Apakah IDEA UTAMA cerita ini?',
          options: [
            'Cara memelihara kucing',
            'Perihal seekor kucing bernama Comel dan rutinya',
            'Mengapa kucing suka bermain',
            'Jenis-jenis haiwan peliharaan',
          ], correctAnswer: 'Perihal seekor kucing bernama Comel dan rutinya',
          explanation: 'Cerita ini menceritakan tentang kucing Comel — namanya, sifatnya, dan kegiatannya sehari-hari!',
        },
      ],
    },

    // ── 6. EJAAN: Nama Haiwan ─────────────────────────────────────────────
    {
      title: 'Ejaan Betul: Nama Haiwan 🐾',
      description: 'Uji ejaan BM kamu dengan nama-nama haiwan yang biasa dijumpai!',
      subjectId, subjectSlug: 'bahasa-malaysia', topicId: 'ejaan',
      ageGroup: 'lower_primary', grade: [2, 3], type: 'game', difficulty: 'medium',
      duration: 10, xpReward: 55, coinReward: 20, isPremium: false, isActive: true, order: 6,
      tags: ['ejaan', 'haiwan', 'kosa kata'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🐘 Pilih ejaan yang BETUL:',
          options: ['gajah', 'gejah', 'gajaah', 'gjah'], correctAnswer: 'gajah',
          explanation: 'G-A-J-A-H — GAJAH! Haiwan yang besar dan bijak! 🐘',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🐯 Pilih ejaan yang BETUL:',
          options: ['harimau', 'harimao', 'haerimau', 'harimaw'], correctAnswer: 'harimau',
          explanation: 'H-A-R-I-M-A-U — HARIMAU! Raja hutan yang gagah! 🐯',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🦒 Pilih ejaan yang BETUL:',
          options: ['zirafah', 'zirafeh', 'ziraafah', 'zirafah'], correctAnswer: 'zirafah',
          explanation: 'Z-I-R-A-F-A-H — ZIRAFAH! Haiwan yang paling tinggi di dunia! 🦒',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🐒 Pilih ejaan yang BETUL:',
          options: ['monyet', 'munyit', 'monit', 'monyit'], correctAnswer: 'monyet',
          explanation: 'M-O-N-Y-E-T — MONYET! Haiwan yang pandai memanjat pokok! 🐒',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: '🦋 Pilih ejaan yang BETUL:',
          options: ['kupukupu', 'kupu-kupu', 'koupoukou', 'kupu kupu'], correctAnswer: 'kupu-kupu',
          explanation: 'K-U-P-U-K-U-P-U dengan tanda sempang — KUPU-KUPU! 🦋 Cantik sekali!',
        },
      ],
    },

    // ── 7. PERIBAHASA ─────────────────────────────────────────────────────
    {
      title: 'Peribahasa Malaysia: Kata Mutiara 💎',
      description: 'Pelajari peribahasa popular Malaysia dan maksudnya!',
      subjectId, subjectSlug: 'bahasa-malaysia', topicId: 'pemahaman',
      ageGroup: 'upper_primary', grade: [4, 5, 6], type: 'quiz', difficulty: 'hard',
      duration: 15, xpReward: 80, coinReward: 30, isPremium: true, isActive: true, order: 7,
      tags: ['peribahasa', 'kata mutiara', 'budaya', 'BM lanjutan'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 15, timeLimit: 25,
          question: '"Berat sama dipikul, ringan sama dijinjing."\nApakah maksud peribahasa ini?',
          options: [
            'Satu orang menanggung semua beban',
            'Senasib sepenanggungan — susah dan senang bersama',
            'Orang kuat membantu orang lemah',
            'Beban yang berat perlu dibahagi',
          ], correctAnswer: 'Senasib sepenanggungan — susah dan senang bersama',
          explanation: '"Berat sama dipikul, ringan sama dijinjing" bermaksud kesusahan dan kesenangan ditanggung bersama — bekerjasama! 🤝',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 15, timeLimit: 25,
          question: '"Seperti kacang lupakan kulit."\nPeribahasa ini digunakan untuk ___',
          options: [
            'Orang yang sangat suka makan kacang',
            'Orang yang melupakan asal usul atau jasa orang',
            'Orang yang rajin bekerja',
            'Orang yang banyak bercakap',
          ], correctAnswer: 'Orang yang melupakan asal usul atau jasa orang',
          explanation: '"Seperti kacang lupakan kulit" = seseorang yang melupakan asal usulnya atau orang yang berjasa kepadanya!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 15, timeLimit: 25,
          question: '"Sedikit-sedikit lama-lama jadi bukit."\nApakah pengajaran peribahasa ini?',
          options: [
            'Bukit perlu dibina sedikit demi sedikit',
            'Usaha yang berterusan walaupun sedikit akan menghasilkan sesuatu yang besar',
            'Jangan tamak dalam mengumpul harta',
            'Kerja keras menghasilkan kejayaan segera',
          ], correctAnswer: 'Usaha yang berterusan walaupun sedikit akan menghasilkan sesuatu yang besar',
          explanation: 'Simpan sedikit demi sedikit, lama-lama jadi banyak! Usaha yang konsisten akan membuahkan hasil yang besar! 🏔️',
        },
      ],
    },
  ]
}
