'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { toast } from 'sonner'
import { Crown, MessageCircle, Info, Users } from 'lucide-react'
import { BackLink } from '@/components/ui/BackLink'
import type { League, User } from '@/payload-types'
import { deleteLeague, removeMember, approveMember, rejectMember, transferOwnership } from '@/actions/leagues'
import type { LeaderboardEntry as PayloadLeaderboardEntry } from '@/payload-types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/Dialog'
import { LeagueActionDialog } from './LeagueActionDialog'
import { Button } from '@/components/ui/Button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { REFRESH_INTERVALS } from '@/lib/constants'
import { LeagueRankingTab } from './LeagueRankingTab'
import { LeagueCabinTab } from './LeagueCabinTab'
import { LeagueOfficeTab } from './LeagueOfficeTab'

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
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // URL sync state
  const activeTab = searchParams.get('tab') || 'members'
  
  // Real-time updates (SWR-like behavior)
  useEffect(() => {
    const onFocus = () => {
      router.refresh()
    }

    // Refresh on focus
    window.addEventListener('focus', onFocus)
    
    // Also poll every 5 minutes (300s) to keep requests fresh if user is just staring at screen
    const interval = setInterval(() => {
        if (document.hasFocus()) {
            router.refresh()
        }
    }, REFRESH_INTERVALS.FIVE_MINUTES)

    return () => {
        window.removeEventListener('focus', onFocus)
        clearInterval(interval)
    }
  }, [router])
  
  const [isDeleting, setIsDeleting] = useState(false)

  // Actions states
  const [memberToAction, setMemberToAction] = useState<string | null>(null)
  const [actionType, setActionType] = useState<'kick' | 'transfer' | null>(null)

  const isOwner = (league.owner as User)?.id === currentUser.id || league.owner === currentUser.id

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleTabChange = (value: string) => {
      // Create new URL
      const queryString = createQueryString('tab', value)
      // Use replace to update URL without adding to history stack (smoother tab behavior)
      // scroll: false prevents jumping to top
      router.replace(`${pathname}?${queryString}`, { scroll: false })
  }

  const handleDeleteLeague = async () => {
    setIsDeleting(true)
    try {
      const res = await deleteLeague(league.id)
      if (res.success) {
        toast.success('Liga bola zrušená')
        router.push(`/dashboard/${competitionSlug}/leagues`)
      } else {
        toast.error(res.error)
      }
    } catch (error) {
      toast.error('Chyba pri mazaní ligy')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleKickMember = async () => {
    if (!memberToAction) return
    try {
      const res = await removeMember(league.id, memberToAction)
      if (res.success) {
        toast.success('Hráč bol odstránený')
        setMemberToAction(null)
        setActionType(null)
        router.refresh()
      } else {
        toast.error(res.error)
      }
    } catch (error) {
      toast.error('Chyba pri odstraňovaní')
    }
  }

  const handleTransferOwnership = async () => {
     if (!memberToAction) return
     try {
       const res = await transferOwnership(league.id, memberToAction)
       if (res.success) {
         toast.success('Vlastníctvo ligy bolo presunuté')
         setMemberToAction(null)
         setActionType(null)
         router.refresh()
       } else {
         toast.error(res.error)
       }
     } catch (error) {
       toast.error('Chyba pri presune')
     }
  }

  const handleApprove = async (userId: string) => {
    const res = await approveMember(league.id, userId)
    if (res.success) {
      toast.success('Hráč prijatý')
      router.refresh()
    } else {
      toast.error(res.error)
    }
  }

  const handleReject = async (userId: string) => {
    const res = await rejectMember(league.id, userId)
    if (res.success) {
      toast.success('Žiadosť zamietnutá')
      router.refresh()
    } else {
      toast.error(res.error)
    }
  }

  const members = (league.members as User[]) || []
  const waitingList = (league.waitingList as User[]) || []
  const memberToActionUser = members.find((m) => m.id === memberToAction)



  return (
    <div className="h-[calc(100dvh-8rem)] md:h-[calc(100dvh-7rem)] flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col gap-4 mb-4 shrink-0 px-1">
        <div className="flex justify-between items-center">
             <BackLink href={`/dashboard/${competitionSlug}/leagues`} label={t('back_to_list')} /> 
             
             
             <Button
                variant="ghost"
                onClick={() => router.push('/dashboard/tipos-2025-2026/rules?tab=minileagues')}
                className="text-white hover:text-warning text-xs gap-1 cursor-pointer hover:bg-transparent font-bold tracking-wider"
             >
                <Info className="w-3 h-3" />
                {t('header_rules')}
             </Button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6 mt-2">
          <div className="flex items-center gap-5">
               <div className="w-14 h-14 rounded-full bg-gradient-to-br from-warning/20 to-black border border-warning/30 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(250,204,21,0.15)]">
                    <Crown className="w-7 h-7 text-warning drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
               </div>
               <div>
                   <h1 className="text-3xl md:text-5xl font-black uppercase text-warning tracking-tight drop-shadow-xl leading-none italic">
                     {league.name}
                   </h1>
                   <div className="flex items-center gap-4 mt-2">
                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full pl-2 pr-3 py-1">
                            <Users className="w-3.5 h-3.5 text-warning" />
                            <span className="text-white text-[10px] font-bold uppercase tracking-wider">
                                {t('header_members', { count: members.length, max: league.maxMembers })}
                            </span>
                        </div>
                   </div>
               </div>
          </div>


        </div>
      </div>

      {/* Tabs / Content */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 min-h-0 flex flex-col">
          <div className="px-1 mb-4">
              <TabsList className="bg-white/5 border border-white/10 p-1 backdrop-blur-md w-full grid grid-cols-3 h-auto">
                  <TabsTrigger 
                    value="members" 
                    className="data-[state=active]:bg-warning data-[state=active]:text-black text-white/50 text-[10px] sm:text-xs md:text-base px-1 sm:px-4 py-2 sm:py-2.5 uppercase font-black tracking-wider sm:tracking-widest cursor-pointer transition-all hover:text-white truncate"
                  >
                      {t('tabs.ranking')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="cabin" 
                    className="data-[state=active]:bg-warning data-[state=active]:text-black text-white/50 text-[10px] sm:text-xs md:text-base px-1 sm:px-4 py-2 sm:py-2.5 uppercase font-black tracking-wider sm:tracking-widest gap-1 sm:gap-2 cursor-pointer transition-all hover:text-white truncate"
                  >
                       {t('tabs.cabin')}
                       <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mb-0.5 hidden sm:inline-block" />
                  </TabsTrigger>
                  {isOwner && (
                      <TabsTrigger 
                        value="office" 
                        className="data-[state=active]:bg-warning data-[state=active]:text-black text-white/50 text-[10px] sm:text-xs md:text-sm px-1 sm:px-4 py-2 sm:py-2.5 uppercase font-bold tracking-wider sm:tracking-widest gap-1 sm:gap-2 cursor-pointer hover:text-white truncate"
                      >
                          {t('tabs.office')}
                          {waitingList.length > 0 && (
                            <span className="bg-destructive text-white text-[10px] px-1 rounded-full h-4 min-w-[16px] flex items-center justify-center">
                                {waitingList.length}
                            </span>
                          )}
                      </TabsTrigger>
                  )}
              </TabsList>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto pr-2 -mr-2">
              <TabsContent value="members" className="mt-0 space-y-6">
                 <LeagueRankingTab 
                    members={members}
                    leaderboardEntries={leaderboardEntries}
                    currentUser={currentUser}
                    league={league}
                    isOwner={isOwner}
                 />
              </TabsContent>

              <TabsContent value="cabin" className="mt-0">
                  <LeagueCabinTab />
              </TabsContent>

              <TabsContent value="office" className="mt-0">
                  <LeagueOfficeTab 
                    league={league}
                    members={members}
                    currentUser={currentUser}
                    waitingList={waitingList}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onAction={(memberId, action) => {
                        setMemberToAction(memberId)
                        setActionType(action)
                    }}
                    onDeleteLeague={handleDeleteLeague}
                    isDeleting={isDeleting}
                  />
              </TabsContent>
          </div>

      </Tabs>

      <LeagueActionDialog
        open={!!memberToAction && !!actionType}
        onOpenChange={(open) => !open && setMemberToAction(null)}
        type={actionType}
        memberName={memberToActionUser?.username || '...'}
        onConfirm={actionType === 'kick' ? handleKickMember : handleTransferOwnership}
      />
    </div>
  )
}
