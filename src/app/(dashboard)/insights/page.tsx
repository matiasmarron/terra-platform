import { getInsights } from '@/app/actions/insights'
import { getT } from '@/i18n'
import MetricChart from '@/components/insights/metric-chart'
import PeriodSelector from '@/components/insights/period-selector'

type Props = {
  searchParams: Promise<{ days?: string }>
}

const METRIC_COLORS: Record<string, string> = {
  mood:          '#8B5E3C',
  energy:        '#D97706',
  sleep_quality: '#0891B2',
  focus:         '#7C3AED',
  calm:          '#059669',
}

const TREND_ICONS = {
  up:     '↑',
  down:   '↓',
  stable: '→',
}

const TREND_COLORS = {
  up:     'text-emerald-600',
  down:   'text-red-500',
  stable: 'text-[#A89880]',
}

export default async function InsightsPage({ searchParams }: Props) {
  const { days: daysParam } = await searchParams
  const days = Math.min(90, Math.max(7, parseInt(daysParam ?? '30') || 30))

  const t    = getT('es')
  const tk   = t.insights
  const data = await getInsights(days)

  return (
    <div className="px-6 md:px-10 py-10 max-w-3xl">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#8B5E3C] font-medium mb-2">
            {tk.page.title}
          </p>
          <p className="text-sm text-[#7A6B58]">{tk.page.subtitle}</p>
        </div>
        <PeriodSelector translations={tk} />
      </div>

      {data.stats.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E4D9CC] p-10 text-center">
          <p className="text-sm text-[#A89880]">{tk.no_data}</p>
        </div>
      ) : (
        <div className="space-y-6">

          {/* Summary strip */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl border border-[#E4D9CC] px-4 py-4 text-center">
              <p className="text-2xl font-serif font-semibold text-[#2A1F14]">{data.daysLogged}</p>
              <p className="text-xs text-[#7A6B58] mt-1">{tk.days_logged}</p>
            </div>
            <div className="bg-white rounded-2xl border border-[#E4D9CC] px-4 py-4 text-center">
              <p className="text-2xl font-serif font-semibold text-[#2A1F14]">{data.routineRate}%</p>
              <p className="text-xs text-[#7A6B58] mt-1">{tk.routine_rate}</p>
            </div>
            <div className="bg-white rounded-2xl border border-[#E4D9CC] px-4 py-4 text-center">
              <p className="text-sm font-serif font-semibold text-[#2A1F14] leading-tight">
                {data.bestDay
                  ? new Date(data.bestDay + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
                  : '—'}
              </p>
              <p className="text-xs text-[#7A6B58] mt-1">{tk.best_day}</p>
            </div>
          </div>

          {/* Metric charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.stats.map((stat) => {
              const color = METRIC_COLORS[stat.key] ?? '#8B5E3C'
              return (
                <div key={stat.key} className="bg-white rounded-2xl border border-[#E4D9CC] p-5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-[#7A6B58]">
                      {tk.metrics[stat.key as keyof typeof tk.metrics]}
                    </span>
                    <span className={`text-xs font-semibold ${TREND_COLORS[stat.trend]}`}>
                      {TREND_ICONS[stat.trend]} {tk[`trend_${stat.trend}` as 'trend_up' | 'trend_down' | 'trend_stable']}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-2xl font-serif font-semibold text-[#2A1F14]">
                      {stat.average.toFixed(1)}
                    </span>
                    <span className="text-xs text-[#A89880]">/ 5</span>
                  </div>
                  <MetricChart data={stat.data} color={color} height={64} />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
