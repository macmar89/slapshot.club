'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import type { User, LeaderboardEntry, Prediction, Match, Team, Competition } from '@/payload-types'

const safeDiv = (num: number, den: number) => (den > 0 ? num / den : 0)

export type PlayerStats = {
  totalPoints: number
  totalMatches: number
  exactGuesses: number
  correctTrends: number
  correctDiffs: number
  averagePoints: number
  successRate: number
  sniperRate: number
  trendRate: number
}

export type PlayerActiveLeague = {
  competition: Competition
  rank: number
  points: number
  previousRank?: number | null
  totalMatches: number
  exactGuesses: number
  correctTrends: number
  correctDiffs: number
  averagePoints: number
  successRate: number
  lastPredictions: Prediction[]
}

export const getPlayerByUsername = async (username: string): Promise<User | null> => {
  const payload = await getPayload({ config })

  // Use 'like' for case-insensitive search (usually maps to ILIKE %...%)
  // Then filter in-memory to ensure exact match (not substring)
  const result = await payload.find({
    collection: 'users',
    where: {
      username: {
        like: username,
      },
    },
    limit: 10, // Increase limit to handle potential substring matches
  })

  // Find exact case-insensitive match
  const exactMatch = result.docs.find((u) => u.username.toLowerCase() === username.toLowerCase())

  return exactMatch || null
}

export const getPlayerStats = async (
  userId: string,
  isLocked: boolean = false,
): Promise<{ globalStats: PlayerStats | null; leagues: PlayerActiveLeague[] }> => {
  const payload = await getPayload({ config })

  // Fetch specific leaderboard entries for active leagues
  const entries = await payload.find({
    collection: 'leaderboard-entries',
    where: {
      user: {
        equals: userId,
      },
    },
    depth: 1, // To get competition details
    limit: 100,
  })

  if (isLocked) {
    const leagues: PlayerActiveLeague[] = entries.docs.map((entry) => {
      return {
        competition: entry.competition as Competition,
        rank: entry.currentRank || 0,
        points: 0,
        totalMatches: 0,
        exactGuesses: 0,
        correctTrends: 0,
        correctDiffs: 0,
        averagePoints: 0,
        successRate: 0,
        lastPredictions: [],
      }
    })

    return { globalStats: null, leagues }
  }

  const leagues: PlayerActiveLeague[] = entries.docs.map((entry) => {
    const totalMatches = entry.totalMatches || 0
    const exactGuesses = entry.exactGuesses || 0
    const correctTrends = entry.correctTrends || 0
    const correctDiffs = entry.correctDiffs || 0
    const totalPoints = entry.totalPoints || 0

    return {
      competition: entry.competition as Competition,
      rank: entry.currentRank || 0,
      points: totalPoints,
      previousRank: entry.previousRank,
      totalMatches,
      exactGuesses,
      correctTrends,
      correctDiffs,
      averagePoints: safeDiv(totalPoints, totalMatches),
      successRate: safeDiv(exactGuesses + correctTrends + correctDiffs, totalMatches) * 100,
      lastPredictions: [],
    }
  })

  // Fetch last 5 evaluated predictions for each competition
  await Promise.all(
    leagues.map(async (league) => {
      const predictions = await payload.find({
        collection: 'predictions',
        where: {
          and: [
            { user: { equals: userId } },
            { 'match.competition': { equals: league.competition.id } },
            { status: { equals: 'evaluated' } },
          ],
        },
        sort: '-createdAt',
        limit: 5,
        depth: 0,
      })
      league.lastPredictions = predictions.docs as any
    }),
  )

  // Calculate aggregated stats from leaderboard entries
  // Note: LeaderboardEntries are per competition. To get a "global" view,
  // we might want to sum them up OR use the stats already present on the User object if available.
  // The User object has `stats` group which seems to be global.

  // Let's re-fetch user with depth to be sure (although we might have it from getPlayerByUsername)
  // For now, let's aggregate from entries as that gives us granular control.

  let totalPoints = 0
  let totalMatches = 0
  let exactGuesses = 0
  let correctTrends = 0
  let correctDiffs = 0

  entries.docs.forEach((entry) => {
    totalPoints += entry.totalPoints || 0
    totalMatches += entry.totalMatches || 0
    exactGuesses += entry.exactGuesses || 0
    correctTrends += entry.correctTrends || 0
    correctDiffs += entry.correctDiffs || 0
  })

  const globalStats: PlayerStats = {
    totalPoints,
    totalMatches,
    exactGuesses,
    correctTrends,
    correctDiffs,
    averagePoints: safeDiv(totalPoints, totalMatches),
    successRate: safeDiv(exactGuesses + correctTrends + correctDiffs, totalMatches) * 100,
    sniperRate: safeDiv(exactGuesses, totalMatches) * 100,
    trendRate: safeDiv(correctTrends, totalMatches) * 100,
  }

  return { globalStats, leagues }
}

export type PredictionsResult = {
  docs: Prediction[]
  totalDocs: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  nextPage?: number | null
  prevPage?: number | null
  totalLeaguePredictions?: number
}

