'use client'

import React from 'react'
import { useTranslations } from 'next-intl'

export const AuthFooter = () => {
  const t = useTranslations('Login')

  return (
    <footer className="fixed bottom-0 left-0 w-full z-50 py-4 px-8 sm:px-12 lg:px-24 bg-slate-950/20 backdrop-blur-sm border-t border-white/5">
      <div className="max-w-[1920px] mx-auto flex justify-center sm:justify-end">
        <span className="text-white/30 text-[10px] sm:text-xs font-medium tracking-widest uppercase">
          {t('hero.footer')}
        </span>
      </div>
    </footer>
  )
}
