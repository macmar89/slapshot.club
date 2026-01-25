'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import { headers } from 'next/headers'
import type { League, User } from '@/payload-types'

export const getUserLeaguesForCompetition = async (competitionSlug: string, locale: string = 'sk') => {
  const payload = await getPayload({ config })
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })

  if (!user) {
    return { leagues: [], activeLeagueId: null }
  }

  // 1. Find competition by slug
  const competitionRes = await payload.find({
    collection: 'competitions',
    where: {
      slug: { equals: competitionSlug },
    },
    limit: 1,
    locale: locale as any,
  })

  // If fetching with locale fails or returns empty, try without validation or handle error
  const competition = competitionRes.docs[0]

  if (!competition) {
    return { leagues: [], activeLeagueId: null }
  }

  // 2. Find leagues where user is a member AND linked to this competition
  const leaguesRes = await payload.find({
    collection: 'leagues',
    where: {
      and: [
        { members: { contains: user.id } },
        { competition: { equals: competition.id } }
      ],
    },
    limit: 100,
  })

  // 3. Find user's leaderboard entry for this competition to get activeLeague preference
  const entryRes = await payload.find({
    collection: 'leaderboard-entries',
    where: {
      and: [
        { user: { equals: user.id } },
        { competition: { equals: competition.id } }
      ],
    },
    limit: 1,
    depth: 0,
  })

  // Determine activeLeagueId based on the entry
  let activeLeagueId: string | null = null
  if (entryRes.docs.length > 0) {
    const entry = entryRes.docs[0]
    // Relationship can be object or ID depending on depth/populate, but depth 0 ensures ID usually, 
    // though Typescript needs distinct handling. With depth 0 it's string.
    activeLeagueId = ((entry as any).activeLeague as string) || null
  }

  return {
    leagues: leaguesRes.docs as League[],
    activeLeagueId
  }
}

export const updateActiveLeagueAction = async (competitionSlug: string, leagueId: string | null) => {
  const payload = await getPayload({ config })
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })

  if (!user) {
    throw new Error('Unauthorized')
  }

  // 1. Find competition
  const competitionRes = await payload.find({
    collection: 'competitions',
    where: { slug: { equals: competitionSlug } },
    limit: 1,
  })
  const competition = competitionRes.docs[0]
  if (!competition) throw new Error('Competition not found')

  // 2. Find Entry
  const entryRes = await payload.find({
    collection: 'leaderboard-entries',
    where: {
      and: [
        { user: { equals: user.id } },
        { competition: { equals: competition.id } }
      ],
    },
    limit: 1,
  })

  if (entryRes.docs.length > 0) {
    // 3. Update Entry
    await payload.update({
      collection: 'leaderboard-entries',
      id: entryRes.docs[0].id,
      data: {
        activeLeague: leagueId,
      },
    })
  }
}
