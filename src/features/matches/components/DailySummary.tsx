'use client'

import React, { useMemo } from 'react'
import type { Match, Prediction } from '@/payload-types'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { cn } from '@/lib/utils'
import { CheckCircle2, Clock } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface DailySummaryProps {
  matches: Match[]
  predictions: Prediction[]
}

export function DailySummary({ matches, predictions }: DailySummaryProps) {
  const t = useTranslations('Dashboard.matches')

  const { dailyPoints, allMatchesFinished, hasMatches, predictedCount, totalCount } =
    useMemo(() => {
      let points = 0
      let allFinished = true
      let predictedCount = 0
      const totalCount = matches.length
      const hasMatches = totalCount > 0

      matches.forEach((match) => {
        const prediction = predictions.find(
          (p) => (typeof p.match === 'string' ? p.match : p.match.id) === match.id,
        )

        if (prediction) {
          predictedCount++
        }

        if (match.status === 'finished') {
          points += prediction?.points || 0
        } else if (match.status !== 'cancelled') {
          allFinished = false
        }
      })

      return {
        dailyPoints: points,
        allMatchesFinished: allFinished,
        hasMatches,
        predictedCount,
        totalCount,
      }
    }, [matches, predictions])

  if (!hasMatches) return null

  return (
    <div className="mb-4 sm:mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <IceGlassCard className="p-2 sm:p-4" backdropBlur="md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'p-2.5 rounded-app transition-colors duration-500 shrink-0',
                allMatchesFinished ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning',
              )}
            >
              {allMatchesFinished ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <Clock className="w-6 h-6 animate-pulse" />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div>
                <h3 className="text-[0.65rem] md:text-[0.7rem] font-black text-white/40 uppercase tracking-[0.2em] leading-none mb-1.5">
                  {t('daily_summary_title')}
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-lg md:text-2xl font-black text-white tracking-tight leading-none">
                    {t('daily_points', { count: dailyPoints })}
                  </span>
                  <div
                    className={cn(
                      'text-[0.5rem] md:text-[0.65rem] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border leading-none',
                      allMatchesFinished
                        ? 'bg-success/10 text-success border-success/20'
                        : 'bg-warning/10 text-warning border-warning/20',
                    )}
                  >
                    {allMatchesFinished ? t('status_complete') : t('status_in_progress')}
                  </div>
                </div>
              </div>

              {/* Prediction Tracker - Mobile version inside the stack */}
              <div className="flex items-center gap-2 sm:hidden">
                <span
                  className={cn(
                    'text-sm font-black tracking-tighter',
                    predictedCount === totalCount ? 'text-success' : 'text-warning',
                  )}
                >
                  {predictedCount} / {totalCount}
                </span>
                <span className="text-[0.6rem] font-black text-white/50 uppercase tracking-widest">
                  {t('predicted_label')}
                </span>
              </div>
            </div>
          </div>

          {/* Prediction Tracker - Desktop version on the right */}
          <div className="hidden sm:flex flex-col items-end">
            <div className="flex items-center gap-2 mb-">
              <span className="text-[0.65rem] font-black text-white/40 uppercase tracking-widest">
                {t('predicted_label')}
              </span>
              <span
                className={cn(
                  'text-sm font-black tracking-tighter',
                  predictedCount === totalCount ? 'text-success' : 'text-warning',
                )}
              >
                {predictedCount} / {totalCount}
              </span>
            </div>
          </div>
        </div>
      </IceGlassCard>
    </div>
  )
}
