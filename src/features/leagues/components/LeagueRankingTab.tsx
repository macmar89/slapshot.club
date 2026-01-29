'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { cn } from '@/lib/utils'
import { Crown, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { User, League } from '@/payload-types'
import type { LeaderboardEntry as PayloadLeaderboardEntry } from '@/payload-types'

interface LeagueRankingTabProps {
  members: User[]
  leaderboardEntries?: Record<string, PayloadLeaderboardEntry>
  currentUser: User
  league: League
  isOwner: boolean
}

export function LeagueRankingTab({
  members,
  leaderboardEntries,
  currentUser,
  league,
  isOwner,
}: LeagueRankingTabProps) {
  const t = useTranslations('Leagues')

  // Role helper
  const getMemberRole = (user: User) => {
    const ownerId = (league.owner as User)?.id || league.owner
    if (ownerId === user.id) return { label: 'C', color: 'text-warning', icon: Crown }
    
    // Check subscription for Assistant
    if (user.subscription?.plan === 'pro' || user.subscription?.plan === 'vip') {
      return { label: 'A', color: 'text-blue-400', icon: Shield }
    }
    
    return null
  }

  return (
    <IceGlassCard className="overflow-hidden p-0 border border-white/10 shadow-xl" backdropBlur='lg'>
      <div className="grid grid-cols-[30px_1fr_50px] md:grid-cols-[40px_1fr_60px_60px_60px_60px_60px_60px] gap-2 px-4 py-3 bg-white/[0.05] border-b border-white/10 sticky top-0 backdrop-blur-md z-10">
        <span className="text-[10px] font-black uppercase text-warning tracking-widest text-center">#</span>
        <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">{t('member')}</span>
        
        {/* Desktop Stats Headers */}
        <span className="text-[10px] font-black uppercase text-white/30 tracking-widest text-right hidden md:block">{t('predictions')}</span>
        <span className="text-[10px] font-black uppercase text-white/30 tracking-widest text-right hidden md:block">{t('exact_guesses')}</span>
        <span className="text-[10px] font-black uppercase text-white/30 tracking-widest text-right hidden md:block">{t('col_win_diff')}</span>
        <span className="text-[10px] font-black uppercase text-white/30 tracking-widest text-right hidden md:block">{t('col_winner')}</span>
        <span className="text-[10px] font-black uppercase text-white/30 tracking-widest text-right hidden md:block">{t('col_missed')}</span>
        
        <span className="text-[10px] font-black uppercase text-white/30 tracking-widest text-right">{t('points')}</span>
      </div>

      <div className="divide-y divide-white/5">
        {members
          .map((member) => {
            const entry = leaderboardEntries?.[member.id]
            return { member, points: entry?.totalPoints || 0, entry, role: getMemberRole(member) }
          })
          .sort((a, b) => b.points - a.points)
          .map(({ member, points, entry, role }, index) => (
            <div
              key={member.id}
              className={cn(
                'grid grid-cols-[30px_1fr_50px] md:grid-cols-[40px_1fr_60px_60px_60px_60px_60px_60px] items-center gap-2 px-4 py-4 transition-colors group cursor-pointer',
                member.id === currentUser.id ? 'bg-warning/10 hover:bg-warning/20' : 'bg-transparent hover:bg-white/5',
              )}
            >
              {/* Rank */}
              <div className="flex justify-center text-center">
                <span className={cn('text-sm font-black italic', index < 3 ? 'text-warning' : 'text-white/30')}>
                  {index + 1}.
                </span>
              </div>

              {/* Info */}
              <div className="flex items-center gap-3 min-w-0">
                 <div className="relative">
                     <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-xs font-bold ring-1 ring-white/10 text-white shrink-0">
                       {member.email?.slice(0, 2).toUpperCase()}
                     </div>
                     {role && (
                         <div className={cn("absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-black border border-white/10 flex items-center justify-center text-[10px] font-bold", role.color)}>
                             {role.label}
                         </div>
                     )}
                 </div>
                 <div className="flex flex-col min-w-0">
                    <span className={cn('font-bold text-sm truncate flex items-center gap-2', member.id === currentUser.id ? 'text-warning' : 'text-white')}>
                       {member.username || member.email}
                    </span>
                    {role && (
                       <span className="text-[9px] text-white/40 uppercase tracking-wider font-bold">
                           {role.label === 'C' ? t('captain') : t('assistant')}
                       </span>
                    )}
                 </div>
              </div>

              {/* Desktop Stats Data */}
              <span className="text-xs font-bold text-white/40 text-right hidden md:block">{entry?.totalMatches || 0}</span>
              <span className="text-xs font-bold text-emerald-500 text-right hidden md:block">{entry?.exactGuesses || 0}</span>
              <span className="text-xs font-bold text-blue-400 text-right hidden md:block">{entry?.correctDiffs || 0}</span>
              <span className="text-xs font-bold text-white/60 text-right hidden md:block">{entry?.correctTrends || 0}</span>
              <span className="text-xs font-bold text-red-500/50 text-right hidden md:block">{entry?.wrongGuesses || 0}</span>

              {/* Points */}
              <div className="text-right">
                <span className="text-lg font-black text-warning italic tracking-tighter">{points}</span>
              </div>
            </div>
          ))}
      </div>
      
      {/* Mobile Hint */}
      {isOwner && members.length > 1 && (
          <p className="md:hidden text-center text-[10px] text-white/30 uppercase tracking-widest mt-4 pb-4">
              {t('mobile_management_hint')}
          </p>
      )}
    </IceGlassCard>
  )
}
