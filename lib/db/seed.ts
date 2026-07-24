/**
 * KidOS Database Seed Script
 * Run: npx tsx lib/db/seed.ts
 *
 * Seeds: Admin, Parent, Teacher, Student accounts + Subjects + Sample Lessons + Badges
 */

import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { getMathLessons } from './seeds/math'
import { getEnglishLessons } from './seeds/english'
import { getScienceLessons } from './seeds/science'
import { getBahasaMalaysiaLessons } from './seeds/bahasa-malaysia'
import { getMandarinLessons } from './seeds/mandarin'
import { getGeographyLessons } from './seeds/geography'
import { getHistoryLessons } from './seeds/history'
import { getArtLessons } from './seeds/art'
import { getIctLessons } from './seeds/ict'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kidosdb'

// ── Inline minimal schema definitions for seeding ──────────────────────────
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  avatar: String,
  role: String,
  isEmailVerified: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  lastLoginAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const StudentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  displayName: String,
  ageGroup: String,
  grade: Number,
  parentId: mongoose.Schema.Types.ObjectId,
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  coins: { type: Number, default: 100 },
  gems: { type: Number, default: 5 },
  streakDays: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastLoginDate: { type: Date, default: Date.now },
  totalLoginDays: { type: Number, default: 1 },
  badges: [mongoose.Schema.Types.ObjectId],
  achievements: [mongoose.Schema.Types.ObjectId],
  avatar: String,
  avatarCustomization: mongoose.Schema.Types.Mixed,
  subjectProgress: [mongoose.Schema.Types.Mixed],
  dailyRewardStreak: { type: Number, default: 0 },
  isPremium: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const SubjectSchema = new mongoose.Schema({
  name: String,
  nameMs: String,
  slug: { type: String, unique: true },
  description: String,
  descriptionMs: String,
  icon: String,
  color: String,
  gradient: String,
  bgClass: String,
  ageGroups: [String],
  grades: [Number],
  totalLessons: { type: Number, default: 0 },
  totalQuizzes: { type: Number, default: 0 },
  totalGames: { type: Number, default: 0 },
  isPremium: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  order: Number,
  topics: [mongoose.Schema.Types.Mixed],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const LessonSchema = new mongoose.Schema({
  title: String,
  description: String,
  subjectId: mongoose.Schema.Types.ObjectId,
  subjectSlug: String,
  ageGroup: String,
  grade: [Number],
  type: String,
  difficulty: String,
  thumbnail: String,
  duration: Number,
  xpReward: Number,
  coinReward: Number,
  questions: [mongoose.Schema.Types.Mixed],
  isPremium: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  order: Number,
  tags: [String],
  totalCompletions: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const BadgeSchema = new mongoose.Schema({
  name: String,
  description: String,
  icon: String,
  emoji: String,
  category: String,
  requirement: mongoose.Schema.Types.Mixed,
  xpReward: Number,
  coinReward: Number,
  isSpecial: { type: Boolean, default: false },
  isSeasonal: { type: Boolean, default: false },
  rarity: String,
  isActive: { type: Boolean, default: true },
  order: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const SubscriptionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  plan: String,
  status: String,
  stripeCustomerId: String,
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  cancelAtPeriodEnd: { type: Boolean, default: false },
  amount: Number,
  currency: { type: String, default: 'myr' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// ── Models ──────────────────────────────────────────────────────────────────
const User = mongoose.models.User || mongoose.model('User', UserSchema)
const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema)
const Subject = mongoose.models.Subject || mongoose.model('Subject', SubjectSchema)
const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', LessonSchema)
const Badge = mongoose.models.Badge || mongoose.model('Badge', BadgeSchema)
const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema)

// ── Seed Data ──────────────────────────────────────────────────────────────

const SUBJECTS_DATA = [
  {
    name: 'Mathematics',
    nameMs: 'Matematik',
    slug: 'mathematics',
    description: 'Master numbers, shapes, and problem solving through fun games and activities.',
    descriptionMs: 'Kuasai nombor, bentuk, dan penyelesaian masalah melalui permainan yang seronok.',
    icon: '🔢',
    color: '#3B82F6',
    gradient: 'from-blue-500 to-blue-600',
    bgClass: 'bg-subject-math',
    ageGroups: ['preschool', 'lower_primary', 'upper_primary'],
    grades: [0, 1, 2, 3, 4, 5, 6],
    totalLessons: 120,
    totalQuizzes: 60,
    totalGames: 30,
    isPremium: false,
    isActive: true,
    order: 1,
    topics: [
      { id: 'counting', title: 'Counting', titleMs: 'Mengira', order: 1, lessonCount: 12, icon: '1️⃣', color: '#3B82F6', isLocked: false },
      { id: 'addition', title: 'Addition', titleMs: 'Penambahan', order: 2, lessonCount: 15, icon: '➕', color: '#2563EB', isLocked: false },
      { id: 'subtraction', title: 'Subtraction', titleMs: 'Penolakan', order: 3, lessonCount: 15, icon: '➖', color: '#1D4ED8', isLocked: false },
      { id: 'multiplication', title: 'Multiplication', titleMs: 'Pendaraban', order: 4, lessonCount: 18, icon: '✖️', color: '#1E40AF', isLocked: true },
      { id: 'division', title: 'Division', titleMs: 'Pembahagian', order: 5, lessonCount: 15, icon: '➗', color: '#1E3A8A', isLocked: true },
      { id: 'fractions', title: 'Fractions', titleMs: 'Pecahan', order: 6, lessonCount: 12, icon: '½', color: '#312E81', isLocked: true },
    ],
  },
  {
    name: 'English',
    nameMs: 'Bahasa Inggeris',
    slug: 'english',
    description: 'Build reading, writing, and speaking skills through stories and games.',
    descriptionMs: 'Bina kemahiran membaca, menulis dan bertutur melalui cerita dan permainan.',
    icon: '📖',
    color: '#8B5CF6',
    gradient: 'from-purple-500 to-purple-600',
    bgClass: 'bg-subject-english',
    ageGroups: ['preschool', 'lower_primary', 'upper_primary'],
    grades: [0, 1, 2, 3, 4, 5, 6],
    totalLessons: 100,
    totalQuizzes: 50,
    totalGames: 25,
    isPremium: false,
    isActive: true,
    order: 2,
    topics: [
      { id: 'phonics', title: 'Phonics', titleMs: 'Fonik', order: 1, lessonCount: 20, icon: '🔤', color: '#8B5CF6', isLocked: false },
      { id: 'vocabulary', title: 'Vocabulary', titleMs: 'Perbendaharaan Kata', order: 2, lessonCount: 18, icon: '📝', color: '#7C3AED', isLocked: false },
      { id: 'reading', title: 'Reading', titleMs: 'Membaca', order: 3, lessonCount: 20, icon: '📚', color: '#6D28D9', isLocked: false },
      { id: 'grammar', title: 'Grammar', titleMs: 'Tatabahasa', order: 4, lessonCount: 15, icon: '✏️', color: '#5B21B6', isLocked: true },
      { id: 'spelling', title: 'Spelling', titleMs: 'Ejaan', order: 5, lessonCount: 12, icon: '🔡', color: '#4C1D95', isLocked: true },
    ],
  },
  {
    name: 'Science',
    nameMs: 'Sains',
    slug: 'science',
    description: 'Explore the wonders of the natural world through experiments and discoveries.',
    descriptionMs: 'Terokai keajaiban dunia semula jadi melalui eksperimen dan penemuan.',
    icon: '🔬',
    color: '#10B981',
    gradient: 'from-emerald-500 to-emerald-600',
    bgClass: 'bg-subject-science',
    ageGroups: ['lower_primary', 'upper_primary'],
    grades: [1, 2, 3, 4, 5, 6],
    totalLessons: 80,
    totalQuizzes: 40,
    totalGames: 20,
    isPremium: false,
    isActive: true,
    order: 3,
    topics: [
      { id: 'animals', title: 'Animals', titleMs: 'Haiwan', order: 1, lessonCount: 15, icon: '🦁', color: '#10B981', isLocked: false },
      { id: 'plants', title: 'Plants', titleMs: 'Tumbuhan', order: 2, lessonCount: 12, icon: '🌱', color: '#059669', isLocked: false },
      { id: 'human-body', title: 'Human Body', titleMs: 'Tubuh Manusia', order: 3, lessonCount: 10, icon: '🫀', color: '#047857', isLocked: false },
      { id: 'solar-system', title: 'Solar System', titleMs: 'Sistem Solar', order: 4, lessonCount: 10, icon: '🪐', color: '#065F46', isLocked: true },
      { id: 'earth', title: 'Earth & Environment', titleMs: 'Bumi & Alam Sekitar', order: 5, lessonCount: 10, icon: '🌍', color: '#064E3B', isLocked: true },
    ],
  },
  {
    name: 'Bahasa Malaysia',
    nameMs: 'Bahasa Malaysia',
    slug: 'bahasa-malaysia',
    description: 'Master the national language through reading, writing and listening activities.',
    descriptionMs: 'Kuasai bahasa kebangsaan melalui aktiviti membaca, menulis dan mendengar.',
    icon: '🇲🇾',
    color: '#F59E0B',
    gradient: 'from-amber-500 to-amber-600',
    bgClass: 'bg-subject-bm',
    ageGroups: ['preschool', 'lower_primary', 'upper_primary'],
    grades: [0, 1, 2, 3, 4, 5, 6],
    totalLessons: 90,
    totalQuizzes: 45,
    totalGames: 20,
    isPremium: false,
    isActive: true,
    order: 4,
    topics: [
      { id: 'bacaan', title: 'Bacaan', titleMs: 'Bacaan', order: 1, lessonCount: 20, icon: '📖', color: '#F59E0B', isLocked: false },
      { id: 'tatabahasa', title: 'Tatabahasa', titleMs: 'Tatabahasa', order: 2, lessonCount: 18, icon: '✍️', color: '#D97706', isLocked: false },
      { id: 'ejaan', title: 'Ejaan', titleMs: 'Ejaan', order: 3, lessonCount: 15, icon: '🔠', color: '#B45309', isLocked: false },
      { id: 'pemahaman', title: 'Pemahaman', titleMs: 'Pemahaman', order: 4, lessonCount: 15, icon: '💭', color: '#92400E', isLocked: true },
    ],
  },
  {
    name: 'Mandarin',
    nameMs: 'Bahasa Mandarin',
    nameMandarin: '中文',
    slug: 'mandarin',
    description: 'Learn Chinese language with pinyin, characters, and fun conversations.',
    descriptionMs: 'Belajar bahasa Cina dengan pinyin, aksara dan perbualan yang seronok.',
    icon: '🀄',
    color: '#EF4444',
    gradient: 'from-red-500 to-red-600',
    bgClass: 'bg-subject-mandarin',
    ageGroups: ['preschool', 'lower_primary', 'upper_primary'],
    grades: [0, 1, 2, 3, 4, 5, 6],
    totalLessons: 80,
    totalQuizzes: 40,
    totalGames: 15,
    isPremium: true,
    isActive: true,
    order: 5,
    topics: [
      { id: 'pinyin', title: 'Pinyin', titleMs: 'Pinyin', order: 1, lessonCount: 15, icon: 'ā', color: '#EF4444', isLocked: false },
      { id: 'vocabulary-zh', title: 'Vocabulary 词汇', titleMs: 'Perbendaharaan Kata', order: 2, lessonCount: 20, icon: '字', color: '#DC2626', isLocked: false },
      { id: 'reading-zh', title: 'Reading 阅读', titleMs: 'Membaca', order: 3, lessonCount: 15, icon: '📗', color: '#B91C1C', isLocked: true },
    ],
  },
  {
    name: 'Geography',
    nameMs: 'Geografi',
    slug: 'geography',
    description: 'Discover countries, maps, oceans, and the amazing world around us.',
    descriptionMs: 'Terokai negara, peta, lautan dan dunia yang menakjubkan di sekeliling kita.',
    icon: '🌏',
    color: '#06B6D4',
    gradient: 'from-cyan-500 to-cyan-600',
    bgClass: 'bg-subject-geography',
    ageGroups: ['lower_primary', 'upper_primary'],
    grades: [3, 4, 5, 6],
    totalLessons: 60,
    totalQuizzes: 30,
    totalGames: 15,
    isPremium: true,
    isActive: true,
    order: 6,
    topics: [
      { id: 'malaysia-geo', title: 'Malaysian Geography', titleMs: 'Geografi Malaysia', order: 1, lessonCount: 15, icon: '🇲🇾', color: '#06B6D4', isLocked: false },
      { id: 'continents', title: 'Continents & Oceans', titleMs: 'Benua & Lautan', order: 2, lessonCount: 12, icon: '🌐', color: '#0891B2', isLocked: false },
      { id: 'countries', title: 'Countries of the World', titleMs: 'Negara-Negara Dunia', order: 3, lessonCount: 15, icon: '🗺️', color: '#0E7490', isLocked: true },
    ],
  },
  {
    name: 'History',
    nameMs: 'Sejarah',
    slug: 'history',
    description: 'Journey through time to learn about Malaysian and world history.',
    descriptionMs: 'Perjalanan melalui masa untuk belajar sejarah Malaysia dan dunia.',
    icon: '🏛️',
    color: '#78716C',
    gradient: 'from-stone-500 to-stone-600',
    bgClass: 'bg-subject-history',
    ageGroups: ['upper_primary'],
    grades: [4, 5, 6],
    totalLessons: 50,
    totalQuizzes: 25,
    totalGames: 10,
    isPremium: true,
    isActive: true,
    order: 7,
    topics: [
      { id: 'malaysia-history', title: 'Malaysian History', titleMs: 'Sejarah Malaysia', order: 1, lessonCount: 20, icon: '🕌', color: '#78716C', isLocked: false },
      { id: 'world-history', title: 'World History', titleMs: 'Sejarah Dunia', order: 2, lessonCount: 15, icon: '🌍', color: '#57534E', isLocked: true },
      { id: 'historical-figures', title: 'Historical Figures', titleMs: 'Tokoh Sejarah', order: 3, lessonCount: 10, icon: '👑', color: '#44403C', isLocked: true },
    ],
  },
  {
    name: 'Art',
    nameMs: 'Seni Visual',
    slug: 'art',
    description: 'Unleash your creativity through drawing, coloring, and art projects.',
    descriptionMs: 'Lepaskan kreativiti anda melalui lukisan, mewarna dan projek seni.',
    icon: '🎨',
    color: '#EC4899',
    gradient: 'from-pink-500 to-pink-600',
    bgClass: 'bg-subject-art',
    ageGroups: ['preschool', 'lower_primary', 'upper_primary'],
    grades: [0, 1, 2, 3, 4, 5, 6],
    totalLessons: 40,
    totalQuizzes: 10,
    totalGames: 20,
    isPremium: false,
    isActive: true,
    order: 8,
    topics: [
      { id: 'drawing', title: 'Drawing Activities', titleMs: 'Aktiviti Melukis', order: 1, lessonCount: 15, icon: '✏️', color: '#EC4899', isLocked: false },
      { id: 'coloring', title: 'Coloring Games', titleMs: 'Permainan Mewarna', order: 2, lessonCount: 12, icon: '🖌️', color: '#DB2777', isLocked: false },
      { id: 'art-challenges', title: 'Art Challenges', titleMs: 'Cabaran Seni', order: 3, lessonCount: 8, icon: '🏆', color: '#BE185D', isLocked: true },
    ],
  },
  {
    name: 'ICT',
    nameMs: 'Teknologi Maklumat & Komunikasi',
    slug: 'ict',
    description: 'Learn computer basics, internet safety, and fun coding activities.',
    descriptionMs: 'Belajar asas komputer, keselamatan internet dan aktiviti pengaturcaraan.',
    icon: '💻',
    color: '#6366F1',
    gradient: 'from-indigo-500 to-indigo-600',
    bgClass: 'bg-subject-ict',
    ageGroups: ['lower_primary', 'upper_primary'],
    grades: [1, 2, 3, 4, 5, 6],
    totalLessons: 50,
    totalQuizzes: 25,
    totalGames: 20,
    isPremium: true,
    isActive: true,
    order: 9,
    topics: [
      { id: 'computer-basics', title: 'Computer Basics', titleMs: 'Asas Komputer', order: 1, lessonCount: 12, icon: '🖥️', color: '#6366F1', isLocked: false },
      { id: 'internet-safety', title: 'Internet Safety', titleMs: 'Keselamatan Internet', order: 2, lessonCount: 10, icon: '🛡️', color: '#4F46E5', isLocked: false },
      { id: 'coding-basics', title: 'Coding Basics', titleMs: 'Asas Pengaturcaraan', order: 3, lessonCount: 15, icon: '⌨️', color: '#4338CA', isLocked: true },
      { id: 'logic', title: 'Logic Activities', titleMs: 'Aktiviti Logik', order: 4, lessonCount: 8, icon: '🧩', color: '#3730A3', isLocked: true },
    ],
  },
]

const BADGES_DATA = [
  { name: 'First Step', description: 'Complete your very first lesson!', icon: '/badges/first-step.svg', emoji: '👣', category: 'learning', requirement: { type: 'lessons', value: 1 }, xpReward: 50, coinReward: 20, rarity: 'common', order: 1 },
  { name: 'Quick Learner', description: 'Complete 10 lessons', icon: '/badges/quick-learner.svg', emoji: '⚡', category: 'learning', requirement: { type: 'lessons', value: 10 }, xpReward: 100, coinReward: 50, rarity: 'common', order: 2 },
  { name: 'Knowledge Seeker', description: 'Complete 50 lessons', icon: '/badges/knowledge.svg', emoji: '📚', category: 'learning', requirement: { type: 'lessons', value: 50 }, xpReward: 300, coinReward: 150, rarity: 'rare', order: 3 },
  { name: 'Scholar', description: 'Complete 100 lessons', icon: '/badges/scholar.svg', emoji: '🎓', category: 'learning', requirement: { type: 'lessons', value: 100 }, xpReward: 500, coinReward: 300, rarity: 'epic', order: 4 },
  { name: 'Hot Streak', description: 'Login for 3 days in a row', icon: '/badges/hot-streak.svg', emoji: '🔥', category: 'streak', requirement: { type: 'streak', value: 3 }, xpReward: 75, coinReward: 30, rarity: 'common', order: 5 },
  { name: 'Week Warrior', description: 'Login for 7 days in a row', icon: '/badges/week-warrior.svg', emoji: '⚔️', category: 'streak', requirement: { type: 'streak', value: 7 }, xpReward: 200, coinReward: 100, rarity: 'rare', order: 6 },
  { name: 'Monthly Master', description: 'Login for 30 days in a row', icon: '/badges/monthly.svg', emoji: '🏆', category: 'streak', requirement: { type: 'streak', value: 30 }, xpReward: 1000, coinReward: 500, rarity: 'legendary', order: 7 },
  { name: 'Math Whiz', description: 'Complete all Mathematics Level 1 lessons', icon: '/badges/math.svg', emoji: '🔢', category: 'achievement', requirement: { type: 'subject_mastery', value: 100, subjectSlug: 'mathematics' }, xpReward: 400, coinReward: 200, rarity: 'epic', order: 8 },
  { name: 'Perfect Score', description: 'Get 100% on any quiz', icon: '/badges/perfect.svg', emoji: '⭐', category: 'achievement', requirement: { type: 'perfect_score', value: 1 }, xpReward: 150, coinReward: 75, rarity: 'rare', order: 9 },
  { name: 'XP Champion', description: 'Reach 1000 XP', icon: '/badges/xp.svg', emoji: '✨', category: 'achievement', requirement: { type: 'xp', value: 1000 }, xpReward: 200, coinReward: 100, rarity: 'rare', order: 10 },
  { name: 'Super Star', description: 'Reach 5000 XP', icon: '/badges/superstar.svg', emoji: '🌟', category: 'achievement', requirement: { type: 'xp', value: 5000 }, xpReward: 500, coinReward: 300, rarity: 'epic', order: 11, isSpecial: true },
  { name: 'Malaysia Boleh!', description: 'Complete the Malaysian Geography module', icon: '/badges/malaysia.svg', emoji: '🇲🇾', category: 'special', requirement: { type: 'subject_mastery', value: 100, subjectSlug: 'geography' }, xpReward: 300, coinReward: 150, rarity: 'rare', order: 12, isSpecial: true },
]

async function seed() {
  console.log('🌱 Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected to MongoDB:', MONGODB_URI)

  // Clear existing data
  console.log('\n🗑️  Clearing existing seed data...')
  await Promise.all([
    User.deleteMany({}),
    Student.deleteMany({}),
    Subject.deleteMany({}),
    Lesson.deleteMany({}),
    Badge.deleteMany({}),
    Subscription.deleteMany({}),
  ])
  console.log('✅ Cleared existing data')

  // ── Hash passwords ───────────────────────────────────────────────────────
  const hashPw = (pw: string) => bcrypt.hashSync(pw, 12)

  // ── Create Users ─────────────────────────────────────────────────────────
  console.log('\n👤 Creating users...')

  const adminUser = await User.create({
    name: 'Super Admin',
    email: 'admin@kidos.my',
    password: hashPw('Admin@123'),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    role: 'admin',
    isEmailVerified: true,
  })

  const parentUser = await User.create({
    name: 'Ahmad Razif',
    email: 'parent@kidos.my',
    password: hashPw('Parent@123'),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=parent',
    role: 'parent',
    isEmailVerified: true,
  })

  const teacherUser = await User.create({
    name: 'Cikgu Siti Nurhaliza',
    email: 'teacher@kidos.my',
    password: hashPw('Teacher@123'),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher',
    role: 'teacher',
    isEmailVerified: true,
  })

  const studentUser1 = await User.create({
    name: 'Arif Razif',
    email: 'student@kidos.my',
    password: hashPw('Student@123'),
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=arif',
    role: 'student',
    isEmailVerified: true,
  })

  const studentUser2 = await User.create({
    name: 'Alya Razif',
    email: 'student2@kidos.my',
    password: hashPw('Student@123'),
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=alya',
    role: 'student',
    isEmailVerified: true,
  })

  console.log('✅ Created 5 users')

  // ── Create Badges ────────────────────────────────────────────────────────
  console.log('\n🏅 Creating badges...')
  const badges = await Badge.insertMany(BADGES_DATA)
  console.log(`✅ Created ${badges.length} badges`)

  // ── Create Subscription for parent ──────────────────────────────────────
  const subscription = await Subscription.create({
    userId: parentUser._id,
    plan: 'family',
    status: 'active',
    stripeCustomerId: 'cus_seed_parent_001',
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    amount: 9900,
    currency: 'myr',
    maxChildren: 5,
  })

  // ── Create Student Profiles ──────────────────────────────────────────────
  console.log('\n🎒 Creating student profiles...')

  await Student.create({
    userId: studentUser1._id,
    displayName: 'Arif',
    ageGroup: 'lower_primary',
    grade: 3,
    parentId: parentUser._id,
    xp: 2450,
    level: 8,
    coins: 850,
    gems: 12,
    streakDays: 7,
    longestStreak: 14,
    totalLoginDays: 45,
    badges: [badges[0]._id, badges[1]._id, badges[4]._id, badges[5]._id, badges[8]._id],
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=arif',
    avatarCustomization: {
      character: 'explorer',
      hairStyle: 'short',
      hairColor: '#2C1810',
      skinTone: '#C68642',
      eyeType: 'happy',
      outfit: 'school',
      background: 'classroom',
    },
    subjectProgress: [
      { subjectSlug: 'mathematics', completedLessons: 24, totalLessons: 120, xpEarned: 960, masteryLevel: 20, lastAccessedAt: new Date() },
      { subjectSlug: 'english', completedLessons: 18, totalLessons: 100, xpEarned: 720, masteryLevel: 18, lastAccessedAt: new Date(Date.now() - 86400000) },
      { subjectSlug: 'science', completedLessons: 10, totalLessons: 80, xpEarned: 400, masteryLevel: 12, lastAccessedAt: new Date(Date.now() - 172800000) },
      { subjectSlug: 'bahasa-malaysia', completedLessons: 15, totalLessons: 90, xpEarned: 600, masteryLevel: 16, lastAccessedAt: new Date(Date.now() - 259200000) },
    ],
    dailyRewardStreak: 7,
    isPremium: true,
    subscriptionId: subscription._id,
  })

  await Student.create({
    userId: studentUser2._id,
    displayName: 'Alya',
    ageGroup: 'preschool',
    grade: 1,
    parentId: parentUser._id,
    xp: 450,
    level: 3,
    coins: 320,
    gems: 3,
    streakDays: 2,
    longestStreak: 5,
    totalLoginDays: 12,
    badges: [badges[0]._id],
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=alya',
    avatarCustomization: {
      character: 'princess',
      hairStyle: 'long',
      hairColor: '#1A0A00',
      skinTone: '#C68642',
      eyeType: 'cute',
      outfit: 'pink-dress',
      background: 'garden',
    },
    subjectProgress: [
      { subjectSlug: 'mathematics', completedLessons: 5, totalLessons: 120, xpEarned: 200, masteryLevel: 4, lastAccessedAt: new Date() },
      { subjectSlug: 'english', completedLessons: 6, totalLessons: 100, xpEarned: 240, masteryLevel: 6, lastAccessedAt: new Date(Date.now() - 86400000) },
    ],
    dailyRewardStreak: 2,
    isPremium: true,
    subscriptionId: subscription._id,
  })

  console.log('✅ Created 2 student profiles')

  // ── Create Subjects ──────────────────────────────────────────────────────
  console.log('\n📚 Creating subjects...')
  const subjects = await Subject.insertMany(SUBJECTS_DATA)
  console.log(`✅ Created ${subjects.length} subjects`)

  // ── Create Lessons for All Subjects ─────────────────────────────────────
  console.log('\n📝 Creating lessons for all subjects...')

  const subjectMap = Object.fromEntries(subjects.map((s: any) => [s.slug, s._id]))

  const allLessonGroups = [
    { name: 'Math',            fn: getMathLessons,           slug: 'mathematics' },
    { name: 'English',         fn: getEnglishLessons,        slug: 'english' },
    { name: 'Science',         fn: getScienceLessons,        slug: 'science' },
    { name: 'Bahasa Malaysia', fn: getBahasaMalaysiaLessons, slug: 'bahasa-malaysia' },
    { name: 'Mandarin',        fn: getMandarinLessons,       slug: 'mandarin' },
    { name: 'Geography',       fn: getGeographyLessons,      slug: 'geography' },
    { name: 'History',         fn: getHistoryLessons,        slug: 'history' },
    { name: 'Art',             fn: getArtLessons,            slug: 'art' },
    { name: 'ICT',             fn: getIctLessons,            slug: 'ict' },
  ]

  let totalLessons = 0
  for (const { name, fn, slug } of allLessonGroups) {
    const lessons = fn(subjectMap[slug])
    await Lesson.insertMany(lessons)
    console.log(`  ✅ ${name}: ${lessons.length} lessons`)
    totalLessons += lessons.length
  }
  console.log(`\n📚 Total lessons created: ${totalLessons}`)

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(60))
  console.log('🎉 KidOS Database Seeded Successfully!')
  console.log('═'.repeat(60))
  console.log('\n📋 SEED ACCOUNTS:')
  console.log('┌─────────────────────────────────────────────────────────┐')
  console.log('│  Role     │  Email                  │  Password         │')
  console.log('├─────────────────────────────────────────────────────────┤')
  console.log('│  Admin    │  admin@kidos.my          │  Admin@123        │')
  console.log('│  Parent   │  parent@kidos.my         │  Parent@123       │')
  console.log('│  Teacher  │  teacher@kidos.my        │  Teacher@123      │')
  console.log('│  Student  │  student@kidos.my        │  Student@123      │')
  console.log('│  Student2 │  student2@kidos.my       │  Student@123      │')
  console.log('└─────────────────────────────────────────────────────────┘')
  console.log(`\n  Subjects: ${subjects.length}`)
  console.log(`  Lessons:  ${totalLessons} across 9 subjects`)
  console.log(`  Badges:   ${badges.length}`)
  console.log('\n🌐 App URL: http://localhost:3000')
  console.log('═'.repeat(60))

  await mongoose.disconnect()
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
