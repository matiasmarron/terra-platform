import { getAdminUsers, toggleAdminRole, deleteUser } from '@/app/actions/admin'

export default async function AdminUsersPage() {
  const users = await getAdminUsers()

  return (
    <div className="px-6 md:px-10 py-10">
      <h1 className="font-serif text-2xl font-semibold text-[#FAF7F2] mb-2">Usuarios</h1>
      <p className="text-[#7A6B58] text-sm mb-8">{users.length} usuarios registrados</p>

      <div className="bg-[#1A1108] rounded-2xl border border-[#2A1F14] overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-[#2A1F14] text-xs text-[#7A6B58] uppercase tracking-widest">
          <span>Usuario</span>
          <span>Apodo</span>
          <span>Admin</span>
          <span>Acciones</span>
        </div>

        <div className="divide-y divide-[#2A1F14]">
          {users.map((user) => (
            <div key={user.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-4 items-center">
              <div>
                <p className="text-sm text-[#FAF7F2]">{user.email}</p>
                <p className="text-xs text-[#7A6B58] mt-0.5">
                  {user.display_name ?? 'Sin nombre'} · {user.language.toUpperCase()} · {new Date(user.created_at).toLocaleDateString('es-AR')}
                </p>
              </div>

              <span className="text-xs text-[#7A6B58]">
                {user.nickname ? `@${user.nickname}` : '—'}
              </span>

              <span className={`text-xs font-medium ${user.is_admin ? 'text-[#8B5E3C]' : 'text-[#2A1F14]'}`}>
                {user.is_admin ? 'Sí' : 'No'}
              </span>

              <div className="flex items-center gap-3">
                <form action={async () => {
                  'use server'
                  await toggleAdminRole(user.id)
                }}>
                  <button
                    type="submit"
                    className="text-xs text-[#8B5E3C] hover:underline"
                  >
                    {user.is_admin ? 'Quitar admin' : 'Hacer admin'}
                  </button>
                </form>
                <form action={async () => {
                  'use server'
                  await deleteUser(user.id)
                }}>
                  <button
                    type="submit"
                    className="text-xs text-red-500 hover:underline"
                    onClick={(e) => {
                      if (!confirm(`¿Eliminar usuario ${user.email}?`)) e.preventDefault()
                    }}
                  >
                    Eliminar
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
