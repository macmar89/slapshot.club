'use client'

import React from 'react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { logoutUser } from '../actions'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

export function LogoutButton() {
  const router = useRouter()
  const t = useTranslations('Auth')

  const handleLogout = async () => {
    try {
      const res = await logoutUser()
      if (res.ok) {
        router.push('/login')
        router.refresh()
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <Button
      variant="ghost"
      color="destructive"
      size="sm"
      onClick={handleLogout}
      className="gap-2 border border-destructive/20 text-destructive hover:bg-destructive/10 transition-colors"
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden sm:inline">{t('logout')}</span>
    </Button>
  )
}
