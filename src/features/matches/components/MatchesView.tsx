'use client'

import React from 'react'
import { IceGlassCard } from '@/components/ui/IceGlassCard'

export function MatchesView() {
  return (
    <div className="w-full h-full p-6">
      <IceGlassCard className="p-8 h-full">
        <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-widest">Zápasy</h1>
        <p className="text-white/70">Rozpis a výsledky zápasov.</p>
      </IceGlassCard>
    </div>
  )
}
