import { getTodayLog, getRecentLogs } from '@/app/actions/tracking'
import { createClient } from '@/lib/supabase/server'
import { getT, resolveLocale } from '@/i18n'
import TrackingPanel from '@/components/tracking/tracking-panel'

export default async function TrackingPage() {
  const [supabase, todayLog, recentLogs] = await Promise.all([
    createClient(),
    getTodayLog(),
    getRecentLogs(7),
  ])

  const { data: { user } } = await supabase.auth.getUser()

  // Resolve locale from user profile (falls back to 'es')
  const { data: profile } = await supabase
    .from('profiles')
    .select('language')
    .eq('id', user!.id)
    .single()

  const t = getT(resolveLocale(profile?.language))
  const tk = t.tracking

  // Time-based greeting
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? tk.page.greeting_morning
    : hour < 19 ? tk.page.greeting_afternoon
    : tk.page.greeting_evening

  const name = user?.email?.split('@')[0] ?? ''

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[#8B5E3C] font-medium mb-1">
          {tk.page.eyebrow}
        </p>
        <h1 className="font-serif text-3xl font-semibold text-[#2A1F14]">
          {greeting}{name ? `, ${name}` : ''}
        </h1>
        <p className="text-[#7A6B58] text-sm mt-2">
          {new Date().toLocaleDateString(
            resolveLocale(profile?.language) === 'en' ? 'en-US' : 'es-AR',
            { weekday: 'long', day: 'numeric', month: 'long' }
          )}
        </p>
      </div>

      <TrackingPanel todayLog={todayLog} recentLogs={recentLogs} translations={tk} />
    </div>
  )
}
