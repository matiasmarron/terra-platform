'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Profile, ProfileUpdate } from '@/types/database'

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) return null
  return data
}

export async function updateProfile(
  formData: FormData
): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const update: ProfileUpdate = {
    display_name: formData.get('display_name')?.toString().trim() || null,
    nickname:     formData.get('nickname')?.toString().trim() || null,
    language:     (formData.get('language')?.toString() as 'es' | 'en') || 'es',
  }

  const { error } = await supabase
    .from('profiles')
    .update(update)
    .eq('id', user.id)

  if (error) {
    if (error.code === '23505') return { error: 'Ese apodo ya está en uso. Elegí otro.' }
    return { error: error.message }
  }

  revalidatePath('/settings')
  return { success: true }
}
