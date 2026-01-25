'use client'

import React from 'react'
import { Turnstile as MarsiTurnstile, type TurnstileProps } from '@marsidev/react-turnstile'

interface CustomTurnstileProps extends Omit<TurnstileProps, 'siteKey'> {
  siteKey?: string
}

export const Turnstile: React.FC<CustomTurnstileProps> = ({ siteKey, ...props }) => {
  const finalSiteKey = siteKey || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  if (!finalSiteKey) {
    console.warn('Turnstile: NEXT_PUBLIC_TURNSTILE_SITE_KEY is not defined')
    return null
  }

  return (
    <div className="flex justify-center my-4">
      <MarsiTurnstile siteKey={finalSiteKey} {...props} />
    </div>
  )
}
