import '../../../global.css'
import { Sora, Space_Grotesk } from 'next/font/google'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { NextIntlClientProvider } from 'next-intl'
import { Analytics } from '@/components/layout/Analytics'
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

export const dynamic = 'force-dynamic'

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

  const headersList = new Headers(await headers())
  const payload = await getPayload({ config })
  let user = null
  let activeAnnouncements: any[] = []

  try {
    // Use the Headers object directly, casting to any if necessary to avoid Next.js 15 internal type conflicts
    const authRes = await payload.auth({ headers: headersList as any })
    user = authRes.user

    if (user) {
      const announcementsRes = await payload.find({
        collection: 'announcements' as any,
        where: {
          isActive: { equals: true },
        },
        locale: locale as any,
        depth: 1,
      })
      activeAnnouncements = announcementsRes.docs.map((doc) => ({
        id: doc.id,
        title: doc.title,
        content: doc.content,
        buttonText: doc.buttonText,
        image: doc.image
          ? {
              url: (doc.image as any).url,
              alt: (doc.image as any).alt,
            }
          : null,
        icon: doc.icon,
        maxDisplaysPerUser: doc.maxDisplaysPerUser,
        targeting: doc.targeting,
      }))
    }
  } catch (err) {}

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()

  // Map user to plain object for serialization
  const plainUser = user
    ? {
        id: user.id,
        username: (user as any).username,
        role: (user as any).role,
        hasSeenOnboarding: (user as any).hasSeenOnboarding,
        seenAnnouncements: (user as any).seenAnnouncements || [],
      }
    : null

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
          <AnnouncementManager user={plainUser as any} announcements={activeAnnouncements} />
          <Toaster richColors position="top-center" theme="dark" />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
