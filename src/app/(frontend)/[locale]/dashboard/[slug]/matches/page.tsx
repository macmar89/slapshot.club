import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { MatchesView } from '@/features/matches/components/MatchesView'

export default async function CompetitionMatches({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const payload = await getPayload({ config })

  const { docs: competitions } = await payload.find({
    collection: 'competitions',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const competition = competitions[0]

  if (!competition) {
    notFound()
  }

  return <MatchesView competition={competition} />
}
