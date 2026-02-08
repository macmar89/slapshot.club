import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { syncFutureMatches } from '../src/features/matches/services/hockeyApiSync'

async function run() {
  const payload = await getPayload({ config })

  console.log('--- Spúšťam synchronizáciu budúcich zápasov (Manuálne) ---')
  await syncFutureMatches(payload)
  console.log('--- Synchronizácia dokončená ---')

  process.exit(0)
}

run()
