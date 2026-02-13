'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Settings2, Bell, Clock, Zap, Target, TrendingUp } from 'lucide-react'
import { IceGlassCard } from '@/components/ui/IceGlassCard'
import { Button } from '@/components/ui/Button'
import { Switch } from '@/components/ui/Switch'
import { updateNotificationSettingsAction, type NotificationSettingsData } from '../notification-actions'

interface NotificationSettingsFormProps {
  initialSettings?: NotificationSettingsData
  disabled?: boolean
}

export function NotificationSettingsForm({ initialSettings, disabled }: NotificationSettingsFormProps) {
  const t = useTranslations('Account.notifications')
  const commonT = useTranslations('Common')
  
  const [settings, setSettings] = useState<NotificationSettingsData>(initialSettings || {
    dailySummary: true,
    matchReminder: true,
    scoreChange: true,
    matchEnd: true,
    leaderboardUpdate: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleToggle = async (key: keyof NotificationSettingsData) => {
    if (disabled || isSubmitting) return
    
    const newSettings = {
      ...settings,
      [key]: !settings[key],
    }
    
    // Optimistic update
    setSettings(newSettings)
    setIsSubmitting(true)

    const res = await updateNotificationSettingsAction(newSettings)
    setIsSubmitting(false)

    if (res.ok) {
      toast.success(t('status_updated' as any) || commonT('success_title'), {
        id: 'settings-update', // Prevent toast stack
      })
    } else {
      // Revert on error
      setSettings(settings)
      toast.error(res.error || commonT('error_generic'))
    }
  }

  const settingItems = [
    { key: 'dailySummary', icon: Clock, color: 'text-warning' },
    { key: 'matchReminder', icon: Bell, color: 'text-blue-400' },
    { key: 'scoreChange', icon: Zap, color: 'text-emerald-400' },
    { key: 'matchEnd', icon: Target, color: 'text-red-400' },
    { key: 'leaderboardUpdate', icon: TrendingUp, color: 'text-purple-400' },
  ] as const

  return (
    <IceGlassCard backdropBlur="md" className="p-6 md:p-8 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold text-white flex items-center gap-2 italic uppercase tracking-tight">
          <Settings2 className="w-5 h-5 text-warning" />
          {t('settings_title')}
        </h3>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-3">
          {settingItems.map((item) => (
            <div 
              key={item.key}
              className={`flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 transition-all ${disabled || isSubmitting ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-white/10 cursor-pointer'}`}
              onClick={() => handleToggle(item.key)}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-slate-950/40 ${disabled ? 'text-white/20' : item.color}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className={`text-sm font-semibold ${disabled ? 'text-white/20' : 'text-white/80'}`}>
                  {t(item.key)}
                </span>
              </div>
              <Switch 
                checked={settings[item.key]} 
                onCheckedChange={() => handleToggle(item.key)}
                disabled={disabled || isSubmitting}
              />
            </div>
          ))}
        </div>
      </div>
    </IceGlassCard>
  )
}
