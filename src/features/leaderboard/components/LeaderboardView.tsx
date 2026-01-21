'use client'

import React from 'react'
import type { Competition } from '@/payload-types'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { useTranslations } from 'next-intl'

interface LeaderboardViewProps {
  competition: Competition
}

export function LeaderboardView({ competition }: LeaderboardViewProps) {
  const t = useTranslations('Dashboard.leaderboard')

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black uppercase text-white tracking-wide">
          {t('title')} - {competition.name}
        </h1>
        <p className="text-white/60 text-lg">{t('description')}</p>
      </div>

      <IceGlassCard className="p-8 h-[400px] flex items-center justify-center border-dashed border-white/10">
        <p className="text-white/40 italic">{t('empty_state')}</p>
      </IceGlassCard>
    </div>
  )
}
