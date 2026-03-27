'use client'

import { useState, useTransition } from 'react'
import { updateProfile } from '@/app/actions/profile'
import type { Profile } from '@/types/database'
import type { Translations } from '@/i18n'

type Props = {
  profile:      Profile | null
  translations: Translations['settings']
}

export default function ProfileForm({ profile, translations: tk }: Props) {
  const [saved, setSaved]         = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaved(false)
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await updateProfile(formData)
      if ('error' in result) setError(result.error)
      else setSaved(true)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Display name */}
      <div>
        <label htmlFor="display_name" className="block text-sm font-medium text-[#2A1F14] mb-1.5">
          {tk.profile.display_name}
        </label>
        <input
          id="display_name"
          name="display_name"
          type="text"
          defaultValue={profile?.display_name ?? ''}
          placeholder={tk.profile.display_name_hint}
          className="w-full rounded-lg border border-[#E4D9CC] bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#2A1F14] placeholder:text-[#A89880] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent"
        />
      </div>

      {/* Nickname */}
      <div>
        <label htmlFor="nickname" className="block text-sm font-medium text-[#2A1F14] mb-1.5">
          {tk.profile.nickname}
        </label>
        <input
          id="nickname"
          name="nickname"
          type="text"
          defaultValue={profile?.nickname ?? ''}
          placeholder={tk.profile.nickname_hint}
          pattern="^[a-zA-Z0-9_]+$"
          className="w-full rounded-lg border border-[#E4D9CC] bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#2A1F14] placeholder:text-[#A89880] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent"
        />
        <p className="text-xs text-[#A89880] mt-1">{tk.profile.nickname_hint}</p>
      </div>

      {/* Language */}
      <div>
        <label htmlFor="language" className="block text-sm font-medium text-[#2A1F14] mb-1.5">
          {tk.profile.language}
        </label>
        <select
          id="language"
          name="language"
          defaultValue={profile?.language ?? 'es'}
          className="w-full rounded-lg border border-[#E4D9CC] bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#2A1F14] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent"
        >
          <option value="es">{tk.profile.language_es}</option>
          <option value="en">{tk.profile.language_en}</option>
        </select>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {saved && (
        <div className="rounded-lg bg-[#F5EDE3] border border-[#E4D9CC] px-4 py-3 text-sm text-[#8B5E3C] font-medium">
          {tk.profile.saved}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-[#2A1F14] text-white text-sm font-medium px-6 py-2.5 hover:bg-[#8B5E3C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isPending ? tk.profile.saving : tk.profile.save}
      </button>
    </form>
  )
}
