'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { CreateLeagueForm } from './CreateLeagueForm'
import { JoinLeagueForm } from './JoinLeagueForm'
import { JoinLeagueCard } from './JoinLeagueCard'
import { LeagueCard } from './LeagueCard'
import { Info, Trophy } from 'lucide-react'
import { toast } from 'sonner'
import type { League } from '@/payload-types'
import { Link } from '@/i18n/routing'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { PageLayout } from '@/components/layout/PageLayout'
import { PageHeader } from '@/components/layout/PageHeader'

interface LeaguesViewProps {
  ownedLeagues: League[]
  joinedLeagues: League[]
  competitionId: string
  userId: string
  userPlan: 'free' | 'pro' | 'vip'
}

export function LeaguesView({
  ownedLeagues,
  joinedLeagues,
  competitionId,
  userId,
  userPlan,
}: LeaguesViewProps) {
  const t = useTranslations('Leagues')
  const params = useParams()
  const slug = params.slug as string



  // Combine and sort leagues
  const allLeagues = [...ownedLeagues, ...joinedLeagues].sort((a, b) =>
    a.name.localeCompare(b.name),
  )
  const allLeaguesCount = allLeagues.length

  return (
    <PageLayout>
      {/* Header Section */}
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            {t('title')}
            <span className="text-warning text-sm bg-warning/10 px-2 py-0.5 rounded-full border border-warning/20 md:hidden">
              {allLeaguesCount}
            </span>
          </div>
        }
        description="Súťaž s kamošmi a vyhraj to!"
        hideDescriptionOnMobile
      >
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link href={'/rules/minileagues' as any} className="block">
            <Button variant="ghost" className="text-white/40 hover:text-white" size="icon">
              <Info className="w-4 h-4" />
            </Button>
          </Link>
          <CreateLeagueForm competitionId={competitionId} userPlan={userPlan} />
        </div>
      </PageHeader>

      {/* Main Grid Layout */}
      <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8">
        {/* Left Side: Leagues List */}
        <div className="lg:col-span-3 order-1">
          <IceGlassCard className="h-full" backdropBlur="md">
            <div className="p-6 sm:p-8">
              {allLeagues.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="w-12 h-12 text-white/5 mx-auto mb-4" />
                  <p className="text-white/40 italic text-sm mb-2">{t('no_leagues_joined')}</p>
                  <div className="text-white/20 text-xs max-w-xs mx-auto">
                    Vytvor si vlastnú alebo sa pridaj kamošom pomocou kódu!
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allLeagues.map((league) => (
                    <LeagueCard key={league.id} league={league} userId={userId} slug={slug} />
                  ))}
                </div>
              )}
            </div>
          </IceGlassCard>
        </div>

        {/* Right Side: Join Card (Desktop) */}
        <div className="lg:col-span-1 order-2">
          <JoinLeagueCard /> 
        </div>
      </div>
    </PageLayout>
  )
}
