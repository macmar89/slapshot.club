'use client'

import React from 'react'
import type { Match, Prediction, Team, Media } from '@/payload-types'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useTranslations, useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import { Link } from '@/i18n/routing'
import { PencilLine, Trophy, ArrowUpRight, Eye } from 'lucide-react'
import Image from 'next/image'

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
  const { slug } = useParams()
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
    <div className={cn('flex flex-col items-center gap-3 w-1/3')}>
      <div
        className={cn(
          'h-10 w-20 md:h-14 md:w-28 flex items-center justify-center relative group',
          !team.logo && 'rounded-app overflow-hidden bg-white/5 border border-white/10 p-2',
        )}
        style={!team.logo ? { borderColor: `${team.colors.primary}40` } : {}}
      >
        {!team.logo && (
          <div
            className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
            style={{ backgroundColor: team.colors.primary }}
          />
        )}
        {team.logo && typeof team.logo === 'object' ? (
          <Image
            src={(team.logo as Media).url || ''}
            alt={team.name}
            width={120}
            height={80}
            className="h-full w-auto object-contain relative z-10 drop-shadow-2xl rounded-app"
          />
        ) : (
          <span className="text-xl font-black text-white/20 relative z-10">{team.shortName}</span>
        )}
      </div>
      <div className="text-center">
        <div className="text-sm font-bold text-white line-clamp-1 hidden md:block">{team.name}</div>
      </div>
    </div>
  )

  return (
    <IceGlassCard
      backdropBlur="md"
      className={cn(
        'p-3 md:p-6 hover:border-warning/40 transition-all duration-300 group relative',
        match.status === 'cancelled' && 'opacity-40 grayscale-[0.5]',
      )}
    >
      {/* Status Badge - Top Right */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6">
        <div
          className={cn(
            'px-3 py-1 rounded-app border text-[0.6rem] font-black uppercase tracking-widest flex items-center gap-2',
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
          <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-warning mb-1">
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
                <span className={cn(match.status === 'live' ? 'text-warning' : 'text-white')}>
                  {match.result?.homeScore ?? 0}
                </span>
                <span className="text-white/40">:</span>
                <span className={cn(match.status === 'live' ? 'text-warning' : 'text-white')}>
                  {match.result?.awayScore ?? 0}
                </span>
              </>
            )}
          </div>
          {match.status === 'finished' && match.result?.endingType !== 'regular' && (
            <span className="text-[0.6rem] font-bold uppercase tracking-widest text-white/60 bg-white/10 px-2 py-0.5 rounded-app">
              {match.result?.endingType === 'ot' ? t('overtime_short') : t('shootout_short')}
            </span>
          )}
        </div>

        {renderTeam(awayTeam, 'away')}
      </div>

      {/* Prediction Stats & User Action */}
      <div className="pt-6 border-t border-white/5 space-y-6">
        {/* Tipping Percentages - Full Width */}
        <div className="w-full relative">
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex">
            {binaryTotal > 0 ? (
              <>
                <div
                  className="h-full bg-gradient-to-r from-warning to-warning/60 transition-all duration-1000"
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

          <div className="flex justify-between mt-1 px-1 relative">
            <div className="flex flex-col">
              <span className="text-[0.6rem] font-bold text-white/40 uppercase tracking-tighter text-left">
                {homeTeam.shortName}
              </span>
              <span className="text-[0.6rem] font-black text-warning leading-none text-left">
                {homeWinPct}%
              </span>
            </div>

            {/* Total Tips Counter - Absolute center */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2 flex flex-col items-center">
              <span className="text-xs font-bold text-white/50 uppercase tracking-[0.2em]">
                {t('predictions_count', { count: totalTips })}
              </span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[0.6rem] font-bold text-white/40 uppercase tracking-tighter text-right">
                {awayTeam.shortName}
              </span>
              <span className="text-[0.6rem] font-black text-white/60 leading-none text-right">
                {awayWinPct}%
              </span>
            </div>
          </div>
        </div>

        {/* User Status & Actions Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {userPrediction ? (
              <>
                <div className="flex items-center gap-4 px-4 h-11 rounded-app bg-white/10 border border-white/20 shadow-[0_4px_15px_rgba(0,0,0,0.2)] transition-all">
                  <div className="flex flex-col">
                    <span className="text-[0.5rem] font-black uppercase tracking-[0.2em] text-white/40">
                      {t('my_prediction')}
                    </span>
                    <span className="text-sm font-black text-white italic leading-none">
                      {userPrediction.homeGoals} : {userPrediction.awayGoals}
                    </span>
                  </div>
                  {!isStarted && match.status === 'scheduled' && (
                    <button
                      onClick={() => onPredict(match)}
                      className="p-1.5 -mr-1 text-white/40 hover:text-warning transition-colors outline-none cursor-pointer rounded-full hover:bg-white/5"
                    >
                      <PencilLine className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {userPrediction.points !== null && (
                  <div className="flex items-center gap-2 px-4 h-11 rounded-app bg-warning/10 border border-warning/20 shadow-[0_0_20px_rgba(234,179,8,0.15)]">
                    <Trophy className="w-4 h-4 text-warning" />
                    <span className="text-sm font-black text-warning">
                      +{userPrediction.points}
                    </span>
                  </div>
                )}
              </>
            ) : (
              !isStarted &&
              match.status === 'scheduled' && (
                <Button
                  onClick={() => onPredict(match)}
                  variant="solid"
                  color="warning"
                  className="rounded-app px-8 py-3 h-auto text-xs font-black uppercase tracking-[0.1em] gap-2 shadow-[0_4px_15px_rgba(234,179,8,0.2)] hover:scale-105 transition-all"
                >
                  {t('predict_button')}
                </Button>
              )
            )}
          </div>

          <div className="flex items-center gap-2">
            {isStarted && (
              // @ts-expect-error -- dynamic path
              <Link href={`/dashboard/${slug}/matches/${match.id}`} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto rounded-app border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-[0.6rem] font-black uppercase tracking-[0.2em] gap-2 h-10 px-6 transition-all"
                >
                  <Eye className="w-4 h-4 text-white/40" />
                  {t('view_detail')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </IceGlassCard>
  )
}
