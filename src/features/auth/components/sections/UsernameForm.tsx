'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { User, AlertCircle } from 'lucide-react'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { usernameUpdateSchema, type UsernameUpdateFormData } from '@/features/auth/schema'
import { updateUsernameAction } from '@/features/auth/account-actions'

interface UsernameFormProps {
  initialUsername: string
  onUsernameUpdated: (newUsername: string) => void
}

export function UsernameForm({ initialUsername, onUsernameUpdated }: UsernameFormProps) {
  const t = useTranslations('Account')
  const authT = useTranslations('Auth')
  const commonT = useTranslations('Common')

  const {
    register: registerUsername,
    handleSubmit: handleUsernameSubmit,
    formState: { errors: usernameErrors, isSubmitting: isUsernameSubmitting },
  } = useForm<UsernameUpdateFormData>({
    resolver: zodResolver(usernameUpdateSchema),
    defaultValues: { username: initialUsername },
  })

  const onUsernameSubmit = async (data: UsernameUpdateFormData) => {
    const res = await updateUsernameAction(data.username)
    if (res.ok) {
      toast.success(commonT('success_title'))
      onUsernameUpdated(data.username)
    } else {
      toast.error(res.error || commonT('error_generic'))
    }
  }

  return (
    <IceGlassCard backdropBlur="md" className="p-6 md:p-8">
      <form onSubmit={handleUsernameSubmit(onUsernameSubmit)} className="flex flex-col gap-4 md:gap-6 h-full">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight flex items-center gap-2 italic">
            <User className="w-4 h-4 md:w-5 md:h-5 text-warning" />
            {t('username_section')}
          </h3>
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">{t('username_description')}</p>
        </div>
        
        <div className="flex flex-col gap-2 flex-grow">
          <input
            {...registerUsername('username')}
            className={cn(
              "w-full px-4 py-2.5 md:py-3 rounded-app bg-white/5 border border-white/10 text-white outline-none focus:border-warning/50 transition-all font-bold text-sm md:text-base",
              usernameErrors.username && "border-red-500"
            )}
            placeholder={authT('username_placeholder')}
          />
          {usernameErrors.username && (
            <span className="text-red-500 text-[10px] font-black uppercase flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {usernameErrors.username.message}
            </span>
          )}
        </div>

        <Button type="submit" color="warning" className="w-full px-8 bg-warning text-black font-black uppercase italic tracking-widest text-xs md:text-sm h-10 md:h-12" disabled={isUsernameSubmitting}>
          {isUsernameSubmitting ? commonT('loading') : t('save_button')}
        </Button>
      </form>
    </IceGlassCard>
  )
}
