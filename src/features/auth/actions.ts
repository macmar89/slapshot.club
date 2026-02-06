'use server'

import { verifyTurnstileToken } from '@/lib/turnstile'
import { LoginFormData, RegisterFormData, ForgotPasswordFormData } from '@/features/auth/schema'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { cookies, headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export const loginUser = async (data: LoginFormData) => {
  const isVerified = await verifyTurnstileToken(data.turnstileToken)
  if (!isVerified) {
    return {
      ok: false,
      status: 403,
      json: async () => ({ errors: [{ message: 'Turnstile verification failed' }] }),
    }
  }

  const payload = await getPayload({ config })
  let email = data.identifier

  // If identifier doesn't look like an email, try to find user by username
  if (!data.identifier.includes('@')) {
    const { docs } = await payload.find({
      collection: 'users',
      where: {
        username: { equals: data.identifier },
      },
    })

    if (docs.length > 0) {
      email = docs[0].email
    }
  }

  // We call the API because the client expects a Response-like object
  // or we can just proxy it.
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/users/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password: data.password,
      }),
    },
  )

  // We need to return something that the client can handle.
  // Since the original code used res.json(), we'll return a plain object and adjust the client.
  // Actually, to minimize changes to LoginForm.tsx, I'll try to keep the interface similar
  // but Server Actions can't return Response objects easily (they are not serializable).

  const responseData = await res.json()
  if (res.ok) {
    const cookieStore = await cookies()
    const setCookie = res.headers.get('set-cookie')
    if (setCookie) {
      const tokenMatch = setCookie.match(/payload-token=([^;]+)/)
      if (tokenMatch) {
        const expiration = process.env.SESSION_EXPIRATION_SECONDS
          ? parseInt(process.env.SESSION_EXPIRATION_SECONDS)
          : 7200
        cookieStore.set('payload-token', tokenMatch[1], {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: expiration,
        })
      }
    }
  }

  return {
    ok: res.ok,
    status: res.status,
    data: responseData,
  }
}

