import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'

export default async function Dashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const headersList = await headers()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: headersList })

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome, {user.email}</p>
    </div>
  )
}
