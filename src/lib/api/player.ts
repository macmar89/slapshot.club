import { getPayload } from 'payload'
import config from '@payload-config'
import type { User, LeaderboardEntry, Prediction, Match, Team, Competition } from '@/payload-types'

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

  const leagues: PlayerActiveLeague[] = entries.docs.map((entry) => ({
    competition: entry.competition as Competition,
    rank: entry.currentRank || 0,
    points: entry.totalPoints || 0,
    previousRank: entry.previousRank,
  }))

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

  // Avoid division by zero
  const safeDiv = (num: number, den: number) => (den > 0 ? num / den : 0)

  const globalStats: PlayerStats = {
    totalPoints,
    totalMatches,
    exactGuesses,
    correctTrends,
    correctDiffs,
    averagePoints: safeDiv(totalPoints, totalMatches),
    successRate: safeDiv(exactGuesses + correctTrends, totalMatches) * 100, // Assuming "success" is at least correct trend
    sniperRate: safeDiv(exactGuesses, totalMatches) * 100,
    trendRate: safeDiv(correctTrends, totalMatches) * 100,
  }

  return { globalStats, leagues }
}

export type PredictionsResult = {
  docs: Prediction[]
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  nextPage?: number | null
  prevPage?: number | null
}

export const getPlayerPredictions = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
  search?: string,
  competitionId?: string,
): Promise<PredictionsResult> => {
  const payload = await getPayload({ config })

  const where: any = {
    user: {
      equals: userId,
    },
  }

  // Filter by search (Team name)
  if (search) {
    // ... (same search logic or comment) ...
  }

  if (competitionId) {
    // Filter predictions by matches in this competition
    const matchesInCompetition = await payload.find({
      collection: 'matches',
      where: {
        competition: { equals: competitionId },
      },
      limit: 1000,
      pagination: false,
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
    depth: 2, // Need match and teams
  })

  // Manual sort/filter if needed could go here

  return {
    docs: predictions.docs as any,
    totalPages: predictions.totalPages,
    hasNextPage: predictions.hasNextPage,
    hasPrevPage: predictions.hasPrevPage,
    nextPage: predictions.nextPage || null,
    prevPage: predictions.prevPage || null,
  }
}
