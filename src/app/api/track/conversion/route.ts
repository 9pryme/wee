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

    // Update conversion count
    const { error: updateError } = await supabase
      .from('utm_links')
      .update({ conversion_count: (link.conversion_count || 0) + 1 })
      .eq('id', link.id)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update conversion count' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking conversion:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 