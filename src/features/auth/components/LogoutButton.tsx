'use client'

import React from 'react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { logoutUser } from '../actions'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

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
      size="sm"
      onClick={handleLogout}
      className="text-white/50 hover:text-white hover:bg-white/10 gap-2"
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden sm:inline">Odhlásiť sa</span>
    </Button>
  )
}
