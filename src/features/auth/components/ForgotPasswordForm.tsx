'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPassword } from '@/features/auth/actions'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/features/auth/schema'
import { useTranslations } from 'next-intl'
import { Turnstile } from '@/components/auth/Turnstile'
import { Link } from '@/i18n/routing'
import { toast } from 'sonner'

export const ForgotPasswordForm = () => {
  const t = useTranslations('Auth')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSent, setIsSent] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
      turnstileToken: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await forgotPassword(data)

      if (res.ok) {
        setIsSent(true)
        toast.success(t('forgot_password_success') || 'Inštrukcie boli odoslané na váš email.')
      } else {
        setError(res.data.errors?.[0]?.message || 'Nepodarilo sa odoslať inštrukcie')
      }
    } catch (_err) {
      setError('Nastala neočakávaná chyba')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSent) {
    return (
      <div className="w-full max-w-sm flex flex-col gap-6 text-center">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-white tracking-tighter uppercase">
            {t('forgot_password_title')}
          </h2>
          <p className="text-white/60 font-medium">
            {t('forgot_password_success_desc') || 'Skontrolujte si svoju e-mailovú schránku pre ďalší postup.'}
          </p>
        </div>
        <Link href="/login" className="text-gold hover:underline font-semibold">
          {t('back_to_login')}
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center mb-4">
        <h2 className="text-2xl font-bold text-white tracking-tighter uppercase">
          {t('forgot_password_title')}
        </h2>
        <p className="text-sm text-white/40 font-medium">{t('forgot_password_subtitle')}</p>
      </div>

      <div className="flex flex-col gap-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-app text-sm font-medium text-center">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-xs font-medium text-white/80 uppercase tracking-wider ml-1"
          >
            {t('email')}
          </label>
          <input
            id="email"
            type="email"
            placeholder={t('email_placeholder')}
            disabled={isLoading}
            {...register('email')}
            className={cn(
              'w-full px-4 py-3 rounded-app outline-none transition-all duration-200',
              'bg-white/5 border border-white/10 text-white placeholder:text-white/30',
              'focus:bg-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/30',
              'hover:bg-white/10 hover:border-white/20',
              isLoading && 'opacity-50 cursor-not-allowed',
              errors.email && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            )}
          />
          {errors.email && <p className="text-red-500 text-xs ml-1">{errors.email.message}</p>}
        </div>

        <Turnstile
          onSuccess={(token) => setValue('turnstileToken', token)}
          onError={() => setError(t('turnstile_error'))}
          onExpire={() => setValue('turnstileToken', '')}
        />
        {errors.turnstileToken && <p className="text-red-500 text-xs text-center">{errors.turnstileToken.message}</p>}
      </div>

      <Button type="submit" color="gold" className="w-full py-6 text-lg" disabled={isLoading}>
        {isLoading ? t('sending') : t('reset_password_button')}
      </Button>

      <div className="text-center text-sm text-white/50 mt-2">
        <Link href="/login" className="text-white font-semibold hover:underline">
          {t('back_to_login')}
        </Link>
      </div>
    </form>
  )
}
