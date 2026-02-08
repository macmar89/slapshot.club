import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { Users, Check, X, Copy, Trash2, UserX, Crown, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { User, League } from '@/payload-types'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/Dialog'

interface LeagueOfficeTabProps {
  league: League
  members: User[]
  waitingList: User[]
  currentUser: User
  onApprove: (userId: string) => void
  onReject: (userId: string) => void
  onAction: (memberId: string, action: 'kick' | 'transfer') => void
  onDeleteLeague: () => void
  isDeleting: boolean
}

export function LeagueOfficeTab({ 
  league,
  members,
  waitingList, 
  currentUser,
  onApprove, 
  onReject,
  onAction,
  onDeleteLeague,
  isDeleting
}: LeagueOfficeTabProps) {
  const t = useTranslations('Leagues')
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(t('copied'))
    } catch (err) {
      toast.error('Failed to copy')
    }
  }

  // Role helper
  const getMemberRole = (user: User) => {
    const ownerId = (league.owner as User)?.id || league.owner
    if (ownerId === user.id) return { label: 'C', color: 'text-warning', icon: Crown }
    
    // Check subscription for Assistant
    if (user.subscription?.plan === 'pro' || user.subscription?.plan === 'vip') {
      return { label: 'A', color: 'text-blue-400', icon: Shield }
    }
    
    return null
  }

  // Merge lists: Waiting list first, then Members
  const mergedList = [
    ...waitingList.map(u => ({ user: u, status: 'pending' as const })),
    ...members.map(u => ({ user: u, status: 'active' as const }))
  ]

  return (
    <>
    <IceGlassCard className="p-0 overflow-hidden border-white/10 shadow-xl space-y-0" backdropBlur='lg'>
        <div className="p-4 md:p-6 grid grid-cols-[1fr_auto] md:grid-cols-2 lg:grid-cols-3 gap-4 items-center border-b border-white/10 bg-white/[0.02]">
             {/* Invite Code */}
             <div className="flex flex-col gap-1 md:gap-2">
                 <span className="text-[10px] md:text-xs text-white/40 font-bold uppercase tracking-wider">{t('invite_code')}</span>
                 <div className="flex items-center gap-2">
                     <span className="text-lg md:text-2xl font-mono text-warning font-bold tracking-wider">{league.code}</span>
                     <Button variant="ghost" size="icon" className="h-6 w-6 md:h-8 md:w-8 text-white/40 hover:text-white cursor-pointer" onClick={() => copyToClipboard(league.code || '')}>
                         <Copy className="w-3 h-3 md:w-4 md:h-4" />
                     </Button>
                 </div>
             </div>

             {/* Capacity - Hidden on mobile */}
             <div className="hidden md:flex flex-col gap-2">
                 <span className="text-xs text-white/40 font-bold uppercase tracking-wider">{t('capacity')}</span>
                 <div className="flex items-center gap-2 text-2xl font-bold text-white">
                     <span>{members.length}</span>
                     <span className="text-white/20">/</span>
                     <span className="text-white/40">{league.maxMembers}</span>
                 </div>
             </div>

             {/* Danger Zone */}
             <div className="flex justify-end md:justify-start lg:justify-end">
                  <Button 
                    variant="outline" 
                    color="destructive"
                    onClick={() => setIsDeleteOpen(true)}
                    disabled={isDeleting}
                    className="bg-destructive/10 hover:bg-destructive/20 text-destructive border-destructive/20 gap-2 shrink-0 cursor-pointer text-xs h-8 px-3"
                  >
                     <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                     <span className="hidden sm:inline">{isDeleting ? t('deleting_league') : t('delete_league_action')}</span>
                     <span className="sm:hidden">{t('delete_league_short')}</span>
                  </Button>
             </div>
        </div>

        {/* Merged Member List */}
        <div className="divide-y divide-white/5">
            {mergedList.length === 0 ? (
                <div className="p-8 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <Users className="w-5 h-5 text-white/20" />
                    </div>
                    <p className="text-white/30 text-sm italic">{t('no_members')}</p>
                </div>
            ) : (
                mergedList.map(({ user, status }) => {
                   const role = getMemberRole(user)
                   const isMe = user.id === currentUser.id
                   const isPending = status === 'pending'
                   
                   return (
                       <div 
                        key={user.id} 
                        className={cn(
                            "p-4 flex items-center justify-between transition-colors",
                            isPending ? "bg-warning/5 hover:bg-warning/10" : "hover:bg-white/[0.02]"
                        )}
                       >
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ring-1 text-white",
                                        isPending ? "bg-warning/20 ring-warning/30" : "bg-white/5 ring-white/10"
                                    )}>
                                        {user.email?.slice(0, 2).toUpperCase()}
                                    </div>
                                    {role && !isPending && (
                                        <div className={cn("absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-black border border-white/10 flex items-center justify-center text-[10px] font-bold", role.color)}>
                                            {role.label}
                                        </div>
                                    )}
                                    {isPending && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-warning border border-black flex items-center justify-center text-[10px] font-bold text-black animate-pulse">
                                            !
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className={cn("font-bold text-sm", isMe ? "text-warning" : "text-white")}>
                                        {user.username || user.email}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-white/40 uppercase tracking-wider">
                                            {isPending ? t('pending_status') : (role ? (role.label === 'C' ? t('captain') : t('assistant')) : t('member'))}
                                        </span>
                                        <span className="text-[10px] text-white/20 uppercase tracking-wider border-l border-white/10 pl-2">
                                            {user.subscription?.plan || 'Free'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                {isPending ? (
                                    <>
                                       <Button size="icon" className="h-8 w-8 bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/40 border border-emerald-500/30 cursor-pointer" onClick={() => onApprove(user.id)} title={t('approve')}>
                                           <Check className="w-4 h-4" />
                                       </Button>
                                       <Button size="icon" className="h-8 w-8 bg-destructive/20 text-destructive hover:bg-destructive/40 border border-destructive/30 cursor-pointer" onClick={() => onReject(user.id)} title={t('reject')}>
                                           <X className="w-4 h-4" />
                                       </Button>
                                    </>
                                ) : (
                                    !isMe && (
                                        <>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => onAction(user.id, 'transfer')} 
                                                className="h-8 w-8 text-white/40 hover:text-warning hover:bg-warning/10 cursor-pointer" 
                                                title={t('make_captain_tooltip')}
                                            >
                                                <Crown className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => onAction(user.id, 'kick')} 
                                                className="h-8 w-8 text-white/40 hover:text-destructive hover:bg-destructive/10 cursor-pointer" 
                                                title={t('kick_tooltip')}
                                            >
                                                <UserX className="w-4 h-4" />
                                            </Button>
                                        </>
                                    )
                                )}
                            </div>
                       </div>
                   )
                })
            )}
        </div>
    </IceGlassCard>

    {/* Delete League Confirmation Dialog */}
    <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-black/95 border-white/10 text-white backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>{t('delete_confirm_title')}</DialogTitle>
            <DialogDescription className="text-white/60">
              {t('delete_confirm_desc')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer">
                {t('cancel')}
              </Button>
            </DialogClose>
            <Button onClick={onDeleteLeague} disabled={isDeleting} color="destructive" className="cursor-pointer">
              {isDeleting ? t('deleting_league') : t('delete_confirm_done')}
            </Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  )
}
