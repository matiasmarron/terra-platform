import { getAdminConsultations, updateConsultationStatus } from '@/app/actions/admin'
import type { ConsultationStatus } from '@/types/database'

const STATUSES: ConsultationStatus[] = ['pending', 'confirmed', 'completed', 'cancelled']
const STATUS_LABELS: Record<ConsultationStatus, string> = {
  pending:   'Pendiente',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
}
const STATUS_COLORS: Record<ConsultationStatus, string> = {
  pending:   'text-amber-400',
  confirmed: 'text-[#8B5E3C]',
  completed: 'text-emerald-400',
  cancelled: 'text-red-400',
}

export default async function AdminConsultationsPage() {
  const consultations = await getAdminConsultations()
  const now = new Date()
  const upcoming = consultations.filter((c) => new Date(c.date) >= now)
  const past     = consultations.filter((c) => new Date(c.date) <  now)

  return (
    <div className="px-6 md:px-10 py-10 max-w-4xl">
      <h1 className="font-serif text-2xl font-semibold text-[#FAF7F2] mb-8">Consultas</h1>

      <ConsultationTable title="Próximas" items={upcoming} />
      <div className="mt-8">
        <ConsultationTable title="Pasadas" items={past} muted />
      </div>
    </div>
  )
}

function ConsultationTable({
  title, items, muted = false,
}: {
  title: string
  items: Awaited<ReturnType<typeof getAdminConsultations>>
  muted?: boolean
}) {
  if (items.length === 0) return (
    <div>
      <h2 className={`text-xs uppercase tracking-widest font-medium mb-4 ${muted ? 'text-[#7A6B58]' : 'text-[#FAF7F2]'}`}>
        {title} (0)
      </h2>
      <p className="text-sm text-[#7A6B58]">Sin consultas.</p>
    </div>
  )

  return (
    <div>
      <h2 className={`text-xs uppercase tracking-widest font-medium mb-4 ${muted ? 'text-[#7A6B58]' : 'text-[#FAF7F2]'}`}>
        {title} ({items.length})
      </h2>
      <div className={`bg-[#1A1108] rounded-2xl border border-[#2A1F14] divide-y divide-[#2A1F14] ${muted ? 'opacity-60' : ''}`}>
        {items.map((c) => (
          <div key={c.id} className="px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm text-[#FAF7F2]">
                {new Date(c.date).toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                {' '}a las{' '}
                {new Date(c.date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-xs text-[#7A6B58] mt-0.5">{c.user_email} · {c.duration_minutes} min</p>
              {c.notes && <p className="text-xs text-[#A89880] mt-1 italic">{c.notes}</p>}
            </div>

            <div className="flex items-center gap-4">
              <span className={`text-xs font-medium ${STATUS_COLORS[c.status as ConsultationStatus]}`}>
                {STATUS_LABELS[c.status as ConsultationStatus]}
              </span>
              <form>
                <select
                  name="status"
                  defaultValue={c.status}
                  className="bg-[#2A1F14] text-[#FAF7F2] text-xs rounded-lg px-3 py-1.5 border border-[#3A2A1A] focus:outline-none"
                  onChange={async (e) => {
                    'use server'
                  }}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </form>
              {STATUSES.map((status) => (
                status !== c.status && (
                  <form key={status} action={async () => {
                    'use server'
                    await updateConsultationStatus(c.id, status)
                  }}>
                    <button type="submit" className="text-xs text-[#8B5E3C] hover:underline">
                      → {STATUS_LABELS[status]}
                    </button>
                  </form>
                )
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
