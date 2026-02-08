import { TaskHandler } from 'payload'
import { syncMatchesFromHockeyApi } from '@/features/matches/services/hockeyApiSync'

export const syncHockeyMatchesTask: TaskHandler<any> = async ({ req: { payload } }) => {
  payload.logger.info('[TASK] Starting Hockey API Synchronization...')
  await syncMatchesFromHockeyApi(payload)
  return {
    output: { message: 'Hockey matches synchronized' },
  }
}
