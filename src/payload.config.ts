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
import { CompetitionSnapshots } from './collections/CompetitionSnapshots'
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
import { updateMatchesTask, runUpdateMatches } from './payload/tasks/updateMatches'
import {
  updateRealtimeRankingTask,
  runUpdateRealtimeRanking,
} from './payload/tasks/updateRealtimeRanking'
import { syncHockeyMatchesTask, runSyncHockeyMatches } from './payload/tasks/syncHockeyMatches'
import { syncFutureMatchesTask, runSyncFutureMatches } from './payload/tasks/syncFutureMatches'
import { syncTeamsTask, runSyncTeams } from './payload/tasks/syncTeams'
import { updateLeaderboardsTask, runUpdateLeaderboards } from './payload/cron/updateLeaderboards' // Import
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const hockeyApiDisabled = process.env.HOCKEY_API_DISABLE_REFRESH === 'true'

export default buildConfig({
  jobs: {
    tasks: [
      {
        slug: 'update-matches',
        label: 'Update Matches',
        inputSchema: [
          {
            name: 'manual',
            type: 'checkbox',
            label: 'Manual Trigger',
          },
        ],
        schedule: hockeyApiDisabled
          ? []
          : [
              {
                cron: '*/5 * * * *',
                queue: 'default',
              },
            ],
        handler: updateMatchesTask,
      },
      {
        slug: 'update-realtime-ranking',
        label: 'Update Realtime Ranking',
        schedule: hockeyApiDisabled
          ? []
          : [
              {
                cron: '*/10 * * * *',
                queue: 'default',
              },
            ],
        handler: updateRealtimeRankingTask,
      },
      {
        slug: 'sync-hockey-matches',
        label: 'Sync Hockey API Matches',
        schedule: hockeyApiDisabled
          ? []
          : [
              {
                cron: '*/2 * * * *',
                queue: 'default',
              },
            ],
        handler: syncHockeyMatchesTask,
      },
      {
        slug: 'sync-future-matches',
        label: 'Sync Future Matches (Weekly)',
        schedule: hockeyApiDisabled
          ? []
          : [
              {
                cron: '45 3 * * 1', // Every Monday at 3:45 AM
                queue: 'default',
              },
            ],
        handler: (args) =>
          syncFutureMatchesTask({
            ...args,
            input: {
              apiHockeyIds: [91], // Slovenská liga
            },
          }),
      },
      {
        slug: 'sync-teams',
        label: 'Sync Teams for League',
        inputSchema: [
          {
            name: 'leagueId',
            type: 'number',
            label: 'League ID',
            required: true,
          },
          {
            name: 'season',
            type: 'number',
            label: 'Season',
            required: true,
          },
          {
            name: 'tag',
            type: 'select',
            label: 'League Tag',
            required: true,
            options: [
              { label: 'KHL', value: 'khl' },
              { label: 'NHL', value: 'nhl' },
              { label: 'SVK', value: 'sk' },
              { label: 'CZ', value: 'cz' },
              { label: 'IIHF', value: 'iihf' },
            ],
          },
        ],
        handler: syncTeamsTask,
      },
      {
        slug: 'update-leaderboards',
        label: 'Update Leaderboards (Hourly)',
        inputSchema: [
          {
            name: 'force',
            type: 'checkbox',
            label: 'Force Update (Ignore hour and match check)',
          },
        ],
        schedule: hockeyApiDisabled
          ? []
          : [
              {
                cron: '0 * * * *', // Every hour
                queue: 'default',
              },
            ],
        handler: updateLeaderboardsTask,
      },
    ],
    autoRun: [
      {
        cron: '*/1 * * * *',
        allQueues: true,
      },
    ],
    jobsCollectionOverrides: ({ defaultJobsCollection }) => ({
      ...defaultJobsCollection,
      admin: {
        ...defaultJobsCollection.admin,
        group: 'System',
      },
    }),
  },
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
      afterNavLinks: [
        '/payload/components/FeedbackBadge#FeedbackBadge',
        '/payload/components/SyncMatchesLink#SyncMatchesLink',
      ],
      views: {
        SyncMatches: {
          Component: '/payload/components/SyncMatchesPage#SyncMatchesPage',
          path: '/sync-matches',
        },
      },
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
    CompetitionSnapshots,
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
  onInit: async (payload) => {
    if (hockeyApiDisabled) {
      payload.logger.info('Hockey API Refresh is disabled via HOCKEY_API_DISABLE_REFRESH env var.')
      return
    }

    try {
      payload.logger.info('Triggering initial updates...')
      await runUpdateMatches(payload)
      await runSyncHockeyMatches(payload)
      await runUpdateRealtimeRanking(payload)
      await runUpdateLeaderboards(payload, { force: true })
      payload.logger.info('Initial updates completed successfully.')
    } catch (err) {
      payload.logger.error({ err }, 'Failed to run initial updates')
    }
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    prodMigrations: migrations,
    push: process.env.PAYLOAD_PUSH === 'true',
  }),
  endpoints: [
    {
      path: '/sync-matches',
      method: 'get',
      handler: async (req) => {
        const { payload, user, searchParams } = req

        if ((user as any)?.role !== 'admin') {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const competitionId = searchParams.get('cid') || undefined
        const apiHockeyId = searchParams.get('ahid') || undefined
        payload.logger.info(
          `[API] Manual sync triggered via /api/sync-matches${competitionId ? ` for competition CID ${competitionId}` : ''}${apiHockeyId ? ` for API ID ${apiHockeyId}` : ''}`,
        )

        runSyncFutureMatches(payload, { competitionId, apiHockeyId })
        return Response.json(
          {
            message:
              competitionId || apiHockeyId
                ? `Sync started for ${competitionId || apiHockeyId}`
                : 'Sync started',
          },
          { status: 200 },
        )
      },
    },
  ],
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
