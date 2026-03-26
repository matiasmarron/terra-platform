'use client'

import { useState } from 'react'
import CheckInForm from './check-in-form'
import TodaySummary from './today-summary'
import type { TrackingLog } from '@/types/database'
import type { Translations } from '@/i18n'

type Props = {
  todayLog:    TrackingLog | null
  recentLogs:  TrackingLog[]
  translations: Translations['tracking']
}

function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString(locale, { weekday: 'short', day: 'numeric' })
}

function MetricCell({ value }: { value: number | null }) {
  if (value === null) return <span className="text-[#E4D9CC]">—</span>
  const colors = [
    '',
    'bg-red-100 text-red-600',
    'bg-orange-100 text-orange-600',
    'bg-amber-100 text-amber-700',
    'bg-lime-100 text-lime-700',
    'bg-[#F5EDE3] text-[#8B5E3C]',
  ]
  return (
    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold ${colors[value]}`}>
      {value}
    </span>
  )
}

export default function TrackingPanel({ todayLog, recentLogs, translations: tk }: Props) {
  const [editing, setEditing] = useState(!todayLog)
  const [currentLog] = useState<TrackingLog | null>(todayLog)

  const metricColumns = [
    { key: 'mood'          as const, label: tk.history.columns.mood   },
    { key: 'energy'        as const, label: tk.history.columns.energy },
    { key: 'sleep_quality' as const, label: tk.history.columns.sleep  },
    { key: 'focus'         as const, label: tk.history.columns.focus  },
    { key: 'calm'          as const, label: tk.history.columns.calm   },
  ]

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
                {currentLog ? tk.form.title_edit : tk.form.title_new}
              </h2>
              <p className="text-sm text-[#7A6B58] mt-1">
                {currentLog ? tk.form.subtitle_edit : tk.form.subtitle_new}
              </p>
            </div>
            <CheckInForm
              existing={currentLog}
              translations={tk}
              onSaved={() => window.location.reload()}
            />
            {currentLog && (
              <button
                onClick={() => setEditing(false)}
                className="mt-4 w-full text-sm text-[#A89880] hover:text-[#7A6B58] transition-colors"
              >
                {tk.form.cancel}
              </button>
            )}
          </>
        ) : (
          <TodaySummary
            log={currentLog}
            translations={tk}
            onEdit={() => setEditing(true)}
          />
        )}
      </div>

      {/* ── History table ── */}
      {historyLogs.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-widest text-[#8B5E3C] font-medium mb-4">
            {tk.history.title}
          </h3>
          <div className="bg-white rounded-2xl border border-[#E4D9CC] overflow-hidden">
            <div className="grid grid-cols-[100px_repeat(5,1fr)] gap-2 px-5 py-3 border-b border-[#F0E9DF]">
              <span className="text-xs text-[#A89880]">{tk.history.columns.day}</span>
              {metricColumns.map((m) => (
                <span key={m.key} className="text-xs text-[#A89880] text-center">{m.label}</span>
              ))}
            </div>
            <div className="divide-y divide-[#F0E9DF]">
              {historyLogs.map((log) => (
                <div
                  key={log.id}
                  className="grid grid-cols-[100px_repeat(5,1fr)] gap-2 px-5 py-3 items-center hover:bg-[#FAF7F2] transition-colors"
                >
                  <span className="text-xs text-[#7A6B58] capitalize">
                    {formatDate(log.date, 'es-AR')}
                  </span>
                  {metricColumns.map((m) => (
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

      {/* Empty history */}
      {historyLogs.length === 0 && currentLog && (
        <div className="rounded-2xl border border-dashed border-[#E4D9CC] p-8 text-center">
          <p className="text-sm text-[#A89880]">{tk.history.empty}</p>
        </div>
      )}
    </div>
  )
}
