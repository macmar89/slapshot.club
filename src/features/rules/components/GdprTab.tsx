'use client'

import React, { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { getGeneralSettings } from '@/actions/general-settings'
import { RichTextParser } from '@/components/RichTextParser'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { Shield } from 'lucide-react'

export function GdprTab() {
  const t = useTranslations('Rules')
  const locale = useLocale()
  const [content, setContent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const settings = await getGeneralSettings(locale)
        // @ts-ignore
        if (settings?.gdpr?.content) {
          // @ts-ignore
          setContent(settings.gdpr.content)
        }
      } catch (error) {
        console.error('Failed to load GDPR content', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [locale])

  return (
    <div className="space-y-4">
      <IceGlassCard className="p-4 md:p-8 relative overflow-hidden group">
        <div className="flex items-center gap-3 px-1 pb-6 border-b border-white/10 mb-6">
          <Shield className="w-5 h-5 text-warning" />
          <h2 className="text-xl font-bold uppercase tracking-wider text-white">
            {t('tabs_gdpr')}
          </h2>
        </div>

        <div className="space-y-4 text-sm md:text-base text-white/80 leading-relaxed min-h-[200px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-warning"></div>
            </div>
          ) : content ? (
            <div className="prose prose-invert max-w-none prose-p:text-white/70 prose-headings:text-gold prose-strong:text-white prose-ul:text-white/70">
              <RichTextParser content={content} />
            </div>
          ) : (
            <p className="text-white/50 text-center py-10">GDPR content not found.</p>
          )}
        </div>
      </IceGlassCard>
    </div>
  )
}
