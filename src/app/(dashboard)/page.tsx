import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getTodayLog, getRecentLogs } from '@/app/actions/tracking'
import { getMyConsultations } from '@/app/actions/consultations'
import { getT } from '@/i18n'
import { redirect } from 'next/navigation'

function greeting(tk: ReturnType<typeof getT>['home']): string {
  const h = new Date().getHours()
  if (h < 12) return tk.greeting_morning
  if (h < 19) return tk.greeting_afternoon
  return tk.greeting_evening
}

const QUICK_LINKS = [
  { href: '/tracking',     icon: '📊', labelKey: 'tracking'      },
  { href: '/resources',    icon: '📚', labelKey: 'resources'     },
  { href: '/community',    icon: '👥', labelKey: 'community'     },
  { href: '/reviews',      icon: '⭐', labelKey: 'reviews'       },
  { href: '/consultations',icon: '📅', labelKey: 'consultations' },
  { href: '/insights',     icon: '📈', labelKey: 'insights'      },
] as const

export default async function DashboardHomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const t  = getT('es')
  const tk = t.home

  const [todayLog, recentLogs, consultations] = await Promise.all([
    getTodayLog(),
    getRecentLogs(7),
    getMyConsultations(),
  ])

  const now             = new Date()
  const nextConsultation = consultations.find(
    (c) => new Date(c.date) > now && (c.status === 'confirmed' || c.status === 'pending')
  )

  // Calculate streak
  let streak = 0
  const today = now.toISOString().split('T')[0]
  const logDates = new Set(recentLogs.map((l) => l.date))
  if (todayLog) logDates.add(today)
  for (let i = 0; i <= 7; i++) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const ds = d.toISOString().split('T')[0]
    if (logDates.has(ds)) streak++
    else if (i > 0) break
  }

  // Weekly average
  const allLogs = todayLog ? [todayLog, ...recentLogs.filter((l) => l.date !== today)] : recentLogs
  const weekAvg = allLogs.length > 0
    ? (allLogs.reduce((sum, l) => {
        const vals = [l.mood, l.energy, l.sleep_quality, l.focus, l.calm].filter(Boolean) as number[]
        return sum + (vals.reduce((a, b) => a + b, 0) / (vals.length || 1))
      }, 0) / allLogs.length).toFixed(1)
    : null

  const displayName = user.email?.split('@')[0] ?? 'tú'

  return (
    <div className="px-6 md:px-10 py-10 max-w-2xl space-y-8">

      {/* Greeting */}
      <div>
        <h1 className="font-serif text-2xl font-semibold text-[#2A1F14]">
          {greeting(tk)}, {displayName}
        </h1>
      </div>

      {/* Today's check-in status */}
      <div className={`rounded-2xl p-5 flex items-center justify-between gap-4 ${
        todayLog ? 'bg-[#F5EDE3]' : 'bg-white border border-[#E4D9CC]'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            todayLog ? 'bg-[#8B5E3C]' : 'bg-[#F0E9DF]'
          }`}>
            <svg className={`w-5 h-5 ${todayLog ? 'text-white' : 'text-[#A89880]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              {todayLog
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              }
            </svg>
          </div>
          <p className="text-sm font-medium text-[#2A1F14]">
            {todayLog ? tk.today_checked : tk.today_pending}
          </p>
        </div>
        {!todayLog && (
          <Link
            href="/tracking"
            className="shrink-0 text-sm font-medium text-[#8B5E3C] hover:underline underline-offset-4"
          >
            {tk.go_tracking}
          </Link>
        )}
      </div>

      {/* Stats strip */}
      {(weekAvg || streak > 1 || nextConsultation) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {streak > 1 && (
            <div className="bg-white rounded-2xl border border-[#E4D9CC] px-4 py-4 text-center">
              <p className="text-2xl font-serif font-semibold text-[#2A1F14]">{streak}</p>
              <p className="text-xs text-[#7A6B58] mt-1">{tk.streak}</p>
            </div>
          )}
          {weekAvg && (
            <div className="bg-white rounded-2xl border border-[#E4D9CC] px-4 py-4 text-center">
              <p className="text-2xl font-serif font-semibold text-[#2A1F14]">{weekAvg}</p>
              <p className="text-xs text-[#7A6B58] mt-1">{tk.avg_this_week}</p>
            </div>
          )}
          {nextConsultation && (
            <div className="bg-white rounded-2xl border border-[#E4D9CC] px-4 py-4 text-center">
              <p className="text-sm font-serif font-semibold text-[#2A1F14] leading-tight">
                {new Date(nextConsultation.date).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
              </p>
              <p className="text-xs text-[#7A6B58] mt-1">{tk.upcoming_consult}</p>
            </div>
          )}
        </div>
      )}

      {/* Quick links */}
      <div>
        <p className="text-xs uppercase tracking-widest text-[#A89880] font-medium mb-3">{tk.quick_links}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {QUICK_LINKS.map(({ href, icon, labelKey }) => {
            const label = (t.nav as Record<string, string>)[labelKey] ?? labelKey
            return (
              <Link
                key={href}
                href={href}
                className="bg-white rounded-2xl border border-[#E4D9CC] px-4 py-4 flex items-center gap-3 hover:border-[#8B5E3C] transition-colors group"
              >
                <span className="text-lg">{icon}</span>
                <span className="text-sm font-medium text-[#7A6B58] group-hover:text-[#2A1F14] transition-colors">
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
