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

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  localization: {
    locales: ['sk', 'en'],
    defaultLocale: 'sk',
    fallback: true,
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
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
  ],
  globals: [GeneralSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
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
