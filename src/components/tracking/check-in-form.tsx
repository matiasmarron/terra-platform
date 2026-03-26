'use client'

import { useState, useTransition } from 'react'
import MetricSelector from './metric-selector'
import { saveTrackingLog } from '@/app/actions/tracking'
import type { TrackingLog } from '@/types/database'

type Metrics = {
  mood:          number | null
  energy:        number | null
  sleep_quality: number | null
  focus:         number | null
  calm:          number | null
}

const METRICS: {
  key:       keyof Metrics
  label:     string
  lowLabel:  string
  highLabel: string
}[] = [
  { key: 'mood',          label: 'Estado de ánimo', lowLabel: 'Bajo',    highLabel: 'Alto'  },
  { key: 'energy',        label: 'Energía',          lowLabel: 'Sin energía', highLabel: 'Plena' },
  { key: 'sleep_quality', label: 'Calidad del sueño', lowLabel: 'Malo',   highLabel: 'Excelente' },
  { key: 'focus',         label: 'Foco',             lowLabel: 'Disperso', highLabel: 'Agudo' },
  { key: 'calm',          label: 'Calma',            lowLabel: 'Ansioso', highLabel: 'Tranquilo' },
]

type Props = {
  existing?: TrackingLog | null
  onSaved?: () => void
}

export default function CheckInForm({ existing, onSaved }: Props) {
  const [metrics, setMetrics] = useState<Metrics>({
    mood:          existing?.mood          ?? null,
    energy:        existing?.energy        ?? null,
    sleep_quality: existing?.sleep_quality ?? null,
    focus:         existing?.focus         ?? null,
    calm:          existing?.calm          ?? null,
  })
  const [routineFollowed, setRoutineFollowed] = useState<boolean | null>(
    existing?.routine_followed ?? null
  )
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const allMetricsFilled = Object.values(metrics).every((v) => v !== null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    if (routineFollowed !== null) {
      formData.set('routine_followed', String(routineFollowed))
    }
    startTransition(async () => {
      const result = await saveTrackingLog(formData)
      if ('error' in result) {
        setError(result.error)
      } else {
        onSaved?.()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Metrics */}
      <div className="space-y-6">
        {METRICS.map(({ key, label, lowLabel, highLabel }) => (
          <MetricSelector
            key={key}
            name={key}
            label={label}
            lowLabel={lowLabel}
            highLabel={highLabel}
            value={metrics[key]}
            onChange={(v) => setMetrics((prev) => ({ ...prev, [key]: v }))}
          />
        ))}
      </div>

      <div className="border-t border-[#F0E9DF] pt-6 space-y-5">

        {/* Routine followed */}
        <div>
          <p className="text-sm font-medium text-[#2A1F14] mb-3">
            ¿Seguiste tu rutina hoy?
          </p>
          <div className="flex gap-3">
            {[
              { value: true,  label: 'Sí' },
              { value: false, label: 'No' },
            ].map(({ value, label }) => (
              <button
                key={String(value)}
                type="button"
                onClick={() => setRoutineFollowed(value)}
                className={`px-5 py-2 rounded-full text-sm font-medium border transition-all
                  ${routineFollowed === value
                    ? 'bg-[#8B5E3C] border-[#8B5E3C] text-white'
                    : 'bg-white border-[#E4D9CC] text-[#7A6B58] hover:border-[#8B5E3C] hover:text-[#8B5E3C]'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Resource used */}
        <div>
          <label htmlFor="resource_used" className="block text-sm font-medium text-[#2A1F14] mb-1.5">
            ¿Usaste algún recurso hoy? <span className="text-[#A89880] font-normal">(opcional)</span>
          </label>
          <input
            id="resource_used"
            name="resource_used"
            type="text"
            defaultValue={existing?.resource_used ?? ''}
            placeholder="Meditación, respiración, guía..."
            className="w-full rounded-lg border border-[#E4D9CC] bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#2A1F14] placeholder:text-[#A89880] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent"
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-[#2A1F14] mb-1.5">
            Notas <span className="text-[#A89880] font-normal">(opcional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            defaultValue={existing?.notes ?? ''}
            placeholder="¿Algo que quieras recordar de hoy?"
            className="w-full rounded-lg border border-[#E4D9CC] bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#2A1F14] placeholder:text-[#A89880] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent resize-none"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || !allMetricsFilled}
        className="w-full rounded-full bg-[#2A1F14] text-white text-sm font-medium py-3 hover:bg-[#8B5E3C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isPending
          ? 'Guardando…'
          : existing
          ? 'Actualizar registro'
          : 'Guardar registro de hoy'}
      </button>

      {!allMetricsFilled && (
        <p className="text-xs text-center text-[#A89880] -mt-4">
          Completá todas las métricas para continuar
        </p>
      )}
    </form>
  )
}
