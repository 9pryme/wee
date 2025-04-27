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
  if (!trackingId) {
    console.warn('No tracking ID provided')
    return null
  }

  try {
    // First try to find the UTM link by tracking ID
    const response = await fetch('/api/track/click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ trackingId }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Failed to track click:', error)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Error tracking click:', error)
    return null
  }
}

export async function trackConversion(trackingId: string) {
  try {
    const response = await fetch('/api/track/conversion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ trackingId }),
    })

    if (!response.ok) {
      throw new Error('Failed to track conversion')
    }

    return await response.json()
  } catch (error) {
    console.error('Error tracking conversion:', error)
    throw error
  }
}

export function getTrackingIdFromUrl(): string | null {
  if (typeof window === 'undefined') return null
  
  const url = new URL(window.location.href)
  const ref = url.searchParams.get('ref')
  const utmSource = url.searchParams.get('utm_source')
  const utmMedium = url.searchParams.get('utm_medium')
  const utmCampaign = url.searchParams.get('utm_campaign')

  // If we have a ref, use that
  if (ref) return ref

  // If we have UTM parameters, create a tracking ID
  if (utmSource && utmMedium && utmCampaign) {
    return `${utmSource}-${utmMedium}-${utmCampaign}`
  }

  return null
} 