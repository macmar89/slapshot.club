import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { DashboardView } from '@/features/dashboard/components/DashboardView'
import { getCurrentUser } from '@/features/auth/actions'

export default async function CompetitionDashboard({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const payload = await getPayload({ config })
  const user = await getCurrentUser()

  const { docs: competitions } = await payload.find({
    collection: 'competitions',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    locale: locale as any,
  })

  const competition = competitions[0]

  if (!competition) {
    notFound()
  }

  let leaderboardEntry = null
  let neighbors: any[] = []
  let upcomingMatches: any[] = []
  let recentPredictions: any[] = []

  if (user) {
    // 1. Leaderboard Entry
    const { docs: entries } = await payload.find({
      collection: 'leaderboard-entries',
      where: {
        and: [{ user: { equals: user.id } }, { competition: { equals: competition.id } }],
      },
      limit: 1,
    })
    leaderboardEntry = entries[0] || null

    if (leaderboardEntry && leaderboardEntry.currentRank) {
      // 2. Neighbors (+2 / -2)
      const { docs: neighborEntries } = await payload.find({
        collection: 'leaderboard-entries',
        where: {
          and: [
            { competition: { equals: competition.id } },
            {
              currentRank: {
                greater_than_equal: Math.max(1, (leaderboardEntry.currentRank as number) - 2),
              },
            },
            {
              currentRank: {
                less_than_equal: (leaderboardEntry.currentRank as number) + 2,
              },
            },
          ],
        },
        sort: 'currentRank',
      })
      neighbors = neighborEntries
    }

    // 3. Next Match (not predicted)
    // First, get all predictions by this user for this competition
    const { docs: userPredictions } = await payload.find({
      collection: 'predictions',
      where: {
        user: { equals: user.id },
      },
      depth: 0,
      limit: 1000,
    })
    const predictedMatchIds = userPredictions.map((p: any) =>
      typeof p.match === 'string' ? p.match : p.match.id,
    )

    const { docs: fetchedUpcoming } = await payload.find({
      collection: 'matches',
      where: {
        and: [
          { competition: { equals: competition.id } },
          { status: { equals: 'scheduled' } },
          {
            id: {
              not_in: predictedMatchIds,
            },
          },
          {
            date: {
              greater_than: new Date().toISOString(),
            },
          },
        ],
      },
      sort: 'date',
      limit: 3,
      depth: 2,
    })
    upcomingMatches = fetchedUpcoming

    // 4. Recent Predictions (last 3 evaluated)
    const { docs: recent } = await payload.find({
      collection: 'predictions',
      where: {
        and: [{ user: { equals: user.id } }, { status: { equals: 'evaluated' } }],
      },
      sort: '-updatedAt',
      limit: 3,
    })
    recentPredictions = recent
  }

  return (
    <DashboardView
      competition={competition}
      locale={locale}
      user={user}
      leaderboardEntry={leaderboardEntry}
      neighbors={neighbors}
      upcomingMatches={upcomingMatches || []}
      recentPredictions={recentPredictions}
    />
  )
}
