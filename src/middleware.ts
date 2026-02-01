import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const handleI18nRouting = createMiddleware(routing)

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('payload-token')?.value

  // 1. Run i18n middleware
  const response = handleI18nRouting(request)

  // If i18n middleware redirects (e.g. / -> /sk) or returns a rewrite, let it pass if it's not a 200 OK or generic next()
  // Actually, we want to intercept if the user IS on a valid page but needs auth redirect.
  // Standard next-intl middleware returns a response.

  // If response is a redirect, return it immediately
  if (response.status >= 300 && response.status < 400) {
    return response
  }

  // 2. Auth Logic
  // Check for protected routes (dashboard) and public-only routes (login)
  // We check for "dashboard" in the path (English only now)
  const isDashboardPath = pathname.includes('/dashboard')
  const isArenaPath = pathname === '/arena'
  const isLoginPath =
    pathname === '/login' || pathname === '/register' || pathname === '/forgot-password'

  // Redirect to arena if user is already logged in and tries to access login page
  // DISABLED: This causes a redirect loop if the token is invalid on the server side (e.g. dev DB reset).
  // The server redirects to /login, and middleware redirects back to /arena.
  // if (isLoginPath && token) {
  //   return NextResponse.redirect(new URL('/arena', request.url))
  // }

  // Protected routes: dashboard
  if (isDashboardPath || isArenaPath) {
    if (!token) {
      // Redirect to login if user is not authenticated
      const url = new URL('/login', request.url)
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    // Enable a comprehensive matcher to ensure all paths are processed
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    '/((?!api|_next/static|_next/image|favicon.ico|admin).*)',
  ],
}
