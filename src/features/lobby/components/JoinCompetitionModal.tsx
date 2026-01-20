'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { useTranslations } from 'next-intl'

interface JoinCompetitionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  competitionName: string
  isLoading: boolean
}

export function JoinCompetitionModal({
  isOpen,
  onClose,
  onConfirm,
  competitionName,
  isLoading,
}: JoinCompetitionModalProps) {
  const t = useTranslations('Lobby.join_modal')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1a] border-[#eab308]/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#eab308]">
            {t('title')}
          </DialogTitle>
          <DialogDescription className="text-white/60">
            {t('description', { competitionName })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="text-white/60 hover:text-white hover:bg-white/5"
          >
            {t('cancel')}
          </Button>
          <Button
            color="gold"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? t('joining') : t('confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
