import React from 'react'
import { cn } from '@/lib/utils'

export type PlanType = 'free' | 'pro' | 'vip'

interface PlanBadgeProps {
  plan: PlanType
  className?: string
}

export function PlanBadge({ plan, className }: PlanBadgeProps) {
  const styles = {
    free: 'bg-white/10 text-white/40 border-white/10',
    pro: 'bg-warning/20 text-warning border-warning/30 shadow-[0_0_10px_rgba(251,191,36,0.1)]',
    vip: 'bg-purple-500/20 text-purple-400 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]',
  }

  return (
    <span
      className={cn(
        'px-2 py-0.5 rounded text-[10px] font-black uppercase italic tracking-wider leading-none border',
        styles[plan],
        className,
      )}
    >
      {plan}
    </span>
  )
}
