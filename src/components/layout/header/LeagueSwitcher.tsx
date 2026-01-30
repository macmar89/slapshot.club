'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Users, Trophy, ChevronDown, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from '@/components/ui/Dialog'
import { useTranslations } from 'next-intl'

interface League {
  id: string
  name: string
}

interface LeagueSwitcherProps {
  slug: string
  effectiveLeagueId: string | null
  selectedLeague?: League
  leagues: League[]
  onLeagueChange: (leagueId: string | 'global') => void
}

export function LeagueSwitcher({
  slug,
  effectiveLeagueId,
  selectedLeague,
  leagues,
  onLeagueChange,
}: LeagueSwitcherProps) {
  const t = useTranslations('Header')

  if (!slug) return null

  return (
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
            {selectedLeague ? selectedLeague.name : t('global_league')}
          </span>
          <ChevronDown className="w-3 h-3 text-white/40 group-hover:text-white transition-colors" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/95 border-white/10 text-white backdrop-blur-xl max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase italic tracking-tighter text-[#eab308]">
            {t('select_league')}
          </DialogTitle>
          <DialogDescription className="text-white/40 font-medium">
            {t('select_league_desc')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          {/* Global Option */}
          <DialogClose asChild>
            <button
              onClick={() => onLeagueChange('global')}
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
                  {t('global_league')}
                </span>
              </div>
              {!effectiveLeagueId && <CheckCircle className="w-5 h-5 text-[#eab308]" />}
            </button>
          </DialogClose>

          {/* User Leagues */}
          {leagues.map((league) => (
            <DialogClose key={league.id} asChild>
              <button
                onClick={() => onLeagueChange(league.id)}
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
              {t('no_leagues')}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
