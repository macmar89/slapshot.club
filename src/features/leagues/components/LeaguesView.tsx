'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { CreateLeagueForm } from './CreateLeagueForm'
import { JoinLeagueForm } from './JoinLeagueForm'
import { Users, Copy } from 'lucide-react'
import { toast } from 'sonner'
import type { League } from '@/payload-types'
import { Link } from '@/i18n/routing'
import { useParams } from 'next/navigation'

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

  return (
    <div className="h-[calc(100dvh-8rem)] md:h-[calc(100dvh-7rem)] flex flex-col overflow-hidden">
      {/* Fixed Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 shrink-0 px-1">
        <h1 className="text-lg md:text-3xl font-black uppercase text-[#eab308] md:text-white tracking-widest md:tracking-wide leading-none">
          {t('title')}
        </h1>
        <CreateLeagueForm competitionId={competitionId} />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 -mr-2">
        <div className="space-y-12 pb-8">
          {/* Owned Leagues Section */}
          <div>
            <div className="flex items-center gap-6 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#eab308]/50 to-transparent shadow-[0_0_10px_rgba(234,179,8,0.3)]" />
              <h2 className="text-lg md:text-xl font-black uppercase tracking-[0.2em] text-[#eab308] drop-shadow-[0_0_25px_rgba(234,179,8,0.8)] px-4">
                {t('owned_section')}
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#eab308]/50 to-transparent shadow-[0_0_10px_rgba(234,179,8,0.3)]" />
            </div>

            {ownedLeagues.length === 0 ? (
              <div className="text-center text-white/40 py-8 italic border border-white/5 rounded-lg bg-white/5">
                Nemáš vytvorené žiadne ligy.
              </div>
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
                    <IceGlassCard className="p-4 group-hover:border-[#eab308]/50 transition-colors duration-300 h-full flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-white group-hover:text-[#eab308] transition-colors truncate font-display">
                          {league.name}
                        </h3>
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-full text-xs text-white/60">
                          <Users className="w-3 h-3" />
                          <span>{league.stats?.memberCount || 0}</span>
                        </div>
                      </div>

                      <div className="mt-auto pt-3 border-t border-white/10">
                        <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
                          Invite Code
                        </div>
                        <button
                          onClick={(e) => copyToClipboard(e, league.code || '')}
                          className="w-full flex items-center justify-between bg-black/40 hover:bg-black/60 p-1.5 rounded border border-dashed border-white/20 hover:border-[#eab308]/50 transition-all group/btn"
                        >
                          <span className="font-mono text-[#eab308] text-base tracking-widest pl-1">
                            {league.code}
                          </span>
                          <Copy className="w-3 h-3 text-white/40 group-hover/btn:text-white transition-colors" />
                        </button>
                      </div>
                    </IceGlassCard>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Joined Leagues Section */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/30">
                {t('joined_section')}
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {joinedLeagues.map((league) => (
                <Link
                  key={league.id}
                  href={{
                    pathname: '/dashboard/[slug]/leagues/[leagueId]',
                    params: { slug, leagueId: league.id },
                  }}
                  className="block opacity-80 hover:opacity-100 transition-opacity"
                >
                  <IceGlassCard className="p-4 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-base font-bold text-white">{league.name}</h3>
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-full text-xs text-white/60">
                        <Users className="w-3 h-3" />
                        <span>{league.stats?.memberCount || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-auto">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded border ${league.type === 'private' ? 'border-yellow-500/20 text-yellow-500 bg-yellow-500/5' : 'border-blue-500/20 text-blue-500 bg-blue-500/5'}`}
                      >
                        {league.type === 'private' ? 'Private' : 'Public'}
                      </span>
                    </div>
                  </IceGlassCard>
                </Link>
              ))}
            </div>
          </div>

          {/* Join Section */}
          <div className="max-w-2xl mx-auto pb-4">
            <JoinLeagueForm />
          </div>
        </div>
      </div>
    </div>
  )
}
