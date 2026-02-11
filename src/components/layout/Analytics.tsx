'use client'

import Script from 'next/script'

export const Analytics = () => {
  if (process.env.NODE_ENV !== 'production') {
    return null
  }

  return (
    <Script
      data-goatcounter="https://goat.mkit.sk/count"
      async
      src="//goat.mkit.sk/count.js"
      strategy="afterInteractive"
    />
  )
}
