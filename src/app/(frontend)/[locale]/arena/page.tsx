import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { ArenaView } from '@/features/arena/components/ArenaView'
import type { User } from '@/payload-types'

export default async function ArenaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const headersList = new Headers(await headers())
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: headersList })

  if (!user) {
    redirect('/login')
  }

  // Fetch competitions (limit to 100 for now)
  const competitions = await payload.find({
    collection: 'competitions',
    sort: 'startDate',
    limit: 100,
    locale: locale as any,
  })

  // Fetch which competitions the user has already joined and their rankings
  const userEntries = await payload.find({
    collection: 'leaderboard-entries',
    where: {
      user: { equals: user.id },
    },
    limit: 100,
  })

  const joinedCompetitionIds = userEntries.docs.map((entry) => {
    const comp = entry.competition
    return typeof comp === 'object' ? comp.id : comp
  }) as string[]

  const userRankings: Record<string, number> = {}
  userEntries.docs.forEach((entry) => {
    const compId = typeof entry.competition === 'object' ? entry.competition.id : entry.competition
    if (entry.currentRank) {
      userRankings[compId] = entry.currentRank
    }
  })

  // Fetch participant counts for all relevant competitions
  const competitionIds = competitions.docs.map((c) => c.id)
  const participantCounts: Record<string, number> = {}

  // Using Promise.all for better performance
  await Promise.all(
    competitionIds.map(async (id) => {
      const { totalDocs } = await payload.find({
        collection: 'leaderboard-entries',
        where: {
          competition: { equals: id },
        },
        limit: 1, // We only need the total count
      })
      participantCounts[id] = totalDocs
    }),
  )

  return (
    <ArenaView
      user={user as unknown as User}
      competitions={competitions.docs}
      joinedCompetitionIds={joinedCompetitionIds}
      participantCounts={participantCounts}
      userRankings={userRankings}
    />
  )
}
