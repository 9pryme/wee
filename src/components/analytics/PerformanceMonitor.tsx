'use client'

import { useEffect } from 'react'
import { monitorPerformance } from '@/lib/analytics'

export default function PerformanceMonitor() {
  useEffect(() => {
    monitorPerformance()
  }, [])

  return null
} 