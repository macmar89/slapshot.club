import '../../../global.css'
import { Sora, Space_Grotesk } from 'next/font/google'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import bgImage from '@/assets/images/background/ssc_stick.png'
import { Toaster } from 'sonner'
import { AnnouncementManager } from '@/features/auth/components/AnnouncementManager'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { User } from '@/payload-types'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
})

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Slapshot Club',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function RootLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const params = await props.params

  const { locale } = params

  const { children } = props

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  const headersList = await headers()
  const payload = await getPayload({ config })
  let user = null
  try {
    const authRes = await payload.auth({ headers: headersList })
    user = authRes.user
  } catch (err) {
    // Not logged in or error
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()

  return (
    <html lang={locale} className={cn(sora.variable, spaceGrotesk.variable)}>
      <body className="font-sans antialiased bg-background text-foreground relative min-h-screen">
        <NextIntlClientProvider messages={messages}>
          {/* Global Background Image */}
          <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
            <div className="relative h-full w-full">
              <Image
                src={bgImage}
                alt="Slapshot Background"
                fill
                className="object-cover object-center"
                priority
                quality={100}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-slate-950/20 to-slate-950/40" />
            </div>
          </div>

          <main className="relative z-10">{children}</main>
          <AnnouncementManager user={user as any} />
          <Toaster richColors position="top-center" theme="dark" />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
