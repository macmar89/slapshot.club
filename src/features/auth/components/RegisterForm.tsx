'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerUser } from '@/features/auth/actions'
import { registerSchema, type RegisterFormData } from '@/features/auth/schema'
import { useTranslations } from 'next-intl'
import { Turnstile } from '@/components/auth/Turnstile'
import { Link } from '@/i18n/routing'
import { AvailabilityInput } from './AvailabilityInput'
import { PasswordInput } from './PasswordInput'

export const RegisterForm = () => {
  const router = useRouter()
  const t = useTranslations('Auth')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false)
  const [isEmailAvailable, setIsEmailAvailable] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      turnstileToken: '',
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await registerUser(data)

      if (res.ok) {
        router.push('/login')
      } else {
        setError(res.data.errors?.[0]?.message || 'Registrácia zlyhala')
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
          {t('register_title')}
        </h2>
        <p className="text-sm text-white/40 font-medium">{t('register_subtitle')}</p>
      </div>

      <div className="flex flex-col gap-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-app text-sm font-medium text-center">
            {error}
          </div>
        )}

        <AvailabilityInput
          id="username"
          type="username"
          label={t('username')}
          hint={t('username_hint')}
          placeholder={t('username_placeholder')}
          disabled={isLoading}
          error={errors.username?.message}
          register={register('username')}
          onAvailabilityChange={setIsUsernameAvailable}
        />

        <AvailabilityInput
          id="email"
          type="email"
          label={t('email')}
          placeholder={t('email_placeholder')}
          disabled={isLoading}
          error={errors.email?.message}
          register={register('email')}
          onAvailabilityChange={setIsEmailAvailable}
        />

        <PasswordInput
          id="password"
          label={t('password')}
          placeholder={t('password_placeholder')}
          disabled={isLoading}
          error={errors.password?.message}
          hint={!errors.password?.message ? t('password_hint') : undefined}
          register={register('password')}
        />

        <Turnstile
          onSuccess={(token) => setValue('turnstileToken', token)}
          onError={() => setError(t('turnstile_error'))}
          onExpire={() => setValue('turnstileToken', '')}
        />
        {errors.turnstileToken && <p className="text-red-500 text-xs text-center">{errors.turnstileToken.message}</p>}
      </div>

      <Button 
        type="submit" 
        color="gold" 
        className="w-full py-6 text-lg" 
        disabled={isLoading || !isUsernameAvailable || !isEmailAvailable}
      >
        {isLoading ? t('registering') : t('register_button')}
      </Button>

      <div className="text-center text-sm text-white/50 mt-2">
        {t('already_have_account')}{' '}
        <Link href="/login" className="text-white font-semibold hover:underline">
          {t('login')}
        </Link>
      </div>
    </form>
  )
}
