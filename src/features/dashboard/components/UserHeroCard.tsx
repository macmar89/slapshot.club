import type { User, LeaderboardEntry } from '@/payload-types'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { Trophy, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserHeroCardProps {
  user: User
  leaderboardEntry: LeaderboardEntry | null
}

export function UserHeroCard({ user, leaderboardEntry }: UserHeroCardProps) {
  const getRankBadge = (rank: number, totalUsers: number = 100) => {
    const percent = (rank / totalUsers) * 100
    if (rank <= 3) return { label: 'Elita ligy', color: 'bg-yellow-500' }
    if (percent <= 10) return { label: 'Top 10% ligy', color: 'bg-purple-500' }
    if (rank > 0) return { label: 'Stabilný hráč', color: 'bg-blue-500' }
    return { label: 'Nováčik sezóny', color: 'bg-green-500' }
  }

  const badge = leaderboardEntry?.currentRank
    ? getRankBadge(leaderboardEntry.currentRank as number)
    : { label: 'Nováčik sezóny', color: 'bg-green-500' }

  return (
    <IceGlassCard className="lg:col-span-4 group overflow-hidden" withGradient>
      <div className="p-6 relative">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Trophy className="w-24 h-24 rotate-12" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-500 to-yellow-200 flex items-center justify-center text-black font-black text-xl border-2 border-white/20">
              {user.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-white font-black text-xl uppercase leading-none">
                {user.username}
              </div>
              <div
                className={cn(
                  'inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider',
                  badge.color,
                )}
              >
                {badge.label}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1">
                Poradie
              </div>
              <div className="text-3xl font-black text-white italic">
                #{leaderboardEntry?.currentRank || '--'}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1">
                Body
              </div>
              <div className="text-3xl font-black text-yellow-500 italic">
                {leaderboardEntry?.totalPoints || 0}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center text-xs">
            <span className="text-white/40 uppercase font-bold tracking-widest italic">
              Hokejová Karta
            </span>
            <div className="flex gap-1 text-yellow-500">
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
              <Star className="w-3 h-3 fill-current" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overlay/Card Style */}
      <div className="bg-white/5 p-4 grid grid-cols-3 text-center border-t border-white/10">
        <div>
          <div className="text-[9px] text-white/40 font-bold uppercase">Tipy</div>
          <div className="text-sm font-black text-white">{leaderboardEntry?.totalMatches || 0}</div>
        </div>
        <div>
          <div className="text-[9px] text-white/40 font-bold uppercase">Presné</div>
          <div className="text-sm font-black text-green-500">
            {leaderboardEntry?.exactGuesses || 0}
          </div>
        </div>
        <div>
          <div className="text-[9px] text-white/40 font-bold uppercase">Trend</div>
          <div className="text-sm font-black text-blue-500">
            {leaderboardEntry?.correctTrends || 0}
          </div>
        </div>
      </div>
    </IceGlassCard>
  )
}
