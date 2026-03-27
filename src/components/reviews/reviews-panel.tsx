'use client'

import { useState } from 'react'
import ReviewForm from './review-form'
import type { Review, ReviewReward } from '@/types/database'
import type { Translations } from '@/i18n'
import { redeemReward } from '@/app/actions/reviews'
import { useTransition } from 'react'

type Props = {
  reviews:      Review[]
  rewards:      ReviewReward[]
  translations: Translations['reviews']
}

function StatusBadge({ approved, tk }: { approved: boolean; tk: Translations['reviews']['list']['status'] }) {
  return (
    <span className={`text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded-full ${
      approved
        ? 'bg-[#F5EDE3] text-[#8B5E3C]'
        : 'bg-[#F0E9DF] text-[#A89880]'
    }`}>
      {approved ? tk.approved : tk.pending}
    </span>
  )
}

function StarRating({ value }: { value: number | null }) {
  if (!value) return null
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          className={`w-3.5 h-3.5 ${n <= value ? 'text-[#8B5E3C]' : 'text-[#E4D9CC]'}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  )
}

export default function ReviewsPanel({ reviews, rewards, translations: tk }: Props) {
  const [showForm, setShowForm]   = useState(false)
  const [success, setSuccess]     = useState(false)
  const [isPending, startTransition] = useTransition()
  const [redeemedIds, setRedeemedIds] = useState<Set<string>>(
    new Set(rewards.filter((r) => r.redeemed).map((r) => r.id))
  )

  function handleSuccess() {
    setShowForm(false)
    setSuccess(true)
  }

  function handleRedeem(rewardId: string) {
    startTransition(async () => {
      const result = await redeemReward(rewardId)
      if ('success' in result) {
        setRedeemedIds((prev) => new Set([...prev, rewardId]))
      }
    })
  }

  return (
    <div className="space-y-8">

      {/* CTA / success */}
      {!showForm && (
        <div className="bg-[#F5EDE3] rounded-2xl p-6">
          {success ? (
            <div className="text-center py-2">
              <p className="font-serif text-lg font-semibold text-[#2A1F14] mb-1">{tk.form.success_title}</p>
              <p className="text-sm text-[#7A6B58]">{tk.form.success_body}</p>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-medium text-[#2A1F14]">{tk.page.title}</p>
                <p className="text-sm text-[#7A6B58] mt-0.5">{tk.page.subtitle}</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="shrink-0 rounded-full bg-[#2A1F14] text-white text-sm font-medium px-5 py-2.5 hover:bg-[#8B5E3C] transition-colors"
              >
                {tk.cta}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-[#E4D9CC] p-6 md:p-8">
          <div className="mb-6">
            <h2 className="font-serif text-xl font-semibold text-[#2A1F14]">{tk.form.title}</h2>
            <p className="text-sm text-[#7A6B58] mt-1">{tk.form.subtitle}</p>
          </div>
          <ReviewForm translations={tk} onSuccess={handleSuccess} />
          <button
            onClick={() => setShowForm(false)}
            className="mt-4 w-full text-sm text-[#A89880] hover:text-[#7A6B58] transition-colors"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* My reviews */}
      {reviews.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-widest text-[#8B5E3C] font-medium mb-4">
            {tk.list.title}
          </h3>
          <div className="bg-white rounded-2xl border border-[#E4D9CC] divide-y divide-[#F0E9DF]">
            {reviews.map((review) => (
              <div key={review.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <p className="text-sm font-medium text-[#2A1F14] leading-snug">{review.title}</p>
                  <StatusBadge approved={review.is_approved} tk={tk.list.status} />
                </div>
                {review.rating && <StarRating value={review.rating} />}
                {review.body && (
                  <p className="text-xs text-[#7A6B58] mt-1.5 leading-relaxed line-clamp-2">{review.body}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rewards */}
      {rewards.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-widest text-[#8B5E3C] font-medium mb-4">
            {tk.rewards.title}
          </h3>
          <div className="bg-white rounded-2xl border border-[#E4D9CC] divide-y divide-[#F0E9DF]">
            {rewards.map((reward) => {
              const isRedeemed = redeemedIds.has(reward.id)
              return (
                <div key={reward.id} className="px-5 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-[#2A1F14]">
                      {tk.rewards.types[reward.reward_type as keyof typeof tk.rewards.types] ?? reward.reward_type}
                    </p>
                    {reward.reward_value && (
                      <p className="text-xs text-[#7A6B58] mt-0.5">{reward.reward_value}</p>
                    )}
                  </div>
                  {isRedeemed ? (
                    <span className="text-xs text-[#A89880]">{tk.rewards.redeemed}</span>
                  ) : (
                    <button
                      onClick={() => handleRedeem(reward.id)}
                      disabled={isPending}
                      className="text-xs font-medium text-[#8B5E3C] hover:underline underline-offset-4 disabled:opacity-50"
                    >
                      {tk.rewards.redeem}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {reviews.length === 0 && !showForm && !success && (
        <div className="rounded-2xl border border-dashed border-[#E4D9CC] p-8 text-center">
          <p className="text-sm text-[#A89880]">{tk.list.empty}</p>
        </div>
      )}
    </div>
  )
}
