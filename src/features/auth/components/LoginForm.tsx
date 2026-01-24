'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginUser } from '@/features/auth/actions'
import { loginSchema, type LoginFormData } from '@/features/auth/schema'
import { useTranslations } from 'next-intl'

export const LoginForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/lobby'
  const t = useTranslations('Auth')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await loginUser(data)

      if (res.ok) {
        await res.json()
        router.refresh()
        router.push(redirectUrl)
      } else {
        const responseData = await res.json()
        setError(responseData.errors?.[0]?.message || 'Prihlásenie zlyhalo')
      }
    } catch (_err) {
      setError('Nastala neočakávaná chyba')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center mb-4">
        <h2 className="text-2xl font-bold text-white tracking-tighter uppercase">
          {t('welcome_back')}
        </h2>
        <p className="text-sm text-white/40 font-medium">{t('continue_journey')}</p>
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-xs font-medium text-white/80 uppercase tracking-wider ml-1"
            >
              {t('password')}
            </label>
            <a href="#" className="text-xs text-white/50 hover:text-white transition-colors">
              {t('forgot_password')}
            </a>
          </div>
          <input
            id="password"
            type="password"
            placeholder={t('password_placeholder')}
            disabled={isLoading}
            {...register('password')}
            className={cn(
              'w-full px-4 py-3 rounded-app outline-none transition-all duration-200',
              'bg-white/5 border border-white/10 text-white placeholder:text-white/30',
              'focus:bg-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/30',
              'hover:bg-white/10 hover:border-white/20',
              isLoading && 'opacity-50 cursor-not-allowed',
              errors.password && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            )}
          />
          {errors.password && (
            <p className="text-red-500 text-xs ml-1">{errors.password.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" color="gold" className="w-full py-6 text-lg" disabled={isLoading}>
        {isLoading ? t('logging_in') : t('login_button')}
      </Button>

      <div className="text-center text-sm text-white/50 mt-2">
        {t('no_account')}{' '}
        <a href="#" className="text-white font-semibold hover:underline">
          {t('register')}
        </a>
      </div>
    </form>
  )
}
