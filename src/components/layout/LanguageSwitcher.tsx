'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { routing, usePathname, useRouter } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { Languages, ChevronDown, Check } from 'lucide-react'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const languages = [
    { code: 'sk', label: 'Slovenčina' },
    { code: 'en', label: 'English' },
    { code: 'cs', label: 'Čeština' },
  ]

  const toggleLanguage = (newLocale: string) => {
    router.replace(pathname as any, { locale: newLocale as any, scroll: false })
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentLang = languages.find((l) => l.code === locale) || languages[0]

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2.5 px-4 py-2 rounded-md transition-all duration-300',
          'bg-white/5 border border-white/10 backdrop-blur-md shadow-lg shadow-black/20',
          'hover:bg-white/10 hover:border-white/20 active:scale-95 group',
          isOpen && 'bg-white/15 border-white/30 ring-2 ring-warning/20',
        )}
      >
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-warning/20 border border-warning/30 group-hover:bg-warning/30 transition-colors">
          <Languages className="w-3 h-3 text-warning" />
        </div>
        <span className="text-sm font-black uppercase tracking-widest text-white/90 group-hover:text-white transition-colors">
          {currentLang.code}
        </span>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 text-white/40 transition-transform duration-300',
            isOpen && 'rotate-180 text-warning',
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-44 origin-top-right z-[100] animate-in fade-in zoom-in duration-200">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            {/* Top Shine/Bevel */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

            <div className="relative py-1.5">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => toggleLanguage(lang.code)}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3 text-sm transition-all duration-200',
                    'hover:bg-white/10 group',
                    locale === lang.code ? 'text-warning' : 'text-white/60 hover:text-white',
                  )}
                >
                  <span className="font-bold tracking-tight uppercase text-xs">{lang.label}</span>
                  {locale === lang.code && (
                    <div className="w-4 h-4 rounded-full bg-warning/10 flex items-center justify-center border border-warning/20 shadow-[0_0_10px_rgba(var(--warning-rgb),0.3)]">
                      <Check className="w-2.5 h-2.5 text-warning stroke-[3px]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
