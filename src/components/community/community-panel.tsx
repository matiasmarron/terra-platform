'use client'

import { useState } from 'react'
import Link from 'next/link'
import CreatePostForm from './create-post-form'
import PostCard from './post-card'
import type { PostWithMeta } from '@/app/actions/community'
import type { Translations } from '@/i18n'

type Props = {
  posts:        PostWithMeta[]
  hasNickname:  boolean
  translations: Translations['community']
}

export default function CommunityPanel({ posts, hasNickname, translations: tk }: Props) {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">

      {/* Action bar */}
      <div className="flex items-center justify-between gap-4">
        {hasNickname ? (
          !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="rounded-full bg-[#2A1F14] text-white text-sm font-medium px-5 py-2.5 hover:bg-[#8B5E3C] transition-colors"
            >
              + {tk.page.new_post}
            </button>
          )
        ) : (
          <div className="bg-[#F5EDE3] rounded-xl px-4 py-3 flex items-center gap-3">
            <p className="text-sm text-[#7A6B58]">{tk.no_nickname}</p>
            <Link
              href="/settings"
              className="text-sm font-medium text-[#8B5E3C] hover:underline underline-offset-4 whitespace-nowrap"
            >
              {tk.go_settings}
            </Link>
          </div>
        )}
      </div>

      {/* New post form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-[#E4D9CC] p-6">
          <h2 className="font-serif text-lg font-semibold text-[#2A1F14] mb-5">{tk.form.title}</h2>
          <CreatePostForm translations={tk} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E4D9CC] p-10 text-center">
          <p className="text-sm text-[#A89880]">{tk.empty}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} translations={tk} />
          ))}
        </div>
      )}
    </div>
  )
}
