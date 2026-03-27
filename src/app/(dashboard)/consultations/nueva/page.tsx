import Link from 'next/link'
import { getT } from '@/i18n'
import BookingForm from '@/components/consultations/booking-form'

export default function NuevaConsultaPage() {
  const t  = getT('es')
  const tk = t.consultations

  return (
    <div className="px-6 md:px-10 py-10 max-w-lg">

      <div className="flex items-center gap-2 mb-8">
        <Link href="/consultations" className="text-xs text-[#A89880] hover:text-[#8B5E3C] transition-colors">
          ← {tk.page.title}
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-[#2A1F14] mb-2">{tk.booking.title}</h1>
        <p className="text-sm text-[#7A6B58]">{tk.booking.subtitle}</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E4D9CC] p-6 md:p-8">
        <BookingForm translations={tk} />
      </div>
    </div>
  )
}
