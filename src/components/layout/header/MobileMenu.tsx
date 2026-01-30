'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import {
  Menu as MenuIcon,
  User as UserIcon,
  Settings,
  MessageSquarePlus,
} from 'lucide-react'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/Button'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { LogoutButton } from '@/features/auth/components/LogoutButton'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/Sheet'
import { FeedbackModal } from '@/components/feedback/FeedbackModal'
import { useTranslations } from 'next-intl'

interface League {
  id: string
  name: string
}

interface MobileMenuProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  user: any
  slug: string
  effectiveLeagueId: string | null
  leagues: League[]
  onLeagueChange: (leagueId: string | 'global') => void
  upcomingMatches: any[]
}

export function MobileMenu({
  isOpen,
  onOpenChange,
  user,
  slug,
  effectiveLeagueId,
  leagues,
  onLeagueChange,
  upcomingMatches,
}: MobileMenuProps) {
  const t = useTranslations('Header')
  const dt = useTranslations('Dashboard.nav')

  return (
    <div className="ml-auto md:hidden">
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white">
            <MenuIcon className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full bg-black/95 backdrop-blur-xl border-l border-white/10 p-0 flex flex-col"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{t('mobile_menu')}</SheetTitle>
            <SheetDescription>{t('mobile_menu_desc')}</SheetDescription>
          </SheetHeader>
          {/* Header Section */}
          <div className="p-6 border-b border-white/5 bg-gradient-to-b from-primary/10 to-transparent">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-app bg-warning/20 border border-warning/30 flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">
                    {user?.username || t('host')}
                  </h3>
                  <p className="text-white/40 text-[10px] font-medium uppercase tracking-widest truncate max-w-[150px]">
                    {user?.email}
                  </p>
                </div>
              </div>
              <LanguageSwitcher />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {/* League Switcher in Mobile Drawer */}
            {slug && (
              <div className="mb-8">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3 block">
                  {t('active_league')}
                </span>
                <div className="grid grid-cols-1 gap-1">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      onLeagueChange('global')
                      onOpenChange(false)
                    }}
                    className={cn(
                      'justify-start text-[10px] font-black uppercase tracking-widest h-10 px-4 rounded-lg transition-all',
                      !effectiveLeagueId
                        ? 'bg-warning text-black shadow-[0_0_15px_-5px_rgba(var(--warning-rgb),0.6)]'
                        : 'text-white/40 hover:text-white hover:bg-white/5',
                    )}
                  >
                    {t('global_league')}
                  </Button>
                  {leagues.map((league) => (
                    <Button
                      key={league.id}
                      variant="ghost"
                      onClick={() => {
                        onLeagueChange(league.id)
                        onOpenChange(false)
                      }}
                      className={cn(
                        'justify-start text-[10px] font-black uppercase tracking-widest h-10 px-4 rounded-lg transition-all',
                        effectiveLeagueId === league.id
                          ? 'bg-warning text-black shadow-[0_0_15px_-5px_rgba(var(--warning-rgb),0.6)]'
                          : 'text-white/40 hover:text-white hover:bg-white/5',
                      )}
                    >
                      {league.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-2">
                {t('dont_forget_to_tip')}
              </h4>
            </div>

            {upcomingMatches.length > 0 ? (
              <div className="grid gap-3">
                {upcomingMatches.map((match) => (
                  <Link
                    key={match.id}
                    href={`/dashboard/${slug}/matches?matchId=${match.id}` as any}
                    onClick={() => onOpenChange(false)}
                    className="block p-3 rounded-app bg-white/5 border border-white/5"
                  >
                    <div className="flex items-center justify-between gap-3 text-xs font-bold text-white/70">
                      <div className="flex-1 text-right truncate">
                        {match.homeTeam?.shortName || match.homeTeam?.name}
                      </div>
                      <div className="text-[10px] font-black text-warning italic">VS</div>
                      <div className="flex-1 text-left truncate">
                        {match.awayTeam?.shortName || match.awayTeam?.name}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-[10px] font-medium text-white/10 italic text-center py-4 bg-white/[0.01] rounded-app border border-dashed border-white/5">
                {t('all_done')}
              </p>
            )}
          </div>

          <div className="p-6 border-t border-white/5 bg-black/40 mt-auto">
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Link
                href="/account"
                onClick={() => onOpenChange(false)}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-app bg-white/5 text-white/60"
              >
                <UserIcon className="w-5 h-5" />
                <span className="font-bold uppercase tracking-widest text-[10px]">
                  {t('my_account')}
                </span>
              </Link>
              <Link
                href="/settings"
                onClick={() => onOpenChange(false)}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-app bg-white/5 text-white/60"
              >
                <Settings className="w-5 h-5" />
                <span className="font-bold uppercase tracking-widest text-[10px]">
                  {dt('settings')}
                </span>
              </Link>
            </div>
            <LogoutButton />

            <div className="mt-4 pt-4 border-t border-white/5">
              <FeedbackModal triggerClassName="w-full">
                <div className="flex items-center justify-center gap-2 p-3 rounded-app bg-warning/10 border border-warning/20 text-warning hover:bg-warning/20 transition-all cursor-pointer">
                  <MessageSquarePlus className="w-4 h-4" />
                  <span className="font-black uppercase tracking-widest text-[10px]">
                    {t('feedback')}
                  </span>
                </div>
              </FeedbackModal>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
