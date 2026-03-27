'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { Translations } from '@/i18n'
import type { ResourceCategory } from '@/types/database'

const CATEGORIES: ResourceCategory[] = [
  'before_starting',
  'during_cycle',
  'difficult_moments',
  'integration',
  'daily_life',
]

type Props = {
  translations: Translations['resources']
}

export default function ResourceFilter({ translations: tk }: Props) {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const current      = searchParams.get('category') ?? ''

  function setCategory(cat: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (cat) params.set('category', cat)
    else params.delete('category')
    router.push(`/resources?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setCategory('')}
        className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
          !current
            ? 'bg-[#2A1F14] border-[#2A1F14] text-white'
            : 'bg-white border-[#E4D9CC] text-[#7A6B58] hover:border-[#8B5E3C] hover:text-[#8B5E3C]'
        }`}
      >
        {tk.page.all_tab}
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => setCategory(cat)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
            current === cat
              ? 'bg-[#8B5E3C] border-[#8B5E3C] text-white'
              : 'bg-white border-[#E4D9CC] text-[#7A6B58] hover:border-[#8B5E3C] hover:text-[#8B5E3C]'
          }`}
        >
          {tk.categories[cat]}
        </button>
      ))}
    </div>
  )
}
