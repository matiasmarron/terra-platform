import { getAdminFaq, createFaqItem, deleteFaqItem } from '@/app/actions/admin'
import FaqForm from './faq-form'

export default async function AdminFaqPage() {
  const items = await getAdminFaq()

  return (
    <div className="px-6 md:px-10 py-10 max-w-4xl">
      <h1 className="font-serif text-2xl font-semibold text-[#FAF7F2] mb-8">FAQ</h1>

      {/* Add form */}
      <div className="bg-[#1A1108] rounded-2xl border border-[#2A1F14] p-6 mb-8">
        <h2 className="text-sm font-semibold text-[#FAF7F2] mb-4">Agregar pregunta</h2>
        <FaqForm />
      </div>

      {/* List */}
      <div className="bg-[#1A1108] rounded-2xl border border-[#2A1F14] divide-y divide-[#2A1F14]">
        {items.length === 0 && (
          <p className="px-5 py-4 text-sm text-[#7A6B58]">Sin preguntas aún.</p>
        )}
        {items.map((item) => (
          <div key={item.id} className="px-5 py-4 flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-[#FAF7F2]">{item.question_es}</p>
              <p className="text-xs text-[#7A6B58] mt-0.5">{item.category} · orden {item.sort_order}</p>
              <p className="text-xs text-[#A89880] mt-1 line-clamp-2">{item.answer_es}</p>
            </div>
            <form action={async () => {
              'use server'
              await deleteFaqItem(item.id)
            }}>
              <button type="submit" className="text-xs text-red-500 hover:underline shrink-0">
                Eliminar
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}
