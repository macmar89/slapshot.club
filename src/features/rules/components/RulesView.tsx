'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import type { Competition } from '@/payload-types'
import { Trophy, Info, Target, CheckCircle2 } from 'lucide-react'
import { Container } from '@/components/ui/Container'

interface RulesViewProps {
  competitions: Competition[]
}

export function RulesView({ competitions }: RulesViewProps) {
  const t = useTranslations('Rules')

  return (
    <Container className="py-8 pb-24 md:pb-12 max-w-4xl">
      <div className="flex flex-col gap-2 mb-8 px-1">
        <h1 className="text-3xl md:text-5xl font-black italic uppercase text-white tracking-tighter leading-none">
          {t('title')}
        </h1>
        <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[0.65rem] md:text-xs">
          {t('description')}
        </p>
      </div>

      <div className="space-y-8 h-[calc(100vh-16rem)] overflow-y-auto pr-2 -mr-2 scrollbar-hide">
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
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-warning/70" />
                        <span className="text-sm font-bold text-white/80">{t('exact_score')}</span>
                      </div>
                      <span className="text-xl font-black text-white">
                        {t('points', { count: comp.scoringRules.exactScore })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-warning/70" />
                        <span className="text-sm font-bold text-white/80">{t('winner_only')}</span>
                      </div>
                      <span className="text-xl font-black text-white">
                        {t('points', { count: comp.scoringRules.winnerOnly })}
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
              {['tip_before', 'score_regular', 'exact_desc', 'winner_desc', 'evaluation'].map(
                (ruleKey) => (
                  <div key={ruleKey} className="flex gap-4 group">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-warning shrink-0 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                    <p className="text-sm md:text-base text-white/70 group-hover:text-white transition-colors leading-relaxed font-medium">
                      {t(`rules_list.${ruleKey}`)}
                    </p>
                  </div>
                ),
              )}
            </div>
          </IceGlassCard>
        </section>
      </div>
    </Container>
  )
}
