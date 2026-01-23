import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound, redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { setRequestLocale } from 'next-intl/server'
import { LeaderboardView } from '@/features/leaderboard/components/LeaderboardView'
import type { League, LeaderboardEntry, User } from '@/payload-types'

export default async function CompetitionLeaderboard(props: {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { locale, slug } = await props.params
  setRequestLocale(locale)

  const headersList = await headers()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: headersList })

  if (!user) {
    redirect('/login')
  }

  // 1. Get Competition
  const competitionResult = await payload.find({
    collection: 'competitions',
    where: {
      slug: { equals: slug },
    },
    limit: 1,
    locale: locale as any,
  })

  const competition = competitionResult.docs[0]

  if (!competition) {
    notFound()
  }

  // Get search params for leagueId
  const searchParams = await props.searchParams
  const leagueId = searchParams.leagueId

  // 2. Get user's leagues in this competition (for the dropdown) - Still useful to pass to view if needed, but maybe redundant if Header handles it.
  // Actually, View doesn't need it if we remove the internal switcher.
  const userLeagues = await payload.find({
    collection: 'leagues',
    where: {
      and: [{ members: { contains: user.id } }, { competition: { equals: competition.id } }],
    },
    limit: 100,
  })

  let entries: LeaderboardEntry[] = []

  if (leagueId) {
    // 3. Fetch entries for members of the specific league
    const currentLeague = await payload.findByID({
      collection: 'leagues',
      id: leagueId as string,
      depth: 1,
    })

    if (currentLeague) {
      const memberIds = (currentLeague.members as User[]).map((m) =>
        typeof m === 'object' ? m.id : m,
      )
      const leaderboardEntries = await payload.find({
        collection: 'leaderboard-entries',
        where: {
          and: [{ competition: { equals: competition.id } }, { user: { in: memberIds } }],
        },
        sort: '-totalPoints',
        limit: 100,
      })
      entries = leaderboardEntries.docs as unknown as LeaderboardEntry[]
    }
  } else {
    // 3. Fetch initial leaderboard entries for this competition (top 100 global)
    const leaderboardEntries = await payload.find({
      collection: 'leaderboard-entries',
      where: {
        competition: { equals: competition.id },
      },
      sort: '-totalPoints',
      limit: 100,
    })
    entries = leaderboardEntries.docs as unknown as LeaderboardEntry[]
  }

  return (
    <LeaderboardView
      competition={competition}
      userLeagues={userLeagues.docs as unknown as League[]}
      initialEntries={entries}
      currentUser={user as unknown as User}
    />
  )
}
