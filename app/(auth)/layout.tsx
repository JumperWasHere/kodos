import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg">
              🎓
            </div>
            <span className="font-display font-bold text-2xl text-gradient-primary">KidOS</span>
          </Link>
          {children}
        </div>
      </div>

      {/* Right: Decorative panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 items-center justify-center relative overflow-hidden">
        {/* Blobs */}
        <div className="blob w-64 h-64 bg-purple-400 -top-12 -left-12" />
        <div className="blob w-48 h-48 bg-pink-400 -bottom-8 -right-8" />

        <div className="relative z-10 text-center text-white px-12 max-w-md">
          <div className="text-8xl mb-6 animate-float">🧒</div>
          <h2 className="font-display text-3xl font-bold mb-4">
            Join 50,000+ Young Learners!
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Make learning fun, interactive, and rewarding. Every lesson is an adventure!
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { emoji: '🔢', label: 'Maths' },
              { emoji: '📖', label: 'English' },
              { emoji: '🔬', label: 'Science' },
              { emoji: '🇲🇾', label: 'BM' },
              { emoji: '🀄', label: 'Mandarin' },
              { emoji: '🎨', label: 'Art' },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center">
                <div className="text-2xl mb-1">{s.emoji}</div>
                <div className="text-xs font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
