'use client'

import React from 'react'
import type { Competition } from '@/payload-types'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { Trophy, CalendarDays, Timer, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface DashboardViewProps {
  competition: Competition
  locale: string
}

export function DashboardView({ competition, locale }: DashboardViewProps) {
  const t = useTranslations('Dashboard')

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black uppercase text-white tracking-wide">
          {competition.name}
        </h1>
        <p className="text-white/60 text-lg max-w-2xl">{competition.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <IceGlassCard className="p-4 flex items-center gap-4">
          <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-500">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-white/50 font-bold mb-1">
              {t('status_label')}
            </div>
            <div
              className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide',
                competition.status === 'active'
                  ? 'bg-[#eab308]/20 text-[#eab308] border border-[#eab308]/20'
                  : 'bg-white/10 text-white/60 border border-white/10',
              )}
            >
              {competition.status}
            </div>
          </div>
        </IceGlassCard>

        <IceGlassCard className="p-4 flex items-center gap-4">
          <div className="p-2 rounded-lg bg-blue-500/20 text-blue-500">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-white/50 font-bold mb-1">
              {t('start_date')}
            </div>
            <div className="text-white font-medium">
              {new Date(competition.startDate).toLocaleDateString(locale)}
            </div>
          </div>
        </IceGlassCard>

        <IceGlassCard className="p-4 flex items-center gap-4">
          <div className="p-2 rounded-lg bg-purple-500/20 text-purple-500">
            <Timer className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-white/50 font-bold mb-1">
              {t('end_date')}
            </div>
            <div className="text-white font-medium">
              {new Date(competition.endDate).toLocaleDateString(locale)}
            </div>
          </div>
        </IceGlassCard>

        <IceGlassCard className="p-4 flex items-center gap-4">
          <div className="p-2 rounded-lg bg-green-500/20 text-green-500">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-white/50 font-bold mb-1">
              {t('teams_label')}
            </div>
            <div className="text-white font-medium">
              {/* Počet tímov bude zobrazený neskôr po implementácii vzťahov */}
              --
            </div>
          </div>
        </IceGlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <IceGlassCard className="md:col-span-2 p-6">
          <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">
            {t('overview')}
          </h2>
          <p className="text-white/70">{t('overview_placeholder')}</p>
        </IceGlassCard>

        <IceGlassCard className="p-6">
          <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">
            {t('notifications')}
          </h2>
          <p className="text-white/70 text-sm">{t('no_new_notifications')}</p>
        </IceGlassCard>
      </div>
    </div>
  )
}
