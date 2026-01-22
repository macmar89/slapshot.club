import { Payload } from 'payload'
import { calculatePoints } from './scoring'
import type { Match, Competition, Prediction } from '@/payload-types'

/**
 * EVALUATE MATCH
 * Triggered when Match status -> 'finished'
 */
export async function evaluateMatch(matchId: string, payload: Payload) {
  const startTime = Date.now()
  
  // 1. Fetch Match & Competition rules
  const match = await payload.findByID({
    collection: 'matches',
    id: matchId,
    depth: 1,
  })

  if (!match || !match.competition) {
    payload.logger.error(`[EVALUATE] Match ${matchId} or Competition missing.`)
    return
  }

  const competition = typeof match.competition === 'object' 
    ? match.competition 
    : await payload.findByID({ collection: 'competitions', id: match.competition }) as Competition

  // 2. Fetch all predictions that haven't been evaluated yet
  const { docs: predictions } = await payload.find({
    collection: 'predictions',
    where: {
      match: { equals: matchId },
      status: { not_equals: 'evaluated' },
    },
    limit: 5000, 
  })

  payload.logger.info(`[EVALUATE] Processing ${predictions.length} predictions for ${match.displayTitle}...`)

  for (const pred of predictions as Prediction[]) {
    try {
      const { points, isExact, isTrend, isWrong } = calculatePoints(pred, match, competition)
      // Update Prediction first (Atomic state change)
      await payload.update({
        collection: 'predictions',
        id: pred.id,
        data: {
          points,
          isExact,
          isTrend,
          isWrong,
          status: 'evaluated',
        },
      })

      // Update Leaderboard & Global Stats
      if (pred.user) {
        const userId = typeof pred.user === 'object' ? pred.user.id : pred.user
        
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
              totalPoints: (entry.totalPoints || 0) + points,
              totalMatches: (entry.totalMatches || 0) + 1,
              exactGuesses: (entry.exactGuesses || 0) + (isExact ? 1 : 0),
              correctTrends: (entry.correctTrends || 0) + (isTrend ? 1 : 0),
              wrongGuesses: (entry.wrongGuesses || 0) + (isWrong ? 1 : 0),
            },
          })
        } else {
          await payload.create({
            collection: 'leaderboard-entries',
            data: {
              user: userId,
              competition: competition.id,
              totalPoints: points,
              totalMatches: 1,
              exactGuesses: isExact ? 1 : 0,
              correctTrends: isTrend ? 1 : 0,
              wrongGuesses: isWrong ? 1 : 0,
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
                totalPoints: (userDoc.stats?.totalPoints || 0) + points,
              },
            },
          })
        }
      }
      
      payload.logger.info(`[EVALUATE] User ${pred.user} received ${points} points.`)
    } catch (err: any) {
      payload.logger.error(`[EVALUATE] Error on prediction ${pred.id}: ${err.message}`)
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

  const competitionId = typeof match.competition === 'object' ? (match.competition as any).id : match.competition

  // 1. Fetch all evaluated predictions
  const { docs: predictions } = await payload.find({
    collection: 'predictions',
    where: {
      match: { equals: matchId },
      status: { equals: 'evaluated' },
    },
    limit: 5000,
  })

  payload.logger.info(`[REVERT] Reverting ${predictions.length} predictions for ${match.displayTitle}...`)

  for (const pred of predictions as Prediction[]) {
    try {
      const pointsToSubtract = pred.points || 0
      const revIsExact = pred.isExact
      const revIsTrend = pred.isTrend
      const revIsWrong = pred.isWrong

      // Reset Prediction (Unlock state)
      await payload.update({
        collection: 'predictions',
        id: pred.id,
        data: {
          points: 0,
          isExact: false,
          isTrend: false,
          isWrong: false,
          status: 'pending',
        },
      })

      // Subtract from Leaderboard & Global Stats
      if (pred.user) {
        const userId = typeof pred.user === 'object' ? pred.user.id : pred.user

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
              totalPoints: Math.max(0, (entry.totalPoints || 0) - pointsToSubtract),
              totalMatches: Math.max(0, (entry.totalMatches || 0) - 1),
              exactGuesses: Math.max(0, (entry.exactGuesses || 0) - (revIsExact ? 1 : 0)),
              correctTrends: Math.max(0, (entry.correctTrends || 0) - (revIsTrend ? 1 : 0)),
              wrongGuesses: Math.max(0, (entry.wrongGuesses || 0) - (revIsWrong ? 1 : 0)),
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
                totalPoints: Math.max(0, (userDoc.stats?.totalPoints || 0) - pointsToSubtract),
              },
            },
          })
        }
      }
      payload.logger.info(`[REVERT] User ${pred.user} points removed.`)
    } catch (err: any) {
      payload.logger.error(`[REVERT] Error on prediction ${pred.id}: ${err.message}`)
    }
  }

  payload.logger.info(`[REVERT] Finished in ${Date.now() - startTime}ms.`)
}
