'use client'

import React from 'react'
import type { Competition } from '@/payload-types'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { useTranslations } from 'next-intl'
import { LeaderboardList } from './LeaderboardList'

interface LeaderboardViewProps {
  competition: Competition
}

export function LeaderboardView({ competition }: LeaderboardViewProps) {
  const t = useTranslations('Dashboard.leaderboard')

  return (
    <div className="h-[calc(100dvh-8rem)] md:h-[calc(100dvh-7rem)] flex flex-col overflow-hidden">
      <div className="flex flex-col gap-1 shrink-0 mb-4">
        <h1 className="text-lg md:text-3xl font-black uppercase text-[#eab308] md:text-white tracking-widest md:tracking-wide text-center md:text-left leading-none">
          {competition.name}
        </h1>
        <p className="hidden md:block text-white/60 text-base">{t('description')}</p>
      </div>

      <div className="flex-1 min-h-0">
        <LeaderboardList />
      </div>
    </div>
  )
}
