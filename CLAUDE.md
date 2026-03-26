# CLAUDE.md — Terra Platform

## What is this project?

Terra is a hybrid platform (website + web app) for guided microdosing experiences. It combines education, personal tracking, community, reviews, resources, and consultations into a single product. The platform is human-centered, practical, and emotionally safe — not clinical or academic.

The long-term advantage is the combination of: education + tracking + user-generated insight + community trust.

---

## Tech Stack

- **Frontend:** Next.js 14+ (App Router)
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Hosting:** Vercel
- **Payments:** Stripe (international) + Mercado Pago (LATAM)
- **Email:** Resend (transactional emails)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Repo:** GitHub (`terra-platform`)

---

## Project Structure

```
terra-platform/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (public)/           # Public website (landing, about, FAQ)
│   │   ├── (auth)/             # Login, register, forgot password
│   │   ├── (dashboard)/        # Private member area
│   │   │   ├── tracking/       # Daily logs, mood, energy, sleep
│   │   │   ├── resources/      # Meditations, audios, rituals, courses
│   │   │   ├── community/      # Nickname-based posts and comments
│   │   │   ├── reviews/        # Written + video reviews
│   │   │   ├── consultations/  # Booking system for 1:1 calls
│   │   │   └── settings/       # Profile, preferences, language
│   │   └── api/                # API routes
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── forms/              # Form components
│   │   └── layout/             # Header, footer, sidebar, nav
│   ├── lib/
│   │   ├── supabase/           # Supabase client, server, middleware
│   │   ├── stripe/             # Stripe helpers
│   │   ├── mercadopago/        # Mercado Pago helpers
│   │   └── utils/              # General utilities
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript type definitions
│   └── i18n/                   # Internationalization (ES/EN)
│       ├── es/                 # Spanish translations (primary)
│       └── en/                 # English translations
├── supabase/
│   ├── migrations/             # SQL migration files
│   └── seed.sql                # Seed data for development
├── public/                     # Static assets
├── CLAUDE.md                   # This file
└── docs/
    ├── blueprint.md            # Technical blueprint
    └── knowledge-system.md     # Content & experience direction
```

---

## Database Schema (Supabase / PostgreSQL)

### Core Tables

```sql
-- Users are managed by Supabase Auth (auth.users)

-- Extended user profiles
profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  nickname text UNIQUE,          -- For community (not real name)
  display_name text,
  avatar_url text,
  language text DEFAULT 'es',    -- 'es' or 'en'
  timezone text,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz,
  updated_at timestamptz
)

-- Daily tracking / check-ins
tracking_logs (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles,
  date date,
  mood integer CHECK (1-5),
  energy integer CHECK (1-5),
  sleep_quality integer CHECK (1-5),
  focus integer CHECK (1-5),
  calm integer CHECK (1-5),
  notes text,
  routine_followed boolean,
  resource_used text,            -- Which resource helped today
  created_at timestamptz,
  UNIQUE(user_id, date)          -- One entry per day
)

-- Reviews (core growth loop)
reviews (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles,
  type text CHECK ('written', 'video', 'checkin'),
  title text,
  body text,
  video_url text,                -- Supabase Storage path
  rating integer CHECK (1-5),
  what_changed text,
  when_it_changed text,
  what_was_hardest text,
  what_helped_most text,
  routine_description text,
  is_approved boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  created_at timestamptz
)

-- Community posts
community_posts (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles,
  category text,                 -- 'question', 'reflection', 'routine', 'feedback'
  title text,
  body text,
  is_pinned boolean DEFAULT false,
  created_at timestamptz
)

-- Community comments
community_comments (
  id uuid PRIMARY KEY,
  post_id uuid REFERENCES community_posts,
  user_id uuid REFERENCES profiles,
  body text,
  created_at timestamptz
)

-- Resource library
resources (
  id uuid PRIMARY KEY,
  type text,                     -- 'meditation', 'breathwork', 'ritual', 'video', 'audio', 'guide', 'checklist', 'course'
  title_es text,
  title_en text,
  description_es text,
  description_en text,
  content_url text,              -- Supabase Storage path
  thumbnail_url text,
  category text,                 -- 'before_starting', 'during_cycle', 'difficult_moments', 'integration', 'daily_life'
  is_premium boolean DEFAULT false,
  sort_order integer,
  created_at timestamptz
)

-- Courses (structured learning paths)
courses (
  id uuid PRIMARY KEY,
  title_es text,
  title_en text,
  description_es text,
  description_en text,
  thumbnail_url text,
  is_premium boolean DEFAULT false,
  sort_order integer,
  created_at timestamptz
)

course_modules (
  id uuid PRIMARY KEY,
  course_id uuid REFERENCES courses,
  resource_id uuid REFERENCES resources,
  sort_order integer
)

-- User progress on courses
user_course_progress (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles,
  course_id uuid REFERENCES courses,
  module_id uuid REFERENCES course_modules,
  completed boolean DEFAULT false,
  completed_at timestamptz
)

-- Consultations (1:1 booking)
consultations (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles,
  date timestamptz,
  duration_minutes integer DEFAULT 60,
  status text DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  notes text,
  payment_id uuid REFERENCES payments,
  created_at timestamptz
)

-- Payments
payments (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles,
  provider text,                 -- 'stripe' or 'mercadopago'
  provider_payment_id text,
  amount decimal,
  currency text,
  status text,                   -- 'pending', 'completed', 'failed', 'refunded'
  type text,                     -- 'consultation', 'subscription', 'course'
  created_at timestamptz
)

-- FAQ
faq_items (
  id uuid PRIMARY KEY,
  question_es text,
  question_en text,
  answer_es text,
  answer_en text,
  category text,                 -- 'practical', 'emotional', 'process', 'safety'
  sort_order integer,
  created_at timestamptz
)

-- Review rewards
review_rewards (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles,
  review_id uuid REFERENCES reviews,
  reward_type text,              -- 'discount', 'free_shipping', 'premium_content', 'badge'
  reward_value text,
  redeemed boolean DEFAULT false,
  created_at timestamptz
)
```

