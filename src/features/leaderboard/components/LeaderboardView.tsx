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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg md:text-3xl font-black uppercase text-[#eab308] md:text-white tracking-widest md:tracking-wide text-center md:text-left leading-none">
            {competition.name}
          </h1>
          <p className="hidden md:block text-white/60 text-base">{t('description')}</p>
        </div>

        {/* Tabs / Navigation - Removed as handled by global Header */}
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
