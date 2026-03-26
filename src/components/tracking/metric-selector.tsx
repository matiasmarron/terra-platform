'use client'

type Props = {
  name: string
  label: string
  lowLabel: string
  highLabel: string
  defaultValue?: number | null
  value: number | null
  onChange: (value: number) => void
}

export default function MetricSelector({
  name,
  label,
  lowLabel,
  highLabel,
  value,
  onChange,
}: Props) {
  return (
    <div>
      <p className="text-sm font-medium text-[#2A1F14] mb-3">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#A89880] w-10 shrink-0">{lowLabel}</span>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => {
            const selected = value === n
            return (
              <button
                key={n}
                type="button"
                onClick={() => onChange(n)}
                className={`w-10 h-10 rounded-full text-sm font-medium transition-all border
                  ${selected
                    ? 'bg-[#8B5E3C] border-[#8B5E3C] text-white shadow-sm scale-105'
                    : 'bg-white border-[#E4D9CC] text-[#A89880] hover:border-[#8B5E3C] hover:text-[#8B5E3C] hover:bg-[#F5EDE3]'
                  }`}
              >
                {n}
              </button>
            )
          })}
        </div>
        <span className="text-xs text-[#A89880] w-10 shrink-0 text-right">{highLabel}</span>
      </div>
      {/* Hidden input so the value is included in FormData */}
      <input type="hidden" name={name} value={value ?? ''} />
    </div>
  )
}
