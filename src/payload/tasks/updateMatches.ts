import { TaskHandler } from 'payload'
import { updateScheduledMatches } from '../../features/matches/services/matchService'

export const updateMatchesTask: TaskHandler<any> = async ({ req: { payload } }) => {
  // 1. Check if the cron is enabled in GeneralSettings
  const settings = await payload.findGlobal({
    slug: 'general-settings',
  })

  const isEnabled = (settings as any).cronSettings?.updateMatchesEnabled ?? true

  if (!isEnabled) {
    payload.logger.info('[CRON] Match update is disabled in GeneralSettings. Skipping.')
    return {
      output: {
        message: 'Disabled in settings',
        count: 0
      }
    }
  }

  // 2. Call the shared service
  try {
    const result = await updateScheduledMatches(payload)
    return {
      output: result
    }
  } catch (error: any) {
    payload.logger.error({ err: error }, '[CRON] Task failed')
    throw error
  }
}
