import { User } from '@/payload-types'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { JerseyAvatar } from '@/features/auth/components/JerseyAvatar'
import { Trophy, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface PlayerHeaderProps {
  user: User
  rank?: number | null
  className?: string
}

export function PlayerHeader({ user, rank, className }: PlayerHeaderProps) {
  const t = useTranslations('PlayerDetail')
  // Parse jersey settings or use defaults
  const jersey = user.jersey || {}

  return (
    <IceGlassCard className={cn('relative overflow-hidden', className)}>
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center gap-6 p-6 relative z-10">
        {/* Jersey Avatar - Large */}
        <div className="relative group perspective-1000">
          <div className="relative z-10 transform transition-transform duration-500 group-hover:rotate-y-12 group-hover:scale-105">
            <JerseyAvatar
              size={140}
              primaryColor={jersey.primaryColor || '#ef4444'}
              secondaryColor={jersey.secondaryColor || '#ffffff'}
              pattern={(jersey.pattern as any) || 'stripes'}
              number={jersey.number || '10'}
              style={(jersey.style as any) || 'classic'}
              className="drop-shadow-2xl"
            />
          </div>
          {/* Floor Reflection/Shadow */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-black/40 blur-md rounded-[100%]" />
        </div>

        {/* Player Info */}
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-3">
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter loading-none drop-shadow-sm">
              {user.username}
            </h1>
            {/* Country Badge (if available) */}
            {user.location?.country && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white/70 mb-1.5">
                <MapPin className="w-3 h-3 text-accent" />
                <span>
                  {typeof user.location.country === 'object'
                    ? user.location.country.name
                    : 'Unknown'}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium text-white/60">
            <span>{t('memberSince', { year: new Date(user.createdAt).getFullYear() })}</span>
            {/* Add more arbitrary info if needed */}
          </div>
        </div>

        {/* Global Rank Widget */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 min-w-[120px]">
          <span className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1">
            {t('rank')}
          </span>
          <div className="flex items-center gap-2">
            <Trophy
              className={cn(
                'w-5 h-5',
                rank === 1
                  ? 'text-yellow-400'
                  : rank === 2
                    ? 'text-gray-300'
                    : rank === 3
                      ? 'text-amber-600'
                      : 'text-slate-400',
              )}
            />
            <span className="text-3xl font-black text-white italic">#{rank || '--'}</span>
          </div>
        </div>
      </div>
    </IceGlassCard>
  )
}
