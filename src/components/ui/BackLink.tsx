'use client'

import React from 'react'
import { Link } from '@/i18n/routing'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BackLinkProps {
  href: string
  label?: string
  className?: string
}

export function BackLink({ href, label, className }: BackLinkProps) {
  return (
    <div className={cn('flex items-center justify-start', className)}>
      <Link
        href={href as any}
        className="group flex items-center gap-4 pl-2 pr-6 py-2.5 rounded-app bg-white/5 border border-white/10 hover:bg-warning hover:border-warning transition-all duration-300 shadow-xl backdrop-blur-md"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-white/80 group-hover:text-black" />
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/80 group-hover:text-black transition-colors">
          {label || 'Späť'}
        </span>
      </Link>
    </div>
  )
}
