import { getPayload } from 'payload'
import config from './src/payload.config'
import dotenv from 'dotenv'

dotenv.config()

async function run() {
  const payload = await getPayload({ config })

  try {
    const users = await payload.find({
      collection: 'users',
      where: {
        or: [
          { _verified: { equals: false } },
          { _verified: { exists: false } },
          { _verified: { equals: null } },
        ],
      },
    })

    for (const user of users.docs) {
      await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          _verified: true,
        },
      })
    }

    process.exit(0)
  } catch (err) {
    console.error('Manual verification failed:', err)
    process.exit(1)
  }
}

run()
