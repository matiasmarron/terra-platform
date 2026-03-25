-- =============================================================================
-- Terra Platform — Row Level Security Policies
-- =============================================================================
-- Convention:
--   "own"    = authenticated user owns the row (user_id = auth.uid())
--   "auth"   = any authenticated user
--   "public" = anyone, including anonymous
--   "admin"  = service role only (no policy needed — service role bypasses RLS)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- PROFILES
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;

create policy "profiles: users can view own profile"
  on public.profiles for select
  using (id = auth.uid());

create policy "profiles: users can update own profile"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- Insert is handled by the handle_new_user trigger (security definer)
-- No direct insert policy needed for regular users.

-- ---------------------------------------------------------------------------
-- TRACKING LOGS
-- ---------------------------------------------------------------------------
alter table public.tracking_logs enable row level security;

create policy "tracking_logs: users can view own logs"
  on public.tracking_logs for select
  using (user_id = auth.uid());

create policy "tracking_logs: users can insert own logs"
  on public.tracking_logs for insert
  with check (user_id = auth.uid());

create policy "tracking_logs: users can update own logs"
  on public.tracking_logs for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "tracking_logs: users can delete own logs"
  on public.tracking_logs for delete
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- REVIEWS
-- ---------------------------------------------------------------------------
alter table public.reviews enable row level security;

-- Any authenticated user can read approved reviews (social proof / growth loop)
create policy "reviews: authenticated users can view approved reviews"
  on public.reviews for select
  using (
    auth.role() = 'authenticated'
    and (is_approved = true or user_id = auth.uid())
  );

create policy "reviews: users can insert own reviews"
  on public.reviews for insert
  with check (user_id = auth.uid());

create policy "reviews: users can update own unnapproved reviews"
  on public.reviews for update
  using (user_id = auth.uid() and is_approved = false)
  with check (user_id = auth.uid());

-- Deletion only by service role (admin action)

-- ---------------------------------------------------------------------------
-- COMMUNITY POSTS
-- ---------------------------------------------------------------------------
alter table public.community_posts enable row level security;

create policy "community_posts: authenticated users can view all posts"
  on public.community_posts for select
  using (auth.role() = 'authenticated');

create policy "community_posts: users can insert own posts"
  on public.community_posts for insert
  with check (user_id = auth.uid());

create policy "community_posts: users can update own posts"
  on public.community_posts for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "community_posts: users can delete own posts"
  on public.community_posts for delete
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- COMMUNITY COMMENTS
-- ---------------------------------------------------------------------------
alter table public.community_comments enable row level security;

create policy "community_comments: authenticated users can view all comments"
  on public.community_comments for select
  using (auth.role() = 'authenticated');

create policy "community_comments: users can insert own comments"
  on public.community_comments for insert
  with check (user_id = auth.uid());

create policy "community_comments: users can update own comments"
  on public.community_comments for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "community_comments: users can delete own comments"
  on public.community_comments for delete
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- RESOURCES
-- ---------------------------------------------------------------------------
alter table public.resources enable row level security;

-- Free resources readable by all authenticated users
-- Premium resources also readable by authenticated users for now
-- (access control for premium gating can be layered in Phase 2)
create policy "resources: authenticated users can view all resources"
  on public.resources for select
  using (auth.role() = 'authenticated');

-- Write operations only via service role (admin)

-- ---------------------------------------------------------------------------
-- COURSES
-- ---------------------------------------------------------------------------
alter table public.courses enable row level security;

create policy "courses: authenticated users can view all courses"
  on public.courses for select
  using (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- COURSE MODULES
-- ---------------------------------------------------------------------------
alter table public.course_modules enable row level security;

create policy "course_modules: authenticated users can view all modules"
  on public.course_modules for select
  using (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- USER COURSE PROGRESS
-- ---------------------------------------------------------------------------
alter table public.user_course_progress enable row level security;

create policy "user_course_progress: users can view own progress"
  on public.user_course_progress for select
  using (user_id = auth.uid());

create policy "user_course_progress: users can insert own progress"
  on public.user_course_progress for insert
  with check (user_id = auth.uid());

create policy "user_course_progress: users can update own progress"
  on public.user_course_progress for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- CONSULTATIONS
-- ---------------------------------------------------------------------------
alter table public.consultations enable row level security;

create policy "consultations: users can view own consultations"
  on public.consultations for select
  using (user_id = auth.uid());

create policy "consultations: users can insert own consultations"
  on public.consultations for insert
  with check (user_id = auth.uid());

-- Updates (confirm/cancel) handled by service role or specific policies below
create policy "consultations: users can cancel own pending consultations"
  on public.consultations for update
  using (user_id = auth.uid() and status = 'pending')
  with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- PAYMENTS
-- ---------------------------------------------------------------------------
alter table public.payments enable row level security;

create policy "payments: users can view own payments"
  on public.payments for select
  using (user_id = auth.uid());

-- Inserts and updates handled by service role (Stripe/MP webhooks)

-- ---------------------------------------------------------------------------
-- FAQ ITEMS
-- Readable by everyone — used on the public landing page too
-- ---------------------------------------------------------------------------
alter table public.faq_items enable row level security;

create policy "faq_items: anyone can view faq items"
  on public.faq_items for select
  using (true);

-- Write operations only via service role (admin)

-- ---------------------------------------------------------------------------
-- REVIEW REWARDS
-- ---------------------------------------------------------------------------
alter table public.review_rewards enable row level security;

create policy "review_rewards: users can view own rewards"
  on public.review_rewards for select
  using (user_id = auth.uid());

-- Rewards are created by service role when a review is approved
-- No insert/update policy for regular users
