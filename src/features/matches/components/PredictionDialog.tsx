'use client'

import React, { useState, startTransition } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import type { Match, Team, Media, Prediction } from '@/payload-types'
import { savePredictionAction } from '../actions'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Trophy, Plus, Minus } from 'lucide-react'

interface PredictionDialogProps {
  match: Match | null
  existingPrediction?: Prediction
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  onOptimisticSave?: (prediction: Prediction) => void
}

export function PredictionDialog({
  match,
  existingPrediction,
  isOpen,
  onClose,
  onSuccess,
  onOptimisticSave,
}: PredictionDialogProps) {
  const t = useTranslations('Dashboard.matches.dialog')
  const [homeGoals, setHomeGoals] = useState<number>(existingPrediction?.homeGoals ?? 0)
  const [awayGoals, setAwayGoals] = useState<number>(existingPrediction?.awayGoals ?? 0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!match) return null

  const homeTeam = match.homeTeam as Team
  const awayTeam = match.awayTeam as Team

  const isDraw = homeGoals === awayGoals
  const isLive = match.status === 'live'
  const isFinished = match.status === 'finished'
  const isLocked = isLive || isFinished

  const handleSave = async () => {
    if (isDraw || isLocked) return

    setIsSubmitting(true)

    const optimisticPrediction = {
      ...existingPrediction,
      id: existingPrediction?.id || `temp-${Date.now()}`,
      match: match.id,
      homeGoals,
      awayGoals,
      updatedAt: new Date().toISOString(),
      createdAt: existingPrediction?.createdAt || new Date().toISOString(),
    } as Prediction

    startTransition(() => {
      onOptimisticSave?.(optimisticPrediction)
      onClose()
    })

    try {
      await savePredictionAction({
        matchId: match.id,
        homeGoals,
        awayGoals,
      })
      onSuccess()
    } catch (error) {
      console.error('Failed to save prediction:', error)
      alert('Chyba pri ukladaní tipu. Skús to znova.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderLogo = (team: Team) => (
    <div className="h-10 w-20 md:h-12 md:w-24 flex items-center justify-center">
      {team.logo && typeof team.logo === 'object' ? (
        <Image
          src={(team.logo as Media).url || ''}
          alt={team.name}
          width={80}
          height={60}
          className="h-full w-auto object-contain rounded-app"
        />
      ) : (
        <div
          className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white/10"
          style={{ backgroundColor: team.colors.primary }}
        >
          <span className="text-[0.6rem] font-black text-white">{team.shortName}</span>
        </div>
      )}
    </div>
  )

  const ScoreInput = ({
    value,
    onChange,
    team,
    disabled = false,
  }: {
    value: number
    onChange: (v: number) => void
    team: Team
    disabled?: boolean
  }) => (
    <div className="flex flex-col items-center gap-4 flex-1">
      {renderLogo(team)}
      <span className="text-[0.6rem] font-black uppercase tracking-widest text-white/40">
        {team.name}
      </span>
      <div className="flex items-center gap-2 md:gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => !disabled && onChange(Math.max(0, value - 1))}
          disabled={disabled}
          className="rounded-full bg-white/10 border-white/20 hover:bg-white/20 text-white shadow-sm disabled:opacity-30"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <div className="w-12 h-14 md:w-14 md:h-16 bg-white/10 rounded-app border border-white/20 flex items-center justify-center text-2xl md:text-3xl font-black tracking-tighter">
          {value}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => !disabled && onChange(value + 1)}
          disabled={disabled}
          className="rounded-full bg-white/10 border-white/20 hover:bg-white/20 text-white shadow-sm disabled:opacity-30"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100vw-16px)] sm:max-w-[425px] bg-[#0c0f14]/95 backdrop-blur-3xl border-white/10 text-white rounded-app p-4 md:p-8 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* Abstract Background Decoration */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-warning/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-warning/5 rounded-full blur-3xl pointer-events-none" />

        <DialogHeader className="mb-8">
          <DialogTitle className="text-center text-2xl font-black uppercase tracking-widest leading-tight">
            {t('title')} <Trophy className="inline-block w-6 h-6 ml-2 text-warning" />
          </DialogTitle>
          <DialogDescription className="text-center text-white/40 text-xs font-bold uppercase tracking-widest mt-2">
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-8 mb-8">
          <div className="flex items-center gap-4 relative z-10">
            <ScoreInput value={homeGoals} onChange={setHomeGoals} team={homeTeam} disabled={isLocked} />

            <div className="text-white/20 text-4xl font-black italic items-center pt-8">:</div>

            <ScoreInput value={awayGoals} onChange={setAwayGoals} team={awayTeam} disabled={isLocked} />
          </div>

          {isDraw && !isLocked && (
            <div className="text-center text-red-500 text-[0.6rem] font-black uppercase tracking-widest animate-pulse">
              {t('no_draws')}
            </div>
          )}

          {isLive && (
            <div className="text-center text-warning text-[0.6rem] font-black uppercase tracking-widest animate-pulse">
              {t('match_live')}
            </div>
          )}

          {isFinished && (
            <div className="text-center text-white/40 text-[0.6rem] font-black uppercase tracking-widest">
              {t('match_finished')}
            </div>
          )}
        </div>

        <DialogFooter className="relative z-10 sm:justify-center">
          {!isLocked && (
            <Button
              onClick={handleSave}
              disabled={isSubmitting || isDraw}
              variant="solid"
              color="gold"
              className="w-full py-6 rounded-app text-sm font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(234,179,8,0.2)] hover:shadow-[0_15px_40px_rgba(234,179,8,0.3)] transition-all hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none"
            >
              {isSubmitting ? t('loading') : existingPrediction ? t('update') : t('submit')}
            </Button>
          )}
          {isLocked && (
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full py-6 rounded-app text-sm font-black uppercase tracking-[0.2em] border-white/10 hover:bg-white/5 transition-all"
            >
              {t('close')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
