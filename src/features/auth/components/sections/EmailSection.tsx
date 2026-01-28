'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Mail, ChevronRight, Send } from 'lucide-react'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/Dialog'
import { emailChangeRequestSchema, type EmailChangeRequestFormData } from '@/features/auth/schema'
import { requestEmailChangeAction } from '@/features/auth/account-actions'

interface EmailSectionProps {
  email: string
}

export function EmailSection({ email }: EmailSectionProps) {
  const t = useTranslations('Account')
  const authT = useTranslations('Auth')
  const commonT = useTranslations('Common')
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors, isSubmitting: isEmailSubmitting },
    reset: resetEmail,
  } = useForm<EmailChangeRequestFormData>({
    resolver: zodResolver(emailChangeRequestSchema),
  })

  const onEmailRequestSubmit = async (data: EmailChangeRequestFormData) => {
    const res = await requestEmailChangeAction(data.newEmail, data.message)
    if (res.ok) {
      toast.success(commonT('success_title'))
      setIsEmailModalOpen(false)
      resetEmail()
    } else {
      toast.error(res.error || commonT('error_generic'))
    }
  }

  return (
    <IceGlassCard backdropBlur="md" className="p-6 md:p-8">
      <div className="flex flex-col h-full justify-between gap-4 md:gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight flex items-center gap-2 italic">
            <Mail className="w-4 h-4 md:w-5 md:h-5 text-warning" />
            {t('email_section')}
          </h3>
          <p className="text-white/60 font-black bg-white/5 px-3 py-2 rounded-lg border border-white/10 mt-2 text-xs md:text-sm truncate">{email}</p>
          <p className="text-white/20 text-[10px] mt-2 font-bold uppercase tracking-tighter italic">{t('email_hint')}</p>
        </div>

        <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="text-warning hover:bg-warning/10 gap-2 border border-warning/20 font-black uppercase italic tracking-widest text-[10px] md:text-xs">
              {t('request_change')}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-950/95 border-white/10 text-white backdrop-blur-3xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter text-warning">{t('email_modal.title')}</DialogTitle>
              <DialogDescription className="text-white/40 font-medium">
                {t('email_modal.description')}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEmailSubmit(onEmailRequestSubmit)} className="flex flex-col gap-4 py-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">{t('email_modal.new_email')}</label>
                <input 
                  {...registerEmail('newEmail')}
                  type="email"
                  className={cn(
                    "w-full px-4 py-3 rounded-app bg-white/5 border border-white/10 text-white focus:border-warning/50 outline-none transition-all font-bold",
                    emailErrors.newEmail && "border-red-500"
                  )}
                  placeholder={authT('email_placeholder')}
                />
                {emailErrors.newEmail && <span className="text-red-500 text-[10px] font-black uppercase">{emailErrors.newEmail.message}</span>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">{t('email_modal.reason')}</label>
                <textarea 
                  {...registerEmail('message')}
                  className={cn(
                    "w-full px-4 py-3 rounded-app bg-white/5 border border-white/10 text-white focus:border-warning/50 outline-none transition-all min-h-[100px] font-bold",
                    emailErrors.message && "border-red-500"
                  )}
                  placeholder={t('email_modal.reason_placeholder')}
                />
                {emailErrors.message && <span className="text-red-500 text-[10px] font-black uppercase">{emailErrors.message.message}</span>}
              </div>
              <div className="flex gap-3 mt-4">
                <Button type="button" variant="ghost" className="flex-1 font-black uppercase text-xs" onClick={() => setIsEmailModalOpen(false)}>{t('email_modal.cancel')}</Button>
                <Button type="submit" color="warning" className="flex-1 gap-2 bg-warning text-black font-black uppercase italic tracking-widest text-xs" disabled={isEmailSubmitting}>
                  {isEmailSubmitting ? commonT('loading') : (
                    <>
                      <Send className="w-4 h-4" />
                      {t('email_modal.submit')}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </IceGlassCard>
  )
}
