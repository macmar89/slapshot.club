'use client'

import React from 'react'
import { Link } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import { getCurrentUser } from '@/features/auth/actions'
import { Container } from '@/components/ui/Container'
import { usePathname, useRouter, useSearchParams, useParams } from 'next/navigation'

// Sub-components
import { InitializationOverlay } from './header/InitializationOverlay'
import { LeagueSwitcher } from './header/LeagueSwitcher'
import { UserProfileDrawer } from './header/UserProfileDrawer'
import { MobileMenu } from './header/MobileMenu'

interface HeaderProps {
  title?: React.ReactNode
}

export function Header({ title }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const slug = params?.slug as string
  const locale = useLocale()
  
  const [user, setUser] = React.useState<any>(null)
  const [upcomingMatches, setUpcomingMatches] = React.useState<any[]>([])
  const [isProfileOpen, setIsProfileOpen] = React.useState(false)
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const [leagues, setLeagues] = React.useState<any[]>([])
  const [savedActiveLeagueId, setSavedActiveLeagueId] = React.useState<string | null>(null)
  const [isInitializing, setIsInitializing] = React.useState(true)

  // Fetch Leagues and set initial state
  React.useEffect(() => {
    const fetchLeagues = async () => {
      if (slug) {
        try {
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

  // Calculate the league ID to display: URL param takes precedence, fallback to saved state
  const effectiveLeagueId = searchParams.get('leagueId') || savedActiveLeagueId
  const selectedLeague = leagues.find((l) => l.id === effectiveLeagueId)

  return (
    <>
      <InitializationOverlay isVisible={!!(slug && isInitializing)} />

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
            <LeagueSwitcher
              slug={slug}
              effectiveLeagueId={effectiveLeagueId}
              selectedLeague={selectedLeague}
              leagues={leagues}
              onLeagueChange={handleLeagueChange}
            />

            <UserProfileDrawer
              user={user}
              isOpen={isProfileOpen}
              onOpenChange={setIsProfileOpen}
              upcomingMatches={upcomingMatches}
              slug={slug}
              locale={locale}
            />
          </div>

          {/* Mobile View */}
          <MobileMenu
            isOpen={isMenuOpen}
            onOpenChange={setIsMenuOpen}
            user={user}
            slug={slug}
            effectiveLeagueId={effectiveLeagueId}
            leagues={leagues}
            onLeagueChange={handleLeagueChange}
            upcomingMatches={upcomingMatches}
          />
        </Container>
      </header>
    </>
  )
}
