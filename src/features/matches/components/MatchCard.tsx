'use client'

import React from 'react'
import type { Match, Prediction, Team, Media } from '@/payload-types'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { PencilLine, Trophy } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

interface MatchCardProps {
  match: Match
  userPrediction?: Prediction
  stats?: {
    homeWin: number
    awayWin: number
    draw: number
    total: number
  }
  onPredict: (match: Match) => void
}

export function MatchCard({ match, userPrediction, stats, onPredict }: MatchCardProps) {
  const t = useTranslations('Dashboard.matches')
  const homeTeam = match.homeTeam as Team
  const awayTeam = match.awayTeam as Team

  const matchDate = new Date(match.date)
  const isStarted = new Date() >= matchDate || match.status !== 'scheduled'

  // Recalculate percentages for 2-way (no Draw)
  const statsData = stats || { homeWin: 0, draw: 0, awayWin: 0, total: 0 }
  const totalTips = statsData.total || 0
  const binaryTotal = statsData.homeWin + statsData.awayWin
  const homeWinPct = binaryTotal > 0 ? Math.round((statsData.homeWin / binaryTotal) * 100) : 0
  const awayWinPct = binaryTotal > 0 ? 100 - homeWinPct : 0

  const statusStyles = {
    scheduled: 'text-white/40 border-white/10 bg-white/5',
    live: 'text-red-500 border-red-500/40 bg-red-500/20',
    finished: 'text-white/60 border-white/20 bg-white/10',
    cancelled: 'text-red-400 border-red-400/20 bg-red-400/10',
  }

  const renderTeam = (team: Team, type: 'home' | 'away') => (
    <div
      className={cn(
        'flex flex-col items-center gap-3 w-1/3',
        type === 'away' && 'flex-col-reverse md:flex-col',
      )}
    >
      <div
        className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-2 relative group"
        style={{ borderColor: `${team.colors.primary}40` }}
      >
        <div
          className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
          style={{ backgroundColor: team.colors.primary }}
        />
        {team.logo && typeof team.logo === 'object' ? (
          <Image
            src={(team.logo as Media).url || ''}
            alt={team.name}
            width={80}
            height={80}
            className="w-full h-full object-contain relative z-10 drop-shadow-lg"
          />
        ) : (
          <span className="text-xl font-black text-white/20 relative z-10">{team.shortName}</span>
        )}
      </div>
      <div className="text-center">
        <div className="text-xs font-black uppercase tracking-widest text-white/60 mb-1">
          {team.shortName}
        </div>
        <div className="text-sm font-bold text-white line-clamp-1 hidden md:block">{team.name}</div>
      </div>
    </div>
  )

  return (
    <IceGlassCard
      backdropBlur="md"
      className={cn(
        'p-3 md:p-6 hover:border-[#eab308]/40 transition-all duration-300 group relative',
        match.status === 'cancelled' && 'opacity-40 grayscale-[0.5]',
      )}
    >
      {/* Status Badge - Top Right */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6">
        <div
          className={cn(
            'px-3 py-1 rounded-full border text-[0.6rem] font-black uppercase tracking-widest flex items-center gap-2',
            statusStyles[match.status as keyof typeof statusStyles] || statusStyles.scheduled,
          )}
        >
          {match.status === 'live' && (
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          )}
          {t(match.status)}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#eab308] mb-1">
            {match.result?.round_label || match.result?.group_name || 'ZOH 2026'}
          </span>
          <span className="text-xs font-bold text-white/80">
            {matchDate.toLocaleDateString('sk-SK', { day: 'numeric', month: 'short' })} •{' '}
            {matchDate.toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mb-8">
        {renderTeam(homeTeam, 'home')}

        <div className="flex flex-col items-center justify-center gap-2 flex-1">
          <div className="flex items-center gap-4 text-3xl md:text-5xl font-black italic tracking-tighter">
            {match.status === 'scheduled' || match.status === 'cancelled' ? (
              <span className="text-white/20">VS</span>
            ) : (
              <>
                <span className={cn(match.status === 'live' ? 'text-[#eab308]' : 'text-white')}>
                  {match.result?.homeScore ?? 0}
                </span>
                <span className="text-white/40">:</span>
                <span className={cn(match.status === 'live' ? 'text-[#eab308]' : 'text-white')}>
                  {match.result?.awayScore ?? 0}
                </span>
              </>
            )}
          </div>
          {match.status === 'finished' && match.result?.endingType !== 'regular' && (
            <span className="text-[0.6rem] font-bold uppercase tracking-widest text-white/60 bg-white/10 px-2 py-0.5 rounded">
              {match.result?.endingType === 'ot' ? t('overtime_short') : t('shootout_short')}
            </span>
          )}
        </div>

        {renderTeam(awayTeam, 'away')}
      </div>

      {/* Prediction Stats & User Action */}
      <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Tipping Percentages - 2-Way split */}
        <div className="flex-1 max-w-xs relative">
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex">
            {binaryTotal > 0 ? (
              <>
                <div
                  className="h-full bg-gradient-to-r from-[#eab308] to-[#eab308]/60 transition-all duration-1000"
                  style={{ width: `${homeWinPct}%` }}
                />
                <div
                  className="h-full bg-white/20 transition-all duration-1000"
                  style={{ width: `${awayWinPct}%` }}
                />
              </>
            ) : (
              <div className="h-full w-full bg-white/10" />
            )}
          </div>

          <div className="flex justify-between mt-1 px-0.5 relative">
            <div className="flex flex-col">
              <span className="text-[0.6rem] font-bold text-white/60 uppercase">
                {homeTeam.shortName}
              </span>
              <span className="text-[0.6rem] font-black text-[#eab308]">{homeWinPct}%</span>
            </div>

            {/* Total Tips Counter - Absolute center */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2 flex flex-col items-center">
              <span className="text-[0.5rem] font-bold text-white/30 uppercase tracking-tighter">
                {t('predictions_count', { count: totalTips })}
              </span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[0.6rem] font-bold text-white/60 uppercase">
                {awayTeam.shortName}
              </span>
              <span className="text-[0.6rem] font-black text-white/80">{awayWinPct}%</span>
            </div>
          </div>
        </div>

        {/* User Prediction Status */}
        <div className="flex items-center gap-3">
          {userPrediction ? (
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <div className="flex flex-col">
                <span className="text-[0.55rem] font-black uppercase tracking-widest text-[#eab308]">
                  {t('my_prediction')}
                </span>
                <span className="text-sm font-black text-white">
                  {userPrediction.homeGoals} : {userPrediction.awayGoals}
                </span>
              </div>
              {!isStarted && match.status === 'scheduled' && (
                <button
                  onClick={() => onPredict(match)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                >
                  <PencilLine className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            !isStarted &&
            match.status === 'scheduled' && (
              <Button
                onClick={() => onPredict(match)}
                variant="solid"
                color="gold"
                className="w-full md:w-auto rounded-xl px-8 py-3 h-auto text-[0.7rem] md:text-[0.65rem] font-black uppercase tracking-[0.2em] gap-2 shadow-[0_4px_20px_rgba(234,179,8,0.3)] hover:shadow-[0_8px_30px_rgba(234,179,8,0.4)] transition-all"
              >
                {t('predict_button')}
              </Button>
            )
          )}

          {isStarted && userPrediction && userPrediction.points !== null && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eab308]/10 border border-[#eab308]/20">
              <Trophy className="w-3.5 h-3.5 text-[#eab308]" />
              <span className="text-xs font-black text-[#eab308]">+{userPrediction.points}</span>
            </div>
          )}
        </div>
      </div>
    </IceGlassCard>
  )
}
