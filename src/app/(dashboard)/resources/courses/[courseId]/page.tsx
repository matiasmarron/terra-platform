import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseWithModules, getUserCourseProgress } from '@/app/actions/resources'
import { getT } from '@/i18n'
import CourseModuleList from '@/components/resources/course-module-list'

type Props = {
  params: Promise<{ courseId: string }>
}

export default async function CourseDetailPage({ params }: Props) {
  const { courseId } = await params
  const t  = getT('es')
  const tk = t.courses

  const [course, progress] = await Promise.all([
    getCourseWithModules(courseId),
    getUserCourseProgress(courseId),
  ])

  if (!course) notFound()

  return (
    <div className="px-6 md:px-10 py-10 max-w-2xl">

      <div className="flex items-center gap-2 mb-8">
        <Link href="/resources/courses" className="text-xs text-[#A89880] hover:text-[#8B5E3C] transition-colors">
          ← {tk.page.title}
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          {course.is_premium && (
            <span className="text-[10px] font-medium uppercase tracking-wide bg-[#2A1F14] text-[#FAF7F2] px-2 py-0.5 rounded-full">
              Premium
            </span>
          )}
        </div>
        <h1 className="font-serif text-2xl font-semibold text-[#2A1F14] mb-2">
          {course.title_es}
        </h1>
        {course.description_es && (
          <p className="text-sm text-[#7A6B58] leading-relaxed">{course.description_es}</p>
        )}
      </div>

      <CourseModuleList
        course={course}
        progress={progress}
        translations={tk}
        locale="es"
      />
    </div>
  )
}
