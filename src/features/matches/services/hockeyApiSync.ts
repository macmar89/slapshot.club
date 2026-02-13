import { BasePayload } from 'payload'
import { API_HOCKEY_CONFIG } from '@/config/api'
import {
  ApiHockeyResponse,
  ApiHockeyMatch,
  ApiHockeyTeamResponse,
  ApiHockeyTeamDetailed,
} from '../types/apiHockey'
import { createId } from '@paralleldrive/cuid2'

/**
 * Main function to synchronize matches from Hockey API for all active competitions.
 */
export async function syncMatchesFromHockeyApi(payload: BasePayload) {
  const now = new Date()
  const apiKey = process.env.HOCKEY_API_KEY

  if (!apiKey) {
    payload.logger.error('[HOCKEY SYNC] HOCKEY_API_KEY is missing in environment variables.')
    return
  }

  try {
    // 1. Fetch Active Competitions
    const competitions = await payload.find({
      collection: 'competitions',
      where: {
        and: [
          { status: { equals: 'active' } },
          { apiHockeyId: { exists: true } },
          { apiHockeySeason: { exists: true } },
        ],
      },
      limit: 100,
    })

    if (competitions.totalDocs === 0) {
      payload.logger.info('[HOCKEY SYNC] No active competitions with API configuration found.')
      return
    }

    const todayStr = now.toISOString().split('T')[0]

    for (const comp of competitions.docs) {
      // 1.1 Double check dates (even if set to active, only sync during the event)
      const startDate = new Date(comp.startDate)
      const endDate = new Date(comp.endDate)

      if (now < startDate || now > endDate) {
        payload.logger.info(
          `[HOCKEY SYNC] Skipping ${comp.name} - outside of date range (${comp.startDate} to ${comp.endDate})`,
        )
        continue
      }

      payload.logger.info(
        `[HOCKEY SYNC] Processing competition: ${comp.name} (${comp.apiHockeyId})`,
      )

      // 1.2 Check if we have ANY matches for this competition today in our DB
      const startOfDay = new Date(todayStr)
      startOfDay.setUTCHours(0, 0, 0, 0)
      const endOfDay = new Date(todayStr)
      endOfDay.setUTCHours(23, 59, 59, 999)

      const existingMatches = await payload.find({
        collection: 'matches',
        where: {
          and: [
            { competition: { equals: comp.id } },
            { date: { greater_than_equal: startOfDay.toISOString() } },
            { date: { less_than_equal: endOfDay.toISOString() } },
          ],
        },
        limit: 1,
      })

      if (existingMatches.totalDocs === 0) {
        payload.logger.info(
          `[HOCKEY SYNC] Skipping ${comp.name} - no matches scheduled in local DB for ${todayStr}`,
        )
        continue
      }

      // 2. Fetch games for today from Hockey API
      const url = new URL(`${API_HOCKEY_CONFIG.BASE_URL}${API_HOCKEY_CONFIG.ENDPOINTS.GAMES}`)
      url.searchParams.append('league', String(comp.apiHockeyId))
      url.searchParams.append('season', String(comp.apiHockeySeason))
      url.searchParams.append('date', todayStr)

      const response = await fetch(url.toString(), {
        headers: {
          'x-apisports-key': apiKey,
        },
      })

      if (!response.ok) {
        payload.logger.error(
          `[HOCKEY SYNC] API Request failed for ${comp.name}: ${response.statusText}`,
        )
        continue
      }

      const data: ApiHockeyResponse = await response.json()

      if (data.errors && Object.keys(data.errors).length > 0) {
        payload.logger.error(
          `[HOCKEY SYNC] API returned errors for ${comp.name}: ${JSON.stringify(data.errors)}`,
        )
        continue
      }

      const apiMatches = data.response

      if (!apiMatches || apiMatches.length === 0) {
        payload.logger.info(`[HOCKEY SYNC] No matches found in API for ${comp.name} on ${todayStr}`)
        continue
      }

      // 3. Process each match
      for (const apiMatch of apiMatches) {
        await processApiMatch(apiMatch, comp.id as string, payload)
      }
    }
  } catch (error: any) {
    payload.logger.error(`[HOCKEY SYNC ERROR] ${error.message}`)
  }
}

/**
 * Update or create local match based on API data.
 */
