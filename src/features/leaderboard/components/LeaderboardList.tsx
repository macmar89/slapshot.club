'use client'

import React, { useRef } from 'react'
import { Trophy, Activity, CheckCircle2 } from 'lucide-react'
import { RankRow } from './RankRow'
import { LeaderboardEntry as UILeaderboardEntry } from '../types'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import type { LeaderboardEntry, User } from '@/payload-types'
import { useTranslations } from 'next-intl'

interface LeaderboardListProps {
  tab: string
  leagueId: string | null
  initialEntries: LeaderboardEntry[]
  currentUser: User
  competitionId: string
}

// We'll use the entries passed from the server or fetched via client

export function LeaderboardList({
  tab,
  leagueId,
  initialEntries,
  currentUser,
  competitionId,
}: LeaderboardListProps) {
  const t = useTranslations('Dashboard.leaderboard')
  const containerRef = useRef<HTMLDivElement>(null)
  const userRowRef = useRef<HTMLDivElement>(null)

  // Map entries to the UI format
  const entries: UILeaderboardEntry[] = initialEntries.map((entry, index) => {
    const user = entry.user as User
    return {
      id: entry.id,
      rank: entry.currentRank || index + 1,
      name: user.username || user.email || t('player'),
      avatarUrl: null,
      points: entry.totalPoints || 0,
      trend: (entry.rankChange || 0) > 0 ? 'up' : (entry.rankChange || 0) < 0 ? 'down' : 'same',
      isCurrentUser: user.id === currentUser.id,
      predictionsCount: entry.totalMatches || 0,
      exactScores: entry.exactGuesses || 0,
      correctDiffs: entry.correctDiffs || 0,
      winners: entry.correctTrends || 0,
      wrongGuesses: entry.wrongGuesses || 0,
    }
  })

  const currentUserEntry = entries.find((e) => e.isCurrentUser)

  const scrollToUser = () => {
    if (userRowRef.current) {
      userRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <IceGlassCard
      backdropBlur="md"
      className="flex flex-col h-full w-full rounded-none p-0 overflow-hidden"
    >
      {/* Header with Global Stats - Hidden on Mobile */}
      <div className="hidden md:block p-4 border-b border-white/10 bg-white/[0.02] backdrop-blur-xl shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#eab308]/10 flex items-center justify-center border border-[#eab308]/30">
              <Trophy className="w-6 h-6 text-[#eab308]" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter text-white leading-none">
                {t('top_tippers')}
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#eab308]/60 mt-1">
                {t('current_rank_label')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/5 p-3 border border-white/10">
            <div className="flex flex-col items-center px-3 border-r border-white/10">
              <div className="flex items-center gap-1.5 text-white/40 mb-1">
                <Activity className="w-3 h-3 text-[#eab308]" />
                <span className="text-[8px] font-black uppercase tracking-widest">
                  {t('predictions')}
                </span>
              </div>
              <span className="text-sm font-black text-white italic">124</span>
            </div>
            <div className="flex flex-col items-center px-3">
              <div className="flex items-center gap-1.5 text-white/40 mb-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span className="text-[8px] font-black uppercase tracking-widest">
                  {t('evaluated')}
                </span>
              </div>
              <span className="text-sm font-black text-white italic">118</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Header Row */}
      <RankRow isHeader entry={{} as any} className="bg-white/[0.05]" />

      {/* Scrollable List */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto divide-y divide-white/[0.05] pb-10 md:pb-24 scroll-smooth"
      >
        {entries.map((entry) => (
          <div key={entry.id} ref={entry.isCurrentUser ? userRowRef : null}>
            <RankRow entry={entry} />
          </div>
        ))}

        {entries.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full py-20 text-white/20">
            <Trophy className="w-12 h-12 mb-4 opacity-10" />
            <p className="font-bold uppercase tracking-widest">{t('empty_state')}</p>
          </div>
        )}
      </div>

      {/* Sticky Footer for Current User */}
      {currentUserEntry && (
        <div className="block absolute bottom-0 left-0 right-0 p-2 md:p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-8 md:pt-12 shrink-0 z-20">
          <div className="absolute top-2 md:top-6 left-1/2 -translate-x-1/2">
            <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em] text-[#eab308] animate-pulse">
              {t('click_to_go_to_your_position')}
            </span>
          </div>
          <RankRow
            entry={currentUserEntry}
            onClick={scrollToUser}
            className="bg-[#eab308]/20 backdrop-blur-xl border border-[#eab308]/40 shadow-[0_0_50px_rgba(234,179,8,0.2)] scale-90 md:scale-100 origin-bottom"
          />
        </div>
      )}
    </IceGlassCard>
  )
}
