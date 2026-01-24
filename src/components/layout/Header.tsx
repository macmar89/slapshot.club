'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import {
  Menu,
  Book,
  Settings,
  Users,
  CheckCircle,
  ChevronDown,
  Trophy,
  Loader2,
} from 'lucide-react'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/Button'
import { useTranslations } from 'next-intl'

import { LogoutButton } from '@/features/auth/components/LogoutButton'
import { Container } from '@/components/ui/Container'
import { HockeyLoader } from '@/components/ui/HockeyLoader'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/Sheet'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from '@/components/ui/Dialog'

import { usePathname, useRouter, useSearchParams, useParams } from 'next/navigation'

interface HeaderProps {
  title?: React.ReactNode
}

export function Header({ title }: HeaderProps) {
  const t = useTranslations('Lobby')
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const slug = params?.slug as string
  const isDashboard = pathname?.includes('/dashboard')

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [leagues, setLeagues] = React.useState<any[]>([])
  const [savedActiveLeagueId, setSavedActiveLeagueId] = React.useState<string | null>(null)
  const [isInitializing, setIsInitializing] = React.useState(true)

  React.useEffect(() => {
    const fetchLeagues = async () => {
      if (slug) {
        try {
          // Keep initializing true until we have data
          setIsInitializing(true)
          const { getUserLeaguesForCompetition } = await import('@/features/leagues/actions')
          const { leagues: userLeagues, activeLeagueId } = await getUserLeaguesForCompetition(slug)

          setLeagues(userLeagues)
          setSavedActiveLeagueId(activeLeagueId)

          // Auto-select active league if no param is present on mount
          const currentLeagueParam = searchParams.get('leagueId')
          if (!currentLeagueParam && activeLeagueId) {
            const newParams = new URLSearchParams(searchParams.toString())
            newParams.set('leagueId', activeLeagueId)
            router.replace(`${pathname}?${newParams.toString()}`)
          }
        } catch (error) {
          console.error('Failed to fetch leagues:', error)
        } finally {
          // Small delay to prevent flash (optional, but smoother)
          setTimeout(() => setIsInitializing(false), 300)
        }
      } else {
        setIsInitializing(false)
      }
    }
    fetchLeagues()
  }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  // Restore active league when navigating (if URL param is dropped)
  React.useEffect(() => {
    // Only restore if we are not currently initializing (to avoid conflict with the mount logic)
    // AND we have a saved ID
    const currentLeagueParam = searchParams.get('leagueId')
    if (!isInitializing && !currentLeagueParam && savedActiveLeagueId) {
      const newParams = new URLSearchParams(searchParams.toString())
      newParams.set('leagueId', savedActiveLeagueId)
      router.replace(`${pathname}?${newParams.toString()}`)
    }
  }, [pathname, savedActiveLeagueId, searchParams, router, isInitializing])

  const handleLeagueChange = async (leagueId: string | 'global') => {
    // Update local state first
    const newValue = leagueId === 'global' ? null : leagueId
    setSavedActiveLeagueId(newValue)

    // Optimistic Update URL
    const newParams = new URLSearchParams(searchParams.toString())
    if (!newValue) {
      newParams.delete('leagueId')
    } else {
      newParams.set('leagueId', newValue)
    }
    router.push(`${pathname}?${newParams.toString()}`)

    // Persist to backend
    if (slug) {
      try {
        const { updateActiveLeagueAction } = await import('@/features/leagues/actions')
        await updateActiveLeagueAction(slug, newValue)
      } catch (err) {
        console.error('Failed to persist league preference', err)
      }
    }
  }

  // Calculate the league ID to display: URL param takes precedence, fallback to saved state (for navigation persistence)
  const effectiveLeagueId = searchParams.get('leagueId') || savedActiveLeagueId
  const selectedLeague = leagues.find((l) => l.id === effectiveLeagueId)

  return (
    <>
      {/* Initialization Loader Overlay */}
      {slug && isInitializing && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center transition-all duration-500">
          <HockeyLoader text="Načítavam ligu..." />
        </div>
      )}

      <header className="fixed top-0 left-0 right-0 h-16 z-50 border-b border-white/10 bg-black/20 backdrop-blur-md hidden md:block">
        <Container className="flex items-center h-full gap-4">
          <Link
            href="/lobby"
            className="text-xl font-bold text-white tracking-widest uppercase hover:opacity-80 transition-opacity group flex items-center gap-2 mr-4"
          >
            {title || 'Slapshot Club'}
          </Link>

          {/* Desktop View */}
          <div className="ml-auto hidden md:flex items-center gap-4">
            {/* League Switcher Modal */}
            {slug && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      'h-9 px-4 rounded-app border transition-all cursor-pointer group flex items-center gap-3',
                      effectiveLeagueId
                        ? 'bg-[#eab308]/10 border-[#eab308]/30 hover:bg-[#eab308]/20 shadow-[0_0_15px_-5px_rgba(234,179,8,0.3)]'
                        : 'bg-[#eab308]/5 border-[#eab308]/20 hover:bg-[#eab308]/10 text-[#eab308]/80',
                    )}
                  >
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center',
                        effectiveLeagueId ? 'bg-[#eab308] text-black' : 'bg-white/10 text-white/40',
                      )}
                    >
                      {effectiveLeagueId ? (
                        <Users className="w-3 h-3" />
                      ) : (
                        <Trophy className="w-3 h-3" />
                      )}
                    </div>
                    <span
                      className={cn(
                        'text-xs font-bold uppercase tracking-wider',
                        effectiveLeagueId ? 'text-[#eab308]' : 'text-white',
                      )}
                    >
                      {selectedLeague ? selectedLeague.name : 'Globálna'}
                    </span>
                    <ChevronDown className="w-3 h-3 text-white/40 group-hover:text-white transition-colors" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black/95 border-white/10 text-white backdrop-blur-xl max-w-sm">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-black uppercase italic tracking-tighter text-[#eab308]">
                      Vyber ligu
                    </DialogTitle>
                    <DialogDescription className="text-white/40 font-medium">
                      Zvoľ si rebríček, ktorý chceš sledovať.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-2 py-4">
                    {/* Global Option */}
                    <DialogClose asChild>
                      <button
                        onClick={() => handleLeagueChange('global')}
                        className={cn(
                          'flex items-center justify-between p-4 rounded-app border transition-all cursor-pointer group w-full',
                          !effectiveLeagueId
                            ? 'bg-[#eab308]/10 border-[#eab308]/30'
                            : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20',
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                              !effectiveLeagueId
                                ? 'bg-[#eab308] text-black'
                                : 'bg-white/10 text-white/40 group-hover:bg-[#eab308]/20 group-hover:text-[#eab308]',
                            )}
                          >
                            <Trophy className="w-4 h-4" />
                          </div>
                          <span
                            className={cn(
                              'font-bold tracking-tight uppercase text-sm',
                              !effectiveLeagueId ? 'text-[#eab308]' : 'text-white',
                            )}
                          >
                            Globálna Liga
                          </span>
                        </div>
                        {!effectiveLeagueId && <CheckCircle className="w-5 h-5 text-[#eab308]" />}
                      </button>
                    </DialogClose>

                    {/* User Leagues */}
                    {leagues.map((league) => (
                      <DialogClose key={league.id} asChild>
                        <button
                          onClick={() => handleLeagueChange(league.id)}
                          className={cn(
                            'flex items-center justify-between p-4 rounded-app border transition-all cursor-pointer group w-full',
                            effectiveLeagueId === league.id
                              ? 'bg-[#eab308]/10 border-[#eab308]/30'
                              : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20',
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                                effectiveLeagueId === league.id
                                  ? 'bg-[#eab308] text-black'
                                  : 'bg-white/10 text-white/40 group-hover:bg-[#eab308]/20 group-hover:text-[#eab308]',
                              )}
                            >
                              <Users className="w-4 h-4" />
                            </div>
                            <span
                              className={cn(
                                'font-bold tracking-tight text-sm',
                                effectiveLeagueId === league.id ? 'text-[#eab308]' : 'text-white',
                              )}
                            >
                              {league.name}
                            </span>
                          </div>
                          {effectiveLeagueId === league.id && (
                            <CheckCircle className="w-5 h-5 text-[#eab308]" />
                          )}
                        </button>
                      </DialogClose>
                    ))}

                    {leagues.length === 0 && (
                      <div className="text-center py-4 text-white/20 italic text-xs">
                        Zatiaľ nie si v žiadnej inej mini-lige.
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            )}

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
            {/** Language Switcher Removed */}
            <div className="scale-75 origin-right">
              <LogoutButton />
            </div>
          </div>

          {/* Mobile View */}
          <div className="ml-auto md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="border-l border-white/10 bg-black/95 backdrop-blur-xl"
              >
                <div className="flex flex-col gap-6 mt-8">
                  {/* Mobile League Switcher */}
                  {slug && (
                    <div className="flex flex-col gap-2 p-4 bg-white/5 rounded-app border border-white/10">
                      <span className="text-xs font-black uppercase tracking-widest text-white/40 mb-2">
                        Liga
                      </span>
                      <div className="grid grid-cols-1 gap-2">
                        <Button
                          variant="ghost"
                          onClick={() => handleLeagueChange('global')}
                          className={cn(
                            'justify-start text-xs font-bold uppercase tracking-wider',
                            !effectiveLeagueId
                              ? 'bg-[#eab308] text-black'
                              : 'text-white/60 bg-white/5',
                          )}
                        >
                          Globálna
                        </Button>
                        {leagues.map((league) => (
                          <Button
                            key={league.id}
                            variant="ghost"
                            onClick={() => handleLeagueChange(league.id)}
                            className={cn(
                              'justify-start text-xs font-bold uppercase tracking-wider',
                              effectiveLeagueId === league.id
                                ? 'bg-[#eab308] text-black'
                                : 'text-white/60 bg-white/5',
                            )}
                          >
                            {league.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {!isDashboard && (
                    <>
                      <div className="flex flex-col gap-2">
                        <Link
                          href="/dashboard/rules"
                          className="flex items-center gap-3 p-3 rounded-app bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Book className="w-5 h-5" />
                          <span className="font-bold uppercase tracking-widest text-sm">
                            {t('rules')}
                          </span>
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          className="flex items-center gap-3 p-3 rounded-app bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
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
                  {/** Language Switcher Removed */}
                  <LogoutButton />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </Container>
      </header>
    </>
  )
}
