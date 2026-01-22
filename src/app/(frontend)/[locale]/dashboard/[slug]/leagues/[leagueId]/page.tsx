import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { LeagueDetailView } from '@/features/leagues/components/LeagueDetailView'
import type { League, User } from '@/payload-types'

export default async function LeagueDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; leagueId: string }>
}) {
  const { locale, slug, leagueId } = await params
  setRequestLocale(locale)

  const headersList = await headers()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: headersList })

  if (!user) {
    redirect('/login')
  }

  // Fetch League with populated members
  const leagueResult = await payload.findByID({
    collection: 'leagues',
    id: leagueId,
    depth: 2, // Populate members and owner
    locale: locale as any,
  })

  if (!leagueResult) {
    notFound()
  }

  const league = leagueResult as unknown as League

  // Verify access? If public, anyone can view. If private, only members?
  // User didn't specify, but implies "detail ligy". Usually members can see detail.
  // If I am not a member and it's private, maybe I shouldn't see it?
  // But Join feature implies I might find it via code? But this page is by ID.
  // Checking membership:
  const isMember = (league.members as User[]).some((m) => m.id === user.id)
  const isOwner = (league.owner as User).id === user.id

  // If not member and private, maybe redirect or show "Join" interstitial?
  // For now, assume if you have the link/ID, you verify membership or it's public.
  // Let's protect it: if not member and type is private -> 404 or redirect.
  // But wait, owner/Commissioner must access.
  if (league.type === 'private' && !isMember && !isOwner) {
    // Maybe 404 to hide existence?
    // Or redirect to list
    redirect(`/dashboard/${slug}/leagues`)
  }

  // Fetch Leaderboard Entries for these members in this competition
  const competitionId =
    typeof league.competition === 'object' ? league.competition.id : league.competition
  const memberIds = (league.members as User[]).map((m) => m.id)

  const leaderboardEntries = await payload.find({
    collection: 'leaderboard-entries',
    where: {
      and: [{ competition: { equals: competitionId } }, { user: { in: memberIds } }],
    },
    limit: 100,
  })

  // Map entries to user IDs for easy lookup
  const entryMap = Object.fromEntries(
    leaderboardEntries.docs.map((entry) => [
      typeof entry.user === 'object' ? entry.user.id : entry.user,
      entry,
    ]),
  )

  return (
    <LeagueDetailView
      league={league}
      currentUser={user as unknown as User}
      competitionSlug={slug}
      leaderboardEntries={entryMap}
    />
  )
}
