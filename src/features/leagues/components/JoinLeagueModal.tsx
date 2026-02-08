'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { X } from 'lucide-react'
import { JoinLeagueForm } from './JoinLeagueForm'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { Button } from '@/components/ui/Button'

export function JoinLeagueModal() {
  const t = useTranslations('Leagues')
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-[14px] font-black uppercase tracking-widest text-white hover:text-white transition-colors border-b border-white/20 hover:border-warning pb-0.5"
      >
        {t('join_league_trigger')}
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-md relative animate-in zoom-in-95 duration-300">
        <IceGlassCard className="p-0 overflow-hidden border-white/10" backdropBlur="lg">
          <div className="p-8 sm:p-10 relative">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black text-warning uppercase tracking-tight font-display italic">
                {t('join_section')}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white/30 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            
            <p className="text-white/50 text-xs mb-8 uppercase font-bold tracking-wider leading-relaxed text-center">
              {t('join_description')}
            </p>

            <JoinLeagueForm />
          </div>
        </IceGlassCard>
      </div>
    </div>
  )
}
