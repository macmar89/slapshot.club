'use client'

import React from 'react'
import { useLocale } from 'next-intl'
import { routing, usePathname, useRouter } from '@/i18n/routing'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/Button'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggleLanguage = (newLocale: 'en' | 'sk') => {
    router.replace(pathname as any, { locale: newLocale, scroll: false })
  }

  return (
    <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-full backdrop-blur-md">
      {routing.locales.map((loc) => (
        <Button
          key={loc}
          onClick={() => toggleLanguage(loc as 'en' | 'sk')}
          variant={locale === loc ? 'solid' : 'ghost'}
          className={cn(
            'px-3 py-1 h-auto rounded-full text-[10px] font-bold uppercase tracking-wider transition-all',
            locale === loc
              ? 'bg-primary text-white shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]'
              : 'text-white/40 hover:text-white/70 hover:bg-white/5',
          )}
        >
          {loc}
        </Button>
      ))}
    </div>
  )
}
