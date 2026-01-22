'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { joinLeague } from '@/actions/leagues'
import { toast } from 'sonner'
import { Loader2, ArrowRight } from 'lucide-react'

export function JoinLeagueForm() {
  const t = useTranslations('Leagues')
  const router = useRouter()
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return

    setIsLoading(true)
    try {
      const res = await joinLeague(code.trim().toUpperCase())

      if (res.success) {
        toast.success(`Úspešne pripojený k lige ${res.league.name}`)
        setCode('')
        router.refresh()
      } else {
        toast.error(res.error)
      }
    } catch (error) {
      toast.error('Nastala chyba pri pripájaní')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold mb-4 text-[#eab308] uppercase tracking-wider">
        {t('join_section')}
      </h2>
      <IceGlassCard className="p-6">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-4 items-end md:items-center"
        >
          <div className="flex-1 w-full">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t('join_placeholder')}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#eab308]/50 focus:ring-1 focus:ring-[#eab308]/50 transition-all font-mono uppercase tracking-widest text-lg"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !code.trim()}
            className="w-full md:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {t('join_button')} <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </IceGlassCard>
    </div>
  )
}
