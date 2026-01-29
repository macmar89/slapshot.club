'use client'

import React from 'react'
import type { Match, Prediction, Team, Media } from '@/payload-types'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Trophy, ArrowLeft, Calendar, Users, TrendingUp, Target, BarChart3, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { useParams } from 'next/navigation'

interface MatchDetailViewProps {
  match: Match
  userPrediction?: Prediction
  stats?: {
    homeWin: number
    awayWin: number
    draw: number
    total: number
    exact: number
    diff: number
    trend: number
    wrong: number
  }
}

export function MatchDetailView({ match, userPrediction, stats }: MatchDetailViewProps) {
  const t = useTranslations('Dashboard.matches')
  const { slug } = useParams()
  
  const homeTeam = match.homeTeam as Team
  const awayTeam = match.awayTeam as Team

  const matchDate = new Date(match.date)
  
  const statsData = stats || { homeWin: 0, draw: 0, awayWin: 0, total: 0, exact: 0, diff: 0, trend: 0, wrong: 0 }
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

  const StatItem = ({ label, count, color, isUser, icon: Icon }: { label: string, count: number, color: string, isUser: boolean, icon: any }) => {
    const percentage = totalTips > 0 ? Math.round((count / totalTips) * 100) : 0
    return (
      <div className={cn(
        "relative flex flex-col p-4 rounded-app border transition-all duration-300",
        isUser 
          ? "bg-warning/10 border-warning/40 shadow-[0_0_20px_rgba(234,179,8,0.1)]" 
          : "bg-white/5 border-white/10"
      )}>
        <div className="flex items-center justify-between mb-2">
          <div className={cn("p-1.5 rounded-lg bg-white/5", isUser ? "text-warning" : "text-white/20")}>
            <Icon className="w-3.5 h-3.5" />
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-white">{count}</span>
            <span className="text-[10px] font-bold text-white/20 ml-1.5">{percentage}%</span>
          </div>
        </div>
        <div className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-2 truncate">{label}</div>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div 
            className={cn("h-full transition-all duration-1000", color)} 
            style={{ width: `${percentage}%` }} 
          />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1000px] mx-auto space-y-6 md:space-y-8 px-4 pb-12">
      {/* Back Button Container */}
      <div className="flex items-center justify-start py-4">
        <Link 
          href={`/dashboard/${slug}/matches` as any} 
          className="group flex items-center gap-4 pl-2 pr-6 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-warning hover:border-warning transition-all duration-300 shadow-xl backdrop-blur-md"
        >
          <div className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center group-hover:bg-black/20 group-hover:text-black transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/80 group-hover:text-black transition-colors">
            {t('back_to_matches')}
          </span>
        </Link>
      </div>

      <IceGlassCard className="p-0 overflow-hidden" withGradient>
        {/* Header: Score & Teams (Compact) */}
        <div className="p-6 md:p-10 border-b border-white/5 relative">
          <div className="flex flex-col gap-8">
            {/* Top Row: Info & Status */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <div className="text-[10px] font-black uppercase tracking-widest text-warning">
                  {match.result?.round_label || match.result?.group_name || 'Hokejový zápas'}
                </div>
                <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  {matchDate.toLocaleDateString('sk-SK', { day: 'numeric', month: 'short' })} • {matchDate.toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div className={cn(
                'px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2',
                statusStyles[match.status as keyof typeof statusStyles] || statusStyles.scheduled
              )}>
                {match.status === 'live' && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                {t(match.status)}
              </div>
            </div>

            {/* Middle Row: The Scoreboard (Teams always side by side) */}
            <div className="flex items-center justify-between gap-4 md:gap-8">
              {renderTeam(homeTeam, 'home')}

              <div className="flex flex-col items-center gap-2 min-w-[100px] md:min-w-[150px]">
                <div className="text-4xl md:text-7xl font-black italic tracking-tighter flex items-center gap-2 md:gap-4">
                  {match.status === 'scheduled' || match.status === 'cancelled' ? (
                    <span className="text-white/5 text-2xl md:text-4xl not-italic tracking-widest uppercase">VS</span>
                  ) : (
                    <>
                      <span className="text-white">{match.result?.homeScore ?? 0}</span>
                      <span className={cn(
                        "text-white/20",
                        match.status === 'live' && "animate-pulse text-warning"
                      )}>:</span>
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

        {/* Content: Stats & Prediction */}
        <div className="p-6 md:p-10 space-y-10">
          
          {/* Accuracy Breakdown (Show when finished OR live) */}
          {(match.status === 'finished' || match.status === 'live') && totalTips > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-white/60">{t('detailed_stats' as any)}</h3>
                <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                  <Users className="w-3 h-3 text-white/40" />
                  <span className="text-[10px] font-black text-white">{totalTips} tipov</span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatItem 
                  label={t('exact_score' as any)} 
                  count={statsData.exact} 
                  color="bg-green-500" 
                  isUser={!!userPrediction?.isExact}
                  icon={Target}
                />
                <StatItem 
                  label={t('correct_diff' as any)} 
                  count={statsData.diff} 
                  color="bg-yellow-500" 
                  isUser={!!userPrediction?.isDiff}
                  icon={TrendingUp}
                />
                <StatItem 
                  label={t('winner_only' as any)} 
                  count={statsData.trend} 
                  color="bg-orange-500" 
                  isUser={!!userPrediction?.isTrend}
                  icon={BarChart3}
                />
                <StatItem 
                  label={t('wrong_guess' as any)} 
                  count={statsData.wrong} 
                  color="bg-red-500" 
                  isUser={!!userPrediction?.isWrong}
                  icon={AlertCircle}
                />
              </div>
            </div>
          )}

          {/* User Prediction & Distribution (Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch">
            
            {/* My Prediction Card */}
            <div className="flex flex-col gap-4 h-full">
              <h3 className="text-xs font-black uppercase tracking-widest text-white/60">{t('my_prediction')}</h3>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden flex-1 flex flex-col justify-center">
                {userPrediction ? (
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-warning uppercase tracking-widest">{t('dialog.title' as any)}</span>
                      <div className="text-4xl font-black text-white italic tracking-tighter">
                        {userPrediction.homeGoals} : {userPrediction.awayGoals}
                      </div>
                    </div>
                    {(userPrediction.points !== null || (userPrediction as any).potentialPoints !== undefined) && (
                      <div className={cn(
                        "p-3 rounded-xl flex flex-col items-center min-w-[80px]",
                        match.status === 'live' ? "bg-white/5 border border-white/10 opacity-60" : "bg-warning/10 border border-warning/20"
                      )}>
                        <Trophy className={cn("w-4 h-4 mb-1", match.status === 'live' ? "text-white/40" : "text-warning")} />
                        <span className={cn("text-lg font-black leading-none", match.status === 'live' ? "text-white/60" : "text-warning")}>
                          +{userPrediction.points !== null ? userPrediction.points : (userPrediction as any).potentialPoints}
                        </span>
                        <span className={cn("text-[8px] font-black uppercase tracking-widest", match.status === 'live' ? "text-white/20" : "text-warning opacity-60")}>
                          {match.status === 'live' ? 'Potenciálne' : 'BOD'}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-4 text-center gap-3">
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{t('no_prediction')}</p>
                    {match.status === 'scheduled' && (
                      <Button variant="solid" color="gold" size="sm" className="font-black uppercase tracking-widest text-[10px]">
                        {t('predict_now')}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Distribution */}
            <div className="flex flex-col gap-4 h-full">
               <h3 className="text-xs font-black uppercase tracking-widest text-white/60">{t('global_stats')}</h3>
               <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 flex-1 flex flex-col justify-center">
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
                      <span className="text-[9px] font-black text-warning uppercase">{homeTeam.shortName}</span>
                      <span className="text-xl font-black text-white italic">{homeWinPct}%</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black text-white/30 uppercase">{awayTeam.shortName}</span>
                      <span className="text-xl font-black text-white italic">{awayWinPct}%</span>
                    </div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </IceGlassCard>
    </div>
  )
}
