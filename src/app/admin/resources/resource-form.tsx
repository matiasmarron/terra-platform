'use client'

import { useState, useTransition } from 'react'
import { createResource } from '@/app/actions/admin'

const TYPES = ['meditation','breathwork','ritual','video','audio','guide','checklist','course']
const CATS  = ['before_starting','during_cycle','difficult_moments','integration','daily_life']

export default function ResourceForm() {
  const [error, setError]   = useState<string | null>(null)
  const [ok, setOk]         = useState(false)
  const [isPending, start]  = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setOk(false)
    const fd = new FormData(e.currentTarget)
    start(async () => {
      const result = await createResource(fd)
      if ('error' in result) setError(result.error)
      else { setOk(true); (e.target as HTMLFormElement).reset() }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field name="title_es"  label="Título ES" required />
      <Field name="title_en"  label="Título EN" required />
      <Field name="description_es" label="Descripción ES" textarea />
      <Field name="description_en" label="Descripción EN" textarea />
      <Field name="content_url" label="URL del contenido" />

      <div>
        <label className="block text-xs text-[#7A6B58] mb-1">Tipo</label>
        <select name="type" required className={selectCls}>
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs text-[#7A6B58] mb-1">Categoría</label>
        <select name="category" required className={selectCls}>
          {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs text-[#7A6B58] mb-1">Orden</label>
        <input name="sort_order" type="number" defaultValue={99} className={inputCls} />
      </div>

      <div className="flex items-center gap-2 pt-5">
        <input name="is_premium" type="checkbox" value="true" id="is_premium" className="accent-[#8B5E3C]" />
        <label htmlFor="is_premium" className="text-xs text-[#7A6B58]">Premium</label>
      </div>

      {error && <p className="col-span-2 text-xs text-red-400">{error}</p>}
      {ok    && <p className="col-span-2 text-xs text-emerald-400">Recurso creado.</p>}

      <div className="col-span-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-[#8B5E3C] text-[#FAF7F2] text-xs font-medium px-5 py-2 hover:bg-[#6B4A2E] transition-colors disabled:opacity-50"
        >
          {isPending ? 'Guardando…' : 'Agregar recurso'}
        </button>
      </div>
    </form>
  )
}

const inputCls   = 'w-full bg-[#0F0A06] border border-[#2A1F14] rounded-lg px-3 py-2 text-sm text-[#FAF7F2] placeholder:text-[#3A2A1A] focus:outline-none focus:ring-1 focus:ring-[#8B5E3C]'
const selectCls  = 'w-full bg-[#0F0A06] border border-[#2A1F14] rounded-lg px-3 py-2 text-sm text-[#FAF7F2] focus:outline-none focus:ring-1 focus:ring-[#8B5E3C]'

function Field({ name, label, required, textarea }: { name: string; label: string; required?: boolean; textarea?: boolean }) {
  return (
    <div>
      <label className="block text-xs text-[#7A6B58] mb-1">{label}</label>
      {textarea
        ? <textarea name={name} rows={2} className={inputCls} />
        : <input name={name} type="text" required={required} className={inputCls} />
      }
    </div>
  )
}
