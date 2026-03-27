'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { Translations } from '@/i18n'

type Props = {
  translations: Translations['insights']
}

const PERIODS = [
  { value: '7',  labelKey: 'week'  },
  { value: '30', labelKey: 'month' },
  { value: '90', labelKey: 'all'   },
] as const

export default function PeriodSelector({ translations: tk }: Props) {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const current      = searchParams.get('days') ?? '30'

  return (
    <div className="flex gap-2">
      {PERIODS.map(({ value, labelKey }) => (
        <button
          key={value}
          onClick={() => {
            const p = new URLSearchParams(searchParams.toString())
            p.set('days', value)
            router.push(`/insights?${p.toString()}`)
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
            current === value
              ? 'bg-[#2A1F14] border-[#2A1F14] text-white'
              : 'bg-white border-[#E4D9CC] text-[#7A6B58] hover:border-[#8B5E3C]'
          }`}
        >
          {tk.period[labelKey]}
        </button>
      ))}
    </div>
  )
}
