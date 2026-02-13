import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.resolve(__dirname, '../../.env')
dotenv.config({ path: envPath })

async function testNotification() {
  console.log('--- Testing OneSignal Push ---')

  // Use dynamic import to ensure dotenv has run BEFORE payload.config is evaluated
  const { NotificationService } = await import('../features/notifications/notification-service')
  
  const result = await NotificationService.sendPush({
    type: 'dailySummary',
    title: '🏒 Slapshot Club Test',
    message: 'Toto je testovacia notifikácia z backendu! Ak ju vidíš, všetko funguje.',
  })

  if (result.ok) {
    console.log(`Success! Notification sent to ${result.sent} users.`)
    console.log('Result:', result.result)
  } else {
    console.error('Failed to send notification:', result.error)
  }
}

testNotification().catch(console.error)
