import React from 'react'
import { User, Mail } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { ReferralLink } from '../ReferralLink'

interface ProfileOverviewProps {
  user: {
    username: string
    email: string
    referralData?: {
      referralCode?: string
    }
  }
}

export function ProfileOverview({ user }: ProfileOverviewProps) {
  const t = useTranslations('Account')
  const code = user.referralData?.referralCode

  return (
    <IceGlassCard backdropBlur="md" className="p-6 md:p-8 border-warning/20 md:col-span-2">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-warning/20 border border-warning/30 flex items-center justify-center shadow-[0_0_30px_-5px_rgba(var(--warning-rgb),0.4)]">
            <User className="w-8 h-8 md:w-10 md:h-10 text-warning" />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight italic">{user.username}</h2>
            <p className="text-white/40 flex items-center justify-center md:justify-start gap-2 font-bold uppercase tracking-widest text-[10px] md:text-sm">
              <Mail className="w-3 h-3 md:w-4 md:h-4 text-warning" />
              {user.email}
            </p>
          </div>
        </div>

        {code && <ReferralLink code={code} />}
      </div>
    </IceGlassCard>
  )
}
