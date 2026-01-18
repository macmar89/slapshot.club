import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['sk', 'en'],

  // Used when no locale matches
  defaultLocale: 'sk',

  // The `pathnames` object holds pairs of internal
  // and external paths. For example:
  // - `/ranking` (internal)
  // - `/rebricek` (external in Slovak)
  // - `/ranking` (external in English)
  pathnames: {
    '/': '/',
    '/dashboard': {
      en: '/dashboard',
      sk: '/nastenka',
    },
    '/login': {
      en: '/login',
      sk: '/prihlasenie',
    },
    // Dashboard subroutes
    '/dashboard/matches': {
      en: '/dashboard/matches',
      sk: '/nastenka/zapasy',
    },
    '/dashboard/tables': {
      en: '/dashboard/tables',
      sk: '/nastenka/tabulky',
    },
    '/dashboard/teams': {
      en: '/dashboard/teams',
      sk: '/nastenka/timy',
    },
    '/dashboard/leaderboard': {
      en: '/dashboard/leaderboard',
      sk: '/nastenka/rebricek',
    },
    '/dashboard/rules': {
      en: '/dashboard/rules',
      sk: '/nastenka/pravidla',
    },
    '/dashboard/profile': {
      en: '/dashboard/profile',
      sk: '/nastenka/profil',
    },
    '/dashboard/settings': {
      en: '/dashboard/settings',
      sk: '/nastenka/nastavenia',
    },
    // Example from user request
    '/ranking': {
      en: '/ranking',
      sk: '/rebricek',
    },
  },
})

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
