'use client'

import React, { useEffect, useState, useMemo, useCallback, useOptimistic } from 'react'
import type { Competition, Match, Prediction } from '@/payload-types'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { getMatchesAction } from '../actions'
import { MatchCard } from './MatchCard'
import { Button } from '@/components/ui/Button'
import { PredictionDialog } from './PredictionDialog'
import { CalendarDialog } from './CalendarDialog'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { DailySummary } from './DailySummary'
import { MatchesSkeleton } from './MatchesSkeleton'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { PageLayout } from '@/components/layout/PageLayout'
import { PageHeader } from '@/components/layout/PageHeader'
import { MatchLockedDialog } from './MatchLockedDialog'

interface MatchesViewProps {
  competition: Competition
}

export function MatchesView({ competition }: MatchesViewProps) {
  const t = useTranslations('Dashboard.matches')

  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const [loading, setLoading] = useState(true)
  const [matches, setMatches] = useState<Match[]>([])
  const [userPredictions, setUserPredictions] = useState<Prediction[]>([])
  const [stats, setStats] = useState<Record<string, any>>({})

  const [optimisticPredictions, setOptimisticPrediction] = useOptimistic(
    userPredictions,
    (state, newPrediction: Prediction) => {
      const matchId =
        typeof newPrediction.match === 'string' ? newPrediction.match : newPrediction.match.id
      const existingIndex = state.findIndex(
        (p) => (typeof p.match === 'string' ? p.match : p.match.id) === matchId,
      )

      if (existingIndex !== -1) {
        const newState = [...state]
        newState[existingIndex] = { ...newState[existingIndex], ...newPrediction }
        return newState
      }

      return [...state, newPrediction]
    },
  )

  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isLockedModalOpen, setIsLockedModalOpen] = useState(false)
  const [predictingMatch, setPredictingMatch] = useState<Match | null>(null)

  const groupMatchesByDate = useCallback((matches: Match[]) => {
    const groups: Record<string, Match[]> = {}
    matches.forEach((m) => {
      const date = new Date(m.date).toISOString().split('T')[0]
      if (!groups[date]) groups[date] = []
      groups[date].push(m)
    })
    return groups
  }, [])

  const groupedMatches = useMemo(() => groupMatchesByDate(matches), [matches, groupMatchesByDate])
  const availableDates = useMemo(() => Object.keys(groupedMatches).sort(), [groupedMatches])

  const selectedDate = useMemo(() => {
    const urlDate = searchParams.get('date')
    if (urlDate && availableDates.includes(urlDate)) {
      return urlDate
    }

    // Fallback to today or next match
    if (availableDates.length > 0) {
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      const closestDate = availableDates.find((d) => new Date(d) >= now) || availableDates[0]
      return closestDate
    }

    return null
  }, [searchParams, availableDates])

  const setUrlDate = useCallback(
    (date: string) => {
      const params = new URLSearchParams(searchParams)
      params.set('date', date)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams],
  )

  const leagueId = searchParams.get('leagueId')

  const fetchData = useCallback(async () => {
    try {
      const data = await getMatchesAction(competition.id, leagueId || undefined)
      setMatches(data.matches)
      setUserPredictions(data.userPredictions)
      setStats(data.stats)
    } catch (error) {
      console.error('Failed to fetch matches:', error)
    } finally {
      setLoading(false)
    }
  }, [competition, leagueId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Sync default date back to URL if missing, to ensure refreshes work correctly
  useEffect(() => {
    if (!searchParams.get('date') && selectedDate) {
      setUrlDate(selectedDate)
    }
  }, [searchParams, selectedDate, setUrlDate])

  const activeMatches = selectedDate ? groupedMatches[selectedDate] || [] : []

  if (loading) {
    return <MatchesSkeleton />
  }

  const handleDateChange = (direction: 'prev' | 'next') => {
    const currentIndex = availableDates.indexOf(selectedDate!)
    if (direction === 'prev' && currentIndex > 0) {
      setUrlDate(availableDates[currentIndex - 1])
    } else if (direction === 'next' && currentIndex < availableDates.length - 1) {
      setUrlDate(availableDates[currentIndex + 1])
    }
  }

  return (
    <PageLayout>
      <PageHeader
        title={competition.name}
        description={t('description')}
        hideDescriptionOnMobile
        className="mb-4 md:mb-6"
      >
        {/* Premium Day Selector */}
        <div className="flex items-center justify-between md:justify-start w-full md:w-auto gap-4 bg-white/10 border border-white/20 p-1.5 rounded-app backdrop-blur-xl shadow-2xl">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleDateChange('prev')}
            disabled={availableDates.indexOf(selectedDate!) === 0}
            className={cn(
              'rounded-app border-white/20 bg-white/10 transition-all duration-300 group/btn',
              availableDates.indexOf(selectedDate!) === 0
                ? 'opacity-20 cursor-not-allowed'
                : 'hover:bg-warning hover:text-black hover:border-warning',
            )}
          >
            <ChevronLeft
              className={cn(
                'w-6 h-6 transition-colors',
                availableDates.indexOf(selectedDate!) === 0
                  ? 'text-white/20'
                  : 'text-warning group-hover/btn:text-black',
              )}
              strokeWidth={availableDates.indexOf(selectedDate!) === 0 ? 2 : 3}
            />
          </Button>

          <Button
            variant="ghost"
            onClick={() => setIsCalendarOpen(true)}
            className="flex-1 md:flex-none flex flex-col items-center px-4 md:px-6 min-w-[100px] md:min-w-[140px] hover:bg-white/5 rounded-app h-auto py-1 group/center"
          >
            <div className="flex items-center gap-2 mb-0.5">
              <CalendarDays className="w-3.5 h-3.5 text-warning group-hover/center:scale-110 transition-transform" />
              <span className="text-[0.6rem] md:text-[0.6rem] font-black uppercase tracking-widest text-warning">
                {t('selected_day')}
              </span>
            </div>
            <span className="text-sm font-black text-white uppercase tracking-wider hidden md:block">
              {selectedDate
                ? new Date(selectedDate).toLocaleDateString('sk-SK', {
                    day: 'numeric',
                    month: 'long',
                  })
                : '-'}
            </span>
            <span className="text-sm font-black text-white uppercase tracking-wider md:hidden">
              {selectedDate
                ? new Date(selectedDate).toLocaleDateString('sk-SK', {
                    day: 'numeric',
                    month: 'numeric',
                  })
                : '-'}
            </span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => handleDateChange('next')}
            disabled={availableDates.indexOf(selectedDate!) === availableDates.length - 1}
            className={cn(
              'rounded-app border-white/20 bg-white/10 transition-all duration-300 group/btn',
              availableDates.indexOf(selectedDate!) === availableDates.length - 1
                ? 'opacity-20 cursor-not-allowed'
                : 'hover:bg-warning hover:text-black hover:border-warning',
            )}
          >
            <ChevronRight
              className={cn(
                'w-6 h-6 transition-colors',
                availableDates.indexOf(selectedDate!) === availableDates.length - 1
                  ? 'text-white/20'
                  : 'text-warning group-hover/btn:text-black',
              )}
              strokeWidth={
                availableDates.indexOf(selectedDate!) === availableDates.length - 1 ? 2 : 3
              }
            />
          </Button>
        </div>
      </PageHeader>

      <DailySummary matches={activeMatches} predictions={optimisticPredictions} />

      {/* Matches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6 -mx-1 md:mx-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {activeMatches.length > 0 ? (
          activeMatches.map((match: Match) => (
            <MatchCard
              key={match.id}
              match={match}
              userPrediction={optimisticPredictions.find(
                (p) => (typeof p.match === 'string' ? p.match : p.match.id) === match.id,
              )}
              stats={stats[match.id]}
              onPredict={setPredictingMatch}
              onRefresh={fetchData}
              onMatchLocked={() => setIsLockedModalOpen(true)}
            />
          ))
        ) : (
          <IceGlassCard className="lg:col-span-2 p-12 border-dashed border-white/10 bg-white/[0.02]">
            <div className="flex flex-col items-center text-center gap-4">
              <CalendarDays className="w-12 h-12 text-white/10" />
              <p className="text-white/30 font-bold uppercase tracking-widest text-sm">
                {t('no_matches_day')}
              </p>
            </div>
          </IceGlassCard>
        )}
      </div>

      <PredictionDialog
        key={predictingMatch?.id || 'none'}
        match={predictingMatch}
        isOpen={!!predictingMatch}
        onClose={() => setPredictingMatch(null)}
        existingPrediction={userPredictions.find(
          (p) => (typeof p.match === 'string' ? p.match : p.match.id) === predictingMatch?.id,
        )}
        onOptimisticSave={setOptimisticPrediction}
        onSuccess={fetchData}
      />

      <CalendarDialog
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedDate={selectedDate}
        availableDates={availableDates}
        onSelectDate={setUrlDate}
      />

      <MatchLockedDialog isOpen={isLockedModalOpen} onClose={() => setIsLockedModalOpen(false)} />
    </PageLayout>
  )
}
