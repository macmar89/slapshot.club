import type { Competition } from '@/payload-types'
import { IceGlassCard } from '@/components/ui/IceGlassCard'

interface CompetitionSummaryProps {
  competition: Competition
  locale: string
}

export function CompetitionSummary({ competition, locale }: CompetitionSummaryProps) {
  return (
    <IceGlassCard className="p-6" withGradient>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-sm font-black uppercase tracking-widest text-white/60">
            Informácie o súťaži
          </h2>
          <p className="text-[11px] text-white/40 leading-relaxed italic">
            Body za tipy sú pripisované automaticky po skončení zápasu.{' '}
            <strong className="text-white/60">Presný:</strong> 5b,{' '}
            <strong className="text-white/60">Rozdiel:</strong> 3b,{' '}
            <strong className="text-white/60">Víťaz:</strong> 2b.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-app bg-white/5 border border-white/10 text-center min-w-[120px]">
            <div className="text-[9px] text-white/40 font-bold uppercase">Koniec sezóny</div>
            <div className="text-xs font-black text-white">
              {new Date(competition.endDate).toLocaleDateString(locale)}
            </div>
          </div>
          <div className="px-4 py-2 rounded-app bg-yellow-500/10 border border-yellow-500/20 text-center min-w-[120px]">
            <div className="text-[9px] text-yellow-500/60 font-bold uppercase">Stav</div>
            <div className="text-xs font-black text-yellow-500 uppercase">{competition.status}</div>
          </div>
        </div>
      </div>
    </IceGlassCard>
  )
}
