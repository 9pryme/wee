import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { logger } from '@/utils/logger'

export async function middleware(req: NextRequest) {
  const adminSessionCookie = req.cookies.get('adminSession')?.value
  let adminSession = null

  try {
    if (adminSessionCookie) {
      adminSession = JSON.parse(adminSessionCookie)
    }
  } catch (e) {
    logger.error('Error parsing admin session:', e)
  }

  logger.info('Middleware:', {
    path: req.nextUrl.pathname,
    hasSession: !!adminSession
  })

  // Check auth condition
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // If accessing just /admin, redirect to dashboard
    if (req.nextUrl.pathname === '/admin') {
      if (!adminSession) {
        return NextResponse.redirect(new URL('/admin/login', req.url))
      }
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }

    // For login page
    if (req.nextUrl.pathname === '/admin/login') {
      if (adminSession) {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url))
      }
      return NextResponse.next()
    }

    // For all other admin routes
    if (!adminSession) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
} 