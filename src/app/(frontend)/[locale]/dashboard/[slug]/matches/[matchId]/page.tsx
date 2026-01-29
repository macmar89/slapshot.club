import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { MatchDetailView } from '@/features/matches/components/MatchDetailView'
import { getCurrentUser } from '@/features/auth/actions'
import { headers } from 'next/headers'
import { calculatePoints } from '@/features/matches/utils/scoring'

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; matchId: string }>
}) {
  const { locale, matchId } = await params
  setRequestLocale(locale)

  const payload = await getPayload({ config })
  const user = await getCurrentUser()
  const headersList = await headers()

  // 1. Fetch match with full depth for teams/media
  const match = await payload.findByID({
    collection: 'matches',
    id: matchId,
    depth: 2,
    locale: locale as any,
  })

  if (!match) {
    notFound()
  }

  // 2. Fetch user's prediction if logged in
  let userPrediction = undefined
  if (user) {
    const { docs: predictions } = await payload.find({
      collection: 'predictions',
      where: {
        and: [
          { match: { equals: matchId } },
          { user: { equals: user.id } }
        ]
      },
      limit: 1,
    })
    userPrediction = predictions[0]
  }

  // 3. Fetch stats for this match
  const allPredictionsRes = await payload.find({
    collection: 'predictions',
    where: {
      match: { equals: matchId }
    },
    limit: 10000,
    select: {
      homeGoals: true,
      awayGoals: true,
      isExact: true,
      isDiff: true,
      isTrend: true,
      isWrong: true,
    }
  })

  const stats = { 
    homeWin: 0, 
    awayWin: 0, 
    draw: 0, 
    total: allPredictionsRes.docs.length,
    exact: 0,
    diff: 0,
    trend: 0,
    wrong: 0
  }

  allPredictionsRes.docs.forEach((p: any) => {
    // Basic win/loss stats
    if (p.homeGoals > p.awayGoals) stats.homeWin++
    else if (p.awayGoals > p.homeGoals) stats.awayWin++
    else stats.draw++

    // Detailed accuracy stats (Calculated for finished OR live matches)
    if (match.status === 'finished' || match.status === 'live') {
      const predForCalc = { ...p }
      const matchForCalc = { ...match }
      
      const calc = calculatePoints(predForCalc, matchForCalc)
      if (calc.isExact) stats.exact++
      else if (calc.isDiff) stats.diff++
      else if (calc.isTrend) stats.trend++
      else if (calc.isWrong) stats.wrong++

      // Also update userPrediction if it's the current user's
      if (user && userPrediction && (p as any).id === userPrediction.id) {
        userPrediction.isExact = calc.isExact
        userPrediction.isDiff = calc.isDiff
        userPrediction.isTrend = calc.isTrend
        userPrediction.isWrong = calc.isWrong
        
        // If live, show potential points
        if (match.status === 'live') {
          (userPrediction as any).potentialPoints = calc.points
        }
      }
    }
  })

  return (
    <div className="container py-8">
      <MatchDetailView 
        match={match as any} 
        userPrediction={userPrediction as any}
        stats={stats}
      />
    </div>
  )
}
