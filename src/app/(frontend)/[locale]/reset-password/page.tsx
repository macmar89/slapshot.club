import React from 'react'
import { ResetPasswordView } from '@/features/auth/components/ResetPasswordView'
import { setRequestLocale } from 'next-intl/server'

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ResetPasswordView />
}
