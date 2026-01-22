'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { createLeague } from '@/actions/leagues'
import { toast } from 'sonner'
import { Plus, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function CreateLeagueForm({ competitionId }: { competitionId: string }) {
  const t = useTranslations('Leagues')
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  // Default to private, no option to change
  const type = 'private'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await createLeague({ name, type, competitionId })

      if (res.success) {
        toast.success('Liga úspešne vytvorená') // Or t('success') later
        setIsOpen(false)
        setName('')
        router.refresh()
      } else {
        toast.error(res.error)
      }
    } catch (error) {
      toast.error('Nastala chyba')
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

  // Simple modal using fixed positioning and IceGlassCard
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md relative">
        <IceGlassCard className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">{t('create_modal.title')}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white/50 hover:text-white"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">
                {t('create_modal.name_label')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('create_modal.name_placeholder')}
                className="w-full bg-white/5 border border-white/10 rounded p-2 text-white placeholder:text-white/20 focus:outline-none focus:border-warning/50 focus:ring-1 focus:ring-warning/50 transition-all"
                required
                minLength={3}
                maxLength={30}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white"
              >
                {t('create_modal.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading} color="warning" className="gap-2">
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoading ? t('create_modal.creating') : t('create_modal.submit')}
              </Button>
            </div>
          </form>
        </IceGlassCard>
      </div>
    </div>
  )
}
