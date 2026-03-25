-- =============================================================================
-- Terra Platform — Initial Schema
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helper: auto-update updated_at column
-- ---------------------------------------------------------------------------
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- =============================================================================
-- PROFILES
-- Extended data for auth.users
-- =============================================================================
create table public.profiles (
  id                    uuid primary key references auth.users on delete cascade,
  nickname              text unique,
  display_name          text,
  avatar_url            text,
  language              text not null default 'es' check (language in ('es', 'en')),
  timezone              text,
  onboarding_completed  boolean not null default false,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function handle_updated_at();

-- Auto-create a profile row whenever a new user signs up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- =============================================================================
-- PAYMENTS
-- Created before consultations (consultations references this table)
-- =============================================================================
create table public.payments (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.profiles on delete cascade,
  provider            text not null check (provider in ('stripe', 'mercadopago')),
  provider_payment_id text,
  amount              numeric(10, 2) not null,
  currency            text not null,
  status              text not null default 'pending'
                        check (status in ('pending', 'completed', 'failed', 'refunded')),
  type                text not null
                        check (type in ('consultation', 'subscription', 'course')),
  created_at          timestamptz not null default now()
);

create index payments_user_id_idx on public.payments (user_id);
create index payments_status_idx  on public.payments (status);

-- =============================================================================
-- TRACKING LOGS
-- One check-in entry per user per day
-- =============================================================================
create table public.tracking_logs (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles on delete cascade,
  date             date not null,
  mood             integer check (mood between 1 and 5),
  energy           integer check (energy between 1 and 5),
  sleep_quality    integer check (sleep_quality between 1 and 5),
  focus            integer check (focus between 1 and 5),
  calm             integer check (calm between 1 and 5),
  notes            text,
  routine_followed boolean,
  resource_used    text,
  created_at       timestamptz not null default now(),
  unique (user_id, date)
);

create index tracking_logs_user_id_date_idx on public.tracking_logs (user_id, date desc);

-- =============================================================================
-- REVIEWS
-- Written, video, or quick check-in style. Core growth loop.
-- =============================================================================
create table public.reviews (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references public.profiles on delete cascade,
  type                 text not null check (type in ('written', 'video', 'checkin')),
  title                text,
  body                 text,
  video_url            text,
  rating               integer check (rating between 1 and 5),
  what_changed         text,
  when_it_changed      text,
  what_was_hardest     text,
  what_helped_most     text,
  routine_description  text,
  is_approved          boolean not null default false,
  is_featured          boolean not null default false,
  created_at           timestamptz not null default now()
);

create index reviews_user_id_idx   on public.reviews (user_id);
create index reviews_approved_idx  on public.reviews (is_approved, is_featured);

-- =============================================================================
-- COMMUNITY POSTS
-- =============================================================================
create table public.community_posts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles on delete cascade,
  category   text not null
               check (category in ('question', 'reflection', 'routine', 'feedback')),
  title      text not null,
  body       text not null,
  is_pinned  boolean not null default false,
  created_at timestamptz not null default now()
);

create index community_posts_user_id_idx  on public.community_posts (user_id);
create index community_posts_category_idx on public.community_posts (category);

-- =============================================================================
-- COMMUNITY COMMENTS
-- =============================================================================
create table public.community_comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.community_posts on delete cascade,
  user_id    uuid not null references public.profiles on delete cascade,
  body       text not null,
  created_at timestamptz not null default now()
);

create index community_comments_post_id_idx on public.community_comments (post_id);
create index community_comments_user_id_idx on public.community_comments (user_id);

-- =============================================================================
-- RESOURCES
-- Meditations, audios, guides, etc.
-- =============================================================================
create table public.resources (
  id              uuid primary key default gen_random_uuid(),
  type            text not null
                    check (type in (
                      'meditation', 'breathwork', 'ritual',
                      'video', 'audio', 'guide', 'checklist', 'course'
                    )),
  title_es        text not null,
  title_en        text not null,
  description_es  text,
  description_en  text,
  content_url     text,
  thumbnail_url   text,
  category        text not null
                    check (category in (
                      'before_starting', 'during_cycle',
                      'difficult_moments', 'integration', 'daily_life'
                    )),
  is_premium      boolean not null default false,
  sort_order      integer,
  created_at      timestamptz not null default now()
);

create index resources_type_idx     on public.resources (type);
create index resources_category_idx on public.resources (category);

-- =============================================================================
-- COURSES
-- =============================================================================
create table public.courses (
  id              uuid primary key default gen_random_uuid(),
  title_es        text not null,
  title_en        text not null,
  description_es  text,
  description_en  text,
  thumbnail_url   text,
  is_premium      boolean not null default false,
  sort_order      integer,
  created_at      timestamptz not null default now()
);

-- =============================================================================
-- COURSE MODULES
-- Ordered list of resources within a course
-- =============================================================================
create table public.course_modules (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid not null references public.courses on delete cascade,
  resource_id uuid not null references public.resources on delete cascade,
  sort_order  integer not null default 0,
  unique (course_id, resource_id)
);

create index course_modules_course_id_idx on public.course_modules (course_id, sort_order);

-- =============================================================================
-- USER COURSE PROGRESS
-- =============================================================================
create table public.user_course_progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles on delete cascade,
  course_id    uuid not null references public.courses on delete cascade,
  module_id    uuid not null references public.course_modules on delete cascade,
  completed    boolean not null default false,
  completed_at timestamptz,
  unique (user_id, module_id)
);

create index user_course_progress_user_id_idx on public.user_course_progress (user_id, course_id);

-- =============================================================================
-- CONSULTATIONS
-- 1:1 booking system
-- =============================================================================
create table public.consultations (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles on delete cascade,
  date             timestamptz not null,
  duration_minutes integer not null default 60,
  status           text not null default 'pending'
                     check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  notes            text,
  payment_id       uuid references public.payments on delete set null,
  created_at       timestamptz not null default now()
);

create index consultations_user_id_idx on public.consultations (user_id);
create index consultations_date_idx    on public.consultations (date);
create index consultations_status_idx  on public.consultations (status);

-- =============================================================================
-- FAQ ITEMS
-- =============================================================================
create table public.faq_items (
  id           uuid primary key default gen_random_uuid(),
  question_es  text not null,
  question_en  text not null,
  answer_es    text not null,
  answer_en    text not null,
  category     text not null
                 check (category in ('practical', 'emotional', 'process', 'safety')),
  sort_order   integer,
  created_at   timestamptz not null default now()
);

create index faq_items_category_idx on public.faq_items (category, sort_order);

-- =============================================================================
-- REVIEW REWARDS
-- Incentives for submitting reviews
-- =============================================================================
create table public.review_rewards (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles on delete cascade,
  review_id    uuid not null references public.reviews on delete cascade,
  reward_type  text not null
                 check (reward_type in (
                   'discount', 'free_shipping', 'premium_content', 'badge'
                 )),
  reward_value text,
  redeemed     boolean not null default false,
  created_at   timestamptz not null default now(),
  unique (review_id)  -- one reward per review
);

create index review_rewards_user_id_idx on public.review_rewards (user_id);
