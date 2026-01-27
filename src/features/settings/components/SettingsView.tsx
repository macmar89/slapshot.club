'use client'

import React from 'react'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { useTranslations } from 'next-intl'

export function SettingsView() {
  const t = useTranslations('Dashboard.settings')

  return (
    <div className="w-full h-full p-6">
      <IceGlassCard className="p-8 h-full" allowOverflow>
        <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-widest">
          {t('title')}
        </h1>
        <div className="space-y-8">
          <section>
            <h2 className="text-sm font-bold text-white/40 uppercase tracking-[0.2em] mb-4">
              {t('language_section')}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-white/70">{t('current_language')}</span>
              <LanguageSwitcher />
            </div>
          </section>

          <section>
            <p className="text-white/70">{t('description')}</p>
          </section>
        </div>
      </IceGlassCard>
    </div>
  )
}
