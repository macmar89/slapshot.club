import { getPayload } from 'payload'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import config from '@/payload.config'

export default async function HomePage() {
  const headersList = await headers()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: headersList })

  if (user) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }
}