async function processApiMatch(
  apiMatch: ApiHockeyMatch,
  competitionId: string,
  payload: BasePayload,
) {
  const apiId = String(apiMatch.id)
  const apiStatusShort = apiMatch.status.short

  // Find local match by apiHockeyId
  const localMatches = await payload.find({
    collection: 'matches',
    where: {
      apiHockeyId: { equals: apiId },
    },
    limit: 1,
  })

  if (localMatches.totalDocs === 0) {
    // We could potentially auto-create matches here, but the user didn't ask for it yet.
    // For now, only sync existing ones.
    return
  }

  const localMatch = localMatches.docs[0]
  const internalStatus =
    (API_HOCKEY_CONFIG.GAME_STATUSES as any)[apiStatusShort] || localMatch.status

  // Prepare updates
  const updateData: any = {
    apiHockeyStatus: apiStatusShort,
    status: internalStatus,
  }

  // Update scores and ending type if match is live or finished
  if (internalStatus !== 'scheduled') {
    updateData.result = {
      ...localMatch.result,
      homeScore: apiMatch.scores.home ?? (localMatch.result as any)?.homeScore ?? 0,
      awayScore: apiMatch.scores.away ?? (localMatch.result as any)?.awayScore ?? 0,
      endingType: detectEndingType(apiMatch),
    }
  }

  // Only update if something changed (to avoid unnecessary hooks)
  const hasChanges =
    localMatch.status !== updateData.status ||
    localMatch.apiHockeyStatus !== updateData.apiHockeyStatus ||
    (updateData.result &&
      ((localMatch.result as any)?.homeScore !== updateData.result.homeScore ||
        (localMatch.result as any)?.awayScore !== updateData.result.awayScore ||
        (localMatch.result as any)?.endingType !== updateData.result.endingType))

  if (hasChanges) {
    const scoreInfo = updateData.result
      ? ` | Score: ${updateData.result.homeScore}:${updateData.result.awayScore}`
      : ''

    payload.logger.info(
      `[HOCKEY SYNC] Updating match ${localMatch.displayTitle} (API ID: ${apiId}, Status: ${apiStatusShort}${scoreInfo})`,
    )
    try {
      await payload.update({
        collection: 'matches',
        id: localMatch.id,
        data: updateData,
      })
    } catch (err: any) {
      payload.logger.error(
        `[HOCKEY SYNC ERROR] Failed to update match ${localMatch.displayTitle} (${apiId}): ${err.message}`,
      )
    }
  }
}

/**
 * Detect ending type (regular, ot, so) from periods data.
 */
function detectEndingType(apiMatch: ApiHockeyMatch): 'regular' | 'ot' | 'so' {
  if (apiMatch.periods.penalties !== null) return 'so'
  if (apiMatch.periods.overtime !== null) return 'ot'
  return 'regular'
}

/**
 * Sync future matches (next 14 days) for competitions.
 * If competitionId is provided, syncs only that one.
 * If not, syncs all active competitions with API configuration.
 */
