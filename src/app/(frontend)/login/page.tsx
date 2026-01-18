import React from 'react'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { LoginForm } from '@/components/auth/LoginForm'
import Image from 'next/image'

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="relative h-full w-full">
          <Image
            src="/images/background/slapshot_background.png"
            alt="Slapshot Background"
            fill
            className="object-cover object-center"
            priority
            quality={100}
          />
        </div>
      </div>
      {/* <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950"> */}
      {/* Background Image - Reusing dashboard background if available, or fallback to dark gradient */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/background/slapshot_background.png"
          alt="Background"
          fill
          className="object-cover opacity-60"
          priority
        />
        {/* Detailed dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/80" />
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <IceGlassCard className="w-full min-h-[500px]">
          <div className="flex flex-col items-center w-full h-full py-8">
            {/* Logo Area */}
            <div className="mb-8">
              {/* Placeholder for Logo - eventually replace with actual SVG */}
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                <span className="text-2xl">🏆</span>
              </div>
            </div>

            <LoginForm />
          </div>
        </IceGlassCard>
      </div>
    </div>
  )
}
