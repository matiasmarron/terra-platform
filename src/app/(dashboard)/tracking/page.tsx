import { getTodayLog, getRecentLogs } from '@/app/actions/tracking'
import { createClient } from '@/lib/supabase/server'
import TrackingPanel from '@/components/tracking/tracking-panel'

function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

export default async function TrackingPage() {
  const [supabase, todayLog, recentLogs] = await Promise.all([
    createClient(),
    getTodayLog(),
    getRecentLogs(7),
  ])

  const { data: { user } } = await supabase.auth.getUser()
  const name = user?.email?.split('@')[0] ?? ''

  return (
    <div className="p-6 md:p-8 max-w-2xl">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[#8B5E3C] font-medium mb-1">
          Seguimiento diario
        </p>
        <h1 className="font-serif text-3xl font-semibold text-[#2A1F14]">
          {greeting()}{name ? `, ${name}` : ''}
        </h1>
        <p className="text-[#7A6B58] text-sm mt-2">
          {new Date().toLocaleDateString('es-AR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </p>
      </div>

      <TrackingPanel todayLog={todayLog} recentLogs={recentLogs} />
    </div>
  )
}
