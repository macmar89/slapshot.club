'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { JoinLeagueForm } from './JoinLeagueForm'
import { IceGlassCard } from '@/components/ui/IceGlassCard'

export function JoinLeagueCard() {
  const t = useTranslations('Leagues')

  return (
    <IceGlassCard className="shrink-0 self-start sticky top-24 border-warning/10" backdropBlur="md">
      <div className="p-6 sm:p-8">
        <h3 className="text-center text-warning font-black uppercase tracking-widest mb-3 text-base sm:text-lg italic drop-shadow-sm font-display leading-tight">
          {t('join_title') || 'Máš pozvánku?'}
        </h3>
        <p className="text-center text-white/50 text-[10px] sm:text-[11px] mb-8 uppercase font-bold tracking-[0.1em] leading-relaxed max-w-[200px] mx-auto">
          {t('join_description') || 'Zadaj kód od kamoša a pridaj sa do partie.'}
        </p>

        <div className="relative group/form">
          {/* Subtle glow effect behind form */}
          <div className="absolute -inset-4 bg-warning/5 rounded-full blur-2xl opacity-0 group-hover/form:opacity-100 transition-opacity pointer-events-none" />
          <JoinLeagueForm />
        </div>
      </div>
    </IceGlassCard>
  )
}
