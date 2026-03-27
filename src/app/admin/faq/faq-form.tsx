'use client'

import { useState, useTransition } from 'react'
import { createFaqItem } from '@/app/actions/admin'

const CATS = ['practical','emotional','process','safety']

export default function FaqForm() {
  const [error, setError]  = useState<string | null>(null)
  const [ok, setOk]        = useState(false)
  const [isPending, start] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setOk(false)
    const fd = new FormData(e.currentTarget)
    start(async () => {
      const result = await createFaqItem(fd)
      if ('error' in result) setError(result.error)
      else { setOk(true); (e.target as HTMLFormElement).reset() }
    })
  }

  const cls = 'w-full bg-[#0F0A06] border border-[#2A1F14] rounded-lg px-3 py-2 text-sm text-[#FAF7F2] placeholder:text-[#3A2A1A] focus:outline-none focus:ring-1 focus:ring-[#8B5E3C]'

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs text-[#7A6B58] mb-1">Pregunta ES</label>
        <input name="question_es" type="text" required className={cls} />
      </div>
      <div>
        <label className="block text-xs text-[#7A6B58] mb-1">Pregunta EN</label>
        <input name="question_en" type="text" required className={cls} />
      </div>
      <div>
        <label className="block text-xs text-[#7A6B58] mb-1">Respuesta ES</label>
        <textarea name="answer_es" rows={3} required className={cls} />
      </div>
      <div>
        <label className="block text-xs text-[#7A6B58] mb-1">Respuesta EN</label>
        <textarea name="answer_en" rows={3} required className={cls} />
      </div>
      <div>
        <label className="block text-xs text-[#7A6B58] mb-1">Categoría</label>
        <select name="category" required className={cls}>
          {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs text-[#7A6B58] mb-1">Orden</label>
        <input name="sort_order" type="number" defaultValue={99} className={cls} />
      </div>

      {error && <p className="col-span-2 text-xs text-red-400">{error}</p>}
      {ok    && <p className="col-span-2 text-xs text-emerald-400">Pregunta creada.</p>}

      <div className="col-span-2">
        <button type="submit" disabled={isPending}
          className="rounded-full bg-[#8B5E3C] text-[#FAF7F2] text-xs font-medium px-5 py-2 hover:bg-[#6B4A2E] transition-colors disabled:opacity-50">
          {isPending ? 'Guardando…' : 'Agregar pregunta'}
        </button>
      </div>
    </form>
  )
}
