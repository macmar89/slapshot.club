import { SettingsView } from '@/features/settings/components/SettingsView'
import { setRequestLocale } from 'next-intl/server'

export default async function CompetitionSettingsPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <SettingsView />
}
