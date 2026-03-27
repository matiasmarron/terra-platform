import type { Resource } from '@/types/database'
import type { Translations } from '@/i18n'

type Props = {
  resource:     Resource
  translations: Translations['resources']
  locale?:      'es' | 'en'
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  meditation: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
  ),
  breathwork: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
    </svg>
  ),
  audio: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
    </svg>
  ),
  video: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  ),
  guide: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  ),
  checklist: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  ritual: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
    </svg>
  ),
}

export default function ResourceCard({ resource, translations: tk, locale = 'es' }: Props) {
  const title       = locale === 'en' ? resource.title_en       : resource.title_es
  const description = locale === 'en' ? resource.description_en : resource.description_es
  const icon        = TYPE_ICONS[resource.type] ?? TYPE_ICONS.guide
  const typeLabel   = tk.types[resource.type as keyof typeof tk.types] ?? resource.type

  return (
    <div className="bg-white rounded-2xl border border-[#E4D9CC] p-5 flex flex-col gap-3 hover:border-[#8B5E3C] transition-colors group">

      <div className="flex items-start justify-between gap-2">
        <div className="w-10 h-10 rounded-xl bg-[#F5EDE3] flex items-center justify-center text-[#8B5E3C] shrink-0">
          {icon}
        </div>
        {resource.is_premium && (
          <span className="text-[10px] font-medium uppercase tracking-wide bg-[#2A1F14] text-[#FAF7F2] px-2 py-0.5 rounded-full">
            {tk.premium_badge}
          </span>
        )}
      </div>

      <div className="flex-1">
        <p className="text-[10px] uppercase tracking-widest text-[#A89880] font-medium mb-1">{typeLabel}</p>
        <h3 className="text-sm font-semibold text-[#2A1F14] leading-snug group-hover:text-[#8B5E3C] transition-colors">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-[#7A6B58] mt-1.5 leading-relaxed line-clamp-2">{description}</p>
        )}
      </div>

      {resource.content_url && (
        <a
          href={resource.content_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-[#8B5E3C] hover:underline underline-offset-4 mt-auto"
        >
          {resource.type === 'audio' || resource.type === 'meditation' || resource.type === 'breathwork'
            ? tk.actions.listen
            : resource.type === 'video'
              ? tk.actions.watch
              : tk.actions.open} →
        </a>
      )}
    </div>
  )
}
