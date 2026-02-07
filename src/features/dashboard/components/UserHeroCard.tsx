import type { User, LeaderboardEntry } from '@/payload-types'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { Trophy, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations, useLocale } from 'next-intl'

interface UserHeroCardProps {
  user: User
  leaderboardEntry: LeaderboardEntry | null
}

export function UserHeroCard({ user, leaderboardEntry }: UserHeroCardProps) {
  const t = useTranslations('Dashboard.hero')
  const locale = useLocale()

  const getRankBadge = (rank: number, totalUsers: number = 100) => {
    const percent = (rank / totalUsers) * 100
    if (rank <= 3) return { label: t('badge_elite'), color: 'bg-yellow-500' }
    if (percent <= 10) return { label: t('badge_top_10'), color: 'bg-purple-500' }
    if (rank > 0) return { label: t('badge_stable'), color: 'bg-blue-500' }
    return { label: t('badge_rookie'), color: 'bg-green-500' }
  }

  const badge = leaderboardEntry?.currentRank
    ? getRankBadge(leaderboardEntry.currentRank as number)
    : { label: t('badge_rookie'), color: 'bg-green-500' }

  const avgPoints =
    leaderboardEntry?.totalMatches && leaderboardEntry.totalMatches > 0
      ? (leaderboardEntry.totalPoints! / leaderboardEntry.totalMatches).toFixed(2)
      : '0.00'

  const registrationDate = new Date(user.createdAt).toLocaleDateString(
    locale === 'sk' ? 'sk-SK' : locale === 'cs' ? 'cs-CZ' : 'en-US',
    {
      month: 'short',
      year: 'numeric',
    },
  )

  return (
    <IceGlassCard className="lg:col-span-4 group overflow-hidden flex flex-col" withGradient>
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
              <div className="text-[9px] text-white/50 uppercase font-medium tracking-tight mt-1">
                {t('member_since', { date: registrationDate })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1">
                {t('rank')}
              </div>
              <div className="text-3xl font-black text-white italic">
                #{leaderboardEntry?.currentRank || '--'}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1">
                {t('points')}
              </div>
              <div className="text-3xl font-black text-yellow-500 italic">
                {leaderboardEntry?.totalPoints || 0}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1">
                {t('avg_points')}
              </div>
              <div className="text-3xl font-black text-blue-400 italic">{avgPoints}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overlay/Card Style */}
      <div className="mt-auto bg-black/40 p-4 grid grid-cols-4 text-center border-t border-white/5 divide-x divide-white/5">
        <div>
          <div className="text-[8px] text-white/30 font-bold uppercase mb-0.5">
            {t('stats.tips')}
          </div>
          <div className="text-sm font-black text-white">{leaderboardEntry?.totalMatches || 0}</div>
        </div>
        <div>
          <div className="text-[8px] text-white/30 font-bold uppercase mb-0.5">
            {t('stats.exact')}
          </div>
          <div className="text-sm font-black text-green-500">
            {leaderboardEntry?.exactGuesses || 0}
          </div>
        </div>
        <div>
          <div className="text-[8px] text-white/30 font-bold uppercase mb-0.5">
            {t('stats.diff')}
          </div>
          <div className="text-sm font-black text-yellow-500">
            {leaderboardEntry?.correctDiffs || 0}
          </div>
        </div>
        <div>
          <div className="text-[8px] text-white/30 font-bold uppercase mb-0.5">
            {t('stats.winner')}
          </div>
          <div className="text-sm font-black text-blue-500">
            {leaderboardEntry?.correctTrends || 0}
          </div>
        </div>
      </div>
    </IceGlassCard>
  )
}
