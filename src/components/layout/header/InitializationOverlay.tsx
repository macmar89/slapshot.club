'use client'

import React from 'react'
import { HockeyLoader } from '@/components/ui/HockeyLoader'
import { useTranslations } from 'next-intl'

interface InitializationOverlayProps {
  isVisible: boolean
}

export function InitializationOverlay({ isVisible }: InitializationOverlayProps) {
  const t = useTranslations('Header')
  
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center transition-all duration-500">
      <HockeyLoader text={t('loading_league')} />
    </div>
  )
}
