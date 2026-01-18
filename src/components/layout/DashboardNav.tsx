import React from 'react'
import { dashboardConfig } from '@/config/dashboard'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'

export function DashboardNav() {
  const t = useTranslations('Dashboard.nav')

  return (
    <nav className="flex flex-col gap-2 mt-4">
      {dashboardConfig.sidebarNav.map((item) => (
        <Link
          key={item.href}
          href={item.href as any}
          className="flex gap-3 px-4 py-3 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium uppercase tracking-wider"
        >
          <item.icon className="w-5 h-5" />
          {t(item.labelKey)}
        </Link>
      ))}
    </nav>
  )
}
