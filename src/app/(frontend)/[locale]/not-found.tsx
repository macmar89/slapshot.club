'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { Button } from '@/components/ui/Button'
import { Link } from '@/i18n/routing'
import { Ghost, ShieldAlert } from 'lucide-react'

export default function NotFoundPage() {
  const t = useTranslations('NotFound')

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(circle_at_top_right,rgba(234,179,8,0.05),transparent),radial-gradient(circle_at_bottom_left,rgba(234,179,8,0.02),transparent)]">
      <div className="max-w-xl w-full animate-in fade-in zoom-in duration-700">
        <IceGlassCard
          className="p-8 md:p-12 text-center relative overflow-hidden"
          backdropBlur="lg"
          withGradient
        >
          {/* Decorative Background Icon */}
          <div className="absolute -top-10 -right-10 opacity-5 rotate-12">
            <Ghost size={200} />
          </div>

          <div className="relative z-10 space-y-8">
            <div className="flex justify-center">
              <div className="p-4 rounded-3xl bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/20 animate-bounce">
                <ShieldAlert size={48} />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">404</h1>
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#eab308] text-black text-xs font-black uppercase tracking-[0.2em]">
                {t('title')}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white/90 uppercase tracking-widest leading-tight">
                {t('subtitle')}
              </h2>
              <p className="text-white/60 text-lg leading-relaxed max-w-sm mx-auto">
                {t('description')}
              </p>
            </div>

            <div className="pt-4">
              <Link href="/arena">
                <Button
                  color="gold"
                  className="px-8 py-6 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_10px_30px_rgba(234,179,8,0.3)] hover:shadow-[0_15px_40px_rgba(234,179,8,0.4)] transition-all"
                >
                  {t('button')}
                </Button>
              </Link>
            </div>
          </div>
        </IceGlassCard>
      </div>
    </div>
  )
}
