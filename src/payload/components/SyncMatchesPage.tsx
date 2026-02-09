'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import { Gutter } from '@payloadcms/ui'

export const SyncMatchesPage: React.FC = () => {
  const [cid, setCid] = useState('')
  const [ahid, setAhid] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSync = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (cid) params.append('cid', cid)
    if (ahid) params.append('ahid', ahid)

    const url = `/api/sync-matches${params.toString() ? `?${params.toString()}` : ''}`

    try {
      const res = await fetch(url)
      const data = await res.json()

      if (res.ok) {
        toast.success(data.message || 'Synchronizácia zápasov bola spustená.')
      } else {
        toast.error(data.error || 'Nepodarilo sa spustiť synchronizáciu.')
      }
    } catch (error) {
      console.error('Failed to trigger sync:', error)
      toast.error('Chyba pri komunikácii so serverom.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Gutter>
      <div style={{ paddingTop: '2rem' }}>
        <h1>Manual Match Sync (API Hockey)</h1>
        <p style={{ marginBottom: '2rem', color: 'var(--theme-elevation-600)' }}>
          Zadajte buď interné ID súťaže (cid) alebo API Hockey ID (napr. 91). Ak necháte prázdne,
          zosynchronizujú sa všetky aktívne súťaže.
        </p>

        <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="cid" style={{ fontWeight: 'bold', fontSize: '14px' }}>
                Competition CID (Internal)
              </label>
              <input
                id="cid"
                type="text"
                value={cid}
                onChange={(e) => setCid(e.target.value)}
                placeholder="spsevlvb..."
                style={{
                  padding: '12px',
                  borderRadius: '4px',
                  border: '1px solid var(--theme-elevation-200)',
                  backgroundColor: 'var(--theme-elevation-50)',
                  color: 'var(--theme-elevation-800)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="ahid" style={{ fontWeight: 'bold', fontSize: '14px' }}>
                API Hockey ID (External)
              </label>
              <input
                id="ahid"
                type="text"
                value={ahid}
                onChange={(e) => setAhid(e.target.value)}
                placeholder="Napr. 91"
                style={{
                  padding: '12px',
                  borderRadius: '4px',
                  border: '1px solid var(--theme-elevation-200)',
                  backgroundColor: 'var(--theme-elevation-50)',
                  color: 'var(--theme-elevation-800)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <button
            onClick={handleSync}
            disabled={loading}
            style={{
              padding: '12px 24px',
              borderRadius: '4px',
              backgroundColor: loading ? 'var(--theme-elevation-200)' : 'var(--theme-success-500)',
              color: 'white',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              transition: 'background-color 0.2s',
              fontSize: '14px',
              width: 'fit-content',
            }}
          >
            {loading ? 'Spracúvam...' : 'Spustiť synchronizáciu'}
          </button>
        </div>
      </div>
    </Gutter>
  )
}
