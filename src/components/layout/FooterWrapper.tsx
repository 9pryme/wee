'use client'
import { usePathname } from 'next/navigation'
import { Footer } from '@/components/layout/Footer/Footer'

export function FooterWrapper() {
  const pathname = usePathname()
  const showFooter = pathname !== '/petition'

  if (!showFooter) return null
  return <Footer />
} 