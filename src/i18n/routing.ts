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
      sk: '/dashboard',
    },
    '/login': {
      en: '/login',
      sk: '/prihlasenie',
    },
    // Dashboard subroutes
    '/dashboard/matches': {
      en: '/dashboard/matches',
      sk: '/dashboard/zapasy',
    },
    '/dashboard/tables': {
      en: '/dashboard/tables',
      sk: '/dashboard/tabulky',
    },
    '/dashboard/teams': {
      en: '/dashboard/teams',
      sk: '/dashboard/timy',
    },
    '/dashboard/leaderboard': {
      en: '/dashboard/leaderboard',
      sk: '/dashboard/rebricek',
    },
    '/dashboard/rules': {
      en: '/dashboard/rules',
      sk: '/dashboard/pravidla',
    },
    '/dashboard/profile': {
      en: '/dashboard/profile',
      sk: '/dashboard/profil',
    },
    '/dashboard/settings': {
      en: '/dashboard/settings',
      sk: '/dashboard/nastavenia',
    },
    '/dashboard/[slug]': {
      en: '/dashboard/[slug]',
      sk: '/dashboard/[slug]',
    },
    '/lobby': {
      en: '/lobby',
      sk: '/lobby',
    },
    '/lobby/[slug]': {
      en: '/lobby/[slug]',
      sk: '/lobby/[slug]',
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
