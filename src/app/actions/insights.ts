'use server'

import { createClient } from '@/lib/supabase/server'
import type { TrackingLog } from '@/types/database'

export type MetricKey = 'mood' | 'energy' | 'sleep_quality' | 'focus' | 'calm'

export type MetricStat = {
  key:     MetricKey
  average: number
  trend:   'up' | 'down' | 'stable'
  data:    { date: string; value: number }[]
}

export type InsightsData = {
  logs:         TrackingLog[]
  stats:        MetricStat[]
  daysLogged:   number
  routineRate:  number
  bestDay:      string | null
}

const METRIC_KEYS: MetricKey[] = ['mood', 'energy', 'sleep_quality', 'focus', 'calm']

export async function getInsights(days = 30): Promise<InsightsData> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { logs: [], stats: [], daysLogged: 0, routineRate: 0, bestDay: null }

  const since = new Date()
  since.setDate(since.getDate() - days)

  const { data, error } = await supabase
    .from('tracking_logs')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', since.toISOString().split('T')[0])
    .order('date', { ascending: true })

  const logs = error ? [] : (data ?? [])
  if (logs.length < 3) return { logs, stats: [], daysLogged: logs.length, routineRate: 0, bestDay: null }

  // Calculate per-metric stats
  const stats: MetricStat[] = METRIC_KEYS.map((key) => {
    const points = logs
      .filter((l) => l[key] !== null)
      .map((l) => ({ date: l.date, value: l[key] as number }))

    if (points.length === 0) return { key, average: 0, trend: 'stable', data: [] }

    const average = points.reduce((s, p) => s + p.value, 0) / points.length

    // Trend: compare first half vs second half
    const mid   = Math.floor(points.length / 2)
    const first = points.slice(0, mid).reduce((s, p) => s + p.value, 0) / (mid || 1)
    const last  = points.slice(mid).reduce((s, p) => s + p.value, 0) / (points.length - mid || 1)
    const diff  = last - first
    const trend = diff > 0.3 ? 'up' : diff < -0.3 ? 'down' : 'stable'

    return { key, average, trend, data: points }
  })

  // Routine rate
  const withRoutine = logs.filter((l) => l.routine_followed !== null)
  const routineRate = withRoutine.length > 0
    ? Math.round((withRoutine.filter((l) => l.routine_followed).length / withRoutine.length) * 100)
    : 0

  // Best day: highest sum of all metrics
  let bestDay: string | null = null
  let bestScore = -1
  for (const log of logs) {
    const values = METRIC_KEYS.map((k) => log[k] ?? 0)
    const score  = values.reduce((a, b) => a + b, 0)
    if (score > bestScore) { bestScore = score; bestDay = log.date }
  }

  return { logs, stats, daysLogged: logs.length, routineRate, bestDay }
}
