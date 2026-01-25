import { getPayload } from 'payload'
import config from '@/payload.config'

/**
 * Checks if an IP address has exceeded the rate limit.
 * Limit: 10 requests per 60 seconds.
 * 
 * @param ip The IP address to check
 * @returns boolean true if the request is allowed, false if rate limited
 */
export async function checkRateLimit(ip: string): Promise<boolean> {
  const payload = await getPayload({ config })
  const now = new Date()
  const windowMs = 60 * 1000 // 60 seconds
  const maxRequests = 10

  try {
    const result = await payload.find({
      collection: 'rate-limits' as any,
      where: {
        ip: {
          equals: ip,
        },
      },
      limit: 1,
    })

    const record = result.docs[0]

    if (!record) {
      await payload.create({
        collection: 'rate-limits' as any,
        data: {
          ip,
          count: 1,
          lastRequest: now.toISOString(),
        },
      })
      console.log(`[RateLimit] New IP: ${ip}`)
      return true
    }

    const lastRequestTime = new Date(record.lastRequest).getTime()
    const timePassed = now.getTime() - lastRequestTime
    
    console.log(`[RateLimit] IP: ${ip}, Count: ${record.count}, Time passed: ${Math.floor(timePassed / 1000)}s`)

    if (timePassed > windowMs) {
      console.log(`[RateLimit] Resetting window for IP: ${ip}`)
      await payload.update({
        collection: 'rate-limits' as any,
        id: record.id,
        data: {
          count: 1,
          lastRequest: now.toISOString(), // Force ISO string
        },
      })
      return true
    }

    if (record.count >= maxRequests) {
      console.warn(`[RateLimit] Limit reached for IP: ${ip}`)
      return false
    }

    await payload.update({
      collection: 'rate-limits' as any,
      id: record.id,
      data: {
        count: (record.count || 0) + 1,
      },
    })

    return true
  } catch (error) {
    console.error('Error in checkRateLimit:', error)
    return true
  }
}