export const registerUser = async (data: RegisterFormData) => {
  const isVerified = await verifyTurnstileToken(data.turnstileToken)
  if (!isVerified) {
    return {
      ok: false,
      status: 403,
      data: { errors: [{ message: 'Turnstile verification failed' }] },
    }
  }

  const payload = await getPayload({ config })

  // Check for existing unverified user with same email or username
  const { docs: existingUsers } = await payload.find({
    collection: 'users',
    where: {
      or: [{ email: { equals: data.email } }, { username: { equals: data.username } }],
    },
  })

  if (existingUsers.length > 0) {
    const unverifiedUsers = existingUsers.filter((u) => !u._verified)

    // If we have unverified users, we delete them to allow new registration
    if (unverifiedUsers.length > 0) {
      await Promise.all(
        unverifiedUsers.map((u) =>
          payload.delete({
            collection: 'users',
            id: u.id,
          }),
        ),
      )
    }
  }

  let referredBy: string | undefined
  if (data.referralCode) {
    const { docs: referrers } = await payload.find({
      collection: 'users',
      where: {
        'referralData.referralCode': { equals: data.referralCode },
      },
    })
    if (referrers.length > 0) {
      referredBy = referrers[0].id
    }
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/users`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        username: data.username,
        gdprConsent: data.gdprConsent,
        marketingConsent: data.marketingConsent,
        preferredLanguage: data.preferredLanguage === 'cs' ? 'cz' : data.preferredLanguage, // Map 'cs' to 'cz' for Payload
        marketingConsentDate: data.marketingConsent ? new Date().toISOString() : undefined,
        // Ensure referralData is a full object or undefined, to avoid validation issues
        referralData: referredBy 
          ? { 
              referredBy,
              // We omit referralCode here so the beforeChange hook generates it
            } 
          : undefined,
        ...(process.env.REGISTRER_PROMO === 'true'
          ? {
              subscription: {
                plan: 'pro',
                planType: 'seasonal',
                activeFrom: new Date().toISOString(),
                activeUntil: (() => {
                  const now = new Date()
                  const currentYear = now.getUTCFullYear()
                  const currentMonth = now.getUTCMonth() // 0-indexed, 8 is September
                  const expiryYear = currentMonth >= 8 ? currentYear + 1 : currentYear
                  return `${expiryYear}-08-31T21:59:59.000Z` // Midnight Slovak time
                })(),
              },
            }
          : {}),
      }),
    },
  )

  const responseData = await res.json()

  if (res.ok) {
    const cookieStore = await cookies()
    const setCookie = res.headers.get('set-cookie')
    if (setCookie) {
      const tokenMatch = setCookie.match(/payload-token=([^;]+)/)
      if (tokenMatch) {
        const expiration = process.env.SESSION_EXPIRATION_SECONDS
          ? parseInt(process.env.SESSION_EXPIRATION_SECONDS)
          : 7200
        cookieStore.set('payload-token', tokenMatch[1], {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: expiration,
        })
      }
    }
  }

  return {
    ok: res.ok,
    status: res.status,
    data: responseData,
  }
}

export const forgotPassword = async (data: ForgotPasswordFormData) => {
  const isVerified = await verifyTurnstileToken(data.turnstileToken)
  if (!isVerified) {
    return {
      ok: false,
      status: 403,
      data: { errors: [{ message: 'Turnstile verification failed' }] },
    }
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/users/forgot-password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
      }),
    },
  )

  const responseData = await res.json()
  return {
    ok: res.ok,
    status: res.status,
    data: responseData,
  }
}

export const resetPassword = async (data: any) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/users/reset-password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: data.token,
        password: data.password,
      }),
    },
  )

  const responseData = await res.json()
  return {
    ok: res.ok,
    status: res.status,
    data: responseData,
  }
}

export const logoutUser = async () => {
  // Clear the authentication cookie
  const cookieStore = await cookies()
  cookieStore.delete('payload-token')

  // Standard Next.js server-side redirect
  redirect('/login')
}

export const getCurrentUser = async () => {
  const payload = await getPayload({ config })
  const headersList = await headers()

  try {
    const { user } = await payload.auth({ headers: headersList })
    return user
  } catch (err) {
    return null
  }
}

export const completeOnboarding = async () => {
  const user = await getCurrentUser()

  if (!user) {
    return { ok: false, error: 'No user session' }
  }

  try {
    const payload = await getPayload({ config })
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        hasSeenOnboarding: true,
      },
    })
    revalidatePath('/', 'layout')
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err.message || 'Update failed' }
  }
}

export const markAnnouncementAsSeen = async (announcementId: string) => {
  const user = (await getCurrentUser()) as any
  if (!user) return { ok: false }

  const payload = await getPayload({ config })

  const seenAnnouncements = user.seenAnnouncements || []
  const existingIndex = seenAnnouncements.findIndex((a: any) => a.announcementId === announcementId)

  if (existingIndex > -1) {
    // Increment existing display count
    const updatedSeen = [...seenAnnouncements]
    updatedSeen[existingIndex] = {
      ...updatedSeen[existingIndex],
      displayCount: (updatedSeen[existingIndex].displayCount || 1) + 1,
    }

    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        seenAnnouncements: updatedSeen,
      },
    })
  } else {
    // Add new entry
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        seenAnnouncements: [...seenAnnouncements, { announcementId, displayCount: 1 }],
      },
    })
  }

  return { ok: true }
}

export const verifyUser = async (token: string) => {
  const payload = await getPayload({ config })

  try {
    const result = await payload.verifyEmail({
      collection: 'users',
      token,
    })

    return {
      ok: true,
      status: 200,
      data: result,
    }
  } catch (err: any) {
    return {
      ok: false,
      status: err.status || 400,
      data: { errors: [{ message: err.message || 'Verification failed' }] },
    }
  }
}

export const resendVerification = async (email: string) => {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/users/resend-verification`
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    return {
      ok: res.ok,
      status: res.status,
    }
  } catch (err: any) {
    return { ok: false, status: 500 }
  }
}
