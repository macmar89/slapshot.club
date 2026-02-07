'use client'

import React from 'react'
import type { Match, Prediction, Team } from '@/payload-types'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { BackLink } from '@/components/ui/BackLink'
import { MatchDetailTabs } from './MatchDetailTabs'

interface MatchDetailViewProps {
  match: Match
  userPrediction?: Prediction
  stats?: {
    homeWin: number
    awayWin: number
    draw: number
    total: number
    exact: number
    diff: number
    trend: number
    wrong: number
  }
}

export function MatchDetailView({ match, userPrediction, stats }: MatchDetailViewProps) {
  const t = useTranslations('Dashboard.matches')
  const { slug } = useParams()

  const homeTeam = match.homeTeam as Team
  const awayTeam = match.awayTeam as Team

  const statsData = stats || {
    homeWin: 0,
    draw: 0,
    awayWin: 0,
    total: 0,
    exact: 0,
    diff: 0,
    trend: 0,
    wrong: 0,
  }
  const totalTips = statsData.total || 0
  const binaryTotal = statsData.homeWin + statsData.awayWin
  const homeWinPct = binaryTotal > 0 ? Math.round((statsData.homeWin / binaryTotal) * 100) : 0
  const awayWinPct = binaryTotal > 0 ? 100 - homeWinPct : 0

  return (
    <div className="max-w-[1000px] mx-auto space-y-6 md:space-y-8 sm:px-4 pb-12">
      <BackLink href={`/dashboard/${slug}/matches` as any} label={t('back_to_matches')} />

      <MatchDetailTabs
        match={match}
        userPrediction={userPrediction}
        statsData={statsData}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        totalTips={totalTips}
        homeWinPct={homeWinPct}
        awayWinPct={awayWinPct}
        binaryTotal={binaryTotal}
      />
    </div>
  )
}
