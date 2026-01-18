'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export function Header() {
  const [time, setTime] = useState<Date>(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('sk-SK', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(date)
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('sk-SK', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 border-b border-white/10 bg-black/20 backdrop-blur-md flex items-center px-6">
      <div className="text-xl font-bold text-white tracking-widest uppercase">Slapshot Club</div>

      <div className="ml-auto flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 text-white/50 text-sm font-medium">
          <span className="capitalize">{formatDate(time)}</span>
          <span className="text-white/20">|</span>
          <span className="text-white font-mono">{formatTime(time)}</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10" />
      </div>
    </header>
  )
}
