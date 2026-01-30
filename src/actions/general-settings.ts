'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import { unstable_cache } from 'next/cache'

const getGeneralSettingsCached = unstable_cache(
  async (locale: string) => {
    const payload = await getPayload({ config })
    return payload.findGlobal({
      slug: 'general-settings',
      locale: locale as any,
    })
  },
  ['general-settings'],
  { tags: ['general-settings'] }
)

export const getGeneralSettings = async (locale: string = 'sk') => {
  try {
    return await getGeneralSettingsCached(locale)
  } catch (error) {
    console.error('Error fetching general settings:', error)
    return null
  }
}
