import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { LeaguesView } from '@/features/leagues/components/LeaguesView'
import type { League } from '@/payload-types'

export default async function LeaguesPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const headersList = await headers()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: headersList })

  if (!user) {
    redirect('/login')
  }

  // 1. Get Competition ID from Slug
  const competitions = await payload.find({
    collection: 'competitions',
    where: {
      slug: { equals: slug },
    },
    limit: 1,
    locale: locale as any,
  })

  if (competitions.totalDocs === 0) {
    redirect('/dashboard')
  }

  const competition = competitions.docs[0]
  const competitionId = competition.id

  // 2. Fetch Owned Leagues (Filtered by Competition)
  const ownedLeagues = await payload.find({
    collection: 'leagues',
    where: {
      and: [{ owner: { equals: user.id } }, { competition: { equals: competitionId } }],
    },
    depth: 1,
    limit: 100,
  })

  // 3. Fetch Joined Leagues (Filtered by Competition)
  const joinedLeagues = await payload.find({
    collection: 'leagues',
    where: {
      and: [
        { members: { contains: user.id } },
        { owner: { not_equals: user.id } }, // Exclude owned
        { competition: { equals: competitionId } },
      ],
    },
    depth: 1,
    limit: 100,
  })

  return (
    <LeaguesView
      ownedLeagues={ownedLeagues.docs as unknown as League[]}
      joinedLeagues={joinedLeagues.docs as unknown as League[]}
      competitionId={competitionId}
    />
  )
}
