import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import MatchingItem from '@/lib/db/models/MatchingItem'
import type { MatchingAgeGroup, MatchingCategory } from '@/lib/db/models/MatchingItem'

const VALID_CATEGORIES: MatchingCategory[] = ['animals', 'plants', 'colors', 'shapes']
const VALID_AGE_GROUPS: MatchingAgeGroup[] = ['toddler', 'preschool', 'lower_primary', 'upper_primary']
const MAX_COUNT = 20

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl

    // Parse and validate ?categories=animals,plants
    const raw = searchParams.get('categories') ?? ''
    const categories = raw
      .split(',')
      .map((c) => c.trim())
      .filter((c): c is MatchingCategory => VALID_CATEGORIES.includes(c as MatchingCategory))

    if (categories.length === 0) {
      return NextResponse.json(
        { success: false, error: 'categories is required (comma-separated: animals,plants,colors,shapes)' },
        { status: 400 },
      )
    }

    // Parse optional ?ageGroup=toddler
    const rawAge = searchParams.get('ageGroup') ?? ''
    const ageGroup: MatchingAgeGroup | null = VALID_AGE_GROUPS.includes(rawAge as MatchingAgeGroup)
      ? (rawAge as MatchingAgeGroup)
      : null

    // Parse optional ?count=6
    const rawCount = parseInt(searchParams.get('count') ?? '6', 10)
    const count = Number.isFinite(rawCount) ? Math.min(Math.max(rawCount, 1), MAX_COUNT) : 6

    await connectDB()

    const filter: Record<string, unknown> = {
      category: { $in: categories },
      isActive: true,
    }

    if (ageGroup) {
      filter.ageGroups = ageGroup
    }

    // Use MongoDB $sample for random selection
    const items = await MatchingItem.aggregate([
      { $match: filter },
      { $sample: { size: count } },
      {
        $project: {
          _id: 1,
          category: 1,
          slug: 1,
          label: 1,
          labelMs: 1,
          emoji: 1,
          colorHex: 1,
          colorClass: 1,
          audioText: 1,
          audioTextMs: 1,
          difficulty: 1,
        },
      },
    ])

    return NextResponse.json({ success: true, data: items })
  } catch (err) {
    console.error('[GET /api/matching/items]', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch matching items' }, { status: 500 })
  }
}
