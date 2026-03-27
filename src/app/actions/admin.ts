'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type {
  Profile, Review, Consultation, Resource, FaqItem, CommunityPost,
  ResourceType, ResourceCategory, FaqCategory, ConsultationStatus,
} from '@/types/database'

// ─── Auth guard ───────────────────────────────────────────────────────────────

export async function requireAdmin(): Promise<string> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) throw new Error('Forbidden')
  return user.id
}

// ─── Overview stats ───────────────────────────────────────────────────────────

export type AdminStats = {
  totalUsers:        number
  totalLogs:         number
  pendingReviews:    number
  approvedReviews:   number
  totalConsultations: number
  totalPosts:        number
}

export async function getAdminStats(): Promise<AdminStats> {
  await requireAdmin()
  const db = createAdminClient()

  const [users, logs, pendingReviews, approvedReviews, consultations, posts] = await Promise.all([
    db.from('profiles').select('id', { count: 'exact', head: true }),
    db.from('tracking_logs').select('id', { count: 'exact', head: true }),
    db.from('reviews').select('id', { count: 'exact', head: true }).eq('is_approved', false),
    db.from('reviews').select('id', { count: 'exact', head: true }).eq('is_approved', true),
    db.from('consultations').select('id', { count: 'exact', head: true }),
    db.from('community_posts').select('id', { count: 'exact', head: true }),
  ])

  return {
    totalUsers:         users.count ?? 0,
    totalLogs:          logs.count ?? 0,
    pendingReviews:     pendingReviews.count ?? 0,
    approvedReviews:    approvedReviews.count ?? 0,
    totalConsultations: consultations.count ?? 0,
    totalPosts:         posts.count ?? 0,
  }
}

// ─── Users ────────────────────────────────────────────────────────────────────

export type AdminUser = Profile & { email: string }

export async function getAdminUsers(): Promise<AdminUser[]> {
  await requireAdmin()
  const db = createAdminClient()

  const { data: profiles } = await db
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (!profiles) return []

  const { data: { users: authUsers } } = await db.auth.admin.listUsers({ perPage: 1000 })
  const emailMap = Object.fromEntries(authUsers.map((u) => [u.id, u.email ?? '']))

  return profiles.map((p) => ({ ...p, email: emailMap[p.id] ?? '' }))
}

export async function toggleAdminRole(
  userId: string
): Promise<{ error: string } | { success: true }> {
  await requireAdmin()
  const db = createAdminClient()

  const { data: profile } = await db.from('profiles').select('is_admin').eq('id', userId).single()
  if (!profile) return { error: 'Usuario no encontrado' }

  const { error } = await db
    .from('profiles')
    .update({ is_admin: !profile.is_admin })
    .eq('id', userId)

  if (error) return { error: error.message }
  revalidatePath('/admin/users')
  return { success: true }
}

