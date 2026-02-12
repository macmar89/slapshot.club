'use client'

import React, { useState } from 'react'
import type { Competition } from '@/payload-types'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useRouter } from '@/i18n/routing'
import dynamic from 'next/dynamic'
import { joinCompetition } from '../actions'

// Dynamicky načítame modál pre lepší výkon
const JoinCompetitionModal = dynamic(
  () => import('./JoinCompetitionModal').then((mod) => mod.JoinCompetitionModal),
  { ssr: false },
)

interface CompetitionCardProps {
  competition: Competition
  isJoined: boolean
  userId: string
  compact?: boolean
  participantCount: number
  userRank?: number
}

export function CompetitionCard({
  competition,
  isJoined,
  userId,
  compact = false,
  participantCount,
  userRank,
}: CompetitionCardProps) {
  const t = useTranslations('Arena')
  const router = useRouter()

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
  const [isJoining, setIsJoining] = useState(false)

  const isFinished = competition.status === 'finished'
  const isRegistrationDisabled = !isJoined && !isFinished && !competition.isRegistrationOpen

  const handleEnter = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Ak je ukončená alebo už prihlásená, ideme na dashboard
    if (isFinished || isJoined) {
      router.push({
        pathname: '/dashboard/[slug]',
        params: { slug: competition.slug || '' },
      })
      return
    }

    // Ak nie je prihlásený a registrácia je otvorená, ukážeme modal
    if (competition.isRegistrationOpen) {
      setIsJoinModalOpen(true)
    }
  }

  const handleConfirmJoin = async () => {
    setIsJoining(true)
    try {
      const res = await joinCompetition(competition.id, userId)
      if (res.ok) {
        setIsJoinModalOpen(false)
        router.push({
          pathname: '/dashboard/[slug]',
          params: { slug: competition.slug || '' },
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

  return (
    <>
      <div
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
                'absolute top-6 right-6 px-4 py-1.5 rounded-app text-[0.7rem] font-bold uppercase tracking-widest backdrop-blur-md border animate-in zoom-in duration-500',
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
              <div className="absolute top-6 left-6 px-3 py-1.5 rounded-app bg-[#22c55e] text-white text-[0.65rem] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_15px_rgba(34,197,94,0.4)] animate-in slide-in-from-left-2 duration-500">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                {t('joined')}
              </div>
            )}

            <div className={cn('flex flex-col text-left', compact ? 'gap-1 mb-4' : 'gap-2 mb-6')}>
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

              <div className="flex items-center justify-between gap-2 mt-4">
                {isJoined && userRank && (
                  <div className="flex items-center gap-2 px-2 py-1 rounded-sm bg-[#eab308]/10 border border-[#eab308]/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                    <span className="text-xs -my-1">
                      {userRank === 1 ? '🥇' : userRank === 2 ? '🥈' : userRank === 3 ? '🥉' : `#${userRank}`}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#eab308]">
                      {t('your_rank')}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-1.5 px-2 py-1 rounded-sm bg-white/5 border border-white/10 ml-auto">
                  <div className="w-1 h-1 rounded-full bg-white/40" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white/50">
                    {t('participants', { count: participantCount })}
                  </span>
                </div>
              </div>
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
                onClick={handleEnter}
                color={isFinished ? 'secondary' : 'gold'}
                variant={isFinished ? 'outline' : 'solid'}
                disabled={isRegistrationDisabled}
                className={cn(
                  'font-black rounded-app shrink-0',
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

      {isJoinModalOpen && (
        <JoinCompetitionModal
          isOpen={isJoinModalOpen}
          onClose={() => setIsJoinModalOpen(false)}
          onConfirm={handleConfirmJoin}
          competitionName={competition.name}
          isLoading={isJoining}
        />
      )}
    </>
  )
}
