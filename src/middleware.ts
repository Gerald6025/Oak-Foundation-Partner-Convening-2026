import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aqmrezfbezflixqyqsto.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_nMIRhPI41XbdzC8AL1yuOQ_nIiy5SUZ'

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    })

    // Refresh session
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const userRoleCookie = request.cookies.get('user_role')?.value
    const userRole = userRoleCookie ? decodeURIComponent(userRoleCookie) : null

    // ─── Partner Restrictions ───
    // Partners ONLY have access to Registration (/register), QR code page (/pass), and Programme (/programme)
    if (userRole === 'Partner') {
      if (
        request.nextUrl.pathname.startsWith('/admin') ||
        request.nextUrl.pathname.startsWith('/partners')
      ) {
        const url = request.nextUrl.clone()
        url.pathname = '/programme'
        return NextResponse.redirect(url)
      }
    }

    // ─── Coordination Team Restrictions ───
    // Coordination Team members have full access to Scanner, Dashboard, Programme, Partners.
    // No QR code is generated for Coordination Team; pass routes redirect to Coordination dashboard.
    if (userRole === 'Coordination Team') {
      if (request.nextUrl.pathname.startsWith('/pass')) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin/dashboard'
        return NextResponse.redirect(url)
      }
    }

    // ─── Observer Restrictions ───
    // Observers can access Program (/programme) and Partners (/partners).
    // They have NO access to Admin (Check-In scanner, Attendance dashboard) or QR code pass.
    if (userRole === 'Observer') {
      if (
        request.nextUrl.pathname.startsWith('/admin') ||
        request.nextUrl.pathname.startsWith('/pass')
      ) {
        const url = request.nextUrl.clone()
        url.pathname = '/programme'
        return NextResponse.redirect(url)
      }
    }

    // ─── Presenter Restrictions (PDF Section 10 Matrix) ───
    // Presenters have NO right to Attendance or Check-In scanner
    if (userRole === 'Presenter') {
      if (
        request.nextUrl.pathname.startsWith('/admin/scanner') ||
        request.nextUrl.pathname.startsWith('/admin/dashboard') ||
        request.nextUrl.pathname.startsWith('/admin/attendance')
      ) {
        const url = request.nextUrl.clone()
        url.pathname = '/programme'
        return NextResponse.redirect(url)
      }
    }

    const isLoginPage = request.nextUrl.pathname === '/admin/login'
    const isCoordinationRoute =
      request.nextUrl.pathname === '/admin/scanner' ||
      request.nextUrl.pathname === '/admin/dashboard' ||
      request.nextUrl.pathname === '/admin/attendance'
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

    // Coordination pages can be accessed on-site; login page is public; other protected admin pages require Supabase Auth
    if (isAdminRoute && !isLoginPage && !isCoordinationRoute && !user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    // Redirect logged-in users away from login page to dashboard
    if (isLoginPage && user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/dashboard'
      return NextResponse.redirect(url)
    }
  } catch (error) {
    console.error('Middleware execution error:', error)
    return supabaseResponse
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*', '/partners/:path*', '/pass/:path*'],
}
