'use client'

import React from 'react'
import { Container } from '@/components/ui/Container'

export function DashboardHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 border-b border-white/10 bg-black/20 backdrop-blur-md flex items-center px-6">
      <div className="text-xl font-bold text-white tracking-widest uppercase">Slapshot Club</div>
      {/* Placeholder for header actions */}
      <div className="ml-auto flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-white/10" />
      </div>
    </header>
  )
}
