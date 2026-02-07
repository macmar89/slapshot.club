'use client'

import React from 'react'
import Image from 'next/image'
import { TrendingUp, TrendingDown, Minus, User as UserIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LeaderboardEntry } from '../types'
import { useTranslations } from 'next-intl'

interface RankRowProps {
  entry: LeaderboardEntry
  className?: string
  onClick?: () => void
  isHeader?: boolean
  hideRank?: boolean
}

export const GRID_LAYOUT =
  'grid grid-cols-[40px_1fr_60px] md:grid-cols-[40px_1fr_60px_60px_60px_60px_60px_90px] items-center gap-2 md:gap-4'

export function RankRow({ entry, className, onClick, isHeader, hideRank }: RankRowProps) {
  const t = useTranslations('Dashboard.leaderboard')
  const getRankDisplay = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10">
            <div className="absolute inset-0 bg-yellow-500/20 blur-md rounded-full animate-pulse" />
            <span className="text-2xl md:text-3xl relative z-10 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">
              🥇
            </span>
          </div>
        )
      case 2:
        return (
          <div className="relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10">
            <div className="absolute inset-0 bg-slate-400/20 blur-md rounded-full" />
            <span className="text-2xl md:text-3xl relative z-10 drop-shadow-[0_0_8px_rgba(148,163,184,0.5)]">
              🥈
            </span>
          </div>
        )
      case 3:
        return (
          <div className="relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10">
            <div className="absolute inset-0 bg-amber-700/20 blur-md rounded-full" />
            <span className="text-2xl md:text-3xl relative z-10 drop-shadow-[0_0_8px_rgba(180,83,9,0.5)]">
              🥉
            </span>
          </div>
        )
      default:
        return !rank ? (
          <span className="text-sm md:text-base font-black text-white/40 italic">-</span>
        ) : (
          <span className="text-sm md:text-base font-black text-white italic">#{rank}</span>
        )
    }
  }

  const TrendIcon = {
    up: <TrendingUp className="w-2.5 h-2.5 text-emerald-500" />,
    down: <TrendingDown className="w-2.5 h-2.5 text-rose-500" />,
    same: <Minus className="w-2.5 h-2.5 text-white/10" />,
  }[entry?.trend || 'same']

  if (isHeader) {
    return (
      <div
        className={cn(GRID_LAYOUT, 'px-4 py-3 bg-white/[0.03] border-b border-white/10', className)}
      >
        <span className="text-[10px] font-black uppercase text-[#eab308] tracking-widest">#</span>
        <span className="text-[10px] font-black uppercase text-white/30 tracking-widest text-left">
          {t('name')}
        </span>
        <span className="text-[10px] font-black uppercase text-white/30 tracking-widest text-right hidden md:block">
          {t('predictions')}
        </span>
        <span className="text-[10px] font-black uppercase text-white/30 tracking-widest text-right hidden md:block">
          {t('exact')}
        </span>
        <span className="text-[10px] font-black uppercase text-white/30 tracking-widest text-right hidden md:block">
          {t('diff')}
        </span>
        <span className="text-[10px] font-black uppercase text-white/30 tracking-widest text-right hidden md:block">
          {t('winners')}
        </span>
        <span className="text-[10px] font-black uppercase text-white/30 tracking-widest text-right hidden md:block">
          {t('wrong')}
        </span>
        <span className="text-[10px] font-black uppercase text-[#eab308] tracking-[0.2em] text-center px-3 bg-white/10 h-full flex items-center justify-center border-l border-white/20 ml-2 md:ml-4">
          {t('points')}
        </span>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        GRID_LAYOUT,
        'px-4 py-1.5 md:py-4 transition-all duration-300 border-b border-white/[0.05] relative',
        entry.isCurrentUser
          ? 'bg-[#eab308]/10 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#eab308]'
          : 'bg-transparent hover:bg-white/[0.02]',
        onClick && 'cursor-pointer active:scale-[0.99]',
        className,
      )}
    >
      {/* Rank */}
      <div className="flex items-center justify-center min-h-[32px] md:min-h-[40px]">
        {!hideRank && getRankDisplay(entry.rank)}
      </div>

      {/* Name / Avatar */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <div className="relative w-6 h-6 md:w-9 md:h-9 shrink-0 hidden sm:block">
          {entry.avatarUrl ? (
            <Image
              src={entry.avatarUrl}
              alt={entry.name}
              fill
              className="object-cover border border-white/10"
            />
          ) : (
            <div className="w-full h-full bg-white/5 flex items-center justify-center border border-white/10">
              <UserIcon className="w-3 h-3 md:w-4 md:h-4 text-white/10" />
            </div>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'font-black uppercase tracking-tight truncate text-[12px] md:text-sm',
                entry.isCurrentUser ? 'text-[#eab308]' : 'text-white',
              )}
            >
              {entry.name}
            </span>
          </div>
          {entry.trend !== 'same' && (
            <div className="flex items-center gap-1">
              {TrendIcon}
              <span className="text-[7px] md:text-[8px] uppercase font-bold text-white/20 tracking-widest">
                {entry.trend}
              </span>
            </div>
          )}

          {/* Mobile Only Stats */}
          <div className="flex md:hidden items-center gap-3 mt-1.5 py-1 px-2 bg-white/5 rounded-sm border border-white/[0.05] w-fit">
            <div className="flex flex-col items-center leading-none">
              <span className="text-[6px] font-bold text-white/30 uppercase tracking-tighter mb-0.5">
                {t('predictions')}
              </span>
              <span className="text-[9px] font-black text-white/60">{entry.predictionsCount}</span>
            </div>
            <div className="flex flex-col items-center border-l border-white/10 pl-2 leading-none">
              <span className="text-[6px] font-bold text-white/30 uppercase tracking-tighter mb-0.5">
                {t('exact')}
              </span>
              <span className="text-[9px] font-black text-[#eab308]">{entry.exactScores}</span>
            </div>
            <div className="flex flex-col items-center border-l border-white/10 pl-2 leading-none">
              <span className="text-[6px] font-bold text-white/30 uppercase tracking-tighter mb-0.5">
                {t('diff')}
              </span>
              <span className="text-[9px] font-black text-blue-400/80">{entry.correctDiffs}</span>
            </div>
            <div className="flex flex-col items-center border-l border-white/10 pl-2 leading-none">
              <span className="text-[6px] font-bold text-white/30 uppercase tracking-tighter mb-0.5">
                {t('winners')}
              </span>
              <span className="text-[9px] font-black text-emerald-500/80">{entry.winners}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats - Hidden on Mobile */}
      <span className="text-xs font-black text-white/60 text-right hidden md:block">
        {entry.predictionsCount}
      </span>
      <span className="text-xs font-black text-[#eab308] text-right hidden md:block">
        {entry.exactScores}
      </span>
      <span className="text-xs font-black text-blue-400/80 text-right hidden md:block">
        {entry.correctDiffs}
      </span>
      <span className="text-xs font-black text-emerald-500/80 text-right hidden md:block">
        {entry.winners}
      </span>
      <span className="text-xs font-black text-rose-500/80 text-right hidden md:block">
        {entry.wrongGuesses}
      </span>

      {/* Points */}
      <div className="h-full flex items-center justify-center px-3 bg-gradient-to-l from-[#eab308]/10 to-transparent border-l border-white/10 relative group/points ml-2 md:ml-4">
        <div className="absolute inset-0 bg-white/5 opacity-0 md:group-hover:opacity-100 transition-opacity" />
        <span className="text-base md:text-xl font-black text-[#eab308] italic tracking-tighter drop-shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-transform duration-300 md:group-hover:scale-110">
          {entry.points}
        </span>
      </div>
    </div>
  )
}
