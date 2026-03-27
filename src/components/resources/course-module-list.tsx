'use client'

import { useState, useTransition } from 'react'
import { markModuleComplete } from '@/app/actions/resources'
import type { CourseWithModules } from '@/app/actions/resources'
import type { UserCourseProgress } from '@/types/database'
import type { Translations } from '@/i18n'

type Props = {
  course:       CourseWithModules
  progress:     UserCourseProgress[]
  translations: Translations['courses']
  locale?:      'es' | 'en'
}

export default function CourseModuleList({ course, progress, translations: tk, locale = 'es' }: Props) {
  const [localProgress, setLocalProgress] = useState<Set<string>>(
    new Set(progress.filter((p) => p.completed).map((p) => p.module_id))
  )
  const [isPending, startTransition] = useTransition()

  function handleMarkDone(moduleId: string) {
    startTransition(async () => {
      const result = await markModuleComplete(course.id, moduleId)
      if ('success' in result) {
        setLocalProgress((prev) => new Set([...prev, moduleId]))
      }
    })
  }

  const completedCount = localProgress.size
  const totalCount     = course.modules.length
  const allDone        = completedCount === totalCount && totalCount > 0
  const progressPct    = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="space-y-6">

      {/* Progress bar */}
      <div className="bg-white rounded-2xl border border-[#E4D9CC] p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-[#7A6B58]">{tk.detail.progress}</span>
          <span className="text-xs font-semibold text-[#8B5E3C]">
            {completedCount}/{totalCount} {tk.detail.completed}
          </span>
        </div>
        <div className="h-1.5 bg-[#F0E9DF] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#8B5E3C] rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {allDone && (
          <p className="text-xs font-medium text-[#8B5E3C] mt-3 text-center">{tk.detail.finished}</p>
        )}
      </div>

      {/* Modules */}
      <div>
        <h2 className="text-xs uppercase tracking-widest text-[#8B5E3C] font-medium mb-3">
          {tk.detail.modules_title}
        </h2>
        <div className="bg-white rounded-2xl border border-[#E4D9CC] divide-y divide-[#F0E9DF]">
          {course.modules.map((mod, idx) => {
            const done  = localProgress.has(mod.id)
            const title = locale === 'en' ? mod.resource.title_en : mod.resource.title_es
            const desc  = locale === 'en' ? mod.resource.description_en : mod.resource.description_es

            return (
              <div key={mod.id} className="px-5 py-4 flex items-start gap-4">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-semibold transition-colors ${
                  done ? 'bg-[#8B5E3C] text-white' : 'bg-[#F0E9DF] text-[#A89880]'
                }`}>
                  {done
                    ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    : idx + 1
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${done ? 'text-[#A89880] line-through' : 'text-[#2A1F14]'}`}>
                    {title}
                  </p>
                  {desc && (
                    <p className="text-xs text-[#7A6B58] mt-0.5 leading-relaxed line-clamp-2">{desc}</p>
                  )}
                </div>

                {!done && (
                  <button
                    onClick={() => handleMarkDone(mod.id)}
                    disabled={isPending}
                    className="shrink-0 text-xs font-medium text-[#8B5E3C] hover:underline underline-offset-4 disabled:opacity-50 whitespace-nowrap"
                  >
                    {tk.module.mark_done}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
