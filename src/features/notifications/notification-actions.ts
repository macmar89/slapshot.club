'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

export interface NotificationSettingsData {
  dailySummary: boolean
  matchReminder: boolean
  scoreChange: boolean
  matchEnd: boolean
  leaderboardUpdate: boolean
}

export async function updateNotificationSettingsAction(data: NotificationSettingsData) {
  const payload = await getPayload({ config })
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })

  if (!user) {
    return { ok: false, error: 'Unauthorized' }
  }

  try {
    // Find existing settings for this user
    const existing = await payload.find({
      collection: 'notification-settings',
      where: {
        user: { equals: user.id },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      // Update existing
      await payload.update({
        collection: 'notification-settings',
        id: existing.docs[0].id,
        data: {
          dailySummary: data.dailySummary,
          matchReminder: data.matchReminder,
          scoreChange: data.scoreChange,
          matchEnd: data.matchEnd,
          leaderboardUpdate: data.leaderboardUpdate,
        },
      })
    } else {
      // Create new
      await payload.create({
        collection: 'notification-settings',
        data: {
          user: user.id,
          dailySummary: data.dailySummary,
          matchReminder: data.matchReminder,
          scoreChange: data.scoreChange,
          matchEnd: data.matchEnd,
          leaderboardUpdate: data.leaderboardUpdate,
        },
      })
    }

    revalidatePath('/', 'layout')
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message || 'Update failed' }
  }
}
