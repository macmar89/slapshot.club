'use client'

import React, { useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { Competition } from '@/payload-types'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { MiniLeagueRules } from './MiniLeagueRules'
import { GeneralRulesTab } from './GeneralRulesTab'
import { GdprTab } from './GdprTab'
import { PageLayout } from '@/components/layout/PageLayout'
import { PageHeader } from '@/components/layout/PageHeader'

interface RulesViewProps {
  competitions: Competition[]
}

export function RulesView({ competitions }: RulesViewProps) {
  const t = useTranslations('Rules')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // URL sync state
  const activeTab = searchParams.get('tab') || 'rules'

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams],
  )

  const handleTabChange = (value: string) => {
    const queryString = createQueryString('tab', value)
    router.replace(`${pathname}?${queryString}`, { scroll: false })
  }

  return (
    <PageLayout>
      <PageHeader title={t('title')} description={t('description')} />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="px-1 mb-4">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="rules">{t('tabs_rules')}</TabsTrigger>
            <TabsTrigger value="minileagues">{t('tabs_minileagues')}</TabsTrigger>
            <TabsTrigger value="gdpr">{t('tabs_gdpr')}</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="rules" className="mt-0">
          <GeneralRulesTab competitions={competitions} />
        </TabsContent>

        <TabsContent value="minileagues" className="mt-0">
          <MiniLeagueRules />
        </TabsContent>

        <TabsContent value="gdpr" className="mt-0">
          <GdprTab />
        </TabsContent>
      </Tabs>
    </PageLayout>
  )
}
