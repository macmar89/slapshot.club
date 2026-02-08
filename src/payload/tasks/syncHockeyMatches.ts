import { TaskHandler } from 'payload'
import { syncMatchesFromHockeyApi } from '@/features/matches/services/hockeyApiSync'

export const runSyncHockeyMatches = async (payload: any) => {
  payload.logger.info('[TASK] Starting Hockey API Synchronization...')
  await syncMatchesFromHockeyApi(payload)
}

export const syncHockeyMatchesTask: TaskHandler<any> = async ({ req: { payload } }) => {
  await runSyncHockeyMatches(payload)
  return {
    output: { message: 'Hockey matches synchronized' },
  }
}
