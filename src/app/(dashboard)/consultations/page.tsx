import Link from 'next/link'
import { getMyConsultations } from '@/app/actions/consultations'
import { getT } from '@/i18n'
import type { ConsultationStatus } from '@/types/database'

const STATUS_COLORS: Record<ConsultationStatus, string> = {
  pending:   'bg-amber-50 text-amber-700',
  confirmed: 'bg-[#F5EDE3] text-[#8B5E3C]',
  completed: 'bg-lime-50 text-lime-700',
  cancelled: 'bg-red-50 text-red-600',
}

export default async function ConsultationsPage() {
  const t    = getT('es')
  const tk   = t.consultations
  const now  = new Date()

  const consultations = await getMyConsultations()
  const upcoming = consultations.filter((c) => new Date(c.date) >= now && c.status !== 'cancelled')
  const past     = consultations.filter((c) => new Date(c.date) < now  || c.status === 'completed' || c.status === 'cancelled')

  return (
    <div className="px-6 md:px-10 py-10 max-w-2xl">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#8B5E3C] font-medium mb-2">
            {tk.page.title}
          </p>
          <p className="text-sm text-[#7A6B58]">{tk.page.subtitle}</p>
        </div>
        <Link
          href="/consultations/nueva"
          className="shrink-0 rounded-full bg-[#2A1F14] text-white text-sm font-medium px-5 py-2.5 hover:bg-[#8B5E3C] transition-colors"
        >
          + {tk.page.book_cta}
        </Link>
      </div>

      {consultations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E4D9CC] p-10 text-center">
          <p className="text-sm text-[#A89880] mb-4">{tk.list.empty}</p>
          <Link
            href="/consultations/nueva"
            className="text-sm font-medium text-[#8B5E3C] hover:underline underline-offset-4"
          >
            {tk.page.book_cta} →
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {upcoming.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#8B5E3C] font-medium mb-4">
                {tk.list.upcoming}
              </h3>
              <div className="bg-white rounded-2xl border border-[#E4D9CC] divide-y divide-[#F0E9DF]">
                {upcoming.map((c) => (
                  <ConsultationRow key={c.id} c={c} tk={tk} statusColors={STATUS_COLORS} />
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#A89880] font-medium mb-4">
                {tk.list.past}
              </h3>
              <div className="bg-white rounded-2xl border border-[#E4D9CC] divide-y divide-[#F0E9DF] opacity-70">
                {past.map((c) => (
                  <ConsultationRow key={c.id} c={c} tk={tk} statusColors={STATUS_COLORS} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ConsultationRow({
  c,
  tk,
  statusColors,
}: {
  c: Awaited<ReturnType<typeof getMyConsultations>>[number]
  tk: ReturnType<typeof getT>['consultations']
  statusColors: Record<ConsultationStatus, string>
}) {
  const date = new Date(c.date)

  return (
    <div className="px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
      <div>
        <p className="text-sm font-medium text-[#2A1F14]">
          {date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <p className="text-xs text-[#7A6B58] mt-0.5">
          {date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} · {c.duration_minutes} {tk.list.duration}
          {c.payment_provider && <span className="ml-2 capitalize">· {c.payment_provider}</span>}
        </p>
        {c.notes && (
          <p className="text-xs text-[#A89880] mt-1 italic line-clamp-1">{c.notes}</p>
        )}
      </div>
      <span className={`text-[10px] font-medium uppercase tracking-wide px-2.5 py-1 rounded-full shrink-0 ${statusColors[c.status as ConsultationStatus]}`}>
        {tk.status[c.status as ConsultationStatus]}
      </span>
    </div>
  )
}
