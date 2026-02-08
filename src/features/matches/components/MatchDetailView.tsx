'use client'

import React, { useEffect } from 'react'
import type { Match, Prediction, Team } from '@/payload-types'
import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
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
  const router = useRouter()

  // Periodic Refresh every 2 minutes at odd minutes
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    let intervalId: NodeJS.Timeout

    const setupRefresh = () => {
      const now = new Date()
      const currentMin = now.getMinutes()
      const nextOddMin = currentMin % 2 === 0 ? currentMin + 1 : currentMin + 2

      const targetDate = new Date(now)
      targetDate.setMinutes(nextOddMin, 0, 0)
      const delay = targetDate.getTime() - now.getTime()

      timeoutId = setTimeout(() => {
        router.refresh()
        intervalId = setInterval(() => {
          router.refresh()
        }, 120000)
      }, delay)
    }

    setupRefresh()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
    }
  }, [router])

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
