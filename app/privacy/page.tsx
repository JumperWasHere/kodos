import Link from 'next/link'

export default function PrivacyPage() {
  // This page is linked from the sign-up flow so families can review the data usage policy.
  return <main className="max-w-3xl mx-auto p-6 md:p-12 space-y-6">
    <Link href="/signup" className="text-primary font-semibold">← Back to sign up</Link>
    <h1 className="font-display text-3xl font-bold">Privacy Policy</h1>
    <p>KidOS stores the account and learning-progress information needed to provide lessons, rewards, and teacher features.</p>
    <p>Do not share a child’s account credentials. Contact the platform administrator to request account-data changes or deletion.</p>
  </main>
}
