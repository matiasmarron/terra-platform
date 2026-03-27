import Link from 'next/link'
import { getT } from '@/i18n'

export default function ConfirmadaPage() {
  const t  = getT('es')
  const tk = t.consultations

  return (
    <div className="px-6 md:px-10 py-20 max-w-lg flex flex-col items-center text-center">

      <div className="w-16 h-16 rounded-full bg-[#F5EDE3] flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-[#8B5E3C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>

      <h1 className="font-serif text-2xl font-semibold text-[#2A1F14] mb-3">
        {tk.success.title}
      </h1>
      <p className="text-sm text-[#7A6B58] leading-relaxed mb-8">
        {tk.success.body}
      </p>

      <Link
        href="/consultations"
        className="rounded-full bg-[#2A1F14] text-white text-sm font-medium px-6 py-3 hover:bg-[#8B5E3C] transition-colors"
      >
        {tk.success.back}
      </Link>
    </div>
  )
}
