'use client'

import React, { useRef } from 'react'
import { Trophy, Activity, CheckCircle2 } from 'lucide-react'
import { RankRow } from './RankRow'
import { LeaderboardEntry } from '../types'
import { IceGlassCard } from '@/components/ui/IceGlassCard'

const MOCK_DATA: LeaderboardEntry[] = [
  { id: '1', rank: 1, name: 'Marian Srt', avatarUrl: null, points: 250, trend: 'same', isCurrentUser: false, predictionsCount: 42, exactScores: 12, winners: 20, wrongGuesses: 10 },
  { id: '2', rank: 2, name: 'HokejovyFan123', avatarUrl: null, points: 245, trend: 'up', isCurrentUser: false, predictionsCount: 40, exactScores: 11, winners: 22, wrongGuesses: 7 },
  { id: '3', rank: 3, name: 'Zdeno Chara Fan', avatarUrl: null, points: 230, trend: 'down', isCurrentUser: false, predictionsCount: 45, exactScores: 9, winners: 25, wrongGuesses: 11 },
  { id: '4', rank: 4, name: 'Peter Bondra 12', avatarUrl: null, points: 210, trend: 'up', isCurrentUser: false, predictionsCount: 38, exactScores: 10, winners: 18, wrongGuesses: 10 },
  { id: '5', rank: 5, name: 'Lukas Hokej', avatarUrl: null, points: 195, trend: 'same', isCurrentUser: false, predictionsCount: 42, exactScores: 8, winners: 21, wrongGuesses: 13 },
  { id: '6', rank: 6, name: 'Michal Tipuje', avatarUrl: null, points: 180, trend: 'down', isCurrentUser: false, predictionsCount: 40, exactScores: 7, winners: 19, wrongGuesses: 14 },
  { id: '7', rank: 7, name: 'Slovenskooo', avatarUrl: null, points: 175, trend: 'up', isCurrentUser: false, predictionsCount: 35, exactScores: 9, winners: 15, wrongGuesses: 11 },
  { id: '8', rank: 8, name: 'Juraj Slafkovsky Fan', avatarUrl: null, points: 160, trend: 'same', isCurrentUser: false, predictionsCount: 42, exactScores: 6, winners: 22, wrongGuesses: 14 },
  { id: '9', rank: 9, name: 'Zimny Stadion', avatarUrl: null, points: 155, trend: 'down', isCurrentUser: false, predictionsCount: 45, exactScores: 5, winners: 25, wrongGuesses: 15 },
  { id: '10', rank: 10, name: 'Tiper Majster', avatarUrl: null, points: 140, trend: 'up', isCurrentUser: false, predictionsCount: 40, exactScores: 6, winners: 18, wrongGuesses: 16 },
  { id: '11', rank: 11, name: 'Ice King', avatarUrl: null, points: 135, trend: 'same', isCurrentUser: false, predictionsCount: 38, exactScores: 5, winners: 20, wrongGuesses: 13 },
  { id: '12', rank: 12, name: 'Marian (Ty)', avatarUrl: null, points: 120, trend: 'up', isCurrentUser: true, predictionsCount: 42, exactScores: 4, winners: 20, wrongGuesses: 18 },
  { id: '13', rank: 13, name: 'Slapshot Pro', avatarUrl: null, points: 115, trend: 'down', isCurrentUser: false, predictionsCount: 40, exactScores: 3, winners: 21, wrongGuesses: 16 },
  { id: '14', rank: 14, name: 'Puk Do Brany', avatarUrl: null, points: 100, trend: 'same', isCurrentUser: false, predictionsCount: 45, exactScores: 2, winners: 25, wrongGuesses: 18 },
  { id: '15', rank: 15, name: 'Fanaticky Fanusik', avatarUrl: null, points: 95, trend: 'up', isCurrentUser: false, predictionsCount: 38, exactScores: 3, winners: 15, wrongGuesses: 20 },
]

export function LeaderboardList() {
  const containerRef = useRef<HTMLDivElement>(null)
  const userRowRef = useRef<HTMLDivElement>(null)
  const currentUserEntry = MOCK_DATA.find(e => e.isCurrentUser)

  const scrollToUser = () => {
    if (userRowRef.current) {
      userRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <IceGlassCard 
      backdropBlur="md"
      className="flex flex-col h-full w-full rounded-none p-0 overflow-hidden"
    >
      {/* Header with Global Stats - Hidden on Mobile */}
      <div className="hidden md:block p-4 md:p-6 border-b border-white/10 bg-white/[0.02] backdrop-blur-xl shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#eab308]/10 flex items-center justify-center border border-[#eab308]/30">
              <Trophy className="w-6 h-6 text-[#eab308]" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter text-white leading-none">
                Top Tipéri
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#eab308]/60 mt-1">
                Aktuálne poradie
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/5 p-3 border border-white/10">
            <div className="flex flex-col items-center px-3 border-r border-white/10">
              <div className="flex items-center gap-1.5 text-white/40 mb-1">
                <Activity className="w-3 h-3 text-[#eab308]" />
                <span className="text-[8px] font-black uppercase tracking-widest">Zápasy</span>
              </div>
              <span className="text-sm font-black text-white italic">124</span>
            </div>
            <div className="flex flex-col items-center px-3">
              <div className="flex items-center gap-1.5 text-white/40 mb-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span className="text-[8px] font-black uppercase tracking-widest">Vyhodnotené</span>
              </div>
              <span className="text-sm font-black text-white italic">118</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Header Row */}
      <RankRow isHeader entry={{} as any} className="bg-white/[0.05]" />

      {/* Scrollable List */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto divide-y divide-white/[0.05] pb-44 md:pb-28 scroll-smooth"
      >
        {MOCK_DATA.map((entry) => (
          <div key={entry.id} ref={entry.isCurrentUser ? userRowRef : null}>
            <RankRow entry={entry} />
          </div>
        ))}
      </div>

      {/* Sticky Footer for Current User */}
      {currentUserEntry && (
        <div className="absolute bottom-20 md:bottom-0 left-0 right-0 p-2 md:p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-8 md:pt-12 shrink-0 z-20">
          <div className="absolute top-4 md:top-8 left-1/2 -translate-x-1/2">
             <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em] text-[#eab308] animate-bounce">
               Klikni pre prechod na tvoju pozíciu
             </span>
          </div>
          <RankRow 
            entry={currentUserEntry} 
            onClick={scrollToUser}
            className="bg-[#eab308]/20 backdrop-blur-xl border border-[#eab308]/40 shadow-[0_0_50px_rgba(234,179,8,0.2)] scale-90 md:scale-100 origin-bottom"
          />
        </div>
      )}
    </IceGlassCard>
  )
}
