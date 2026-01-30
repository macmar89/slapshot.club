'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Checkbox } from '@/components/ui/Checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import { registerUser } from '@/features/auth/actions'
import { registerSchema, type RegisterFormData } from '@/features/auth/schema'
import { useTranslations } from 'next-intl'
import { Turnstile } from '@/components/auth/Turnstile'
import { Link } from '@/i18n/routing'
import { AvailabilityInput } from './AvailabilityInput'
import { PasswordInput } from './PasswordInput'
import dynamic from 'next/dynamic'

const GdprModalContent = dynamic(
  () => import('./GdprModalContent'),
  { ssr: false }
)

export const RegisterForm = () => {
  const router = useRouter()
  const t = useTranslations('Auth')

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false)
  const [isEmailAvailable, setIsEmailAvailable] = useState(false)
  const [gdprOpen, setGdprOpen] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      turnstileToken: '',
      gdprConsent: false,
      marketingConsent: false,
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await registerUser(data)

      if (res.ok) {
        setIsSuccess(true)
      } else {
        setError(res.data.errors?.[0]?.message || 'Registrácia zlyhala')
      }
    } catch (_err) {
      setError('Nastala neočakávaná chyba')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-sm flex flex-col gap-6 items-center text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center border border-gold/20 mb-2">
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
            {t('register_success_title')}
          </h2>
          <p className="text-white/60 font-medium">{t('register_success_description')}</p>
        </div>
        <Button color="gold" className="w-full mt-4" onClick={() => router.push('/login')}>
          {t('login')}
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm flex flex-col gap-4">
      <div className="flex flex-col gap-1 text-center mb-2">
        <h2 className="text-2xl font-bold text-white tracking-tighter uppercase">
          {t('register_title')}
        </h2>
        <p className="text-sm text-white/40 font-medium">{t('register_subtitle')}</p>
      </div>

      <div className="flex flex-col gap-3">
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
        {errors.turnstileToken && (
          <p className="text-red-500 text-xs text-center">{errors.turnstileToken.message}</p>
        )}

        <div className="flex flex-row items-start gap-2 pt-1 text-left relative">
          <Controller
            name="gdprConsent"
            control={control}
            render={({ field }) => (
              <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                <Checkbox
                  id="gdpr"
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                  className="cursor-pointer data-[state=checked]:bg-transparent data-[state=checked]:text-[hsl(var(--warning))] data-[state=checked]:border-[hsl(var(--warning))] border-white/30"
                />
              </div>
            )}
          />
          <div className="grid gap-1 leading-none">
            <label
              htmlFor="gdpr"
              className="text-xs font-medium leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white/80 cursor-pointer select-none"
            >
              {t('gdpr_label_prefix')}{' '}
              <span
                className="text-gold cursor-pointer hover:underline"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setGdprOpen(true)
                }}
              >
                {t('gdpr_label_link')}
              </span>
            </label>
            {errors.gdprConsent && (
              <p className="text-red-500 text-xs">{errors.gdprConsent.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-row items-start gap-2 text-left relative">
          <Controller
            name="marketingConsent"
            control={control}
            render={({ field }) => (
              <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                <Checkbox
                  id="marketing"
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                  className="cursor-pointer data-[state=checked]:bg-transparent data-[state=checked]:text-[hsl(var(--warning))] data-[state=checked]:border-[hsl(var(--warning))] border-white/30"
                />
              </div>
            )}
          />
          <label
            htmlFor="marketing"
            className="text-xs font-medium leading-snug peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white/60 cursor-pointer select-none"
          >
            {t('marketing_label')}
          </label>
        </div>
      </div>

      <Button
        type="submit"
        color="gold"
        className="w-full py-4 text-base font-bold tracking-wide"
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
      
      {gdprOpen && (
        <GdprModalContent open={gdprOpen} onOpenChange={setGdprOpen} />
      )}
    </form>
  )
}
