'use client'

import { triggerTestEvents } from '@/lib/analytics-test'
import { useState } from 'react'

export default function AnalyticsTestButton() {
  const [isTriggering, setIsTriggering] = useState(false)

  // Early return if in production
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  const handleClick = async () => {
    setIsTriggering(true)
    try {
      await triggerTestEvents()
      console.log('✅ Test events triggered successfully')
    } catch (error) {
      console.error('❌ Error triggering test events:', error)
    } finally {
      setIsTriggering(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isTriggering}
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        padding: '8px 16px',
        background: isTriggering ? '#666' : '#333',
        color: 'white',
        borderRadius: '4px',
        zIndex: 9999,
        cursor: isTriggering ? 'wait' : 'pointer',
        border: 'none',
        outline: 'none',
        transition: 'all 0.2s ease',
        transform: isTriggering ? 'scale(0.98)' : 'scale(1)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = isTriggering ? '#666' : '#444'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = isTriggering ? '#666' : '#333'
      }}
    >
      {isTriggering ? 'Triggering...' : 'Test Analytics'}
    </button>
  )
} 