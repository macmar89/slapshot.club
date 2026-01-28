'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { User, Mail, Lock, UserCog, Send, CheckCircle2, AlertCircle, ChevronRight, MapPin } from 'lucide-react'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { Button } from '@/components/ui/Button'
import { PasswordInput } from '@/features/auth/components/PasswordInput'
import { cn } from '@/lib/utils'
import {
  usernameUpdateSchema,
  passwordUpdateSchema,
  emailChangeRequestSchema,
  type UsernameUpdateFormData,
  type PasswordUpdateFormData,
  type EmailChangeRequestFormData,
} from '@/features/auth/schema'
import {
  updateUsernameAction,
  updatePasswordAction,
  requestEmailChangeAction,
  updateLocationAction,
} from '@/features/auth/account-actions'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/Dialog'
import { Container } from '@/components/ui/Container'

interface AccountViewProps {
  user: {
    id: string
    username: string
    email: string
    location?: {
      country?: number | { id: number; name: string } | null
      region?: number | { id: number; name: string } | null
      customCountry?: string | null
    }
  }
  countries: Array<{ id: number; name: string }>
}

export function AccountView({ user: initialUser, countries }: AccountViewProps) {
  const t = useTranslations('Account')
  const authT = useTranslations('Auth')
  const commonT = useTranslations('Common')
  const [user, setUser] = useState(initialUser)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  
  // Get initial IDs (handle potential objects from Payload)
  const initialCountryId = typeof initialUser.location?.country === 'object' 
    ? initialUser.location?.country?.id 
    : initialUser.location?.country

  const initialRegionId = typeof initialUser.location?.region === 'object'
    ? initialUser.location?.region?.id
    : initialUser.location?.region

  const [selectedCountry, setSelectedCountry] = useState<number | null>(initialCountryId || null)
  const [selectedRegion, setSelectedRegion] = useState<number | null>(initialRegionId || null)
  const [availableRegions, setAvailableRegions] = useState<Array<{ id: number; name: string }>>([])
  const [customCountry, setCustomCountry] = useState(initialUser.location?.customCountry || '')
  const [isLocationSubmitting, setIsLocationSubmitting] = useState(false)
  const [isLoadingRegions, setIsLoadingRegions] = useState(false)

  // Fetch regions when country changes
  useEffect(() => {
    if (selectedCountry) {
      setIsLoadingRegions(true)
      fetch(`/api/regions?where[country][equals]=${selectedCountry}&limit=100`)
        .then(res => res.json())
        .then(data => {
          setAvailableRegions(data.docs.map((r: any) => ({ id: r.id, name: r.name })))
          setIsLoadingRegions(false)
        })
        .catch(err => {
          console.error('Failed to fetch regions:', err)
          setIsLoadingRegions(false)
        })
    } else {
      setAvailableRegions([])
    }
  }, [selectedCountry])

  // Username Form
  const {
    register: registerUsername,
    handleSubmit: handleUsernameSubmit,
    formState: { errors: usernameErrors, isSubmitting: isUsernameSubmitting },
    reset: resetUsername,
  } = useForm<UsernameUpdateFormData>({
    resolver: zodResolver(usernameUpdateSchema),
    defaultValues: { username: user.username },
  })

  // Password Form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    reset: resetPassword,
  } = useForm<PasswordUpdateFormData>({
    resolver: zodResolver(passwordUpdateSchema),
  })

  // Email Request Form
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors, isSubmitting: isEmailSubmitting },
    reset: resetEmail,
  } = useForm<EmailChangeRequestFormData>({
    resolver: zodResolver(emailChangeRequestSchema),
  })

  const onUsernameSubmit = async (data: UsernameUpdateFormData) => {
    const res = await updateUsernameAction(data.username)
    if (res.ok) {
      toast.success(commonT('success_title'))
      setUser((prev) => ({ ...prev, username: data.username }))
    } else {
      toast.error(res.error || commonT('error_generic'))
    }
  }

  const onPasswordSubmit = async (data: PasswordUpdateFormData) => {
    const res = await updatePasswordAction(data.newPassword)
    if (res.ok) {
      toast.success(commonT('success_title'))
      resetPassword()
    } else {
      toast.error(res.error || commonT('error_generic'))
    }
  }

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

  const onLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLocationSubmitting(true)
    const res = await updateLocationAction(selectedCountry, selectedRegion || null, customCountry || null)
    setIsLocationSubmitting(false)
    if (res.ok) {
      toast.success(commonT('success_title'))
      if (!selectedCountry && customCountry) {
        toast.info(t('location_other_notice'))
      }
    } else {
      toast.error(res.error || commonT('error_generic'))
    }
  }

  return (
    <div className="py-8 md:py-24 animate-in fade-in duration-700">
      <Container className="max-w-4xl">
        <div className="flex flex-col gap-6 md:gap-8">
          <div className="flex flex-col gap-1.5 mb-2 md:mb-4 text-center md:text-left">
            <h1 className="text-2xl md:text-5xl font-black text-white italic uppercase tracking-tighter flex items-center justify-center md:justify-start gap-3 md:gap-4">
              <UserCog className="w-6 h-6 md:w-10 md:h-10 text-warning" />
              {t('title')}
            </h1>
            <p className="text-white/40 text-[10px] md:text-lg font-medium italic uppercase tracking-[0.2em] md:tracking-widest">{t('subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Profile Overview */}
            <IceGlassCard backdropBlur="md" className="p-6 md:p-8 border-warning/20 md:col-span-2">
               <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-warning/20 border border-warning/30 flex items-center justify-center shadow-[0_0_30px_-5px_rgba(var(--warning-rgb),0.4)]">
                    <User className="w-8 h-8 md:w-10 md:h-10 text-warning" />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight italic">{user.username}</h2>
                    <p className="text-white/40 flex items-center justify-center md:justify-start gap-2 font-bold uppercase tracking-widest text-[10px] md:text-sm">
                       <Mail className="w-3 h-3 md:w-4 md:h-4 text-warning" />
                       {user.email}
                    </p>
                  </div>
               </div>
            </IceGlassCard>

            {/* Username Form */}
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

            {/* Email (Readonly) */}
            <IceGlassCard backdropBlur="md" className="p-6 md:p-8">
                <div className="flex flex-col h-full justify-between gap-4 md:gap-6">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight flex items-center gap-2 italic">
                      <Mail className="w-4 h-4 md:w-5 md:h-5 text-warning" />
                      {t('email_section')}
                    </h3>
                    <p className="text-white/60 font-black bg-white/5 px-3 py-2 rounded-lg border border-white/10 mt-2 text-xs md:text-sm truncate">{user.email}</p>
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

            {/* Location Form */}
            <IceGlassCard backdropBlur="md" className="p-6 md:p-8 md:col-span-2">
               <form onSubmit={onLocationSubmit} className="flex flex-col gap-4 md:gap-6">
                 <div className="flex flex-col gap-1">
                    <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight flex items-center gap-2 italic">
                      <MapPin className="w-4 h-4 md:w-5 md:h-5 text-warning" />
                      {t('location_section')}
                    </h3>
                    <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">{t('location_description')}</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40">{t('location_country')}</label>
                      <select
                        value={selectedCountry || ''}
                        onChange={(e) => {
                          const val = e.target.value ? Number(e.target.value) : null
                          setSelectedCountry(val)
                          setSelectedRegion(null) // Reset region when country changes
                        }}
                        className="w-full px-4 py-2.5 md:py-3 rounded-app bg-white/5 border border-white/10 text-white outline-none focus:border-warning/50 transition-all font-bold text-sm md:text-base"
                      >
                        <option value="">{t('location_select_country')}</option>
                        {countries.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    {(selectedCountry || customCountry) && (
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40">{t('location_region')}</label>
                        <select
                          value={selectedRegion || ''}
                          onChange={(e) => setSelectedRegion(e.target.value ? Number(e.target.value) : null)}
                          className="w-full px-4 py-2.5 md:py-3 rounded-app bg-white/5 border border-white/10 text-white outline-none focus:border-warning/50 transition-all font-bold text-sm md:text-base"
                          disabled={isLoadingRegions || !selectedCountry}
                        >
                          <option value="">{isLoadingRegions ? commonT('loading') : t('location_region_placeholder')}</option>
                          {availableRegions.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                      <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40">{t('location_custom_country')}</label>
                        <input
                          type="text"
                          value={customCountry}
                          onChange={(e) => setCustomCountry(e.target.value)}
                          className="w-full px-4 py-2.5 md:py-3 rounded-app bg-white/5 border border-white/10 text-white outline-none focus:border-warning/50 transition-all font-bold text-sm md:text-base"
                          placeholder={t('location_custom_country_placeholder')}
                        />
                        <p className="text-[10px] text-white/30 italic">{t('location_other_hint')}</p>
                      </div>
                 </div>

                 <Button type="submit" color="warning" className="w-full md:w-auto self-end px-12 bg-warning text-black font-black uppercase italic tracking-widest text-xs md:text-sm h-10 md:h-12" disabled={isLocationSubmitting}>
                   {isLocationSubmitting ? commonT('loading') : t('save_button')}
                 </Button>
               </form>
            </IceGlassCard>

            {/* Password Form */}
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
            </IceGlassCard>

            <div className="flex items-center justify-center gap-2 text-white/10 py-6 md:py-8 md:col-span-2">
               <CheckCircle2 className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">{t('encrypted_notice')}</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
