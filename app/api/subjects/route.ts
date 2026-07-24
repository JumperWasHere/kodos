import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { connectDB } from '@/lib/db/connect'
import { Subject } from '@/lib/db/models'

// GET /api/subjects
export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const ageGroup = searchParams.get('ageGroup')
    const premiumOnly = searchParams.get('premium') === 'true'

    const filter: Record<string, unknown> = { isActive: true }
    if (ageGroup) filter.ageGroups = ageGroup
    if (premiumOnly) filter.isPremium = true

    const subjects = await Subject.find(filter).sort({ order: 1 }).lean()

    return NextResponse.json({ success: true, data: subjects })
  } catch (error) {
    console.error('[Subjects GET]', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch subjects' }, { status: 500 })
  }
}

// POST /api/subjects (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    await connectDB()

    const subject = await Subject.create(body)
    return NextResponse.json({ success: true, data: subject }, { status: 201 })
  } catch (error) {
    console.error('[Subjects POST]', error)
    return NextResponse.json({ success: false, error: 'Failed to create subject' }, { status: 500 })
  }
}
