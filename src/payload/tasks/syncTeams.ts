import { TaskHandler } from 'payload'
import { syncTeamsForLeague } from '@/features/matches/services/hockeyApiSync'

export const runSyncTeams = async (
  payload: any,
  params: {
    leagueId: number | string
    season: number | string
    tag: 'sk' | 'cz' | 'nhl' | 'khl' | 'iihf'
  },
) => {
  payload.logger.info(`[TASK] Starting Team Synchronization for league ${params.leagueId}...`)
  await syncTeamsForLeague(payload, params)
}

export const syncTeamsTask: TaskHandler<any> = async ({ input, req: { payload } }) => {
  const leagueId = input?.leagueId || 35 // Default to KHL
  const season = input?.season || 2025
  const tag = input?.tag || 'khl'

  await runSyncTeams(payload, { leagueId, season, tag })

  return {
    output: { message: `Teams synchronized for league ${leagueId}` },
  }
}
