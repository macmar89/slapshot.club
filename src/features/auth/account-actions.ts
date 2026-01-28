'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function updateUsernameAction(newUsername: string) {
  const payload = await getPayload({ config })
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })

  if (!user) {
    return { ok: false, error: 'Unauthorized' }
  }

  if (!newUsername || newUsername.length < 3) {
    return { ok: false, error: 'Username must be at least 3 characters long' }
  }

  try {
    // Check if username is already taken by another user
    const existing = await payload.find({
      collection: 'users',
      where: {
        username: { equals: newUsername },
        id: { not_equals: user.id },
      },
    })

    if (existing.docs.length > 0) {
      return { ok: false, error: 'Username is already taken' }
    }

    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        username: newUsername,
      },
    })

    revalidatePath('/', 'layout')
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message || 'Update failed' }
  }
}

export async function updatePasswordAction(newPassword: string) {
  const payload = await getPayload({ config })
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })

  if (!user) {
    return { ok: false, error: 'Unauthorized' }
  }

  if (!newPassword || newPassword.length < 6) {
    return { ok: false, error: 'Password must be at least 6 characters long' }
  }

  try {
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        password: newPassword,
      },
    })

    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message || 'Update failed' }
  }
}

export async function requestEmailChangeAction(newEmail: string, message: string) {
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
        type: 'change_user_email_request',
        message: `Považovateľ ${user.username} (ID: ${user.id}) žiada o zmenu emailu z ${user.email} na: ${newEmail}. \n\nDodatočná správa: ${message}`,
        user: user.id,
        status: 'new',
      },
    })

    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message || 'Request failed' }
  }
}

export async function updateLocationAction(country: 'SK' | 'CZ' | 'other' | null, region: string | null) {
  const payload = await getPayload({ config })
  const headersList = await headers()
  const { user } = await payload.auth({ headers: headersList })

  if (!user) {
    return { ok: false, error: 'Unauthorized' }
  }

  try {
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        location: {
          country: country || undefined,
          region: region || undefined,
        },
      },
    })

    // Ak user vybral "Iné", pošli email adminovi
    if (country === 'other') {
      const adminEmail = process.env.ADMIN_EMAIL || 'info@slapshot.club'
      await payload.sendEmail({
        to: adminEmail,
        subject: '[Slapshot] Nová krajina na doplnenie',
        html: `
          <h2>Používateľ požiadal o inú krajinu</h2>
          <p><strong>Používateľ:</strong> ${user.username} (${user.email})</p>
          <p><strong>ID:</strong> ${user.id}</p>
          <p>Prosím doplňte krajinu v Admin paneli.</p>
        `,
      })
    }

    revalidatePath('/', 'layout')
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message || 'Update failed' }
  }
}