export async function deleteUser(
  userId: string
): Promise<{ error: string } | { success: true }> {
  await requireAdmin()
  const db = createAdminClient()
  const { error } = await db.auth.admin.deleteUser(userId)
  if (error) return { error: error.message }
  revalidatePath('/admin/users')
  return { success: true }
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export type AdminReview = Review & { author_email: string; author_nickname: string | null }

export async function getAdminReviews(filter: 'pending' | 'approved' | 'all' = 'pending'): Promise<AdminReview[]> {
  await requireAdmin()
  const db = createAdminClient()

  let query = db
    .from('reviews')
    .select('*, profiles!reviews_user_id_fkey(nickname)')
    .order('created_at', { ascending: false })

  if (filter === 'pending')  query = query.eq('is_approved', false)
  if (filter === 'approved') query = query.eq('is_approved', true)

  const { data } = await query
  if (!data) return []

  const userIds = [...new Set(data.map((r: any) => r.user_id))]
  const { data: { users } } = await db.auth.admin.listUsers({ perPage: 1000 })
  const emailMap = Object.fromEntries(users.map((u) => [u.id, u.email ?? '']))

  return data.map((r: any) => ({
    ...r,
    author_email:    emailMap[r.user_id] ?? '',
    author_nickname: r.profiles?.nickname ?? null,
    profiles:        undefined,
  }))
}

export async function setReviewApproval(
  reviewId: string,
  approved: boolean
): Promise<{ error: string } | { success: true }> {
  await requireAdmin()
  const db = createAdminClient()
  const { error } = await db.from('reviews').update({ is_approved: approved }).eq('id', reviewId)
  if (error) return { error: error.message }
  revalidatePath('/admin/reviews')
  return { success: true }
}

export async function setReviewFeatured(
  reviewId: string,
  featured: boolean
): Promise<{ error: string } | { success: true }> {
  await requireAdmin()
  const db = createAdminClient()
  const { error } = await db.from('reviews').update({ is_featured: featured }).eq('id', reviewId)
  if (error) return { error: error.message }
  revalidatePath('/admin/reviews')
  return { success: true }
}

// ─── Consultations ────────────────────────────────────────────────────────────

export type AdminConsultation = Consultation & { user_email: string }

export async function getAdminConsultations(): Promise<AdminConsultation[]> {
  await requireAdmin()
  const db = createAdminClient()

  const { data } = await db
    .from('consultations')
    .select('*')
    .order('date', { ascending: true })

  if (!data) return []

  const { data: { users } } = await db.auth.admin.listUsers({ perPage: 1000 })
  const emailMap = Object.fromEntries(users.map((u) => [u.id, u.email ?? '']))

  return data.map((c: any) => ({ ...c, user_email: emailMap[c.user_id] ?? '' }))
}

export async function updateConsultationStatus(
  consultationId: string,
  status: ConsultationStatus
): Promise<{ error: string } | { success: true }> {
  await requireAdmin()
  const db = createAdminClient()
  const { error } = await db.from('consultations').update({ status }).eq('id', consultationId)
  if (error) return { error: error.message }
  revalidatePath('/admin/consultations')
  return { success: true }
}

// ─── Resources ────────────────────────────────────────────────────────────────

export async function getAdminResources(): Promise<Resource[]> {
  await requireAdmin()
  const db = createAdminClient()
  const { data } = await db.from('resources').select('*').order('sort_order', { ascending: true })
  return data ?? []
}

export async function createResource(formData: FormData): Promise<{ error: string } | { success: true }> {
  await requireAdmin()
  const db = createAdminClient()

  const { error } = await db.from('resources').insert({
    type:           formData.get('type') as ResourceType,
    title_es:       formData.get('title_es')?.toString() ?? '',
    title_en:       formData.get('title_en')?.toString() ?? '',
    description_es: formData.get('description_es')?.toString() || null,
    description_en: formData.get('description_en')?.toString() || null,
    content_url:    formData.get('content_url')?.toString() || null,
    category:       formData.get('category') as ResourceCategory,
    is_premium:     formData.get('is_premium') === 'true',
    sort_order:     parseInt(formData.get('sort_order')?.toString() ?? '99'),
  })

  if (error) return { error: error.message }
  revalidatePath('/admin/resources')
  revalidatePath('/resources')
  return { success: true }
}

export async function updateResource(id: string, formData: FormData): Promise<{ error: string } | { success: true }> {
  await requireAdmin()
  const db = createAdminClient()

  const { error } = await db.from('resources').update({
    type:           formData.get('type') as ResourceType,
    title_es:       formData.get('title_es')?.toString() ?? '',
    title_en:       formData.get('title_en')?.toString() ?? '',
    description_es: formData.get('description_es')?.toString() || null,
    description_en: formData.get('description_en')?.toString() || null,
    content_url:    formData.get('content_url')?.toString() || null,
    category:       formData.get('category') as ResourceCategory,
    is_premium:     formData.get('is_premium') === 'true',
    sort_order:     parseInt(formData.get('sort_order')?.toString() ?? '99'),
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/resources')
  revalidatePath('/resources')
  return { success: true }
}

export async function deleteResource(id: string): Promise<{ error: string } | { success: true }> {
  await requireAdmin()
  const db = createAdminClient()
  const { error } = await db.from('resources').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/resources')
  revalidatePath('/resources')
  return { success: true }
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export async function getAdminFaq(): Promise<FaqItem[]> {
  await requireAdmin()
  const db = createAdminClient()
  const { data } = await db.from('faq_items').select('*').order('sort_order', { ascending: true })
  return data ?? []
}

export async function createFaqItem(formData: FormData): Promise<{ error: string } | { success: true }> {
  await requireAdmin()
  const db = createAdminClient()

  const { error } = await db.from('faq_items').insert({
    question_es: formData.get('question_es')?.toString() ?? '',
    question_en: formData.get('question_en')?.toString() ?? '',
    answer_es:   formData.get('answer_es')?.toString() ?? '',
    answer_en:   formData.get('answer_en')?.toString() ?? '',
    category:    formData.get('category') as FaqCategory,
    sort_order:  parseInt(formData.get('sort_order')?.toString() ?? '99'),
  })

  if (error) return { error: error.message }
  revalidatePath('/admin/faq')
  revalidatePath('/faq')
  return { success: true }
}

export async function updateFaqItem(id: string, formData: FormData): Promise<{ error: string } | { success: true }> {
  await requireAdmin()
  const db = createAdminClient()

  const { error } = await db.from('faq_items').update({
    question_es: formData.get('question_es')?.toString() ?? '',
    question_en: formData.get('question_en')?.toString() ?? '',
    answer_es:   formData.get('answer_es')?.toString() ?? '',
    answer_en:   formData.get('answer_en')?.toString() ?? '',
    category:    formData.get('category') as FaqCategory,
    sort_order:  parseInt(formData.get('sort_order')?.toString() ?? '99'),
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/faq')
  revalidatePath('/faq')
  return { success: true }
}

export async function deleteFaqItem(id: string): Promise<{ error: string } | { success: true }> {
  await requireAdmin()
  const db = createAdminClient()
  const { error } = await db.from('faq_items').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/faq')
  revalidatePath('/faq')
  return { success: true }
}

// ─── Community ────────────────────────────────────────────────────────────────

export type AdminPost = CommunityPost & { author_email: string; author_nickname: string | null }

export async function getAdminPosts(): Promise<AdminPost[]> {
  await requireAdmin()
  const db = createAdminClient()

  const { data } = await db
    .from('community_posts')
    .select('*, profiles!community_posts_user_id_fkey(nickname)')
    .order('created_at', { ascending: false })

  if (!data) return []

  const { data: { users } } = await db.auth.admin.listUsers({ perPage: 1000 })
  const emailMap = Object.fromEntries(users.map((u) => [u.id, u.email ?? '']))

  return data.map((p: any) => ({
    ...p,
    author_email:    emailMap[p.user_id] ?? '',
    author_nickname: p.profiles?.nickname ?? null,
    profiles:        undefined,
  }))
}

export async function pinPost(postId: string, pinned: boolean): Promise<{ error: string } | { success: true }> {
  await requireAdmin()
  const db = createAdminClient()
  const { error } = await db.from('community_posts').update({ is_pinned: pinned }).eq('id', postId)
  if (error) return { error: error.message }
  revalidatePath('/admin/community')
  revalidatePath('/community')
  return { success: true }
}

export async function deletePost(postId: string): Promise<{ error: string } | { success: true }> {
  await requireAdmin()
  const db = createAdminClient()
  // Delete comments first
  await db.from('community_comments').delete().eq('post_id', postId)
  const { error } = await db.from('community_posts').delete().eq('id', postId)
  if (error) return { error: error.message }
  revalidatePath('/admin/community')
  revalidatePath('/community')
  return { success: true }
}
