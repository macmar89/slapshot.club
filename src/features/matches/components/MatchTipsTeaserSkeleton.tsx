'use client'

import React from 'react'

interface MatchTipsTeaserSkeletonProps {
  count?: number
}

export function MatchTipsTeaserSkeleton({ count = 3 }: MatchTipsTeaserSkeletonProps) {
  return (
    <div className="divide-y divide-white/5 select-none pointer-events-none opacity-60">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar Skeleton */}
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/30 border border-white/20 blur-[2px] animate-pulse" />

            <div className="flex flex-col gap-2">
              {/* Username Skeleton */}
              <div className="h-3 w-24 bg-white/30 rounded blur-[3px] animate-pulse" />
              {/* Date Skeleton */}
              <div className="h-2 w-16 bg-white/20 rounded blur-[2px] animate-pulse" />
            </div>
          </div>

          <div className="flex items-center gap-8">
            {/* Score Skeleton */}
            <div className="h-6 w-12 bg-white/30 rounded italic font-black text-lg blur-[4px] animate-pulse" />
            {/* Points Skeleton */}
            <div className="h-5 w-10 bg-white/20 rounded blur-[3px] animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}
