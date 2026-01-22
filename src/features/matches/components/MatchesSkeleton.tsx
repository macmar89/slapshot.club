'use client'

import React from 'react'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { cn } from '@/lib/utils'

function MatchCardSkeleton() {
  return (
    <IceGlassCard backdropBlur="md" className="p-3 md:p-6 animate-pulse border-white/5">
      {/* Status Badge Skeleton */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6">
        <div className="w-20 h-6 bg-white/5 rounded-full" />
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-2">
          <div className="h-3 w-24 bg-white/10 rounded" />
          <div className="h-4 w-32 bg-white/5 rounded" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mb-8">
        {/* Home Team */}
        <div className="flex flex-col items-center gap-3 w-1/3">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/5 overflow-hidden" />
          <div className="h-3 w-12 bg-white/10 rounded" />
          <div className="h-4 w-20 bg-white/5 rounded hidden md:block" />
        </div>

        {/* VS / Score */}
        <div className="flex flex-col items-center justify-center gap-2 flex-1">
          <div className="h-10 w-20 bg-white/5 rounded-lg" />
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center gap-3 w-1/3">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/5 overflow-hidden" />
          <div className="h-3 w-12 bg-white/10 rounded" />
          <div className="h-4 w-20 bg-white/5 rounded hidden md:block" />
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1 max-w-xs space-y-2">
          <div className="h-1.5 w-full bg-white/5 rounded-full" />
          <div className="flex justify-between">
            <div className="w-8 h-3 bg-white/5 rounded" />
            <div className="w-12 h-3 bg-white/5 rounded" />
            <div className="w-8 h-3 bg-white/5 rounded" />
          </div>
        </div>
        <div className="w-32 h-10 bg-white/5 rounded-xl ml-auto md:ml-0" />
      </div>
    </IceGlassCard>
  )
}

export function MatchesSkeleton() {
  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-3">
          <div className="h-10 md:h-12 w-48 md:w-64 bg-white/10 rounded-lg animate-pulse" />
          <div className="h-4 w-32 md:w-40 bg-white/5 rounded animate-pulse" />
        </div>

        {/* Day Selector Skeleton */}
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-1.5 rounded-2xl backdrop-blur-xl animate-pulse">
          <div className="w-10 h-10 bg-white/10 rounded-xl" />
          <div className="flex flex-col items-center gap-2 px-4 md:px-6 min-w-[100px] md:min-w-[140px]">
            <div className="h-3 w-16 bg-white/10 rounded" />
            <div className="h-5 w-24 bg-white/5 rounded" />
          </div>
          <div className="w-10 h-10 bg-white/10 rounded-xl" />
        </div>
      </div>

      {/* Matches Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6 -mx-1 md:mx-0">
        {[1, 2, 3, 4].map((i) => (
          <MatchCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
