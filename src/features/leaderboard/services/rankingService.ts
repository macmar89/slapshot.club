import { BasePayload } from 'payload'

type RankEntry = {
  entry: any // LeaderboardEntry
  points: number
  exactGuesses: number
  winnerDiff: number
  winner: number // correctTrends
  adjacent: number
  totalTips: number
  userId: string
  tierRank: number
}

interface RecalculateRanksOptions {
  createSnapshot?: boolean
}

/**
 * Core logic to recalculate rankings for a competition.
 */
export async function recalculateCompetitionRanks(
  payload: BasePayload,
  competitionId: string,
  options: RecalculateRanksOptions = {},
) {
  const now = new Date()

  // 1. Fetch Active Memberships for Tie-Breaking
  const memberships = await payload.find({
    collection: 'user-memberships',
    where: {
      status: { equals: 'active' },
    },
    limit: 10000,
    depth: 1,
  })

  const userTierMap = new Map<string, number>()
  memberships.docs.forEach((m: any) => {
    const userId = typeof m.user === 'string' ? m.user : m.user?.id
    const tierRank = typeof m.tier === 'object' ? m.tier?.rank || 0 : 0
    const current = userTierMap.get(userId) || 0
    if (tierRank > current) {
      userTierMap.set(userId, tierRank)
    }
  })

  // 2. Fetch all entries for this competition
  let page = 1
  let hasNextPage = true
  let allEntries: any[] = []

  while (hasNextPage) {
    const entries = await payload.find({
      collection: 'leaderboard-entries',
      where: {
        competition: { equals: competitionId },
      },
      limit: 500,
      page,
    })
    allEntries = [...allEntries, ...entries.docs]
    hasNextPage = entries.hasNextPage
    page++
  }

  if (allEntries.length === 0) return

  // 3. Sort entries
  const sortedEntries: RankEntry[] = allEntries
    .map((e) => ({
      entry: e,
      userId: typeof e.user === 'string' ? e.user : e.user.id,
      points: e.totalPoints || 0,
      exactGuesses: e.exactGuesses || 0,
      winnerDiff: e.correctDiffs || 0,
      winner: e.correctTrends || 0,
      adjacent: 0,
      totalTips: e.totalMatches || 0,
      tierRank: userTierMap.get(typeof e.user === 'string' ? e.user : e.user.id) || 0,
    }))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points
      if (b.exactGuesses !== a.exactGuesses) return b.exactGuesses - a.exactGuesses
      if (b.winnerDiff !== a.winnerDiff) return b.winnerDiff - a.winnerDiff
      if (b.winner !== a.winner) return b.winner - a.winner
      return b.tierRank - a.tierRank
    })

  let currentRank = 1
  const updates = []
  const snapshots = []

  for (let i = 0; i < sortedEntries.length; i++) {
    const item = sortedEntries[i]
    const prevItem = i > 0 ? sortedEntries[i - 1] : null

    let isTie = false
    if (prevItem) {
      isTie =
        item.points === prevItem.points &&
        item.exactGuesses === prevItem.exactGuesses &&
        item.winnerDiff === prevItem.winnerDiff &&
        item.winner === prevItem.winner &&
        item.tierRank === prevItem.tierRank
    }

    if (!isTie) {
      currentRank = i + 1
    }

    const newRank = currentRank
    const previousRank = item.entry.currentRank || 0
    const rankChange = previousRank === 0 ? 0 : previousRank - newRank

    updates.push(
      payload.update({
        collection: 'leaderboard-entries',
        id: item.entry.id,
        data: {
          currentRank: newRank,
          previousRank: previousRank,
          rankChange,
        },
      }),
    )

    if (options.createSnapshot) {
      snapshots.push(
        payload.create({
          collection: 'competition-snapshots' as any,
          data: {
            competition: competitionId,
            user: item.userId,
            rank: newRank,
            ovr: item.entry.ovr || 0,
            points: item.points,
            exactGuesses: item.exactGuesses,
            winnerDiff: item.winnerDiff,
            winner: item.winner,
            adjacent: 0,
            totalTips: item.totalTips,
            date: now.toISOString(),
          },
        }),
      )
    }
  }

  await Promise.all(updates)
  if (snapshots.length > 0) {
    await Promise.all(snapshots)
  }
}
