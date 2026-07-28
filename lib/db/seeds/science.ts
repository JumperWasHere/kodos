/**
 * Science Lessons Seed
 * Covers: living things, animals, plants, human body, solar system, materials, food chain
 */
export function getScienceLessons(subjectId: any) {
  return [
    // ── 1. LIVING THINGS ────────────────────────────────────────────────────
    {
      title: 'Living vs Non-Living Things 🌱',
      description: 'Discover what makes something alive — and what it means to be non-living!',
      subjectId, subjectSlug: 'science', topicId: 'living-things',
      ageGroup: 'lower_primary', grade: [1, 2], type: 'quiz', difficulty: 'easy',
      duration: 8, xpReward: 40, coinReward: 15, isPremium: false, isActive: true, order: 1,
      tags: ['living things', 'non-living', 'science basics'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🌳🐶🪨🚗\nWhich of these is a LIVING thing?',
          options: ['🪨 Rock', '🚗 Car', '🌳 Tree', '🪑 Chair'], correctAnswer: '🌳 Tree',
          explanation: 'A tree is alive! It grows, breathes (takes in CO₂), and needs water and sunlight!',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'Which is NOT a sign of a living thing?',
          options: ['It grows', 'It breathes', 'It moves', 'It rusts'], correctAnswer: 'It rusts',
          explanation: 'Rusting happens to metals like iron — non-living things! Living things grow, breathe, move and reproduce.',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'Do ALL living things need water to survive?',
          options: ['Yes', 'No', 'Only animals', 'Only plants'], correctAnswer: 'Yes',
          explanation: 'Yes! All living things — plants, animals, humans — need water to stay alive! 💧',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🐛🦋 A caterpillar growing into a butterfly is an example of ___',
          options: ['rusting', 'melting', 'growing', 'freezing'], correctAnswer: 'growing',
          explanation: 'Growing and changing is a sign of LIFE! Non-living things cannot grow.',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: 'Sort these: Tree 🌳 / Rock 🪨 / Dog 🐕 / Car 🚗\nWhich group is correct?',
          options: [
            'Living: Tree, Rock | Non-living: Dog, Car',
            'Living: Tree, Dog | Non-living: Rock, Car',
            'Living: Dog, Car | Non-living: Tree, Rock',
            'All are living',
          ], correctAnswer: 'Living: Tree, Dog | Non-living: Rock, Car',
          explanation: 'Trees and dogs are living (they grow and breathe). Rocks and cars are non-living!',
        },
      ],
    },

    // ── 2. ANIMALS: Animal Habitats ─────────────────────────────────────────
    {
      title: 'Animal Habitats: Where Do Animals Live? 🦁',
      description: 'Match animals to their homes — jungle, ocean, desert, and more!',
      subjectId, subjectSlug: 'science', topicId: 'animals',
      ageGroup: 'lower_primary', grade: [1, 2], type: 'game', difficulty: 'easy',
      duration: 10, xpReward: 45, coinReward: 18, isPremium: false, isActive: true, order: 2,
      tags: ['animals', 'habitats', 'where animals live'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🐠🐙🦈\nThese animals live in the ___',
          options: ['Forest', 'Desert', 'Ocean', 'Arctic'], correctAnswer: 'Ocean',
          explanation: 'Fish, octopus and sharks all live in the OCEAN — the sea! 🌊',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🐫 The camel is perfectly adapted to survive in the ___',
          options: ['Arctic', 'Ocean', 'Rainforest', 'Desert'], correctAnswer: 'Desert',
          explanation: 'Camels live in the DESERT! Their humps store fat for energy and they can go days without water. 🏜️',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🐼 Giant pandas live in the bamboo forests of ___',
          options: ['Australia', 'China', 'Brazil', 'India'], correctAnswer: 'China',
          explanation: 'Giant pandas live in the mountain forests of CHINA! They eat bamboo all day! 🎋',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🦅 Eagles prefer to build their nests ___',
          options: ['Underground', 'In the water', 'High on cliffs or tall trees', 'In caves'], correctAnswer: 'High on cliffs or tall trees',
          explanation: 'Eagles build large nests (called eyries) high up on cliffs and tall trees!',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 25,
          question: '🐻‍❄️ Polar bears live in the Arctic.\nWhat helps them survive the cold?',
          options: ['Their thin fur', 'Their thick white fur and fat layer', 'Their small ears', 'Their speed'], correctAnswer: 'Their thick white fur and fat layer',
          explanation: 'Polar bears have thick white fur AND a thick layer of fat (blubber) to keep warm in freezing temperatures!',
        },
      ],
    },

    // ── 3. PLANTS: Parts of a Plant ─────────────────────────────────────────
    {
      title: 'Parts of a Plant: Root to Flower 🌻',
      description: 'Discover the roots, stem, leaves, and flowers — each with a special job!',
      subjectId, subjectSlug: 'science', topicId: 'plants',
      ageGroup: 'lower_primary', grade: [1, 2], type: 'interactive', difficulty: 'easy',
      duration: 10, xpReward: 45, coinReward: 18, isPremium: false, isActive: true, order: 3,
      tags: ['plants', 'parts of plant', 'roots stem leaves'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🌱 Which part of the plant is usually UNDERGROUND?',
          options: ['Flower', 'Leaf', 'Root', 'Stem'], correctAnswer: 'Root',
          explanation: 'ROOTS grow underground! They absorb water and minerals, and hold the plant in soil.',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🌿 Leaves are GREEN because of ___',
          options: ['water', 'chlorophyll', 'sunlight', 'roots'], correctAnswer: 'chlorophyll',
          explanation: 'Leaves are green because of CHLOROPHYLL — the green pigment that captures sunlight for photosynthesis!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'What is the main job of the STEM?',
          options: [
            'Make food for the plant',
            'Absorb water from the soil',
            'Transport water and food through the plant',
            'Attract bees and butterflies',
          ], correctAnswer: 'Transport water and food through the plant',
          explanation: 'The STEM is like a pipeline — it carries water up from roots and food down from leaves!',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🌸 What is the job of a FLOWER?',
          options: [
            'Make food using sunlight',
            'Absorb water',
            'Reproduction — making seeds for new plants',
            'Support the plant',
          ], correctAnswer: 'Reproduction — making seeds for new plants',
          explanation: 'Flowers are for REPRODUCTION! They attract bees and butterflies to spread pollen, making seeds.',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: 'Plants make their own food using sunlight.\nThis process is called ___',
          options: ['digestion', 'photosynthesis', 'respiration', 'germination'], correctAnswer: 'photosynthesis',
          explanation: 'PHOTOSYNTHESIS! Plants use sunlight + water + CO₂ to make sugar (food). Photo = light, synthesis = making!',
        },
      ],
    },

    // ── 4. HUMAN BODY: Five Senses 🎭 ──────────────────────────────────────
    {
      title: 'The Five Senses: See, Hear, Smell, Taste, Touch 🎭',
      description: 'Explore your amazing 5 senses and learn which organs they use!',
      subjectId, subjectSlug: 'science', topicId: 'human-body',
      ageGroup: 'preschool', grade: [0, 1], type: 'game', difficulty: 'easy',
      duration: 8, xpReward: 35, coinReward: 15, isPremium: false, isActive: true, order: 4,
      tags: ['five senses', 'human body', 'eyes ears nose'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 15,
          question: '👁️ We use our ___ to SEE.',
          options: ['ears', 'nose', 'eyes', 'tongue'], correctAnswer: 'eyes',
          explanation: 'Our EYES let us see colours, shapes, and everything around us! 👀',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 15,
          question: '🎵 We use our ___ to HEAR music.',
          options: ['eyes', 'skin', 'ears', 'tongue'], correctAnswer: 'ears',
          explanation: 'Our EARS collect sound waves so we can hear music, voices, and sounds! 👂',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 15,
          question: '🌸 We use our ___ to SMELL flowers.',
          options: ['ears', 'nose', 'eyes', 'hands'], correctAnswer: 'nose',
          explanation: 'Our NOSE detects smells! It can tell the difference between sweet flowers and smelly socks! 👃',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 15,
          question: '🍦 We use our ___ to TASTE ice cream.',
          options: ['hands', 'ears', 'tongue', 'eyes'], correctAnswer: 'tongue',
          explanation: 'Our TONGUE has taste buds that detect sweet, salty, sour, and bitter flavours! 👅',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 10, timeLimit: 15,
          question: '🔥 We use our ___ to feel that something is HOT.',
          options: ['eyes', 'ears', 'nose', 'skin'], correctAnswer: 'skin',
          explanation: 'Our SKIN has sensors for touch, heat, cold and pain! It protects us! ✋',
        },
        {
          id: 'q6', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: 'How many senses does a human have?',
          options: ['3', '4', '5', '6'], correctAnswer: '5',
          explanation: 'We have 5 senses: SIGHT 👁️ HEARING 👂 SMELL 👃 TASTE 👅 TOUCH ✋',
        },
      ],
    },

    // ── 5. LIFE CYCLE: Butterfly 🦋 ─────────────────────────────────────────
    {
      title: 'Life Cycle of a Butterfly 🦋',
      description: 'Follow the amazing journey from egg to caterpillar to butterfly!',
      subjectId, subjectSlug: 'science', topicId: 'animals',
      ageGroup: 'lower_primary', grade: [2, 3], type: 'interactive', difficulty: 'medium',
      duration: 12, xpReward: 60, coinReward: 22, isPremium: false, isActive: true, order: 5,
      tags: ['life cycle', 'butterfly', 'metamorphosis'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'What is the FIRST stage of a butterfly\'s life?',
          options: ['Caterpillar 🐛', 'Egg 🥚', 'Chrysalis', 'Butterfly 🦋'], correctAnswer: 'Egg 🥚',
          explanation: 'The journey begins as a tiny EGG laid on a leaf! 🥚',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🐛 After the egg hatches, what comes out?',
          options: ['A butterfly', 'A moth', 'A caterpillar', 'A cocoon'], correctAnswer: 'A caterpillar',
          explanation: 'A CATERPILLAR hatches from the egg and spends its time eating leaves to grow!',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'The caterpillar wraps itself in a ___\nto change into a butterfly.',
          options: ['web', 'shell', 'chrysalis', 'burrow'], correctAnswer: 'chrysalis',
          explanation: 'The caterpillar forms a CHRYSALIS (a hard protective case) where the magical transformation happens!',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: 'The correct ORDER of a butterfly\'s life cycle is ___',
          options: [
            'Butterfly → Egg → Chrysalis → Caterpillar',
            'Egg → Caterpillar → Chrysalis → Butterfly',
            'Caterpillar → Egg → Butterfly → Chrysalis',
            'Chrysalis → Butterfly → Egg → Caterpillar',
          ], correctAnswer: 'Egg → Caterpillar → Chrysalis → Butterfly',
          explanation: 'Egg 🥚 → Caterpillar 🐛 → Chrysalis → Butterfly 🦋 — this is metamorphosis!',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: 'The transformation from caterpillar to butterfly is called ___',
          options: ['migration', 'metamorphosis', 'hibernation', 'photosynthesis'], correctAnswer: 'metamorphosis',
          explanation: 'METAMORPHOSIS means a dramatic change in body form! The caterpillar completely transforms into a butterfly! ✨',
        },
      ],
    },

    // ── 6. SOLAR SYSTEM 🪐 ─────────────────────────────────────────────────
    {
      title: 'Our Solar System: Planets in Order 🪐',
      description: 'Explore the 8 planets orbiting our Sun — from tiny Mercury to giant Neptune!',
      subjectId, subjectSlug: 'science', topicId: 'solar-system',
      ageGroup: 'lower_primary', grade: [3, 4, 5], type: 'quiz', difficulty: 'medium',
      duration: 15, xpReward: 70, coinReward: 25, isPremium: true, isActive: true, order: 6,
      tags: ['solar system', 'planets', 'space', 'astronomy'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '☀️ The Sun is actually a ___',
          options: ['planet', 'moon', 'star', 'asteroid'], correctAnswer: 'star',
          explanation: 'The Sun is a STAR — a giant ball of burning gas! It is the center of our solar system. ☀️',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🌍 Which planet do WE live on?',
          options: ['Mars', 'Venus', 'Earth', 'Jupiter'], correctAnswer: 'Earth',
          explanation: 'We live on EARTH — the 3rd planet from the Sun! It is the only known planet with life! 🌍',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🔴 The "Red Planet" is called ___',
          options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctAnswer: 'Mars',
          explanation: 'MARS is called the Red Planet because its surface is covered in reddish iron oxide (rust)! 🔴',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🪐 Which planet has RINGS around it?',
          options: ['Earth', 'Mars', 'Jupiter', 'Saturn'], correctAnswer: 'Saturn',
          explanation: 'SATURN is famous for its beautiful rings made of ice and rock! 🪐',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: 'What is the LARGEST planet in our solar system?',
          options: ['Saturn', 'Earth', 'Jupiter', 'Neptune'], correctAnswer: 'Jupiter',
          explanation: 'JUPITER is the largest planet — it is so big, over 1,300 Earths could fit inside it! 🌕',
        },
        {
          id: 'q6', type: 'multiple_choice', points: 15, timeLimit: 20,
          question: 'How many planets are in our solar system?',
          options: ['7', '8', '9', '10'], correctAnswer: '8',
          explanation: 'There are 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune!',
        },
      ],
    },

    // ── 7. STATES OF MATTER ─────────────────────────────────────────────────
    {
      title: 'States of Matter: Solid, Liquid & Gas 🧊💧💨',
      description: 'Learn how matter changes between solid, liquid, and gas states!',
      subjectId, subjectSlug: 'science', topicId: 'earth',
      ageGroup: 'lower_primary', grade: [3, 4], type: 'quiz', difficulty: 'medium',
      duration: 12, xpReward: 65, coinReward: 22, isPremium: false, isActive: true, order: 7,
      tags: ['matter', 'solid liquid gas', 'states of matter'],
      questions: [
        {
          id: 'q1', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🧊 Which of these is a SOLID?',
          options: ['milk', 'steam', 'ice', 'air'], correctAnswer: 'ice',
          explanation: 'ICE is a solid — it has a fixed shape and cannot flow! 🧊',
        },
        {
          id: 'q2', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '💧 Which of these is a LIQUID?',
          options: ['rock', 'wood', 'water', 'glass'], correctAnswer: 'water',
          explanation: 'WATER is a liquid — it can flow and takes the shape of its container! 💧',
        },
        {
          id: 'q3', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '💨 Which of these is a GAS?',
          options: ['sand', 'ice cream', 'oxygen', 'gold'], correctAnswer: 'oxygen',
          explanation: 'OXYGEN is a gas — gases spread out to fill any container and have no fixed shape! 💨',
        },
        {
          id: 'q4', type: 'multiple_choice', points: 10, timeLimit: 20,
          question: '🔥 When ice MELTS, it changes from ___',
          options: ['gas to liquid', 'solid to liquid', 'liquid to gas', 'gas to solid'], correctAnswer: 'solid to liquid',
          explanation: 'Melting changes a SOLID (ice) into a LIQUID (water)! Heat makes this happen!',
        },
        {
          id: 'q5', type: 'multiple_choice', points: 15, timeLimit: 25,
          question: '☁️ When water EVAPORATES (like puddles drying up),\nit changes from liquid to ___',
          options: ['solid', 'ice', 'gas', 'rock'], correctAnswer: 'gas',
          explanation: 'Evaporation changes LIQUID water into water VAPOUR (gas)! The water goes up into the sky!',
        },
      ],
    },

    // ── AMAZING ANIMAL FACTS (True/False) ──────────────────────────────────
    {
      title: 'Amazing Animal Facts: True or False? 🐾',
      description: 'Some of these animal facts are real — and some are made up. Can you tell?',
      subjectId, subjectSlug: 'science', topicId: 'animals',
      ageGroup: 'upper_primary', grade: [4, 5, 6], type: 'quiz', difficulty: 'medium',
      duration: 8, xpReward: 55, coinReward: 22, isPremium: false, isActive: true, order: 20,
      tags: ['animals', 'true-false', 'facts', 'fun'],
      questions: [
        {
          id: 'q1', type: 'true_false', points: 10, timeLimit: 15,
          question: '🐙 An octopus has three hearts.',
          correctAnswer: 'True',
          explanation: 'True! Two hearts pump blood to the gills and one to the rest of the body. 🐙',
        },
        {
          id: 'q2', type: 'true_false', points: 10, timeLimit: 15,
          question: '🦇 Bats are completely blind.',
          correctAnswer: 'False',
          explanation: 'False! Bats can see — they also use echolocation (sound waves) to "see" in the dark! 🦇',
        },
        {
          id: 'q3', type: 'true_false', points: 10, timeLimit: 15,
          question: '🐘 The elephant is the largest land animal in the world.',
          correctAnswer: 'True',
          explanation: 'True! The African elephant can weigh up to 6,000 kg — as heavy as 4 cars! 🐘',
        },
        {
          id: 'q4', type: 'true_false', points: 10, timeLimit: 15,
          question: '🐟 Fish breathe air with lungs, just like humans.',
          correctAnswer: 'False',
          explanation: 'False! Fish use GILLS to take oxygen from the water. 🐟',
        },
        {
          id: 'q5', type: 'true_false', points: 15, timeLimit: 15,
          question: '🦒 A giraffe has the same number of neck bones as a human (7).',
          correctAnswer: 'True',
          explanation: 'Amazing but true! Both giraffes and humans have 7 neck bones — a giraffe\'s are just much longer! 🦒',
        },
        {
          id: 'q6', type: 'fill_blank', points: 15, timeLimit: 25,
          question: '🐝 The insect that makes honey is called a ___',
          correctAnswer: ['bee', 'honey bee', 'honeybee'],
          explanation: 'Bees collect nectar from flowers and turn it into honey! 🍯',
        },
      ],
    },
  ]
}
