import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { LobbyView } from '@/features/lobby/components/LobbyView'
import type { User } from '@/payload-types'

export default async function LobbyPage({ params }: { params: Promise<{ locale: string }> }) {
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

  // Fetch which competitions the user has already joined
  const joinedEntries = await payload.find({
    collection: 'leaderboard-entries',
    where: {
      user: { equals: user.id },
    },
    limit: 100,
  })

  const joinedCompetitionIds = joinedEntries.docs.map((entry) => {
    const comp = entry.competition
    return typeof comp === 'object' ? comp.id : comp
  }) as string[]

  return (
    <LobbyView
      user={user as unknown as User}
      competitions={competitions.docs}
      joinedCompetitionIds={joinedCompetitionIds}
    />
  )
}
