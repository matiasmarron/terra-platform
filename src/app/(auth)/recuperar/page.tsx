'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { resetPassword } from '@/app/actions/auth'

const inputClass =
  'w-full rounded-lg border border-[#E4D9CC] bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#2A1F14] placeholder:text-[#A89880] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent transition-shadow'

export default function RecuperarPage() {
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await resetPassword(formData)
      if ('error' in result) setError(result.error)
      else setSubmitted(true)
    })
  }

  if (submitted) {
    return (
      <div className="text-center py-2">
        <div className="w-12 h-12 rounded-full bg-[#F5EDE3] flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-[#8B5E3C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="font-serif text-xl font-semibold text-[#2A1F14] mb-2">
          Correo enviado
        </h2>
        <p className="text-sm text-[#7A6B58] leading-relaxed">
          Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña en breve.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm font-medium text-[#8B5E3C] hover:underline underline-offset-4"
        >
          ← Volver al inicio de sesión
        </Link>
      </div>
    )
  }

  return (
    <>
      <h1 className="font-serif text-2xl font-semibold text-[#2A1F14] mb-1">
        Recuperar contraseña
      </h1>
      <p className="text-sm text-[#7A6B58] mb-6">
        Ingresá tu correo y te enviamos un enlace para restablecer tu contraseña.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#2A1F14] mb-1.5">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="tu@correo.com"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-full bg-[#2A1F14] text-white text-sm font-medium py-3 mt-1 hover:bg-[#8B5E3C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Enviando…' : 'Enviar enlace'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#7A6B58]">
        <Link
          href="/login"
          className="font-medium text-[#8B5E3C] hover:underline underline-offset-4"
        >
          ← Volver al inicio de sesión
        </Link>
      </p>
    </>
  )
}
