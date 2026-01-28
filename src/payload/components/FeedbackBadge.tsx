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
    // Mutation Observer to find the Feedback link and inject the badge
    const updateBadge = () => {
      const navLinks = document.querySelectorAll('nav a, nav button')
      navLinks.forEach((link) => {
        if (link.textContent?.includes('Feedback')) {
          let badge = link.querySelector('.feedback-sidebar-badge')
          if (!badge) {
            badge = document.createElement('span')
            badge.className = 'feedback-sidebar-badge'
            // Apply some basic styling - in Payload Admin we might need to be careful
            Object.assign((badge as HTMLElement).style, {
              marginLeft: '8px',
              padding: '2px 6px',
              borderRadius: '10px',
              fontSize: '10px',
              fontWeight: 'bold',
              backgroundColor: counts.newCount > 0 ? 'var(--theme-error-400)' : 'var(--theme-elevation-200)',
              color: counts.newCount > 0 ? 'white' : 'var(--theme-elevation-800)',
              display: (counts.unread > 0 || counts.newCount > 0) ? 'inline-block' : 'none'
            })
            link.appendChild(badge)
          }
          
          if (badge) {
             badge.textContent = `${counts.newCount}/${counts.unread}`
             ;(badge as HTMLElement).style.display = (counts.unread > 0 || counts.newCount > 0) ? 'inline-block' : 'none'
          }
        }
      })
    }

    updateBadge()
    
    const observer = new MutationObserver(updateBadge)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [counts])

  return null // This component doesn't render anything itself
}
