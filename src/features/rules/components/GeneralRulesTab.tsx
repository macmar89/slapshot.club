'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import type { Competition } from '@/payload-types'
import { Trophy, Info, Target, CheckCircle2 } from 'lucide-react'

interface GeneralRulesTabProps {
  competitions: Competition[]
}

export function GeneralRulesTab({ competitions }: GeneralRulesTabProps) {
  const t = useTranslations('Rules')

  return (
    <div className="space-y-8">
      {/* Scoring Section */}
      <section className="space-y-4">
        <div className="w-full">
          <IceGlassCard className="p-4 md:p-6 relative overflow-hidden group">
            <div className="flex items-center gap-3 px-1 pb-6">
              <Trophy className="w-5 h-5 text-warning" />
              <h2 className="text-xl font-bold uppercase tracking-wider text-white">
                {t('scoring_title')}
              </h2>
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-warning/5 rounded-full blur-2xl group-hover:bg-warning/10 transition-colors" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div className="flex items-center justify-between md:flex-col md:justify-center md:text-center p-3 md:p-6 rounded-app bg-white/5 border border-white/10 md:gap-3">
                <div className="flex items-center gap-3 md:flex-col md:gap-2">
                  <Target className="w-5 h-5 text-warning/100" />
                  <span className="text-sm font-bold text-white/80 md:text-xs md:uppercase md:tracking-widest">
                    {t('exact_score')}
                  </span>
                </div>
                <span className="text-xl md:text-3xl font-black text-white">
                  {t('points', { count: 5 })}
                </span>
              </div>
              <div className="flex items-center justify-between md:flex-col md:justify-center md:text-center p-3 md:p-6 rounded-app bg-white/5 border border-white/10 md:gap-3">
                <div className="flex items-center gap-3 md:flex-col md:gap-2">
                  <CheckCircle2 className="w-5 h-5 text-warning/100" />
                  <span className="text-sm font-bold text-white/80 md:text-xs md:uppercase md:tracking-widest">
                    {t('correct_diff')}
                  </span>
                </div>
                <span className="text-xl md:text-3xl font-black text-white">
                  {t('points', { count: 3 })}
                </span>
              </div>
              <div className="flex items-center justify-between md:flex-col md:justify-center md:text-center p-3 md:p-6 rounded-app bg-white/5 border border-white/10 md:gap-3">
                <div className="flex items-center gap-3 md:flex-col md:gap-2">
                  <Info className="w-5 h-5 text-warning/100" />
                  <span className="text-sm font-bold text-white/80 md:text-xs md:uppercase md:tracking-widest">
                    {t('winner_only')}
                  </span>
                </div>
                <span className="text-xl md:text-3xl font-black text-white">
                  {t('points', { count: 2 })}
                </span>
              </div>
            </div>
          </IceGlassCard>
        </div>
      </section>

      {/* General Rules Section */}
      <section className="space-y-4">
        <IceGlassCard className="p-4 md:p-8">
          <div className="flex items-center gap-3 px-1 pb-4">
            <Info className="w-5 h-5 text-warning" />
            <h2 className="text-xl font-bold uppercase tracking-wider text-white">
              {t('general_rules_title')}
            </h2>
          </div>
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
    </div>
  )
}
