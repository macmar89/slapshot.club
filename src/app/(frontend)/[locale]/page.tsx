import { getPayload } from 'payload'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import config from '@/payload.config'
import { setRequestLocale } from 'next-intl/server'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const headersList = await headers()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: headersList })

  if (user) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }
}
