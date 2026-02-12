'use client'

import { useEffect, useRef } from 'react'
import OneSignal from 'react-onesignal'

interface OneSignalInitializerProps {
  userId?: string | null
}

export function OneSignalInitializer({ userId }: OneSignalInitializerProps) {
  const initialized = useRef(false)
  const currentUserId = useRef<string | null | undefined>(userId)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID

    if (!appId) {
      console.warn('OneSignal App ID is missing. Push notifications will not be initialized.')
      return
    }

    if (!userId) {
      return
    }

    const initOneSignal = async () => {
      try {
        if (!initialized.current) {
          const oneSignalConfig: any = {
            appId,
            allowLocalhostAsSecureOrigin: process.env.NODE_ENV === 'development',
            autoRegister: false,
            notifyButton: {
              enable: false,
            },
            welcomeNotification: {
              disable: true,
              message: '',
              title: ''
            },
            promptOptions: {
              slidedown: {
                prompts: [
                  {
                    type: 'push',
                    autoPrompt: false,
                  },
                ],
              },
            },
          }
          await OneSignal.init(oneSignalConfig)
          initialized.current = true
        }

        // Handle login/logout based on userId change
        if (userId && userId !== currentUserId.current) {
          await OneSignal.login(userId)
          currentUserId.current = userId
        } else if (!userId && currentUserId.current) {
          await OneSignal.logout()
          currentUserId.current = null
        }
      } catch (error) {
        console.error('Error initializing OneSignal:', error)
      }
    }

    initOneSignal()
  }, [userId])

  return null
}
