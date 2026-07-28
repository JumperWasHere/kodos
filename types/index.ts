// ============================================================
// KidOS – Central TypeScript Types & Interfaces
// ============================================================

// ---- ENUMS ------------------------------------------------

export type UserRole = 'student' | 'parent' | 'teacher' | 'admin'

export type SubscriptionPlan = 'free' | 'monthly' | 'annual' | 'family'
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'trialing' | 'past_due'

export type AgeGroup = 'toddler' | 'preschool' | 'lower_primary' | 'upper_primary'

// Language a lesson's questions are written in — drives the text-to-speech voice
export type LessonLanguage = 'en' | 'ms' | 'zh' | 'ar'

export type SubjectSlug =
  | 'mathematics'
  | 'english'
  | 'science'
  | 'bahasa-malaysia'
  | 'mandarin'
  | 'geography'
  | 'history'
  | 'art'
  | 'ict'

export type LessonType = 'video' | 'interactive' | 'quiz' | 'game' | 'story' | 'worksheet'

export type DifficultyLevel = 'easy' | 'medium' | 'hard'

export type BadgeCategory =
  | 'learning'
  | 'streak'
  | 'achievement'
  | 'special'
  | 'seasonal'
  | 'social'

// ---- USER TYPES -------------------------------------------

export interface IUser {
  _id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  isEmailVerified: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface IStudent extends IUser {
  role: 'student'
  displayName: string
  ageGroup: AgeGroup
  grade: number // 1–6, or 0 for preschool
  dateOfBirth?: Date
  parentId?: string
  avatar: string
  avatarCustomization: AvatarCustomization
  // Gamification
  xp: number
  level: number
  coins: number
  gems: number
  streakDays: number
  lastLoginDate: Date
  totalLoginDays: number
  badges: string[] // badge IDs
  achievements: string[] // achievement IDs
  // Progress
  subjectProgress: SubjectProgress[]
  // Subscription
  subscriptionId?: string
  isPremium: boolean
}

export interface IParent extends IUser {
  role: 'parent'
  phone?: string
  children: string[] // student IDs
  subscriptionId?: string
  subscription?: ISubscription
}

export interface ITeacher extends IUser {
  role: 'teacher'
  school?: string
  classIds: string[]
  subjects: SubjectSlug[]
  isVerified: boolean
}

export interface IAdmin extends IUser {
  role: 'admin'
  permissions: string[]
  isSuperAdmin: boolean
}

// ---- AVATAR & CUSTOMIZATION -------------------------------

export interface AvatarCustomization {
  character: string // character type key
  hairStyle: string
  hairColor: string
  skinTone: string
  eyeType: string
  outfit: string
  accessory?: string
  background: string
}

export interface AvatarOption {
  id: string
  label: string
  preview: string
  cost: number // coins
  isPremium: boolean
  isLocked: boolean
}

// ---- SUBJECT & LESSON TYPES ------------------------------

export interface ISubject {
  _id: string
  name: string
  slug: SubjectSlug
  description: string
  icon: string
  color: string
  gradient: string
  ageGroups: AgeGroup[]
  totalLessons: number
  totalQuizzes: number
  isPremium: boolean
  order: number
}

export interface ILesson {
  _id: string
  title: string
  description: string
  subjectId: string
  subjectSlug: SubjectSlug
  ageGroup: AgeGroup
  grade: number[]
  type: LessonType
  difficulty: DifficultyLevel
  thumbnail: string
  duration: number // minutes
  xpReward: number
  coinReward: number
  content: LessonContent
  isPremium: boolean
  order: number
  prerequisites: string[] // lesson IDs
  tags: string[]
  isActive: boolean
  createdAt: Date
}

export interface LessonContent {
  type: LessonType
  // For video
  videoUrl?: string
  videoThumbnail?: string
  // For quiz
  questions?: QuizQuestion[]
  // For interactive/game
  gameData?: Record<string, unknown>
  // For story
  storyPages?: StoryPage[]
  // For worksheet
  worksheetUrl?: string
}

export interface QuizQuestion {
  id: string
  question: string
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'drag_drop' | 'match'
  options?: string[]
  correctAnswer: string | string[]
  explanation?: string
  imageUrl?: string
  audioUrl?: string
  points: number
  timeLimit?: number // seconds
}

export interface StoryPage {
  pageNumber: number
  text: string
  imageUrl: string
  audioUrl?: string
  hasInteraction?: boolean
}

// A big visual "you learned this!" recap card shown after a story (e.g. 🔴 Red Apple)
export interface LearningPoint {
  emoji: string
  label: string
}

// ---- PROGRESS TYPES --------------------------------------

export interface SubjectProgress {
  subjectSlug: SubjectSlug
  completedLessons: number
  totalLessons: number
  xpEarned: number
  lastAccessedAt: Date
  masteryLevel: number // 0-100
}

export interface IProgress {
  _id: string
  studentId: string
  lessonId: string
  subjectSlug: SubjectSlug
  status: 'not_started' | 'in_progress' | 'completed'
  score?: number
  xpEarned: number
  coinsEarned: number
  timeSpent: number // seconds
  attempts: number
  completedAt?: Date
  updatedAt: Date
}

export interface LessonAttempt {
  studentId: string
  lessonId: string
  answers: Record<string, string | string[]>
  score: number
  timeSpent: number
  completedAt: Date
}

// ---- GAMIFICATION TYPES ----------------------------------

export interface IBadge {
  _id: string
  name: string
  description: string
  icon: string
  category: BadgeCategory
  requirement: BadgeRequirement
  xpReward: number
  coinReward: number
  isSpecial: boolean
  isSeasonal: boolean
  season?: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface BadgeRequirement {
  type: 'streak' | 'xp' | 'lessons' | 'perfect_score' | 'subject_mastery' | 'login_days' | 'custom'
  value: number
  subjectSlug?: SubjectSlug
}

export interface IAchievement {
  _id: string
  title: string
  description: string
  icon: string
  type: 'milestone' | 'challenge' | 'daily' | 'weekly' | 'special'
  requirement: AchievementRequirement
  xpReward: number
  coinReward: number
  badgeId?: string
  isRepeatable: boolean
  resetPeriod?: 'daily' | 'weekly' | 'monthly'
}

export interface AchievementRequirement {
  type: string
  value: number
  timeframe?: string
}

export interface ILeaderboard {
  period: 'daily' | 'weekly' | 'monthly' | 'alltime'
  entries: LeaderboardEntry[]
  updatedAt: Date
}

export interface LeaderboardEntry {
  rank: number
  studentId: string
  displayName: string
  avatar: string
  xp: number
  level: number
  country?: string
}

export interface DailyReward {
  day: number
  coinReward: number
  xpReward: number
  specialReward?: {
    type: 'badge' | 'avatar_item' | 'gem'
    id: string
    name: string
  }
  isClaimed: boolean
}

export interface VirtualPet {
  id: string
  name: string
  type: 'dragon' | 'cat' | 'dog' | 'bunny' | 'fox' | 'panda'
  level: number
  happiness: number // 0-100
  hunger: number // 0-100
  lastFed: Date
  lastPlayed: Date
  accessories: string[]
}

// ---- SUBSCRIPTION TYPES ----------------------------------

export interface ISubscription {
  _id: string
  userId: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  stripeCustomerId: string
  stripeSubscriptionId?: string
  stripePriceId?: string
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  trialEnd?: Date
  // Family plan
  maxChildren?: number
  childrenIds?: string[]
  // Billing
  amount: number
  currency: string
  interval?: 'month' | 'year'
  createdAt: Date
  updatedAt: Date
}

export interface IPricing {
  plan: SubscriptionPlan
  name: string
  nameMs: string // Malay name
  description: string
  price: {
    monthly: number
    annual: number
  }
  currency: string
  features: PricingFeature[]
  limits: {
    subjects: number | 'unlimited'
    lessonsPerDay: number | 'unlimited'
    quizzesPerDay: number | 'unlimited'
    children?: number
  }
  isPopular: boolean
  stripePriceId: {
    monthly: string
    annual: string
  }
}

export interface PricingFeature {
  text: string
  included: boolean
  tooltip?: string
}

// ---- PAYMENT TYPES ---------------------------------------

export interface IPayment {
  _id: string
  userId: string
  subscriptionId: string
  stripePaymentIntentId: string
  stripeInvoiceId?: string
  amount: number
  currency: string
  status: 'pending' | 'succeeded' | 'failed' | 'refunded'
  paymentMethod: string
  description?: string
  invoiceUrl?: string
  receiptUrl?: string
  paidAt?: Date
  createdAt: Date
}

// ---- CLASS & TEACHER TYPES -------------------------------

export interface IClass {
  _id: string
  name: string
  teacherId: string
  studentIds: string[]
  grade: number
  subject?: SubjectSlug
  schedule?: ClassSchedule[]
  assignments: string[] // assignment IDs
  createdAt: Date
}

export interface ClassSchedule {
  dayOfWeek: number // 0-6
  startTime: string
  endTime: string
}

export interface IAssignment {
  _id: string
  title: string
  description: string
  classId: string
  teacherId: string
  lessonIds: string[]
  dueDate: Date
  totalPoints: number
  submissions: AssignmentSubmission[]
  createdAt: Date
}

export interface AssignmentSubmission {
  studentId: string
  submittedAt: Date
  score: number
  feedback?: string
  status: 'pending' | 'submitted' | 'graded'
}

// ---- ANALYTICS TYPES -------------------------------------

export interface StudentAnalytics {
  studentId: string
  totalXP: number
  totalCoins: number
  level: number
  streakDays: number
  totalTimeSpent: number // minutes
  lessonsCompleted: number
  quizzesCompleted: number
  averageScore: number
  subjectBreakdown: SubjectAnalytic[]
  weeklyActivity: DayActivity[]
  recentAchievements: IAchievement[]
}

export interface SubjectAnalytic {
  subjectSlug: SubjectSlug
  subjectName: string
  color: string
  lessonsCompleted: number
  totalLessons: number
  averageScore: number
  timeSpent: number
  masteryLevel: number
  trend: 'up' | 'down' | 'stable'
}

export interface DayActivity {
  date: string
  lessonsCompleted: number
  xpEarned: number
  timeSpent: number
}

export interface AdminAnalytics {
  totalUsers: number
  totalStudents: number
  totalParents: number
  totalTeachers: number
  activeSubscriptions: number
  monthlyRevenue: number
  annualRevenue: number
  newUsersToday: number
  activeUsersToday: number
  topSubjects: Array<{ slug: SubjectSlug; name: string; lessonCompletions: number }>
  revenueByMonth: Array<{ month: string; revenue: number }>
  subscriptionBreakdown: Array<{ plan: SubscriptionPlan; count: number }>
}

// ---- API RESPONSE TYPES ----------------------------------

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  pagination?: Pagination
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// ---- SESSION TYPES ---------------------------------------

export interface SessionUser {
  id: string
  name: string
  email: string
  image?: string
  role: UserRole
  isPremium: boolean
}

// ---- FORM TYPES ------------------------------------------

export interface LoginFormData {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignupFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: UserRole
  agreeToTerms: boolean
}

export interface CreateChildFormData {
  displayName: string
  dateOfBirth: Date
  grade: number
  avatar: string
}

export interface PasswordResetFormData {
  email: string
}

export interface ProfileUpdateFormData {
  name: string
  email: string
  avatar?: string
  phone?: string
}

// ---- NOTIFICATION TYPES ----------------------------------

export interface INotification {
  _id: string
  userId: string
  title: string
  message: string
  type: 'achievement' | 'streak' | 'assignment' | 'subscription' | 'system' | 'reward'
  icon?: string
  link?: string
  isRead: boolean
  createdAt: Date
}
