/**
 * ICT Lessons Seed
 * Covers: computer basics, internet safety, coding intro, logic puzzles
 */
export function getIctLessons(subjectId: any) {
  return [
    // ── 1. COMPUTER PARTS ─────────────────────────────────────────────────
    {
      title: 'Computer Parts: Know Your Device! 🖥️',
      description: 'Learn the names of computer parts and what each one does!',
      subjectId, subjectSlug: 'ict', topicId: 'computer-basics',
      ageGroup: 'lower_primary', grade: [1, 2], type: 'interactive', difficulty: 'easy',
      duration: 10, xpReward: 45, coinReward: 18, isPremium: true, isActive: true, order: 1,
      tags: ['computer parts', 'hardware', 'ICT basics'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '⌨️ We type letters and numbers using the ___',
          options: ['Mouse', 'Monitor', 'Keyboard', 'Printer'], correctAnswer: 'Keyboard',
          explanation: 'The KEYBOARD is used to type! It has keys for letters, numbers, and special commands!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🖥️ The SCREEN that shows pictures and text is called the ___',
          options: ['CPU', 'Monitor', 'Speaker', 'Keyboard'], correctAnswer: 'Monitor',
          explanation: 'The MONITOR is the screen! It displays everything you work on — text, images, videos!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🖱️ What do we use to CLICK and move around on the screen?',
          options: ['Keyboard', 'Printer', 'Mouse', 'USB drive'], correctAnswer: 'Mouse',
          explanation: 'The MOUSE lets you click, double-click, and move the cursor (arrow) on the screen! 🖱️',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🖨️ Which device produces a paper copy of your work?',
          options: ['Scanner', 'Printer', 'Monitor', 'Speaker'], correctAnswer: 'Printer',
          explanation: 'The PRINTER prints your digital work onto paper! 🖨️📄',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '💾 The "BRAIN" of the computer that processes everything is called the ___',
          options: ['Monitor', 'Keyboard', 'CPU (Central Processing Unit)', 'Mouse'],
          correctAnswer: 'CPU (Central Processing Unit)',
          explanation: 'The CPU is the "brain" of the computer — it processes all instructions and runs all programs!',
        },
        {
          id: 'q6', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: '📱 A smartphone is a type of ___',
          options: ['Desktop computer only', 'Computer (mobile/portable)', 'Only a phone', 'TV'],
          correctAnswer: 'Computer (mobile/portable)',
          explanation: 'A smartphone is a MOBILE COMPUTER! It has a processor, memory, and runs apps — just like a computer!',
        },
      ],
    },

    // ── 2. INTERNET SAFETY ────────────────────────────────────────────────
    {
      title: 'Internet Safety: Be Safe Online! 🛡️',
      description: 'Learn the golden rules to stay safe, smart and happy on the internet!',
      subjectId, subjectSlug: 'ict', topicId: 'internet-safety',
      ageGroup: 'lower_primary', grade: [2, 3, 4], type: 'quiz', difficulty: 'medium',
      duration: 12, xpReward: 60, coinReward: 22, isPremium: true, isActive: true, order: 2,
      tags: ['internet safety', 'online safety', 'cybersecurity kids', 'digital citizenship'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🔒 Should you share your home address with strangers online?',
          options: ['Yes, if they are friendly', 'Yes, always', 'No, never share personal info', 'Only if they ask nicely'],
          correctAnswer: 'No, never share personal info',
          explanation: 'NEVER share your address, school name, or phone number online! Your personal info is private and must be protected! 🔒',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🔐 A strong password should be ___',
          options: [
            'Your name and birthday (e.g. Ali2010)',
            'Short and easy like "1234"',
            'Long with numbers, letters and symbols (e.g. Sun$hine42!)',
            'The word "password"',
          ], correctAnswer: 'Long with numbers, letters and symbols (e.g. Sun$hine42!)',
          explanation: 'A strong password is LONG and includes UPPERCASE, lowercase, numbers and symbols! Never use your name or "1234"!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '👾 If someone online says something mean to you, you should ___',
          options: [
            'Say something mean back',
            'Ignore, block, and tell a trusted adult',
            'Give them your phone number',
            'Keep it secret',
          ], correctAnswer: 'Ignore, block, and tell a trusted adult',
          explanation: 'If you are cyberbullied: STOP (don\'t reply), BLOCK the person, and TELL a parent or teacher! You are not alone! 💪',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '📧 You receive an email saying "Click here to win RM 1,000,000!"\nWhat should you do?',
          options: [
            'Click immediately!',
            'Forward it to friends',
            'Delete it — it is a scam',
            'Reply with your bank details',
          ], correctAnswer: 'Delete it — it is a scam',
          explanation: 'This is a SCAM / PHISHING email! If it sounds too good to be true, DELETE it! Never click suspicious links!',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: '⏰ How much screen time is healthy for kids per day?',
          options: [
            '1–2 hours of recreational screen time',
            '8 hours non-stop',
            'As much as you want',
            'Only 5 minutes',
          ], correctAnswer: '1–2 hours of recreational screen time',
          explanation: 'Health experts recommend 1–2 hours of recreational screen time per day for children! Take breaks, go outside and play! 🌳',
        },
      ],
    },

    // ── 3. INTRODUCTION TO CODING ─────────────────────────────────────────
    {
      title: 'Intro to Coding: What is Programming? 💻',
      description: 'Discover what coding is and how it powers apps, games, and websites!',
      subjectId, subjectSlug: 'ict', topicId: 'coding-basics',
      ageGroup: 'lower_primary', grade: [3, 4, 5], type: 'interactive', difficulty: 'medium',
      duration: 15, xpReward: 70, coinReward: 25, isPremium: true, isActive: true, order: 3,
      tags: ['coding', 'programming', 'computational thinking'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '💻 What is CODING?',
          options: [
            'Writing secret messages',
            'Giving instructions to a computer in a language it understands',
            'Fixing broken computers',
            'Playing video games',
          ], correctAnswer: 'Giving instructions to a computer in a language it understands',
          explanation: 'CODING is writing instructions for a computer! Just like giving a recipe to a robot — step by step!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '📱 Apps on your phone are made through ___',
          options: ['Magic', 'Cooking', 'Coding / Programming', 'Drawing'],
          correctAnswer: 'Coding / Programming',
          explanation: 'Every app — KidOS, games, WhatsApp — is made by CODERS who wrote thousands of lines of code!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🔄 In coding, "LOOP" means ___',
          options: [
            'Jump to the end',
            'Do something once',
            'Repeat an action multiple times',
            'Delete a command',
          ], correctAnswer: 'Repeat an action multiple times',
          explanation: 'A LOOP repeats instructions! Like telling a robot "walk 1 step" in a loop 10 times — instead of writing it 10 times!',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 15, timeLimit: 25,
          question: '🤖 A robot needs to turn RIGHT 3 times.\nUsing a loop, the code is:\nLOOP 3 times: ___',
          options: ['Turn Left', 'Turn Right', 'Go Forward', 'Stop'], correctAnswer: 'Turn Right',
          explanation: 'LOOP 3 times: Turn Right — this makes the robot turn right 3 times! Loops save us from writing the same code again and again!',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 25,
          question: '🐛 When a program has an error or mistake, it is called a ___',
          options: ['loop', 'bug', 'virus', 'app'],
          correctAnswer: 'bug',
          explanation: 'A coding mistake is called a "BUG"! Finding and fixing bugs is called "DEBUGGING"! 🐛🔍',
        },
      ],
    },

    // ── 4. LOGIC PUZZLES ─────────────────────────────────────────────────
    {
      title: 'Logic Puzzles: Think Like a Computer! 🧩',
      description: 'Solve sequencing and logic challenges — the foundation of computational thinking!',
      subjectId, subjectSlug: 'ict', topicId: 'logic',
      ageGroup: 'lower_primary', grade: [3, 4, 5, 6], type: 'game', difficulty: 'hard',
      duration: 15, xpReward: 80, coinReward: 30, isPremium: true, isActive: true, order: 4,
      tags: ['logic', 'computational thinking', 'sequencing', 'algorithms'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 25,
          question: '🤖 Robot starts at 🏠.\nInstructions: Forward 2, Turn Right, Forward 1.\nWhere does robot end up?\n🏠→→↓ (grid)',
          options: ['Back at 🏠', 'At position (2,0)', 'At position (2,-1)', 'Cannot tell'],
          correctAnswer: 'At position (2,-1)',
          explanation: 'Forward 2 → moves right 2. Turn Right → now facing down. Forward 1 → moves down 1. End: (2,-1)!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'What is the CORRECT order to make a cup of hot milo?\n1. Pour hot water 2. Add milo powder 3. Stir 4. Put cup on table',
          options: ['1,2,3,4', '4,2,1,3', '2,1,3,4', '4,1,2,3'], correctAnswer: '4,2,1,3',
          explanation: '4 (Put cup) → 2 (Add milo) → 1 (Pour hot water) → 3 (Stir)! Algorithms need the RIGHT ORDER! ☕',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 15, timeLimit: 25,
          question: '🔢 Pattern: 2, 4, 6, 8, ___\nWhat comes next?',
          options: ['9', '10', '11', '12'], correctAnswer: '10',
          explanation: 'The pattern adds 2 each time: 2+2=4, 4+2=6, 6+2=8, 8+2=10! Finding patterns is KEY in coding! 💡',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 15, timeLimit: 25,
          question: '🚦 IF (it rains) THEN (open umbrella) ELSE (wear sunglasses)\nToday it is sunny. What do you do?',
          options: ['Open umbrella', 'Wear sunglasses', 'Do nothing', 'Run inside'],
          correctAnswer: 'Wear sunglasses',
          explanation: 'It is NOT raining, so the condition is FALSE → go to ELSE → "Wear sunglasses"! This is IF-ELSE logic in coding! 🕶️',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 20, timeLimit: 30,
          question: '🔡 What does this code do?\nLOOP 5 times:\n  Print "🌟"\n',
          options: ['Prints 🌟 once', 'Prints 🌟 five times', 'Prints nothing', 'Loops forever'],
          correctAnswer: 'Prints 🌟 five times',
          explanation: 'The LOOP runs 5 times, and each time it prints 🌟 — so you get: 🌟🌟🌟🌟🌟! Loops are powerful! 🔄',
        },
      ],
    },

    // ── 5. DIGITAL TOOLS: Microsoft Word Basics ───────────────────────────
    {
      title: 'Digital Tools: Word Processor Basics 📝',
      description: 'Learn to use a word processor to type, format and save your work!',
      subjectId, subjectSlug: 'ict', topicId: 'computer-basics',
      ageGroup: 'lower_primary', grade: [3, 4, 5, 6], type: 'quiz', difficulty: 'medium',
      duration: 10, xpReward: 55, coinReward: 20, isPremium: true, isActive: true, order: 5,
      tags: ['word processor', 'typing', 'digital tools', 'microsoft word'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '💾 To SAVE your work on a computer, which shortcut do you use?',
          options: ['Ctrl + P', 'Ctrl + S', 'Ctrl + C', 'Ctrl + Z'], correctAnswer: 'Ctrl + S',
          explanation: 'Ctrl + S = SAVE! Always save your work often so you don\'t lose it! 💾',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '📋 To COPY text, you use ___',
          options: ['Ctrl + X', 'Ctrl + V', 'Ctrl + C', 'Ctrl + Z'], correctAnswer: 'Ctrl + C',
          explanation: 'Ctrl + C = COPY! Remember: C = Copy! 📋',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '↩️ To UNDO your last action, you press ___',
          options: ['Ctrl + Y', 'Ctrl + Z', 'Ctrl + S', 'Ctrl + A'], correctAnswer: 'Ctrl + Z',
          explanation: 'Ctrl + Z = UNDO! Made a mistake? Ctrl+Z fixes it! It is the most used shortcut! 😅',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🖨️ To PRINT your document, you press ___',
          options: ['Ctrl + S', 'Ctrl + C', 'Ctrl + P', 'Ctrl + V'], correctAnswer: 'Ctrl + P',
          explanation: 'Ctrl + P = PRINT! P = Print! 🖨️📄',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: 'In a word processor, making text look like THIS is called ___',
          options: ['Italic', 'Bold', 'Underline', 'Highlight'], correctAnswer: 'Bold',
          explanation: 'BOLD makes text thicker and darker for emphasis! Shortcut: Ctrl + B!',
        },
      ],
    },
  ]
}
