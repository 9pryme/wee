import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { trackingId } = await request.json()
    
    console.log('Conversion tracking request received:', { trackingId })
    
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

    // Update conversion count
    const newConversionCount = (utmLink.conversion_count || 0) + 1
    console.log('Updating conversion count:', { 
      trackingId, 
      oldCount: utmLink.conversion_count, 
      newCount: newConversionCount 
    })

    const { error: updateError } = await supabase
      .from('utm_links')
      .update({
        conversion_count: newConversionCount
      })
      .eq('id', utmLink.id)

    if (updateError) {
      console.error('Error updating conversion count:', updateError)
      return NextResponse.json(
        { error: 'Failed to update UTM link' },
        { status: 500 }
      )
    }

    console.log('Conversion count updated successfully')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking conversion:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 