'use client'

import React, { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { getMatchPredictionsAction } from '../actions'
import type { Prediction, User, Media } from '@/payload-types'
import { Loader2, Search, ChevronLeft, ChevronRight, Trophy } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useTranslations } from 'next-intl'

import { IceGlassCard } from '@/components/ui/IceGlassCard'

interface MatchPredictionsListProps {
  matchId: string
}

export function MatchPredictionsList({ matchId }: MatchPredictionsListProps) {
  const t = useTranslations('Dashboard.matches')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500)
  const [loading, setLoading] = useState(true)

  // Data state
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalDocs, setTotalDocs] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await getMatchPredictionsAction({
          matchId,
          page,
          limit: 10,
          search: debouncedSearch,
        })

        setPredictions(res.docs as Prediction[])
        setTotalPages(res.totalPages)
        setTotalDocs(res.totalDocs)
      } catch (error) {
        console.error('Failed to fetch predictions', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [matchId, page, debouncedSearch])

  // Reset page when search changes
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  return (
    <div className="w-full">
      <IceGlassCard
        className="overflow-hidden min-h-[300px] flex flex-col w-full"
        backdropBlur="md"
      >
        {/* Header Content inside the card */}
        <div className="p-4 md:p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-4 bg-warning rounded-full shadow-[0_0_10px_rgba(255,184,0,0.5)]" />
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">
              {t('player_tips')} <span className="text-warning ml-1">({totalDocs})</span>
            </h3>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-3.5 w-3.5 text-white/40" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('search_by_username')}
              className="block w-full pl-9 pr-3 py-2 border border-white/10 rounded-app leading-5 bg-white/5 text-white placeholder-white/20 focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-warning/50 focus:border-warning/50 sm:text-xs font-medium transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-warning animate-spin" />
          </div>
        ) : predictions.length > 0 ? (
          <div className="divide-y divide-white/5">
            {predictions.map((prediction) => {
              const user = prediction.user as User
              const isExact = prediction.isExact

              return (
                <div
                  key={prediction.id}
                  className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 overflow-hidden relative border border-white/10 shrink-0">
                      <div
                        className="w-full h-full flex items-center justify-center font-black text-[10px] md:text-xs text-secondary-foreground"
                        style={{
                          backgroundColor: user.jersey?.primaryColor || '#333',
                          color: user.jersey?.secondaryColor || '#fff',
                        }}
                      >
                        {user.username?.substring(0, 2).toUpperCase()}
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs md:text-sm font-bold text-white group-hover:text-warning transition-colors">
                        {user.username}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/40">
                          {new Date(prediction.updatedAt).toLocaleDateString()}
                        </span>
                        {user.badges && user.badges.length > 0 && (
                          <div className="px-1.5 py-0.5 rounded bg-white/10 border border-white/5 text-[8px] font-bold text-white/60">
                            Badges: {user.badges.length}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 md:gap-8">
                    {/* The Prediction */}
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'text-xl md:text-2xl font-black italic tracking-tighter',
                          isExact ? 'text-green-400' : 'text-white',
                        )}
                      >
                        {prediction.homeGoals}:{prediction.awayGoals}
                      </span>
                    </div>

                    {/* Points */}
                    <div className="w-16 text-right">
                      {(prediction.points !== null ||
                        (prediction as any).potentialPoints !== undefined) && (
                        <div className="flex items-center justify-end gap-1.5">
                          <span
                            className={cn(
                              'text-sm md:text-base font-black',
                              (prediction.points || 0) > 0 ? 'text-warning' : 'text-white/20',
                            )}
                          >
                            +{prediction.points ?? (prediction as any).potentialPoints ?? 0}
                          </span>
                          <Trophy
                            className={cn(
                              'w-3 h-3 md:w-4 md:h-4',
                              (prediction.points || 0) > 0 ? 'text-warning' : 'text-white/20',
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-white/20">
            <Search className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-xs font-bold uppercase tracking-widest">
              {search ? t('no_search_results') : t('no_predictions_yet')}
            </p>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 p-4 border-t border-white/5 mt-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-8 w-8 rounded-full p-0 text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 min-w-[3rem] text-center">
              {page} / {totalPages}
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-8 w-8 rounded-full p-0 text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </IceGlassCard>
    </div>
  )
}
