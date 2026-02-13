import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.resolve(__dirname, '../../.env')
dotenv.config({ path: envPath })

async function testMatchNotifications() {
  console.log('--- Testing Match Notifications ---')

  const { getPayload } = await import('payload')
  const { default: config } = await import('../payload.config')
  
  const payload = await getPayload({ config })

  // 1. Find a match to test with
  const matches = await payload.find({
    collection: 'matches',
    limit: 1,
    sort: '-createdAt'
  })

  if (matches.docs.length === 0) {
    console.log('No matches found to test with.')
    return
  }

  const match = matches.docs[0]
  console.log(`Testing with match: ${match.displayTitle} (${match.id})`)

  // 0. Ensure it starts as scheduled
  console.log('\n--- Resetting to Scheduled ---')
  await payload.update({
    collection: 'matches',
    id: match.id,
    data: {
      status: 'scheduled'
    }
  })

  // 1. Simulate Match Start
  console.log('\n--- Simulating Match Start ---')
  await payload.update({
    collection: 'matches',
    id: match.id,
    data: {
      status: 'live'
    }
  })

  // 3. Simulate Score Change
  console.log('\n--- Simulating Score Change ---')
  await payload.update({
    collection: 'matches',
    id: match.id,
    data: {
      result: {
        ...match.result,
        homeScore: (match.result as any).homeScore + 1
      }
    }
  })

  console.log('\nVerification complete. Check logs above for NotificationService messages.')
}

testMatchNotifications().catch(console.error)
