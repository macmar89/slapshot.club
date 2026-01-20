'use client'

import React, { useState, useEffect } from 'react'
import { Clock as ClockIcon } from 'lucide-react'

export function Clock() {
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString('sk-SK', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!time) return null

  return (
    <div className="flex items-center gap-2 text-white/50 text-sm font-medium">
      <ClockIcon className="w-4 h-4" />
      <span>{time}</span>
    </div>
  )
}
