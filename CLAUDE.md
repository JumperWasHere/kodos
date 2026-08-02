# KidOS — Claude Code Rules (root)

## Project overview

KidOS is a gamified educational SaaS for Malaysian children (ages 1–12): quizzes, stories,
XP/coins/badges, teacher tools, and Stripe subscriptions. It is a **single Next.js 15 App Router
monolith** — there is no separate backend/frontend repo. Server side = route handlers under
`app/api/**` plus `lib/` (Mongoose models, auth, validation); client side = role-grouped pages
under `app/(student|parent|teacher|admin)/`, `components/`, and `store/`. One process serves both:
`npm run dev` on http://localhost:3000, and the client calls the API at the same origin (`/api/*`).
Data lives in MongoDB Atlas (`MONGODB_URI` in `.env.local`).

## Repo map

- `app/` — App Router pages (role route groups) and `app/api/` route handlers.
  **`app/api/CLAUDE.md` holds the backend/API rules — read it before touching API code.**
- `components/` — React UI (subjects/, teacher/, gamification/, layout/, ui/).
  **`components/CLAUDE.md` holds the frontend/UI rules — they also apply to pages in `app/(...)/`.**
- `lib/` — `db/` (Mongoose models, seed scripts, per-subject seed data), `auth/` (NextAuth v5
  configs), `validations/` (zod schemas), `api/` (shared route helpers), `audio.ts`, `utils.ts`.
- `store/` — Zustand stores. `types/index.ts` — shared TS types. `public/` — static assets
  (PWA manifest, `illustrations/`). `middleware.ts` — auth gate for role areas.
- `KIDOS_SYSTEM_DOCUMENT.md` — living system documentation (see mandatory sync rule below).

## Model routing policy (cost control)

- Planning, architecture decisions, complex refactors, debugging hard problems, and any
  creative/design work → delegate to the **planner** subagent (strongest model, Fable 5).
- Small, well-defined tasks — routine coding, renames, small bug fixes, writing tests for
  existing patterns, docs edits → delegate to the **coder** subagent (Sonnet) to reduce cost.
- Rule of thumb: if the task needs judgment or produces a plan, use the strong model; if the
  task executes a clear plan, use Sonnet.
- Before starting any large task, produce a plan first (strong model), then implement steps
  with the cheaper model.

## Documentation sync rule (MANDATORY)

- After EVERY change that adds, removes, renames, or changes the behavior of any file, module,
  endpoint, schema, or configuration, update `KIDOS_SYSTEM_DOCUMENT.md` in the same task —
  never defer it.
- Match the document's existing structure and style; update only the affected sections
  (and add an entry to its Changelog section).
- A task is NOT complete until `KIDOS_SYSTEM_DOCUMENT.md` reflects the change. Include the
  doc update in the same commit.

## Global conventions

- Package manager: **npm** (package-lock.json). Node 22 locally; Docker image is node:20-alpine.
- Commands (verified in package.json): `npm run dev` · `npm run build` · `npm run start` ·
  `npm run lint` · `npm run type-check` · `npm run seed` (⚠️ wipes the whole DB) ·
  `npm run seed:toddler` (non-destructive toddler-content refresh).
- **There is no test suite yet.** The completion gate is: `npm run type-check` and
  `npm run lint` must pass before declaring any task done. If you add a test runner, update
  this rule.
- Git: short imperative commit subjects; developers work on personal branches (`jumper`,
  `hazman`) and merge to `main` via PRs. Never commit `.env.local` or any secret — env vars
  are documented in `.env.example`.
- The repo lives in a OneDrive-synced folder: if the build fails with `readlink EINVAL` or
  "Cannot find module './chunks/...'", delete `.next/` and rebuild — do not chase phantom bugs.
