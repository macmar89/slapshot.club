import { Payload } from 'payload'
import { calculatePoints } from './scoring'
import type {  Competition, Prediction } from '@/payload-types'
import { MAX_POSSIBLE_POINTS } from '@/lib/constants'

/**
 * EVALUATE MATCH
 * Triggered when Match status -> 'finished'
 */
export async function evaluateMatch(matchId: string, payload: Payload) {
  const startTime = Date.now()

  const match = await payload.findByID({
    collection: 'matches',
    id: matchId,
    depth: 1,
  })

  if (!match || !match.competition) {
    payload.logger.error(`[EVALUATE] Match ${matchId} or Competition missing.`)
    return
  }

  const competition =
    typeof match.competition === 'object'
      ? match.competition
      : ((await payload.findByID({
          collection: 'competitions',
          id: match.competition,
        })) as Competition)

  // 2. Fetch all predictions that haven't been evaluated yet
  const { docs: predictions } = await payload.find({
    collection: 'predictions',
    where: {
      match: { equals: matchId },
      status: { not_equals: 'evaluated' },
    },
    limit: 5000,
  })

  payload.logger.info(
    `[EVALUATE] Processing ${predictions.length} predictions for ${match.displayTitle}...`,
  )

  // Track changes per user to consolidate updates
  const userUpdates = new Map<string, {
    points: number,
    exact: number,
    trend: number,
    diff: number,
    wrong: number,
    count: number
  }>()

  for (const pred of predictions as Prediction[]) {
    try {
      const { points, isExact, isTrend, isDiff, isWrong } = calculatePoints(pred, match)
      
      // Update Prediction (Atomic state change)
      await payload.update({
        collection: 'predictions',
        id: pred.id,
        data: {
          points,
          isExact,
          isTrend,
          isDiff,
          isWrong,
          status: 'evaluated',
        },
      })

      if (pred.user) {
        const userId = typeof pred.user === 'object' ? pred.user.id : pred.user
        const stats = userUpdates.get(userId) || { points: 0, exact: 0, trend: 0, diff: 0, wrong: 0, count: 0 }
        
        userUpdates.set(userId, {
          points: stats.points + points,
          exact: stats.exact + (isExact ? 1 : 0),
          trend: stats.trend + (isTrend ? 1 : 0),
          diff: stats.diff + (isDiff ? 1 : 0),
          wrong: stats.wrong + (isWrong ? 1 : 0),
          count: stats.count + 1
        })
      }
    } catch (err: any) {
      payload.logger.error(`[EVALUATE] Error on prediction ${pred.id}: ${err.message}`)
    }
  }

  // 3. Apply consolidated updates
  for (const [userId, stats] of userUpdates.entries()) {
    try {
      // Update Leaderboard Entry
      const { docs: entries } = await payload.find({
        collection: 'leaderboard-entries',
        where: {
          user: { equals: userId },
          competition: { equals: competition.id },
        },
        limit: 1,
      })

      if (entries.length > 0) {
        const entry = entries[0]
        await payload.update({
          collection: 'leaderboard-entries',
          id: entry.id,
          data: {
            totalPoints: (entry.totalPoints || 0) + stats.points,
            totalMatches: (entry.totalMatches || 0) + stats.count,
            exactGuesses: (entry.exactGuesses || 0) + stats.exact,
            correctTrends: (entry.correctTrends || 0) + stats.trend,
            correctDiffs: (entry.correctDiffs || 0) + stats.diff,
            wrongGuesses: (entry.wrongGuesses || 0) + stats.wrong,
          },
        })
      } else {
        await payload.create({
          collection: 'leaderboard-entries',
          data: {
            user: userId,
            competition: competition.id,
            totalPoints: stats.points,
            totalMatches: stats.count,
            exactGuesses: stats.exact,
            correctTrends: stats.trend,
            correctDiffs: stats.diff,
            wrongGuesses: stats.wrong,
            currentRank: 0,
            previousRank: 0,
            rankChange: 0,
          },
        })
      }

      // Update User Profile Stats
      const userDoc = await payload.findByID({ collection: 'users', id: userId })
      if (userDoc) {
        await payload.update({
          collection: 'users',
          id: userId,
          data: {
            stats: {
              ...(userDoc.stats || {}),
              totalPredictions: (userDoc.stats?.totalPredictions || 0) + stats.count,
              lifetimePoints: (userDoc.stats?.lifetimePoints || 0) + stats.points,
              lifetimePossiblePoints:
                (userDoc.stats?.lifetimePossiblePoints || 0) + (stats.count * MAX_POSSIBLE_POINTS),
            },
          },
        })
      }
      payload.logger.info(`[EVALUATE] User ${userId} updated with +${stats.points} points.`)
    } catch (err: any) {
      payload.logger.error(`[EVALUATE] Failed to update user ${userId}: ${err.message}`)
    }
  }

  payload.logger.info(`[EVALUATE] Finished in ${Date.now() - startTime}ms.`)
}

