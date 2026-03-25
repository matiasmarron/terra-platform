'use client'

import { useState } from 'react'

type FaqItem = {
  question: string
  answer: string
}

type Props = {
  items: FaqItem[]
}

export default function FaqAccordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="divide-y divide-[#E4D9CC]">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div key={index}>
            <button
              className="w-full flex items-center justify-between gap-4 py-5 text-left group"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
            >
              <span className="text-base font-medium text-[#2A1F14] group-hover:text-[#8B5E3C] transition-colors">
                {item.question}
              </span>
              <span className={`shrink-0 w-6 h-6 rounded-full border border-[#E4D9CC] flex items-center justify-center text-[#8B5E3C] transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </span>
            </button>
            {isOpen && (
              <div className="pb-5">
                <p className="text-sm leading-relaxed text-[#7A6B58]">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
