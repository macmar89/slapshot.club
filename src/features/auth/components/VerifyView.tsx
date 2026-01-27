'use client'

import React, { useEffect, useState } from 'react'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { Button } from '@/components/ui/Button'
import { verifyUser, resendVerification } from '@/features/auth/actions'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/routing'
import { Loader2, CheckCircle2, XCircle, Send } from 'lucide-react'

interface VerifyViewProps {
  token: string
  initialEmail?: string
}

export const VerifyView = ({ token, initialEmail }: VerifyViewProps) => {
  const t = useTranslations('Auth')
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [isResending, setIsResending] = useState(false)
  const [resendDone, setResendDone] = useState(false)
  const [email, setEmail] = useState<string | null>(initialEmail || null)
  const hasStartedVerification = React.useRef(false)

  useEffect(() => {
    const performVerification = async () => {
      if (hasStartedVerification.current) return
      hasStartedVerification.current = true

      try {
        const res = await verifyUser(token)

        if (res.ok) {
          setStatus('success')
        } else {
          const resData = res.data as any
          console.error('Verification failed:', resData?.errors || resData)
          setStatus('error')
          // Try to get email from response to allow resending
          if (resData?.user?.email) {
            setEmail(resData.user.email)
          } else if (resData?.email) {
            setEmail(resData.email)
          }
        }
      } catch (err) {
        console.error('Unexpected verification error:', err)
        setStatus('error')
      }
    }

    if (token) {
      performVerification()
    } else {
      setStatus('error')
    }
  }, [token, initialEmail])

  const handleResend = async () => {
    if (!email) return
    setIsResending(true)
    try {
      const res = await resendVerification(email)
      if (res.ok) {
        setResendDone(true)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-6 bg-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold filter blur-[160px] animate-pulse-slow rounded-full opacity-50" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-dark filter blur-[160px] animate-pulse-slow delay-700 rounded-full opacity-30" />
      </div>

      <IceGlassCard className="w-full max-w-md p-2 sm:p-4 z-10" backdropBlur="xl">
        <div className="flex flex-col items-center w-full bg-white/5 rounded-2xl p-8 sm:p-12 border border-white/5 shadow-inner relative z-10 text-center">
          <div className="space-y-6 w-full">
            <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-tight">
              {t('verify_title')}
            </h1>

            <div className="flex flex-col items-center gap-4 py-4">
              {status === 'loading' && (
                <>
                  <Loader2 className="w-16 h-16 text-gold animate-spin" />
                  <p className="text-white/60 font-medium animate-pulse">
                    Overujem tvoju súpisku...
                  </p>
                </>
              )}

              {status === 'success' && (
                <>
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <p className="text-white/80 font-medium">{t('verify_success')}</p>
                  <Button
                    color="gold"
                    className="w-full mt-4"
                    onClick={() => router.push('/login')}
                  >
                    {t('verify_button')}
                  </Button>
                </>
              )}

              {status === 'error' && (
                <>
                  <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                    <XCircle className="w-10 h-10 text-red-500" />
                  </div>
                  <p className="text-white/80 font-medium">{t('verify_error')}</p>

                  {resendDone ? (
                    <div className="bg-gold/10 border border-gold/20 text-gold px-4 py-2 rounded-app text-sm font-medium w-full animate-in fade-in slide-in-from-bottom-2">
                      {t('verification_sent')}
                    </div>
                  ) : email ? (
                    <Button
                      color="gold"
                      variant="ghost"
                      className="w-full border border-gold/20 hover:bg-gold/10"
                      onClick={handleResend}
                      disabled={isResending}
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('resending')}
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          {t('resend_verification')}
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      color="gold"
                      variant="ghost"
                      className="w-full border border-gold/20 hover:bg-gold/10"
                      onClick={() => router.push('/register')}
                    >
                      {t('register_again')}
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    className="w-full border border-white/10 text-white hover:bg-white/5"
                    onClick={() => router.push('/login')}
                  >
                    {t('back_to_login')}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </IceGlassCard>
    </div>
  )
}
