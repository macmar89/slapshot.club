'use client'

import React from 'react'
import type { Match } from '@/payload-types'
import { cn } from '@/lib/utils'
import { AlertCircle, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { MatchPredictionsList } from './MatchPredictionsList'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { MatchTipsTeaserSkeleton } from './MatchTipsTeaserSkeleton'
import { useState } from 'react'

interface MatchTipsTabProps {
  match: Match
  totalTips?: number
}

export function MatchTipsTab({ match, totalTips = 0 }: MatchTipsTabProps) {
  const t = useTranslations('Dashboard.matches')
  const [search, setSearch] = useState('')

  const isScheduled = match.status === 'scheduled'
  const teaserCount = Math.min(totalTips, 10) || 3

  return (
    <div className="relative min-h-[400px] w-full">
      {isScheduled ? (
        <div className="space-y-6 w-full">
          <IceGlassCard className="overflow-hidden w-full flex flex-col" backdropBlur="lg">
            {/* Header Content inside the card */}
            <div className="p-4 md:p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-4 bg-warning rounded-full shadow-[0_0_10px_rgba(255,184,0,0.5)]" />
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">
                  {t('player_tips')} <span className="text-warning ml-1">({totalTips})</span>
                </h3>
              </div>

              {/* Search Input (Teaser version) */}
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-3.5 w-3.5 text-white/40" />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('search_by_username')}
                  className="block w-full pl-9 pr-3 py-2 border border-white/10 rounded-app leading-5 bg-white/5 text-white placeholder-white/20 focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-warning/50 focus:border-warning/50 sm:text-xs font-medium transition-colors"
                />
              </div>
            </div>

            <MatchTipsTeaserSkeleton count={teaserCount} />

            {/* Overlay Message inside the card */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="flex flex-col items-center gap-3 px-6 text-center">
                <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center border border-warning/20 mb-1">
                  <AlertCircle className="w-5 h-5 text-warning" />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white">
                  {t('match_not_started_title')}
                </span>
                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest max-w-[180px] leading-relaxed">
                  {t('match_not_started_desc')}
                </p>
              </div>
            </div>
          </IceGlassCard>
        </div>
      ) : (
        <div className="w-full transition-all duration-700">
          <MatchPredictionsList matchId={match.id} />
        </div>
      )}
    </div>
  )
}
