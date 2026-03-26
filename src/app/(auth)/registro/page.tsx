'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { signUp } from '@/app/actions/auth'

const inputClass =
  'w-full rounded-lg border border-[#E4D9CC] bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#2A1F14] placeholder:text-[#A89880] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent transition-shadow'

export default function RegistroPage() {
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    // Client-side password confirmation — don't hit the server for this
    if (formData.get('password') !== formData.get('confirmPassword')) {
      setError('Las contraseñas no coinciden.')
      return
    }

    startTransition(async () => {
      const result = await signUp(formData)
      if ('error' in result) setError(result.error)
      else if ('message' in result) setSuccessMessage(result.message)
      // If redirect() fired, we never reach here
    })
  }

  // Email confirmation sent — replace form with confirmation message
  if (successMessage) {
    return (
      <div className="text-center py-2">
        <div className="w-12 h-12 rounded-full bg-[#F5EDE3] flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-[#8B5E3C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <h2 className="font-serif text-xl font-semibold text-[#2A1F14] mb-2">
          Revisá tu correo
        </h2>
        <p className="text-sm text-[#7A6B58] leading-relaxed">{successMessage}</p>
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
        Creá tu cuenta
      </h1>
      <p className="text-sm text-[#7A6B58] mb-6">Empezá tu camino en Terra</p>

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

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#2A1F14] mb-1.5">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="Mínimo 6 caracteres"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#2A1F14] mb-1.5">
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="Repetí tu contraseña"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-full bg-[#2A1F14] text-white text-sm font-medium py-3 mt-1 hover:bg-[#8B5E3C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#7A6B58]">
        ¿Ya tenés cuenta?{' '}
        <Link
          href="/login"
          className="font-medium text-[#8B5E3C] hover:underline underline-offset-4"
        >
          Iniciar sesión
        </Link>
      </p>
    </>
  )
}
