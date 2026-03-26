'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Supabase returns English error messages — map them to Spanish
const ERROR_MAP: Record<string, string> = {
  'Invalid login credentials': 'Correo o contraseña incorrectos.',
  'Email not confirmed': 'Confirmá tu correo antes de ingresar.',
  'User already registered': 'Este correo ya tiene una cuenta registrada.',
  'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres.',
  'Password should be at least 8 characters': 'La contraseña debe tener al menos 8 caracteres.',
  'Unable to validate email address: invalid format': 'El formato del correo no es válido.',
  'For security purposes, you can only request this once every 60 seconds':
    'Por seguridad, esperá 60 segundos antes de volver a intentarlo.',
}

function localizeError(msg: string): string {
  return ERROR_MAP[msg] ?? msg
}

// ─── Sign In ──────────────────────────────────────────────────────────────────

export async function signIn(
  formData: FormData
): Promise<{ error: string }> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) return { error: localizeError(error.message) }

  redirect('/tracking')
}

// ─── Sign Up ──────────────────────────────────────────────────────────────────

export async function signUp(
  formData: FormData
): Promise<{ error: string } | { message: string }> {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) return { error: localizeError(error.message) }

  // If email confirmation is disabled in Supabase, data.session exists → redirect
  if (data.session) {
    redirect('/tracking')
  }

  // Email confirmation required (default Supabase behaviour)
  return { message: 'Revisá tu correo para confirmar tu cuenta y empezar.' }
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────

export async function signOut(): Promise<never> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

// ─── Reset Password ───────────────────────────────────────────────────────────

export async function resetPassword(
  formData: FormData
): Promise<{ error: string } | { message: string }> {
  const supabase = await createClient()
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const { error } = await supabase.auth.resetPasswordForEmail(
    formData.get('email') as string,
    { redirectTo: `${origin}/auth/callback?next=/settings` }
  )

  if (error) return { error: localizeError(error.message) }

  // Always return the same message — don't reveal whether an email is registered
  return { message: 'Si el correo existe en nuestro sistema, recibirás un enlace en breve.' }
}
