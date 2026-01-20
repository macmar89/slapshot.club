'use client'

import React, { useState } from 'react'
import type { Competition, User } from '@/payload-types'
import { useRouter } from '@/i18n/routing'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { JoinCompetitionModal } from './JoinCompetitionModal'
import { joinCompetition } from '../actions'
import { Header } from '@/components/layout/Header'
import { Container } from '@/components/ui'

interface LobbyViewProps {
  user: User
  competitions: Competition[]
  joinedCompetitionIds: string[]
}

export function LobbyView({ user, competitions, joinedCompetitionIds }: LobbyViewProps) {
  const t = useTranslations('Lobby')
  const router = useRouter()

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null)
  const [isJoining, setIsJoining] = useState(false)
  const [showFinished, setShowFinished] = useState(false)

  const liveCompetitions = competitions.filter((c) => c.status === 'active')
  const upcomingCompetitions = competitions.filter((c) => c.status === 'upcoming')
  const finishedCompetitions = competitions.filter((c) => c.status === 'finished')

  const handleEnter = (e: React.MouseEvent, competition: Competition) => {
    e.preventDefault()
    e.stopPropagation()

    if (competition.status === 'finished') {
      router.push({
        pathname: '/dashboard/[slug]',
        params: { slug: competition.slug || '' },
      })
      return
    }

    const isJoined = joinedCompetitionIds.includes(competition.id)

    if (isJoined) {
      router.push({
        pathname: '/dashboard/[slug]',
        params: { slug: competition.slug || '' },
      })
    } else {
      if (competition.isRegistrationOpen) {
        setSelectedCompetition(competition)
        setIsJoinModalOpen(true)
      }
    }
  }

  const handleConfirmJoin = async () => {
    if (!selectedCompetition) return

    setIsJoining(true)
    try {
      const res = await joinCompetition(selectedCompetition.id, user.id)
      if (res.ok) {
        setIsJoinModalOpen(false)
        router.push({
          pathname: '/dashboard/[slug]',
          params: { slug: selectedCompetition.slug || '' },
        })
      } else {
        console.error(res.error)
      }
    } catch (error) {
      console.error('Failed to join:', error)
    } finally {
      setIsJoining(false)
    }
  }

  const renderCompetitionGrid = (comps: Competition[], compact: boolean = false) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
      {comps.map((competition) => {
        const isJoined = joinedCompetitionIds.includes(competition.id)
        const isFinished = competition.status === 'finished'
        const isRegistrationDisabled = !isJoined && !isFinished && !competition.isRegistrationOpen

        return (
          <div
            key={competition.id}
            className={cn(
              'group block',
              isRegistrationDisabled && 'cursor-not-allowed opacity-60',
              compact ? 'h-[240px]' : 'h-[340px] md:h-[380px] lg:h-[400px]',
            )}
          >
            <IceGlassCard
              className={cn(
                'h-full transition-all duration-300 p-0 overflow-hidden',
                !isRegistrationDisabled && 'group-hover:-translate-y-2',
                isJoined && !isFinished
                  ? 'border-[#22c55e]/30 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
                  : 'group-hover:border-[#eab308]/40',
                isFinished && 'opacity-80 group-hover:opacity-100',
              )}
              backdropBlur="xs"
              withGradient
            >
              <div
                className={cn(
                  'relative h-full flex flex-col justify-end',
                  compact ? 'p-5' : 'p-5 md:p-6 lg:p-8',
                )}
              >
                <div
                  className={cn(
                    'absolute top-6 right-6 px-4 py-1.5 rounded-full text-[0.7rem] font-bold uppercase tracking-widest backdrop-blur-md border animate-in zoom-in duration-500',
                    competition.status === 'active'
                      ? 'bg-[#eab308] text-black border-[#eab308] shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                      : competition.status === 'finished'
                        ? 'bg-white/5 text-white/50 border-white/10'
                        : 'bg-white/10 text-white border-white/20',
                  )}
                >
                  {t(`status.${competition.status}`)}
                </div>

                {isJoined && !isFinished && (
                  <div className="absolute top-6 left-6 px-3 py-1.5 rounded-full bg-[#22c55e] text-white text-[0.65rem] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_15px_rgba(34,197,94,0.4)] animate-in slide-in-from-left-2 duration-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {t('joined')}
                  </div>
                )}

                <div
                  className={cn('flex flex-col text-left', compact ? 'gap-1 mb-4' : 'gap-2 mb-6')}
                >
                  <h2
                    className={cn(
                      'font-bold text-white group-hover:text-[#eab308] transition-colors line-clamp-1',
                      compact ? 'text-lg md:text-xl' : 'text-xl md:text-2xl',
                    )}
                  >
                    {competition.name}
                  </h2>
                  <p className="text-sm text-white/70 line-clamp-2 leading-relaxed">
                    {competition.description}
                  </p>
                </div>

                <div
                  className={cn(
                    'flex justify-between items-center border-t border-white/10',
                    compact ? 'pt-3' : 'pt-4',
                  )}
                >
                  <div className="flex flex-col text-left">
                    <span className="text-[0.65rem] uppercase text-white/40 tracking-wider font-bold mb-0.5">
                      {t('start_date')}
                    </span>
                    <span className="text-sm font-semibold">
                      {new Date(competition.startDate).toLocaleDateString('sk-SK')}
                    </span>
                  </div>
                  <Button
                    onClick={(e) => handleEnter(e, competition)}
                    color={isFinished ? 'secondary' : 'gold'}
                    variant={isFinished ? 'outline' : 'solid'}
                    disabled={isRegistrationDisabled}
                    className={cn(
                      'font-black rounded-xl shrink-0',
                      compact ? 'px-4 py-2 text-[10px]' : 'px-5 py-2.5 text-xs',
                      isRegistrationDisabled && 'opacity-50 grayscale cursor-not-allowed',
                    )}
                  >
                    {isFinished ? t('view_button') : t('enter_button')}
                  </Button>
                </div>
              </div>
            </IceGlassCard>
          </div>
        )
      })}
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

      <JoinCompetitionModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onConfirm={handleConfirmJoin}
        competitionName={selectedCompetition?.name || ''}
        isLoading={isJoining}
      />
    </div>
  )
}
