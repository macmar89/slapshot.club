import {
  Calculator,
  Target,
  Trophy,
  TrendingUp,
  User as UserIcon,
  ClipboardCheck,
  Zap,
} from 'lucide-react'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { cn } from '@/lib/utils'
import { useTranslations, useLocale } from 'next-intl'
import type { PlayerActiveLeague } from '@/lib/api/player'
import type { User } from '@/payload-types'

interface PlayerStatsGridProps {
  stats: PlayerActiveLeague | null
  user: User
  className?: string
}

export function PlayerStatsGrid({ stats, user, className }: PlayerStatsGridProps) {
  const t = useTranslations('PlayerDetail')
  const locale = useLocale()

  const memberSinceDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '?'

  const plan = user.subscription?.plan || 'free'

  const remainingItems = [
    {
      label: t('tips_count'),
      value: stats?.totalMatches.toString() || '0',
      icon: ClipboardCheck,
      color: 'text-blue-400',
      desc: t('desc_tips'),
    },
    {
      label: t('avgPoints'),
      value: stats?.averagePoints.toFixed(2) || '0.00',
      icon: Calculator,
      color: 'text-purple-400',
      desc: t('desc_avg'),
    },
    {
      label: t('sniperRate'),
      value: stats?.exactGuesses.toString() || '0',
      icon: Target,
      color: 'text-red-500',
      desc: t('desc_sniper_new'),
    },
    {
      label: t('success_rate'),
      value: stats ? `${stats.successRate.toFixed(1)}%` : '0.0%',
      icon: TrendingUp,
      color: 'text-emerald-400',
      desc: t('success_rate_desc'),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Merged Info & Key Stats Card */}
      <IceGlassCard className="p-6 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          {/* Left Side: Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
              <UserIcon size={32} className="text-white/60" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tight leading-none">
                  {user.username}
                </h3>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider leading-none',
                    plan === 'pro' || plan === 'vip'
                      ? 'bg-warning/20 text-warning border border-warning/30'
                      : 'bg-white/10 text-white/40 border border-white/10',
                  )}
                >
                  {plan}
                </span>
              </div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-black italic">
                {t('member_since')}: <span className="text-white/70">{memberSinceDate}</span>
              </p>

              {/* Form Dots */}
              {stats?.lastPredictions && stats.lastPredictions.length > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[10px] uppercase font-black italic text-white/40 tracking-wider">
                    {t('form')}:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {stats.lastPredictions.map((p, i) => {
                      const points = p.points ?? 0
                      let color = 'bg-white/10'
                      if (points === 5)
                        color =
                          'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] border border-emerald-300/30'
                      if (points === 3) color = 'bg-blue-400'
                      if (points === 2) color = 'bg-orange-400'
                      if (points === 0) color = 'bg-red-500/50'

                      return (
                        <div
                          key={i}
                          className={cn(
                            'w-2.5 h-2.5 rounded-full transition-all hover:scale-125',
                            color,
                          )}
                          title={`${points} pts`}
                        />
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Key Stats */}
          <div className="flex items-center gap-8 md:gap-12 md:pr-4">
            <div className="flex flex-col items-center md:items-end">
              <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1 font-bold">
                {t('rank')}
              </span>
              <div className="flex items-center gap-2">
                <Trophy size={18} className="text-warning" />
                <span className="text-3xl font-black text-white italic tracking-tighter leading-none">
                  {stats ? `#${stats.rank}` : '-'}
                </span>
              </div>
            </div>

            <div className="w-px h-10 bg-white/10 hidden md:block" />

            <div className="flex flex-col items-center md:items-end">
              <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1 font-bold">
                {t('points_count')}
              </span>
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-yellow-400" />
                <span className="text-3xl font-black text-white italic tracking-tighter leading-none">
                  {stats?.points.toString() || '0'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Legend for Form */}
        {stats?.lastPredictions && stats.lastPredictions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center gap-x-6 gap-y-2">
            <div className="flex items-center gap-2 text-[9px] uppercase font-black italic text-white/40 tracking-tight">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              {t('exact_tip')}
            </div>
            <div className="flex items-center gap-2 text-[9px] uppercase font-black italic text-white/40 tracking-tight">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              {t('winner_diff')}
            </div>
            <div className="flex items-center gap-2 text-[9px] uppercase font-black italic text-white/40 tracking-tight">
              <div className="w-2 h-2 rounded-full bg-orange-400" />
              {t('winner')}
            </div>
            <div className="flex items-center gap-2 text-[9px] uppercase font-black italic text-white/40 tracking-tight">
              <div className="w-2 h-2 rounded-full bg-red-500/50" />
              {t('miss')}
            </div>
          </div>
        )}
      </IceGlassCard>

      {/* Remaining Stats Grid */}
      <div className={cn('grid grid-cols-2 lg:grid-cols-4 gap-4', className)}>
        {remainingItems.map((item, i) => (
          <IceGlassCard
            key={i}
            className="p-4 group transition-all hover:bg-white/5"
            contentClassName="flex flex-col items-center justify-center text-center"
          >
            <div
              className={cn(
                'w-10 h-10 flex items-center justify-center rounded-full bg-white/5 mb-3 group-hover:scale-110 transition-transform',
                item.color,
              )}
            >
              <item.icon size={20} />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1 font-bold">
              {item.label}
            </span>
            <span className="text-xl font-black text-white/80 italic tracking-tighter leading-none">
              {item.value}
            </span>
            {item.desc && (
              <span className="text-[9px] text-white/30 font-medium mt-1 uppercase">
                {item.desc}
              </span>
            )}
          </IceGlassCard>
        ))}
      </div>
    </div>
  )
}
