'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import OneSignal from 'react-onesignal'
import { Bell, BellOff, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { IceGlassCard } from '@/components/ui/IceGlassCard'

import { NotificationSettingsForm } from './NotificationSettingsForm'
import { updateNotificationSettingsAction, type NotificationSettingsData } from '../notification-actions'

interface NotificationSectionProps {
  userId?: string
  initialSettings?: NotificationSettingsData
}

export function NotificationSection({ userId, initialSettings }: NotificationSectionProps) {
  const t = useTranslations('Account.notifications')
  const [subscriptionStatus, setSubscriptionStatus] = useState<'subscribed' | 'unsubscribed' | 'blocked' | 'loading'>('loading')
  const [isInitializing, setIsInitializing] = useState(false)

  useEffect(() => {
    let retryCount = 0
    const maxRetries = 20 // 10 seconds total

    const checkStatus = async () => {
      try {
        const isSubscribed = (OneSignal.User.PushSubscription as any).id
        const permission = (OneSignal.Notifications as any).permission
        
        console.log('[NotificationSection] Checking status:', { permission, isSubscribed })
        
        if (permission === 'denied') {
          setSubscriptionStatus('blocked')
        } else {
          setSubscriptionStatus(isSubscribed ? 'subscribed' : 'unsubscribed')
        }
      } catch (error) {
        console.error('Error checking OneSignal status:', error)
        setSubscriptionStatus('unsubscribed')
      }
    }

    const pollForOneSignal = () => {
      if (typeof window !== 'undefined' && (window as any).OneSignal) {
        checkStatus()
      } else if (retryCount < maxRetries) {
        retryCount++
        setTimeout(pollForOneSignal, 500)
      } else {
        console.warn('[NotificationSection] OneSignal not found after retries')
        setSubscriptionStatus('unsubscribed')
      }
    }

    pollForOneSignal()
  }, [])

  const handleEnableNotifications = async () => {
    console.log('[NotificationSection] handleEnableNotifications called')
    try {
      console.log('[NotificationSection] Requesting OneSignal permission...')
      await OneSignal.Notifications.requestPermission()
      
      const isSubscribed = (OneSignal.User.PushSubscription as any).id
      const permission = (OneSignal.Notifications as any).permission
      
      console.log('[NotificationSection] Permission result:', permission)
      console.log('[NotificationSection] Subscription ID:', isSubscribed)
      
      if (permission === 'denied') {
        setSubscriptionStatus('blocked')
      } else {
        const status = isSubscribed ? 'subscribed' : 'unsubscribed'
        setSubscriptionStatus(status)
        
        // Explicitly login to link External ID (Payload userId) with the subscription
        if (status === 'subscribed' && userId) {
          setIsInitializing(true)
          console.log('[NotificationSection] Linking External ID:', userId)
          try {
            await OneSignal.login(userId)
            
            // Initialize backend settings record if newly subscribed
            await updateNotificationSettingsAction({
              dailySummary: false,
              matchReminder: false,
              scoreChange: false,
              matchEnd: false,
              leaderboardUpdate: false,
            })
            // Re-fetch data to reflect changes in UI
            window.location.reload()
          } catch (err) {
            console.error('[NotificationSection] Initialization failed:', err)
            setIsInitializing(false)
          }
        }
      }
    } catch (error) {
      console.error('[NotificationSection] Error requesting notification permission:', error)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <IceGlassCard className="p-6 md:p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-white flex items-center gap-2 italic uppercase tracking-tight">
            <Bell className="w-5 h-5 text-warning" />
            {t('title')}
          </h3>
          <p className="text-white/60 text-sm leading-relaxed">
            {t('description')}
          </p>
        </div>

        <div className="flex flex-col gap-4 p-4 rounded-xl bg-slate-950/40 border border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-white/40 text-xs font-bold uppercase tracking-wider">
              {t('status_label')}
            </span>
            <div className="flex items-center gap-2">
              {(subscriptionStatus === 'subscribed' || isInitializing) && (
                <span className={`${isInitializing ? 'text-warning select-none animate-pulse' : 'text-emerald-400'} text-xs font-bold flex items-center gap-1.5 bg-emerald-400/10 px-2.5 py-1 rounded-full`}>
                  {isInitializing ? (
                    <div className="w-3.5 h-3.5 border-2 border-warning border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  {isInitializing ? 'Inicializácia...' : t('status_subscribed')}
                </span>
              )}
              {subscriptionStatus === 'unsubscribed' && (
                <span className="text-warning text-xs font-bold flex items-center gap-1.5 bg-warning/10 px-2.5 py-1 rounded-full">
                  <BellOff className="w-3.5 h-3.5" />
                  {t('status_unsubscribed')}
                </span>
              )}
              {subscriptionStatus === 'blocked' && (
                <span className="text-red-400 text-xs font-bold flex items-center gap-1.5 bg-red-400/10 px-2.5 py-1 rounded-full">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {t('status_blocked')}
                </span>
              )}
              {subscriptionStatus === 'loading' && (
                <div className="h-6 w-20 bg-white/5 animate-pulse rounded-full" />
              )}
            </div>
          </div>

          {subscriptionStatus === 'unsubscribed' && (
            <Button 
              onClick={handleEnableNotifications}
              className="w-full bg-warning hover:bg-warning/90 text-slate-950 font-black italic uppercase tracking-tighter"
            >
              {t('enable_button')}
            </Button>
          )}

          {subscriptionStatus === 'blocked' && (
            <p className="text-red-400/80 text-[10px] italic leading-tight bg-red-400/5 p-2 rounded-lg border border-red-400/10">
              {t('permission_denied_hint')}
            </p>
          )}
        </div>
      </IceGlassCard>
      
      <NotificationSettingsForm 
        initialSettings={initialSettings} 
        disabled={subscriptionStatus !== 'subscribed'} 
      />
    </div>
  )
}
