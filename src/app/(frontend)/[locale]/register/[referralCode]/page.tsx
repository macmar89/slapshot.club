import React, { use } from 'react'
import { RegisterView } from '@/features/auth/components/RegisterView'
import { setRequestLocale } from 'next-intl/server'

export default function RegisterWithCodePage(props: { params: Promise<{ locale: string, referralCode: string }> }) {
  const params = use(props.params)
  const { locale, referralCode } = params
  setRequestLocale(locale)
  return <RegisterView referralCode={referralCode} />
}
