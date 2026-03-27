import { getFaqItems } from '@/app/actions/faq'
import { getT } from '@/i18n'
import FaqAccordion from '@/components/ui/faq-accordion'
import type { FaqCategory } from '@/types/database'

const CATEGORIES: FaqCategory[] = ['practical', 'emotional', 'process', 'safety']

export default async function FaqPage() {
  const t = getT('es')
  const tk = t.faq
  const items = await getFaqItems()

  const byCategory = CATEGORIES.reduce<Record<string, typeof items>>((acc, cat) => {
    const filtered = items.filter((i) => i.category === cat)
    if (filtered.length > 0) acc[cat] = filtered
    return acc
  }, {})

  return (
    <div className="px-6 md:px-10 py-10 max-w-2xl">

      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[#8B5E3C] font-medium mb-2">
          {tk.page.title}
        </p>
        <p className="text-sm text-[#7A6B58]">{tk.page.subtitle}</p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-[#A89880]">{tk.empty}</p>
      ) : (
        <div className="space-y-8">
          {Object.entries(byCategory).map(([cat, catItems]) => (
            <div key={cat}>
              <h2 className="text-xs uppercase tracking-widest text-[#A89880] font-medium mb-3">
                {tk.categories[cat as FaqCategory]}
              </h2>
              <div className="bg-white rounded-2xl border border-[#E4D9CC] px-5">
                <FaqAccordion
                  items={catItems.map((i) => ({
                    question: i.question_es,
                    answer:   i.answer_es,
                  }))}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
