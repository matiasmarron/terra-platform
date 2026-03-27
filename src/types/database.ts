// Auto-generate this file in the future with:
// npx supabase gen types typescript --local > src/types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------
export type Language = 'es' | 'en'

export type ReviewType = 'written' | 'video' | 'checkin'

export type CommunityPostCategory = 'question' | 'reflection' | 'routine' | 'feedback'

export type ResourceType =
  | 'meditation'
  | 'breathwork'
  | 'ritual'
  | 'video'
  | 'audio'
  | 'guide'
  | 'checklist'
  | 'course'

export type ResourceCategory =
  | 'before_starting'
  | 'during_cycle'
  | 'difficult_moments'
  | 'integration'
  | 'daily_life'

export type PaymentProvider = 'stripe' | 'mercadopago'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'
export type PaymentType = 'consultation' | 'subscription' | 'course'

export type ConsultationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export type FaqCategory = 'practical' | 'emotional' | 'process' | 'safety'

export type RewardType = 'discount' | 'free_shipping' | 'premium_content' | 'badge'

// ---------------------------------------------------------------------------
// Row types (what you get back from SELECT)
// ---------------------------------------------------------------------------
export type Profile = {
  id: string
  nickname: string | null
  display_name: string | null
  avatar_url: string | null
  language: Language
  timezone: string | null
  onboarding_completed: boolean
  is_admin: boolean
  created_at: string
  updated_at: string
}

export type TrackingLog = {
  id: string
  user_id: string
  date: string
  mood: number | null
  energy: number | null
  sleep_quality: number | null
  focus: number | null
  calm: number | null
  notes: string | null
  routine_followed: boolean | null
  resource_used: string | null
  created_at: string
}

export type Review = {
  id: string
  user_id: string
  type: ReviewType
  title: string | null
  body: string | null
  video_url: string | null
  rating: number | null
  what_changed: string | null
  when_it_changed: string | null
  what_was_hardest: string | null
  what_helped_most: string | null
  routine_description: string | null
  is_approved: boolean
  is_featured: boolean
  created_at: string
}

export type CommunityPost = {
  id: string
  user_id: string
  category: CommunityPostCategory
  title: string
  body: string
  is_pinned: boolean
  created_at: string
}

export type CommunityComment = {
  id: string
  post_id: string
  user_id: string
  body: string
  created_at: string
}

export type Resource = {
  id: string
  type: ResourceType
  title_es: string
  title_en: string
  description_es: string | null
  description_en: string | null
  content_url: string | null
  thumbnail_url: string | null
  category: ResourceCategory
  is_premium: boolean
  sort_order: number | null
  created_at: string
}

export type Course = {
  id: string
  title_es: string
  title_en: string
  description_es: string | null
  description_en: string | null
  thumbnail_url: string | null
  is_premium: boolean
  sort_order: number | null
  created_at: string
}

export type CourseModule = {
  id: string
  course_id: string
  resource_id: string
  sort_order: number
}

export type UserCourseProgress = {
  id: string
  user_id: string
  course_id: string
  module_id: string
  completed: boolean
  completed_at: string | null
}

export type Consultation = {
  id: string
  user_id: string
  date: string
  duration_minutes: number
  status: ConsultationStatus
  notes: string | null
  payment_id: string | null
  created_at: string
}

export type Payment = {
  id: string
  user_id: string
  provider: PaymentProvider
  provider_payment_id: string | null
  amount: number
  currency: string
  status: PaymentStatus
  type: PaymentType
  created_at: string
}

export type FaqItem = {
  id: string
  question_es: string
  question_en: string
  answer_es: string
  answer_en: string
  category: FaqCategory
  sort_order: number | null
  created_at: string
}

export type ReviewReward = {
  id: string
  user_id: string
  review_id: string
  reward_type: RewardType
  reward_value: string | null
  redeemed: boolean
  created_at: string
}

// ---------------------------------------------------------------------------
// Insert types (what you pass to INSERT — omit generated fields)
// ---------------------------------------------------------------------------
export type TrackingLogInsert = Omit<TrackingLog, 'id' | 'created_at'>
export type ReviewInsert = Omit<Review, 'id' | 'is_approved' | 'is_featured' | 'created_at'>
export type CommunityPostInsert = Omit<CommunityPost, 'id' | 'is_pinned' | 'created_at'>
export type CommunityCommentInsert = Omit<CommunityComment, 'id' | 'created_at'>
export type UserCourseProgressInsert = Omit<UserCourseProgress, 'id'>
export type ConsultationInsert = Omit<Consultation, 'id' | 'created_at'>
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
