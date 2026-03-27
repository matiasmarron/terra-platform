import Link from 'next/link'
import type { PostWithMeta } from '@/app/actions/community'
import type { Translations } from '@/i18n'
import type { CommunityPostCategory } from '@/types/database'

type Props = {
  post:         PostWithMeta
  translations: Translations['community']
}

const CATEGORY_COLORS: Record<CommunityPostCategory, string> = {
  question:   'bg-blue-50 text-blue-700',
  reflection: 'bg-[#F5EDE3] text-[#8B5E3C]',
  routine:    'bg-lime-50 text-lime-700',
  feedback:   'bg-purple-50 text-purple-700',
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

export default function PostCard({ post, translations: tk }: Props) {
  const catLabel = tk.categories[post.category as CommunityPostCategory]
  const catColor = CATEGORY_COLORS[post.category as CommunityPostCategory] ?? 'bg-[#F0E9DF] text-[#7A6B58]'

  return (
    <Link
      href={`/community/${post.id}`}
      className="block bg-white rounded-2xl border border-[#E4D9CC] p-5 hover:border-[#8B5E3C] transition-colors group"
    >
      <div className="flex items-start gap-3 mb-3">
        <span className={`text-[10px] font-medium uppercase tracking-wide px-2.5 py-1 rounded-full shrink-0 ${catColor}`}>
          {catLabel}
        </span>
        {post.is_pinned && (
          <span className="text-[10px] font-medium uppercase tracking-wide px-2.5 py-1 rounded-full bg-[#2A1F14] text-[#FAF7F2] shrink-0">
            {tk.post.pinned}
          </span>
        )}
      </div>

      <h3 className="text-sm font-semibold text-[#2A1F14] leading-snug group-hover:text-[#8B5E3C] transition-colors mb-1.5">
        {post.title}
      </h3>
      <p className="text-xs text-[#7A6B58] leading-relaxed line-clamp-2">{post.body}</p>

      <div className="flex items-center gap-3 mt-4 text-[10px] text-[#A89880]">
        {post.author_nickname && (
          <span>{tk.post.by} <span className="font-medium text-[#7A6B58]">@{post.author_nickname}</span></span>
        )}
        <span>·</span>
        <span>{timeAgo(post.created_at)}</span>
        <span>·</span>
        <span>
          {post.comment_count} {post.comment_count === 1 ? tk.post.comment_one : tk.post.comments_count}
        </span>
      </div>
    </Link>
  )
}
