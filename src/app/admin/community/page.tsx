import { getAdminPosts, pinPost, deletePost } from '@/app/actions/admin'

export default async function AdminCommunityPage() {
  const posts = await getAdminPosts()

  return (
    <div className="px-6 md:px-10 py-10 max-w-4xl">
      <h1 className="font-serif text-2xl font-semibold text-[#FAF7F2] mb-2">Comunidad</h1>
      <p className="text-[#7A6B58] text-sm mb-8">{posts.length} publicaciones</p>

      <div className="bg-[#1A1108] rounded-2xl border border-[#2A1F14] divide-y divide-[#2A1F14]">
        {posts.length === 0 && (
          <p className="px-5 py-4 text-sm text-[#7A6B58]">Sin publicaciones.</p>
        )}
        {posts.map((post) => (
          <div key={post.id} className="px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-wide text-[#8B5E3C] font-medium">{post.category}</span>
                  {post.is_pinned && (
                    <span className="text-[10px] text-amber-400 font-medium">📌 Fijado</span>
                  )}
                </div>
                <p className="text-sm font-medium text-[#FAF7F2]">{post.title}</p>
                <p className="text-xs text-[#7A6B58] mt-0.5">
                  {post.author_nickname ? `@${post.author_nickname} · ` : ''}{post.author_email}
                  {' · '}{new Date(post.created_at).toLocaleDateString('es-AR')}
                </p>
                <p className="text-xs text-[#A89880] mt-1.5 line-clamp-2">{post.body}</p>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <form action={async () => {
                  'use server'
                  await pinPost(post.id, !post.is_pinned)
                }}>
                  <button type="submit" className="text-xs text-amber-400 hover:underline">
                    {post.is_pinned ? 'Desfijar' : 'Fijar'}
                  </button>
                </form>
                <form action={async () => {
                  'use server'
                  await deletePost(post.id)
                }}>
                  <button type="submit" className="text-xs text-red-500 hover:underline">
                    Eliminar
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
