import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { url, type } = await request.json()
    
    if (!url || !type) {
      return NextResponse.json(
        { error: 'URL and type are required' },
        { status: 400 }
      )
    }

    const supabase = createRouteHandlerClient({ cookies })
    
    // Parse UTM parameters from URL
    const urlObj = new URL(url)
    const source = urlObj.searchParams.get('utm_source')
    const medium = urlObj.searchParams.get('utm_medium')
    const campaign = urlObj.searchParams.get('utm_campaign')
    const volunteerName = urlObj.searchParams.get('utm_volunteer')

    if (!source || !medium || !campaign || !volunteerName) {
      return NextResponse.json(
        { error: 'Invalid UTM parameters' },
        { status: 400 }
      )
    }

    // Find the UTM link
    const { data: utmLink, error: findError } = await supabase
      .from('utm_links')
      .select('*')
      .eq('source', source)
      .eq('medium', medium)
      .eq('campaign', campaign)
      .eq('volunteer_name', volunteerName)
      .single()

    if (findError || !utmLink) {
      return NextResponse.json(
        { error: 'UTM link not found' },
        { status: 404 }
      )
    }

    // Update click or conversion count
    const updateField = type === 'click' ? 'click_count' : 'conversion_count'
    const { error: updateError } = await supabase
      .from('utm_links')
      .update({
        [updateField]: utmLink[updateField] + 1
      })
      .eq('id', utmLink.id)

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update UTM link' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking UTM:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 