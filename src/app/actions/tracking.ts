'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { TrackingLog } from '@/types/database'

function today(): string {
  return new Date().toISOString().split('T')[0]
}

// ─── Save / upsert today's log ────────────────────────────────────────────────

export async function saveTrackingLog(
  formData: FormData
): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) return { error: 'No autenticado.' }

  const routineValue = formData.get('routine_followed')

  const payload = {
    user_id:          user.id,
    date:             today(),
    mood:             Number(formData.get('mood'))          || null,
    energy:           Number(formData.get('energy'))        || null,
    sleep_quality:    Number(formData.get('sleep_quality')) || null,
    focus:            Number(formData.get('focus'))         || null,
    calm:             Number(formData.get('calm'))          || null,
    notes:            (formData.get('notes') as string)?.trim() || null,
    routine_followed: routineValue === 'true' ? true : routineValue === 'false' ? false : null,
    resource_used:    (formData.get('resource_used') as string)?.trim() || null,
  }

  const { error } = await supabase
    .from('tracking_logs')
    .upsert(payload, { onConflict: 'user_id,date' })

  if (error) return { error: error.message }

  revalidatePath('/tracking')
  return { success: true }
}

// ─── Fetch today's log ────────────────────────────────────────────────────────

export async function getTodayLog(): Promise<TrackingLog | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('tracking_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', today())
    .maybeSingle()

  return data
}

// ─── Fetch recent logs ────────────────────────────────────────────────────────

export async function getRecentLogs(days = 7): Promise<TrackingLog[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const since = new Date()
  since.setDate(since.getDate() - days)

  const { data } = await supabase
    .from('tracking_logs')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', since.toISOString().split('T')[0])
    .order('date', { ascending: false })

  return data ?? []
}
