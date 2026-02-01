import { Competition } from '@/payload-types'
import { IceGlassCard } from '@/components/ui/IceGlassCard'

interface DashboardHeaderProps {
  competition: Competition
}

export function DashboardHeader({ competition }: DashboardHeaderProps) {
  return (
    <IceGlassCard className="lg:col-span-8 p-4 md:p-8 flex flex-col justify-center" withGradient>
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tight leading-none">
          {competition.name}
        </h1>
        <p className="text-white/60 text-lg max-w-2xl leading-relaxed">{competition.description}</p>
      </div>
    </IceGlassCard>
  )
}
