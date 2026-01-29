import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/Button'
import { MiniLeagueRules } from '@/features/rules/components/MiniLeagueRules'

export default function MiniLeagueRulesPage() {
  return (
    <div className="min-h-[calc(100dvh-5rem)] p-4 md:p-8 pt-24 max-w-4xl mx-auto space-y-8">
      
      <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tighter drop-shadow-lg">
             Pravidlá Mini Líg
          </h1>
          <Link href="/dashboard">
              <Button variant="ghost" className="text-white/50 hover:text-white uppercase tracking-wider font-bold">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Späť
              </Button>
          </Link>
      </div>

      <MiniLeagueRules />
    </div>
  )
}
