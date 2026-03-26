import type { TrackingLog } from '@/types/database'
import type { Translations } from '@/i18n'

type Props = {
  log:          TrackingLog
  translations: Translations['tracking']
  onEdit:       () => void
}

function MetricDots({ value }: { value: number | null }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`w-2 h-2 rounded-full transition-colors ${
            value !== null && n <= value ? 'bg-[#8B5E3C]' : 'bg-[#E4D9CC]'
          }`}
        />
      ))}
    </div>
  )
}

export default function TodaySummary({ log, translations: tk, onEdit }: Props) {
  const metricRows = [
    { key: 'mood'          as const, label: tk.metrics.mood.label          },
    { key: 'energy'        as const, label: tk.metrics.energy.label        },
    { key: 'sleep_quality' as const, label: tk.metrics.sleep_quality.label },
    { key: 'focus'         as const, label: tk.metrics.focus.label         },
    { key: 'calm'          as const, label: tk.metrics.calm.label          },
  ]

  const average =
    [log.mood, log.energy, log.sleep_quality, log.focus, log.calm]
      .filter((v): v is number => v !== null)
      .reduce((sum, v, _, arr) => sum + v / arr.length, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#F5EDE3] rounded-2xl p-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="w-12 h-12 rounded-full bg-[#8B5E3C] flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-medium text-[#2A1F14]">{tk.summary.completed}</p>
            <p className="text-xs text-[#7A6B58] mt-0.5">
              {tk.summary.average}{' '}
              <span className="font-semibold text-[#8B5E3C]">{average.toFixed(1)} / 5</span>
            </p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="shrink-0 text-xs font-medium text-[#8B5E3C] hover:underline underline-offset-4"
        >
          {tk.form.submit_edit.split(' ')[0]}
        </button>
      </div>

      {/* Metrics */}
      <div className="bg-white rounded-2xl border border-[#E4D9CC] divide-y divide-[#F0E9DF]">
        {metricRows.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between px-5 py-3.5 gap-4">
            <span className="text-sm text-[#7A6B58]">{label}</span>
            <div className="flex items-center gap-3">
              <MetricDots value={log[key]} />
              <span className="text-sm font-medium text-[#2A1F14] w-4 text-right">
                {log[key] ?? '—'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Extras */}
      {(log.routine_followed !== null || log.resource_used || log.notes) && (
        <div className="bg-white rounded-2xl border border-[#E4D9CC] divide-y divide-[#F0E9DF]">
          {log.routine_followed !== null && (
            <div className="flex items-center justify-between px-5 py-3.5">
              <span className="text-sm text-[#7A6B58]">{tk.summary.routine_label}</span>
              <span className={`text-sm font-medium ${log.routine_followed ? 'text-[#8B5E3C]' : 'text-[#A89880]'}`}>
                {log.routine_followed ? tk.summary.routine_yes : tk.summary.routine_no}
              </span>
            </div>
          )}
          {log.resource_used && (
            <div className="flex items-center justify-between px-5 py-3.5 gap-4">
              <span className="text-sm text-[#7A6B58] shrink-0">{tk.summary.resource_label}</span>
              <span className="text-sm text-[#2A1F14] text-right">{log.resource_used}</span>
            </div>
          )}
          {log.notes && (
            <div className="px-5 py-3.5">
              <span className="text-sm text-[#7A6B58] block mb-1">{tk.summary.notes_label}</span>
              <p className="text-sm text-[#2A1F14] leading-relaxed">{log.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
