'use client'

import React from 'react'
import { dashboardConfig } from '@/config/dashboard'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { useParams } from 'next/navigation'

export function DashboardNav() {
  const t = useTranslations('Dashboard.nav')
  const params = useParams()
  const slug = params?.slug as string | undefined

  return (
    <nav className="flex flex-col gap-2 mt-4">
      {dashboardConfig.sidebarNav.map((item) => {
        // Ak máme slug a href je základný dashboard path, skúsime ho transformovať
        let href = item.href
        if (slug) {
          if (href === '/dashboard') {
            href = `/dashboard/${slug}`
          } else if (href.startsWith('/dashboard/')) {
            const subPath = href.replace('/dashboard/', '')
            href = `/dashboard/${slug}/${subPath}`
          }
        }

        return (
          <Link
            key={item.href}
            href={href as any}
            className="flex gap-3 px-4 py-3 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium uppercase tracking-wider"
          >
            <item.icon className="w-5 h-5" />
            {t(item.labelKey)}
          </Link>
        )
      })}
    </nav>
  )
}
