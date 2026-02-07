'use client'

import React from 'react'
import type { Competition, League, LeaderboardEntry, User } from '@/payload-types'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { Info } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { LeaderboardList } from './LeaderboardList'
import { useRouter, usePathname } from '@/i18n/routing'
import { useSearchParams, useParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/layout/PageHeader'
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
      <PageHeader
        title={competition.name}
        description={t('description')}
        className="mb-4"
        hideDescriptionOnMobile
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
          <Info className="w-3.5 h-3.5 text-white/40 shrink-0" />
          <span className="text-[10px] md:text-xs font-medium text-white/60 leading-tight">
            {t('rank_update_info')}
          </span>
        </div>
      </PageHeader>

      <div className="flex-1 min-h-0">
        <LeaderboardList
          tab={selectedLeagueId ? 'leagues' : 'global'}
          leagueId={selectedLeagueId}
          initialEntries={initialEntries}
          currentUser={currentUser}
          competitionId={competition.id}
          totalPlayedMatches={competition.totalPlayedMatches}
          totalPossiblePoints={competition.totalPossiblePoints}
        />
      </div>
    </div>
  )
}
