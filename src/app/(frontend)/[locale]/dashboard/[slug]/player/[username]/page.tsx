import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { setRequestLocale } from 'next-intl/server'
import { getPlayerByUsername, getPlayerStats, getPlayerPredictions } from '@/lib/api/player'
import { PlayerDetailView } from '@/features/player/components/PlayerDetailView'
import type { User } from '@/payload-types'
import { Metadata } from 'next'

export async function generateMetadata(props: {
  params: Promise<{ locale: string; username: string; slug: string }>
}): Promise<Metadata> {
  const { username, slug } = await props.params
  const decodedUsername = decodeURIComponent(username)

  return {
    title: `${decodedUsername} - Player Profile - Slapshot Club`,
  }
}

export default async function PlayerPage(props: {
  params: Promise<{ locale: string; slug: string; username: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { locale, slug, username } = await props.params
  setRequestLocale(locale)

  const decodedUsername = decodeURIComponent(username)

  const headersList = await headers()
  const payload = await getPayload({ config })
  const { user: currentUser } = await payload.auth({ headers: headersList })

  // 1. Get Target User
  const targetPlayer = await getPlayerByUsername(decodedUsername)
  if (!targetPlayer) {
    notFound()
  }

  // 2. Validate Competition
  const competitionResult = await payload.find({
    collection: 'competitions',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const competition = competitionResult.docs[0]
  if (!competition) {
    notFound()
  }

  // 3. Verify User is in this Competition
  // Check LeaderboardEntries
  const entryResult = await payload.find({
    collection: 'leaderboard-entries',
    where: {
      and: [{ user: { equals: targetPlayer.id } }, { competition: { equals: competition.id } }],
    },
    limit: 1,
  })

  // If player has no entry in this competition, 404 (?) or show limited profile?
  // User requested: "so the detail doesn't have to be displayed in every competition"
  // Assuming 404 is appropriate if they are not part of it.
  if (entryResult.totalDocs === 0) {
    notFound() // Or maybe a friendly "Player not in this competition" page
  }

  // Fetch Stats (Global for now, or should we filter by competition?)
  // For MVP let's keep Global Stats but maybe we can emphasize the competition entry stats.
  // 4. Fetch Stats
  const playerStats = await getPlayerStats(targetPlayer.id)

  // 5. Sub Check & Predictions logic
  const isMe = currentUser?.id === targetPlayer.id
  const userPlan = currentUser?.subscription?.plan
  const isPro = userPlan === 'pro' || userPlan === 'vip' || currentUser?.role === 'admin'
  const isLocked = !isMe && !isPro

  const searchParamsValue = await props.searchParams
  const tab = (searchParamsValue.tab as string) || 'overview'
  const page = Number(searchParamsValue.page) || 1
  const search = searchParamsValue.q as string | undefined

  let predictionsResult: any = {
    docs: [],
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    page: 1,
  }

  if (tab === 'predictions' && !isLocked) {
    predictionsResult = await getPlayerPredictions(
      targetPlayer.id,
      page,
      10,
      search,
      competition.id,
    )
  }

  return (
    <PlayerDetailView
      user={targetPlayer}
      currentUser={currentUser as User}
      stats={playerStats}
      predictions={predictionsResult.docs}
      predictionsPagination={{
        totalPages: predictionsResult.totalPages,
        hasNextPage: predictionsResult.hasNextPage,
        hasPrevPage: predictionsResult.hasPrevPage,
        page: predictionsResult.page || page,
      }}
      isLocked={isLocked}
      competitionSlug={slug}
    />
  )
}