export const getPlayerPredictions = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
  search?: string,
  competitionId?: string,
  teamId?: string,
): Promise<PredictionsResult> => {
  const payload = await getPayload({ config })

  const where: any = {
    user: {
      equals: userId,
    },
    points: {
      not_equals: null,
    },
  }

  // Filter by search or explicit teamId
  if (teamId || search) {
    let matchIds: string[] = []

    if (teamId) {
      const searchMatches = await payload.find({
        collection: 'matches',
        where: {
          and: [
            ...(competitionId ? [{ competition: { equals: competitionId } }] : []),
            { status: { equals: 'finished' } },
            {
              or: [{ homeTeam: { equals: teamId } }, { awayTeam: { equals: teamId } }],
            },
          ],
        },
        limit: 1000,
        pagination: false,
        sort: '-date',
        select: { id: true },
      })
      matchIds = searchMatches.docs.map((m) => m.id)
    } else if (search) {
      const teams = await payload.find({
        collection: 'teams',
        where: {
          or: [{ name: { contains: search } }, { shortName: { contains: search } }],
        },
        limit: 100,
        pagination: false,
        select: { id: true },
      })

      const teamIds = teams.docs.map((t) => t.id)

      const searchMatches = await payload.find({
        collection: 'matches',
        where: {
          and: [
            ...(competitionId ? [{ competition: { equals: competitionId } }] : []),
            { status: { equals: 'finished' } },
            {
              or: [{ homeTeam: { in: teamIds } }, { awayTeam: { in: teamIds } }],
            },
          ],
        },
        limit: 1000,
        pagination: false,
        sort: '-date',
        select: { id: true },
      })
      matchIds = searchMatches.docs.map((m) => m.id)
    }

    where.match = { in: matchIds }
  } else if (competitionId) {
    // Filter predictions by finished matches in this competition
    const matchesInCompetition = await payload.find({
      collection: 'matches',
      where: {
        and: [{ competition: { equals: competitionId } }, { status: { equals: 'finished' } }],
      },
      limit: 1000,
      pagination: false,
      sort: '-date',
      select: { id: true },
    })
    const matchIds = matchesInCompetition.docs.map((m) => m.id)

    if (where.match) {
      // If we already filtered (e.g. by search), we'd need $and.
      // For now, simple override or AND logic.
      // Payload 'where' with AND is: { and: [ ... ] }
      // But simple:
      where.match = { in: matchIds }
    } else {
      where.match = { in: matchIds }
    }
  }

  const predictions = await payload.find({
    collection: 'predictions',
    where,
    sort: '-match.date', // Sort by match date descending (might need join sort support or just -createdAt)
    // Payload can sort by direct fields. match.date might not work directly.
    // Let's rely on '-createdAt' which usually correlates, or '-id'.
    // Actually, usually we default to CreatedAt for predictions.
    // User wants "Newest matches".
    // If Payload supports sort by nested: '-match.date' would be great.
    // If not, we might need to fetch and sort in memory (if small set) or accept creation order.
    // Creation order is "when user tipped". Match date is "when game is".
    // Usually tips are made before match, so it's roughly correlated but not creating order = match order.
    // Let's try '-createdAt' for MVP to ensure stability.
    limit,
    page,
    depth: 3, // Need match, teams, and logos
  })

  // Manual sort/filter if needed could go here

  // Get total count of ALL predictions in this competition for the user (including non-evaluated)
  let totalLeaguePredictions = 0
  if (competitionId) {
    const allUserPredictionsInLeague = await payload.find({
      collection: 'predictions',
      where: {
        and: [{ user: { equals: userId } }, { 'match.competition': { equals: competitionId } }],
      },
      limit: 0,
      pagination: true,
    })
    totalLeaguePredictions = allUserPredictionsInLeague.totalDocs
  }

  return {
    docs: predictions.docs as any,
    totalDocs: predictions.totalDocs,
    totalPages: predictions.totalPages,
    hasNextPage: predictions.hasNextPage,
    hasPrevPage: predictions.hasPrevPage,
    nextPage: predictions.nextPage || null,
    prevPage: predictions.prevPage || null,
    totalLeaguePredictions,
  }
}

export const getCompetitionTeams = async (competitionId: string): Promise<Team[]> => {
  const payload = await getPayload({ config })

  // Find all matches in the competition to get the team IDs
  const matches = await payload.find({
    collection: 'matches',
    where: {
      competition: {
        equals: competitionId,
      },
    },
    limit: 1000,
    pagination: false,
    select: {
      homeTeam: true,
      awayTeam: true,
    },
  })

  const teamIds = new Set<string>()
  matches.docs.forEach((m) => {
    if (typeof m.homeTeam === 'string') teamIds.add(m.homeTeam)
    else if (m.homeTeam?.id) teamIds.add(m.homeTeam.id)

    if (typeof m.awayTeam === 'string') teamIds.add(m.awayTeam)
    else if (m.awayTeam?.id) teamIds.add(m.awayTeam.id)
  })

  if (teamIds.size === 0) return []

  const teams = await payload.find({
    collection: 'teams',
    where: {
      id: {
        in: Array.from(teamIds),
      },
    },
    limit: 1000,
    pagination: false,
    depth: 1, // Get logo
  })

  return teams.docs as Team[]
}
