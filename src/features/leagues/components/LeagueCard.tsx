'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Users, Copy, Crown } from 'lucide-react'
import { toast } from 'sonner'
import type { League } from '@/payload-types'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/Button'

interface LeagueCardProps {
  league: League
  userId: string
  slug: string
}

export function LeagueCard({ league, userId, slug }: LeagueCardProps) {
  const t = useTranslations('Leagues')

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

  const isOwner =
    typeof league.owner === 'object' ? league.owner.id === userId : league.owner === userId
  const memberCount = league.stats?.memberCount || league.members?.length || 0
  const waitingCount = league.waitingList?.length || 0
  const maxMembers = league.maxMembers || 20

  return (
    <div className="bg-white/5 border border-white/10 rounded-app p-5 h-full flex flex-col hover:border-warning/30 hover:bg-white/[0.08] transition-all duration-300 relative group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-black text-white group-hover:text-warning transition-colors truncate font-display tracking-tight uppercase leading-tight">
          {league.name}
        </h3>
        {isOwner && (
          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-warning/10 rounded text-[9px] text-warning border border-warning/20">
            <Crown className="w-2.5 h-2.5" />
            <span className="font-bold uppercase tracking-wider">{t('owner')}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider font-bold">
          <span className="text-white/30">{t('members_label')}</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-white/70">
              <Users className="w-3 h-3" />
              <span className="font-mono">{memberCount}</span>
            </div>
            {waitingCount > 0 && (
              <div className="text-warning flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-warning animate-pulse" />
                <span className="font-mono">{t('waiting_label', { count: waitingCount })}</span>
              </div>
            )}
          </div>
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-warning/50 rounded-full"
            style={{ width: `${Math.min((memberCount / maxMembers) * 100, 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-auto pt-4 flex flex-col gap-3">
        {isOwner && league.code && (
          <div className="flex justify-between items-center bg-black/40 px-3 py-2 rounded border border-white/5 group-hover:border-warning/20 transition-colors">
            <span className="font-mono text-warning text-xs tracking-widest">{league.code}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => copyToClipboard(e, league.code || '')}
              className="h-5 w-5 text-white/30 hover:text-white"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        )}
        <Link
          href={{
            pathname: '/dashboard/[slug]/leagues/[leagueId]',
            params: { slug, leagueId: league.id },
          }}
          className="w-full"
        >
          <Button
            variant="outline"
            className="w-full text-xs font-black uppercase tracking-widest border-white/10 group-hover:bg-warning group-hover:text-black group-hover:border-warning transition-all"
          >
            {t('detail') || 'Detail'}
          </Button>
        </Link>
      </div>
    </div>
  )
}
