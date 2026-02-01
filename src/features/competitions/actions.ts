'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'

export async function getCompetitionBySlugAction(slug: string, locale: string) {
  const payload = await getPayload({ config })

  try {
    const { docs } = await payload.find({
      collection: 'competitions',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
      locale: locale as any,
    })

    if (docs.length === 0) {
      return null
    }

    const comp = docs[0]
    return {
      id: comp.id,
      name: comp.name,
      slug: comp.slug,
    }
  } catch (error) {
    console.error('Error fetching competition:', error)
    return null
  }
}
