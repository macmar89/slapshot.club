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
   * @deprecated Zero-Tag Strategy: We no longer sync tags to avoid OneSignal limits.
   */
  static async syncTags(userId: string, tags: Record<string, boolean | string>) {
    console.log(`[NotificationService] Skipping tag sync for ${userId} (Zero-Tag Strategy enabled)`)
    return { ok: true }
  }

  /**
   * @deprecated Use sendPushToUsers for targeted notifications.
   */
  static async sendPushByTag({ type, titles, messages, url, data }: Omit<SendNotificationArgs, 'userIds'>) {
    console.error('[NotificationService] sendPushByTag is deprecated. Use sendPushToUsers.')
    return { ok: false, error: 'Method deprecated' }
  }

  /**
   * Sends a push notification to specific user IDs.
   * Useful for targeted alerts that ignoring general settings.
   */
  static async sendPushToUsers({ titles, messages, url, data, userIds }: Required<Pick<SendNotificationArgs, 'titles' | 'messages' | 'userIds'>> & Partial<SendNotificationArgs>) {
    const { appId, apiKey } = await this.getOneSignalConfig()

    if (!appId || !apiKey) {
      console.error('[NotificationService] Missing OneSignal App ID or REST API Key')
      return { ok: false, error: 'OneSignal not configured on backend' }
    }

    if (!userIds || userIds.length === 0) {
      return { ok: true, sent: 0 }
    }

    try {
      const response = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Key ${apiKey}`
        },
        body: JSON.stringify({
          app_id: appId,
          include_external_user_ids: userIds,
          headings: titles,
          contents: messages,
          url: url || process.env.NEXT_PUBLIC_SERVER_URL,
          data: data || {}
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.errors?.[0] || 'Failed to send OneSignal notification to users')
      }

      console.log(`[NotificationService] Sent notification to ${userIds.length} users.`)
      return { ok: true, sent: userIds.length, result }

    } catch (error: any) {
      console.error('[NotificationService] Error sending notification to users:', error)
      return { ok: false, error: error.message }
    }
  }

  /**
   * @deprecated Use sendPushByTag for broadcast or sendPushToUsers for direct targeting.
   */
  static async sendPush(args: SendNotificationArgs) {
    if (args.userIds && args.userIds.length > 0) {
      return this.sendPushToUsers(args as any)
    }
    return this.sendPushByTag(args)
  }
}
