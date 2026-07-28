import Link from 'next/link'

export default function TermsPage() {
  // This page provides the service terms for the sign-up experience and subscription flow.
  return <main className="max-w-3xl mx-auto p-6 md:p-12 space-y-6">
    <Link href="/signup" className="text-primary font-semibold">← Back to sign up</Link>
    <h1 className="font-display text-3xl font-bold">Terms of Service</h1>
    <p>KidOS provides educational content and progress tools for children, parents, and teachers. Use the service responsibly and keep account credentials private.</p>
    <p>Parents and guardians are responsible for supervising children’s use of the service. Paid features are governed by the subscription terms shown at checkout.</p>
  </main>
}
