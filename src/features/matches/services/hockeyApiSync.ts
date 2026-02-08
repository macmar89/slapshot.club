import { BasePayload } from 'payload'
import { API_HOCKEY_CONFIG } from '@/config/api'
import { ApiHockeyResponse, ApiHockeyMatch } from '../types/apiHockey'

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
    await payload.update({
      collection: 'matches',
      id: localMatch.id,
      data: updateData,
    })
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
 * Sync future matches (next 14 days) for a specific competition.
 * Creates new matches if they don't exist.
 */
export async function syncFutureMatches(
  payload: BasePayload,
  competitionId: string = 'spsevlvb34lj4i4ny3aq4odq', // Default to Slovak League
) {
  const apiKey = process.env.HOCKEY_API_KEY
  if (!apiKey) {
    payload.logger.error('[FUTURE SYNC] HOCKEY_API_KEY missing.')
    return
  }

  try {
    // 1. Get competition details to know apiHockeyId and season
    const competition = await payload.findByID({
      collection: 'competitions',
      id: competitionId,
    })

    if (!competition || !competition.apiHockeyId || !competition.apiHockeySeason) {
      payload.logger.error(
        `[FUTURE SYNC] Competition ${competitionId} not found or missing API info.`,
      )
      return
    }

    const leagueId = competition.apiHockeyId
    const season = competition.apiHockeySeason

    // 2. Loop through next 14 days (0 to 13)
    // "Cron by mal zbehnúť vždy v pondelok o 3 ráno a mal by doplniť chýbajúce zápasy na 2 tždne dopredu (do nedele za 13 dní či ako to vychádza)"
    const today = new Date()
    const daysToSync = 14

    for (let i = 0; i < daysToSync; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]

      payload.logger.info(`[FUTURE SYNC] Checking matches for ${dateStr}...`)

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
        payload.logger.error(`[FUTURE SYNC] API error for ${dateStr}: ${response.statusText}`)
        continue
      }

      const data: ApiHockeyResponse = await response.json()
      const matches = data.response

      if (!matches || matches.length === 0) {
        continue
      }

      // 4. Process matches
      for (const match of matches) {
        await createMatchIfNotExists(match, competitionId, payload)
      }
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
    payload.logger.info(`[FUTURE SYNC] Created match: ${newMatch.displayTitle} (${dateStr(apiMatch.date)})`)
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