export async function syncFutureMatches(
  payload: BasePayload,
  { competitionId, apiHockeyId }: { competitionId?: string; apiHockeyId?: string | number } = {},
) {
  const apiKey = process.env.HOCKEY_API_KEY
  if (!apiKey) {
    payload.logger.error('[FUTURE SYNC] HOCKEY_API_KEY missing.')
    return
  }

  try {
    let competitionsToSync: any[] = []

    if (competitionId) {
      const competition = await payload.findByID({
        collection: 'competitions',
        id: competitionId,
      })
      if (competition) {
        competitionsToSync.push(competition)
      }
    } else if (apiHockeyId) {
      const competitionResult = await payload.find({
        collection: 'competitions',
        where: {
          apiHockeyId: { equals: Number(apiHockeyId) },
        },
        limit: 1,
      })
      if (competitionResult.docs.length > 0) {
        competitionsToSync.push(competitionResult.docs[0])
      }
    } else {
      const activeCompetitions = await payload.find({
        collection: 'competitions',
        where: {
          and: [
            { status: { equals: 'active' } },
            { apiHockeyId: { exists: true } },
            { apiHockeySeason: { exists: true } },
          ],
        },
        limit: 100,
      })
      competitionsToSync = activeCompetitions.docs
    }

    if (competitionsToSync.length === 0) {
      payload.logger.info('[FUTURE SYNC] No competitions to sync.')
      return
    }

    for (const competition of competitionsToSync) {
      if (!competition.apiHockeyId || !competition.apiHockeySeason) {
        payload.logger.error(`[FUTURE SYNC] Competition ${competition.id} missing API info.`)
        continue
      }

      const leagueId = competition.apiHockeyId
      const season = competition.apiHockeySeason
      const currentCompId = competition.id

      payload.logger.info(`[FUTURE SYNC] Starting sync for ${competition.name}...`)

      // 2. Loop through next 14 days
      const today = new Date()
      const daysToSync = 14

      for (let i = 0; i < daysToSync; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        const dateStr = date.toISOString().split('T')[0]

        payload.logger.info(`[FUTURE SYNC][${competition.name}] Checking matches for ${dateStr}...`)

        // 3. Fetch from API
        const url = new URL(`${API_HOCKEY_CONFIG.BASE_URL}${API_HOCKEY_CONFIG.ENDPOINTS.GAMES}`)
        url.searchParams.append('league', String(leagueId))
        url.searchParams.append('season', String(season))
        url.searchParams.append('date', dateStr)

        const response = await fetch(url.toString(), {
          headers: {
            'x-apisports-key': apiKey,
          },
        })

        if (!response.ok) {
          payload.logger.error(
            `[FUTURE SYNC][${competition.name}] API error for ${dateStr}: ${response.statusText}`,
          )
          continue
        }

        const data: ApiHockeyResponse = await response.json()
        const matches = data.response

        if (!matches || matches.length === 0) {
          continue
        }

        // 4. Process matches
        for (const match of matches) {
          await createMatchIfNotExists(match, currentCompId as string, payload)
        }
      }
      payload.logger.info(`[FUTURE SYNC] Finished sync for ${competition.name}.`)
    }
  } catch (error: any) {
    payload.logger.error(`[FUTURE SYNC ERROR] ${error.message}`)
  }
}

async function createMatchIfNotExists(
  apiMatch: ApiHockeyMatch,
  competitionId: string,
  payload: BasePayload,
) {
  const apiId = String(apiMatch.id)

  // Check existence
  const existing = await payload.find({
    collection: 'matches',
    where: {
      apiHockeyId: { equals: apiId },
    },
    limit: 1,
  })

  if (existing.totalDocs > 0) {
    // Already exists, skip (or update if we wanted to, but requirement says "add missing")
    return
  }

  // Resolve Teams
  const homeTeam = await findTeamByApiId(payload, apiMatch.teams.home.id)
  const awayTeam = await findTeamByApiId(payload, apiMatch.teams.away.id)

  if (!homeTeam || !awayTeam) {
    payload.logger.warn(
      `[FUTURE SYNC] Skipping match ${apiId}: Teams not found (Home: ${apiMatch.teams.home.name}, Away: ${apiMatch.teams.away.name})`,
    )
    return
  }

  // Format round label
  // "week. kolo" -> e.g. "39. kolo"
  let roundLabel = ''
  if (apiMatch.week) {
    // API usually returns "Round 39" or "39". Let's handle generic string.
    // However, user specifically asked for "week. kolo".
    // If apiMatch.week is just number-like string, we use it.
    const weekClean = apiMatch.week.replace(/[^0-9]/g, '')
    if (weekClean) {
      roundLabel = `${weekClean}. kolo`
    } else {
      roundLabel = apiMatch.week // Fallback
    }
  }

  // Create Match
  try {
    const newMatch = await payload.create({
      collection: 'matches',
      data: {
        competition: competitionId,
        date: apiMatch.date, // ISO string from API usually works
        homeTeam: homeTeam.id,
        awayTeam: awayTeam.id,
        status: 'scheduled',
        apiHockeyId: apiId,
        apiHockeyStatus: apiMatch.status.short,
        result: {
          stage_type: 'regular_season', // Defaulting to regular season for now
          endingType: 'regular',
          round_label: roundLabel,
        },
      },
    })
    payload.logger.info(
      `[FUTURE SYNC] Created match: ${newMatch.displayTitle} (${dateStr(apiMatch.date)})`,
    )
  } catch (err: any) {
    payload.logger.error(`[FUTURE SYNC] Failed to create match ${apiId}: ${err.message}`)
  }
}

async function findTeamByApiId(payload: BasePayload, apiId: number) {
  const result = await payload.find({
    collection: 'teams',
    where: {
      apiHockeyId: { equals: String(apiId) },
    },
    limit: 1,
  })
  return result.docs[0] || null
}

