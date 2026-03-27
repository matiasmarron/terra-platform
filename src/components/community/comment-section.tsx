'use client'

import { useState, useTransition } from 'react'
import { createComment } from '@/app/actions/community'
import type { CommentWithMeta } from '@/app/actions/community'
import type { Translations } from '@/i18n'

type Props = {
  postId:       string
  initialItems: CommentWithMeta[]
  translations: Translations['community']
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60)  return `hace ${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)   return `hace ${hrs}h`
  const days = Math.floor(hrs / 24)
  return `hace ${days}d`
}

export default function CommentSection({ postId, initialItems, translations: tk }: Props) {
  const [comments, setComments] = useState(initialItems)
  const [body, setBody]         = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const text = body
    startTransition(async () => {
      const result = await createComment(postId, text)
      if ('error' in result) {
        setError(result.error)
      } else {
        setBody('')
        // Optimistically add a placeholder — page will revalidate in background
        setComments((prev) => [
          ...prev,
          {
            id:              crypto.randomUUID(),
            post_id:         postId,
            user_id:         '',
            body:            text,
            created_at:      new Date().toISOString(),
            author_nickname: null,
          },
        ])
      }
    })
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xs uppercase tracking-widest text-[#8B5E3C] font-medium">
        {tk.comments.title}
      </h3>

      {comments.length === 0 ? (
        <p className="text-sm text-[#A89880]">{tk.comments.empty}</p>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E4D9CC] divide-y divide-[#F0E9DF]">
          {comments.map((c) => (
            <div key={c.id} className="px-5 py-4">
              <div className="flex items-center gap-2 mb-1.5">
                {c.author_nickname ? (
                  <span className="text-xs font-medium text-[#8B5E3C]">@{c.author_nickname}</span>
                ) : (
                  <span className="text-xs text-[#A89880]">anónimo</span>
                )}
                <span className="text-[10px] text-[#A89880]">· {timeAgo(c.created_at)}</span>
              </div>
              <p className="text-sm text-[#2A1F14] leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      )}

      {/* Comment input */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          placeholder={tk.comments.placeholder}
          className="w-full rounded-lg border border-[#E4D9CC] bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#2A1F14] placeholder:text-[#A89880] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent resize-none"
        />
        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}
        <button
          type="submit"
          disabled={isPending || !body.trim()}
          className="rounded-full bg-[#2A1F14] text-white text-sm font-medium px-5 py-2 hover:bg-[#8B5E3C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending ? tk.comments.submitting : tk.comments.submit}
        </button>
      </form>
    </div>
  )
}
