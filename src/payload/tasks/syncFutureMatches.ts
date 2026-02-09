import { TaskHandler } from 'payload'
import { syncFutureMatches } from '@/features/matches/services/hockeyApiSync'

export const runSyncFutureMatches = async (
  payload: any,
  params?: {
    competitionId?: string | string[]
    apiHockeyId?: string | number | (string | number)[]
  },
) => {
  const { competitionId, apiHockeyId } = params || {}

  if (competitionId) {
    const competitionIds = Array.isArray(competitionId) ? competitionId : [competitionId]
    for (const id of competitionIds) {
      payload.logger.info(
        `[TASK] Starting Future Matches Synchronization for competition CID: ${id}...`,
      )
      await syncFutureMatches(payload, { competitionId: id })
    }
  } else if (apiHockeyId) {
    const apiIds = Array.isArray(apiHockeyId) ? apiHockeyId : [apiHockeyId]
    for (const id of apiIds) {
      payload.logger.info(
        `[TASK] Starting Future Matches Synchronization for API Hockey ID: ${id}...`,
      )
      await syncFutureMatches(payload, { apiHockeyId: id })
    }
  } else {
    payload.logger.info(`[TASK] Starting Future Matches Synchronization for all active leagues...`)
    await syncFutureMatches(payload)
  }
}

export const syncFutureMatchesTask: TaskHandler<any> = async ({ input, req: { payload } }) => {
  const competitionIds = input?.competitionIds || undefined
  const apiHockeyIds = input?.apiHockeyIds || undefined

  await runSyncFutureMatches(payload, { competitionId: competitionIds, apiHockeyId: apiHockeyIds })

  return {
    output: { message: 'Future matches synchronized' },
  }
}
