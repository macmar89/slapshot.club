'use client'

import React, { useState } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'
import { Button } from '@payloadcms/ui'

const RecalculateButton: React.FC = () => {
  const { id, collectionSlug } = useDocumentInfo()
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  if (!id) return null

  const handleRecalculate = async () => {
    setLoading(true)
    setStatusMsg(null)
    try {
      const response = await fetch(`/api/${collectionSlug}/${id}/recalculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()

      if (response.ok) {
        setStatusMsg({ type: 'success', text: 'Body boli úspešne prepočítané.' })
        setShowConfirm(false)
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Nepodarilo sa prepočítať body.' })
      }
    } catch (error) {
      console.error('Recalculate error:', error)
      setStatusMsg({ type: 'error', text: 'Chyba servera.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      marginBottom: '20px', 
      border: '1px solid #ddd', 
      padding: '15px', 
      borderRadius: '8px', 
      background: 'rgba(0,0,0,0.02)' 
    }}>
      <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Vyhodnotenie tipov</h4>
      
      {!showConfirm ? (
        <Button
          size="small"
          buttonStyle="secondary"
          onClick={() => setShowConfirm(true)}
          disabled={loading}
        >
          Prepočítať body
        </Button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ margin: 0, fontSize: '12px', fontWeight: 'bold', color: '#d9534f' }}>
            Naozaj prepočítať?
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              size="small"
              buttonStyle="primary"
              onClick={handleRecalculate}
              disabled={loading}
            >
              {loading ? 'Prepočítavam...' : 'Áno, potvrdiť'}
            </Button>
            <Button
              size="small"
              buttonStyle="secondary"
              onClick={() => setShowConfirm(false)}
              disabled={loading}
            >
              Zrušiť
            </Button>
          </div>
        </div>
      )}

      {statusMsg && (
        <p style={{ 
          marginTop: '10px', 
          fontSize: '12px', 
          color: statusMsg.type === 'success' ? '#5cb85c' : '#d9534f',
          fontWeight: 'bold'
        }}>
          {statusMsg.text}
        </p>
      )}

      <p style={{ fontSize: '11px', color: '#666', marginTop: '8px', lineHeight: '1.4' }}>
        Tento úkon vymaže aktuálne body a vypočíta ich znova podľa aktuálneho výsledku. 
        Použite ak ste opravili skóre zápasu.
      </p>
    </div>
  )
}

export default RecalculateButton
