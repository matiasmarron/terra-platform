'use client'

import { useState } from 'react'
import CheckInForm from './check-in-form'
import TodaySummary from './today-summary'
import type { TrackingLog } from '@/types/database'

type Props = {
  todayLog: TrackingLog | null
  recentLogs: TrackingLog[]
}

const METRICS = [
  { key: 'mood'          as const, label: 'Ánimo'  },
  { key: 'energy'        as const, label: 'Energía' },
  { key: 'sleep_quality' as const, label: 'Sueño'  },
  { key: 'focus'         as const, label: 'Foco'   },
  { key: 'calm'          as const, label: 'Calma'  },
]

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric' })
}

function MetricCell({ value }: { value: number | null }) {
  if (value === null) return <span className="text-[#E4D9CC]">—</span>
  const colors = ['', 'bg-red-100 text-red-600', 'bg-orange-100 text-orange-600', 'bg-amber-100 text-amber-700', 'bg-lime-100 text-lime-700', 'bg-[#F5EDE3] text-[#8B5E3C]']
  return (
    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold ${colors[value]}`}>
      {value}
    </span>
  )
}

export default function TrackingPanel({ todayLog, recentLogs }: Props) {
  const [editing, setEditing] = useState(!todayLog)
  const [currentLog, setCurrentLog] = useState<TrackingLog | null>(todayLog)

  const historyLogs = recentLogs.filter(
    (l) => !currentLog || l.date !== currentLog.date
  )

  return (
    <div className="space-y-8">

      {/* ── Today's check-in ── */}
      <div className="bg-white rounded-2xl border border-[#E4D9CC] p-6 md:p-8">
        {editing || !currentLog ? (
          <>
            <div className="mb-6">
              <h2 className="font-serif text-xl font-semibold text-[#2A1F14]">
                {currentLog ? 'Editar registro de hoy' : '¿Cómo estás hoy?'}
              </h2>
              <p className="text-sm text-[#7A6B58] mt-1">
                {currentLog
                  ? 'Modificá los valores que quieras actualizar.'
                  : 'Tomá un momento para registrar cómo te sentís.'}
              </p>
            </div>
            <CheckInForm
              existing={currentLog}
              onSaved={() => {
                // Reload the page to get the fresh server data
                window.location.reload()
              }}
            />
            {currentLog && (
              <button
                onClick={() => setEditing(false)}
                className="mt-4 w-full text-sm text-[#A89880] hover:text-[#7A6B58] transition-colors"
              >
                Cancelar
              </button>
            )}
          </>
        ) : (
          <TodaySummary log={currentLog} onEdit={() => setEditing(true)} />
        )}
      </div>

      {/* ── Recent history ── */}
      {historyLogs.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-widest text-[#8B5E3C] font-medium mb-4">
            Últimos días
          </h3>
          <div className="bg-white rounded-2xl border border-[#E4D9CC] overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[100px_repeat(5,1fr)] gap-2 px-5 py-3 border-b border-[#F0E9DF]">
              <span className="text-xs text-[#A89880]">Día</span>
              {METRICS.map((m) => (
                <span key={m.key} className="text-xs text-[#A89880] text-center">
                  {m.label}
                </span>
              ))}
            </div>
            {/* Rows */}
            <div className="divide-y divide-[#F0E9DF]">
              {historyLogs.map((log) => (
                <div
                  key={log.id}
                  className="grid grid-cols-[100px_repeat(5,1fr)] gap-2 px-5 py-3 items-center hover:bg-[#FAF7F2] transition-colors"
                >
                  <span className="text-xs text-[#7A6B58] capitalize">
                    {formatDate(log.date)}
                  </span>
                  {METRICS.map((m) => (
                    <div key={m.key} className="flex justify-center">
                      <MetricCell value={log[m.key]} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty state for history */}
      {historyLogs.length === 0 && currentLog && (
        <div className="rounded-2xl border border-dashed border-[#E4D9CC] p-8 text-center">
          <p className="text-sm text-[#A89880]">
            Tu historial aparecerá aquí a partir de mañana.
          </p>
        </div>
      )}
    </div>
  )
}
