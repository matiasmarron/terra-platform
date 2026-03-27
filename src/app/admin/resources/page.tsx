import Link from 'next/link'
import { getAdminResources, deleteResource } from '@/app/actions/admin'
import ResourceForm from './resource-form'

export default async function AdminResourcesPage() {
  const resources = await getAdminResources()

  return (
    <div className="px-6 md:px-10 py-10 max-w-5xl">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-[#FAF7F2]">Recursos</h1>
          <p className="text-[#7A6B58] text-sm mt-1">{resources.length} recursos</p>
        </div>
      </div>

      {/* Add form */}
      <div className="bg-[#1A1108] rounded-2xl border border-[#2A1F14] p-6 mb-8">
        <h2 className="text-sm font-semibold text-[#FAF7F2] mb-4">Agregar recurso</h2>
        <ResourceForm />
      </div>

      {/* List */}
      <div className="bg-[#1A1108] rounded-2xl border border-[#2A1F14] divide-y divide-[#2A1F14]">
        {resources.map((r) => (
          <div key={r.id} className="px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#FAF7F2] truncate">{r.title_es}</p>
              <p className="text-xs text-[#7A6B58] mt-0.5">
                {r.type} · {r.category} · orden {r.sort_order} {r.is_premium ? '· Premium' : ''}
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <form action={async () => {
                'use server'
                await deleteResource(r.id)
              }}>
                <button type="submit" className="text-xs text-red-500 hover:underline">
                  Eliminar
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
