import Link from 'next/link'
import { getResources } from '@/app/actions/resources'
import { getT } from '@/i18n'
import ResourceCard from '@/components/resources/resource-card'
import ResourceFilter from '@/components/resources/resource-filter'
import type { ResourceCategory } from '@/types/database'

type Props = {
  searchParams: Promise<{ category?: string }>
}

export default async function ResourcesPage({ searchParams }: Props) {
  const { category } = await searchParams
  const t  = getT('es')
  const tk = t.resources

  const resources = await getResources(category as ResourceCategory | undefined)

  return (
    <div className="px-6 md:px-10 py-10 max-w-5xl">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#8B5E3C] font-medium mb-2">
            {tk.page.title}
          </p>
          <p className="text-sm text-[#7A6B58]">{tk.page.subtitle}</p>
        </div>
        <Link
          href="/resources/courses"
          className="shrink-0 text-sm font-medium text-[#8B5E3C] hover:underline underline-offset-4"
        >
          {tk.page.courses_tab} →
        </Link>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <ResourceFilter translations={tk} />
      </div>

      {/* Grid */}
      {resources.length === 0 ? (
        <p className="text-sm text-[#A89880]">{tk.empty}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              translations={tk}
              locale="es"
            />
          ))}
        </div>
      )}
    </div>
  )
}
