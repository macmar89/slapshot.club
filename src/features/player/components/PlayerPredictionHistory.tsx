'use client'

import { useState, useEffect } from 'react'
import { Search, Lock, Eye, Trophy, X } from 'lucide-react'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { getPlayerPredictions, getCompetitionTeams } from '@/lib/api/player'
import type { Prediction, Match, Team, Media } from '@/payload-types'
import { useDebounce } from '@/hooks/use-debounce'
import { Link } from '@/i18n/routing'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { useRef } from 'react'

interface PlayerPredictionHistoryProps {
  userId: string
  currentUserId?: string
  currentUserPlan: 'free' | 'pro' | 'vip'
  profileOwnerPlan: 'free' | 'pro' | 'vip'
  competitionId: string
  initialData?: Prediction[]
  initialSearch?: string
  pageSize?: number
  className?: string
}

export function PlayerPredictionHistory({
  userId,
  currentUserId,
  currentUserPlan,
  profileOwnerPlan,
  competitionId,
  initialData = [],
  initialSearch = '',
  pageSize = 6,
  className,
}: PlayerPredictionHistoryProps) {
  const t = useTranslations('PlayerDetail')
  const { slug } = useParams()
  const [search, setSearch] = useState(initialSearch)
  const debouncedSearch = useDebounce(search, 300)
  const [predictions, setPredictions] = useState<Prediction[]>(initialData)
  const [loading, setLoading] = useState(initialData.length === 0)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  // Autocomplete State
  const [allTeams, setAllTeams] = useState<Team[]>([])
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isMe = userId === currentUserId
  const isFreeViewer = currentUserPlan === 'free' && !isMe
  const isVipOwner = profileOwnerPlan === 'vip' && !isMe

  const fetchPredictions = async (targetPage: number, reset = false) => {
    if (isFreeViewer) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const result = await getPlayerPredictions(
        userId,
        targetPage,
        pageSize,
        debouncedSearch,
        competitionId,
        selectedTeam?.id,
      )

      const newDocs = result.docs
      setPredictions((prev) => (reset ? newDocs : [...prev, ...newDocs]))
      setHasMore(result.hasNextPage)
      setPage(targetPage)
    } catch (error) {
      console.error('Failed to fetch predictions', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch all teams for autocomplete on mount
  useEffect(() => {
    const loadTeams = async () => {
      try {
        const teams = await getCompetitionTeams(competitionId)
        setAllTeams(teams)
      } catch (err) {
        console.error('Failed to load teams', err)
      }
    }
    loadTeams()
  }, [competitionId])

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (initialData.length > 0 && !debouncedSearch && !selectedTeam && page === 1) {
      setLoading(false)
      return
    }
    fetchPredictions(1, true)
  }, [debouncedSearch, competitionId, selectedTeam])

  // Simple filtering for suggestions
  useEffect(() => {
    if (!search.trim()) {
      setFilteredTeams([])
      return
    }

    const term = search.toLowerCase()
    const filtered = allTeams.filter(
      (t) =>
        t.name.toLowerCase().includes(term) ||
        t.shortName.toLowerCase().includes(term) ||
        (t.country && t.country.toLowerCase().includes(term)),
    )
    setFilteredTeams(filtered.slice(0, 8)) // Limit suggestions
  }, [search, allTeams])

  const handleSelectTeam = (team: Team) => {
    setSelectedTeam(team)
    setSearch('') // Clear search text when a team is selected or keep it?
    // User often wants to see what they selected.
    // If we clear search, we should probably show the selected team in the UI.
    setShowSuggestions(false)
  }

  const handleClear = () => {
    setSearch('')
    setSelectedTeam(null)
  }

  if (isVipOwner) {
    return (
      <IceGlassCard className="p-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mb-4 border border-warning/20">
          <Lock className="text-warning" size={32} />
        </div>
        <h4 className="text-xl font-black text-white italic uppercase mb-2">
          {t('vip_privacy_title', { fallback: 'Súkromný VIP Profil' })}
        </h4>
        <p className="text-sm text-white/60 max-w-xs uppercase font-bold italic tracking-tight">
          {t('vip_privacy_desc', { fallback: 'Tento užívateľ má skrytú históriu tipov.' })}
        </p>
      </IceGlassCard>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search Bar & Autocomplete */}
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
          <input
            type="text"
            placeholder={
              selectedTeam
                ? selectedTeam.name
                : t('search_matches', { fallback: 'Hľadať zápas...' })
            }
            className={cn(
              'w-full bg-white/10 border border-white/10 rounded-lg py-2.5 pl-10 pr-12 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all backdrop-blur-xl',
              isFreeViewer && 'opacity-50 cursor-not-allowed',
              selectedTeam && 'border-warning/30 bg-warning/5 ring-1 ring-warning/20',
            )}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            disabled={isFreeViewer}
          />

          {(search || selectedTeam) && !isFreeViewer && (
            <button
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 border border-white/10 text-white/40 hover:text-white hover:bg-white/20 transition-all group cursor-pointer"
              title="Zrušiť filter"
            >
              <X size={14} className="group-hover:scale-110 transition-transform" />
            </button>
          )}

          {isFreeViewer && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className="text-[10px] font-black uppercase italic text-warning bg-warning/10 px-2 py-0.5 rounded border border-warning/20">
                PRO
              </span>
            </div>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredTeams.length > 0 && !isFreeViewer && (
          <div className="absolute z-50 w-full mt-2 rounded-xl border border-white/10 bg-[#0f172a]/90 backdrop-blur-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-1.5 space-y-0.5">
              {filteredTeams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => handleSelectTeam(team)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left group"
                >
                  <div className="w-8 h-6 flex items-center justify-center">
                    {team.logo && (
                      <Image
                        src={(team.logo as Media).url || ''}
                        alt={team.name}
                        width={24}
                        height={16}
                        className="h-full w-auto object-contain group-hover:scale-110 transition-transform"
                      />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white leading-tight">{team.name}</span>
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">
                      {team.shortName}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Prediction Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isFreeViewer ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="relative group overflow-hidden rounded-2xl border border-white/5 bg-white/5 h-[160px] filter blur-[10px] pointer-events-none opacity-40"
            />
          ))
        ) : (
          <>
            {predictions.length === 0 && !loading ? (
              <div className="col-span-full py-12 text-center">
                <p className="text-white/40 uppercase font-black italic tracking-widest text-sm">
                  {t('no_predictions_found', { fallback: 'Žiadne tipy nenájdené' })}
                </p>
              </div>
            ) : (
              predictions.map((p) => {
                const match = p.match as Match
                const homeTeam = match.homeTeam as Team
                const awayTeam = match.awayTeam as Team

                return (
                  <IceGlassCard
                    key={p.id}
                    className="p-4 flex flex-col justify-between group h-full"
                  >
                    <div className="space-y-4">
                      {/* Teams & Logo */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-col items-center gap-1 w-2/5">
                          <div className="h-8 w-12 flex items-center justify-center relative">
                            {homeTeam.logo ? (
                              <Image
                                src={(homeTeam.logo as Media).url || ''}
                                alt={homeTeam.name}
                                width={48}
                                height={32}
                                className="h-full w-auto object-contain drop-shadow-md"
                              />
                            ) : (
                              <span className="text-[10px] font-black text-white/20">
                                {homeTeam.shortName}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-bold text-white uppercase tracking-tight line-clamp-1">
                            {homeTeam.shortName}
                          </span>
                        </div>

                        <div className="flex flex-col items-center justify-center flex-1">
                          <span className="text-xl font-black italic text-white tracking-tighter">
                            {match.result?.homeScore ?? 0} : {match.result?.awayScore ?? 0}
                          </span>
                        </div>

                        <div className="flex flex-col items-center gap-1 w-2/5">
                          <div className="h-8 w-12 flex items-center justify-center relative">
                            {awayTeam.logo ? (
                              <Image
                                src={(awayTeam.logo as Media).url || ''}
                                alt={awayTeam.name}
                                width={48}
                                height={32}
                                className="h-full w-auto object-contain drop-shadow-md"
                              />
                            ) : (
                              <span className="text-[10px] font-black text-white/20">
                                {awayTeam.shortName}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-bold text-white uppercase tracking-tight line-clamp-1">
                            {awayTeam.shortName}
                          </span>
                        </div>
                      </div>

                      {/* User Prediction */}
                      <div className="bg-white/10 rounded-xl p-2.5 flex items-center justify-between border border-white/5">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black uppercase tracking-widest text-white/40 leading-none mb-1">
                            Môj Tip
                          </span>
                          <span className="text-sm font-black text-white italic">
                            {p.homeGoals} : {p.awayGoals}
                          </span>
                        </div>
                        {p.points !== null && (
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-warning/10 border border-warning/20">
                            <Trophy size={10} className="text-warning" />
                            <span className="text-xs font-black text-warning">+{p.points}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end">
                      {/* @ts-expect-error -- dynamic path */}
                      <Link href={`/dashboard/${slug}/matches/${match.id}`}>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[9px] font-black uppercase italic tracking-wider text-white/60 transition-all hover:text-white">
                          <Eye size={12} />
                          Detail Zápasu
                        </button>
                      </Link>
                    </div>
                  </IceGlassCard>
                )
              })
            )}

            {hasMore && (
              <div className="col-span-full pt-4">
                <button
                  onClick={() => fetchPredictions(page + 1)}
                  className="w-full py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 font-black italic uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 group"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{t('load_more', { fallback: 'Načítať viac' })}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {isFreeViewer && (
        <div className="p-8 flex flex-col items-center justify-center text-center bg-white/5 rounded-2xl border border-white/10 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center mb-4 border border-warning/20 mx-auto">
              <Lock className="text-warning" size={24} />
            </div>
            <h4 className="text-lg font-black text-white italic uppercase mb-2">
              {t('history_locked_title', { fallback: 'História je prémiová funkcia' })}
            </h4>
            <p className="text-xs text-white/50 uppercase font-bold italic mb-6">
              {t('history_locked_desc', {
                fallback: 'Pre prístup k celej histórii tipov si aktivuj',
              })}{' '}
              <span className="text-warning">PRO</span>.
            </p>
            <button className="px-6 py-2 bg-warning text-black font-black uppercase italic text-sm rounded-lg hover:bg-warning/90 transition-all">
              {t('get_pro_now', { fallback: 'Aktivovať PRO' })}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
