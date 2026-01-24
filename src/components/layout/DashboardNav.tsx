'use client'

import React from 'react'
import { dashboardConfig } from '@/config/dashboard'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { Link, usePathname } from '@/i18n/routing'
import { useParams, useSelectedLayoutSegments } from 'next/navigation'

export function DashboardNav() {
  const t = useTranslations('Dashboard.nav')
  const params = useParams()
  const pathname = usePathname()
  const slug = params?.slug as string | undefined

  const segments = useSelectedLayoutSegments()

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

        // Logic for active state based on segments (robust against localization)
        const itemSegment = item.href.split('/').pop()
        const isOverview = itemSegment === 'dashboard'

        let isActive = false
        if (isOverview) {
          // Overview is active if:
          // 1. We have a slug and only 1 segment (the slug itself)
          // 2. We don't have a slug and 0 segments
          isActive = slug ? segments.length === 1 : segments.length === 0
        } else {
          // Other items active if their segment matches one of the path segments
          isActive = itemSegment ? segments.includes(itemSegment) : false
        }

        return (
          <Link
            key={item.href}
            href={href as any}
            className={cn(
              'flex gap-3 px-4 py-3 transition-all duration-200 text-sm font-medium uppercase tracking-wider relative group overflow-hidden',
              isActive ? 'text-white ' : 'text-white/70 hover:text-white',
            )}
          >
            {/* Active State Indicator - Glowing Gradient Line */}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-warning to-transparent shadow-[0_-2px_10px_rgba(234,179,8,0.7)]" />
            )}

            {/* KITT Scanner Effect - Visible on Hover */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] w-1/3 bg-gradient-to-r from-transparent via-warning to-transparent opacity-0 group-hover:opacity-100 animate-knight-rider pointer-events-none blur-[1px]" />

            <item.icon className="w-5 h-5 relative z-10" />
            <span className="relative z-10 text-shadow-sm">{t(item.labelKey)}</span>
          </Link>
        )
      })}
    </nav>
  )
}