### Row Level Security (RLS)

All tables must have RLS enabled. General rules:
- Users can read their own data
- Users can insert their own data
- Community posts/comments are readable by all authenticated users
- Reviews (approved) are readable by all
- Resources are readable by all authenticated users
- Admin operations require a separate admin role

---

## Development Phases

### Phase 1: Foundation ✅
- [x] Project setup (Next.js + Supabase + Vercel)
- [x] Database schema + migrations
- [x] Auth system (email/password, Supabase Auth)
- [x] Public landing page (ES, responsive)
- [x] Private dashboard layout
- [x] Basic tracking/check-in system
- [x] i18n setup (ES primary, EN structure ready)
- [x] Deploy to Vercel

### Phase 2: Content & Reviews
- [ ] Resource library (upload, categorize, display)
- [ ] Course system with progress tracking
- [ ] Review submission (written + video upload)
- [ ] Review approval flow
- [ ] Reward system for reviews
- [ ] FAQ section

### Phase 3: Community & Data
- [ ] Community posts and comments
- [ ] Nickname-based profiles
- [ ] Collaborative statistics dashboard
- [ ] Pattern analysis from tracking data
- [ ] Consultation booking system
- [ ] Payment integration (Stripe + Mercado Pago)

### Phase 4: Polish & Mobile
- [ ] Advanced analytics and insights
- [ ] AI-powered recommendations
- [ ] Email notifications (Resend)
- [ ] Mobile app (React Native)

---

## Coding Conventions

- **Language:** TypeScript strict mode
- **Components:** Functional components with hooks, no class components
- **Naming:** camelCase for variables/functions, PascalCase for components, snake_case for DB columns
- **Files:** kebab-case for file names
- **Imports:** Use `@/` alias for src/ directory
- **Error handling:** Always handle Supabase errors explicitly
- **Auth:** Use Supabase SSR helpers for server components, client helpers for client components
- **Styles:** Tailwind CSS utility classes, no custom CSS unless absolutely necessary
- **i18n:** All user-facing text must use translation keys, never hardcoded strings

---

## Design Direction

- Warm, grounded, and calm — not flashy or clinical
- Earth tones, natural palette
- Clean typography, generous whitespace
- Mobile-first responsive design
- The user should feel accompanied, not managed
- Simple language, short modules, visible progress
- Reviews and user stories should feel central and prominent

---

## Content Categories (for resources, FAQs, and reviews)

1. Before starting
2. During the cycle
3. Difficult moments
4. Integration and reflection
5. Daily life questions
6. Community stories
7. Common mistakes
8. How to use resources
9. What to track and why

---

## Key Principles

1. **Privacy first:** Nicknames for community, no real names required
2. **Reviews are a growth loop:** Not an add-on, they are central to the platform
3. **Bilingual from day one:** ES is primary, but all structures support EN
4. **Data as insight:** Every repeated user answer can become a future community insight
5. **Modular content:** New resources, FAQs, and insights can be added without breaking anything
6. **Community feels like a guided circle:** Not a chaotic public feed

---

## Git Workflow

- `main` — production (auto-deploys to Vercel)
- `dev` — development branch
- Feature branches: `feature/auth-system`, `feature/tracking-ui`, etc.
- All changes via Pull Requests
- Commit messages: conventional commits (`feat:`, `fix:`, `chore:`, `docs:`)

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=

# Resend
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=
```

---

## Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npx supabase start   # Start local Supabase
npx supabase db push # Push migrations to Supabase
```
