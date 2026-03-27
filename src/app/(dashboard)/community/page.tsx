import { getPosts } from '@/app/actions/community'
import { getProfile } from '@/app/actions/profile'
import { getT } from '@/i18n'
import CommunityPanel from '@/components/community/community-panel'

export default async function CommunityPage() {
  const t  = getT('es')
  const tk = t.community

  const [posts, profile] = await Promise.all([getPosts(), getProfile()])

  return (
    <div className="px-6 md:px-10 py-10 max-w-2xl">

      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[#8B5E3C] font-medium mb-2">
          {tk.page.title}
        </p>
        <p className="text-sm text-[#7A6B58]">{tk.page.subtitle}</p>
      </div>

      <CommunityPanel
        posts={posts}
        hasNickname={!!profile?.nickname}
        translations={tk}
      />
    </div>
  )
}
