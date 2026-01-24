'use client'

import React, { useState } from 'react'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Users, Copy, ArrowLeft, Trash2, UserX, Crown } from 'lucide-react'
import type { League, User } from '@/payload-types'
import { deleteLeague, removeMember } from '@/actions/leagues'
import type { LeaderboardEntry as PayloadLeaderboardEntry } from '@/payload-types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'

interface LeagueDetailViewProps {
  league: League
  currentUser: User
  competitionSlug: string
  leaderboardEntries?: Record<string, PayloadLeaderboardEntry>
}

export function LeagueDetailView({
  league,
  currentUser,
  competitionSlug,
  leaderboardEntries,
}: LeagueDetailViewProps) {
  const t = useTranslations('Leagues')
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  // Dialog states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [memberToKick, setMemberToKick] = useState<string | null>(null)

  const isOwner = (league.owner as User)?.id === currentUser.id || league.owner === currentUser.id

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(t('copied'))
    } catch (err) {
      toast.error('Failed to copy')
    }
  }

  const handleDeleteLeague = async () => {
    setIsDeleting(true)
    try {
      const res = await deleteLeague(league.id)
      if (res.success) {
        toast.success(t('league_deleted'))
        setIsDeleteOpen(false)
        router.push({
          pathname: '/dashboard/[slug]/leagues',
          params: { slug: competitionSlug },
        })
      } else {
        toast.error(res.error)
      }
    } catch (error) {
      toast.error(t('delete_error'))
    } finally {
      setIsDeleting(false)
    }
  }

  const handleRemoveMember = async () => {
    if (!memberToKick) return

    try {
      const res = await removeMember(league.id, memberToKick)
      if (res.success) {
        toast.success(t('member_removed'))
        setMemberToKick(null) // Close dialog
        router.refresh()
      } else {
        toast.error(res.error)
      }
    } catch (error) {
      toast.error(t('kick_error'))
    }
  }

  const members = (league.members as User[]) || []
  const memberToKickUser = members.find((m) => m.id === memberToKick)

  return (
    <div className="h-[calc(100dvh-8rem)] md:h-[calc(100dvh-7rem)] flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col gap-4 mb-6 shrink-0 px-1">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors self-start text-sm uppercase tracking-wider font-bold h-auto p-0"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('back_to_list')}
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl md:text-4xl font-black uppercase text-white tracking-tight drop-shadow-lg flex items-center gap-3">
            {league.name}
            {isOwner && <Crown className="w-6 h-6 text-warning" />}
          </h1>

          {isOwner && (
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
              <DialogTrigger asChild>
                <Button
                  disabled={isDeleting}
                  variant="outline"
                  color="destructive"
                  className="bg-destructive/10 hover:bg-destructive/20 text-destructive border-destructive/20 gap-2 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                  {t('delete_league')}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black/95 border-white/10 text-white backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle>{t('delete_confirm_title')}</DialogTitle>
                  <DialogDescription className="text-white/60">
                    {t('delete_confirm_desc')}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      className="bg-white/5 border-white/10 hover:bg-white/10"
                    >
                      {t('cancel')}
                    </Button>
                  </DialogClose>
                  <Button onClick={handleDeleteLeague} disabled={isDeleting} color="destructive">
                    {isDeleting ? t('deleting') : t('delete_confirm_action')}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 -mr-2 space-y-6">
        {/* Info Card */}
        <IceGlassCard className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="text-xs text-white/40 uppercase tracking-wider mb-2 font-bold">
                {t('invite_code')}
              </div>
              <Button
                variant="ghost"
                onClick={() => copyToClipboard(league.code || '')}
                className="w-full flex items-center justify-between bg-black/40 hover:bg-black/60 p-3 h-auto rounded-app border border-dashed border-white/20 hover:border-warning/50 transition-all group/btn"
              >
                <span className="font-mono text-warning text-xl tracking-widest pl-2">
                  {league.code}
                </span>
                <Copy className="w-5 h-5 text-white/40 group-hover/btn:text-white transition-colors" />
              </Button>
            </div>
            <div>
              <div className="text-xs text-white/40 uppercase tracking-wider mb-2 font-bold">
                {t('stats')}
              </div>
              <div className="flex items-center gap-4 p-3 rounded-app bg-white/5 border border-white/10">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-white/70" />
                  <div className="flex flex-col">
                    <span className="text-lg font-bold leading-none">{members.length}</span>
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">
                      {t('members_count', { count: members.length })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </IceGlassCard>

        {/* Members List / Rankings */}
        <div>
          <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-warning" />
            {t('members_list')}
          </h2>

          <IceGlassCard className="overflow-hidden p-0">
            {/* Header */}
            <div className="grid grid-cols-[30px_1fr_60px_40px] md:grid-cols-[40px_1fr_80px_60px_60px_60px_100px] gap-2 md:gap-4 px-4 py-3 bg-white/[0.03] border-b border-white/10">
              <span className="text-[10px] font-black uppercase text-warning tracking-widest">
                #
              </span>
              <span className="text-[10px] font-black uppercase text-white/30 tracking-widest text-left">
                {t('member')}
              </span>
              <span className="text-[10px] font-black uppercase text-white/30 tracking-widest text-right">
                {t('points')}
              </span>
              {/* Desktop additional columns */}
              <span className="text-[10px] font-black uppercase text-white/30 tracking-widest text-right hidden md:block">
                Tipy
              </span>
              <span className="text-[10px] font-black uppercase text-white/30 tracking-widest text-right hidden md:block">
                Presné
              </span>
              <span className="text-[10px] font-black uppercase text-white/30 tracking-widest text-right hidden md:block">
                Víťaz
              </span>
              <span className="text-[10px] font-black uppercase text-white/30 tracking-widest text-right">
                {/* Actions placeholder on desktop */}
              </span>
            </div>

            <div className="divide-y divide-white/5">
              {members
                .map((member) => {
                  const entry = leaderboardEntries?.[member.id]
                  return {
                    member,
                    points: entry?.totalPoints || 0,
                    entry,
                  }
                })
                .sort((a, b) => b.points - a.points)
                .map(({ member, points, entry }, index) => (
                  <div
                    key={member.id}
                    className={cn(
                      'grid grid-cols-[30px_1fr_60px_40px] md:grid-cols-[40px_1fr_80px_60px_60px_60px_100px] items-center gap-2 md:gap-4 px-4 py-3 hover:bg-white/5 transition-colors',
                      member.id === currentUser.id ? 'bg-warning/5' : 'bg-transparent',
                    )}
                  >
                    {/* Rank */}
                    <div className="flex justify-center">
                      <span
                        className={cn(
                          'text-xs font-black italic',
                          index === 0 ? 'text-warning text-lg' : 'text-white/40',
                        )}
                      >
                        {index === 0
                          ? '🥇'
                          : index === 1
                            ? '🥈'
                            : index === 2
                              ? '🥉'
                              : `#${index + 1}`}
                      </span>
                    </div>

                    {/* Member Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-[10px] font-bold ring-1 ring-white/10 text-white shrink-0">
                        {member.email?.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span
                          className={cn(
                            'font-bold text-sm truncate',
                            member.id === currentUser.id ? 'text-warning' : 'text-white',
                          )}
                        >
                          {member.username || member.email}
                          {(league.owner as User)?.id === member.id && (
                            <Crown className="inline-block ml-1 w-3 h-3 text-warning/60" />
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Points */}
                    <div className="text-right">
                      <span className="text-sm md:text-base font-black text-warning italic tracking-tighter">
                        {points}
                      </span>
                    </div>

                    {/* Desktop Stats */}
                    <span className="text-xs font-bold text-white/40 text-right hidden md:block">
                      {entry?.totalMatches || 0}
                    </span>
                    <span className="text-xs font-bold text-warning/60 text-right hidden md:block">
                      {entry?.exactGuesses || 0}
                    </span>
                    <span className="text-xs font-bold text-emerald-500/60 text-right hidden md:block">
                      {entry?.correctTrends || 0}
                    </span>

                    {/* Actions */}
                    <div className="flex justify-end pr-1">
                      {isOwner && member.id !== currentUser.id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setMemberToKick(member.id)}
                          className="text-white/30 hover:text-destructive hover:bg-destructive/10 h-7 w-7"
                          title={t('kick_member')}
                        >
                          <UserX className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </IceGlassCard>
        </div>
      </div>

      {/* Kick Member Confirmation Dialog */}
      <Dialog open={!!memberToKick} onOpenChange={(open) => !open && setMemberToKick(null)}>
        <DialogContent className="bg-black/95 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>{t('kick_confirm_title')}</DialogTitle>
            <DialogDescription className="text-white/60">
              {t('kick_confirm_desc', {
                name: memberToKickUser?.username || memberToKickUser?.email || '',
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10">
                {t('cancel')}
              </Button>
            </DialogClose>
            <Button onClick={handleRemoveMember} color="destructive">
              {t('kick_confirm_action')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
