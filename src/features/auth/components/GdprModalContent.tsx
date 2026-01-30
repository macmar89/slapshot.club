'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import { getGeneralSettings } from '@/actions/general-settings'
import { RichTextParser } from '@/components/RichTextParser'
import { useLocale, useTranslations } from 'next-intl'

interface GdprModalContentProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const GdprModalContent = ({ open, onOpenChange }: GdprModalContentProps) => {
  const t = useTranslations('Auth')
  const locale = useLocale()
  const [content, setContent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open && !content) {
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
    }
  }, [open, content, locale])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-black/90 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gold">
            {t('gdpr_modal.title')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-sm text-white/80 leading-relaxed min-h-[200px]">
          {isLoading ? (
             <div className="flex items-center justify-center py-20">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
             </div>
          ) : content ? (
            <RichTextParser content={content} />
          ) : (
            <p className="text-white/50 text-center py-10">
              {t('gdpr_modal.failed_to_load')}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default GdprModalContent
