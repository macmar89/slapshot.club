'use client'

import React, { useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import type { Competition } from '@/payload-types'
import { Trophy, Info, Target, CheckCircle2 } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { MiniLeagueRules } from './MiniLeagueRules'
import { PageLayout } from '@/components/layout/PageLayout'
import { PageHeader } from '@/components/layout/PageHeader'

interface RulesViewProps {
  competitions: Competition[]
}

export function RulesView({ competitions }: RulesViewProps) {
  const t = useTranslations('Rules')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // URL sync state
  const activeTab = searchParams.get('tab') || 'rules'

  const createQueryString = useCallback(
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
    <PageLayout>
      <PageHeader title={t('title')} description={t('description')} />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="px-1 mb-4">
          <TabsList className="bg-white/5 border border-white/10 p-1 backdrop-blur-md w-full grid grid-cols-2 h-auto">
            <TabsTrigger
              value="rules"
              className="data-[state=active]:bg-warning data-[state=active]:text-black text-white/50 text-[10px] sm:text-xs md:text-base px-1 sm:px-4 py-2 sm:py-2.5 uppercase font-black tracking-wider sm:tracking-widest cursor-pointer transition-all hover:text-white truncate"
            >
              {t('tabs_rules')}
            </TabsTrigger>
            <TabsTrigger
              value="minileagues"
              className="data-[state=active]:bg-warning data-[state=active]:text-black text-white/50 text-[10px] sm:text-xs md:text-base px-1 sm:px-4 py-2 sm:py-2.5 uppercase font-black tracking-wider sm:tracking-widest cursor-pointer transition-all hover:text-white truncate"
            >
              {t('tabs_minileagues')}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="rules" className="mt-0 space-y-8">
          {/* Scoring Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 px-1">
              <Trophy className="w-5 h-5 text-warning" />
              <h2 className="text-xl font-bold uppercase tracking-wider text-white">
                {t('scoring_title')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {competitions.length > 0 ? (
                competitions.map((comp) => (
                  <IceGlassCard key={comp.id} className="p-6 relative overflow-hidden group">
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-warning/5 rounded-full blur-2xl group-hover:bg-warning/10 transition-colors" />
                    <h3 className="text-lg font-black uppercase tracking-tight text-warning mb-4 break-words">
                      {comp.name}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-app bg-white/5 border border-white/10">
                        <div className="flex items-center gap-3">
                          <Target className="w-5 h-5 text-warning/70" />
                          <span className="text-sm font-bold text-white/80">
                            {t('exact_score')}
                          </span>
                        </div>
                        <span className="text-xl font-black text-white">
                          {t('points', { count: 5 })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-app bg-white/5 border border-white/10">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-warning/70" />
                          <span className="text-sm font-bold text-white/80">
                            {t('correct_diff')}
                          </span>
                        </div>
                        <span className="text-xl font-black text-white">
                          {t('points', { count: 3 })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-app bg-white/5 border border-white/10">
                        <div className="flex items-center gap-3">
                          <Info className="w-5 h-5 text-warning/70" />
                          <span className="text-sm font-bold text-white/80">
                            {t('winner_only')}
                          </span>
                        </div>
                        <span className="text-xl font-black text-white">
                          {t('points', { count: 2 })}
                        </span>
                      </div>
                    </div>
                  </IceGlassCard>
                ))
              ) : (
                <IceGlassCard className="col-span-full p-8 text-center text-white/40 italic">
                  {t('no_competitions')}
                </IceGlassCard>
              )}
            </div>
          </section>

          {/* General Rules Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 px-1">
              <Info className="w-5 h-5 text-warning" />
              <h2 className="text-xl font-bold uppercase tracking-wider text-white">
                {t('general_rules_title')}
              </h2>
            </div>

            <IceGlassCard className="p-6 md:p-8">
              <div className="space-y-6">
                {[
                  'tip_before',
                  'score_regular',
                  'exact_desc',
                  'diff_desc',
                  'winner_desc',
                  'evaluation',
                ].map((ruleKey) => (
                  <div key={ruleKey} className="flex gap-4 group">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-warning shrink-0 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                    <p className="text-sm md:text-base text-white/70 group-hover:text-white transition-colors leading-relaxed font-medium">
                      {t(`rules_list.${ruleKey}`)}
                    </p>
                  </div>
                ))}
              </div>
            </IceGlassCard>
          </section>
        </TabsContent>

        <TabsContent value="minileagues" className="mt-0">
          <MiniLeagueRules />
        </TabsContent>
      </Tabs>
    </PageLayout>
  )
}
