# KidOS — System Documentation
> Last updated: 2026-07-28

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Folder Structure](#3-folder-structure)
4. [System Design & Architecture](#4-system-design--architecture)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [Database Models & Relationships](#6-database-models--relationships)
7. [API Routes](#7-api-routes)
8. [Features List](#8-features-list)
9. [Environment Variables](#9-environment-variables)
10. [Deployment](#10-deployment)
11. [Changelog](#11-changelog)

---

## 1. Project Overview

**KidOS** is a Malaysian educational SaaS platform for children (preschool – upper primary, ages 4–12). It provides gamified lessons, quizzes, and subject-based learning in multiple languages, with a subscription model for parents.

| Item | Detail |
|------|--------|
| App Name | KidOS |
| Target Market | Malaysia (Bahasa Malaysia, English, Mandarin) |
| Target Users | Students (kids), Parents, Teachers, Admins |
| Billing Currency | MYR (Malaysian Ringgit) |
| App URL (prod) | https://kodos-production-0440.up.railway.app |

---

## 2. Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | MongoDB Atlas (cloud) |
| ODM | Mongoose |
| Authentication | NextAuth v5 (Auth.js) |
| Auth Providers | Credentials (email/password) + Google OAuth |
| Session Strategy | JWT |
| State Management | Zustand |
| Payments | Stripe |
| Email | Resend |
| Deployment | Railway (Docker) |
| Container | Docker (multi-stage, node:20-alpine) |
| PWA | Service Worker + Web Manifest |

---

## 3. Folder Structure

```
kidos/
├── app/                          # Next.js App Router pages
│   ├── (admin)/                  # Admin route group
│   │   └── admin/dashboard/
│   ├── (auth)/                   # Auth route group (public)
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password/
│   ├── (parent)/                 # Parent route group
│   │   └── parent/
│   │       ├── dashboard/
│   │       └── subscription/     # Plans, Stripe checkout/portal, success page
│   ├── (student)/                # Student route group
│   │   └── student/
│   │       ├── dashboard/        # Includes "My Homework" (assignments) card
│   │       ├── subjects/
│   │       │   └── [subject]/    # Age-group tabs + topic filters
│   │       │       └── [lesson]/
│   │       ├── achievements/
│   │       └── leaderboard/
│   ├── (teacher)/                # Teacher route group
│   │   └── teacher/
│   │       ├── dashboard/        # Real class/student/assignment stats
│   │       ├── quizzes/          # Quiz CRUD list
│   │       │   ├── new/          # Quiz builder (create)
│   │       │   └── [id]/edit/    # Quiz builder (edit)
│   │       ├── classes/          # Class list + create
│   │       │   └── [id]/         # Class detail: roster, add/remove students
│   │       ├── assignments/      # Assign quizzes to classes, completion stats
│   │       ├── analytics/        # Aggregated class/quiz/student analytics
│   │       └── settings/         # Profile name + password change
│   └── api/                      # API routes
│       ├── auth/[...nextauth]/   # NextAuth handler
│       ├── assignments/          # Student: my assignments + completion status
│       ├── gamification/         # XP, coins, badges
│       ├── leaderboard/          # Rankings
│       ├── lessons/              # Lesson data
│       ├── media/[id]/           # Serve uploaded images from MongoDB
│       ├── progress/             # Lesson progress (GET/POST)
│       ├── subjects/             # Subject data
│       ├── teacher/
│       │   ├── lessons/          # Quiz CRUD (list/create + [id] get/update/delete)
│       │   ├── classes/          # Class CRUD + [id]/students add/remove
│       │   └── assignments/      # Assignment CRUD
│       ├── upload/               # Image upload (teacher/admin, stored in MongoDB)
│       ├── users/
│       │   ├── register/         # User registration (with age group)
│       │   └── profile/          # Update own name / change password
│       └── stripe/               # checkout, portal, webhook
│
├── components/
│   ├── gamification/             # XPBar, StreakCounter, Leaderboard, Modals
│   ├── layout/                   # Sidebar
│   ├── subjects/                 # QuizGame (MC, true/false, fill-in-the-blank, images)
│   ├── teacher/                  # QuizForm (quiz builder), ImageUpload
│   └── ui/                       # badge, button, card, input, progress
│
├── lib/
│   ├── api/
│   │   └── teacherClass.ts       # Shared class-ownership guard for teacher routes
│   ├── auth/
│   │   ├── config.ts             # NextAuth config (Node.js runtime)
│   │   └── config.edge.ts        # NextAuth config (Edge runtime — middleware only)
│   ├── db/
│   │   ├── connect.ts            # MongoDB connection with global cache
│   │   ├── seed.ts               # Seed script
│   │   ├── models/               # Mongoose models
│   │   └── seeds/                # Lesson seed data per subject
│   ├── validations/
│   │   └── lesson.ts             # Zod schemas for quiz/lesson input
│   └── stripe/config.ts          # Stripe client config
│
├── store/
│   ├── authStore.ts              # Zustand: user session state
│   ├── gamificationStore.ts      # Zustand: XP, coins, level, streaks
│   └── uiStore.ts                # Zustand: UI state (sidebar, modals)
│
├── types/index.ts                # All TypeScript interfaces & types
├── middleware.ts                 # Route protection (NextAuth middleware)
├── next.config.ts                # Next.js config (standalone output for Docker)
├── Dockerfile                    # Multi-stage Docker build
└── public/
    ├── manifest.json             # PWA manifest
    └── sw.js                     # Service Worker
```

---

## 4. System Design & Architecture

### High-Level Architecture

```
Browser (Client)
      │
      ▼
┌─────────────────────────────────┐
│         Next.js App             │
│  ┌────────────────────────────┐ │
│  │  Middleware (Edge Runtime) │ │  ← Route protection via NextAuth
│  └────────────────────────────┘ │
│  ┌──────────┐  ┌─────────────┐  │
│  │  Pages   │  │  API Routes │  │  ← Server Components + Route Handlers
│  │  (RSC)   │  │  (/api/*)   │  │
│  └──────────┘  └─────────────┘  │
└─────────────────────────────────┘
      │                  │
      ▼                  ▼
┌──────────┐      ┌────────────┐
│ MongoDB  │      │   Stripe   │
│  Atlas   │      │    API     │
└──────────┘      └────────────┘
                        │
                  ┌────────────┐
                  │   Resend   │
                  │  (Email)   │
                  └────────────┘
```

### Request Flow

```
User visits /student/dashboard
    │
    ├─► middleware.ts checks JWT session (Edge runtime)
    │       ├── Not logged in → redirect to /login
    │       └── Logged in → allow through
    │
    ├─► page.tsx (Server Component)
    │       ├── auth() → get session
    │       ├── connectDB() → MongoDB connection (parallel)
    │       ├── Query Student, Progress data
    │       └── Render page with data
    │
    └─► Client Components hydrate (Zustand stores)
```

### Role-Based Routing

| Role | Entry Point | Redirected To |
|------|------------|---------------|
| student | /login → success | /student/dashboard |
| parent | /login → success | /parent/dashboard |
| teacher | /login → success | /teacher/dashboard |
| admin | /login → success | /admin/dashboard |

---

## 5. Authentication & Authorization

### Auth Flow

- **Library**: NextAuth v5 (Auth.js)
- **Session**: JWT (stored in cookie, 30-day expiry)
- **Providers**:
  - `CredentialsProvider` — email + bcrypt password
  - `GoogleProvider` — OAuth (auto-creates parent account)

### Middleware Protection

`middleware.ts` runs on every request (Edge runtime). It uses `config.edge.ts` (no Mongoose, no Node.js APIs) to validate the JWT session. Protected routes redirect unauthenticated users to `/login`.

**Public routes** (no auth required): `/login`, `/signup`, `/forgot-password`, `/api/auth/*`, `/api/users/register`, `/api/subjects` (GET), `/api/media/[id]`

**Role enforcement** happens in two layers: route-group layouts (`(student)`, `(parent)`, `(teacher)`, `(admin)`) redirect users with the wrong role, and every teacher/admin API route re-checks `session.user.role` plus per-document ownership server-side.

### JWT Token Payload

```typescript
{
  id: string          // User MongoDB _id
  role: UserRole      // 'student' | 'parent' | 'teacher' | 'admin'
  isPremium: boolean
  // Student-only fields:
  displayName: string
  level: number
  xp: number
  studentId: string   // Student document _id
}
```

---

## 6. Database Models & Relationships

### Database: `kidosdb` on MongoDB Atlas

### Models Overview

```
User ──────────────┬──► Student (1:1)
                   ├──► Subscription (1:1, via userId)
                   ├──► Payment (1:many)
                   ├──► Class (1:many, teacher via teacherId)
                   ├──► Assignment (1:many, teacher via teacherId)
                   ├──► Lesson (1:many, via createdBy — teacher-authored quizzes)
                   └──► Media (1:many, via uploadedBy)

Student ───────────┬──► Progress (1:many)
                   ├──► Badge[] (embedded IDs)
                   ├──► Class[] (member via Class.studentIds)
                   └──► Subscription (via subscriptionId)

Subject ───────────► Lesson (1:many, via subjectId)

Class ─────────────┬──► User (ref: teacherId)
                   ├──► Student[] (ref: studentIds)
                   └──► Assignment (1:many, via classId)

Assignment ────────┬──► Class (ref: classId)
                   └──► Lesson (ref: lessonId)
                        └── completion derived from Progress (studentId × lessonId)

Progress ──────────┬──► Student (ref: studentId)
                   └──► Lesson (ref: lessonId)

Subscription ──────┬──► User (ref: userId)
                   └──► Student[] (ref: childrenIds)
```

### Model Details

#### User
| Field | Type | Notes |
|-------|------|-------|
| name | String | Full name |
| email | String | Unique, lowercase |
| password | String | bcrypt hashed |
| avatar | String | URL |
| role | String | student / parent / teacher / admin |
| isEmailVerified | Boolean | default: true (seed) |
| isActive | Boolean | soft-disable account |
| lastLoginAt | Date | updated on sign-in |

#### Student
| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId | ref: User |
| displayName | String | kid-friendly name |
| ageGroup | String | preschool / lower_primary / upper_primary |
| grade | Number | 0 (preschool) – 6 |
| parentId | ObjectId | ref: User (parent) |
| xp | Number | experience points |
| level | Number | derived from XP |
| coins | Number | in-app currency |
| gems | Number | premium currency |
| streakDays | Number | current login streak |
| longestStreak | Number | all-time best streak |
| badges | ObjectId[] | ref: Badge |
| subjectProgress | Mixed[] | per-subject summary cache |
| isPremium | Boolean | from subscription |

#### Subject
| Field | Type | Notes |
|-------|------|-------|
| name | String | English name |
| nameMs | String | Bahasa Malaysia name |
| slug | String | unique URL key |
| icon | String | emoji |
| color | String | hex color |
| ageGroups | String[] | which age groups can access |
| grades | Number[] | applicable grades |
| isPremium | Boolean | requires subscription |
| isActive | Boolean | show/hide subject |
| topics | Mixed[] | sub-topics within subject |
| order | Number | display order |

**9 Subjects**: Mathematics, English, Science, Bahasa Malaysia, Mandarin, Geography, History, Art, ICT

#### Lesson
| Field | Type | Notes |
|-------|------|-------|
| title | String | lesson title |
| subjectId | ObjectId | ref: Subject |
| subjectSlug | String | denormalized for queries |
| ageGroup | String | target age group |
| grade | Number[] | applicable grades |
| type | String | video / interactive / quiz / game / story / worksheet |
| difficulty | String | easy / medium / hard |
| xpReward | Number | XP on completion |
| coinReward | Number | coins on completion |
| questions | Mixed[] | quiz questions (see question types below) |
| isPremium | Boolean | premium-only |
| order | Number | sequence within subject |
| createdBy | ObjectId | ref: User — set for teacher-authored quizzes (ownership check for edit/delete) |

**Question types** (`questions[].type`): `multiple_choice`, `true_false`, `fill_blank` are fully playable in QuizGame (`drag_drop` and `match` exist in the schema but have no player UI yet). Each question supports `imageUrl` (rendered above the question), `explanation`, `points`, and `timeLimit`. For `fill_blank`, `correctAnswer` may be an array of accepted answers — grading is case- and whitespace-insensitive on both client and server.

#### Progress
| Field | Type | Notes |
|-------|------|-------|
| studentId | ObjectId | ref: Student |
| lessonId | ObjectId | ref: Lesson |
| subjectSlug | String | for filtering |
| status | String | not_started / in_progress / completed |
| score | Number | 0–100 |
| xpEarned | Number | actual XP awarded |
| coinsEarned | Number | actual coins awarded |
| timeSpent | Number | seconds |
| attempts | Number | retry count |
| answers | Mixed | submitted answers |
| completedAt | Date | completion timestamp |

**Indexes**: `(studentId, lessonId)` unique; `(studentId, subjectSlug)`; `(studentId, status)`

#### Badge
| Field | Type | Notes |
|-------|------|-------|
| name | String | badge name |
| emoji | String | display emoji |
| category | String | learning / streak / achievement / special |
| requirement | Mixed | `{ type, value, subjectSlug? }` |
| xpReward | Number | bonus XP on unlock |
| coinReward | Number | bonus coins on unlock |
| rarity | String | common / rare / epic / legendary |
| isSpecial | Boolean | special event badge |

#### Subscription
| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId | ref: User (parent) |
| plan | String | free / monthly / annual / family |
| status | String | active / cancelled / expired / trialing / past_due |
| stripeCustomerId | String | Stripe customer ID |
| stripeSubscriptionId | String | Stripe subscription ID |
| currentPeriodEnd | Date | renewal/expiry date |
| maxChildren | Number | family plan limit |
| childrenIds | ObjectId[] | ref: Student |
| amount | Number | in sen (MYR cents) |

#### Class
| Field | Type | Notes |
|-------|------|-------|
| name | String | e.g. "Year 3 Bestari" |
| teacherId | ObjectId | ref: User (teacher who owns the class) |
| grade | Number | 0 (preschool) – 6 |
| studentIds | ObjectId[] | ref: Student — added by teacher via account email |
| isActive | Boolean | soft delete |

#### Assignment
| Field | Type | Notes |
|-------|------|-------|
| title | String | defaults to the quiz title |
| instructions | String | optional note for students |
| teacherId | ObjectId | ref: User |
| classId | ObjectId | ref: Class |
| lessonId | ObjectId | ref: Lesson (the assigned quiz) |
| dueDate | Date | optional; overdue is highlighted for both roles |
| isActive | Boolean | soft delete |

> Completion is **not** stored on the Assignment — it is derived from `Progress` records (`studentId × lessonId, status: completed`), so completing the quiz anywhere marks the assignment done.

#### Media
| Field | Type | Notes |
|-------|------|-------|
| filename | String | original file name |
| contentType | String | JPEG / PNG / WebP / GIF / SVG |
| size | Number | bytes (max 2 MB enforced at upload) |
| data | Buffer | image bytes stored in MongoDB (no external storage needed) |
| uploadedBy | ObjectId | ref: User (teacher/admin) |

> Served via `GET /api/media/[id]` with immutable cache headers. Quiz question `imageUrl` fields point either here or to an external URL.

---

## 7. API Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET/POST | `/api/auth/[...nextauth]` | NextAuth handler | Public |
| POST | `/api/users/register` | Create account (students pick age group; grade defaults per group) | Public |
| PUT | `/api/users/profile` | Update own name / change password (verifies current password) | Required |
| GET | `/api/subjects` | List all active subjects | Public |
| POST | `/api/subjects` | Create subject | Admin |
| GET | `/api/lessons` | List lessons (filter by subject/ageGroup/topic/type) | Required |
| GET | `/api/progress` | Get student's lesson progress | Student |
| POST | `/api/progress` | Complete a lesson — server-side regrading, idempotent rewards, level sync | Student |
| GET | `/api/gamification` | Get XP, coins, badges, streak | Student |
| POST | `/api/gamification` | Claim daily reward | Student |
| GET | `/api/leaderboard` | Top students by XP or streak | Required |
| GET | `/api/assignments` | Student's assignments with completion status | Student |
| GET | `/api/teacher/lessons` | List quizzes (`scope=mine\|all`, subject/age filters) | Teacher/Admin |
| POST | `/api/teacher/lessons` | Create a quiz (zod-validated, sets `createdBy`) | Teacher/Admin |
| GET/PUT/DELETE | `/api/teacher/lessons/[id]` | Read/update/delete a quiz (owner or admin only; delete cascades Progress) | Teacher/Admin |
| GET/POST | `/api/teacher/classes` | List own classes / create a class | Teacher/Admin |
| GET/PUT/DELETE | `/api/teacher/classes/[id]` | Roster with stats / rename / delete (cascades Assignments) | Owner/Admin |
| POST/DELETE | `/api/teacher/classes/[id]/students` | Add student by account email / remove by `?studentId=` | Owner/Admin |
| GET/POST | `/api/teacher/assignments` | List with completion counts / assign a quiz to a class | Teacher/Admin |
| DELETE | `/api/teacher/assignments/[id]` | Delete an assignment | Owner/Admin |
| POST | `/api/upload` | Upload an image (≤2 MB, image types only) → returns `/api/media/{id}` URL | Teacher/Admin |
| GET | `/api/media/[id]` | Serve an uploaded image (long-lived cache) | Public |
| POST | `/api/stripe/checkout` | Create Stripe checkout session | Required |
| POST | `/api/stripe/portal` | Open Stripe billing portal | Required |
| POST | `/api/stripe/webhook` | Handle Stripe events (raw body) | Stripe sig |

**Authorization model**: teacher routes accept `teacher` or `admin` roles; ownership is enforced per document (`Lesson.createdBy`, `Class.teacherId`, `Assignment.teacherId`) — teachers manage only their own content, admins manage any.

---

## 8. Features List

### ✅ Implemented

#### Authentication
- [x] Email + password login (bcrypt)
- [x] Google OAuth login (auto-creates parent account)
- [x] Role-based routing (student / parent / teacher / admin)
- [x] JWT sessions (30-day expiry)
- [x] Route protection via middleware
- [x] Age-group selection at student signup (preschool / lower / upper primary → default grade)
- [x] Profile settings: update name, change password (with current-password verification)

#### Student Features
- [x] Student dashboard (XP, level, streak, recent activity)
- [x] "My Homework" card — teacher assignments with due dates, overdue warnings, done-state
- [x] Subjects listing page (9 subjects with lock/unlock)
- [x] Subject detail page with **age-group tabs** (defaults to the student's own group, "For you" hint) + topic filters + per-lesson age badges
- [x] Lesson player page (quiz gameplay)
- [x] Progress tracking (per lesson: score, XP, coins) — server-side regrading, idempotent rewards
- [x] Achievements page
- [x] Leaderboard page (auth-protected API)

#### Quiz Engine
- [x] Multiple choice (shuffled options, A–D labels)
- [x] True / False
- [x] Fill-in-the-blank (typed answers, case/space-insensitive, alternate accepted answers)
- [x] Question images (`imageUrl` rendered above the question)
- [x] Per-question timer, points, explanations, in-quiz streak toasts
- [x] Result screen (stars, confetti ≥80%, answer review, retry)

#### Gamification
- [x] XP system (earned per lesson completion)
- [x] Level progression — single XP curve shared by client store and API (`lib/utils.ts`); DB level synced on every completion
- [x] Coins (in-app currency)
- [x] Gems (premium currency)
- [x] Login streak tracking
- [x] Badge/achievement system (12 badges seeded — awarding logic not yet wired)
- [x] XP Bar / streak counter / leaderboard components

#### Content
- [x] 9 subjects with topics
- [x] ~45 seeded lessons incl. picture-counting, true/false, and fill-in-the-blank quizzes across all three age groups
- [x] Premium content lock (Mandarin, Geography, History, ICT)
- [x] Age group targeting (preschool / lower / upper primary)
- [x] Grade-level metadata (Grade 0–6)

#### Teacher Features
- [x] Teacher dashboard — real class/student/assignment/completions-today stats
- [x] **Quiz CRUD**: builder for create/edit (subject, topic, age group, years, difficulty, rewards, premium flag) with per-question images
- [x] Image upload (≤2 MB, stored in MongoDB as `Media`, served via `/api/media/[id]`) or external URL
- [x] Ownership rules: teachers edit/delete only their own quizzes; admins any
- [x] **My Classes**: create classes, add students by account email, live roster (XP/level/lessons/streak), remove students, delete class
- [x] **Assignments**: assign any quiz to a class with due date + instructions; live completion bars derived from Progress
- [x] **Analytics**: student/class counts, total completions, avg score, 7-day activity, per-quiz performance, top students, per-class summaries
- [x] **Settings**: profile name + password change

#### Subscription / Payments
- [x] Stripe checkout integration
- [x] Stripe billing portal
- [x] Stripe webhook handler
- [x] Subscription plans: Monthly, Annual, Family
- [x] Premium flag on student profile
- [x] `/parent/subscription` page — plan cards, checkout, billing portal, success/cancel banners (Stripe redirect target)

#### Parent Features
- [x] Parent dashboard (still mock data)
- [x] Subscription management page

#### Admin Features
- [x] Admin dashboard (still mock data)
- [x] Access to teacher quiz management (can edit any quiz)

#### Infrastructure
- [x] MongoDB Atlas connection with connection pooling
- [x] Parallel auth + DB calls in server components (performance)
- [x] Docker multi-stage build
- [x] Railway deployment
- [x] PWA (manifest + service worker)
- [x] Database seed script (all 9 subjects + lessons + badges + users) — **wipes all collections first**

---

### ⏳ Planned / Not Yet Built

#### Authentication
- [ ] Email verification flow
- [ ] Forgot password / reset password (page exists but is simulated — no email is sent)
- [ ] Session refresh of `isPremium` after Stripe payment (currently requires re-login)

#### Gamification
- [ ] Badge **awarding** logic (badges are seeded with requirements but never granted)
- [ ] Server-side streak updates on login / lesson completion (only the daily-reward claim updates it)
- [ ] Weekly / monthly leaderboard periods (tabs exist but data is all-time only)

#### Student Features
- [ ] Avatar customization UI
- [ ] Lesson video player
- [ ] Interactive story lessons (`storyPages` schema exists, no player)
- [ ] Worksheet download
- [ ] In-app coin/gem shop
- [ ] `drag_drop` / `match` question types (schema exists, no player UI)

#### Parent Features
- [ ] Real parent dashboard (currently mock — `Student.parentId` exists but is unused)
- [ ] Add/manage children profiles
- [ ] View children's progress reports
- [ ] Set screen time limits

#### Teacher Features
- [ ] Student self-join classes via join code (currently teacher adds by email)
- [ ] Message parents / export reports
- [ ] Grading & feedback on assignments (completion is auto-derived from quiz results)

#### Admin Features
- [ ] Real admin dashboard (currently mock)
- [ ] User management (CRUD)
- [ ] Subject management UI (API exists: `POST /api/subjects`)
- [ ] Subscription analytics / revenue dashboard

#### Content
- [ ] Real video lesson content
- [ ] Bahasa Malaysia / Mandarin content expansion

#### Payments
- [ ] Real Stripe product IDs configured
- [ ] Family plan child management

#### Other
- [ ] Google OAuth redirect URIs updated to production URL
- [ ] Email sending via Resend (registration, password reset)
- [ ] PWA icons + favicon (referenced in manifest/layout but missing from `public/`)
- [ ] Push notifications (PWA)
- [ ] Offline mode (service worker caching)
- [ ] `/terms` and `/privacy` pages (linked from signup)

---

## 9. Environment Variables

### Required in Production (Railway)

| Variable | Example Value | Purpose |
|----------|--------------|---------|
| `NEXTAUTH_URL` | `https://kodos-production-0440.up.railway.app` | Auth callback URL |
| `NEXTAUTH_SECRET` | 64-char hex string | JWT signing key |
| `AUTH_TRUST_HOST` | `true` | Required for non-Vercel hosts |
| `MONGODB_URI` | `mongodb+srv://...@cluster0.../kidosdb` | Database connection |
| `NEXT_PUBLIC_APP_URL` | `https://kodos-production-0440.up.railway.app` | Public app URL |
| `NEXT_PUBLIC_APP_NAME` | `KidOS` | App display name |
| `GOOGLE_CLIENT_ID` | from Google Cloud Console | OAuth |
| `GOOGLE_CLIENT_SECRET` | from Google Cloud Console | OAuth |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Stripe (client) |
| `STRIPE_SECRET_KEY` | `sk_live_...` | Stripe (server) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Stripe webhook validation |
| `STRIPE_PRICE_MONTHLY` | `price_...` | Monthly plan price ID |
| `STRIPE_PRICE_ANNUAL` | `price_...` | Annual plan price ID |
| `STRIPE_PRICE_FAMILY` | `price_...` | Family plan price ID |
| `RESEND_API_KEY` | `re_...` | Email sending |
| `EMAIL_FROM` | `noreply@kidos.my` | Email sender address |

---

## 10. Deployment

### Railway (Production)

- **Platform**: Railway
- **Build**: Docker (multi-stage)
- **Port**: Railway injects `PORT` env var (typically 8080)
- **Project**: `modest-charisma`
- **Service**: `kodos`
- **URL**: https://kodos-production-0440.up.railway.app

### Deploy Command (CLI)
```bash
railway up --detach
```

### Docker Build Stages
1. **deps** — Install all npm dependencies
2. **builder** — Run `next build` (with placeholder env vars for NextAuth)
3. **runner** — Minimal image, copies `.next/standalone` + `.next/static` + `public`

### Seed Database (Local)
```bash
npm run seed
# Uses .env.local for MONGODB_URI
```

### Seed Accounts (After Seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@kidos.my | Admin@123 |
| Parent | parent@kidos.my | Parent@123 |
| Teacher | teacher@kidos.my | Teacher@123 |
| Student 1 | student@kidos.my | Student@123 |
| Student 2 | student2@kidos.my | Student@123 |

> ⚠️ `npm run seed` **deletes all collections first** — including teacher-created quizzes, classes, and assignments. Only run it against a fresh/dev database.

---

## 11. Changelog

### 2026-07-29 — Claude Code workspace configuration
- Added `CLAUDE.md` (root: shared rules, model routing policy, mandatory doc-sync rule),
  `app/api/CLAUDE.md` (API/backend conventions), `components/CLAUDE.md` (UI conventions)
- Added `.claude/agents/planner.md` (Fable 5, planning) and `.claude/agents/coder.md`
  (Sonnet, execution) for cost-controlled model routing

### 2026-07-28 — Teacher tools, age categorization & bug fixes

**New features**
- Teacher quiz CRUD: builder UI (`/teacher/quizzes`), APIs with zod validation, ownership via `Lesson.createdBy`
- Image support in quizzes: upload (≤2 MB → MongoDB `Media` model, served at `/api/media/[id]`) or external URL; rendered in the quiz player
- Class management (`/teacher/classes`): `Class` model, add students by email, live roster stats
- Assignments (`/teacher/assignments`): `Assignment` model, completion derived from `Progress`; students get a "My Homework" dashboard card
- Teacher analytics (`/teacher/analytics`) with real MongoDB aggregation; teacher settings (`/teacher/settings`) + `PUT /api/users/profile`
- Teacher dashboard rewritten with real data (was mock)
- Age categorization end-to-end: age-group picker at signup, age tabs + badges on subject pages
- Quiz engine: fill-in-the-blank question type (typed, case-insensitive, alternate answers); new seed lessons using true/false + fill-blank
- `/parent/subscription` page (Stripe success/cancel target, was a 404)

**Bug fixes**
- Removed mock-lesson fallback that caused a 500 when saving quiz results; ObjectId validation on lesson routes
- Unified the two conflicting XP→level formulas into one curve (`lib/utils.ts`); student `level` now synced in DB on completion
- `/api/leaderboard` now requires authentication
- Fixed `subjectProgress.totalLessons` using the wrong field; removed session `console.log`; quiz progress bar reaches 100%; duplicate-option React keys
- Sidebar links pruned to existing pages, then teacher nav restored as the pages were built

---

*End of Document*
