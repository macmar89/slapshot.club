'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { createLeague } from '@/actions/leagues'
import { toast } from 'sonner'
import { Plus, X, Loader2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function CreateLeagueForm({
  competitionId,
  userPlan,
}: {
  competitionId: string
  userPlan: 'free' | 'pro' | 'vip'
}) {
  const t = useTranslations('Leagues')
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  // Default to private, no option to change
  const type = 'private'

  const isFree = userPlan === 'free'

  const handleSubmit = async (e: React.FormEvent) => {
    if (isFree) return
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await createLeague({ name, type, competitionId })

      if (res.success) {
        toast.success(t('league_created') || 'Liga úspešne vytvorená')
        setIsOpen(false)
        setName('')
        router.refresh()
      } else {
        toast.error(res.error)
      }
    } catch (error) {
      toast.error(t('error_generic') || 'Nastala chyba')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} color="warning" className="gap-2">
        <Plus className="w-5 h-5" />
        {t('create_button')}
      </Button>
    )
  }

  // Enhanced modal using fixed positioning and IceGlassCard
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`w-full ${isFree ? 'max-w-md' : 'max-w-lg'} relative animate-in zoom-in-95 duration-300`}>
        <IceGlassCard className="p-0 overflow-hidden border-white/10" backdropBlur="lg">
          <div className={`${isFree ? 'p-8 sm:p-12' : 'p-8 sm:p-10'} relative min-h-[420px] flex flex-col`}>
            {/* Header - Always at the top */}
            <div className="flex justify-between items-center mb-8 relative z-30">
              {!isFree ? 
              <h2 className="text-2xl font-black text-white uppercase tracking-tight font-display italic">
                {t('create_modal.title')} 
              </h2>
              : <div />}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white/30 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Form Content - Centered if paid */}
            <div className={`flex-1 flex flex-col ${!isFree ? 'justify-center' : ''} relative z-10`}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-white/40 ml-1">
                    {t('create_modal.name_label')}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('create_modal.name_placeholder')}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-4 text-white placeholder:text-white/10 focus:outline-none focus:border-warning/50 focus:ring-1 focus:ring-warning/50 transition-all font-display text-lg"
                    required
                    disabled={isFree}
                    minLength={3}
                    maxLength={30}
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    className="text-white/40 hover:text-white uppercase font-bold tracking-widest text-xs"
                  >
                    {t('create_modal.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || isFree}
                    color="warning"
                    className="px-8 font-black uppercase tracking-widest"
                  >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    {isLoading ? t('create_modal.creating') : t('create_modal.submit')}
                  </Button>
                </div>
              </form>
            </div>

            {/* Premium Restriction Overlay */}
            {isFree && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
                <div className="absolute inset-0 bg-black/85 backdrop-blur-[32px] sm:backdrop-blur-[45px]" />
                
                <div className="relative z-30 flex flex-col items-center max-w-[280px] mx-auto">
                  <div className="relative mb-8 transform-gpu">
                    <div className="absolute -inset-12 bg-warning/20 rounded-full blur-[60px] animate-pulse" />
                    <div className="relative bg-black/60 p-5 rounded-full border border-warning/40 shadow-[0_0_50px_rgba(234,179,8,0.2)]">
                      <Lock className="w-10 h-10 text-warning" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-3 italic leading-tight drop-shadow-2xl">
                    {t('create_modal.premium_title')}
                  </h3>
                  
                  <p className="text-white/60 text-sm mb-10 leading-relaxed font-bold uppercase tracking-tight">
                    {t('create_modal.premium_description')}
                  </p>

                  <Link href={'/account' as any} className="w-full">
                    <Button 
                      color="warning" 
                      className="w-full py-7 text-xs font-black uppercase tracking-[0.2em] shadow-[0_4px_20px_rgba(234,179,8,0.3)] hover:shadow-[0_8px_40px_rgba(234,179,8,0.5)] transition-all transform hover:scale-[1.03] active:scale-[0.97]"
                    >
                      {t('create_modal.upgrade_button')}
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </IceGlassCard>
      </div>
    </div>
  )
}
