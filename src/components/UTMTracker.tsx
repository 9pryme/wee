import { useEffect } from 'react'

interface UTMTrackerProps {
  url: string
  type: 'click' | 'conversion'
}

export function UTMTracker({ url, type }: UTMTrackerProps) {
  useEffect(() => {
    const trackUTM = async () => {
      try {
        const response = await fetch('/api/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url, type }),
        })

        if (!response.ok) {
          console.error('Failed to track UTM')
        }
      } catch (error) {
        console.error('Error tracking UTM:', error)
      }
    }

    trackUTM()
  }, [url, type])

  return null
} 