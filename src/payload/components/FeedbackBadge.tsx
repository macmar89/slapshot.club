'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

/**
 * FeedbackBadge Component
 * 
 * This component handles displaying unread/new counts in the Payload Admin sidebar.
 * Since Payload 3.0 uses Next.js and server components for many things,
 * we use a client component that polls or fetches counts and injects them into the DOM
 * next to the Feedback sidebar link.
 */
export const FeedbackBadge: React.FC = () => {
  const [counts, setCounts] = useState<{ unread: number; newCount: number }>({ unread: 0, newCount: 0 })
  const pathname = usePathname()

  const fetchCounts = async () => {
    try {
      // We'll use the REST API to fetch counts
      const res = await fetch('/api/feedback?where[read][equals]=false&limit=0')
      const data = await res.json()
      const unreadCount = data.totalDocs

      const resNew = await fetch('/api/feedback?where[status][equals]=new&limit=0')
      const dataNew = await resNew.json()
      const newCount = dataNew.totalDocs

      setCounts({ unread: unreadCount, newCount })
    } catch (error) {
      console.error('Failed to fetch feedback counts:', error)
    }
  }

  useEffect(() => {
    // Only run in admin
    if (!pathname.startsWith('/admin')) return

    fetchCounts()
    const interval = setInterval(fetchCounts, 30000) // Poll every 30 seconds

    return () => clearInterval(interval)
  }, [pathname])

  useEffect(() => {
    // Only run in admin
    if (!pathname.startsWith('/admin')) return

    let observer: MutationObserver | null = null

    const updateBadge = () => {
      // Find the Nav element to be more specific if possible
      const nav = document.querySelector('nav')
      if (!nav) return

      const navLinks = nav.querySelectorAll('a, button')
      let changed = false

      navLinks.forEach((link) => {
        // We look for a link that has "Feedback" text but NOT our badge text
        // to avoid matching our own badge
        const linkText = link.textContent || ''
        if (linkText.includes('Feedback')) {
          let badge = link.querySelector('.feedback-sidebar-badge') as HTMLElement
          const badgeText = `${counts.newCount}/${counts.unread}`
          const shouldShow = counts.unread > 0 || counts.newCount > 0

          if (!badge) {
            badge = document.createElement('span')
            badge.className = 'feedback-sidebar-badge'
            Object.assign(badge.style, {
              marginLeft: '8px',
              padding: '2px 6px',
              borderRadius: '10px',
              fontSize: '10px',
              fontWeight: 'bold',
              backgroundColor: counts.newCount > 0 ? 'var(--theme-error-400)' : 'var(--theme-elevation-200)',
              color: counts.newCount > 0 ? 'white' : 'var(--theme-elevation-800)',
            })
            
            // Disconnect to avoid infinite loop when appending
            if (observer) observer.disconnect()
            link.appendChild(badge)
            changed = true
          }

          if (badge.textContent !== badgeText) {
            badge.textContent = badgeText
            changed = true
          }

          const currentDisplay = shouldShow ? 'inline-block' : 'none'
          if (badge.style.display !== currentDisplay) {
            badge.style.display = currentDisplay
            changed = true
          }
          
          if (counts.newCount > 0) {
            badge.style.backgroundColor = 'var(--theme-error-400)'
            badge.style.color = 'white'
          } else {
            badge.style.backgroundColor = 'var(--theme-elevation-200)'
            badge.style.color = 'var(--theme-elevation-800)'
          }
        }
      })

      // If we modified the DOM, we need to re-observe if we disconnected
      if (changed && observer) {
        observer.observe(document.body, { childList: true, subtree: true })
      }
    }

    updateBadge()
    
    observer = new MutationObserver((mutations) => {
      // Avoid re-triggering on our own changes if we can
      const isOurChange = mutations.every(m => 
        (m.target as HTMLElement).classList?.contains('feedback-sidebar-badge') ||
        (m.target as HTMLElement).parentElement?.querySelector('.feedback-sidebar-badge') === m.target
      )
      if (!isOurChange) {
        updateBadge()
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      if (observer) observer.disconnect()
    }
  }, [counts, pathname])

  return null // This component doesn't render anything itself
}
