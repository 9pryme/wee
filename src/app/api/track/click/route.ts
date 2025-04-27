import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  try {
    console.log('Click tracking endpoint hit')
    
    const url = new URL(request.url)
    const trackingId = url.searchParams.get('ref')
    
    console.log('Click tracking request received:', {
      url: request.url,
      trackingId
    })

    if (!trackingId) {
      console.error('No tracking ID provided')
      return NextResponse.json({ error: 'No tracking ID provided' }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Get the UTM link data
    const { data: linkData, error: fetchError } = await supabase
      .from('utm_links')
      .select('id, click_count, full_url')
      .eq('tracking_id', trackingId)
      .single()

    console.log('Fetched link data:', { linkData, fetchError })

    if (fetchError || !linkData) {
      console.error('Error fetching UTM link:', fetchError)
      return NextResponse.json({ error: 'Invalid tracking ID' }, { status: 404 })
    }

    // Increment the click count
    const { error: updateError } = await supabase
      .from('utm_links')
      .update({ click_count: (linkData.click_count || 0) + 1 })
      .eq('id', linkData.id)

    console.log('Update result:', { updateError, newCount: (linkData.click_count || 0) + 1 })

    if (updateError) {
      console.error('Error incrementing click count:', updateError)
      return NextResponse.json({ error: 'Failed to track click' }, { status: 500 })
    }

    // Redirect to the petition page
    return NextResponse.redirect(new URL(linkData.full_url))
  } catch (error) {
    console.error('Unexpected error in click tracking:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { trackingId } = await request.json()
    
    console.log('Click tracking request received:', { trackingId })
    
    if (!trackingId) {
      return NextResponse.json(
        { error: 'Tracking ID is required' },
        { status: 400 }
      )
    }

    const supabase = createRouteHandlerClient({ cookies })
    
    // Find the UTM link by tracking ID
    const { data: utmLink, error: findError } = await supabase
      .from('utm_links')
      .select('*')
      .eq('tracking_id', trackingId)
      .single()

    console.log('Found UTM link:', { utmLink, findError })

    if (findError || !utmLink) {
      return NextResponse.json(
        { error: 'UTM link not found' },
        { status: 404 }
      )
    }

    // Update click count
    const newClickCount = (utmLink.click_count || 0) + 1
    console.log('Updating click count:', { 
      trackingId, 
      oldCount: utmLink.click_count, 
      newCount: newClickCount 
    })

    const { error: updateError } = await supabase
      .from('utm_links')
      .update({
        click_count: newClickCount
      })
      .eq('id', utmLink.id)

    if (updateError) {
      console.error('Error updating click count:', updateError)
      return NextResponse.json(
        { error: 'Failed to update UTM link' },
        { status: 500 }
      )
    }

    console.log('Click count updated successfully')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking click:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 