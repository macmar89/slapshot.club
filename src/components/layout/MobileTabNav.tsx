'use client'

import React from 'react'
import { dashboardConfig } from '@/config/dashboard'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { MoreHorizontal, MessageSquarePlus, LogOut, X, LayoutDashboard } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/Sheet'
import { cn } from '@/lib/utils'
import { useTranslations, useLocale } from 'next-intl'
import { Link, usePathname } from '@/i18n/routing'
import { useParams, useSelectedLayoutSegments } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { FeedbackModal } from '@/components/feedback/FeedbackModal'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { LogoutButton } from '@/features/auth/components/LogoutButton'
import { getCompetitionBySlugAction } from '@/features/competitions/actions'
import Image from 'next/image'
import logo from '@/assets/images/logo/ssc_logo_2.png'

export function MobileTabNav() {
  const t = useTranslations('Dashboard.nav')
  const th = useTranslations('Header')
  const ta = useTranslations('Auth')
  const params = useParams()
  const pathname = usePathname()
  const slug = params?.slug as string | undefined
  const locale = useLocale()
  const segments = useSelectedLayoutSegments()
  
  const [isOpen, setIsOpen] = React.useState(false)
  const [competitionName, setCompetitionName] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function fetchCompetition() {
      if (slug) {
        const comp = await getCompetitionBySlugAction(slug, locale)
        if (comp) {
          setCompetitionName(comp.name)
        }
      } else {
        setCompetitionName(null)
      }
    }
    fetchCompetition()
  }, [slug, locale])

  // Items for the bottom bar (Original items)
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
        className="h-20 w-full flex items-center justify-between px-1 rounded-t-app rounded-b-none border-x-0 border-b-0 overflow-visible"
        backdropBlur="lg"
        allowOverflow
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
        <div className="flex items-center justify-center -mt-10 px-2 relative z-50">
          <Link
            href={`/dashboard/${slug}` as any}
            className="w-24 h-24 flex items-center justify-center rotate-3 animate-in fade-in zoom-in duration-500 group relative z-10"
          >
            <Image
              src={logo}
              alt="Slapshot Club"
              width={80}
              height={80}
              className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-300"
              priority
            />
            <span className="absolute -right-2 top-4 px-1.5 py-0.5 text-[8px] font-black bg-warning text-black rounded-sm tracking-normal normal-case shadow-[0_0_15px_rgba(var(--warning-rgb),0.5)] rotate-12 transition-transform duration-300 pointer-events-none">
              BETA
            </span>
          </Link>
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
              className="h-[90vh] bg-slate-950/95 backdrop-blur-lg border-white/10 rounded-t-[2.5rem] p-0 flex flex-col overflow-hidden"
            >
              <div className="absolute top-6 right-6 z-50">
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all">
                    <X className="w-6 h-6" />
                  </Button>
                </SheetClose>
              </div>

              <div className="absolute top-6 left-6 z-50">
              </div>

              <SheetHeader className="p-8 pb-6 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
                <LanguageSwitcher />
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-6 custom-scrollbar py-2">
                <nav className="flex flex-col gap-2">
                  {/* Global Aréna Link */}
                  <Link
                    href="/arena"
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 transition-all duration-200 text-sm font-medium uppercase tracking-wider relative group overflow-hidden',
                      pathname === '/arena' ? 'text-white' : 'text-white/70 hover:text-white',
                    )}
                  >
                    {pathname === '/arena' && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-warning to-transparent shadow-[0_-2px_10px_rgba(234,179,8,0.7)]" />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] w-1/3 bg-gradient-to-r from-transparent via-warning to-transparent opacity-0 group-hover:opacity-100 animate-knight-rider pointer-events-none blur-[1px]" />
                    <LayoutDashboard className="w-5 h-5 relative z-10" />
                    <span className="relative z-10 text-shadow-sm">{t('arena')}</span>
                  </Link>

                  {(slug || competitionName) && (
                    <>
                      <div className="px-4 py-4">
                        <div className="h-px bg-white/5 w-full" />
                      </div>
                      {competitionName && (
                        <div className="px-5 py-2 text-[10px] font-black text-white/30 uppercase tracking-[0.3em] italic">
                          {competitionName}
                        </div>
                      )}
                    </>
                  )}

                  {dashboardConfig.sidebarNav.map((item: any) => {
                    let href = item.href
                    if (slug) {
                      if (href === '/dashboard') {
                        href = `/dashboard/${slug}`
                      } else if (href.startsWith('/dashboard/')) {
                        const subPath = href.replace('/dashboard/', '')
                        href = `/dashboard/${slug}/${subPath}`
                      }
                    } else if (item.href !== '/dashboard' && !slug) {
                      return null
                    }

                    const itemSegment = item.href.split('/').pop()
                    const isOverview = itemSegment === 'dashboard'
                    let isActive = false
                    if (isOverview) {
                      isActive = slug ? segments.length === 1 : segments.length === 0
                    } else {
                      isActive = itemSegment ? segments.includes(itemSegment) : false
                    }

                    return (
                      <Link
                        key={item.href}
                        href={href as any}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 transition-all duration-200 text-sm font-medium uppercase tracking-wider relative group overflow-hidden',
                          isActive ? 'text-white' : 'text-white/70 hover:text-white',
                        )}
                      >
                        {isActive && (
                          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-warning to-transparent shadow-[0_-2px_10px_rgba(234,179,8,0.7)]" />
                        )}
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] w-1/3 bg-gradient-to-r from-transparent via-warning to-transparent opacity-0 group-hover:opacity-100 animate-knight-rider pointer-events-none blur-[1px]" />
                        <item.icon className="w-5 h-5 relative z-10" />
                        <span className="relative z-10 text-shadow-sm">{t(item.labelKey)}</span>
                      </Link>
                    )
                  })}

                  <div className="h-px bg-white/5 my-4" />
                  
                  <FeedbackModal triggerClassName="w-full">
                    <div className="flex items-center gap-3 py-4 px-5 rounded-app bg-warning/[0.03] border border-warning/20 text-warning hover:bg-warning/[0.08] transition-all cursor-pointer group active:scale-[0.98]">
                      <MessageSquarePlus className="w-5 h-5 flex-shrink-0" />
                      <span className="font-black uppercase tracking-[0.2em] text-sm">
                        {t('feedback')}
                      </span>
                    </div>
                  </FeedbackModal>

                </nav>
              </div>

              <div className="p-8 border-t border-white/5 bg-black/40 mt-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-white font-black text-xs tracking-wider">
                    V1.0.0
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-black bg-warning text-black rounded-sm tracking-normal uppercase leading-tight shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                    BETA
                  </span>
                </div>
                <LogoutButton />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </IceGlassCard>
    </div>
  )
}
