import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res })

    // Handle admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
      // If accessing just /admin, redirect to login
      if (request.nextUrl.pathname === '/admin') {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }

      // Allow access to login page
      if (request.nextUrl.pathname === '/admin/login') {
        return res
      }

      // Check admin session for all other admin routes
      const adminSession = request.cookies.get('adminSession')?.value
      let session = null

      try {
        if (adminSession) {
          session = JSON.parse(adminSession)
        }
      } catch (e) {
        console.error('Error parsing admin session:', e)
      }

      if (!session) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
    }

    // Handle UTM tracking
    if (request.nextUrl.pathname === '/api/track/click') {
      const trackingId = request.nextUrl.searchParams.get('ref')
      
      if (!trackingId) {
        return NextResponse.json({ error: 'No tracking ID provided' }, { status: 400 })
      }

      // Get the UTM link data
      const { data: linkData, error: fetchError } = await supabase
        .from('utm_links')
        .select('id, click_count, full_url')
        .eq('tracking_id', trackingId)
        .single()

      if (fetchError || !linkData) {
        return NextResponse.json({ error: 'Invalid tracking ID' }, { status: 404 })
      }

      // Increment the click count
      const { error: updateError } = await supabase
        .from('utm_links')
        .update({ click_count: (linkData.click_count || 0) + 1 })
        .eq('id', linkData.id)

      if (updateError) {
        return NextResponse.json({ error: 'Failed to track click' }, { status: 500 })
      }

      // Redirect to the petition page
      return NextResponse.redirect(new URL(linkData.full_url))
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/track/:path*'
  ],
} 