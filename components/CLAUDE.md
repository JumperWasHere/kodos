# KidOS UI rules (components/** — also apply to pages in app/(student|parent|teacher|admin)/)

## Stack

- React 19 + Next.js 15 App Router. TypeScript strict (`npm run type-check` must pass).
- Tailwind CSS 3.4; shadcn-style primitives in `components/ui/` — only **badge, button, card,
  input, progress** exist. For selects/textareas use styled native elements (see
  `components/teacher/QuizForm.tsx`), don't invent new primitives without asking.
- framer-motion for animation, lucide-react icons, sonner `toast` for feedback,
  react-confetti for celebrations.

## Page/component pattern

- Server component `page.tsx` does auth + DB queries, then passes
  `JSON.parse(JSON.stringify(doc))` props to a co-located `'use client'` component
  (e.g. `SubjectDetailClient.tsx`). Follow this split for new pages.
- Role access is enforced by the route-group layouts (`app/(teacher)/layout.tsx` etc.);
  don't duplicate redirects inside pages.
- Shared types come from `types/index.ts` (`AgeGroup`, `LessonLanguage`, `QuizQuestion`,
  `StoryPage`, …) — never redeclare them inline.

## State & data fetching

- Global client state: Zustand stores in `store/` (`gamificationStore` persists to
  localStorage; sync server values via `syncWithServer`). No react-query usage in practice.
- API calls: plain `fetch('/api/...')`; check `res.ok && payload.success`, surface failures
  with `toast.error(payload.error ?? fallback)`. No axios, no API-client layer.

## Styling & design tokens

- Kid-friendly utility classes from `app/globals.css`: `card-kid`, `answer-option`,
  `level-badge`, `nav-item`, `blob`, `text-gradient-primary`. Rounded-2xl/3xl, emoji-first.
- Per-subject colors/gradients from `tailwind.config.ts` via `getSubjectIcon/Gradient/Color`
  in `lib/utils.ts`. Age-group badge colors: toddler=rose, preschool=pink,
  lower_primary=sky, upper_primary=indigo.

## Audio & little-kid mode (toddler/preschool)

- All sound goes through `lib/audio.ts`: `speak(text, language)` (TTS, picks warm female
  voice; languages en/ms/zh/ar), `playAudioFile(url)` for real recordings (always preferred
  over TTS when a URL exists), `playCorrectSound/playWrongSound/playCelebrationSound`.
- Lessons with `ageGroup` toddler/preschool auto-read questions/pages aloud and use giant
  emoji answer buttons; keep text minimal and add a 🔊 replay button on anything spoken.

## Accessibility & responsiveness

- Icon-only buttons need `aria-label` (existing pattern — keep it).
- Layouts must work from mobile up: existing grids use `sm:`/`lg:` breakpoints and the
  sidebar collapses under `lg` — match that.

## Commands & completion gate

- `npm run dev` (http://localhost:3000) · `npm run lint` · `npm run type-check` ·
  `npm run build`. Seed accounts for manual testing: `student@kidos.my` /
  `teacher@kidos.my` (passwords in `lib/db/seed.ts` output).
- **No test framework exists** — verify UI work with type-check + lint + a manual run;
  never claim automated tests passed.
