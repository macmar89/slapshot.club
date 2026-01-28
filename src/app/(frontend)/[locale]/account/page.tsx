import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { AccountView } from '@/features/auth/components/AccountView'
import { Header } from '@/components/layout/Header'
import type { User } from '@/payload-types'

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const headersList = new Headers(await headers())
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: headersList })

  if (!user) {
    redirect('/login')
  }

  const plainUser = {
    id: user.id,
    username: (user as any).username,
    email: user.email,
    location: (user as any).location,
  }

  return (
    <div className="min-h-screen text-white">
      <Header />
      <div className="pt-16" />
      <AccountView user={plainUser} />
    </div>
  )
}
