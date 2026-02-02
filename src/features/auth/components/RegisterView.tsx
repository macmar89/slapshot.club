'use client'

import React from 'react'
import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Zap } from 'lucide-react'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import logo from '@/assets/images/logo/ssc_logo_2.png'
import { AuthFooter } from '@/features/auth/components/AuthFooter'

export const RegisterView = ({ referralCode }: { referralCode?: string }) => {
  const t = useTranslations('Login')

  return (
    <div className="relative flex min-h-screen overflow-hidden selection:bg-gold/30 selection:text-gold-light pb-12">
      <div className="absolute inset-0 bg-gradient-to-l from-slate-950 via-slate-950/80 to-slate-950/40" />
      <div className="fixed top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>
      <div className="flex flex-col lg:flex-row w-full max-w-[1920px] mx-auto relative text-right p-4">
        {/* Left Column: Register Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-2 sm:p-8 lg:p-12 relative z-40 order-2 lg:order-1">
          <div className="w-full max-w-md animate-in fade-in slide-in-from-left duration-1000">
            <IceGlassCard className="p-0 sm:p-0 border-0" backdropBlur="xl">
              <div className="flex flex-col items-center w-full bg-white/5 p-6 sm:p-8 border border-white/5 shadow-inner relative z-10">
                <RegisterForm referralCode={referralCode} />
              </div>
            </IceGlassCard>
          </div>
        </div>

        {/* Right Column: Hero Content */}
        <div className="w-full lg:w-1/2 relative min-h-[30vh] lg:min-h-screen order-1 lg:order-2 overflow-hidden">
          <div className="relative z-20 h-full flex flex-col items-center lg:items-end justify-center p-6 pb-4 sm:p-12 lg:p-24 text-right">
            <div className="flex flex-col space-y-2 sm:space-y-4 animate-in fade-in slide-in-from-right duration-1000">
              <div className="relative w-64 h-32 mb-4 sm:mb-8 mx-auto lg:mx-0 lg:ml-auto animate-in fade-in slide-in-from-top-4 duration-700 order-1">
                <Image
                  src={logo}
                  alt="Slapshot Club"
                  fill
                  className="object-contain drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                  priority
                />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest backdrop-blur-md mx-auto sm:ml-auto sm:mr-0 order-3 lg:order-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                {t('hero.badge')}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl text-center sm:text-right font-bold text-white tracking-tighter leading-none mb-6 drop-shadow-2xl order-2 lg:order-3">
                {t('hero.title_main')}
                <span className="text-warning inline ml-2">{t('hero.title_sub')}</span>
              </h1>

              <p className="max-w-md text-white/60 text-lg sm:text-xl font-medium text-center sm:text-right mx-auto sm:ml-auto sm:mr-0 leading-relaxed order-4 hidden sm:block">
                {t('hero.description')} 
              </p>
            </div>

          </div>
        </div>



        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none overflow-hidden opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold filter blur-[160px] animate-pulse-slow rounded-full opacity-50" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-dark filter blur-[160px] animate-pulse-slow delay-700 rounded-full opacity-30" />
        </div>
      </div>
      <AuthFooter />
    </div>
  )
}
