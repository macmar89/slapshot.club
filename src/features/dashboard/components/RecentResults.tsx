import type { Prediction } from '@/payload-types'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { cn } from '@/lib/utils'

interface RecentResultsProps {
  recentPredictions: Prediction[]
}

export function RecentResults({ recentPredictions }: RecentResultsProps) {
  return (
    <IceGlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-black uppercase tracking-widest text-white/60">
          Posledné výsledky
        </h2>
        <div className="flex gap-1">
          {recentPredictions.map((pred) => {
            const points = pred.points || 0
            let color = 'bg-white/10'
            if (points >= 5) color = 'bg-green-500'
            else if (points > 0) color = 'bg-yellow-500'
            else color = 'bg-red-500'

            return (
              <div
                key={pred.id}
                className={cn('w-2 h-2 rounded-full', color)}
                title={`${points} b`}
              />
            )
          })}
        </div>
      </div>

      <div className="space-y-4">
        {recentPredictions.length > 0 ? (
          recentPredictions.map((pred) => (
            <div
              key={pred.id}
              className="flex items-center justify-between p-3 rounded-app bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-[10px] font-black italic text-white/40 uppercase w-12 truncate">
                  {(pred.match as any).homeTeam.shortName} vs{' '}
                  {(pred.match as any).awayTeam.shortName}
                </div>
                <div className="text-xs font-bold text-white">
                  {pred.homeGoals}:{pred.awayGoals}
                </div>
              </div>
              <div
                className={cn(
                  'text-xs font-black',
                  (pred.points || 0) > 0 ? 'text-yellow-500' : 'text-white/40',
                )}
              >
                +{pred.points || 0} bodov
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-white/20 text-xs font-bold uppercase tracking-[0.2em]">
            Zatiaľ žiadne výsledky
          </div>
        )}
      </div>
    </IceGlassCard>
  )
}
