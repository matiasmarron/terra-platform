'use client'

import { useState, useTransition } from 'react'
import type { Translations } from '@/i18n'

type PaymentMethod = 'stripe' | 'mercadopago'

type Props = {
  translations: Translations['consultations']
}

// Available time slots
const TIME_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

function getMinDate(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

export default function BookingForm({ translations: tk }: Props) {
  const [date, setDate]         = useState('')
  const [time, setTime]         = useState('')
  const [notes, setNotes]       = useState('')
  const [method, setMethod]     = useState<PaymentMethod>('stripe')
  const [error, setError]       = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!date || !time) return
    setError(null)

    const datetime = `${date}T${time}:00`
    const endpoint = method === 'stripe'
      ? '/api/checkout/stripe'
      : '/api/checkout/mercadopago'

    startTransition(async () => {
      const res = await fetch(endpoint, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ date: datetime, notes }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Error al procesar el pago. Intentá de nuevo.')
        return
      }
      window.location.href = data.url
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Date + Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-[#2A1F14] mb-1.5">
            {tk.booking.field_date}
          </label>
          <input
            id="date"
            type="date"
            required
            min={getMinDate()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-[#E4D9CC] bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#2A1F14] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2A1F14] mb-1.5">
            {tk.booking.field_time}
          </label>
          <div className="flex flex-wrap gap-2">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setTime(slot)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  time === slot
                    ? 'bg-[#8B5E3C] border-[#8B5E3C] text-white'
                    : 'bg-white border-[#E4D9CC] text-[#7A6B58] hover:border-[#8B5E3C]'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Duration + price info */}
      <div className="bg-[#F5EDE3] rounded-xl px-4 py-3 flex items-center justify-between text-sm">
        <span className="text-[#7A6B58]">{tk.booking.duration}</span>
        <div className="text-right">
          <span className="font-semibold text-[#2A1F14]">{tk.booking.price_usd}</span>
          <span className="text-[#A89880] mx-1">/</span>
          <span className="font-semibold text-[#2A1F14]">{tk.booking.price_ars}</span>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-[#2A1F14] mb-1.5">
          {tk.booking.field_notes}
        </label>
        <textarea
          id="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={tk.booking.notes_hint}
          className="w-full rounded-lg border border-[#E4D9CC] bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#2A1F14] placeholder:text-[#A89880] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent resize-none"
        />
      </div>

      {/* Payment method */}
      <div>
        <p className="text-sm font-medium text-[#2A1F14] mb-3">{tk.booking.payment_title}</p>
        <div className="space-y-2">
          {([
            { value: 'stripe',      label: tk.booking.stripe_label, icon: '💳' },
            { value: 'mercadopago', label: tk.booking.mp_label,     icon: '🔵' },
          ] as const).map(({ value, label, icon }) => (
            <label
              key={value}
              className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                method === value
                  ? 'border-[#8B5E3C] bg-[#F5EDE3]'
                  : 'border-[#E4D9CC] bg-white hover:border-[#8B5E3C]'
              }`}
            >
              <input
                type="radio"
                name="payment_method"
                value={value}
                checked={method === value}
                onChange={() => setMethod(value)}
                className="sr-only"
              />
              <span className="text-lg">{icon}</span>
              <span className="text-sm font-medium text-[#2A1F14]">{label}</span>
              {method === value && (
                <svg className="w-4 h-4 text-[#8B5E3C] ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </label>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || !date || !time}
        className="w-full rounded-full bg-[#2A1F14] text-white text-sm font-medium py-3 hover:bg-[#8B5E3C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isPending ? tk.booking.submitting : tk.booking.submit}
      </button>
    </form>
  )
}
