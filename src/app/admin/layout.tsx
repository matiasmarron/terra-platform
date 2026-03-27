import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/actions/auth'

const NAV = [
  { href: '/admin',               label: 'Resumen',       icon: '🏠' },
  { href: '/admin/users',         label: 'Usuarios',      icon: '👥' },
  { href: '/admin/reviews',       label: 'Experiencias',  icon: '⭐' },
  { href: '/admin/consultations', label: 'Consultas',     icon: '📅' },
  { href: '/admin/resources',     label: 'Recursos',      icon: '📚' },
  { href: '/admin/faq',           label: 'FAQ',           icon: '❓' },
  { href: '/admin/community',     label: 'Comunidad',     icon: '💬' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/')

  return (
    <div className="min-h-screen bg-[#0F0A06] flex text-sm">

      {/* Sidebar */}
      <aside className="hidden md:flex w-56 flex-col fixed inset-y-0 left-0 bg-[#1A1108] border-r border-[#2A1F14] z-40">
        <div className="h-14 flex items-center px-5 border-b border-[#2A1F14] shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#8B5E3C] flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-[#FAF7F2]" />
            </span>
            <span className="text-[#FAF7F2] font-serif font-semibold tracking-wide">Admin</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#A89880] hover:bg-[#2A1F14] hover:text-[#FAF7F2] transition-colors"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-[#2A1F14] space-y-1 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#A89880] hover:bg-[#2A1F14] hover:text-[#FAF7F2] transition-colors"
          >
            <span>←</span>
            <span>Volver al sitio</span>
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#A89880] hover:bg-red-900/30 hover:text-red-400 transition-colors text-left"
            >
              <span>🚪</span>
              <span>Cerrar sesión</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-56 min-h-screen">
        {children}
      </main>
    </div>
  )
}
