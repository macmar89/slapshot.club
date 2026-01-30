'use client'

import React from 'react'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { Users, Crown, Shield, Info } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function MiniLeagueRules() {
  const t = useTranslations('MiniLeagueRules')

  const rich = {
    r: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
  }

  return (
    <IceGlassCard className="p-4 md:p-8 space-y-8" backdropBlur="lg">
      <section>
        <div className="flex items-center gap-3 px-1 pb-6">
          <Users className="w-5 h-5 text-warning" />
          <h2 className="text-xl font-bold uppercase tracking-wider text-white">
            {t('subscriptions_title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/5">
            <h3 className="text-xl font-bold text-white mb-4">{t('subscription_free_title')}</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex gap-2">
                <span className="text-destructive font-bold">✕</span>{' '}
                {t('subscription_free_cannot_create')}
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 font-bold">✓</span>{' '}
                {t('subscription_free_max_joined')}
              </li>
            </ul>
          </div>

          {/* Pro */}
          <div className="bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-blue-400" />
              <h3 className="text-xl font-bold text-blue-100">{t('subscription_pro_title')}</h3>
            </div>
            <ul className="space-y-3 text-sm text-blue-100/70">
              <li className="flex gap-2">
                <span className="text-emerald-400 font-bold">✓</span>{' '}
                {t('subscription_pro_max_created')}
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 font-bold">✓</span>{' '}
                {t('subscription_pro_max_active')}
              </li>
              <li className="flex gap-2">
                <span className="text-blue-300 font-bold">ℹ</span>{' '}
                {t('subscription_pro_captain_tag')}
              </li>
              <li className="flex gap-2">
                <span className="text-blue-300 font-bold">ℹ</span>{' '}
                {t('subscription_pro_assistant_tag')}
              </li>
            </ul>
          </div>

          {/* VIP */}
          <div className="bg-gradient-to-br from-warning/10 to-transparent rounded-xl p-6 border border-warning/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Crown className="w-24 h-24 rotate-12" />
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-5 h-5 text-warning" />
              <h3 className="text-xl font-bold text-warning">{t('subscription_vip_title')}</h3>
            </div>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex gap-2">
                <span className="text-warning font-bold">✓</span>{' '}
                {t('subscription_vip_max_created')}
              </li>
              <li className="flex gap-2">
                <span className="text-warning font-bold">✓</span> {t('subscription_vip_max_active')}
              </li>
              <li className="flex gap-2">
                <span className="text-warning font-bold">ℹ</span> {t('subscription_vip_both_tags')}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-black uppercase text-white mb-4 flex items-center gap-3">
          <Info className="w-5 h-5 text-white/50" />
          {t('capacity_title')}
        </h2>
        <div className="bg-black/20 rounded-xl p-6 border border-white/5">
          <p className="text-white/80 leading-relaxed max-w-2xl">
            {t.rich('capacity_description', rich)}
          </p>
          <div className="mt-4 p-4 bg-warning/5 border border-warning/10 rounded-lg">
            <p className="text-warning font-bold text-lg mb-2">{t('capacity_rule_title')}</p>
            <ul className="text-white/70 text-sm space-y-2">
              <li>• {t.rich('capacity_rule_pro', rich)}</li>
              <li>• {t.rich('capacity_rule_vip', rich)}</li>
            </ul>
            <p className="text-white/40 text-xs mt-2 italic">{t('capacity_hint')}</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-black uppercase text-white mb-4">{t('owner_rights_title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="font-bold text-white mb-1">{t('owner_right_invite_title')}</h4>
            <p className="text-xs text-white/50">{t('owner_right_invite_desc')}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="font-bold text-white mb-1">{t('owner_right_approval_title')}</h4>
            <p className="text-xs text-white/50">{t('owner_right_approval_desc')}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="font-bold text-white mb-1">{t('owner_right_management_title')}</h4>
            <p className="text-xs text-white/50">{t('owner_right_management_desc')}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="font-bold text-white mb-1">{t('owner_right_transfer_title')}</h4>
            <p className="text-xs text-white/50">{t('owner_right_transfer_desc')}</p>
          </div>
        </div>
      </section>
    </IceGlassCard>
  )
}
