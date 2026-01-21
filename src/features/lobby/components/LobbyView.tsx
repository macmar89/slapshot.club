'use client'

import React, { useState } from 'react'
import type { Competition, User } from '@/payload-types'
import { useTranslations } from 'next-intl'
import { CompetitionCard } from './CompetitionCard'
import { Header } from '@/components/layout/Header'

interface LobbyViewProps {
  user: User
  competitions: Competition[]
  joinedCompetitionIds: string[]
}

export function LobbyView({ user, competitions, joinedCompetitionIds }: LobbyViewProps) {
  const t = useTranslations('Lobby')
  const [showFinished, setShowFinished] = useState(false)

  const liveCompetitions = competitions.filter((c) => c.status === 'active')
  const upcomingCompetitions = competitions.filter((c) => c.status === 'upcoming')
  const finishedCompetitions = competitions.filter((c) => c.status === 'finished')

  const renderCompetitionGrid = (comps: Competition[], compact: boolean = false) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
      {comps.map((competition) => (
        <CompetitionCard
          key={competition.id}
          competition={competition}
          isJoined={joinedCompetitionIds.includes(competition.id)}
          userId={user.id}
          compact={compact}
        />
      ))}
    </div>
  )

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-[radial-gradient(circle_at_top_right,rgba(234,179,8,0.05),transparent),radial-gradient(circle_at_bottom_left,rgba(234,179,8,0.02),transparent)] text-white">
      <Header />
      <div className="pt-20 md:pt-16" />

      <h1 className="text-xl md:text-3xl text-white/50 font-medium  text-center mb-8">
        {t('welcome', { username: user.username || user.email })}
      </h1>

      <main className="max-w-7xl mx-auto">
        {showFinished && finishedCompetitions.length > 0 && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500 fill-mode-both border-b border-white/5 mb-4 md:mb-16 lg:mb-20 pb-12">
            {renderCompetitionGrid(finishedCompetitions, true)}
          </div>
        )}

        {liveCompetitions.length > 0 && (
          <div className="mb-10 md:mb-16 lg:mb-20">
            <div className="flex items-center gap-6 mb-12">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#eab308]/50 to-transparent shadow-[0_0_10px_rgba(234,179,8,0.3)]" />
              <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-[#eab308] drop-shadow-[0_0_25px_rgba(234,179,8,0.8)] px-4">
                {t('status.active')}
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#eab308]/50 to-transparent shadow-[0_0_10px_rgba(234,179,8,0.3)]" />
            </div>
            {renderCompetitionGrid(liveCompetitions, false)}
          </div>
        )}

        {upcomingCompetitions.length > 0 && (
          <div className="mb-10 md:mb-16 lg:mb-20">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-white/30">
                {t('status.upcoming')}
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
            {renderCompetitionGrid(upcomingCompetitions, true)}
          </div>
        )}
      </main>
    </div>
  )
}
