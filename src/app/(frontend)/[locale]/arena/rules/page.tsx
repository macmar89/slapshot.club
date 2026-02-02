import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { setRequestLocale } from 'next-intl/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { RulesView } from '@/features/rules/components/RulesView'
import { Header } from '@/components/layout/Header'
import { MainMobileNav } from '@/components/layout/MainMobileNav'

export default async function ArenaRulesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const headersList = new Headers(await headers())
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: headersList })

  if (!user) {
    redirect('/login')
  }

  // Fetch competitions (limit to 100 for now)
  const competitions = await payload.find({
    collection: 'competitions',
    sort: 'startDate',
    limit: 100,
    locale: locale as any,
  })

  const plainUser = {
    id: user.id,
    username: (user as any).username,
    email: user.email,
    location: (user as any).location,
    jersey: (user as any).jersey,
    referralData: (user as any).referralData,
  }

  return (
    <div className="min-h-screen text-white pb-24 md:pb-8 bg-[radial-gradient(circle_at_top_right,rgba(234,179,8,0.05),transparent),radial-gradient(circle_at_bottom_left,rgba(234,179,8,0.02),transparent)]">
      <Header />
      <div className="pt-8 sm:pt-20 md:pt-24" />
      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <RulesView competitions={competitions.docs} />
      </main>
      <MainMobileNav user={plainUser} />
    </div>
  )
}

