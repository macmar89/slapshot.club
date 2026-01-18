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
  // We check for "dashboard" or "nastenka" in the path
  const isDashboardPath = pathname.includes('/dashboard') || pathname.includes('/nastenka')
  const isLoginPath = pathname.includes('/login') || pathname.includes('/prihlasenie')

  // Extract locale from pathname (first segment)
  const segments = pathname.split('/').filter(Boolean)
  const locale = routing.locales.includes(segments[0] as any) ? segments[0] : routing.defaultLocale

  // Redirect to dashboard if user is already logged in and tries to access login page
  if (pathname !== '/' && isLoginPath && token) {
    // Redirect to matching dashboard path
    const dashboardPath = locale === 'sk' ? '/sk/nastenka' : '/en/dashboard'
    return NextResponse.redirect(new URL(dashboardPath, request.url))
  }

  // Protected routes: dashboard
  if (isDashboardPath) {
    if (!token) {
      // Redirect to login if user is not authenticated
      const loginPath = locale === 'sk' ? '/sk/prihlasenie' : '/en/login'
      const url = new URL(loginPath, request.url)

      // Optionally preserve the return URL?
      // Simplified for now, just redirect
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
