import { auth } from '@/lib/auth/config'
import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/db/connect'
import { Student, Subscription, Progress } from '@/lib/db/models'
import ParentDashboardClient, { ChildData, SubscriptionData } from './ParentDashboardClient'
import type { SubjectSlug } from '@/types'

export default async function ParentDashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'parent') redirect('/login')

  await connectDB()

  const parentId = session.user.id
  const [rawChildren, rawSubscription] = await Promise.all([
    Student.find({ parentId }).lean() as Promise<any[]>,
    Subscription.findOne({ userId: parentId }).lean() as Promise<any>,
  ])

  const now = new Date()
  const sevenDaysAgo = new Date(now)
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  // Aggregate stats per child
  const childrenList: ChildData[] = await Promise.all(
    rawChildren.map(async (child) => {
      const [allCompletedProgress, recentProgress] = await Promise.all([
        Progress.find({ studentId: child._id, status: 'completed' })
          .select('timeSpent completedAt')
          .lean() as Promise<any[]>,
        Progress.find({
          studentId: child._id,
          status: 'completed',
          completedAt: { $gte: sevenDaysAgo },
        })
          .select('timeSpent completedAt')
          .lean() as Promise<any[]>,
      ])

      const totalLessonsCompleted = allCompletedProgress.length
      const totalTimeSpentSeconds = allCompletedProgress.reduce(
        (sum, p) => sum + (p.timeSpent || 0),
        0
      )
      const totalTimeSpentMinutes = Math.round(totalTimeSpentSeconds / 60)

      // Weekly activity: Monday (0) through Sunday (6)
      const weeklyActivity = [0, 0, 0, 0, 0, 0, 0]
      for (const p of recentProgress) {
        if (!p.completedAt) continue
        const date = new Date(p.completedAt)
        // JS getDay(): 0 is Sunday, 1 is Monday ... 6 is Saturday
        const dayIdx = (date.getDay() + 6) % 7 // Convert to 0=Mon..6=Sun
        const minutes = Math.round((p.timeSpent || 60) / 60)
        weeklyActivity[dayIdx] += minutes
      }

      // Format last active
      let lastActive = 'Never'
      if (child.lastLoginDate) {
        const last = new Date(child.lastLoginDate)
        const diffHours = Math.round((now.getTime() - last.getTime()) / (1000 * 60 * 60))
        if (diffHours < 1) lastActive = 'Just now'
        else if (diffHours < 24) lastActive = `${diffHours}h ago`
        else {
          const diffDays = Math.round(diffHours / 24)
          lastActive = `${diffDays}d ago`
        }
      }

      const subjectProgress = (child.subjectProgress || []).map((sp: any) => ({
        subjectSlug: sp.subjectSlug as SubjectSlug,
        completedLessons: sp.completedLessons || 0,
        totalLessons: sp.totalLessons || 1,
        masteryLevel: sp.masteryLevel || 0,
      }))

      return {
        id: child._id.toString(),
        displayName: child.displayName,
        grade: child.grade ?? 0,
        ageGroup: child.ageGroup,
        level: child.level ?? 1,
        xp: child.xp ?? 0,
        streakDays: child.streakDays ?? 0,
        coins: child.coins ?? 0,
        avatar: child.avatar || '🦊',
        subjectProgress,
        totalLessonsCompleted,
        totalTimeSpent: totalTimeSpentMinutes,
        weeklyActivity,
        lastActive,
        isPremium: Boolean(child.isPremium),
      }
    })
  )

  const subscriptionData: SubscriptionData = {
    plan: rawSubscription?.plan ? `${rawSubscription.plan.toUpperCase()} Plan` : 'Free Plan',
    status: rawSubscription?.status ?? 'active',
    nextBilling: rawSubscription?.currentPeriodEnd
      ? new Date(rawSubscription.currentPeriodEnd).toISOString()
      : null,
    amount: rawSubscription?.amount ? `RM ${(rawSubscription.amount / 100).toFixed(2)}/yr` : 'RM 0',
    maxChildren: rawSubscription?.maxChildren ?? 2,
    usedChildren: childrenList.length,
    isSubscribed: Boolean(rawSubscription && rawSubscription.status === 'active'),
  }

  return (
    <ParentDashboardClient
      parentName={session.user.name || 'Parent'}
      childrenList={JSON.parse(JSON.stringify(childrenList))}
      subscription={JSON.parse(JSON.stringify(subscriptionData))}
    />
  )
}
