import React from 'react'
import { RegisterView } from '@/features/auth/components/RegisterView'
import { setRequestLocale } from 'next-intl/server'

export default async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <RegisterView />
}
