import React from 'react'
import { ForgotPasswordView } from '@/features/auth/components/ForgotPasswordView'
import { setRequestLocale } from 'next-intl/server'

export default async function ForgotPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ForgotPasswordView />
}
