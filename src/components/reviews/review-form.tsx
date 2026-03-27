'use client'

import { useState, useTransition } from 'react'
import { submitReview } from '@/app/actions/reviews'
import type { Translations } from '@/i18n'

type Props = {
  translations: Translations['reviews']
  onSuccess: () => void
}

export default function ReviewForm({ translations: tk, onSuccess }: Props) {
  const [rating, setRating]   = useState<number | null>(null)
  const [error, setError]     = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    if (rating !== null) formData.set('rating', String(rating))

    startTransition(async () => {
      const result = await submitReview(formData)
      if ('error' in result) setError(result.error)
      else onSuccess()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-[#2A1F14] mb-1.5">
          {tk.form.field_title}
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder={tk.form.field_title_hint}
          className="w-full rounded-lg border border-[#E4D9CC] bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#2A1F14] placeholder:text-[#A89880] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent"
        />
      </div>

      {/* Body */}
      <div>
        <label htmlFor="body" className="block text-sm font-medium text-[#2A1F14] mb-1.5">
          {tk.form.field_body}
        </label>
        <textarea
          id="body"
          name="body"
          rows={4}
          required
          placeholder={tk.form.field_body_hint}
          className="w-full rounded-lg border border-[#E4D9CC] bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#2A1F14] placeholder:text-[#A89880] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent resize-none"
        />
      </div>

      {/* Rating */}
      <div>
        <p className="text-sm font-medium text-[#2A1F14] mb-2">{tk.form.field_rating}</p>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className={`w-9 h-9 rounded-full text-sm font-medium border transition-all ${
                rating !== null && n <= rating
                  ? 'bg-[#8B5E3C] border-[#8B5E3C] text-white'
                  : 'bg-white border-[#E4D9CC] text-[#7A6B58] hover:border-[#8B5E3C]'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Optional fields */}
      {[
        { name: 'what_changed',       label: tk.form.field_what_changed   },
        { name: 'when_it_changed',    label: tk.form.field_when_changed   },
        { name: 'what_was_hardest',   label: tk.form.field_hardest        },
        { name: 'what_helped_most',   label: tk.form.field_helped         },
        { name: 'routine_description', label: tk.form.field_routine, hint: tk.form.field_routine_hint },
      ].map(({ name, label, hint }) => (
        <div key={name}>
          <label htmlFor={name} className="block text-sm font-medium text-[#2A1F14] mb-1.5">
            {label} <span className="text-[#A89880] font-normal">(opcional)</span>
          </label>
          <textarea
            id={name}
            name={name}
            rows={2}
            placeholder={hint ?? ''}
            className="w-full rounded-lg border border-[#E4D9CC] bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#2A1F14] placeholder:text-[#A89880] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent resize-none"
          />
        </div>
      ))}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-[#2A1F14] text-white text-sm font-medium py-3 hover:bg-[#8B5E3C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isPending ? tk.form.submitting : tk.form.submit}
      </button>
    </form>
  )
}
