'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { CommunityPost, CommunityComment, CommunityPostCategory } from '@/types/database'

export type PostWithMeta = CommunityPost & {
  comment_count: number
  author_nickname: string | null
}

export type CommentWithMeta = CommunityComment & {
  author_nickname: string | null
}

export async function getPosts(): Promise<PostWithMeta[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('community_posts')
    .select(`
      *,
      profiles!community_posts_user_id_fkey(nickname),
      community_comments(count)
    `)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) return []

  return (data ?? []).map((row: any) => ({
    ...row,
    author_nickname: row.profiles?.nickname ?? null,
    comment_count:   row.community_comments?.[0]?.count ?? 0,
    profiles:        undefined,
    community_comments: undefined,
  }))
}

export async function getPost(postId: string): Promise<PostWithMeta | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('community_posts')
    .select(`
      *,
      profiles!community_posts_user_id_fkey(nickname),
      community_comments(count)
    `)
    .eq('id', postId)
    .single()

  if (error || !data) return null

  return {
    ...(data as any),
    author_nickname: (data as any).profiles?.nickname ?? null,
    comment_count:   (data as any).community_comments?.[0]?.count ?? 0,
  }
}

export async function getComments(postId: string): Promise<CommentWithMeta[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('community_comments')
    .select(`
      *,
      profiles!community_comments_user_id_fkey(nickname)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) return []

  return (data ?? []).map((row: any) => ({
    ...row,
    author_nickname: row.profiles?.nickname ?? null,
    profiles:        undefined,
  }))
}

export async function createPost(
  formData: FormData
): Promise<{ error: string } | { success: true; postId: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const category = formData.get('category')?.toString() as CommunityPostCategory
  const title    = formData.get('title')?.toString().trim() ?? ''
  const body     = formData.get('body')?.toString().trim() ?? ''

  if (!title || !body) return { error: 'El título y el contenido son obligatorios.' }

  const { data, error } = await supabase
    .from('community_posts')
    .insert({ user_id: user.id, category, title, body })
    .select('id')
    .single()

  if (error) return { error: error.message }

  revalidatePath('/community')
  return { success: true, postId: data.id }
}

export async function createComment(
  postId: string,
  body: string
): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const trimmed = body.trim()
  if (!trimmed) return { error: 'El comentario no puede estar vacío.' }

  const { error } = await supabase
    .from('community_comments')
    .insert({ post_id: postId, user_id: user.id, body: trimmed })

  if (error) return { error: error.message }

  revalidatePath(`/community/${postId}`)
  return { success: true }
}
