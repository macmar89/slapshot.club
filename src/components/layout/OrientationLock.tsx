'use client'

import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Smartphone } from 'lucide-react'

export const OrientationLock: React.FC = () => {
  const t = useTranslations('PWA.orientation_lock')
  const [isLandscape, setIsLandscape] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkOrientation = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      )
      setIsMobile(isMobileDevice)
      setIsLandscape(window.innerWidth > window.innerHeight && isMobileDevice)
    }

    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    window.addEventListener('orientationchange', checkOrientation)

    return () => {
      window.removeEventListener('resize', checkOrientation)
      window.removeEventListener('orientationchange', checkOrientation)
    }
  }, [])

  if (!isLandscape || !isMobile) return null

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-6 text-center transition-all duration-300 bg-slate-950/90 backdrop-blur-xl">
      <div className="flex flex-col items-center max-w-xs space-y-6">
        <div className="relative">
          <div className="absolute inset-0 rounded-full animate-ping bg-blue-500/20" />
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-slate-900 border border-slate-800 shadow-2xl">
            <Smartphone className="w-10 h-10 text-blue-400 rotate-90 animate-bounce-horizontal" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-white uppercase font-space">
            {t('title')}
          </h2>
          <p className="text-slate-400 font-sora">
            {t('message')}
          </p>
        </div>

        <div className="flex items-center justify-center px-4 py-2 rounded-full border border-slate-800 bg-slate-900/50 text-xs text-slate-500 font-medium">
          Slapshot Club 🏒
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce-horizontal {
          0%, 100% {
            transform: rotate(90-deg) translateX(0);
          }
          50% {
            transform: rotate(90-deg) translateX(10px);
          }
        }
        .animate-bounce-horizontal {
          animation: bounce-horizontal 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  )
}
