'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import Image from 'next/image'
import cabinReferee from '@/assets/images/characters/cabin_referee_2.png'

export function LeagueCabinTab() {
  const t = useTranslations('Leagues')

  return (
    <IceGlassCard className="border border-white/10 bg-black/60 shadow-xl backdrop-blur-xl p-0 min-h-[300px] flex items-center justify-center">
      <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="relative w-48 h-48 mb-6">
              <Image 
                src={cabinReferee}
                alt={t('cabin.title')}
                fill
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 768px) 192px, 192px"
                priority
              />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">{t('cabin.title')}</h3>
          <p className="text-white/40 text-sm max-w-md leading-relaxed">
              {t('cabin.description')}
          </p>
      </div>
    </IceGlassCard>
  )
}
