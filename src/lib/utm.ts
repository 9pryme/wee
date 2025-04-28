export async function trackUTM(url: string, type: 'click' | 'conversion') {
  try {
    const response = await fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, type }),
    })

    if (!response.ok) {
      throw new Error('Failed to track UTM')
    }

    return await response.json()
  } catch (error) {
    console.error('Error tracking UTM:', error)
    throw error
  }
}

export function generateUTMUrl(baseUrl: string, params: {
  source: string
  medium: string
  campaign: string
  volunteerName: string
}) {
  const url = new URL(baseUrl)
  url.searchParams.append('utm_source', params.source)
  url.searchParams.append('utm_medium', params.medium)
  url.searchParams.append('utm_campaign', params.campaign)
  url.searchParams.append('volunteer', params.volunteerName)
  return url.toString()
}

export async function trackClick(trackingId: string) {
  if (!trackingId) return null

  // Check if this click has already been counted in this session
  const sessionKey = `click_tracked_${trackingId}`
  if (typeof window !== 'undefined' && sessionStorage.getItem(sessionKey)) {
    return null // Already tracked in this session
  }

  try {
    const response = await fetch(`/api/track/click?ref=${trackingId}`, {
      method: 'GET'
    })

    if (!response.ok) {
      console.error('Failed to track click')
      return null
    }

    // Mark this click as tracked in the current session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(sessionKey, 'true')
    }

    return await response.json()
  } catch (error) {
    console.error('Error tracking click:', error)
    return null
  }
}

export async function trackConversion(trackingId: string) {
  if (!trackingId) return null

  try {
    const response = await fetch(`/api/track/conversion?ref=${trackingId}`, {
      method: 'GET'
    })

    if (!response.ok) {
      console.error('Failed to track conversion')
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Error tracking conversion:', error)
    return null
  }
}

export function getTrackingIdFromUrl(): string | null {
  if (typeof window === 'undefined') return null
  return new URL(window.location.href).searchParams.get('ref')
} 