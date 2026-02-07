'use client'

import React from 'react'
import type { Match, Prediction, Team, Media } from '@/payload-types'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { cn } from '@/lib/utils'
import { Calendar, Trophy, Target, TrendingUp, BarChart3, AlertCircle, Users } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { calculatePoints } from '@/features/matches/utils/scoring'

interface MatchInfoTabProps {
  match: Match
  userPrediction?: Prediction
  statsData: {
    homeWin: number
    awayWin: number
    draw: number
    total: number
    exact: number
    diff: number
    trend: number
    wrong: number
  }
  homeTeam: Team
  awayTeam: Team
  totalTips: number
  homeWinPct: number
  awayWinPct: number
  binaryTotal: number
}

export function MatchInfoTab({
  match,
  userPrediction,
  statsData,
  homeTeam,
  awayTeam,
  totalTips,
  homeWinPct,
  awayWinPct,
  binaryTotal,
}: MatchInfoTabProps) {
  const t = useTranslations('Dashboard.matches')
  const matchDate = new Date(match.date)

  // Determine current evaluation for highlighting
  const currentEval = React.useMemo(() => {
    if (!userPrediction || !match.result) return null
    // If already evaluated in DB, use that
    if (userPrediction.status === 'evaluated') {
      return {
        isExact: userPrediction.isExact,
        isDiff: userPrediction.isDiff,
        isTrend: userPrediction.isTrend,
        isWrong: userPrediction.isWrong,
      }
    }
    // Otherwise calculate based on current score
    return calculatePoints(userPrediction, match)
  }, [userPrediction, match])

  const statusStyles = {
    scheduled: 'text-white/40 border-white/10 bg-white/5',
    live: 'text-red-500 border-red-500/40 bg-red-500/20',
    finished: 'text-white/60 border-white/20 bg-white/10',
    cancelled: 'text-red-400 border-red-400/20 bg-red-400/10',
  }

  const renderTeam = (team: Team, type: 'home' | 'away') => (
    <div className="flex flex-col items-center gap-2 md:gap-4 flex-1">
      <div className="h-16 w-16 md:h-24 md:w-24 flex items-center justify-center relative">
        {team.logo && typeof team.logo === 'object' ? (
          <Image
            src={(team.logo as Media).url || ''}
            alt={team.name}
            width={120}
            height={120}
            className="h-full w-auto object-contain drop-shadow-lg"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <span className="text-xl font-black text-white/20">{team.shortName}</span>
          </div>
        )}
      </div>
      <div className="text-center">
        <div className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white leading-tight">
          {team.name}
        </div>
      </div>
    </div>
  )

  const StatItem = ({
    label,
    count,
    color,
    isUser,
    icon: Icon,
  }: {
    label: string
    count: number
    color: string
    isUser: boolean
    icon: any
  }) => {
    const percentage = totalTips > 0 ? Math.round((count / totalTips) * 100) : 0
    return (
      <div
        className={cn(
          'relative flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-app border transition-all duration-300',
          isUser
            ? 'bg-warning/15 border-warning/40 shadow-[0_0_30px_rgba(234,179,8,0.1)]'
            : 'bg-white/5 border-white/10',
        )}
      >
        <div
          className={cn(
            'p-2 sm:p-2.5 rounded-xl transition-colors shrink-0',
            isUser ? 'bg-warning/20' : 'bg-white/5',
          )}
        >
          <Icon
            className={cn('w-4 h-4 sm:w-5 sm:h-5', isUser ? 'text-warning' : 'text-white/20')}
          />
        </div>

        <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
          <div className="flex justify-between items-end gap-2">
            <span
              className={cn(
                'text-[9px] sm:text-[10px] font-black uppercase tracking-widest truncate',
                isUser ? 'text-warning' : 'text-white/40',
              )}
            >
              {label}
            </span>
            <span className="text-[10px] sm:text-xs font-black text-white shrink-0">
              {percentage}%
            </span>
          </div>
          <div className="w-full h-1.5 sm:h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all duration-1000 rounded-full',
                color,
                isUser && 'shadow-[0_0_10px_currentColor] opacity-100',
                !isUser && 'opacity-60',
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col items-end min-w-[35px] sm:min-w-[45px] shrink-0">
          <span className="text-lg sm:text-xl font-black text-white italic leading-none">
            {count}
          </span>
          <span className="text-[7px] sm:text-[8px] font-bold text-white/20 uppercase tracking-tighter">
            {t('tips_label')}
          </span>
        </div>

        {/* Highlight Accent Line for better visibility */}
        {isUser && (
          <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-warning shadow-[0_0_10px_#eab308] rounded-t-full" />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <IceGlassCard className="p-0 overflow-hidden" backdropBlur="lg">
        {/* Header: Score & Teams (Compact) */}
        <div className="p-6 md:p-10 relative">
          <div className="flex flex-col gap-8">
            {/* Top Row: Info & Status */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <div className="text-sm font-black uppercase tracking-widest text-warning">
                  {match.result?.round_label || match.result?.group_name || t('match_label')}
                </div>
                <div className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  {matchDate.toLocaleDateString(undefined, {
                    day: 'numeric',
                    month: 'short',
                  })}{' '}
                  •{' '}
                  {matchDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div
                className={cn(
                  'px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2',
                  statusStyles[match.status as keyof typeof statusStyles] || statusStyles.scheduled,
                )}
              >
                {match.status === 'live' && (
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                )}
                {t(match.status)}
              </div>
            </div>

            {/* Middle Row: The Scoreboard (Teams always side by side) */}
            <div className="flex items-center justify-between gap-4 md:gap-8">
              {renderTeam(homeTeam, 'home')}

              <div className="flex flex-col items-center gap-2 min-w-[100px] md:min-w-[150px]">
                <div className="text-4xl md:text-7xl font-black italic tracking-tighter flex items-center gap-2 md:gap-4">
                  {match.status === 'scheduled' || match.status === 'cancelled' ? (
                    <span className="text-white/5 text-2xl md:text-4xl not-italic tracking-widest uppercase">
                      VS
                    </span>
                  ) : (
                    <>
                      <span className="text-white">{match.result?.homeScore ?? 0}</span>
                      <span
                        className={cn(
                          'text-white/20',
                          match.status === 'live' && 'animate-pulse text-warning',
                        )}
                      >
                        :
                      </span>
                      <span className="text-white">{match.result?.awayScore ?? 0}</span>
                    </>
                  )}
                </div>
                {match.status === 'finished' && match.result?.endingType !== 'regular' && (
                  <div className="text-[9px] font-black uppercase tracking-widest text-white/30 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                    {match.result?.endingType === 'ot' ? t('overtime') : t('shootout')}
                  </div>
                )}
              </div>

              {renderTeam(awayTeam, 'away')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-6 pb-10">
          <div className="space-y-6 sm:space-y-10">
            {/* My Prediction */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">
                {t('my_prediction')}
              </h3>
              <div className="bg-white/5 border border-white/10 rounded-app p-6 relative overflow-hidden max-w-full lg:max-w-md">
                {userPrediction ? (
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-warning uppercase tracking-widest">
                        {t('dialog.title' as any)}
                      </span>
                      <div className="text-4xl font-black text-white italic tracking-tighter">
                        {userPrediction.homeGoals} : {userPrediction.awayGoals}
                      </div>
                    </div>
                    {(userPrediction.points !== null ||
                      (userPrediction as any).potentialPoints !== undefined) && (
                      <div
                        className={cn(
                          'p-3 rounded-xl flex flex-col items-center min-w-[80px]',
                          match.status === 'live'
                            ? 'bg-white/5 border border-white/10 opacity-60'
                            : 'bg-warning/10 border border-warning/20',
                        )}
                      >
                        <Trophy
                          className={cn(
                            'w-4 h-4 mb-1',
                            match.status === 'live' ? 'text-white/40' : 'text-warning',
                          )}
                        />
                        <span
                          className={cn(
                            'text-lg font-black leading-none',
                            match.status === 'live' ? 'text-white/60' : 'text-warning',
                          )}
                        >
                          +
                          {userPrediction.points !== null
                            ? userPrediction.points
                            : (userPrediction as any).potentialPoints}
                        </span>
                        <span
                          className={cn(
                            'text-[8px] font-black uppercase tracking-widest',
                            match.status === 'live' ? 'text-white/20' : 'text-warning opacity-60',
                          )}
                        >
                          {match.status === 'live' ? t('potential_points') : t('point_label')}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-4 text-center gap-3">
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                      {t('no_prediction')}
                    </p>
                    {match.status === 'scheduled' && (
                      <Button
                        variant="solid"
                        color="gold"
                        size="sm"
                        className="font-black uppercase tracking-widest text-[10px]"
                      >
                        {t('predict_now')}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Global Stats */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">
                {t('global_stats')}
              </h3>
              <div className="bg-white/5 border border-white/10 rounded-app p-6 space-y-6 max-w-full lg:max-w-md">
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex">
                  {binaryTotal > 0 ? (
                    <>
                      <div className="h-full bg-warning" style={{ width: `${homeWinPct}%` }} />
                      <div className="h-full bg-white/10" style={{ width: `${awayWinPct}%` }} />
                    </>
                  ) : (
                    <div className="h-full w-full bg-white/5" />
                  )}
                </div>
                <div className="flex justify-between items-center px-1">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-warning uppercase">
                      {homeTeam.shortName}
                    </span>
                    <span className="text-xl font-black text-white italic">{homeWinPct}%</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black text-white/30 uppercase">
                      {awayTeam.shortName}
                    </span>
                    <span className="text-xl font-black text-white italic">{awayWinPct}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Stats */}
          {totalTips > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between max-w-xl">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">
                  {t('detailed_stats' as any)}
                </h3>
                <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                  <div className="w-3 h-3 text-white/40">
                    <Users className="w-full h-full" />
                  </div>
                  <span className="text-[10px] font-black text-white">
                    {t('predictions_count', { count: totalTips })}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3 max-w-xl">
                <StatItem
                  label={t('exact_score' as any)}
                  count={statsData.exact}
                  color="bg-green-500"
                  isUser={!!currentEval?.isExact}
                  icon={Target}
                />
                <StatItem
                  label={t('correct_diff' as any)}
                  count={statsData.diff}
                  color="bg-yellow-500"
                  isUser={!!currentEval?.isDiff}
                  icon={TrendingUp}
                />
                <StatItem
                  label={t('winner_only' as any)}
                  count={statsData.trend}
                  color="bg-orange-500"
                  isUser={!!currentEval?.isTrend}
                  icon={BarChart3}
                />
                <StatItem
                  label={t('wrong_guess' as any)}
                  count={statsData.wrong}
                  color="bg-red-500"
                  isUser={!!currentEval?.isWrong}
                  icon={AlertCircle}
                />
              </div>
            </div>
          )}
        </div>
      </IceGlassCard>
    </div>
  )
}
