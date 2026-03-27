import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPost, getComments } from '@/app/actions/community'
import { getT } from '@/i18n'
import CommentSection from '@/components/community/comment-section'
import type { CommunityPostCategory } from '@/types/database'

type Props = {
  params: Promise<{ postId: string }>
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

export default async function PostDetailPage({ params }: Props) {
  const { postId } = await params
  const t  = getT('es')
  const tk = t.community

  const [post, comments] = await Promise.all([
    getPost(postId),
    getComments(postId),
  ])

  if (!post) notFound()

  const catLabel = tk.categories[post.category as CommunityPostCategory]
  const catColor = CATEGORY_COLORS[post.category as CommunityPostCategory] ?? 'bg-[#F0E9DF] text-[#7A6B58]'

  return (
    <div className="px-6 md:px-10 py-10 max-w-2xl">

      <div className="flex items-center gap-2 mb-8">
        <Link href="/community" className="text-xs text-[#A89880] hover:text-[#8B5E3C] transition-colors">
          ← {tk.page.title}
        </Link>
      </div>

      {/* Post */}
      <div className="bg-white rounded-2xl border border-[#E4D9CC] p-6 md:p-8 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-[10px] font-medium uppercase tracking-wide px-2.5 py-1 rounded-full ${catColor}`}>
            {catLabel}
          </span>
          {post.is_pinned && (
            <span className="text-[10px] font-medium uppercase tracking-wide px-2.5 py-1 rounded-full bg-[#2A1F14] text-[#FAF7F2]">
              {tk.post.pinned}
            </span>
          )}
        </div>

        <h1 className="font-serif text-xl font-semibold text-[#2A1F14] mb-3">{post.title}</h1>
        <p className="text-sm text-[#7A6B58] leading-relaxed whitespace-pre-wrap">{post.body}</p>

        <div className="flex items-center gap-2 mt-5 text-xs text-[#A89880]">
          {post.author_nickname && (
            <span>{tk.post.by} <span className="font-medium text-[#7A6B58]">@{post.author_nickname}</span></span>
          )}
          <span>· {timeAgo(post.created_at)}</span>
        </div>
      </div>

      {/* Comments */}
      <CommentSection
        postId={postId}
        initialItems={comments}
        translations={tk}
      />
    </div>
  )
}
