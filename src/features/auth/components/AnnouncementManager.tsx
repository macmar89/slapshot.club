'use client'

import React, { useState, useEffect } from 'react'
import { OnboardingModal } from './OnboardingModal'
import { AnnouncementModal } from './AnnouncementModal'
import { Trophy } from 'lucide-react'

interface User {
  id: string
  hasSeenOnboarding?: boolean
  seenAnnouncements?: { announcementId: string }[]
  [key: string]: any
}

interface AnnouncementManagerProps {
  user: User | null
  announcements?: any[]
}

type ModalItem =
  | { type: 'onboarding' }
  | {
      type: 'announcement'
      id: string
      title: string
      description: string
      icon?: React.ReactNode
      buttonText?: string
      image?: any
    }

export const AnnouncementManager = ({ user, announcements = [] }: AnnouncementManagerProps) => {
  const [queue, setQueue] = useState<ModalItem[]>([])
  const [currentModal, setCurrentModal] = useState<ModalItem | null>(null)

  useEffect(() => {
    if (!user) return

    const newQueue: ModalItem[] = []

    // 1. Check for Onboarding
    if (user.hasSeenOnboarding !== true) {
      newQueue.push({ type: 'onboarding' })
    }

    // 2. Check for dynamic announcements
    const seenAnnouncements = user.seenAnnouncements || []

    const seenMap = new Map(
      seenAnnouncements.map((a: any) => [a.announcementId, a.displayCount || 1]),
    )
    const userRole = (user as any).role
    const userPoints = (user as any).stats?.totalPoints || 0

    announcements.forEach((ann) => {
      const displayCount = seenMap.get(ann.id) || 0
      const maxDisplays = ann.maxDisplaysPerUser || 1 // 1 is default, 0 is infinite

      // Check display frequency
      if (maxDisplays !== 0 && displayCount >= maxDisplays) {
        return
      }

      // Check targeting: Roles
      if (ann.targeting?.targetRoles?.length > 0 && !ann.targeting.targetRoles.includes(userRole)) {
        return
      }

      // Check targeting: Points
      if (ann.targeting?.minPoints !== undefined && userPoints < ann.targeting.minPoints) return
      if (ann.targeting?.maxPoints !== undefined && userPoints > ann.targeting.maxPoints) return

      newQueue.push({
        type: 'announcement',
        id: ann.id,
        title: ann.title,
        description: ann.content,
        buttonText: ann.buttonText,
        image: ann.image,
        icon: ann.icon === 'trophy' ? <Trophy className="text-gold" /> : undefined,
      })
    })

    if (newQueue.length > 0) {
      setQueue(newQueue)
    }
  }, [user, announcements])

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
          buttonText={currentModal.buttonText}
          image={currentModal.image}
          isOpen={true}
          onClose={handleClose}
        />
      )}
    </>
  )
}
