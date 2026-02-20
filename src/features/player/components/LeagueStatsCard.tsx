'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { Target, Trophy, TrendingUp, Calculator, Activity, Lock } from 'lucide-react'
import type { PlayerActiveLeague } from '@/lib/api/player'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface LeagueStatsCardProps {
  league: PlayerActiveLeague
  isLocked?: boolean
  currentUserPlan?: 'free' | 'pro' | 'vip'
  className?: string
}

export function LeagueStatsCard({
  league,
  isLocked,
  currentUserPlan,
  className,
}: LeagueStatsCardProps) {
  const t = useTranslations('PlayerDetail')

  const stats = [
    { label: t('tips_count'), value: league.totalMatches, icon: Activity, color: 'text-blue-400' },
    { label: t('points_count'), value: league.points, icon: Trophy, color: 'text-warning' },
    { label: t('rank'), value: league.rank, icon: Target, color: 'text-red-400' },
    { label: t('sniperRate'), value: league.exactGuesses, icon: Target, color: 'text-orange-400' },
    {
      label: t('success_rate'),
      value: `${league.successRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-emerald-400',
    },
  ]

  return (
    <IceGlassCard className={cn('p-4 overflow-hidden group', className)}>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <Trophy size={20} className="text-warning" />
        </div>
        <div>
          <h3 className="font-bold text-white truncate max-w-[200px]">{league.competition.name}</h3>
          <p className="text-xs text-white/40 uppercase tracking-widest">
            {t('rank')}: #{league.rank}
          </p>
        </div>
      </div>

      <div className="relative">
        <div
          className={cn(
            'grid grid-cols-3 gap-2 transition-all duration-500',
            isLocked && 'blur-sm grayscale opacity-40 select-none',
          )}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white/5 rounded-lg p-2 flex flex-col items-center justify-center text-center"
            >
              <stat.icon size={14} className={cn('mb-1 opacity-50', stat.color)} />
              <span className="text-sm font-bold text-white leading-none mb-1">{stat.value}</span>
              <span className="text-[10px] text-white/30 truncate w-full uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center mb-2 border border-warning/30">
              <Lock size={14} className="text-warning" />
            </div>
            {currentUserPlan === 'free' ? (
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-tight text-warning italic leading-tight">
                  {t('history_locked_title')}
                </p>
                <Link
                  href="/account"
                  className="text-[8px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors underline"
                >
                  {t('becomeMember')}
                </Link>
              </div>
            ) : (
              <p className="text-[9px] font-black uppercase tracking-widest text-warning italic leading-tight">
                PRO feature
              </p>
            )}
          </div>
        )}
      </div>
    </IceGlassCard>
  )
}
