'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPassword } from '@/features/auth/actions'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/features/auth/schema'
import { useTranslations } from 'next-intl'
import { PasswordInput } from './PasswordInput'
import { toast } from 'sonner'

export const ResetPasswordForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const t = useTranslations('Auth')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
      token: token || '',
    },
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError(t('verify_error'))
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await resetPassword(data)

      if (res.ok) {
        setIsSuccess(true)
        toast.success(t('reset_password_success'))
      } else {
        setError(res.data.errors?.[0]?.message || t('error_generic'))
      }
    } catch (_err) {
      setError(t('error_generic'))
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-sm flex flex-col gap-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center border border-gold/20 mx-auto mb-2">
          <svg
            className="w-10 h-10 text-gold"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tighter uppercase leading-tight">
            {t('success_title')}
          </h2>
          <p className="text-white/60 font-medium">{t('reset_password_success')}</p>
        </div>
        <Button color="gold" className="w-full mt-4" onClick={() => router.push('/login')}>
          {t('login')}
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center mb-4">
        <h2 className="text-2xl font-bold text-white tracking-tighter uppercase">
          {t('reset_password_title')}
        </h2>
        <p className="text-sm text-white/40 font-medium">{t('reset_password_subtitle')}</p>
      </div>

      <div className="flex flex-col gap-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-app text-sm font-medium text-center">
            {error}
          </div>
        )}

        <PasswordInput
          id="password"
          label={t('password')}
          placeholder={t('password_placeholder')}
          disabled={isLoading}
          error={errors.password?.message}
          hint={!errors.password?.message ? t('password_hint') : undefined}
          register={register('password')}
        />

        <PasswordInput
          id="confirmPassword"
          label={t('confirm_password') || 'Potvrdiť heslo'}
          placeholder={t('password_placeholder')}
          disabled={isLoading}
          error={errors.confirmPassword?.message}
          register={register('confirmPassword')}
        />
      </div>

      <Button
        type="submit"
        color="gold"
        className="w-full py-6 text-lg"
        disabled={isLoading || !token}
      >
        {isLoading ? t('loading') : t('reset_password_button')}
      </Button>

      {!token && <p className="text-red-500 text-xs text-center">{t('verify_error')}</p>}
    </form>
  )
}
