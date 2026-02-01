'use client'

import React from 'react'
import { Copy, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

interface ReferralLinkProps {
  code: string
  className?: string
  align?: 'left' | 'center' | 'right'
  title?: string
}

export function ReferralLink({ 
  code, 
  className, 
  align = 'right',
  title
}: ReferralLinkProps) {
  const t = useTranslations('Account')
  const [copied, setCopied] = React.useState(false)
  const [baseUrl, setBaseUrl] = React.useState('')

  React.useEffect(() => {
    setBaseUrl(window.location.origin)
  }, [])

  const fullUrl = `${baseUrl}/register/${code}`

  const handleCopy = () => {
    if (!baseUrl) return
    navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const alignmentClasses = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-center md:items-end text-center md:text-right'
  }

  return (
    <div className={cn("flex flex-col gap-2", alignmentClasses[align], className)}>
      <div className="flex flex-col gap-1">
        <div className="text-sm uppercase tracking-widest text-white font-bold">
          {title || t('referral_section')}
        </div>
      </div>
      <div 
        onClick={handleCopy}
        className="cursor-pointer group relative px-3 py-2 bg-black/40 border border-white/10 rounded-lg flex items-center gap-3 hover:border-warning/50 hover:bg-warning/10 transition-all duration-300 max-w-full"
      >
        <div className="flex flex-col min-w-0 overflow-hidden">
          <span className="font-mono text-[9px] uppercase tracking-tighter text-white/30 truncate leading-none mb-1">
            {baseUrl.replace(/^https?:\/\//, '')}/register/
          </span>
          <code className="font-mono text-lg md:text-xl font-black text-warning tracking-widest leading-tight truncate">
            {code}
          </code>
        </div>
        
        <div className="flex-shrink-0 flex items-center gap-2 pl-3 border-l border-white/5 group-hover:border-warning/20 transition-colors">
          <div className="hidden sm:block text-[10px] font-bold uppercase tracking-wider text-white/40 group-hover:text-warning/80 transition-colors">
            {copied ? t('copied') : t('copy')}
          </div>
          <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center group-hover:bg-warning/20 transition-colors">
            {copied ? (
              <Check className="w-4 h-4 text-warning" />
            ) : (
              <Copy className="w-4 h-4 text-white/40 group-hover:text-warning/80" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
