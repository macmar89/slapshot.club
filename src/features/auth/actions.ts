'use server'

import { verifyTurnstileToken } from '@/lib/turnstile'
import { LoginFormData, RegisterFormData, ForgotPasswordFormData } from '@/features/auth/schema'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { cookies, headers } from 'next/headers'

export const loginUser = async (data: LoginFormData) => {
  const isVerified = await verifyTurnstileToken(data.turnstileToken)
  if (!isVerified) {
    return {
      ok: false,
      status: 403,
      json: async () => ({ errors: [{ message: 'Turnstile verification failed' }] }),
    }
  }

  // We call the API because the client expects a Response-like object
  // or we can just proxy it.
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    }),
  })

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
        cookieStore.set('payload-token', tokenMatch[1], {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
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

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      username: data.username,
    }),
  })

  const responseData = await res.json()

  if (res.ok) {
    const cookieStore = await cookies()
    const setCookie = res.headers.get('set-cookie')
    if (setCookie) {
      const tokenMatch = setCookie.match(/payload-token=([^;]+)/)
      if (tokenMatch) {
        cookieStore.set('payload-token', tokenMatch[1], {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
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

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/users/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: data.email,
    }),
  })

  const responseData = await res.json()
  return {
    ok: res.ok,
    status: res.status,
    data: responseData,
  }
}

export const logoutUser = async () => {
  const headersList = await headers()
  const cookieHeader = headersList.get('cookie')

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/users/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader || '',
    },
  })

  // Always delete the cookie on logout attempt to be safe
  const cookieStore = await cookies()
  cookieStore.delete('payload-token')

  return {
    ok: res.ok,
    status: res.status,
  }
}
