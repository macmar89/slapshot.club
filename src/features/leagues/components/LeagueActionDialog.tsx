'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'

interface LeagueActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: 'kick' | 'transfer' | null
  memberName: string
  onConfirm: () => void
  isProcessing?: boolean
}

export function LeagueActionDialog({
  open,
  onOpenChange,
  type,
  memberName,
  onConfirm,
  isProcessing = false,
}: LeagueActionDialogProps) {
  const t = useTranslations('Leagues')

  if (!type) return null

  const isKick = type === 'kick'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/95 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>
            {isKick ? t('kick_confirm_title') : t('transfer_confirm_title')}
          </DialogTitle>
          <DialogDescription className="text-white/60">
            {isKick
              ? t('kick_confirm_desc', { name: memberName })
              : t('transfer_confirm_desc', { name: memberName })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer"
              disabled={isProcessing}
            >
              {t('cancel')}
            </Button>
          </DialogClose>
          <Button
            onClick={onConfirm}
            color={isKick ? 'destructive' : 'primary'}
            className="cursor-pointer"
            disabled={isProcessing}
          >
            {isProcessing
              ? (isKick ? t('deleting') : t('Common.loading'))
              : (isKick ? t('kick_confirm_action') : t('transfer_confirm_action'))}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
