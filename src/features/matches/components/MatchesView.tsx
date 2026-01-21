'use client'

import React, { useEffect, useState, useMemo, useCallback } from 'react'
import type { Competition, Match, Prediction } from '@/payload-types'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { getMatchesAction } from '../actions'
import { MatchCard } from './MatchCard'
import { PredictionDialog } from './PredictionDialog'
import { CalendarDialog } from './CalendarDialog'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, CalendarDays, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface MatchesViewProps {
  competition: Competition
}

export function MatchesView({ competition }: MatchesViewProps) {
  const t = useTranslations('Dashboard.matches')

  const [loading, setLoading] = useState(true)
  const [matches, setMatches] = useState<Match[]>([])
  const [userPredictions, setUserPredictions] = useState<Prediction[]>([])
  const [stats, setStats] = useState<Record<string, any>>({})

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [predictingMatch, setPredictingMatch] = useState<Match | null>(null)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const groupMatchesByDate = useCallback((matches: Match[]) => {
    const groups: Record<string, Match[]> = {}
    matches.forEach((m) => {
      const date = new Date(m.date).toISOString().split('T')[0]
      if (!groups[date]) groups[date] = []
      groups[date].push(m)
    })
    return groups
  }, [])

  const fetchData = useCallback(async () => {
    try {
      const data = await getMatchesAction(competition.id)
      setMatches(data.matches)
      setUserPredictions(data.userPredictions)
      setStats(data.stats)

      // Group matches by date to find unique days
      const grouped = groupMatchesByDate(data.matches)
      const dates = Object.keys(grouped).sort()

      // Find closest date (today or next match)
      const now = new Date()
      now.setHours(0, 0, 0, 0)

      const closestDate = dates.find((d) => new Date(d) >= now) || dates[0]
      setSelectedDate(closestDate)
    } catch (error) {
      console.error('Failed to fetch matches:', error)
    } finally {
      setLoading(false)
    }
  }, [competition.id, groupMatchesByDate])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const groupedMatches = useMemo(() => groupMatchesByDate(matches), [matches, groupMatchesByDate])
  const availableDates = useMemo(() => Object.keys(groupedMatches).sort(), [groupedMatches])

  const activeMatches = selectedDate ? groupedMatches[selectedDate] || [] : []

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-[#eab308] animate-spin" />
        <p className="text-white/40 font-bold uppercase tracking-[0.2em] animate-pulse">
          Načítavam zápasy...
        </p>
      </div>
    )
  }

  const handleDateChange = (direction: 'prev' | 'next') => {
    const currentIndex = availableDates.indexOf(selectedDate!)
    if (direction === 'prev' && currentIndex > 0) {
      setSelectedDate(availableDates[currentIndex - 1])
    } else if (direction === 'next' && currentIndex < availableDates.length - 1) {
      setSelectedDate(availableDates[currentIndex + 1])
    }
  }

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Header with Day Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-5xl font-black italic uppercase text-white tracking-tighter leading-none">
            <span className="text-[#eab308]">{competition.name}</span>
          </h1>
          <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[0.65rem] md:text-xs">
            {t('description')}
          </p>
        </div>

        {/* Premium Day Selector */}
        <div className="flex items-center gap-4 bg-white/10 border border-white/20 p-1.5 rounded-2xl backdrop-blur-xl shadow-2xl">
          <button
            onClick={() => handleDateChange('prev')}
            disabled={availableDates.indexOf(selectedDate!) === 0}
            className={cn(
              'w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 group/btn',
              availableDates.indexOf(selectedDate!) === 0
                ? 'bg-white/5 opacity-20 cursor-not-allowed'
                : 'bg-white/10 hover:bg-[#eab308] hover:text-black',
            )}
          >
            <ChevronLeft
              className={cn(
                'w-6 h-6 transition-colors',
                availableDates.indexOf(selectedDate!) === 0
                  ? 'text-white/20'
                  : 'text-[#eab308] group-hover/btn:text-black',
              )}
            />
          </button>

          <button
            onClick={() => setIsCalendarOpen(true)}
            className="flex flex-col items-center px-4 md:px-6 min-w-[100px] md:min-w-[140px] hover:bg-white/5 rounded-xl py-1 transition-colors group/center cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-0.5">
              <CalendarDays className="w-3.5 h-3.5 text-[#eab308] group-hover/center:scale-110 transition-transform" />
              <span className="text-[0.6rem] md:text-[0.6rem] font-black uppercase tracking-widest text-[#eab308]">
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
          </button>

          <button
            onClick={() => handleDateChange('next')}
            disabled={availableDates.indexOf(selectedDate!) === availableDates.length - 1}
            className={cn(
              'w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 group/btn',
              availableDates.indexOf(selectedDate!) === availableDates.length - 1
                ? 'bg-white/5 opacity-20 cursor-not-allowed'
                : 'bg-white/10 hover:bg-[#eab308] hover:text-black',
            )}
          >
            <ChevronRight
              className={cn(
                'w-6 h-6 transition-colors',
                availableDates.indexOf(selectedDate!) === availableDates.length - 1
                  ? 'text-white/20'
                  : 'text-[#eab308] group-hover/btn:text-black',
              )}
            />
          </button>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {activeMatches.length > 0 ? (
          activeMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              userPrediction={userPredictions.find(
                (p) => (typeof p.match === 'string' ? p.match : p.match.id) === match.id,
              )}
              stats={stats[match.id]}
              onPredict={setPredictingMatch}
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
        match={predictingMatch}
        isOpen={!!predictingMatch}
        onClose={() => setPredictingMatch(null)}
        existingPrediction={userPredictions.find(
          (p) => (typeof p.match === 'string' ? p.match : p.match.id) === predictingMatch?.id,
        )}
        onSuccess={fetchData}
      />

      <CalendarDialog
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedDate={selectedDate}
        availableDates={availableDates}
        onSelectDate={setSelectedDate}
      />
    </div>
  )
}
