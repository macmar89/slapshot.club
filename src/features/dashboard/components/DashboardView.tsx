'use client'

import React from 'react'
import type { Competition, User, LeaderboardEntry, Match, Prediction } from '@/payload-types'
import { DashboardHeader } from './DashboardHeader'
import { UserHeroCard } from './UserHeroCard'
import { UpcomingMatches } from './UpcomingMatches'
import { RecentResults } from './RecentResults'
import { UserStats } from './UserStats'
import { MiniLeaderboard } from './MiniLeaderboard'
import { CompetitionSummary } from './CompetitionSummary'

interface DashboardViewProps {
  competition: Competition
  locale: string
  user: User | null
  leaderboardEntry: LeaderboardEntry | null
  neighbors: LeaderboardEntry[]
  upcomingMatches: Match[]
  recentPredictions: Prediction[]
}

export function DashboardView({
  competition,
  locale,
  user,
  leaderboardEntry,
  neighbors,
  upcomingMatches,
  recentPredictions,
}: DashboardViewProps) {
  return (
    <div className="space-y-6">
      {/* Row 1: Header and Hero Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <DashboardHeader competition={competition} />

        {user && <UserHeroCard user={user} leaderboardEntry={leaderboardEntry} />}
      </div>

      {/* Row 2: Upcoming Matches Section */}
      <UpcomingMatches
        upcomingMatches={upcomingMatches}
        competition={competition}
        locale={locale}
      />

      {/* Row 3: Results, Stats, Mini Leaderboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RecentResults recentPredictions={recentPredictions} />
        <UserStats leaderboardEntry={leaderboardEntry} />
        <MiniLeaderboard
          neighbors={neighbors}
          user={user}
          competitionId={competition.id}
          locale={locale}
          leaderboardEntry={leaderboardEntry}
        />
      </div>

      {/* Row 4: Competition Info */}
      <CompetitionSummary competition={competition} locale={locale} />
    </div>
  )
}
