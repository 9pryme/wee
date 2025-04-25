'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { pageview } from '@/lib/analytics'

function GoogleAnalyticsInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (pathname && isInitialized) {
      pageview(pathname)
    }
  }, [pathname, searchParams, isInitialized])

  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log('✅ Google Analytics script loaded')
        }}
        onError={(e) => {
          console.error('❌ Error loading Google Analytics script:', e)
        }}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
              debug_mode: true,
              send_page_view: true
            });
            console.log('🔰 GA Initialized with ID:', '${process.env.NEXT_PUBLIC_GA_ID}');
          `
        }}
        onLoad={() => {
          console.log('✅ Google Analytics initialized')
          setIsInitialized(true)
        }}
        onError={(e) => {
          console.error('❌ Error initializing Google Analytics:', e)
        }}
      />
    </>
  )
}

export default function GoogleAnalytics() {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsInner />
    </Suspense>
  )
} 