'use client'

import React from 'react'
import Image from 'next/image'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { Trophy, Users, Table, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function LoginView() {
  const t = useTranslations('Login')

  const features = [
    {
      title: t('features.dominance.title'),
      description: t('features.dominance.description'),
      icon: Trophy,
    },
    {
      title: t('features.leagues.title'),
      description: t('features.leagues.description'),
      icon: Users,
    },
    {
      title: t('features.stats.title'),
      description: t('features.stats.description'),
      icon: Table,
    },
    {
      title: t('features.progress.title'),
      description: t('features.progress.description'),
      icon: Zap,
    },
  ]

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950 font-sans">
      {/* Background Image & Overlays */}
      <div className="absolute inset-0 z-0">
        <Image
          src='/images/background/ssc_bg.webp'
          alt="Background"
          fill
          className="object-cover opacity-40 blur-[2px]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-950/80 to-primary/20" />
      </div>

      <div className="relative z-10 w-full max-w-6xl px-6 py-12 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        {/* Left Column: Marketing / Branding */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-[0.2em] mb-8 animate-in slide-in-from-left duration-700">
            <Zap className="w-3 h-3 fill-primary" />
            {t('hero.badge')}
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tighter leading-none mb-6 drop-shadow-2xl">
            {t('hero.title_main')}
            <span className="text-primary block lg:inline ml-2">{t('hero.title_sub')}</span>
          </h1>

          <p className="text-xl text-white/50 max-w-xl mb-12 leading-relaxed">
            {t('hero.description')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="flex items-start gap-4 group animate-in slide-in-from-left duration-1000 fill-mode-backwards"
                style={{ animationDelay: `${(i + 1) * 150}ms` }}
              >
                <div className="mt-1 p-3 rounded-xl bg-white/5 border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-bold uppercase text-sm tracking-widest mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-snug">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Login Form */}
        <div className="w-full max-w-md animate-in zoom-in fade-in duration-1000">
          <IceGlassCard className="p-2 sm:p-4" backdropBlur="xl">
            <div className="flex flex-col items-center w-full bg-white/5 rounded-2xl p-8 border border-white/5 shadow-inner">
              <React.Suspense fallback={<div className="text-white/50">Loading...</div>}>
                <LoginForm />
              </React.Suspense>
            </div>
          </IceGlassCard>

          <div className="mt-8 text-center text-white/30 text-xs font-medium uppercase tracking-[0.3em]">
            {t('hero.footer')}
          </div>
        </div>
      </div>
    </div>
  )
}
