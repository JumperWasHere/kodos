# KidOS API rules (app/api/**)

Applies to route handlers here and their supporting code in `lib/`.

## Stack

- Next.js 15 App Router **route handlers** (Node runtime). Dynamic params are Promises:
  `{ params }: { params: Promise<{ id: string }> }` → `const { id } = await params`.
- MongoDB via **Mongoose 8** (no Prisma). NextAuth v5 beta, JWT sessions.
- Validation with **zod** (schemas in `lib/validations/`).

## Layer responsibilities

- `app/api/**/route.ts` — HTTP only: auth check, zod parse, call model queries, shape response.
- `lib/db/models/` — all Mongoose models, re-exported from `lib/db/models/index.ts`.
  Import from the index (`import { Lesson, Student } from '@/lib/db/models'`).
- `lib/db/connect.ts` — always `await connectDB()` before queries.
- `lib/auth/config.ts` — `auth()`, session shape (`session.user.{id,role,studentId,isPremium}`).
  `config.edge.ts` is middleware-only; never import Mongoose into it.
- `lib/api/` — shared guards (e.g. `loadClassForTeacher`). Put reusable route logic here,
  never export non-HTTP functions from a `route.ts` (Next.js rejects extra exports).

## Conventions (match existing routes exactly)

- Response shape: `NextResponse.json({ success: true, data })` /
  `{ success: false, error: '...' }` with proper status (400/401/403/404/409/500).
- Every handler: `try/catch` → `console.error('[RouteName METHOD]', error)` → 500.
- Auth: `const session = await auth()`; role-gate teacher/admin routes; enforce **per-document
  ownership** (`Lesson.createdBy`, `Class.teacherId`, `Assignment.teacherId`) — admin bypasses.
- Validate every ObjectId from the URL/body with `Types.ObjectId.isValid` before querying.
- Quiz grading is server-side only (`app/api/progress/route.ts`); never trust client scores.
  XP→level math comes from `getLevelFromXP` in `lib/utils.ts` — the single source of truth.
- Premium gating: check `lesson.isPremium && !student.isPremium` → 403.

## Database & seed rules

- Schema changes go in `lib/db/models/*.ts` AND must be mirrored in the inline schemas in
  `lib/db/seed.ts` (they are `strict: false` as a safety net, but keep fields listed).
- `npm run seed` **deletes all collections** — never run it against a production DB, and ask
  before running it at all. `npm run seed:toddler` is the non-destructive alternative.
- No destructive migrations/deletions of user data without asking first.
- Uploaded media is stored in MongoDB (`Media` model, ≤2MB images / ≤8MB audio via
  `POST /api/upload`, served by `GET /api/media/[id]`). No Cloudinary/S3 is wired up.

## Env & commands

- Env vars documented in `.env.example`; runtime values in `.env.local` (never commit).
  Required for API work: `MONGODB_URI`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`.
- Verify with `npm run type-check` and `npm run lint`. No API test suite exists —
  say so honestly rather than claiming tests pass.

## Never touch

- `.next/`, `node_modules/`, `tsconfig.tsbuildinfo`, `package-lock.json` (regenerate only
  via npm commands).
- `app/api/stripe/webhook` signature verification and the idempotent reward logic in
  `app/api/progress` — change only with explicit approval.
