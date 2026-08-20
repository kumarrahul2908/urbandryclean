'use client'

import Script from 'next/script'
import { useEffect } from 'react'

export default function Analytics() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID
  const ADS_ID = process.env.NEXT_PUBLIC_GADS_ID

  // Delegated click tracking for elements with data-analytics="event_name"
  useEffect(() => {
    if (!GA_ID && !ADS_ID) return
    const handler = (e) => {
      const t = e.target.closest('[data-analytics]')
      if (!t) return
      const name = t.getAttribute('data-analytics')
      if (!name) return
      try {
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
          window.gtag('event', name, { event_category: 'engagement' })
          if (ADS_ID) {
            const label = process.env[`NEXT_PUBLIC_GADS_LABEL_${name.toUpperCase()}`]
            if (label) {
              window.gtag('event', 'conversion', { send_to: `${ADS_ID}/${label}` })
            }
          }
        }
      } catch (_) {}
    }
    document.addEventListener('click', handler, true)
    return () => document.removeEventListener('click', handler, true)
  }, [GA_ID, ADS_ID])

  if (!GA_ID && !ADS_ID) return null

  const idForBoot = GA_ID || ADS_ID
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${idForBoot}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        ${GA_ID ? `gtag('config', '${GA_ID}');` : ''}
        ${ADS_ID ? `gtag('config', '${ADS_ID}');` : ''}
      `}</Script>
    </>
  )
}
