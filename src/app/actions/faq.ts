'use server'

import { createClient } from '@/lib/supabase/server'
import type { FaqItem } from '@/types/database'

export async function getFaqItems(category?: string): Promise<FaqItem[]> {
  const supabase = await createClient()

  let query = supabase
    .from('faq_items')
    .select('*')
    .order('sort_order', { ascending: true })

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  if (error) return []
  return data ?? []
}
