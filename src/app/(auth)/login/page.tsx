'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { signIn } from '@/app/actions/auth'

const inputClass =
  'w-full rounded-lg border border-[#E4D9CC] bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#2A1F14] placeholder:text-[#A89880] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent transition-shadow'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await signIn(formData)
      // Only reached if signIn returned an error (redirect() never returns)
      if (result && 'error' in result) setError(result.error)
    })
  }

  return (
    <>
      <h1 className="font-serif text-2xl font-semibold text-[#2A1F14] mb-1">
        Bienvenido de vuelta
      </h1>
      <p className="text-sm text-[#7A6B58] mb-6">Ingresá a tu espacio en Terra</p>

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
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-[#2A1F14]">
              Contraseña
            </label>
            <Link
              href="/recuperar"
              className="text-xs text-[#8B5E3C] hover:underline underline-offset-4"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="Tu contraseña"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-full bg-[#2A1F14] text-white text-sm font-medium py-3 mt-1 hover:bg-[#8B5E3C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#7A6B58]">
        ¿No tenés cuenta?{' '}
        <Link
          href="/registro"
          className="font-medium text-[#8B5E3C] hover:underline underline-offset-4"
        >
          Crear cuenta
        </Link>
      </p>
    </>
  )
}
