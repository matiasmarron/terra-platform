'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Review, ReviewReward } from '@/types/database'

export async function submitReview(
  formData: FormData
): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const title             = formData.get('title')?.toString().trim() ?? ''
  const body              = formData.get('body')?.toString().trim() ?? ''
  const what_changed      = formData.get('what_changed')?.toString().trim() ?? null
  const when_it_changed   = formData.get('when_it_changed')?.toString().trim() ?? null
  const what_was_hardest  = formData.get('what_was_hardest')?.toString().trim() ?? null
  const what_helped_most  = formData.get('what_helped_most')?.toString().trim() ?? null
  const routine_description = formData.get('routine_description')?.toString().trim() ?? null
  const ratingRaw         = formData.get('rating')?.toString()
  const rating            = ratingRaw ? parseInt(ratingRaw) : null

  if (!title || !body) return { error: 'El título y la experiencia son obligatorios.' }

  const { error } = await supabase.from('reviews').insert({
    user_id:              user.id,
    type:                 'written',
    title,
    body,
    what_changed:         what_changed || null,
    when_it_changed:      when_it_changed || null,
    what_was_hardest:     what_was_hardest || null,
    what_helped_most:     what_helped_most || null,
    routine_description:  routine_description || null,
    rating,
    is_approved:          false,
    is_featured:          false,
  })

  if (error) return { error: error.message }

  revalidatePath('/reviews')
  return { success: true }
}

export async function getMyReviews(): Promise<Review[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return []
  return data ?? []
}

export async function getMyRewards(): Promise<ReviewReward[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('review_rewards')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return []
  return data ?? []
}

export async function redeemReward(
  rewardId: string
): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('review_rewards')
    .update({ redeemed: true })
    .eq('id', rewardId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/reviews')
  return { success: true }
}
