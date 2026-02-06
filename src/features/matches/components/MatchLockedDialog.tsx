'use client'

import React from 'react'
import { AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'

interface MatchLockedDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function MatchLockedDialog({ isOpen, onClose }: MatchLockedDialogProps) {
  const t = useTranslations('Dashboard.matches')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[400px] border-white/10 bg-black/90 backdrop-blur-2xl rounded-app">
        <DialogHeader className="items-center text-center pt-4">
          <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-warning" />
          </div>
          <DialogTitle className="text-lg font-black text-white uppercase tracking-tight">
            {t('match_locked')}
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="sm:justify-center pt-4 pb-2">
          <Button
            variant="solid"
            color="warning"
            onClick={onClose}
            className="w-full rounded-app uppercase font-black tracking-widest"
          >
            {t('dialog.close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
