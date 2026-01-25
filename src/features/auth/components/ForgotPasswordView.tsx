'use client'

import React from 'react'
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Zap } from 'lucide-react'

export const ForgotPasswordView = () => {
  const t = useTranslations('Login')

  return (
    <div className="flex min-h-screen bg-black overflow-hidden selection:bg-gold/30 selection:text-gold-light">
      <div className="flex flex-col lg:flex-row w-full max-w-[1920px] mx-auto relative">
        {/* Left Column: Forgot Password Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 relative z-10 order-2 lg:order-1">
          <div className="w-full max-w-md animate-in fade-in slide-in-from-left duration-1000">
             <IceGlassCard className="p-2 sm:p-4" backdropBlur="xl">
              <div className="flex flex-col items-center w-full bg-white/5 rounded-2xl p-8 border border-white/5 shadow-inner relative z-10">
                <ForgotPasswordForm />
              </div>
            </IceGlassCard>
          </div>
        </div>

        {/* Right Column: Hero Content */}
        <div className="w-full lg:w-1/2 relative min-h-[40vh] lg:min-h-screen order-1 lg:order-2 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-l from-black via-black/40 to-transparent z-10 hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 lg:hidden" />

          <Image
            src="/ssc_bg.webp"
            alt="Slapshot Club Background"
            fill
            className="object-cover scale-110 animate-pulse-slow opacity-60"
            priority
          />

          <div className="relative z-20 h-full flex flex-col items-center lg:items-end justify-center p-8 sm:p-12 lg:p-24 text-right">
            <div className="space-y-4 animate-in fade-in slide-in-from-right duration-1000">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
                </span>
                {t('hero.badge')}
              </div>

              <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black text-white italic tracking-tighter leading-none stroke-gold">
                {t('hero.title_main')}
                <br />
                <span className="text-gold lg:mr-4">{t('hero.title_sub')}</span>
              </h1>

              <p className="max-w-md text-white/60 text-lg sm:text-xl font-medium ml-auto leading-relaxed">
                {t('hero.description')}
              </p>
            </div>

            <div className="absolute bottom-8 lg:bottom-12 right-8 lg:right-24 text-white/30 text-xs font-medium tracking-widest uppercase z-20">
              {t('hero.footer')}
            </div>
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none overflow-hidden opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold filter blur-[160px] animate-pulse-slow rounded-full opacity-50" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-dark filter blur-[160px] animate-pulse-slow delay-700 rounded-full opacity-30" />
        </div>
      </div>
    </div>
  )
}
