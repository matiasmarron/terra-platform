import Link from 'next/link'
import { getAdminStats } from '@/app/actions/admin'

export default async function AdminOverviewPage() {
  const stats = await getAdminStats()

  const cards = [
    { label: 'Usuarios',              value: stats.totalUsers,         href: '/admin/users',         color: 'text-blue-400'   },
    { label: 'Registros de tracking', value: stats.totalLogs,          href: null,                   color: 'text-emerald-400'},
    { label: 'Experiencias pendientes',value: stats.pendingReviews,    href: '/admin/reviews',       color: 'text-amber-400'  },
    { label: 'Experiencias aprobadas', value: stats.approvedReviews,   href: '/admin/reviews',       color: 'text-[#8B5E3C]'  },
    { label: 'Consultas',             value: stats.totalConsultations, href: '/admin/consultations', color: 'text-purple-400' },
    { label: 'Posts comunidad',       value: stats.totalPosts,         href: '/admin/community',     color: 'text-pink-400'   },
  ]

  return (
    <div className="px-6 md:px-10 py-10">
      <h1 className="font-serif text-2xl font-semibold text-[#FAF7F2] mb-2">Panel de administración</h1>
      <p className="text-[#7A6B58] text-sm mb-10">Resumen general de la plataforma.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-[#1A1108] rounded-2xl border border-[#2A1F14] p-5"
          >
            <p className={`text-3xl font-serif font-bold ${card.color}`}>{card.value}</p>
            <p className="text-xs text-[#7A6B58] mt-1">{card.label}</p>
            {card.href && (
              <Link href={card.href} className="text-xs text-[#8B5E3C] hover:underline mt-2 inline-block">
                Ver →
              </Link>
            )}
          </div>
        ))}
      </div>

      {stats.pendingReviews > 0 && (
        <div className="bg-amber-900/20 border border-amber-700/40 rounded-2xl px-5 py-4 flex items-center justify-between">
          <p className="text-sm text-amber-300">
            <span className="font-semibold">{stats.pendingReviews}</span> experiencias esperan aprobación
          </p>
          <Link href="/admin/reviews" className="text-xs font-medium text-amber-400 hover:underline">
            Revisar →
          </Link>
        </div>
      )}
    </div>
  )
}
