import { RulesView } from '@/features/rules/components/RulesView'
import { getCompetitionsAction } from '@/features/rules/actions'
import { setRequestLocale } from 'next-intl/server'

export default async function RulesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const competitions = await getCompetitionsAction()

  return <RulesView competitions={competitions} />
}
