'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import { headers } from 'next/headers'
import type { Match, Prediction } from '@/payload-types'

/**
 * Fetches matches for a specific competition,
 * including the current user's predictions and global stats.
 */
export const getMatchesAction = async (competitionId: string, leagueId?: string) => {
  const payload = await getPayload({ config })
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })

  if (!user) {
    throw new Error('Unauthorized')
  }

  // 1. Fetch all matches for this competition
  const matchesRes = await payload.find({
    collection: 'matches',
    where: {
      competition: { equals: competitionId },
    },
    sort: 'date',
    limit: 1000,
    depth: 2, // To get team details and logos (media)
  })

  const matches = matchesRes.docs as Match[]

  // 2. Fetch current user's predictions for these matches
  const userPredictionsRes = await payload.find({
    collection: 'predictions',
    where: {
      user: { equals: user.id },
      match: { in: matches.map((m) => m.id) },
    },
    limit: 1000,
  })

  // 3. Fetch global prediction stats OR League stats
  let userIdsFilter: string[] | null = null

  if (leagueId) {
    const league = await payload.findByID({
      collection: 'leagues',
      id: leagueId,
      depth: 0,
    })

    if (league && league.members) {
      userIdsFilter = (league.members as any[]).map((m) => (typeof m === 'string' ? m : m.id))
    }
  }

  // For performance in a real app, this should be pre-calculated or use a custom endpoint.
  // Here we'll fetch all predictions for these matches to calculate percentages.
  // NOTE: If there are thousands of users, this needs a more efficient approach (e.g. aggregation).
  const whereCondition: any = {
    match: { in: matches.map((m) => m.id) },
  }

  if (userIdsFilter) {
    whereCondition.user = { in: userIdsFilter }
  }

  const allPredictionsRes = await payload.find({
    collection: 'predictions',
    where: whereCondition,
    limit: 10000, // Reasonable limit for now
    select: {
      match: true,
      homeGoals: true,
      awayGoals: true,
    },
  })

  const statsMap: Record<
    string,
    { homeWin: number; awayWin: number; draw: number; total: number }
  > = {}

  allPredictionsRes.docs.forEach((p: any) => {
    const matchId = typeof p.match === 'string' ? p.match : p.match.id
    if (!statsMap[matchId]) {
      statsMap[matchId] = { homeWin: 0, awayWin: 0, draw: 0, total: 0 }
    }
    statsMap[matchId].total++
    if (p.homeGoals > p.awayGoals) statsMap[matchId].homeWin++
    else if (p.awayGoals > p.homeGoals) statsMap[matchId].awayWin++
    else statsMap[matchId].draw++
  })

  return {
    matches,
    userPredictions: userPredictionsRes.docs as Prediction[],
    stats: statsMap,
  }
}

/**
 * Saves or updates a prediction for a match.
 */
export const savePredictionAction = async (data: {
  matchId: string
  homeGoals: number
  awayGoals: number
}) => {
  try {
    const payload = await getPayload({ config })
    const headersList = await headers()
    const { user } = await payload.auth({ headers: headersList })

    if (!user) {
      console.error('[SAVE PREDICTION] Unauthorized access attempt')
      return { error: 'Unauthorized', code: 'UNAUTHORIZED' }
    }

    // 0. Validate if it's not a draw
    if (data.homeGoals === data.awayGoals) {
      return { error: 'Remíza nie je povolená. Vyberte víťaza.', code: 'NO_DRAW' }
    }

    // 1. Fetch match to validate start time
    const match = await payload.findByID({
      collection: 'matches',
      id: data.matchId,
    })

    if (!match) {
      console.error(`[SAVE PREDICTION] Match ${data.matchId} not found`)
      return { error: 'Zápas sa nenašiel.', code: 'MATCH_NOT_FOUND' }
    }

    // 2. Strict validation: Check if match has already started
    const now = new Date()
    const matchDate = new Date(match.date)
    if (now > matchDate) {
      return {
        error: 'Zápas už začal. Nie je možné pridať alebo upraviť tip.',
        code: 'MATCH_STARTED',
      }
    }

    // Check if prediction already exists
    const existing = await payload.find({
      collection: 'predictions',
      where: {
        user: { equals: user.id },
        match: { equals: data.matchId },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      // Update
      const updated = await payload.update({
        collection: 'predictions',
        id: existing.docs[0].id,
        data: {
          homeGoals: data.homeGoals,
          awayGoals: data.awayGoals,
        },
      })
      return { success: true, data: JSON.parse(JSON.stringify(updated)) }
    } else {
      // Create
      const created = await payload.create({
        collection: 'predictions',
        data: {
          user: user.id,
          match: data.matchId,
          homeGoals: data.homeGoals,
          awayGoals: data.awayGoals,
          status: 'pending',
        },
      })
      return { success: true, data: JSON.parse(JSON.stringify(created)) }
    }
  } catch (error: any) {
    console.error('[SAVE PREDICTION ERROR]', error)
    return {
      error: error.message || 'Nepodarilo sa uložiť tip. Skúste to prosím neskôr.',
      code: 'SERVER_ERROR',
    }
  }
}

/**
 * Fetches paginated predictions for a match with optional search.
 */
export const getMatchPredictionsAction = async ({
  matchId,
  page = 1,
  limit = 10,
  search,
}: {
  matchId: string
  page?: number
  limit?: number
  search?: string
}) => {
  const payload = await getPayload({ config })

  const where: any = {
    match: { equals: matchId },
  }

  if (search) {
    const users = await payload.find({
      collection: 'users',
      where: {
        username: { like: search },
      },
      limit: 100,
    })

    if (users.docs.length === 0) {
      return {
        docs: [],
        totalDocs: 0,
        limit,
        totalPages: 0,
        page,
        pagingCounter: 0,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null,
      }
    }

    where.user = { in: users.docs.map((u) => u.id) }
  }

  const predictions = await payload.find({
    collection: 'predictions',
    where,
    limit,
    page,
    sort: '-points',
    depth: 1,
  })

  return predictions
}
