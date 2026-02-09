'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const SyncMatchesLink: React.FC = () => {
  const pathname = usePathname()
  const isActive = pathname === '/admin/sync-matches'

  return (
    <div style={{ padding: '0 24px', marginBottom: '8px' }}>
      <Link
        href="/admin/sync-matches"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textDecoration: 'none',
          color: isActive ? 'var(--theme-success-500)' : 'var(--theme-elevation-600)',
          fontSize: '14px',
          padding: '8px 0',
          fontWeight: isActive ? 'bold' : 'normal',
          transition: 'color 0.2s',
        }}
      >
        <span style={{ fontSize: '18px' }}>🔄</span>
        <span>Sync Matches</span>
      </Link>
    </div>
  )
}
