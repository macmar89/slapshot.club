'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { joinLeague } from '@/actions/leagues'
import { toast } from 'sonner'
import { Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

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
        toast.success(t('join_request_sent'))
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex-1 w-full">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder={t('join_placeholder')}
          className="w-full bg-black/40 border border-white/10 rounded-app p-3 text-white placeholder:text-white/20 focus:outline-none focus:border-warning/40 focus:ring-1 focus:ring-warning/40 transition-all font-mono uppercase tracking-widest text-xs sm:text-sm text-center shadow-inner"
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading || !code.trim()}
        variant="solid"
        size="lg"
        className="w-full bg-warning border border-warning/50 hover:bg-warning/90 text-black font-black uppercase tracking-widest shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_25px_rgba(234,179,8,0.3)] transition-all duration-300"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            {t('join_button')} <ArrowRight className="ml-2 w-5 h-5" />
          </>
        )}
      </Button>
    </form>
  )
}
