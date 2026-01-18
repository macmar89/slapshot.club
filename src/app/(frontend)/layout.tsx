import { Sora, Space_Grotesk } from 'next/font/google'
import { cn } from '@/lib/utils'
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
      <body className="font-sans antialiased bg-background text-foreground">
        <main>{children}</main>
      </body>
    </html>
  )
}
