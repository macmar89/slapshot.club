'use client'

import React from 'react'
import type { Competition, League, LeaderboardEntry, User } from '@/payload-types'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { useTranslations } from 'next-intl'
import { LeaderboardList } from './LeaderboardList'
import { useRouter, usePathname } from '@/i18n/routing'
import { useSearchParams, useParams } from 'next/navigation'
import { cn } from '@/lib/utils'
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
  const searchParams = useSearchParams()

  const selectedLeagueId = searchParams.get('leagueId')

  return (
    <div className="h-[calc(100dvh-8rem)] md:h-[calc(100dvh-7rem)] flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-5xl font-black italic uppercase text-white tracking-tighter leading-none">
            <span className="text-warning">{competition.name}</span>
          </h1>
          <p className="text-white font-bold uppercase tracking-[0.3em] text-[0.65rem] md:text-xs ">
            {t('description')}
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <LeaderboardList
          tab={selectedLeagueId ? 'leagues' : 'global'}
          leagueId={selectedLeagueId}
          initialEntries={initialEntries}
          currentUser={currentUser}
          competitionId={competition.id}
        />
      </div>
    </div>
  )
}