/**
 * REVERT MATCH EVALUATION
 * Triggered when Match status moves away from 'finished'
 */
export async function revertMatchEvaluation(matchId: string, payload: Payload) {
  const startTime = Date.now()

  const match = await payload.findByID({
    collection: 'matches',
    id: matchId,
    depth: 0,
  })

  if (!match) return

  const competitionId =
    typeof match.competition === 'object' ? (match.competition as any).id : match.competition

  // 1. Fetch all evaluated predictions
  const { docs: predictions } = await payload.find({
    collection: 'predictions',
    where: {
      match: { equals: matchId },
      status: { equals: 'evaluated' },
    },
    limit: 5000,
  })

  payload.logger.info(
    `[REVERT] Reverting ${predictions.length} predictions for ${match.displayTitle}...`,
  )

  // Track changes per user to consolidate updates
  const userReverts = new Map<string, {
    points: number,
    exact: number,
    trend: number,
    diff: number,
    wrong: number,
    count: number
  }>()

  for (const pred of predictions as Prediction[]) {
    try {
      const pointsToSubtract = pred.points || 0
      const revIsExact = pred.isExact
      const revIsTrend = pred.isTrend
      const revIsDiff = pred.isDiff
      const revIsWrong = pred.isWrong

      // Reset Prediction (Unlock state)
      await payload.update({
        collection: 'predictions',
        id: pred.id,
        data: {
          points: 0,
          isExact: false,
          isTrend: false,
          isDiff: false,
          isWrong: false,
          status: 'pending',
        },
      })

      if (pred.user) {
        const userId = typeof pred.user === 'object' ? pred.user.id : pred.user
        const stats = userReverts.get(userId) || { points: 0, exact: 0, trend: 0, diff: 0, wrong: 0, count: 0 }
        
        userReverts.set(userId, {
          points: stats.points + pointsToSubtract,
          exact: stats.exact + (revIsExact ? 1 : 0),
          trend: stats.trend + (revIsTrend ? 1 : 0),
          diff: stats.diff + (revIsDiff ? 1 : 0),
          wrong: stats.wrong + (revIsWrong ? 1 : 0),
          count: stats.count + 1
        })
      }
    } catch (err: any) {
      payload.logger.error(`[REVERT] Error on prediction ${pred.id}: ${err.message}`)
    }
  }

  // 2. Apply consolidated reverts
  for (const [userId, stats] of userReverts.entries()) {
    try {
      const { docs: entries } = await payload.find({
        collection: 'leaderboard-entries',
        where: {
          user: { equals: userId },
          competition: { equals: competitionId },
        },
        limit: 1,
      })

      if (entries.length > 0) {
        const entry = entries[0]
        await payload.update({
          collection: 'leaderboard-entries',
          id: entry.id,
          data: {
            totalPoints: Math.max(0, (entry.totalPoints || 0) - stats.points),
            totalMatches: Math.max(0, (entry.totalMatches || 0) - stats.count),
            exactGuesses: Math.max(0, (entry.exactGuesses || 0) - stats.exact),
            correctTrends: Math.max(0, (entry.correctTrends || 0) - stats.trend),
            correctDiffs: Math.max(0, (entry.correctDiffs || 0) - stats.diff),
            wrongGuesses: Math.max(0, (entry.wrongGuesses || 0) - stats.wrong),
          },
        })
      }

      const userDoc = await payload.findByID({ collection: 'users', id: userId })
      if (userDoc) {
        await payload.update({
          collection: 'users',
          id: userId,
          data: {
            stats: {
              ...(userDoc.stats || {}),
              totalPredictions: Math.max(0, (userDoc.stats?.totalPredictions || 0) - stats.count),
              lifetimePoints: Math.max(0, (userDoc.stats?.lifetimePoints || 0) - stats.points),
              lifetimePossiblePoints: Math.max(
                0,
                (userDoc.stats?.lifetimePossiblePoints || 0) - (stats.count * MAX_POSSIBLE_POINTS),
              ),
            },
          },
        })
      }
      payload.logger.info(`[REVERT] User ${userId} points removed.`)
    } catch (err: any) {
      payload.logger.error(`[REVERT] Failed to revert user ${userId}: ${err.message}`)
    }
  }

  payload.logger.info(`[REVERT] Finished in ${Date.now() - startTime}ms.`)
}
