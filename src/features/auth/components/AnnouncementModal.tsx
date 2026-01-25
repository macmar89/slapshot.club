'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { markAnnouncementAsSeen } from '@/features/auth/actions'
import { X, Bell } from 'lucide-react'
import Image from 'next/image'

interface AnnouncementModalProps {
  id: string
  title: string
  description: string
  isOpen: boolean
  onClose: () => void
  icon?: React.ReactNode
  buttonText?: string
  image?: any
}

export const AnnouncementModal = ({
  id,
  title,
  description,
  isOpen,
  onClose,
  icon,
  buttonText = 'OK',
  image,
}: AnnouncementModalProps) => {
  const handleClose = async () => {
    await markAnnouncementAsSeen(id)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md p-0 bg-transparent border-none shadow-none z-[100]">
        <IceGlassCard className="p-1 sm:p-2 animate-welcome" backdropBlur="xl">
          <div className="bg-black/40 rounded-2xl p-6 sm:p-8 border border-white/5 relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-24 h-24 bg-gold/5 filter blur-2xl rounded-full -translate-x-8 -translate-y-8" />

            <div className="relative z-10 flex flex-col items-center gap-6">
              {image && typeof image === 'object' && (
                <div className="w-full aspect-video relative rounded-xl overflow-hidden border border-white/10 mb-2">
                  <Image src={image.url} alt={image.alt || title} fill className="object-cover" />
                </div>
              )}

              {!image && (
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                  {icon || <Bell className="w-8 h-8 text-gold" />}
                </div>
              )}

              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-white italic tracking-tighter uppercase">
                  {title}
                </DialogTitle>
                <DialogDescription className="text-white/60 text-base mt-2 leading-relaxed">
                  {description}
                </DialogDescription>
              </DialogHeader>

              <Button
                color="gold"
                className="w-full py-5 text-sm tracking-wide uppercase italic font-black"
                onClick={handleClose}
              >
                {buttonText}
              </Button>
            </div>
          </div>
        </IceGlassCard>
      </DialogContent>
    </Dialog>
  )
}
