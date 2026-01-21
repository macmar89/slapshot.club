'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Menu, Book, Settings } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/Button'
import { useTranslations } from 'next-intl'

import { LogoutButton } from '@/features/auth/components/LogoutButton'
import { Container } from '@/components/ui/Container'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/Sheet'
import { LanguageSwitcher } from './LanguageSwitcher'
import { usePathname } from 'next/navigation'

interface HeaderProps {
  title?: React.ReactNode
}

export function Header({ title }: HeaderProps) {
  const t = useTranslations('Lobby')
  const pathname = usePathname()
  const isDashboard = pathname?.includes('/dashboard')

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 border-b border-white/10 bg-black/20 backdrop-blur-md">
      <Container className="flex items-center h-full">
        <Link
          href="/lobby"
          className="text-xl font-bold text-white tracking-widest uppercase hover:opacity-80 transition-opacity group flex items-center gap-2"
        >
          {title || 'Slapshot Club'}
        </Link>

        {/* Desktop View */}
        <div className="ml-auto hidden md:flex items-center gap-6">
          {!isDashboard && (
            <>
              <Link href="/dashboard/rules">
                <Button
                  variant="ghost"
                  className="text-white/50 hover:text-white gap-2 text-xs uppercase tracking-widest font-bold"
                >
                  <Book className="w-4 h-4" />
                  {t('rules')}
                </Button>
              </Link>
              <div className="w-px h-6 bg-white/10" />
              <Link href="/dashboard/settings">
                <Button
                  variant="ghost"
                  className="text-white/50 hover:text-white gap-2 text-xs uppercase tracking-widest font-bold"
                >
                  <Settings className="w-4 h-4" />
                  {t('settings')}
                </Button>
              </Link>
            </>
          )}
          <LanguageSwitcher />
          <LogoutButton />
        </div>

        {/* Mobile View */}
        <div className="ml-auto md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="border-l border-white/10 bg-black/95 backdrop-blur-xl"
            >
              <div className="flex flex-col gap-6 mt-8">
                {!isDashboard && (
                  <>
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/dashboard/rules"
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Book className="w-5 h-5" />
                        <span className="font-bold uppercase tracking-widest text-sm">
                          {t('rules')}
                        </span>
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Settings className="w-5 h-5" />
                        <span className="font-bold uppercase tracking-widest text-sm">
                          {t('settings')}
                        </span>
                      </Link>
                    </div>
                    <div className="h-px bg-white/10" />
                  </>
                )}
                <div className="flex items-center gap-4">
                  <span className="text-white/70">Language</span>
                  <LanguageSwitcher />
                </div>
                <div className="h-px bg-white/10" />
                <LogoutButton />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  )
}
