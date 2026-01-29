'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { CreateLeagueForm } from './CreateLeagueForm'
import { JoinLeagueForm } from './JoinLeagueForm'
import { Users, Copy, Info, Trophy, Crown, Shield } from 'lucide-react'
import { toast } from 'sonner'
import type { League } from '@/payload-types'
import { Link } from '@/i18n/routing'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface LeaguesViewProps {
  ownedLeagues: League[]
  joinedLeagues: League[]
  competitionId: string
}

export function LeaguesView({ ownedLeagues, joinedLeagues, competitionId }: LeaguesViewProps) {
  const t = useTranslations('Leagues')
  const params = useParams()
  const slug = params.slug as string

  const copyToClipboard = async (e: React.MouseEvent, text: string) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(text)
      toast.success(t('copied'))
    } catch (err) {
      toast.error('Failed to copy')
    }
  }

  // Combine count
  const allLeaguesCount = ownedLeagues.length + joinedLeagues.length

  return (
    <div className="h-[calc(100dvh-8rem)] md:h-[calc(100dvh-7rem)] flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 shrink-0 px-1">
        <div className="flex flex-col gap-1">
             <h1 className="text-xl md:text-3xl font-black uppercase text-white tracking-widest leading-none flex items-center gap-2">
               {t('title')}
               <span className="text-warning text-sm bg-warning/10 px-2 py-0.5 rounded-full border border-warning/20 md:hidden">{allLeaguesCount}</span>
             </h1>
             <p className="text-white/40 text-xs uppercase tracking-wider hidden md:block">
                 Súťaž s kamošmi a vyhraj to!
             </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
            <Link href={'/rules/minileagues' as any} className="block">
                <Button variant="ghost" className="text-white/40 hover:text-white" size="icon">
                    <Info className="w-4 h-4" />
                </Button>
            </Link>
            <CreateLeagueForm competitionId={competitionId} />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 -mr-2 pb-12 space-y-8">
          {/* Owned Leagues Section */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Trophy className="w-4 h-4 text-warning" />
              <h2 className="text-sm font-black uppercase tracking-widest text-white/50">
                {t('owned_section')}
              </h2>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {ownedLeagues.length === 0 ? (
              <IceGlassCard className="text-center py-8 border-dashed border-white/10 bg-white/[0.02]">
                <p className="text-white/40 italic text-sm mb-4">Nemáš vytvorené žiadne ligy.</p>
                <div className="text-white/20 text-xs max-w-xs mx-auto mb-4">
                   Vytvor ligu, pozvi kamošov a ukáž kto je tu Boss!
                </div>
              </IceGlassCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ownedLeagues.map((league) => (
                  <Link
                    key={league.id}
                    href={{
                      pathname: '/dashboard/[slug]/leagues/[leagueId]',
                      params: { slug, leagueId: league.id },
                    }}
                    className="block group"
                  >
                    <IceGlassCard className="p-0 h-full flex flex-col overflow-hidden hover:border-warning/30 transition-all duration-300 relative group-hover:bg-white/[0.07]">
                      {/* Card Header Pattern */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-warning/40 via-warning to-warning/40 opacity-50" />
                      
                      <div className="p-5 flex flex-col h-full">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-black text-white group-hover:text-warning transition-colors truncate font-display tracking-tight uppercase">
                              {league.name}
                            </h3>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/40 rounded text-[10px] text-warning border border-warning/20">
                              <Crown className="w-3 h-3" />
                              <span className="font-bold uppercase tracking-wider">Owner</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-white/60 mb-6">
                              <div className="flex items-center gap-1.5">
                                  <Users className="w-3.5 h-3.5" />
                                  <span className="font-mono font-bold text-white/80">{league.stats?.memberCount || 1}</span>
                              </div>
                              <div className="h-3 w-px bg-white/10" />
                              <div className="flex items-center gap-1.5">
                                  <span className="uppercase text-[9px] tracking-wider text-white/40">Kapacita</span>
                                  <span className="font-mono font-bold text-white/80">{(league.maxMembers || 0) + 0}</span>
                              </div>
                          </div>

                          <div className="mt-auto pt-4 border-t border-white/10">
                            <div className="flex justify-between items-center bg-black/30 p-2 rounded-lg border border-white/5 hover:border-white/20 transition-colors">
                                <span className="font-mono text-warning text-sm tracking-widest pl-2">
                                  {league.code}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => copyToClipboard(e, league.code || '')}
                                  className="h-6 w-6 text-white/30 hover:text-white"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                            </div>
                          </div>
                      </div>
                    </IceGlassCard>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Joined Leagues Section */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Shield className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-black uppercase tracking-widest text-white/50">
                {t('joined_section')}
              </h2>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {joinedLeagues.length === 0 && (
                <p className="text-white/30 text-sm italic pl-1">Zatiaľ nie si členom žiadnej inej ligy.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {joinedLeagues.map((league) => (
                <Link
                  key={league.id}
                  href={{
                    pathname: '/dashboard/[slug]/leagues/[leagueId]',
                    params: { slug, leagueId: league.id },
                  }}
                  className="block group opacity-90 hover:opacity-100 transition-opacity"
                >
                  <IceGlassCard className="p-5 h-full flex flex-col hover:bg-white/[0.07] transition-colors border-white/5 hover:border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-black text-white group-hover:text-blue-200 transition-colors uppercase tracking-tight">{league.name}</h3>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded text-[10px] text-white/60">
                        <Users className="w-3 h-3" />
                        <span>{league.stats?.memberCount || 0}</span>
                      </div>
                    </div>
                    <div className="mt-auto flex items-center gap-2">
                       <span className="text-[10px] text-white/30 uppercase tracking-widest">
                           {league.type === 'private' ? 'Súkromná liga' : 'Verejná liga'}
                       </span>
                    </div>
                  </IceGlassCard>
                </Link>
              ))}
            </div>
          </div>

          {/* Join Section */}
          <div className="max-w-xl mx-auto pt-8">
            <div className="bg-gradient-to-b from-white/5 to-transparent p-1 rounded-2xl border border-white/10">
                 <div className="bg-[#0a0a0a] rounded-xl p-6">
                     <h3 className="text-center text-warning font-black uppercase tracking-widest mb-2">Máš pozvánku?</h3>
                     <p className="text-center text-white/40 text-xs mb-6">Zadaj kód od kamoša a pridaj sa do partie.</p>
                     <JoinLeagueForm />
                 </div>
            </div>
          </div>
      </div>
    </div>
  )
}
