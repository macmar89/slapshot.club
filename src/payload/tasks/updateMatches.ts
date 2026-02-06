import { BasePayload, TaskHandler } from 'payload'
import { updateScheduledMatches } from '../../features/matches/services/matchService'

/**
 * Core logic for updating matches. Can be called directly or from a Task.
 */
export async function runUpdateMatches(payload: BasePayload) {
  // 1. Check if the cron is enabled in GeneralSettings
  const settings = await payload.findGlobal({
    slug: 'general-settings',
  })

  const isEnabled = (settings as any).cronSettings?.updateMatchesEnabled ?? true

  if (!isEnabled) {
    payload.logger.info('[CRON] Match update is disabled in GeneralSettings. Skipping.')
    return {
      message: 'Disabled in settings',
      count: 0
    }
  }

  // 2. Call the shared service
  try {
    const result = await updateScheduledMatches(payload)
    return result
  } catch (error: any) {
    payload.logger.error({ err: error }, '[CRON] Logic failed')
    throw error
  }
}

export const updateMatchesTask: TaskHandler<any> = async ({ req: { payload } }) => {
  const result = await runUpdateMatches(payload)
  return {
    output: result
  }
}
