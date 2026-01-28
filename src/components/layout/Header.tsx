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
  User as UserIcon,
  Calendar,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/Button'
import { useTranslations, useLocale } from 'next-intl'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { logoutUser, getCurrentUser } from '@/features/auth/actions'
import { LogoutButton } from '@/features/auth/components/LogoutButton'
import { Container } from '@/components/ui/Container'
import { HockeyLoader } from '@/components/ui/HockeyLoader'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/Sheet'
import { format } from 'date-fns'
import { sk, enUS, cs } from 'date-fns/locale'
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
import { FeedbackModal } from '@/components/feedback/FeedbackModal'
import { MessageSquarePlus } from 'lucide-react'

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
  const locale = useLocale()
  const [user, setUser] = React.useState<any>(null)
  const [upcomingMatches, setUpcomingMatches] = React.useState<any[]>([])
  const [isProfileOpen, setIsProfileOpen] = React.useState(false)
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

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

  // Fetch User and Matches to tip
  React.useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch User
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      // 2. Fetch Matches to tip if slug is present
      if (slug && currentUser) {
        try {
          const { getMatchesAction } = await import('@/features/matches/actions')
          const { matches, userPredictions } = await getMatchesAction(slug)
          
          // Filter: Not finished, no prediction, and close in time
          const tippedMatchIds = new Set(userPredictions.map((p: any) => 
            typeof p.match === 'string' ? p.match : p.match.id
          ))
          
          const now = new Date()
          const toTip = matches
            .filter((m: any) => {
              const matchDate = new Date(m.date)
              return matchDate > now && !tippedMatchIds.has(m.id)
            })
            .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 5) // Just show top 5

          setUpcomingMatches(toTip)
        } catch (error) {
          console.error('Failed to fetch matches for drawer:', error)
        }
      }
    }
    fetchData()
  }, [slug, pathname]) // Re-fetch on path change to catch new tips

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

            {/* Profile Drawer Trigger */}
            <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="group flex items-center gap-3 px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-warning/20 border border-warning/30 flex items-center justify-center text-warning group-hover:bg-warning/30 transition-colors">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">
                    {user?.username || 'Účet'}
                  </span>
                  <ChevronDown className={cn("w-3 h-3 text-white/40 transition-transform", isProfileOpen && "rotate-180 text-warning")} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md bg-black/95 backdrop-blur-2xl border-l border-white/10 p-0 flex flex-col">
                <SheetHeader className="sr-only">
                  <SheetTitle>Užívateľské menu</SheetTitle>
                  <SheetDescription>Profil, nastavenia a feed zápasov.</SheetDescription>
                </SheetHeader>
                {/* Header Section */}
                <div className="p-8 border-b border-white/5 bg-gradient-to-b from-warning/10 to-transparent">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-app bg-warning/20 border border-warning/30 flex items-center justify-center shadow-[0_0_20px_-5px_rgba(var(--warning-rgb),0.4)]">
                        <UserIcon className="w-8 h-8 text-warning" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{user?.username || 'Hosť'}</h3>
                        <p className="text-white/40 text-xs font-medium uppercase tracking-widest">{user?.email}</p>
                      </div>
                    </div>
                    <LanguageSwitcher />
                  </div>
                </div>

                {/* Match Feed Section */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-2">
                       <Calendar className="w-3 h-3" />
                       Nezabudni natipovať
                    </h4>
                    {upcomingMatches.length > 0 && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-warning/20 text-warning font-black uppercase tracking-tighter">
                        {upcomingMatches.length} Zápasy
                      </span>
                    )}
                  </div>

                  {upcomingMatches.length > 0 ? (
                    <div className="grid gap-4">
                       {upcomingMatches.map((match) => (
                         <Link 
                            key={match.id} 
                            href={`/dashboard/${slug}/matches?matchId=${match.id}` as any}
                            onClick={() => setIsProfileOpen(false)}
                            className="group block p-4 rounded-app bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/10 transition-all"
                         >
                            <div className="flex items-center justify-between mb-3">
                               <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                                 {match.date ? format(new Date(match.date), 'EEEE, d. MMM HH:mm', { locale: locale === 'sk' ? sk : (locale === 'cs' ? cs : enUS) }) : ''}
                               </span>
                               <div className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
                            </div>
                            <div className="flex items-center justify-between gap-4">
                               <div className="flex-1 text-right truncate text-sm font-bold text-white/80">{match.homeTeam?.name}</div>
                               <div className="text-xs font-black text-warning italic">VS</div>
                               <div className="flex-1 text-left truncate text-sm font-bold text-white/80">{match.awayTeam?.name}</div>
                            </div>
                         </Link>
                       ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-6 rounded-app bg-white/[0.02] border border-dashed border-white/10 text-center">
                       <AlertTriangle className="w-8 h-8 text-white/10 mb-4" />
                       <p className="text-sm font-medium text-white/20 italic">
                         Skvelá práca! Máš natipované všetky nadchádzajúce zápasy.
                       </p>
                    </div>
                  )}
                </div>

                {/* Bottom Navigation */}
                <div className="p-8 border-t border-white/5 bg-black/40 mt-auto">
                    <div className="grid gap-2">
                       <Link 
                        href="/account" 
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 p-4 rounded-app bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all group"
                       >
                          <UserIcon className="w-5 h-5 group-hover:text-primary transition-colors" />
                          <span className="font-bold uppercase tracking-widest text-xs">Môj Účet</span>
                          <ChevronRight className="w-4 h-4 ml-auto opacity-20 group-hover:opacity-100 transition-all" />
                       </Link>
                       <Link 
                        href="/settings" 
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 p-4 rounded-app bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all group"
                       >
                          <Settings className="w-5 h-5 group-hover:text-primary transition-colors" />
                          <span className="font-bold uppercase tracking-widest text-xs">{t('settings')}</span>
                          <ChevronRight className="w-4 h-4 ml-auto opacity-20 group-hover:opacity-100 transition-all" />
                       </Link>
                    </div>

                    <div className="h-px bg-white/5 my-6" />

                    <div className="flex flex-col gap-4">
                       <FeedbackModal triggerClassName="w-full">
                           <div className="flex items-center gap-3 p-3 rounded-app bg-warning/10 border border-warning/20 text-warning hover:bg-warning/20 transition-all cursor-pointer">
                              <MessageSquarePlus className="w-4 h-4" />
                              <span className="font-black uppercase tracking-widest text-[10px]">Feedback</span>
                           </div>
                        </FeedbackModal>
                       
                       <div className="flex items-center justify-between">
                          <LogoutButton />
                          <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em] italic">SSC v1.0</span>
                       </div>
                    </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Mobile View */}
          <div className="ml-auto md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full bg-black/95 backdrop-blur-xl border-l border-white/10 p-0 flex flex-col"
              >
                <SheetHeader className="sr-only">
                  <SheetTitle>Mobilné menu</SheetTitle>
                  <SheetDescription>Profil, nastavenia a ligy.</SheetDescription>
                </SheetHeader>
                 {/* Reusing content */}
                 <div className="p-6 border-b border-white/5 bg-gradient-to-b from-primary/10 to-transparent">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-app bg-warning/20 border border-warning/30 flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-warning" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">{user?.username || 'Hosť'}</h3>
                        <p className="text-white/40 text-[10px] font-medium uppercase tracking-widest truncate max-w-[150px]">{user?.email}</p>
                      </div>
                    </div>
                    <LanguageSwitcher />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {/* League Switcher in Mobile Drawer */}
                  {slug && (
                    <div className="mb-8">
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3 block">Aktívna Liga</span>
                       <div className="grid grid-cols-1 gap-1">
                          <Button
                            variant="ghost"
                            onClick={() => { handleLeagueChange('global'); setIsMenuOpen(false); }}
                            className={cn(
                              'justify-start text-[10px] font-black uppercase tracking-widest h-10 px-4 rounded-lg transition-all',
                              !effectiveLeagueId
                                ? 'bg-warning text-black shadow-[0_0_15px_-5px_rgba(var(--warning-rgb),0.6)]'
                                : 'text-white/40 hover:text-white hover:bg-white/5',
                            )}
                          >
                            Globálna
                          </Button>
                          {leagues.map((league) => (
                            <Button
                              key={league.id}
                              variant="ghost"
                              onClick={() => { handleLeagueChange(league.id); setIsMenuOpen(false); }}
                              className={cn(
                                'justify-start text-[10px] font-black uppercase tracking-widest h-10 px-4 rounded-lg transition-all',
                                effectiveLeagueId === league.id
                                  ? 'bg-warning text-black shadow-[0_0_15px_-5px_rgba(var(--warning-rgb),0.6)]'
                                  : 'text-white/40 hover:text-white hover:bg-white/5',
                              )}
                            >
                              {league.name}
                            </Button>
                          ))}
                       </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-2">
                       Nezabudni natipovať
                    </h4>
                  </div>
                  
                  {upcomingMatches.length > 0 ? (
                    <div className="grid gap-3">
                       {upcomingMatches.map((match) => (
                         <Link 
                            key={match.id} 
                            href={`/dashboard/${slug}/matches?matchId=${match.id}` as any}
                            onClick={() => setIsMenuOpen(false)}
                            className="block p-3 rounded-app bg-white/5 border border-white/5"
                         >
                            <div className="flex items-center justify-between gap-3 text-xs font-bold text-white/70">
                               <div className="flex-1 text-right truncate">{match.homeTeam?.shortName || match.homeTeam?.name}</div>
                               <div className="text-[10px] font-black text-warning italic">VS</div>
                               <div className="flex-1 text-left truncate">{match.awayTeam?.shortName || match.awayTeam?.name}</div>
                            </div>
                         </Link>
                       ))}
                    </div>
                  ) : (
                    <p className="text-[10px] font-medium text-white/10 italic text-center py-4 bg-white/[0.01] rounded-app border border-dashed border-white/5">
                      Všetko natipované!
                    </p>
                  )}
                </div>

                <div className="p-6 border-t border-white/5 bg-black/40 mt-auto">
                    <div className="grid grid-cols-2 gap-2 mb-4">
                       <Link 
                        href="/account" 
                        onClick={() => setIsMenuOpen(false)}
                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-app bg-white/5 text-white/60"
                       >
                          <UserIcon className="w-5 h-5" />
                          <span className="font-bold uppercase tracking-widest text-[10px]">Účet</span>
                       </Link>
                       <Link 
                        href="/settings" 
                        onClick={() => setIsMenuOpen(false)}
                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-app bg-white/5 text-white/60"
                       >
                          <Settings className="w-5 h-5" />
                          <span className="font-bold uppercase tracking-widest text-[10px]">Nastavenia</span>
                       </Link>
                    </div>
                        <LogoutButton />

                     <div className="mt-4 pt-4 border-t border-white/5">
                        <FeedbackModal triggerClassName="w-full">
                           <div className="flex items-center justify-center gap-2 p-3 rounded-app bg-warning/10 border border-warning/20 text-warning hover:bg-warning/20 transition-all cursor-pointer">
                              <MessageSquarePlus className="w-4 h-4" />
                              <span className="font-black uppercase tracking-widest text-[10px]">Feedback</span>
                           </div>
                        </FeedbackModal>
                     </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </Container>
      </header>
    </>
  )
}
