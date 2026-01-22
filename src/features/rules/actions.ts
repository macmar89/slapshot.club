'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Competition } from '@/payload-types'

export const getCompetitionsAction = async (slug?: string) => {
  const payload = await getPayload({ config })

  const where: any = {
    status: { not_equals: 'finished' },
  }

  if (slug) {
    where.slug = { equals: slug }
  }

  const res = await payload.find({
    collection: 'competitions',
    where,
    sort: 'startDate',
    depth: 0,
  })

  return res.docs as Competition[]
}
