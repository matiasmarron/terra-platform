import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes that require an authenticated session
const PROTECTED_PATHS = [
  '/tracking',
  '/resources',
  '/community',
  '/reviews',
  '/consultations',
  '/settings',
]

// Routes that should redirect to /tracking if already logged in
const AUTH_PATHS = ['/login', '/registro', '/recuperar']

export async function proxy(request: NextRequest) {
  // ── Step 1: Refresh session cookies ────────────────────────────────────────
  // Do NOT add any logic between createServerClient and getUser()
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getUser() validates the JWT with Supabase — never skip this
  const { data: { user } } = await supabase.auth.getUser()

  // ── Step 2: Route protection ───────────────────────────────────────────────
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  )
  const isAuthPage = AUTH_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  )

  // Unauthenticated user hitting a protected route → send to login
  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Authenticated user hitting an auth page → send to dashboard
  if (isAuthPage && user) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/tracking'
    dashboardUrl.searchParams.delete('next')
    return NextResponse.redirect(dashboardUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
