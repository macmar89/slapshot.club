'use client'

import React from 'react'
import type { Competition, League, LeaderboardEntry, User } from '@/payload-types'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { useTranslations } from 'next-intl'
import { LeaderboardList } from './LeaderboardList'
import { useRouter, usePathname } from '@/i18n/routing'
import { useSearchParams, useParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Users, Globe, ChevronDown, CheckCircle2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/Dialog'

interface LeaderboardViewProps {
  competition: Competition
  userLeagues: League[]
  initialEntries: LeaderboardEntry[]
  currentUser: User
}

export function LeaderboardView({
  competition,
  userLeagues,
  initialEntries,
  currentUser,
}: LeaderboardViewProps) {
  const t = useTranslations('Dashboard.leaderboard')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const params = useParams()
  const slug = params.slug as string

  const currentTab = searchParams.get('tab') || 'global'
  const selectedLeagueId = searchParams.get('leagueId')

  const setTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', tab)
    if (tab === 'global') {
      params.delete('leagueId')
    } else if (!selectedLeagueId && userLeagues.length > 0) {
      params.set('leagueId', userLeagues[0].id)
    }

    router.replace(`${pathname}?${params.toString()}` as any)
  }

  const setLeague = (leagueId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', 'leagues')
    params.set('leagueId', leagueId)
    router.replace(`${pathname}?${params.toString()}` as any)
  }

  return (
    <div className="h-[calc(100dvh-8rem)] md:h-[calc(100dvh-7rem)] flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg md:text-3xl font-black uppercase text-[#eab308] md:text-white tracking-widest md:tracking-wide text-center md:text-left leading-none">
            {competition.name}
          </h1>
          <p className="hidden md:block text-white/60 text-base">{t('description')}</p>
        </div>

        {/* Tabs / Navigation */}
        <div className="flex flex-col sm:flex-row bg-white/5 p-1 rounded-lg border border-white/10 w-full md:w-auto gap-1">
          <button
            onClick={() => setTab('global')}
            className={cn(
              'flex items-center justify-center gap-2 px-6 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer',
              currentTab === 'global'
                ? 'bg-[#eab308] text-black shadow-lg'
                : 'text-white/40 hover:text-white hover:bg-white/5',
            )}
          >
            <Globe className="w-4 h-4" />
            {t('tabs.global')}
          </button>

          <Dialog>
            <DialogTrigger asChild>
              <button
                className={cn(
                  'flex items-center justify-between gap-4 px-6 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer min-w-[180px]',
                  currentTab === 'leagues'
                    ? 'bg-[#eab308] text-black shadow-lg'
                    : 'text-white/40 hover:text-white hover:bg-white/5',
                )}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {currentTab === 'leagues' && selectedLeagueId
                    ? userLeagues.find((l) => l.id === selectedLeagueId)?.name
                    : t('tabs.leagues')}
                </div>
                <ChevronDown
                  className={cn(
                    'w-3 h-3',
                    currentTab === 'leagues' ? 'text-black/40' : 'text-white/20',
                  )}
                />
              </button>
            </DialogTrigger>
            <DialogContent className="bg-black/95 border-white/10 text-white backdrop-blur-xl max-w-sm">
              <DialogHeader>
                <DialogTitle className="text-xl font-black uppercase italic tracking-tighter text-[#eab308]">
                  {t('tabs.leagues')}
                </DialogTitle>
                <DialogDescription className="text-white/40 font-medium">
                  Vyber si ligu, ktorej poradie chceš sledovať.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-2 py-4">
                {userLeagues.map((league) => (
                  <DialogClose key={league.id} asChild>
                    <button
                      onClick={() => setLeague(league.id)}
                      className={cn(
                        'flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group',
                        selectedLeagueId === league.id
                          ? 'bg-[#eab308]/10 border-[#eab308]/30'
                          : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20',
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                            selectedLeagueId === league.id
                              ? 'bg-[#eab308] text-black'
                              : 'bg-white/10 text-white/40 group-hover:bg-[#eab308]/20 group-hover:text-[#eab308]',
                          )}
                        >
                          <Users className="w-4 h-4" />
                        </div>
                        <span
                          className={cn(
                            'font-bold tracking-tight',
                            selectedLeagueId === league.id ? 'text-[#eab308]' : 'text-white',
                          )}
                        >
                          {league.name}
                        </span>
                      </div>
                      {selectedLeagueId === league.id && (
                        <CheckCircle2 className="w-5 h-5 text-[#eab308]" />
                      )}
                    </button>
                  </DialogClose>
                ))}

                {userLeagues.length === 0 && (
                  <div className="text-center py-8 text-white/20 italic font-medium">
                    Nie si v žiadnej mini-lige.
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <LeaderboardList
          tab={currentTab}
          leagueId={selectedLeagueId}
          initialEntries={initialEntries}
          currentUser={currentUser}
          competitionId={competition.id}
        />
      </div>
    </div>
  )
}
