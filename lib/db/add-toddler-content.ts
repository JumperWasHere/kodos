/**
 * Non-destructive migration: adds the "Little Ones (1–3)" content to an
 * EXISTING database without wiping anything.
 *
 *   npm run seed:toddler
 *
 * What it does:
 *  1. Adds 'toddler' to the ageGroups of Math, English, Science, BM, Mandarin, Art
 *  2. Tags all Bahasa Malaysia lessons with language 'ms' (Malay read-aloud voice)
 *  3. Re-inserts the toddler lessons (removes previous toddler-seeded ones first,
 *     matched by the 'toddler' tag — teacher-created content is never touched)
 */
import mongoose from 'mongoose'
import { getToddlerLessons } from './seeds/toddler'

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set. Run with: npm run seed:toddler')
  process.exit(1)
}

// Minimal inline schemas (same approach as seed.ts) so this script has no
// dependency on the app's model registration order.
const Subject = mongoose.model('Subject', new mongoose.Schema({}, { strict: false }))
const Lesson = mongoose.model('Lesson', new mongoose.Schema({}, { strict: false }))

const TODDLER_SUBJECTS = ['mathematics', 'english', 'science', 'bahasa-malaysia', 'mandarin', 'art']

async function main() {
  await mongoose.connect(MONGODB_URI!)
  console.log('🔌 Connected to MongoDB')

  // 1. Tag subjects as toddler-friendly
  const subjectResult = await Subject.updateMany(
    { slug: { $in: TODDLER_SUBJECTS } },
    { $addToSet: { ageGroups: 'toddler' } }
  )
  console.log(`✅ Subjects updated: ${subjectResult.modifiedCount} now include the 'toddler' age group`)

  // 2. Malay voice for Bahasa Malaysia lessons that have no language yet
  const langResult = await Lesson.updateMany(
    { subjectSlug: 'bahasa-malaysia', language: { $exists: false } },
    { $set: { language: 'ms' } }
  )
  console.log(`✅ Bahasa Malaysia lessons tagged 'ms': ${langResult.modifiedCount}`)

  // 3. Insert toddler lessons (idempotent: replace previous toddler-seeded ones)
  const subjects = await Subject.find({ slug: { $in: TODDLER_SUBJECTS } }).select('slug').lean() as any[]
  const subjectMap: Record<string, unknown> = {}
  for (const s of subjects) subjectMap[s.slug] = s._id

  const missing = TODDLER_SUBJECTS.filter((slug) => !subjectMap[slug])
  if (missing.length > 0) {
    console.warn(`⚠️ Subjects not found in DB (skipping their lessons): ${missing.join(', ')}`)
  }

  const removed = await Lesson.deleteMany({ ageGroup: 'toddler', tags: 'toddler', createdBy: { $exists: false } })
  const lessons = getToddlerLessons(subjectMap).filter((l) => l.subjectId)
  await Lesson.insertMany(lessons)
  console.log(`✅ Toddler lessons: removed ${removed.deletedCount} old, inserted ${lessons.length} fresh`)

  await mongoose.disconnect()
  console.log('\n🎉 Done! Restart the dev server and open Subjects → 👶 Little Ones (1–3)')
}

main().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
