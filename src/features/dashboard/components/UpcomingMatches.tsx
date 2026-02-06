'use client'

import React, { useState } from 'react'
import type { Match, Competition } from '@/payload-types'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { Zap, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { PredictionDialog } from '@/features/matches/components/PredictionDialog'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { MatchLockedDialog } from '@/features/matches/components/MatchLockedDialog'

interface UpcomingMatchesProps {
  upcomingMatches: Match[]
  competition: Competition
  allMatchesPredicted?: boolean
  locale: string
}

export function UpcomingMatches({
  upcomingMatches,
  competition,
  locale,
  allMatchesPredicted,
}: UpcomingMatchesProps) {
  const t = useTranslations('Dashboard')
  const router = useRouter()
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [isLockedModalOpen, setIsLockedModalOpen] = useState(false)

  const handlePredict = (match: Match) => {
    const matchDate = new Date(match.date)
    const isStarted = new Date() >= matchDate || match.status !== 'scheduled'

    if (isStarted) {
      setIsLockedModalOpen(true)
      router.refresh()
      return
    }

    setSelectedMatch(match)
  }

  const handleSuccess = () => {
    setSelectedMatch(null)
    router.refresh()
  }

  const visibleMatches = upcomingMatches.slice(0, 3)

  return (
    <>
      <IceGlassCard className="p-4 md:p-8 relative overflow-hidden" withGradient>
        <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
          <Zap className="w-64 h-64" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <h2 className="text-sm uppercase font-black tracking-[0.2em] text-yellow-500">
              {upcomingMatches.length > 0
                ? t('matches_remaining_count', { count: upcomingMatches.length })
                : t('upcoming_matches_label', { count: 0 })}
            </h2>
          </div>

          {visibleMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleMatches.map((match) => {
                const homeTeam = match.homeTeam as any
                const awayTeam = match.awayTeam as any

                return (
                  <div
                    key={match.id}
                    className="flex flex-col gap-6 p-4 rounded-app bg-white/5 border border-white/5 hover:border-white/10 transition-all group/match"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 flex items-center justify-center relative">
                          {homeTeam.logo?.url ? (
                            <Image
                              src={homeTeam.logo.url}
                              alt={homeTeam.name}
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div
                              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-2 border-white/10"
                              style={{ backgroundColor: homeTeam.colors?.primary || '#333' }}
                            >
                              <span className="text-sm font-black text-white">
                                {homeTeam.shortName}
                              </span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          {homeTeam.shortName}
                        </span>
                      </div>

                      <div className="flex flex-col items-center gap-1">
                        <div className="text-xl font-black text-white/40 italic">VS</div>
                        <div className="text-[12px] text-yellow-500 font-bold uppercase tracking-widest italic">
                          {new Date(match.date).toLocaleTimeString(locale, {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="text-[10px] text-white/50 font-bold uppercase">
                          {new Date(match.date).toLocaleDateString(locale)}
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 flex items-center justify-center relative">
                          {awayTeam.logo?.url ? (
                            <Image
                              src={awayTeam.logo.url}
                              alt={awayTeam.name}
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div
                              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-2 border-white/10"
                              style={{ backgroundColor: awayTeam.colors?.primary || '#333' }}
                            >
                              <span className="text-sm font-black text-white">
                                {awayTeam.shortName}
                              </span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          {awayTeam.shortName}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handlePredict(match)}
                      variant="solid"
                      color="warning"
                      className="w-full py-4 text-[10px] font-black uppercase tracking-[0.1em] gap-2 shadow-[0_4px_15px_rgba(234,179,8,0.2)] hover:scale-[1.02] transition-all"
                    >
                      {t('place_prediction')}
                      <ArrowUpRight className="w-3 h-3" />
                    </Button>
                  </div>
                )
              })}
            </div>
          ) : allMatchesPredicted ? (
            <div className="flex items-center justify-between">
              <p className="text-lg text-white font-medium italic opacity-80">
                {t('all_predicted_message')}
              </p>
              <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-app text-green-500 text-xs font-bold uppercase tracking-widest">
                {t('all_done_status')}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-white/40 italic text-sm font-medium tracking-wide">
              {t('matches.empty_state')}
            </div>
          )}
        </div>
      </IceGlassCard>

      <PredictionDialog
        match={selectedMatch}
        isOpen={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        onSuccess={handleSuccess}
      />

      <MatchLockedDialog
        isOpen={isLockedModalOpen}
        onClose={() => setIsLockedModalOpen(false)}
      />
    </>
  )
}
