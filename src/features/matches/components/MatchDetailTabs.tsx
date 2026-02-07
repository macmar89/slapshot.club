'use client'

import React from 'react'
import type { Match, Prediction, Team } from '@/payload-types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Trophy, Users, TrendingUp, Target, BarChart3, AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { MatchInfoTab } from './MatchInfoTab'
import { MatchTipsTab } from './MatchTipsTab'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'

interface MatchDetailTabsProps {
  match: Match
  userPrediction?: Prediction
  statsData: {
    homeWin: number
    awayWin: number
    draw: number
    total: number
    exact: number
    diff: number
    trend: number
    wrong: number
  }
  homeTeam: Team
  awayTeam: Team
  totalTips: number
  homeWinPct: number
  awayWinPct: number
  binaryTotal: number
}

export function MatchDetailTabs({
  match,
  userPrediction,
  statsData,
  homeTeam,
  awayTeam,
  totalTips,
  homeWinPct,
  awayWinPct,
  binaryTotal,
}: MatchDetailTabsProps) {
  const t = useTranslations('Dashboard.matches')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeTab = searchParams.get('tab') || 'info'

  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams],
  )

  const handleTabChange = (value: string) => {
    const queryString = createQueryString('tab', value)
    router.replace(`${pathname}?${queryString}`, { scroll: false })
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <div className="sm:py-2 pb-2">
        <TabsList className="bg-white/5 border border-white/10 p-1 backdrop-blur-md w-full grid grid-cols-2 h-auto">
          <TabsTrigger
            value="info"
            className="data-[state=active]:bg-warning data-[state=active]:text-black text-white/50 text-[10px] sm:text-xs px-1 sm:px-4 py-2 sm:py-2.5 uppercase font-black tracking-widest cursor-pointer transition-all hover:text-white"
          >
            {t('info_tab')}
          </TabsTrigger>
          <TabsTrigger
            value="tips"
            className="data-[state=active]:bg-warning data-[state=active]:text-black text-white/50 text-[10px] sm:text-xs px-1 sm:px-4 py-2 sm:py-2.5 uppercase font-black tracking-widest cursor-pointer transition-all hover:text-white"
          >
            {t('tips_tab')}
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="info" className="p-0">
        <MatchInfoTab
          match={match}
          userPrediction={userPrediction}
          statsData={statsData}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          totalTips={totalTips}
          homeWinPct={homeWinPct}
          awayWinPct={awayWinPct}
          binaryTotal={binaryTotal}
        />
      </TabsContent>

      <TabsContent value="tips" className="p-0">
        <MatchTipsTab match={match} totalTips={totalTips} />
      </TabsContent>
    </Tabs>
  )
}
