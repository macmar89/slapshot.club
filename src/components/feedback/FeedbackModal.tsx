'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { MessageSquarePlus, Send, Bug, Lightbulb, HelpCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { submitFeedbackAction } from '@/features/feedback/feedback-actions'

interface FeedbackModalProps {
  children?: React.ReactNode
  triggerClassName?: string
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function FeedbackModal({ children, triggerClassName, defaultOpen, onOpenChange }: FeedbackModalProps) {
  const t = useTranslations('Feedback')
  const commonT = useTranslations('Common')
  const pathname = usePathname()
  
  const [open, setOpen] = useState(defaultOpen || false)
  const [type, setType] = useState<'bug' | 'idea' | 'other'>('idea')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    onOpenChange?.(newOpen)
    if (!newOpen) {
      // Reset form on close
      setTimeout(() => {
        setType('idea')
        setMessage('')
      }, 300)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setIsSubmitting(true)
    const result = await submitFeedbackAction(type, message, pathname)
    setIsSubmitting(false)

    if (result.ok) {
      toast.success(t('success'))
      handleOpenChange(false)
    } else {
      toast.error(result.error || commonT('error_generic'))
    }
  }

  const getTypeIcon = (t: string) => {
    switch (t) {
      case 'bug': return <Bug className="w-4 h-4" />
      case 'idea': return <Lightbulb className="w-4 h-4" />
      default: return <HelpCircle className="w-4 h-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" className={triggerClassName}>
            <MessageSquarePlus className="w-5 h-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-slate-950/95 border-white/10 text-white backdrop-blur-3xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter text-warning">{t('title')}</DialogTitle>
          <DialogDescription className="text-white/40 font-medium">
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-4">
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">{t('type_label')}</label>
            <div className="grid grid-cols-3 gap-2">
              {(['idea', 'bug', 'other'] as const).map((tType) => (
                <button
                  key={tType}
                  type="button"
                  onClick={() => setType(tType)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 cursor-pointer",
                    type === tType
                      ? "bg-warning/20 border-warning text-warning"
                      : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white/70"
                  )}
                >
                  {getTypeIcon(tType)}
                  <span className="text-[10px] font-black uppercase tracking-wider">{t(`types.${tType}`)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">{t('message_label')}</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('message_placeholder')}
              className="w-full h-32 px-4 py-3 rounded-app bg-white/5 border border-white/10 text-white outline-none focus:border-warning/50 transition-all font-bold text-sm resize-none"
              disabled={isSubmitting}
            />
          </div>

          <Button 
            type="submit" 
            color="warning" 
            className="w-full bg-warning text-black font-black uppercase italic tracking-widest gap-2"
            disabled={isSubmitting || !message.trim()}
          >
            {isSubmitting ? commonT('loading') : (
              <>
                <Send className="w-4 h-4" />
                {t('submit')}
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
