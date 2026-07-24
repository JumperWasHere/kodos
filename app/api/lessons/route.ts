import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { connectDB } from '@/lib/db/connect'
import { Lesson } from '@/lib/db/models'

// GET /api/lessons?subjectSlug=mathematics&ageGroup=lower_primary
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const subjectSlug = searchParams.get('subjectSlug')
    const ageGroup = searchParams.get('ageGroup')
    const topicId = searchParams.get('topicId')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') ?? '20')
    const page = parseInt(searchParams.get('page') ?? '1')

    const session = await auth()

    await connectDB()

    const filter: Record<string, unknown> = { isActive: true }
    if (subjectSlug) filter.subjectSlug = subjectSlug
    if (ageGroup) filter.ageGroup = ageGroup
    if (topicId) filter.topicId = topicId
    if (type) filter.type = type

    // Non-premium users only see free lessons
    if (!session?.user?.isPremium) {
      filter.isPremium = false
    }

    const [lessons, total] = await Promise.all([
      Lesson.find(filter)
        .sort({ order: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-questions') // Don't send questions in list view
        .lean(),
      Lesson.countDocuments(filter),
    ])

    return NextResponse.json({
      success: true,
      data: lessons,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error('[Lessons GET]', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch lessons' }, { status: 500 })
  }
}
