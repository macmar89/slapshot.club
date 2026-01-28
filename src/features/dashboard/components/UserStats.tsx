import type { LeaderboardEntry } from '@/payload-types'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { Target, Zap, PlayCircle, XCircle } from 'lucide-react'

interface UserStatsProps {
  leaderboardEntry: LeaderboardEntry | null
}

export function UserStats({ leaderboardEntry }: UserStatsProps) {
  return (
    <IceGlassCard className="p-6">
      <h2 className="text-sm font-black uppercase tracking-widest text-white/60 mb-6">
        Detailné Štatistiky
      </h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white/70">
            <Target className="w-3 h-3 text-green-500" /> Presný výsledok
          </div>
          <span className="text-xs font-black text-white">
            {leaderboardEntry?.exactGuesses || 0}x
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white/70">
            <Zap className="w-3 h-3 text-yellow-500" /> Víťaz + Rozdiel
          </div>
          <span className="text-xs font-black text-white">
            {leaderboardEntry?.correctDiffs || 0}x
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white/70">
            <PlayCircle className="w-3 h-3 text-blue-500" /> Víťaz zápasu
          </div>
          <span className="text-xs font-black text-white">
            {leaderboardEntry?.correctTrends || 0}x
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white/70">
            <XCircle className="w-3 h-3 text-red-500" /> Nesprávne tipy
          </div>
          <span className="text-xs font-black text-white">
            {leaderboardEntry?.wrongGuesses || 0}x
          </span>
        </div>
      </div>
    </IceGlassCard>
  )
}
