'use client'

import { User } from '@/payload-types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { PlayerHeader } from './PlayerHeader'
import { PlayerStatsGrid } from './PlayerStatsGrid'
import { PlayerPredictionHistory } from './PlayerPredictionHistory'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { useState, useEffect, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { BackLink } from '@/components/ui/BackLink'
import { LeagueStatsCard } from './LeagueStatsCard'

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
  const [isPending, startTransition] = useTransition()

  const activeTab = searchParams.get('tab') || 'current_season'

  const handleTabChange = (value: string) => {
    startTransition(() => {
      // Update URL
      const params = new URLSearchParams(searchParams)
      params.set('tab', value)

      // Reset page parameters when switching away from predictions
      if (value !== 'predictions') {
        params.delete('page')
        params.delete('q')
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  // Find stats for the current league
  const currentLeagueStats = stats?.leagues?.find(
    (l: any) => l.competition.slug === competitionSlug,
  )

  const competitionId = currentLeagueStats?.competition?.id

  // Filter other leagues
  const otherLeagues =
    stats?.leagues?.filter((l: any) => l.competition.slug !== competitionSlug) || []

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <BackLink
        href={`/dashboard/${competitionSlug}/leaderboard`}
        label={t('back_to_leaderboard')}
      />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="flex justify-start mb-8">
          <TabsList className="rounded-full inline-flex flex-wrap gap-1">
            <TabsTrigger value="current_season">{t('current_season')}</TabsTrigger>
            <TabsTrigger value="predictions">{t('predictions')}</TabsTrigger>
            <TabsTrigger value="other_leagues">{t('other_leagues')}</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="current_season" className="space-y-6">
          <PlayerStatsGrid stats={currentLeagueStats} user={user} isLocked={isLocked} />
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          {competitionId && (
            <PlayerPredictionHistory
              userId={user.id}
              currentUserId={currentUser?.id}
              currentUserPlan={currentUser?.subscription?.plan || 'free'}
              profileOwnerPlan={user.subscription?.plan || 'free'}
              competitionId={competitionId}
              initialData={predictions}
              initialSearch={searchParams.get('q') || ''}
              initialHasMore={predictionsPagination?.hasNextPage}
              initialTotalCount={predictionsPagination?.totalDocs}
              initialTotalLeagueCount={predictionsPagination?.totalLeaguePredictions}
              pageSize={6}
            />
          )}
        </TabsContent>

        <TabsContent value="other_leagues" className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otherLeagues.length > 0 ? (
                otherLeagues.map((league: any) => (
                  <LeagueStatsCard
                    key={league.competition.id}
                    league={league}
                    isLocked={isLocked}
                    currentUserPlan={currentUser?.subscription?.plan || 'free'}
                  />
                ))
              ) : (
                <IceGlassCard className="p-8 text-center text-white/40 italic">
                  {t('notSignedToOtherCompetitions')}
                </IceGlassCard>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
