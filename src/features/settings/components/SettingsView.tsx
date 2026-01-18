'use client'

import React from 'react'
import { IceGlassCard } from '@/components/ui/IceGlassCard'

export function SettingsView() {
  return (
    <div className="w-full h-full p-6">
      <IceGlassCard className="p-8 h-full">
        <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-widest">Nastavenia</h1>
        <p className="text-white/70">Tu si môžeš upraviť svoje nastavenia.</p>
      </IceGlassCard>
    </div>
  )
}
