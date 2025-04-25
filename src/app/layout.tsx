import './globals.css'
import type { Metadata } from 'next'
import { Montserrat, Oswald } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import PerformanceMonitor from '@/components/analytics/PerformanceMonitor'
import AnalyticsTestButton from '@/components/analytics/AnalyticsTestButton'
import { Analytics } from "@vercel/analytics/react"

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
})

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-oswald',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Fund Her Future | Empowering Women Entrepreneurs in Nigeria',
  description: 'Join our campaign to increase access to business loans for women entrepreneurs in Nigeria. Women drive 50% of Nigeria\'s economy but receive less than 10% of SME loans. Sign our petition for change.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${oswald.variable}`}>
        <GoogleAnalytics />
        <PerformanceMonitor />
        {children}
        <Toaster position="top-center" />
        <AnalyticsTestButton />
        <Analytics />
      </body>
    </html>
  )
}
