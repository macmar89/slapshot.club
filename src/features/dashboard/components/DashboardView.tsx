'use client'

import React from 'react'
import type { Competition, User, LeaderboardEntry, Match, Prediction } from '@/payload-types'
import { useTranslations } from 'next-intl'
import { DashboardHeader } from './DashboardHeader'
import { UserHeroCard } from './UserHeroCard'
import { UpcomingMatches } from './UpcomingMatches'
import { RecentResults } from './RecentResults'
import { UserStats } from './UserStats'
import { CompetitionSummary } from './CompetitionSummary'
import { ReferralLink } from '@/features/auth/components/ReferralLink'
import { IceGlassCard } from '@/components/ui/IceGlassCard'

interface DashboardViewProps {
  competition: Competition
  locale: string
  user: User | null
  leaderboardEntry: LeaderboardEntry | null
  neighbors: LeaderboardEntry[]
  upcomingMatches: Match[]
  allMatchesPredicted?: boolean
  recentPredictions: Prediction[]
}

export function DashboardView({
  competition,
  locale,
  user,
  leaderboardEntry,
  neighbors,
  upcomingMatches,
  allMatchesPredicted,
  recentPredictions,
}: DashboardViewProps) {
  const t = useTranslations('Account')

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
        allMatchesPredicted={allMatchesPredicted}
        competition={competition}
        locale={locale}
      />

      {/* Row 3: Results, Stats, Mini Leaderboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RecentResults recentPredictions={recentPredictions} />
        <UserStats leaderboardEntry={leaderboardEntry} />
        <IceGlassCard className="p-4 md:p-6 flex flex-col justify-center">
          {user?.referralData?.referralCode ? (
            <ReferralLink code={user.referralData.referralCode} align="center" className="w-full" />
          ) : (
            <div className="text-center py-6 text-white/20 text-xs font-bold uppercase tracking-[0.2em]">
              {t('referral_not_available')}
            </div>
          )}
        </IceGlassCard>
      </div>

      {/* Row 4: Competition Info */}
      <CompetitionSummary competition={competition} locale={locale} />
    </div>
  )
}
