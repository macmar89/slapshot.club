'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import {
  User as UserIcon,
  ChevronDown,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Settings,
  MessageSquarePlus,
} from 'lucide-react'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/Button'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { LogoutButton } from '@/features/auth/components/LogoutButton'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/Sheet'
import { format } from 'date-fns'
import { sk, enUS, cs } from 'date-fns/locale'
import { FeedbackModal } from '@/components/feedback/FeedbackModal'
import { useTranslations } from 'next-intl'
import { ReferralLink } from '@/features/auth/components/ReferralLink'

interface UserProfileDrawerProps {
  user: any
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  upcomingMatches: any[]
  slug: string
  locale: string
  effectiveLeagueId: string | null
}

export function UserProfileDrawer({
  user,
  isOpen,
  onOpenChange,
  upcomingMatches,
  slug,
  locale,
  effectiveLeagueId,
}: UserProfileDrawerProps) {
  const t = useTranslations('Header')
  const dt = useTranslations('Dashboard.nav')

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="group flex items-center gap-3 px-3 py-2 rounded-xs bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-warning/20 border border-warning/30 flex items-center justify-center text-warning group-hover:bg-warning/30 transition-colors">
            <UserIcon className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">
            {user?.username || t('host')}
          </span>
          <ChevronDown
            className={cn(
              'w-3 h-3 text-white/40 transition-transform',
              isOpen && 'rotate-180 text-warning',
            )}
          />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-black/95 backdrop-blur-2xl border-l border-white/10 p-0 flex flex-col"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{t('account_menu')}</SheetTitle>
          <SheetDescription>{t('account_menu_desc')}</SheetDescription>
        </SheetHeader>
        {/* Header Section */}
        <div className="p-8 border-b border-white/5 bg-gradient-to-b from-warning/10 to-transparent">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-app bg-warning/20 border border-warning/30 flex items-center justify-center shadow-[0_0_20px_-5px_rgba(var(--warning-rgb),0.4)]">
                <UserIcon className="w-8 h-8 text-warning" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
                  {user?.username || t('host')}
                </h3>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
        </div>

        {/* Match Feed Section */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {/* <div className="flex items-center justify-between mb-6">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              {t('dont_forget_to_tip')}
            </h4>
            {upcomingMatches.length > 0 && (
              <span className="px-2 py-0.5 rounded text-[10px] bg-warning/20 text-warning font-black uppercase tracking-tighter">
                {t('matches_count', { count: upcomingMatches.length })}
              </span>
            )}
          </div> */}

          {/* {upcomingMatches.length > 0 ? (
            <div className="grid gap-4">
              {upcomingMatches.map((match) => (
                <Link
                  key={match.id}
                  href={
                    `/dashboard/${slug}/matches?matchId=${match.id}${effectiveLeagueId ? `&leagueId=${effectiveLeagueId}` : ''}` as any
                  }
                  onClick={() => onOpenChange(false)}
                  className="group block p-4 rounded-app bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                      {match.date
                        ? format(new Date(match.date), 'EEEE, d. MMM HH:mm', {
                            locale: locale === 'sk' ? sk : locale === 'cs' ? cs : enUS,
                          })
                        : ''}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 text-right truncate text-sm font-bold text-white/80">
                      {match.homeTeam?.name}
                    </div>
                    <div className="text-xs font-black text-warning italic">VS</div>
                    <div className="flex-1 text-left truncate text-sm font-bold text-white/80">
                      {match.awayTeam?.name}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-6 rounded-app bg-white/[0.02] border border-dashed border-white/10 text-center">
              <AlertTriangle className="w-8 h-8 text-white/10 mb-4" />
              <p className="text-sm font-medium text-white/20 italic">{t('all_tipped_message')}</p>
            </div>
          )} */}
        </div>

        {/* Bottom Navigation */}
        <div className="p-8 border-t border-white/5 bg-black/40 mt-auto">
          <div className="grid gap-2">
            <Link
              href="/account"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-3 p-4 rounded-app bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all group"
            >
              <UserIcon className="w-5 h-5 group-hover:text-primary transition-colors" />
              <span className="font-bold uppercase tracking-widest text-xs">{t('my_account')}</span>
              <ChevronRight className="w-4 h-4 ml-auto opacity-20 group-hover:opacity-100 transition-all" />
            </Link>
            {user?.referralData?.referralCode && (
              <div className="p-4 rounded-app bg-white/5 border border-white/5">
                <ReferralLink
                  code={user.referralData.referralCode}
                  align="center"
                  className="w-full"
                />
              </div>
            )}
          </div>

          <div className="h-px bg-white/5 my-6" />

          <div className="flex flex-col gap-4">
            <FeedbackModal triggerClassName="w-full">
              <div className="flex items-center gap-3 p-3 rounded-app bg-warning/10 border border-warning/20 text-warning hover:bg-warning/20 transition-all cursor-pointer">
                <MessageSquarePlus className="w-4 h-4" />
                <span className="font-black uppercase tracking-widest text-[10px]">
                  {t('feedback')}
                </span>
              </div>
            </FeedbackModal>

            <div className="flex items-center justify-between">
              <LogoutButton />
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                  v1.0.0
                </span>
                <span className="px-1.5 py-0.5 text-[8px] font-black bg-warning text-black rounded-sm tracking-normal normal-case">
                  BETA
                </span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
