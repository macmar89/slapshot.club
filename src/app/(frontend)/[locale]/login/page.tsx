import React from 'react'
import { LoginView } from '@/features/auth/components/LoginView'
import { setRequestLocale } from 'next-intl/server'

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <LoginView />
}
