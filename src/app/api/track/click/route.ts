import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const ref = url.searchParams.get('ref')
    
    if (!ref) {
      return NextResponse.json({ error: 'No ref parameter provided' }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Find the UTM link by tracking ID
    const { data: link, error: findError } = await supabase
      .from('utm_links')
      .select('*')
      .eq('tracking_id', ref)
      .single()

    if (findError || !link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    // Update click count
    const { error: updateError } = await supabase
      .from('utm_links')
      .update({ click_count: (link.click_count || 0) + 1 })
      .eq('id', link.id)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update click count' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking click:', error)
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