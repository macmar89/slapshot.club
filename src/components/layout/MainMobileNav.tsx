'use client'

import React from 'react'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { MoreHorizontal, FileText, User as UserIcon, Settings, LogOut, MessageSquarePlus } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/Sheet'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/Button'
import { FeedbackModal } from '@/components/feedback/FeedbackModal'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { LogoutButton } from '@/features/auth/components/LogoutButton'
import { ReferralLink } from '@/features/auth/components/ReferralLink'
import Image from 'next/image'
import logo from '@/assets/images/logo/ssc_logo_2.png'

export function MainMobileNav({ user }: { user: any }) {
  const t = useTranslations('Dashboard.nav')
  const th = useTranslations('Header')
  const ta = useTranslations('Auth')
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <IceGlassCard
        className="h-20 w-full rounded-t-app rounded-b-none border-x-0 border-b-0 overflow-visible"
        backdropBlur="lg"
        allowOverflow
      >
        <div className="flex items-center justify-between h-full px-1">
        {/* Left items */}
        <div className="flex flex-1 justify-around items-center">
          {/* Manažment (Disabled) */}
          <div className="flex flex-col items-center gap-1.5 text-white/20 cursor-not-allowed">
            <Settings className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-tight">
              {t('management')}
            </span>
          </div>

          {/* Pravidlá */}
          <Link
            href="/arena/rules"
            className="flex flex-col items-center gap-1.5 text-white/50 hover:text-white transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-tight">
              {t('rules')}
            </span>
          </Link>
        </div>

        {/* Logo in the center */}
        <div className="flex items-center justify-center -mt-10 px-2 relative z-50">
          <Link
            href="/arena"
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

        {/* Right items */}
        <div className="flex flex-1 justify-around items-center">
          {/* Účet */}
          <Link
            href="/account"
            className="flex flex-col items-center gap-1.5 text-white/50 hover:text-white transition-colors"
          >
            <UserIcon className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-tight">
              {t('profile')}
            </span>
          </Link>

          {/* Viac */}
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
              className="h-[50vh] bg-slate-950/95 backdrop-blur-2xl border-white/10 rounded-t-app p-0 flex flex-col"
            >
              <SheetHeader className="p-8 pb-4 border-b border-white/5 bg-gradient-to-b from-primary/10 to-transparent flex flex-row items-center justify-between">
                <SheetTitle className="text-white font-bold uppercase tracking-[0.2em] text-xl">
                  {t('menu')}
                </SheetTitle>
                <LanguageSwitcher />
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="flex flex-col gap-6">
                  {user?.referralData?.referralCode && (
                    <ReferralLink 
                      code={user.referralData.referralCode} 
                      align="left"
                      title={t('share_app')}
                      className="px-4 py-4 rounded-app bg-warning/5 border border-warning/10"
                    />
                  )}

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
              </div>

              <div className="p-8 border-t border-white/5 bg-black/40 mt-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                  v1.0.0
                </span>
                <span className="px-1.5 py-0.5 text-[8px] font-black bg-warning text-black rounded-sm tracking-normal normal-case">
                  BETA
                </span>
              </div>
                <LogoutButton className="flex items-center gap-3 text-white/40 hover:text-danger transition-colors group p-0 min-w-0 h-auto bg-transparent border-0 hover:bg-transparent">
                  <div className="p-2 rounded-xl group-hover:bg-danger/10 transition-all">
                    <LogOut className="w-5 h-5 text-danger" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest text-white/60 group-hover:text-white">
                    {ta('logout')}
                  </span>
                </LogoutButton>

              </div>
            </SheetContent>
          </Sheet>
        </div>
        </div>
      </IceGlassCard>
    </div>
  )
}
