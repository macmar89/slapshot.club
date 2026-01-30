'use client'

import React from 'react'
import { dashboardConfig } from '@/config/dashboard'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { MoreHorizontal, MessageSquarePlus, LogOut } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/Sheet'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { FeedbackModal } from '@/components/feedback/FeedbackModal'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { LogoutButton } from '@/features/auth/components/LogoutButton'

export function MobileTabNav() {
  const t = useTranslations('Dashboard.nav')
  const th = useTranslations('Header')
  const ta = useTranslations('Auth')
  const params = useParams()
  const slug = params?.slug as string | undefined
  const [isOpen, setIsOpen] = React.useState(false)

  // Items for the bottom bar (Original items)
  const leftItems = dashboardConfig.sidebarNav.slice(1, 3)
  const rightItems = dashboardConfig.sidebarNav.slice(3, 4)

  // Items for the "More" Sheet (Ordered as requested)
  // Links: "Prehľad", "Zápasy", "Rebríček", "Mini-ligy", "Pravidlá", "Účet"
  const sheetItems = dashboardConfig.sidebarNav
    .filter((item) =>
      ['overview', 'matches', 'leaderboard', 'leagues', 'rules', 'profile'].includes(item.labelKey),
    )
    .sort((a, b) => {
      const order = ['overview', 'matches', 'leaderboard', 'leagues', 'rules', 'profile']
      return order.indexOf(a.labelKey) - order.indexOf(b.labelKey)
    })

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

        {/* Right 1 item + More */}
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

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-1.5 text-white/50 hover:text-white transition-colors h-auto p-0 hover:bg-transparent"
              >
                <MoreHorizontal className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-tight">{t('more')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="h-[90vh] bg-slate-950/95 backdrop-blur-2xl border-white/10 rounded-t-app p-0 flex flex-col"
            >
              <SheetHeader className="p-8 pb-4 border-b border-white/5 bg-gradient-to-b from-primary/10 to-transparent flex flex-row items-center justify-between">
                <SheetTitle className="text-white font-bold uppercase tracking-[0.2em] text-xl">
                  {t('menu')}
                </SheetTitle>
                <LanguageSwitcher />
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="flex flex-col gap-2">
                  {sheetItems.map((item) => (
                    <Link
                      key={item.href}
                      href={getHref(item.href) as any}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 py-3.5 px-4 rounded-app bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all active:scale-95 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:bg-white/20 transition-all">
                        <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="text-sm font-black text-white/80 group-hover:text-white uppercase tracking-widest">
                        {t(item.labelKey)}
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="h-px bg-white/5 my-6" />

                <FeedbackModal triggerClassName="w-full">
                  <div className="flex items-center gap-4 p-4 rounded-app bg-white/5 border border-white/5 text-white hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <MessageSquarePlus className="w-5 h-5" />
                    </div>
                    <span className="font-black uppercase tracking-widest text-sm">
                      {t('feedback')}
                    </span>
                  </div>
                </FeedbackModal>
              </div>

              <div className="p-8 border-t border-white/5 bg-black/40 mt-auto flex items-center justify-between">
                <LogoutButton className="flex items-center gap-3 text-white/40 hover:text-danger transition-colors group p-0 min-w-0 h-auto bg-transparent border-0 hover:bg-transparent">
                  <div className="p-2 rounded-xl group-hover:bg-danger/10 transition-all">
                    <LogOut className="w-5 h-5 text-danger" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest text-white/60 group-hover:text-white">
                    {ta('logout')}
                  </span>
                </LogoutButton>

                <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em] italic">
                  SSC v1.0
                </span>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </IceGlassCard>
    </div>
  )
}
