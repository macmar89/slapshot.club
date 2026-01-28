'use server'

import config from '@/payload.config'
import { getPayload } from 'payload'
import { headers } from 'next/headers'

export async function submitFeedbackAction(type: 'bug' | 'idea' | 'change_user_email_request' | 'custom_country_request' | 'other', message: string, pageUrl: string) {
  const payload = await getPayload({ config })
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })

  if (!user) {
    return { ok: false, error: 'Unauthorized' }
  }

  try {
    await payload.create({
      collection: 'feedback',
      data: {
        type,
        message,
        pageUrl,
        user: user.id,
        status: 'new',
        read: false,
      },
    })

    return { ok: true }
  } catch (error) {
    console.error('Failed to submit feedback:', error)
    return { ok: false, error: 'Failed to submit feedback' }
  }
}
