import type { Match, Prediction, Competition } from '@/payload-types'

type ScoringResult = {
  points: number
  isExact: boolean
  isTrend: boolean
  isDiff: boolean
  isWrong: boolean
}

export function calculatePoints(prediction: Prediction, match: Match): ScoringResult {
  const result = match.result
  if (!result) {
    return { points: 0, isExact: false, isTrend: false, isDiff: false, isWrong: false }
  }
  // Ak user netipoval (null), 0 bodov
  if (
    prediction.homeGoals === null ||
    prediction.homeGoals === undefined ||
    prediction.awayGoals === null ||
    prediction.awayGoals === undefined
  ) {
    return { points: 0, isExact: false, isTrend: false, isDiff: false, isWrong: false }
  }

  const pHome = prediction.homeGoals
  const pAway = prediction.awayGoals
  const mHome = result.homeScore!
  const mAway = result.awayScore!

  // 1. EXACT SCORE (Presný výsledok) - 5 bodov
  if (pHome === mHome && pAway === mAway) {
    return {
      points: 5,
      isExact: true,
      isTrend: false,
      isDiff: false,
      isWrong: false,
    }
  }

  // 2. LOGIKA PRE TREND A ROZDIEL
  const pDiff = pHome - pAway
  const mDiff = mHome - mAway

  // Home win (pDiff > 0 && mDiff > 0)
  // Away win (pDiff < 0 && mDiff < 0)
  // Draw (pDiff === 0 && mDiff === 0)
  const isTrend =
    (pDiff > 0 && mDiff > 0) || (pDiff < 0 && mDiff < 0) || (pDiff === 0 && mDiff === 0)

  // Ak uhádol víťaza/trend
  if (isTrend) {
    // 2.1 Uhádol aj ROZDIEL GÓLOV - 3 body
    // (napr. Match 4:2, Tip 3:1 -> pDiff=2, mDiff=2)
    if (pDiff === mDiff) {
      return {
        points: 3,
        isExact: false,
        isTrend: false,
        isDiff: true,
        isWrong: false,
      }
    }

    // 2.2 Len VÍŤAZ - 2 body
    return {
      points: 2,
      isExact: false,
      isTrend: true,
      isWrong: false,
      isDiff: false,
    }
  }

  // 3. NOTHING
  return {
    points: 0,
    isExact: false,
    isTrend: false,
    isDiff: false,
    isWrong: true,
  }
}
