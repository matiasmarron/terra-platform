'use server'

import { createClient } from '@/lib/supabase/server'
import type { Consultation } from '@/types/database'

export type ConsultationWithPayment = Consultation & {
  payment_provider?: string | null
}

export async function getMyConsultations(): Promise<ConsultationWithPayment[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('consultations')
    .select('*, payments(provider)')
    .eq('user_id', user.id)
    .order('date', { ascending: true })

  if (error) return []

  return (data ?? []).map((row: any) => ({
    ...row,
    payment_provider: row.payments?.provider ?? null,
    payments:         undefined,
  }))
}
