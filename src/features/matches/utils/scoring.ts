import type { Match, Prediction, Competition } from '@/payload-types'

type ScoringResult = {
  points: number
  isExact: boolean
  isTrend: boolean
  isWrong: boolean
}

export function calculatePoints(
  prediction: Prediction,
  match: Match,
  competition: Competition,
): ScoringResult {
  const result = match.result
  if (!result) {
    return { points: 0, isExact: false, isTrend: false, isWrong: false }
  }
  // Ak user netipoval (null), 0 bodov
  if (prediction.homeGoals === null || prediction.homeGoals === undefined ||
      prediction.awayGoals === null || prediction.awayGoals === undefined) {
    return { points: 0, isExact: false, isTrend: false, isWrong: false }
  }

  const pHome = prediction.homeGoals
  const pAway = prediction.awayGoals
  const mHome = result.homeScore!
  const mAway = result.awayScore!

  // 1. EXACT SCORE (Presný výsledok)
  if (pHome === mHome && pAway === mAway) {
    return {
      points: competition.scoringRules?.exactScore ?? 3, // Fallback na 3 ak nie je definované
      isExact: true,
      isTrend: false, // Presný výsledok sa už neráta ako trend (aby boli štatistiky oddelené)
      isWrong: false,
    }
  }

  // 2. CORRECT TREND (Trafený víťaz alebo remíza)
  const pDiff = pHome - pAway
  const mDiff = mHome - mAway

  // Home win (pDiff > 0 && mDiff > 0)
  // Away win (pDiff < 0 && mDiff < 0)
  // Draw (pDiff === 0 && mDiff === 0)
  const isTrend =
    (pDiff > 0 && mDiff > 0) ||
    (pDiff < 0 && mDiff < 0) ||
    (pDiff === 0 && mDiff === 0)

  if (isTrend) {
    return {
      points: competition.scoringRules?.winnerOnly ?? 1, // Fallback na 1
      isExact: false,
      isTrend: true,
      isWrong: false,
    }
  }

  // 3. NOTHING
  return {
    points: 0,
    isExact: false,
    isTrend: false,
    isWrong: true,
  }
}
