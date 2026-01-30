import React from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: React.ReactNode
  description?: string
  children?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col md:flex-row md:items-end justify-between gap-6', className)}>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-5xl font-black italic uppercase text-white tracking-tighter leading-none">
          <span className="text-warning">{title}</span>
        </h1>
        {description && (
          <p className="text-white font-bold uppercase tracking-[0.3em] text-[0.65rem] md:text-xs">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  )
}
