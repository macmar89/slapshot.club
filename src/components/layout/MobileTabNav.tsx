'use client'

import React from 'react'
import { dashboardConfig } from '@/config/dashboard'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { MoreHorizontal } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export function MobileTabNav() {
  const t = useTranslations('Dashboard.nav')
  const params = useParams()
  const slug = params?.slug as string | undefined

  const leftItems = dashboardConfig.sidebarNav.slice(1, 3)
  const rightItems = dashboardConfig.sidebarNav.slice(3, 4)

  const getHref = (originalHref: string) => {
    if (!slug) return originalHref

    if (originalHref === '/dashboard') {
      return `/dashboard/${slug}`
    } else if (originalHref.startsWith('/dashboard/')) {
      const subPath = originalHref.replace('/dashboard/', '')
      return `/dashboard/${slug}/${subPath}`
    }
    return originalHref
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <IceGlassCard
        className="h-20 w-full flex items-center justify-between px-1 rounded-t-app rounded-b-none border-x-0 border-b-0"
        backdropBlur="lg"
      >
        {/* Left 2 items */}
        <div className="flex flex-1 justify-around items-center">
          {leftItems.map((item) => (
            <Link
              key={item.href}
              href={getHref(item.href) as any}
              className="flex flex-col items-center gap-1.5 text-white/50 hover:text-white transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-tight">
                {t(item.labelKey)}
              </span>
            </Link>
          ))}
        </div>

        {/* Logo in the center */}
        <div className="flex items-center justify-center -mt-10 px-2">
          <div className="w-16 h-16 rounded-app bg-primary text-white flex items-center justify-center font-bold text-3xl shadow-[0_8px_32px_rgba(var(--primary-rgb),0.4)] border-2 border-white/20 rotate-3 animate-in fade-in zoom-in duration-500">
            S
          </div>
        </div>

        {/* Right 2 items + More */}
        <div className="flex flex-1 justify-around items-center">
          {rightItems.map((item) => (
            <Link
              key={item.href}
              href={getHref(item.href) as any}
              className="flex flex-col items-center gap-1.5 text-white/50 hover:text-white transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-tight">
                {t(item.labelKey)}
              </span>
            </Link>
          ))}

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-1.5 text-white/50 hover:text-white transition-colors h-auto p-0 hover:bg-transparent"
              >
                <MoreHorizontal className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-tight">{t('more')}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[calc(100%-1rem)] w-full rounded-app bg-slate-900/95 backdrop-blur-2xl border-white/10 p-8 bottom-4 top-auto translate-y-0 sm:translate-y-[-50%] shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-white font-bold uppercase tracking-[0.2em] text-center text-xl">
                  {t('menu')}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-4 mt-8">
                {dashboardConfig.sidebarNav.map((item) => (
                  <Link
                    key={item.href}
                    href={getHref(item.href) as any}
                    className="flex flex-col items-center gap-4 py-6 px-2 rounded-app bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all active:scale-95 group"
                  >
                    <item.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-white/70 group-hover:text-white uppercase tracking-tight text-center leading-tight">
                      {t(item.labelKey)}
                    </span>
                  </Link>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </IceGlassCard>
    </div>
  )
}
