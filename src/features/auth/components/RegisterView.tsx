'use client'

import React from 'react'
import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Zap } from 'lucide-react'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import logo from '@/assets/images/logo/ssc_logo_2.png'

export const RegisterView = ({ referralCode }: { referralCode?: string }) => {
  const t = useTranslations('Login')

  return (
    <div className="relative flex min-h-screen overflow-hidden selection:bg-gold/30 selection:text-gold-light">
      <div className="absolute inset-0 bg-gradient-to-l from-slate-950 via-slate-950/80 to-slate-950/40" />
      <div className="fixed top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>
      <div className="flex flex-col lg:flex-row w-full max-w-[1920px] mx-auto relative text-right">
        {/* Left Column: Register Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative z-40 order-2 lg:order-1">
          <div className="w-full max-w-md animate-in fade-in slide-in-from-left duration-1000">
            <IceGlassCard className="p-0 sm:p-0 border-0" backdropBlur="xl">
              <div className="flex flex-col items-center w-full bg-white/5 rounded-2xl p-6 border border-white/5 shadow-inner relative z-10">
                <RegisterForm referralCode={referralCode} />
              </div>
            </IceGlassCard>
          </div>
        </div>

        {/* Right Column: Hero Content */}
        <div className="w-full lg:w-1/2 relative min-h-[40vh] lg:min-h-screen order-1 lg:order-2 overflow-hidden">
          <div className="relative z-20 h-full flex flex-col items-center lg:items-end justify-center p-8 sm:p-12 lg:p-24 text-right">
            <div className="space-y-4 animate-in fade-in slide-in-from-right duration-1000">
              <div className="relative w-64 h-32 mb-8 mx-auto lg:mx-0 lg:ml-auto animate-in fade-in slide-in-from-top-4 duration-700">
                <Image
                  src={logo}
                  alt="Slapshot Club"
                  fill
                  className="object-contain drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                  priority
                />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest backdrop-blur-md ml-auto">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                {t('hero.badge')}
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tighter leading-none mb-6 drop-shadow-2xl">
                {t('hero.title_main')}
                <span className="text-warning block lg:inline ml-2">{t('hero.title_sub')}</span>
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
