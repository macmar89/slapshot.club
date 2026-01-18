import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('payload-token')?.value

  // Redirect to dashboard if user is already logged in and tries to access login page
  if (pathname.startsWith('/login') && token) {
    return NextResponse.rewrite(new URL('/dashboard', request.url))
  }

  // Protected routes: /dashboard and everything under it
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      // Redirect to login if user is not authenticated
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      // Optionally preserve the return URL
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/dashboard/:path*',
    '/login',
  ],
}
