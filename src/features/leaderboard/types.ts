export type Trend = 'up' | 'down' | 'same'

export interface LeaderboardEntry {
  id: string
  rank: number
  name: string
  avatarUrl: string | null
  points: number
  trend: Trend
  isCurrentUser: boolean
  // Extended stats
  predictionsCount: number
  exactScores: number
  correctDiffs: number
  winners: number
  wrongGuesses: number
  highlightedPoints?: number // Optional highlighted points
}
