'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { useTranslations } from 'next-intl'
import { completeOnboarding } from '@/features/auth/actions'
import { Trophy, ShieldCheck, Users as UsersIcon, ChevronRight, Check } from 'lucide-react'

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
}

export const OnboardingModal = ({ isOpen, onClose }: OnboardingModalProps) => {
  const t = useTranslations('Onboarding')
  const [step, setStep] = useState(1)
  const [isClosing, setIsClosing] = useState(false)

  const steps = [
    {
      title: t('step1_title'),
      description: t('step1_description'),
      icon: <Trophy className="w-12 h-12 text-gold" />,
    },
    {
      title: t('step2_title'),
      description: t('step2_description'),
      icon: <ShieldCheck className="w-12 h-12 text-gold" />,
    },
    {
      title: t('step3_title'),
      description: t('step3_description'),
      icon: <UsersIcon className="w-12 h-12 text-gold" />,
    },
  ]

  const handleNext = async () => {
    if (step < steps.length) {
      setStep(step + 1)
    } else {
      try {
        setIsClosing(true)
        const result = await completeOnboarding()

        if (result.ok) {
          onClose()
        } else {
          console.error('[OnboardingModal] Failed to complete onboarding:', result.error)
          // Allow closing anyway to not block the user, or show error
          onClose()
        }
      } catch (err) {
        console.error('[OnboardingModal] Unexpected error:', err)
        onClose()
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-lg p-0 bg-transparent border-none shadow-none z-[100] data-[state=open]:animate-none data-[state=closed]:animate-none overflow-visible"
        onPointerDownOutside={(e) => e.preventDefault()} // Don't close on outside click for onboarding
      >
        <IceGlassCard
          className="p-1 sm:p-2 animate-welcome origin-center shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)]"
          backdropBlur="xl"
        >
          <div className="bg-slate-950/90 rounded-2xl p-8 sm:p-10 border border-white/10 relative overflow-hidden">
            {/* Background Decorations - Subtler */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 filter blur-3xl rounded-full translate-x-12 -translate-y-12" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/5 filter blur-3xl rounded-full -translate-x-8 translate-y-8" />

            <div className="relative z-10 flex flex-col items-center text-center gap-6">
              <DialogHeader className="w-full">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center border border-gold/20 shadow-[0_0_30px_rgba(212,175,55,0.15)] animate-in zoom-in duration-700">
                    {steps[step - 1].icon}
                  </div>
                </div>
                <DialogTitle className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">
                  {step === 1 ? t('title') : steps[step - 1].title}
                </DialogTitle>
                <DialogDescription className="text-white/60 text-lg font-medium leading-relaxed">
                  {steps[step - 1].description}
                </DialogDescription>
              </DialogHeader>

              <div className="flex gap-2 mb-2">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i + 1 === step ? 'w-8 bg-gold' : 'w-2 bg-white/20'
                    }`}
                  />
                ))}
              </div>

              <Button
                color="gold"
                className="w-full py-6 text-lg tracking-wide uppercase italic font-black group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                onClick={handleNext}
              >
                {step === steps.length ? (
                  <>
                    {t('finish')}
                    <Check className="ml-2 w-5 h-5" />
                  </>
                ) : (
                  <>
                    {t('next')}
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </IceGlassCard>
      </DialogContent>
    </Dialog>
  )
}
