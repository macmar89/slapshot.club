'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { UserCog } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { ProfileOverview } from './sections/ProfileOverview'
import { UsernameForm } from './sections/UsernameForm'
import { EmailSection } from './sections/EmailSection'
import { LocationForm } from './sections/LocationForm'
import { SecurityForm } from './sections/SecurityForm'

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
  }
  countries: Array<{ id: number; name: string; code: string }>
}

export function AccountView({ user: initialUser, countries }: AccountViewProps) {
  const t = useTranslations('Account')
  const [user, setUser] = useState(initialUser)

  const handleUsernameUpdated = (newUsername: string) => {
    setUser((prev) => ({ ...prev, username: newUsername }))
  }

  return (
    <div className="py-8 md:py-24 animate-in fade-in duration-700">
      <Container className="max-w-4xl">
        <div className="flex flex-col gap-6 md:gap-8">
          <div className="flex flex-col gap-1.5 mb-2 md:mb-4 text-center md:text-left">
            <h1 className="text-2xl md:text-5xl font-black text-white italic uppercase tracking-tighter flex items-center justify-center md:justify-start gap-3 md:gap-4">
              <UserCog className="w-6 h-6 md:w-10 md:h-10 text-warning" />
              {t('title')}
            </h1>
            <p className="text-white/40 text-[10px] md:text-lg font-medium italic uppercase tracking-[0.2em] md:tracking-widest">
              {t('subtitle')}
            </p>
          </div>

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
        </div>
      </Container>
    </div>
  )
}
