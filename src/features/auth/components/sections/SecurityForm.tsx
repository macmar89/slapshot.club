'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Lock, CheckCircle2 } from 'lucide-react'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { Button } from '@/components/ui/Button'
import { PasswordInput } from '@/features/auth/components/PasswordInput'
import { passwordUpdateSchema, type PasswordUpdateFormData } from '@/features/auth/schema'
import { updatePasswordAction } from '@/features/auth/account-actions'

export function SecurityForm() {
  const t = useTranslations('Account')
  const authT = useTranslations('Auth')
  const commonT = useTranslations('Common')

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    reset: resetPassword,
  } = useForm<PasswordUpdateFormData>({
    resolver: zodResolver(passwordUpdateSchema),
  })

  const onPasswordSubmit = async (data: PasswordUpdateFormData) => {
    const res = await updatePasswordAction(data.newPassword)
    if (res.ok) {
      toast.success(commonT('success_title'))
      resetPassword()
    } else {
      toast.error(res.error || commonT('error_generic'))
    }
  }

  return (
    <IceGlassCard backdropBlur="md" className="p-6 md:p-8 md:col-span-2">
      <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="flex flex-col gap-4 md:gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight flex items-center gap-2 italic">
            <Lock className="w-4 h-4 md:w-5 md:h-5 text-warning" />
            {t('security_section')}
          </h3>
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">{t('security_description')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <PasswordInput
            id="currentPassword"
            label={authT('password')}
            placeholder={authT('password_placeholder')}
            disabled={isPasswordSubmitting}
            error={passwordErrors.currentPassword?.message}
            register={registerPassword('currentPassword')}
          />
          <div className="hidden md:block" />
          <PasswordInput
            id="newPassword"
            label={commonT('new_password')}
            placeholder={authT('password_placeholder')}
            disabled={isPasswordSubmitting}
            error={passwordErrors.newPassword?.message}
            register={registerPassword('newPassword')}
          />
          <PasswordInput
            id="confirmPassword"
            label={commonT('confirm_password')}
            placeholder={authT('password_placeholder')}
            disabled={isPasswordSubmitting}
            error={passwordErrors.confirmPassword?.message}
            register={registerPassword('confirmPassword')}
          />
        </div>

        <Button type="submit" color="warning" className="w-full md:w-auto self-end px-12 bg-warning text-black font-black uppercase italic tracking-widest text-xs md:text-sm h-10 md:h-12" disabled={isPasswordSubmitting}>
          {isPasswordSubmitting ? commonT('loading') : t('change_password')}
        </Button>
      </form>
      
      <div className="flex items-center justify-center gap-2 text-white/10 py-6 md:py-8 border-t border-white/5 mt-6 md:mt-8">
         <CheckCircle2 className="w-4 h-4" />
         <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">{t('encrypted_notice')}</span>
      </div>
    </IceGlassCard>
  )
}
