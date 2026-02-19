'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { Target, Trophy, TrendingUp, Calculator, Activity } from 'lucide-react'
import type { PlayerActiveLeague } from '@/lib/api/player'
import { cn } from '@/lib/utils'

interface LeagueStatsCardProps {
  league: PlayerActiveLeague
  className?: string
}

export function LeagueStatsCard({ league, className }: LeagueStatsCardProps) {
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

      <div className="grid grid-cols-3 gap-2">
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
    </IceGlassCard>
  )
}
