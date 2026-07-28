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
│   │   └── parent/dashboard/
│   ├── (student)/                # Student route group
│   │   └── student/
│   │       ├── dashboard/
│   │       ├── subjects/
│   │       │   └── [subject]/
│   │       │       └── [lesson]/
│   │       ├── achievements/
│   │       └── leaderboard/
│   ├── (teacher)/                # Teacher route group
│   │   └── teacher/dashboard/
│   └── api/                      # API routes
│       ├── auth/[...nextauth]/   # NextAuth handler
│       ├── gamification/         # XP, coins, badges
│       ├── leaderboard/          # Rankings
│       ├── lessons/              # Lesson data
│       ├── progress/             # Lesson progress (GET/POST)
│       ├── subjects/             # Subject data
│       ├── users/register/       # User registration
│       └── stripe/               # checkout, portal, webhook
│
├── components/
│   ├── gamification/             # XPBar, StreakCounter, Leaderboard, Modals
│   ├── layout/                   # Sidebar
│   ├── subjects/                 # QuizGame
│   └── ui/                       # badge, button, card, input, progress
│
├── lib/
│   ├── auth/
│   │   ├── config.ts             # NextAuth config (Node.js runtime)
│   │   └── config.edge.ts        # NextAuth config (Edge runtime — middleware only)
│   ├── db/
│   │   ├── connect.ts            # MongoDB connection with global cache
│   │   ├── seed.ts               # Seed script
│   │   ├── models/               # Mongoose models
│   │   └── seeds/                # Lesson seed data per subject
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

**Public routes** (no auth required): `/login`, `/signup`, `/forgot-password`, `/api/auth/*`, `/api/users/register`

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
                   └──► Payment (1:many)

Student ───────────┬──► Progress (1:many)
                   ├──► Badge[] (embedded IDs)
                   └──► Subscription (via subscriptionId)

Subject ───────────► Lesson (1:many, via subjectId)

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
| questions | Mixed[] | quiz questions with options |
| isPremium | Boolean | premium-only |
| order | Number | sequence within subject |

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

---

## 7. API Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET/POST | `/api/auth/[...nextauth]` | NextAuth handler | Public |
| POST | `/api/users/register` | Create new user account | Public |
| GET | `/api/subjects` | List all active subjects | Required |
| GET | `/api/lessons` | List lessons (filter by subject/grade) | Required |
| GET | `/api/progress` | Get student's lesson progress | Required |
| POST | `/api/progress` | Save/update lesson progress | Required |
| GET | `/api/gamification` | Get XP, coins, badges, streak | Required |
| GET | `/api/leaderboard` | Top students by XP | Required |
| POST | `/api/stripe/checkout` | Create Stripe checkout session | Required |
| POST | `/api/stripe/portal` | Open Stripe billing portal | Required |
| POST | `/api/stripe/webhook` | Handle Stripe events (raw body) | Stripe sig |

---

## 8. Features List

### ✅ Implemented

#### Authentication
- [x] Email + password login (bcrypt)
- [x] Google OAuth login (auto-creates parent account)
- [x] Role-based routing (student / parent / teacher / admin)
- [x] JWT sessions (30-day expiry)
- [x] Route protection via middleware

#### Student Features
- [x] Student dashboard (XP, level, streak, recent activity)
- [x] Subjects listing page (9 subjects with lock/unlock)
- [x] Subject detail page (topics list)
- [x] Lesson player page (quiz gameplay)
- [x] Progress tracking (per lesson: score, XP, coins)
- [x] Achievements page
- [x] Leaderboard page

#### Gamification
- [x] XP system (earned per lesson completion)
- [x] Level progression (based on XP)
- [x] Coins (in-app currency)
- [x] Gems (premium currency)
- [x] Login streak tracking
- [x] Badge/achievement system (12 badges seeded)
- [x] XP Bar component
- [x] Streak counter component
- [x] Leaderboard component

#### Content
- [x] 9 subjects with topics
- [x] Lessons with quiz questions (seeded)
- [x] Premium content lock (Mandarin, Geography, History, ICT)
- [x] Age group targeting (preschool / lower / upper primary)
- [x] Grade-level filtering (Grade 0–6)

#### Subscription / Payments
- [x] Stripe checkout integration
- [x] Stripe billing portal
- [x] Stripe webhook handler
- [x] Subscription plans: Monthly, Annual, Family
- [x] Premium flag on student profile

#### Parent Features
- [x] Parent dashboard (placeholder)

#### Teacher Features
- [x] Teacher dashboard (placeholder)

#### Admin Features
- [x] Admin dashboard (placeholder)

#### Infrastructure
- [x] MongoDB Atlas connection with connection pooling
- [x] Parallel auth + DB calls in server components (performance)
- [x] Docker multi-stage build
- [x] Railway deployment
- [x] PWA (manifest + service worker)
- [x] Database seed script (all 9 subjects + lessons + badges + users)

---

### ⏳ Planned / Not Yet Built

#### Authentication
- [ ] Email verification flow
- [ ] Forgot password / reset password (email via Resend)
- [ ] Remember me / session management UI

#### Student Features
- [ ] Avatar customization UI
- [ ] Daily reward / streak reward claim
- [ ] Lesson video player
- [ ] Interactive story lessons
- [ ] Worksheet download
- [ ] In-app coin/gem shop

#### Parent Features
- [ ] Add/manage children profiles
- [ ] View children's progress reports
- [ ] Set screen time limits
- [ ] Subscription management UI

#### Teacher Features
- [ ] Assign lessons to students
- [ ] Class management
- [ ] Progress reports per class

#### Admin Features
- [ ] User management (CRUD)
- [ ] Content management (add/edit subjects & lessons)
- [ ] Subscription analytics
- [ ] Revenue dashboard

#### Content
- [ ] Real video lesson content
- [ ] Interactive game lessons (beyond quiz)
- [ ] Bahasa Malaysia content expansion
- [ ] Mandarin content expansion

#### Payments
- [ ] Real Stripe product IDs configured
- [ ] Trial period support
- [ ] Family plan child management

#### Other
- [ ] Google OAuth redirect URIs updated to production URL
- [ ] Email sending via Resend (registration, password reset)
- [ ] Push notifications (PWA)
- [ ] Offline mode (service worker caching)

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

---

*End of Document*
