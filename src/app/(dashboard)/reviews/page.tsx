import { getMyReviews, getMyRewards } from '@/app/actions/reviews'
import { getT } from '@/i18n'
import ReviewsPanel from '@/components/reviews/reviews-panel'

export default async function ReviewsPage() {
  const t  = getT('es')
  const tk = t.reviews

  const [reviews, rewards] = await Promise.all([
    getMyReviews(),
    getMyRewards(),
  ])

  return (
    <div className="px-6 md:px-10 py-10 max-w-2xl">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[#8B5E3C] font-medium mb-2">
          {tk.page.title}
        </p>
        <p className="text-sm text-[#7A6B58]">{tk.page.subtitle}</p>
      </div>

      <ReviewsPanel
        reviews={reviews}
        rewards={rewards}
        translations={tk}
      />
    </div>
  )
}
