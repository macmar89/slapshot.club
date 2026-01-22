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
    <div className="space-y-2 md:space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg md:text-3xl font-black uppercase text-[#eab308] md:text-white tracking-widest md:tracking-wide text-center md:text-left">
          {competition.name}
        </h1>
        <p className="hidden md:block text-white/60 text-lg">{t('description')}</p>
      </div>

      <div className="h-[calc(100vh-140px)] md:h-[700px]">
        <LeaderboardList />
      </div>
    </div>
  )
}
