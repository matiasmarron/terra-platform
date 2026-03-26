import type { TrackingLog } from '@/types/database'

type Props = {
  log: TrackingLog
  onEdit: () => void
}

const METRICS = [
  { key: 'mood'          as const, label: 'Estado de ánimo' },
  { key: 'energy'        as const, label: 'Energía'          },
  { key: 'sleep_quality' as const, label: 'Sueño'            },
  { key: 'focus'         as const, label: 'Foco'             },
  { key: 'calm'          as const, label: 'Calma'            },
]

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

export default function TodaySummary({ log, onEdit }: Props) {
  const average =
    [log.mood, log.energy, log.sleep_quality, log.focus, log.calm]
      .filter((v): v is number => v !== null)
      .reduce((sum, v, _, arr) => sum + v / arr.length, 0)

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-[#F5EDE3] rounded-2xl p-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="w-12 h-12 rounded-full bg-[#8B5E3C] flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-medium text-[#2A1F14]">Registro de hoy completado</p>
            <p className="text-xs text-[#7A6B58] mt-0.5">
              Promedio general:{' '}
              <span className="font-semibold text-[#8B5E3C]">
                {average.toFixed(1)} / 5
              </span>
            </p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="shrink-0 text-xs font-medium text-[#8B5E3C] hover:underline underline-offset-4"
        >
          Editar
        </button>
      </div>

      {/* Metrics grid */}
      <div className="bg-white rounded-2xl border border-[#E4D9CC] divide-y divide-[#F0E9DF]">
        {METRICS.map(({ key, label }) => (
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
              <span className="text-sm text-[#7A6B58]">Rutina seguida</span>
              <span className={`text-sm font-medium ${log.routine_followed ? 'text-[#8B5E3C]' : 'text-[#A89880]'}`}>
                {log.routine_followed ? 'Sí' : 'No'}
              </span>
            </div>
          )}
          {log.resource_used && (
            <div className="flex items-center justify-between px-5 py-3.5 gap-4">
              <span className="text-sm text-[#7A6B58] shrink-0">Recurso usado</span>
              <span className="text-sm text-[#2A1F14] text-right">{log.resource_used}</span>
            </div>
          )}
          {log.notes && (
            <div className="px-5 py-3.5">
              <span className="text-sm text-[#7A6B58] block mb-1">Notas</span>
              <p className="text-sm text-[#2A1F14] leading-relaxed">{log.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
