import { RulesView } from '@/features/rules/components/RulesView'
import { setRequestLocale } from 'next-intl/server'
import { getCompetitionsAction } from '@/features/rules/actions'

export default async function CompetitionRulesPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const competitions = await getCompetitionsAction(slug)

  return <RulesView competitions={competitions} />
}
