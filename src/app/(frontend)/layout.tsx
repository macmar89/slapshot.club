import { Sora, Space_Grotesk } from 'next/font/google'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import '../../global.css'

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
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="sk" className={cn(sora.variable, spaceGrotesk.variable)}>
      <body className="font-sans antialiased bg-background text-foreground relative min-h-screen">
        {/* Global Background Image */}
        <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
          <div className="relative h-full w-full">
            <Image
              src="/images/background/slapshot_background_lightest.png"
              alt="Slapshot Background"
              fill
              className="object-cover object-center"
              priority
              quality={100}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-slate-950/40" />
          </div>
        </div>

        <main className="relative z-10">{children}</main>
      </body>
    </html>
  )
}
