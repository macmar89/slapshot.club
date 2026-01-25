'use client'

import React, { useState, useEffect } from 'react'
import { OnboardingModal } from './OnboardingModal'
import { AnnouncementModal } from './AnnouncementModal'

interface User {
  id: string
  hasSeenOnboarding?: boolean
  seenAnnouncements?: { announcementId: string }[]
  [key: string]: any
}

interface AnnouncementManagerProps {
  user: User | null
}

type ModalItem =
  | { type: 'onboarding' }
  | { type: 'announcement'; id: string; title: string; description: string; icon?: React.ReactNode }

export const AnnouncementManager = ({ user }: AnnouncementManagerProps) => {
  const [queue, setQueue] = useState<ModalItem[]>([])
  const [currentModal, setCurrentModal] = useState<ModalItem | null>(null)

  useEffect(() => {
    console.log('[AnnouncementManager] User state changed:', user)
    if (!user) return

    const newQueue: ModalItem[] = []

    console.log('[AnnouncementManager] hasSeenOnboarding:', user.hasSeenOnboarding)

    // 1. Check for Onboarding
    if (user.hasSeenOnboarding !== true) {
      console.log('[AnnouncementManager] Adding onboarding to queue')
      newQueue.push({ type: 'onboarding' })
    }

    // 2. Future: Check for generic announcements (e.g. from global state or API)
    // Example: if (hasNewBadge) newQueue.push({ type: 'announcement', id: 'badge-1', ... })

    if (newQueue.length > 0) {
      setQueue(newQueue)
    }
  }, [user])

  // Process queue
  useEffect(() => {
    if (!currentModal && queue.length > 0) {
      const timer = setTimeout(() => {
        setCurrentModal(queue[0])
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [queue, currentModal])

  const handleClose = () => {
    setCurrentModal(null)
    setQueue((prev) => prev.slice(1))
  }

  if (!user || !currentModal) return null

  return (
    <>
      {currentModal.type === 'onboarding' && (
        <OnboardingModal isOpen={true} onClose={handleClose} />
      )}

      {currentModal.type === 'announcement' && (
        <AnnouncementModal
          id={currentModal.id}
          title={currentModal.title}
          description={currentModal.description}
          icon={currentModal.icon}
          isOpen={true}
          onClose={handleClose}
        />
      )}
    </>
  )
}
