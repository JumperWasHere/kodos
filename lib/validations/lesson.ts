import { z } from 'zod'

export const SUBJECT_SLUGS = [
  'mathematics',
  'english',
  'science',
  'bahasa-malaysia',
  'mandarin',
  'geography',
  'history',
  'art',
  'ict',
] as const

// Question types the QuizGame player can currently render
export const PLAYABLE_QUESTION_TYPES = ['multiple_choice', 'true_false', 'fill_blank'] as const

export const QuizQuestionInputSchema = z
  .object({
    id: z.string().min(1),
    question: z.string().min(1, 'Question text is required').max(1000),
    type: z.enum(PLAYABLE_QUESTION_TYPES),
    options: z.array(z.string().min(1).max(200)).max(6).optional(),
    correctAnswer: z.union([z.string().min(1), z.array(z.string().min(1)).min(1)]),
    explanation: z.string().max(1000).optional(),
    imageUrl: z.string().max(2000).optional(),
    points: z.number().int().min(1).max(100).default(10),
    timeLimit: z.number().int().min(5).max(300).optional(),
  })
  .superRefine((q, ctx) => {
    if (q.type === 'multiple_choice') {
      if (!q.options || q.options.length < 2) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['options'], message: 'Multiple choice needs at least 2 options' })
        return
      }
      const answer = Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : q.correctAnswer
      if (!q.options.includes(answer)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['correctAnswer'], message: 'Correct answer must be one of the options' })
      }
    }
    if (q.type === 'true_false') {
      const answer = Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : q.correctAnswer
      if (!['True', 'False'].includes(answer)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['correctAnswer'], message: 'True/False answer must be "True" or "False"' })
      }
    }
  })

export const LessonInputSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  titleMs: z.string().max(200).optional(),
  description: z.string().min(3, 'Description is required').max(2000),
  descriptionMs: z.string().max(2000).optional(),
  subjectSlug: z.enum(SUBJECT_SLUGS),
  topicId: z.string().max(100).optional(),
  ageGroup: z.enum(['toddler', 'preschool', 'lower_primary', 'upper_primary']),
  grade: z.array(z.number().int().min(0).max(6)).min(1, 'Pick at least one year'),
  type: z.enum(['quiz', 'interactive', 'game']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  language: z.enum(['en', 'ms', 'zh', 'ar']).default('en'),
  thumbnail: z.string().max(2000).optional(),
  duration: z.number().int().min(1).max(120),
  xpReward: z.number().int().min(0).max(500),
  coinReward: z.number().int().min(0).max(500),
  isPremium: z.boolean().default(false),
  isActive: z.boolean().default(true),
  tags: z.array(z.string().max(50)).max(10).default([]),
  questions: z.array(QuizQuestionInputSchema).min(1, 'Add at least one question').max(30),
})

export type LessonInput = z.infer<typeof LessonInputSchema>
export type QuizQuestionInput = z.infer<typeof QuizQuestionInputSchema>
