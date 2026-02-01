import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['sk', 'en', 'cs'],

  // Used when no locale matches
  defaultLocale: 'sk',

  // Disable locale prefix regarding the requirements: "Odstráň mi lokalizáciu z URL ciest. Chcem mať url iba v angličtine."
  localePrefix: 'never',

  // The `pathnames` object holds pairs of internal
  // and external paths. We unify them to English paths.
  pathnames: {
    '/': '/',
    '/dashboard': '/dashboard',
    '/login': '/login',
    '/register': '/register',
    '/register/[referralCode]': '/register/[referralCode]',
    '/forgot-password': '/forgot-password',
    '/account': '/account',
    // Dashboard subroutes
    '/dashboard/matches': '/dashboard/matches',
    '/dashboard/tables': '/dashboard/tables',
    '/dashboard/teams': '/dashboard/teams',
    '/dashboard/leaderboard': '/dashboard/leaderboard',
    '/dashboard/rules': '/dashboard/rules',
    '/dashboard/profile': '/dashboard/profile',
    '/dashboard/settings': '/dashboard/settings',
    '/settings': '/settings',
    '/dashboard/[slug]': '/dashboard/[slug]',
    '/dashboard/[slug]/leagues': '/dashboard/[slug]/leagues',
    '/dashboard/[slug]/leagues/[leagueId]': '/dashboard/[slug]/leagues/[leagueId]',
    '/dashboard/[slug]/matches': '/dashboard/[slug]/matches',
    '/dashboard/[slug]/leaderboard': '/dashboard/[slug]/leaderboard',
    '/lobby': '/lobby',
    '/lobby/[slug]': '/lobby/[slug]',
    // Example from user request
    '/ranking': '/ranking',
  },
})

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
