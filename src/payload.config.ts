import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Competitions } from './collections/Competitions'
import { Feedback } from './collections/Feedback'
import { MembershipTiers } from './collections/MembershipTiers'
import { UserMemberships } from './collections/UserMemberships'
import { LeaderboardEntries } from './collections/LeaderboardEntries'
import { Teams } from './collections/Teams'
import { Matches } from './collections/Matches'
import { Predictions } from './collections/Predictions'
import { GeneralSettings } from './collections/GeneralSettings'
import { Leagues } from './collections/Leagues'
import { MiniLeagues } from './collections/MiniLeagues'
import { TeamLogos } from './collections/TeamLogos'
import { RateLimits } from './collections/RateLimits'
import { Announcements } from './collections/Announcements'
import { Countries } from './collections/Countries'
import { Regions } from './collections/Regions'
import { Badges } from './collections/Badges'
import { BadgeMedia } from './collections/BadgeMedia'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  localization: {
    locales: ['sk', 'en', 'cz'],
    defaultLocale: 'sk',
    fallback: true,
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      afterNavLinks: ['/payload/components/FeedbackBadge#FeedbackBadge'],
    },
  },
  collections: [
    Users,
    Media,
    Competitions,
    Feedback,
    MembershipTiers,
    UserMemberships,
    LeaderboardEntries,
    Teams,
    Matches,
    Predictions,
    Leagues,
    MiniLeagues,
    TeamLogos,
    RateLimits,
    Announcements,
    Countries,
    Regions,
    Badges,
    BadgeMedia,
  ],
  globals: [GeneralSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  email: ({ payload }) => ({
    name: 'brevo',
    defaultFromName: process.env.BREVO_SENDER_NAME || 'Slapshot Club',
    defaultFromAddress: process.env.BREVO_SENDER_EMAIL || 'info@slapshot.club',
    sendEmail: async (args: any) => {
      const { to, subject, html } = args

      const apiKey = process.env.BREVO_API_KEY
      if (!apiKey || apiKey === 'YOUR_BREVO_API_KEY_HERE') {
        payload.logger.error('Brevo API Key is missing or default. Email not sent.')
        return
      }

      payload.logger.info(`[EMAIL] Attempting to send email to ${to} via Brevo API...`)

      try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'api-key': apiKey,
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            sender: {
              name: process.env.BREVO_SENDER_NAME || 'Slapshot Club',
              email: process.env.BREVO_SENDER_EMAIL || 'info@slapshot.club',
            },
            to: [{ email: to }],
            subject: subject,
            htmlContent: html,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          payload.logger.error(`[EMAIL ERROR] Brevo API failed: ${JSON.stringify(errorData)}`)
        } else {
          payload.logger.info(`[EMAIL SUCCESS] Verification sent to ${to}`)
        }
      } catch (err: any) {
        payload.logger.error(`[EMAIL ERROR] Fetch failed: ${err.message}`)
      }
    },
  }),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: {
          generateFileURL: ({ filename, prefix }: { filename: string; prefix?: string }) => {
            return `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${prefix ? `${prefix}/` : ''}${filename}`
          },
        },
        'team-logos': {
          prefix: 'team_logo',
          generateFileURL: ({ filename, prefix }: { filename: string; prefix?: string }) => {
            return `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${prefix ? `${prefix}/` : ''}${filename}`
          },
        },
        'badge-media': {
          prefix: 'badge',
          generateFileURL: ({ filename, prefix }: { filename: string; prefix?: string }) => {
            return `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${prefix ? `${prefix}/` : ''}${filename}`
          },
        },
      },
      bucket: process.env.R2_BUCKET || '',
      config: {
        endpoint: process.env.R2_ENDPOINT || '',
        region: process.env.R2_REGION || 'auto',
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
      },
    }),
  ],
})
