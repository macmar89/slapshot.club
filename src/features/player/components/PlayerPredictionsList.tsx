'use client'

import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import {
  Search,
  Lock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Prediction, Match, Team } from '@/payload-types'
import { format } from 'date-fns'
import { useTranslations } from 'next-intl'

interface PlayerPredictionsListProps {
  predictions: Prediction[]
  isLocked: boolean
  isLoading?: boolean
  pagination: {
    page: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export function PlayerPredictionsList({
  predictions,
  isLocked,
  pagination,
  isLoading,
}: PlayerPredictionsListProps) {
  const t = useTranslations('PlayerDetail')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Local state for search input to avoid debounce lag on UI
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    // Debounce or Enter key logic could go here, for now just simple Enter
  }

  const executeSearch = () => {
    const params = new URLSearchParams(searchParams)
    if (searchTerm) {
      params.set('q', searchTerm)
    } else {
      params.delete('q')
    }
    params.set('page', '1') // Reset to page 1
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', newPage.toString())
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  if (isLocked) {
    return (
      <IceGlassCard className="p-8 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[300px]">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 text-white">
            <Lock size={32} />
          </div>
          <h3 className="text-2xl font-black text-white italic mb-2 uppercase">
            {t('historyLocked')}
          </h3>
          <p className="text-white/60 max-w-sm mb-6">{t('historyLockedDesc')}</p>
          <Button className="font-bold uppercase tracking-wider bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 border-none">
            {t('becomeMember')}
          </Button>
        </div>
        {/* Fake content behind blur */}
        <div className="w-full opacity-20 blur-sm pointer-events-none select-none">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 mb-2 bg-white/10 rounded-lg w-full" />
          ))}
        </div>
      </IceGlassCard>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters Toolbar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder={t('searchTeam')}
            className="pl-9 bg-black/20 border-white/10 text-white placeholder:text-white/30"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
          />
        </div>
        <Button
          variant="ghost"
          onClick={executeSearch}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/10"
        >
          {t('searchButton')}
        </Button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {predictions.length === 0 ? (
          <div className="text-center py-12 text-white/40 italic">{t('noPredictions')}</div>
        ) : (
          predictions.map((prediction) => {
            const match = prediction.match as Match
            const home = match?.homeTeam as Team
            const away = match?.awayTeam as Team

            // Visualization helpers
            const isEvaluated = prediction.status === 'evaluated'
            const isWon = isEvaluated && (prediction.points || 0) > 0 // Basic assumption
            const isExact = (prediction.points || 0) >= 3 // Example threshold

            // Format match date
            const matchDate = match?.date ? new Date(match.date) : null

            return (
              <IceGlassCard
                key={prediction.id}
                className="p-4 flex flex-col md:flex-row items-center gap-4 group hover:bg-white/5 transition-colors"
              >
                {/* ID / Date */}
                <div className="text-[10px] text-white/30 font-mono w-full md:w-auto text-center md:text-left">
                  {matchDate ? format(matchDate, 'dd.MM HH:mm') : 'TBD'}
                </div>

                {/* Teams & Score */}
                <div className="flex-1 grid grid-cols-[1fr,auto,1fr] items-center gap-4 w-full">
                  <div className="text-right font-bold text-white uppercase truncate flex items-center justify-end gap-2">
                    <span className="hidden md:inline">{home?.name}</span>
                    <span className="md:hidden">{home?.shortName || home?.name?.slice(0, 3)}</span>
                    {/* Logo placeholder */}
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold bg-white/10 px-2 py-0.5 rounded text-white/70">
                      {prediction.homeGoals} : {prediction.awayGoals}
                    </span>
                    {isEvaluated && (
                      <span className="text-[9px] text-white/30 mt-1">
                        ({match.result?.homeScore}:{match.result?.awayScore})
                      </span>
                    )}
                  </div>

                  <div className="text-left font-bold text-white uppercase truncate flex items-center justify-start gap-2">
                    {/* Logo placeholder */}
                    <span className="hidden md:inline">{away?.name}</span>
                    <span className="md:hidden">{away?.shortName || away?.name?.slice(0, 3)}</span>
                  </div>
                </div>

                {/* Points / Status */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-center">
                  {isEvaluated ? (
                    <div
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black italic',
                        (prediction.points || 0) > 0
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400',
                      )}
                    >
                      {(prediction.points || 0) > 0 ? (
                        <>
                          <CheckCircle2 size={12} />+{prediction.points} B
                        </>
                      ) : (
                        <>
                          <XCircle size={12} />0 B
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                      <AlertCircle size={12} />
                      {t('pending')}
                    </div>
                  )}
                </div>
              </IceGlassCard>
            )
          })
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => changePage(pagination.page - 1)}
            disabled={!pagination.hasPrevPage}
            className="text-white hover:bg-white/10"
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="flex items-center text-sm font-bold text-white/50">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => changePage(pagination.page + 1)}
            disabled={!pagination.hasNextPage}
            className="text-white hover:bg-white/10"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </div>
  )
}
