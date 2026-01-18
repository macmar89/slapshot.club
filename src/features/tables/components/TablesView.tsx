'use client'

import React from 'react'
import { IceGlassCard } from '@/components/ui/IceGlassCard'

export function TablesView() {
  return (
    <div className="w-full h-full p-6">
      <IceGlassCard className="p-8 h-full">
        <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-widest">Tabuľky</h1>
        <p className="text-white/70">Prehľad tabuliek a štatistík.</p>
      </IceGlassCard>
    </div>
  )
}
