import React from 'react'
import { VerifyView } from '@/features/auth/components/VerifyView'
import { setRequestLocale } from 'next-intl/server'

export default async function VerifyPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ token?: string; email?: string }>
}) {
  const { locale } = await params
  const { token, email } = await searchParams

  setRequestLocale(locale)

  return <VerifyView token={token || ''} initialEmail={email || ''} />
}
