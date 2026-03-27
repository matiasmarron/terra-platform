import Link from 'next/link'
import { getCourses } from '@/app/actions/resources'
import { getT } from '@/i18n'

export default async function CoursesPage() {
  const t  = getT('es')
  const tk = t.courses

  const courses = await getCourses()

  return (
    <div className="px-6 md:px-10 py-10 max-w-3xl">

      <div className="flex items-center gap-2 mb-8">
        <Link href="/resources" className="text-xs text-[#A89880] hover:text-[#8B5E3C] transition-colors">
          ← Recursos
        </Link>
      </div>

      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[#8B5E3C] font-medium mb-2">
          {tk.page.title}
        </p>
        <p className="text-sm text-[#7A6B58]">{tk.page.subtitle}</p>
      </div>

      {courses.length === 0 ? (
        <p className="text-sm text-[#A89880]">{tk.empty}</p>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/resources/courses/${course.id}`}
              className="block bg-white rounded-2xl border border-[#E4D9CC] p-6 hover:border-[#8B5E3C] transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {course.is_premium && (
                      <span className="text-[10px] font-medium uppercase tracking-wide bg-[#2A1F14] text-[#FAF7F2] px-2 py-0.5 rounded-full">
                        Premium
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-base font-semibold text-[#2A1F14] group-hover:text-[#8B5E3C] transition-colors">
                    {course.title_es}
                  </h3>
                  {course.description_es && (
                    <p className="text-sm text-[#7A6B58] mt-1.5 leading-relaxed">
                      {course.description_es}
                    </p>
                  )}
                </div>
                <svg className="w-5 h-5 text-[#A89880] group-hover:text-[#8B5E3C] transition-colors shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
