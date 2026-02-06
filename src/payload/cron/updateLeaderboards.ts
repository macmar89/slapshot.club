import { BasePayload, TaskHandler } from 'payload'

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

// The core logic
export const runUpdateLeaderboards = async (
  payload: BasePayload,
  options?: { force?: boolean },
) => {
  const now = new Date()
  const currentHour = now.getUTCHours()
  const isForce = options?.force === true

  payload.logger.info(
    `[CRON] Starting updateLeaderboards (Force: ${isForce}) at hour ${currentHour}...`,
  )

  try {
    // 1. Fetch Active Competitions
    const competitions = await payload.find({
      collection: 'competitions',
      where: {
        status: { equals: 'active' },
      },
      limit: 100,
    })

    if (competitions.totalDocs === 0) {
      payload.logger.info('[CRON] No active competitions found.')
      return
    }

    // 2. Fetch Active Memberships for Tie-Breaking
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

    // 3. Process Each Competition
    for (const comp of competitions.docs) {
      const scheduledHour = (comp as any).recalculationHour ?? 5

      if (!isForce && scheduledHour !== currentHour) {
        continue
      }

      payload.logger.info(`[CRON] Processing competition: ${comp.name}`)

      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      const recentMatches = await payload.find({
        collection: 'matches',
        where: {
          competition: { equals: comp.id },
          status: { equals: 'finished' },
          'result.endingType': { exists: true },
          updatedAt: { greater_than: oneDayAgo.toISOString() },
        },
        limit: 1,
      })

      if (!isForce && recentMatches.totalDocs === 0) {
        payload.logger.info(`[CRON] No recent matches in ${comp.name}, skipping recalculation.`)
        continue
      }

      let page = 1
      let hasNextPage = true
      let allEntries: any[] = []

      while (hasNextPage) {
        const entries = await payload.find({
          collection: 'leaderboard-entries',
          where: {
            competition: { equals: comp.id },
          },
          limit: 500,
          page,
        })
        allEntries = [...allEntries, ...entries.docs]
        hasNextPage = entries.hasNextPage
        page++
      }

      if (allEntries.length === 0) continue

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

        snapshots.push(
          payload.create({
            collection: 'competition-snapshots' as any,
            data: {
              competition: comp.id,
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

      await Promise.all(updates)
      await Promise.all(snapshots)
      payload.logger.info(`[CRON] Updated ${updates.length} entries for ${comp.name}`)
    }
  } catch (error: any) {
    payload.logger.error(`[CRON ERROR] updateLeaderboards failed: ${error.message}`)
  }
}

export const updateLeaderboardsTask: TaskHandler<any> = async ({ input, req: { payload } }) => {
  await runUpdateLeaderboards(payload, { force: input?.force })
  return {
    output: { message: 'Leaderboards updated' },
  }
}
