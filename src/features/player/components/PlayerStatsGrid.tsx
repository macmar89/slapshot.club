import { PlayerStats } from '@/lib/api/player'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { Target, TrendingUp, Zap, BarChart3, Calculator } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface PlayerStatsGridProps {
  stats: PlayerStats | null
  className?: string
}

export function PlayerStatsGrid({ stats, className }: PlayerStatsGridProps) {
  const t = useTranslations('PlayerDetail')
  if (!stats) return null

  const items = [
    {
      label: t('avgPoints'),
      value: stats.averagePoints.toFixed(2),
      icon: Calculator,
      color: 'text-blue-400',
      desc: t('descPoints'),
    },
    {
      label: t('sniperRate'),
      value: stats.exactGuesses.toString(),
      icon: Target,
      color: 'text-red-500',
      desc: t('descSniper'),
    },
    {
      label: t('trendRate'),
      value: `${stats.trendRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-green-500',
      desc: t('descTrend'),
    },
    {
      label: t('successRate'),
      value: `${stats.successRate.toFixed(1)}%`,
      icon: Zap,
      color: 'text-yellow-400',
      desc: t('descSuccess'),
    },
  ]

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
      {items.map((item, i) => (
        <IceGlassCard
          key={i}
          className="p-4 group transition-all hover:bg-white/5"
          contentClassName="flex flex-col items-center justify-center text-center"
        >
          <div
            className={cn(
              'w-10 h-10 flex items-center justify-center rounded-full bg-white/5 mb-3 group-hover:scale-110 transition-transform',
              item.color,
            )}
          >
            <item.icon size={20} />
          </div>

          <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1">
            {item.label}
          </div>

          <div className="text-2xl font-black text-white italic mb-1">{item.value}</div>

          <div className="text-[9px] text-white/30 font-medium">{item.desc}</div>
        </IceGlassCard>
      ))}

      {/* Detailed break-down row if needed later */}
    </div>
  )
}
