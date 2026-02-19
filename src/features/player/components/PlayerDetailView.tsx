'use client'

import { User } from '@/payload-types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { PlayerHeader } from './PlayerHeader'
import { PlayerStatsGrid } from './PlayerStatsGrid'
import { PlayerPredictionsList } from './PlayerPredictionsList'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { BackLink } from '@/components/ui/BackLink'

interface PlayerDetailViewProps {
  user: User // Target player
  currentUser?: User | null
  stats: any // Using specific type or any for now as defined in api/player
  predictions?: any[] // Adjusted to avoid deep type issues
  predictionsPagination?: any
  isLocked: boolean
  competitionSlug: string
}

export function PlayerDetailView({
  user,
  currentUser,
  stats,
  predictions = [],
  predictionsPagination,
  isLocked,
  competitionSlug,
}: PlayerDetailViewProps) {
  const t = useTranslations('PlayerDetail')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize tab state from URL or default
  const defaultTab = searchParams.get('tab') || 'overview'
  const [activeTab, setActiveTab] = useState(defaultTab)

  // Sync state when URL changes
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }
  }, [searchParams, activeTab])

  const handleTabChange = (value: string) => {
    setActiveTab(value)

    // Update URL
    const params = new URLSearchParams(searchParams)
    params.set('tab', value)

    // Reset page parameters when switching away from predictions
    if (value !== 'predictions') {
      params.delete('page')
      params.delete('q')
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <BackLink
        href={`/dashboard/${competitionSlug}/leaderboard`}
        label={t('back_to_leaderboard')}
      />
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="flex justify-start mb-8">
          <TabsList className="rounded-full inline-flex">
            <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
            <TabsTrigger value="predictions">{t('predictions')}</TabsTrigger>
            <TabsTrigger value="badges" disabled>
              {t('badgesSoon')}
            </TabsTrigger>
          </TabsList>

          {/* Header */}
        </div>
        <PlayerHeader user={user} rank={user.stats?.globalRank} />

        <TabsContent
          value="overview"
          className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className="space-y-4">
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
              {t('seasonStats')}
            </h2>
            <PlayerStatsGrid stats={stats ? stats.globalStats : null} />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
              {t('activeCompetitions')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats?.leagues && stats.leagues.length > 0 ? (
                stats.leagues.map((league: any) => (
                  <IceGlassCard
                    key={league.competition.id}
                    className="p-6 flex flex-col gap-2 group hover:bg-white/5 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-black text-white italic uppercase tracking-tight">
                        {league.competition.name}
                      </h3>
                      <div className="px-2 py-1 bg-white/10 rounded text-xs font-bold text-white/70">
                        {t('rank')}: #{league.rank}
                      </div>
                    </div>
                    <div className="mt-2 flex items-end gap-2 text-white/60 text-sm">
                      <span className="text-2xl font-black text-accent italic loading-none">
                        {league.points}
                      </span>
                      <span className="mb-1 font-bold uppercase tracking-wider text-[10px]">
                        {t('points')}
                      </span>
                    </div>
                  </IceGlassCard>
                ))
              ) : (
                <IceGlassCard className="p-6 flex items-center justify-center text-white/40 italic">
                  {t('noMoreData')}
                </IceGlassCard>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="predictions"
          className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <PlayerPredictionsList
            predictions={predictions}
            isLocked={isLocked}
            pagination={
              predictionsPagination || {
                page: 1,
                totalPages: 1,
                hasNextPage: false,
                hasPrevPage: false,
              }
            }
          />
        </TabsContent>

        <TabsContent value="badges">
          <div className="text-center text-white/40">Coming soon</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
