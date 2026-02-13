'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { UserCog } from 'lucide-react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { ProfileOverview } from './sections/ProfileOverview'
import { UsernameForm } from './sections/UsernameForm'
import { EmailSection } from './sections/EmailSection'
import { LocationForm } from './sections/LocationForm'
import { SecurityForm } from './sections/SecurityForm'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { NotificationSection } from '@/features/notifications/components/NotificationSection'

interface AccountViewProps {
  user: {
    id: string
    username: string
    email: string
    location?: {
      country?: number | { id: number; name: string } | null
      region?: number | { id: number; name: string } | null
      customCountry?: string | null
    }
    jersey?: {
      primaryColor?: string
      secondaryColor?: string
      pattern?: string
      number?: string
      style?: string
    }
    referralData?: {
      referralCode?: string
      stats?: {
        totalRegistered?: number
        totalPaid?: number
      }
    }
    notificationSettings?: {
      dailySummary: boolean
      matchReminder: boolean
      scoreChange: boolean
      matchEnd: boolean
      leaderboardUpdate: boolean
    }
    role?: string
  }
  countries: Array<{ id: number; name: string; code: string }>
}

export function AccountView({ user: initialUser, countries }: AccountViewProps) {
  const t = useTranslations('Account')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [user, setUser] = useState(initialUser)

  const activeTab = searchParams.get('tab') || 'profile'
  const isAdmin = user.role === 'admin'

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', value)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const handleUsernameUpdated = (newUsername: string) => {
    setUser((prev) => ({ ...prev, username: newUsername }))
  }

  return (
    <div className="py-8 md:py-24 animate-in fade-in duration-700">
      <Container className="max-w-4xl">
        <div className="flex flex-col gap-6 md:gap-6">
          <Tabs 
            value={activeTab} 
            onValueChange={handleTabChange}
            className="w-full"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
              <div className="flex flex-col gap-1.5 text-center md:text-left">
                <h1 className="text-2xl md:text-5xl font-black text-white italic uppercase tracking-tighter flex items-center justify-center md:justify-start gap-3 md:gap-4 leading-none">
                  <UserCog className="w-6 h-6 md:w-10 md:h-10 text-warning" />
                  {t('title')}
                </h1>
              </div>
            </div>

            {isAdmin && (
              <div className="px-1 mb-8">
                <TabsList className="bg-white/5 border border-white/10 p-1 backdrop-blur-md w-full grid grid-cols-2 h-auto">
                  <TabsTrigger
                    value="profile"
                    className="data-[state=active]:bg-warning data-[state=active]:text-black text-white/50 text-[10px] sm:text-xs md:text-base px-1 sm:px-4 py-3 sm:py-2.5 uppercase font-black tracking-wider sm:tracking-widest cursor-pointer transition-all hover:text-white truncate"
                  >
                    {t('tabs.profile')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="data-[state=active]:bg-warning data-[state=active]:text-black text-white/50 text-[10px] sm:text-xs md:text-base px-1 sm:px-4 py-3 sm:py-2.5 uppercase font-black tracking-wider sm:tracking-widest cursor-pointer transition-all hover:text-white truncate"
                  >
                    {t('tabs.notifications')}
                  </TabsTrigger>
                </TabsList>
              </div>
            )}

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <TabsContent value="profile">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <ProfileOverview user={user} />

                  <UsernameForm
                    initialUsername={user.username}
                    onUsernameUpdated={handleUsernameUpdated}
                  />

                  <EmailSection email={user.email} />

                  <LocationForm
                    initialCountry={user.location?.country}
                    initialRegion={user.location?.region}
                    initialCustomCountry={user.location?.customCountry}
                    countries={countries}
                  />

                  <SecurityForm />
                </div>
              </TabsContent>

              {isAdmin && (
                <TabsContent value="notifications">
                  <div className="max-w-2xl mx-auto w-full">
                    <NotificationSection 
                      userId={user.id}
                      initialSettings={user.notificationSettings} 
                    />
                  </div>
                </TabsContent>
              )}
            </div>
          </Tabs>
        </div>
      </Container>
    </div>
  )
}
