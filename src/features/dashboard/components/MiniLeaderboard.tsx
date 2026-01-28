import type { LeaderboardEntry, User } from '@/payload-types'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface MiniLeaderboardProps {
  neighbors: LeaderboardEntry[]
  user: User | null
  competitionId: string
  locale: string
  leaderboardEntry: LeaderboardEntry | null
}

export function MiniLeaderboard({
  neighbors,
  user,
  competitionId,
  locale,
  leaderboardEntry,
}: MiniLeaderboardProps) {
  return (
    <IceGlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-black uppercase tracking-widest text-white/60">
          Mini Rebríček
        </h2>
        <Link
          href={`/${locale}/leaderboard?competition=${competitionId}`}
          className="text-[10px] font-black uppercase text-yellow-500 hover:underline"
        >
          Celý rebríček
        </Link>
      </div>

      <div className="space-y-2">
        {neighbors.length > 0 ? (
          neighbors.map((entry) => {
            const isCurrentUser = (entry.user as any).id === user?.id
            return (
              <div
                key={entry.id}
                className={cn(
                  'flex items-center justify-between p-3 rounded-app border transition-all',
                  isCurrentUser
                    ? 'bg-yellow-500/10 border-yellow-500/50 scale-[1.02] shadow-[0_0_15px_rgba(234,179,8,0.1)]'
                    : 'bg-white/5 border-white/5',
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'w-6 text-[10px] font-black italic',
                      isCurrentUser ? 'text-yellow-500' : 'text-white/30',
                    )}
                  >
                    #{entry.currentRank}
                  </span>
                  <span
                    className={cn(
                      'text-xs font-bold uppercase',
                      isCurrentUser ? 'text-white' : 'text-white/70',
                    )}
                  >
                    {(entry.user as any).username}
                  </span>
                </div>
                <span
                  className={cn(
                    'text-xs font-black italic',
                    isCurrentUser ? 'text-yellow-500' : 'text-white/40',
                  )}
                >
                  {entry.totalPoints} b
                </span>
              </div>
            )
          })
        ) : (
          <div className="text-center py-6 text-white/20 text-xs font-bold uppercase tracking-[0.2em]">
            Rebríček nie je dostupný
          </div>
        )}
      </div>

      {leaderboardEntry && neighbors.length > 1 && (
        <div className="mt-6 text-center">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
            K predbehnutiu ti chýba len pár bodov! <br />
            <span className="text-yellow-500">Natipuj ďalšie zápasy už dnes.</span>
          </p>
        </div>
      )}
    </IceGlassCard>
  )
}
