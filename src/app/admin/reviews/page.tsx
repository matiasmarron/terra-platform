import { getAdminReviews, setReviewApproval, setReviewFeatured } from '@/app/actions/admin'

export default async function AdminReviewsPage() {
  const pending  = await getAdminReviews('pending')
  const approved = await getAdminReviews('approved')

  return (
    <div className="px-6 md:px-10 py-10 max-w-4xl">
      <h1 className="font-serif text-2xl font-semibold text-[#FAF7F2] mb-8">Experiencias</h1>

      {/* Pending */}
      <section className="mb-10">
        <h2 className="text-xs uppercase tracking-widest text-amber-400 font-medium mb-4">
          Pendientes ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="text-sm text-[#7A6B58]">Sin experiencias pendientes.</p>
        ) : (
          <div className="space-y-4">
            {pending.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                approveAction={setReviewApproval}
                featuredAction={setReviewFeatured}
                isPending
              />
            ))}
          </div>
        )}
      </section>

      {/* Approved */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-medium mb-4">
          Aprobadas ({approved.length})
        </h2>
        {approved.length === 0 ? (
          <p className="text-sm text-[#7A6B58]">Sin experiencias aprobadas aún.</p>
        ) : (
          <div className="space-y-3">
            {approved.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                approveAction={setReviewApproval}
                featuredAction={setReviewFeatured}
                isPending={false}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function ReviewCard({ review, approveAction, featuredAction, isPending }: {
  review: Awaited<ReturnType<typeof getAdminReviews>>[number]
  approveAction: typeof setReviewApproval
  featuredAction: typeof setReviewFeatured
  isPending: boolean
}) {
  return (
    <div className="bg-[#1A1108] rounded-2xl border border-[#2A1F14] p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <p className="text-sm font-semibold text-[#FAF7F2]">{review.title ?? '(sin título)'}</p>
          <p className="text-xs text-[#7A6B58] mt-0.5">
            {review.author_nickname ? `@${review.author_nickname} · ` : ''}{review.author_email}
            {review.rating && ` · ${review.rating}/5`}
          </p>
        </div>
        {review.is_featured && (
          <span className="text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#8B5E3C] text-[#FAF7F2]">
            Destacada
          </span>
        )}
      </div>

      {review.body && (
        <p className="text-xs text-[#A89880] leading-relaxed mb-4 line-clamp-3">{review.body}</p>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        {isPending ? (
          <form action={async () => {
            'use server'
            await approveAction(review.id, true)
          }}>
            <button type="submit" className="text-xs font-medium text-emerald-400 hover:underline">
              ✓ Aprobar
            </button>
          </form>
        ) : (
          <form action={async () => {
            'use server'
            await approveAction(review.id, false)
          }}>
            <button type="submit" className="text-xs text-[#7A6B58] hover:underline">
              Desaprobar
            </button>
          </form>
        )}

        <form action={async () => {
          'use server'
          await featuredAction(review.id, !review.is_featured)
        }}>
          <button type="submit" className="text-xs text-[#8B5E3C] hover:underline">
            {review.is_featured ? 'Quitar destacada' : 'Destacar'}
          </button>
        </form>
      </div>
    </div>
  )
}
