/**
 * Matching puzzle seed — idempotent (safe to run multiple times).
 *
 * What it does:
 *  1. Upserts all MatchingItem catalog entries (animals, plants, colors, shapes)
 *  2. Upserts 8 sample Lesson records (type: 'game', gameData.gameType: 'matching')
 *     — one pair per age group × difficulty, across two subjects
 *
 * Run: npm run seed:matching
 */

import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from './connect'
import MatchingItem from './models/MatchingItem'
import Lesson from './models/Lesson'
import Subject from './models/Subject'
import { MATCHING_ITEMS } from './seeds/matching-items'

async function seedMatchingItems() {
  console.log('⏳ Upserting matching items…')

  const ops = MATCHING_ITEMS.map((item) => ({
    updateOne: {
      filter: { slug: item.slug },
      update: { $set: item },
      upsert: true,
    },
  }))

  const result = await MatchingItem.bulkWrite(ops)
  console.log(
    `✅ Matching items — upserted: ${result.upsertedCount}, modified: ${result.modifiedCount}`,
  )
}

async function seedMatchingLessons() {
  console.log('⏳ Upserting matching puzzle lessons…')

  // Fetch subject IDs — we need science (animals/plants) and art (colors/shapes)
  const [science, art] = await Promise.all([
    Subject.findOne({ slug: 'science' }).lean(),
    Subject.findOne({ slug: 'art' }).lean(),
  ])

  if (!science || !art) {
    console.warn('⚠️  science or art subjects not found — run npm run seed first to create subjects.')
    return
  }

  const scienceId = (science as { _id: mongoose.Types.ObjectId })._id
  const artId = (art as { _id: mongoose.Types.ObjectId })._id

  const lessons = [
    // ── TODDLER ──────────────────────────────────────────────────────────────
    {
      slug: 'matching-toddler-animals',
      title: 'Animal Friends Match! 🐶',
      description: 'Find the matching animals — tap one, then find its twin!',
      subjectId: scienceId,
      subjectSlug: 'science',
      topicId: 'living-things',
      ageGroup: 'toddler',
      grade: [0],
      type: 'game',
      difficulty: 'easy',
      duration: 5,
      xpReward: 15,
      coinReward: 8,
      order: 50,
      tags: ['matching', 'animals', 'toddler'],
      isPremium: false,
      isActive: true,
      gameData: {
        gameType: 'matching',
        categories: ['animals'],
        pairsCount: 3,
        mode: 'tap',
        timeLimit: null,
        showLabels: false,
      },
    },
    {
      slug: 'matching-toddler-colors',
      title: 'Colour Match! 🌈',
      description: 'Find two of the same colour — tap and match!',
      subjectId: artId,
      subjectSlug: 'art',
      topicId: 'coloring',
      ageGroup: 'toddler',
      grade: [0],
      type: 'game',
      difficulty: 'easy',
      duration: 5,
      xpReward: 15,
      coinReward: 8,
      order: 51,
      tags: ['matching', 'colors', 'toddler'],
      isPremium: false,
      isActive: true,
      gameData: {
        gameType: 'matching',
        categories: ['colors'],
        pairsCount: 3,
        mode: 'tap',
        timeLimit: null,
        showLabels: false,
      },
    },
    // ── PRESCHOOL ─────────────────────────────────────────────────────────────
    {
      slug: 'matching-preschool-animals',
      title: 'Animal Word Match 🐰',
      description: 'Match each animal picture to its name!',
      subjectId: scienceId,
      subjectSlug: 'science',
      topicId: 'living-things',
      ageGroup: 'preschool',
      grade: [0, 1],
      type: 'game',
      difficulty: 'easy',
      duration: 8,
      xpReward: 20,
      coinReward: 10,
      order: 52,
      tags: ['matching', 'animals', 'preschool'],
      isPremium: false,
      isActive: true,
      gameData: {
        gameType: 'matching',
        categories: ['animals'],
        pairsCount: 4,
        mode: 'tap',
        timeLimit: null,
        showLabels: true,
      },
    },
    {
      slug: 'matching-preschool-shapes',
      title: 'Shape Match! ⭐',
      description: 'Match each shape to its name — circle, square, triangle and more!',
      subjectId: artId,
      subjectSlug: 'art',
      topicId: 'shapes-and-patterns',
      ageGroup: 'preschool',
      grade: [0, 1],
      type: 'game',
      difficulty: 'easy',
      duration: 8,
      xpReward: 20,
      coinReward: 10,
      order: 53,
      tags: ['matching', 'shapes', 'preschool'],
      isPremium: false,
      isActive: true,
      gameData: {
        gameType: 'matching',
        categories: ['shapes'],
        pairsCount: 4,
        mode: 'tap',
        timeLimit: null,
        showLabels: true,
      },
    },
    // ── LOWER PRIMARY ─────────────────────────────────────────────────────────
    {
      slug: 'matching-lower-animals-plants',
      title: 'Nature Memory Flip 🌿',
      description: 'Flip the cards and find all the matching pairs — can you remember where they are?',
      subjectId: scienceId,
      subjectSlug: 'science',
      topicId: 'living-things',
      ageGroup: 'lower_primary',
      grade: [1, 2, 3],
      type: 'game',
      difficulty: 'medium',
      duration: 10,
      xpReward: 30,
      coinReward: 15,
      order: 54,
      tags: ['matching', 'animals', 'plants', 'memory', 'lower_primary'],
      isPremium: false,
      isActive: true,
      gameData: {
        gameType: 'matching',
        categories: ['animals', 'plants'],
        pairsCount: 8,
        mode: 'memory',
        timeLimit: 120,
        showLabels: true,
      },
    },
    {
      slug: 'matching-lower-colors-shapes',
      title: 'Colours & Shapes Memory 🎨',
      description: 'Flip and match all the colours and shapes before time runs out!',
      subjectId: artId,
      subjectSlug: 'art',
      topicId: 'coloring',
      ageGroup: 'lower_primary',
      grade: [1, 2, 3],
      type: 'game',
      difficulty: 'medium',
      duration: 10,
      xpReward: 30,
      coinReward: 15,
      order: 55,
      tags: ['matching', 'colors', 'shapes', 'memory', 'lower_primary'],
      isPremium: false,
      isActive: true,
      gameData: {
        gameType: 'matching',
        categories: ['colors', 'shapes'],
        pairsCount: 8,
        mode: 'memory',
        timeLimit: 120,
        showLabels: true,
      },
    },
    // ── UPPER PRIMARY ─────────────────────────────────────────────────────────
    {
      slug: 'matching-upper-all',
      title: 'Master Memory Challenge 🧠',
      description: 'All four categories — animals, plants, colours, and shapes. How fast can you clear the board?',
      subjectId: scienceId,
      subjectSlug: 'science',
      topicId: 'living-things',
      ageGroup: 'upper_primary',
      grade: [4, 5, 6],
      type: 'game',
      difficulty: 'hard',
      duration: 12,
      xpReward: 50,
      coinReward: 25,
      order: 56,
      tags: ['matching', 'animals', 'plants', 'colors', 'shapes', 'memory', 'upper_primary'],
      isPremium: false,
      isActive: true,
      gameData: {
        gameType: 'matching',
        categories: ['animals', 'plants', 'colors', 'shapes'],
        pairsCount: 10,
        mode: 'memory',
        timeLimit: 90,
        showLabels: true,
      },
    },
    {
      slug: 'matching-upper-animals-hard',
      title: 'Wild Animal Expert 🦁',
      description: 'Only the rarest animals — test your wildlife knowledge!',
      subjectId: scienceId,
      subjectSlug: 'science',
      topicId: 'living-things',
      ageGroup: 'upper_primary',
      grade: [4, 5, 6],
      type: 'game',
      difficulty: 'hard',
      duration: 12,
      xpReward: 50,
      coinReward: 25,
      order: 57,
      tags: ['matching', 'animals', 'memory', 'upper_primary', 'hard'],
      isPremium: false,
      isActive: true,
      gameData: {
        gameType: 'matching',
        categories: ['animals'],
        pairsCount: 10,
        mode: 'memory',
        timeLimit: 75,
        showLabels: true,
      },
    },
  ]

  let upserted = 0
  let modified = 0

  for (const lesson of lessons) {
    const { slug, ...rest } = lesson
    const result = await Lesson.updateOne(
      { tags: slug, type: 'game', 'gameData.gameType': 'matching' },
      { $set: { ...rest, tags: [...(rest.tags ?? []), slug] } },
      { upsert: true },
    )
    if (result.upsertedCount) upserted++
    else if (result.modifiedCount) modified++
  }

  console.log(`✅ Matching lessons — upserted: ${upserted}, modified: ${modified}`)
}

async function main() {
  await connectDB()
  await seedMatchingItems()
  await seedMatchingLessons()
  await mongoose.disconnect()
  console.log('✅ seed:matching complete.')
}

main().catch((err) => {
  console.error('❌ seed:matching failed:', err)
  process.exit(1)
})