function dateStr(iso: string) {
  return iso.split('T')[0]
}

/**
 * Sync teams for a specific league and season.
 */
export async function syncTeamsForLeague(
  payload: BasePayload,
  {
    leagueId,
    season,
    tag,
  }: {
    leagueId: number | string
    season: number | string
    tag: 'sk' | 'cz' | 'nhl' | 'khl' | 'sk1' | 'iihf'
  },
) {
  const apiKey = process.env.HOCKEY_API_KEY
  if (!apiKey) {
    payload.logger.error('[TEAM SYNC] HOCKEY_API_KEY missing.')
    return
  }

  try {
    payload.logger.info(`[TEAM SYNC] Fetching teams for league ${leagueId} (${season})...`)

    const url = new URL(`${API_HOCKEY_CONFIG.BASE_URL}${API_HOCKEY_CONFIG.ENDPOINTS.TEAMS}`)
    url.searchParams.append('league', String(leagueId))
    url.searchParams.append('season', String(season))

    const response = await fetch(url.toString(), {
      headers: {
        'x-apisports-key': apiKey,
      },
    })

    if (!response.ok) {
      payload.logger.error(`[TEAM SYNC] API error: ${response.statusText}`)
      return
    }

    const data: ApiHockeyTeamResponse = await response.json()
    const apiTeams = data.response

    if (!apiTeams || apiTeams.length === 0) {
      payload.logger.info(`[TEAM SYNC] No teams found in API for league ${leagueId}.`)
      return
    }

    for (const apiTeam of apiTeams) {
      await processApiTeam(apiTeam, tag, payload)
    }

    payload.logger.info(`[TEAM SYNC] Finished syncing teams for league ${leagueId}.`)
  } catch (error: any) {
    payload.logger.error(`[TEAM SYNC ERROR] ${error.message}`)
  }
}

async function processApiTeam(
  apiTeam: ApiHockeyTeamDetailed,
  tag: 'sk' | 'cz' | 'nhl' | 'khl' | 'sk1' | 'iihf',
  payload: BasePayload,
) {
  const apiId = String(apiTeam.id)

  // Check if team already exists
  const existing = await payload.find({
    collection: 'teams',
    where: {
      apiHockeyId: { equals: apiId },
    },
    limit: 1,
  })

  if (existing.totalDocs > 0) {
    // payload.logger.info(`[TEAM SYNC] Team ${apiTeam.name} already exists. Skipping.`)
    return
  }

  payload.logger.info(`[TEAM SYNC] Creating new team: ${apiTeam.name} (${apiId})`)

  let logoId: string | null = null

  // 1. Download and upload logo
  if (apiTeam.logo) {
    logoId = await uploadTeamLogo(apiTeam.logo, apiTeam.name, payload)
  }

  // 2. Generate shortName
  // We take first 3 chars of name, or if it's multiple words, we take first letters.
  // Actually, let's keep it simple: first 3 chars uppercase.
  const shortName = apiTeam.name.substring(0, 3).toUpperCase()

  // 3. Create Team
  try {
    const data: any = {
      name: apiTeam.name,
      shortName: shortName,
      apiHockeyId: apiId,
      type: apiTeam.national ? 'national' : 'club',
      leagueTags: [tag],
      logo: logoId || undefined,
      // Optional: you could map country code here if it matches our select options
      // country: apiTeam.country.code === 'RU' ? 'RUS' ... (but our Teams.ts has SVK, CZE, USA, CAN)
    }

    await (payload as any).create({
      collection: 'teams',
      data: data,
      overrideAccess: true,
    })
  } catch (err: any) {
    payload.logger.error(`[TEAM SYNC] Failed to create team ${apiTeam.name}: ${err.message}`)
  }
}

async function uploadTeamLogo(
  url: string,
  teamName: string,
  payload: BasePayload,
): Promise<string | null> {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Failed to fetch logo: ${response.statusText}`)

    const buffer = await response.arrayBuffer()
    const filename = `${createId()}.png`

    const media = await payload.create({
      collection: 'team-logos',
      data: {
        alt: `Logo ${teamName}`,
      },
      file: {
        data: Buffer.from(buffer),
        mimetype: 'image/png',
        name: filename,
        size: buffer.byteLength,
      },
    })

    return media.id as string
  } catch (err: any) {
    payload.logger.error(`[TEAM SYNC] Logo upload failed for ${teamName}: ${err.message}`)
    return null
  }
}
