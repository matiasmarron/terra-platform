'use server'

import { createClient } from '@/lib/supabase/server'
import type { Resource, Course, CourseModule, UserCourseProgress } from '@/types/database'

export async function getResources(category?: string): Promise<Resource[]> {
  const supabase = await createClient()

  let query = supabase
    .from('resources')
    .select('*')
    .order('sort_order', { ascending: true })

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  if (error) return []
  return data ?? []
}

export async function getCourses(): Promise<Course[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) return []
  return data ?? []
}

export type CourseWithModules = Course & {
  modules: (CourseModule & { resource: Resource })[]
}

export async function getCourseWithModules(courseId: string): Promise<CourseWithModules | null> {
  const supabase = await createClient()

  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single()

  if (courseError || !course) return null

  const { data: modules, error: modulesError } = await supabase
    .from('course_modules')
    .select('*, resource:resources(*)')
    .eq('course_id', courseId)
    .order('sort_order', { ascending: true })

  if (modulesError) return { ...course, modules: [] }

  return {
    ...course,
    modules: (modules ?? []) as (CourseModule & { resource: Resource })[],
  }
}

export async function getUserCourseProgress(courseId: string): Promise<UserCourseProgress[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('user_course_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('course_id', courseId)

  if (error) return []
  return data ?? []
}

export async function markModuleComplete(
  courseId: string,
  moduleId: string
): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('user_course_progress')
    .upsert(
      {
        user_id:      user.id,
        course_id:    courseId,
        module_id:    moduleId,
        completed:    true,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,module_id' }
    )

  if (error) return { error: error.message }
  return { success: true }
}
