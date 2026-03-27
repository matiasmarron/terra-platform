'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createPost } from '@/app/actions/community'
import type { Translations } from '@/i18n'
import type { CommunityPostCategory } from '@/types/database'

const CATEGORIES: CommunityPostCategory[] = ['question', 'reflection', 'routine', 'feedback']

type Props = {
  translations: Translations['community']
  onCancel:     () => void
}

export default function CreatePostForm({ translations: tk, onCancel }: Props) {
  const router = useRouter()
  const [error, setError]     = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await createPost(formData)
      if ('error' in result) {
        setError(result.error)
      } else {
        router.push(`/community/${result.postId}`)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Category */}
      <div>
        <p className="text-sm font-medium text-[#2A1F14] mb-2">{tk.form.field_category}</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="cursor-pointer">
              <input type="radio" name="category" value={cat} className="sr-only peer" required />
              <span className="px-3.5 py-1.5 rounded-full text-xs font-medium border border-[#E4D9CC] text-[#7A6B58] peer-checked:bg-[#8B5E3C] peer-checked:border-[#8B5E3C] peer-checked:text-white transition-all">
                {tk.categories[cat]}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="post_title" className="block text-sm font-medium text-[#2A1F14] mb-1.5">
          {tk.form.field_title}
        </label>
        <input
          id="post_title"
          name="title"
          type="text"
          required
          placeholder={tk.form.field_title_hint}
          className="w-full rounded-lg border border-[#E4D9CC] bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#2A1F14] placeholder:text-[#A89880] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent"
        />
      </div>

      {/* Body */}
      <div>
        <label htmlFor="post_body" className="block text-sm font-medium text-[#2A1F14] mb-1.5">
          {tk.form.field_body}
        </label>
        <textarea
          id="post_body"
          name="body"
          rows={5}
          required
          placeholder={tk.form.field_body_hint}
          className="w-full rounded-lg border border-[#E4D9CC] bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#2A1F14] placeholder:text-[#A89880] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent resize-none"
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-[#2A1F14] text-white text-sm font-medium px-6 py-2.5 hover:bg-[#8B5E3C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending ? tk.form.submitting : tk.form.submit}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-[#A89880] hover:text-[#7A6B58] transition-colors"
        >
          {tk.form.cancel}
        </button>
      </div>
    </form>
  )
}
