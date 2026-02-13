import { getPayload, BasePayload } from 'payload'
import config from '@/payload.config'

export type NotificationType = 
  | 'dailySummary' 
  | 'matchReminder' 
  | 'scoreChange' 
  | 'matchEnd' 
  | 'leaderboardUpdate'

interface SendNotificationArgs {
  type: NotificationType
  titles: Record<string, string> // Localized titles: { en: '...', sk: '...' }
  messages: Record<string, string> // Localized messages
  url?: string
  data?: Record<string, any>
  userIds?: string[] // Optional: Send to specific matching users only
}

/**
 * Service to handle sending push notifications via OneSignal REST API.
 * It automatically filters users who have the specified notification type enabled.
 */
export class NotificationService {
  private static async getOneSignalConfig() {
    return {
      appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
      apiKey: process.env.ONESIGNAL_REST_API_KEY,
    }
  }

  /**
   * Sends a push notification to users who have a specific notification type enabled.
   */
  static async sendPush({ type, titles, messages, url, data, userIds }: SendNotificationArgs) {
    const { appId, apiKey } = await this.getOneSignalConfig()

    if (!appId || !apiKey) {
      console.error('[NotificationService] Missing OneSignal App ID or REST API Key')
      return { ok: false, error: 'OneSignal not configured on backend' }
    }

    const payload = await getPayload({ config })

    try {
      // 1. Find all users who have this notification type enabled
      const query: any = {
        [type]: { equals: true }
      }

      if (userIds && userIds.length > 0) {
        query.user = { in: userIds }
      }

      const settings = await payload.find({
        collection: 'notification-settings',
        where: query,
        limit: 1000, // Reasonable limit for now, adjust as needed or use pagination
        select: {
          user: true
        }
      })

      const targetUserIds = settings.docs.map(s => typeof s.user === 'object' ? s.user.id : s.user)

      if (targetUserIds.length === 0) {
        console.log(`[NotificationService] No users found with ${type} enabled.`)
        return { ok: true, sent: 0 }
      }

      // 2. Send request to OneSignal
      const response = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${apiKey}`
        },
        body: JSON.stringify({
          app_id: appId,
          include_external_user_ids: targetUserIds,
          headings: titles,
          contents: messages,
          url: url || process.env.NEXT_PUBLIC_SERVER_URL,
          data: data || {}
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.errors?.[0] || 'Failed to send OneSignal notification')
      }

      console.log(`[NotificationService] Sent ${type} notification to ${targetUserIds.length} users.`)
      return { ok: true, sent: targetUserIds.length, result }

    } catch (error: any) {
      console.error('[NotificationService] Error sending notification:', error)
      return { ok: false, error: error.message }
    }
  }
}
