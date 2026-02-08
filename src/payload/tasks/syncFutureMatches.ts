import { TaskHandler } from 'payload'
import { syncFutureMatches } from '@/features/matches/services/hockeyApiSync'

export const runSyncFutureMatches = async (payload: any) => {
  payload.logger.info('[TASK] Starting Future Matches Synchronization...')
  await syncFutureMatches(payload)
}

export const syncFutureMatchesTask: TaskHandler<any> = async ({ req: { payload } }) => {
  await runSyncFutureMatches(payload)
  return {
    output: { message: 'Future matches synchronized' },
  }
}
