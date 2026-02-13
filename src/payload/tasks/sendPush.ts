import { TaskHandler } from 'payload'
import { NotificationService, NotificationType } from '../../features/notifications/notification-service'

export const sendPushTask: TaskHandler<'send-push-notification'> = async ({ input, req: { payload } }) => {
  const { type, titles, messages, url, data, competitionId } = input as any

  payload.logger.info(`[JOB] Sending targeted push: ${type}${competitionId ? ` for competition: ${competitionId}` : ''}`)

  try {
    let targetUserIds: string[] = []

    if (competitionId) {
      // 1. Find users in this competition
      const leaderboardEntries = await payload.find({
        collection: 'leaderboard-entries',
        where: {
          competition: { equals: competitionId },
        },
        limit: 5000, // Reasonable limit for participants
        select: {
          user: true,
        },
      })

      const participantIds = leaderboardEntries.docs.map((d: any) => typeof d.user === 'object' ? d.user.id : d.user)

      if (participantIds.length === 0) {
        payload.logger.info(`[JOB] No participants found for competition ${competitionId}`)
        return { output: { success: true, sent: 0 } }
      }

      // 2. Filter those users who have the notification type enabled
      const eligibleSettings = await payload.find({
        collection: 'notification-settings',
        where: {
          user: { in: participantIds },
          [type]: { equals: true },
        },
        limit: 5000,
        select: {
          user: true,
        },
      })

      targetUserIds = eligibleSettings.docs.map((d: any) => typeof d.user === 'object' ? d.user.id : d.user)
    } else {
      // Global broadcast: find all users with this setting enabled
      const eligibleSettings = await payload.find({
        collection: 'notification-settings',
        where: {
          [type]: { equals: true },
        },
        limit: 5000,
        select: {
          user: true,
        },
      })
      targetUserIds = eligibleSettings.docs.map((d: any) => typeof d.user === 'object' ? d.user.id : d.user).filter(Boolean)
    }

    if (targetUserIds.length === 0) {
      payload.logger.info(`[JOB] No eligible users found for ${type}`)
      return { output: { success: true, sent: 0 } }
    }

    // 3. Send in batches (OneSignal limit is 2000 per request)
    const batchSize = 1000
    for (let i = 0; i < targetUserIds.length; i += batchSize) {
      const batch = targetUserIds.slice(i, i + batchSize)
      payload.logger.info(`[JOB] Sending batch ${i / batchSize + 1} (${batch.length} users)...`)
      
      await NotificationService.sendPushToUsers({
        titles,
        messages,
        url,
        data,
        userIds: batch,
      })
    }

    payload.logger.info(`[JOB] Push completed for ${targetUserIds.length} total users.`)
    return { output: { success: true, sent: targetUserIds.length } }

  } catch (error: any) {
    payload.logger.error(`[JOB ERROR] sendPushTask failed: ${error.message}`)
    throw error
  }
}
