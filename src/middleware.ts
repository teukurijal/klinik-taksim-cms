import { NextRequest, NextResponse } from 'next/server'
import { isValidTokenFormat } from '@/utils/auth-server'

const PROTECTED_ROUTES = ['/dashboard']
const AUTH_ROUTES = ['/login']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the current path is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route))
  
  // Get auth token from cookie
  const authToken = request.cookies.get('auth_token')?.value
  
  if (isProtectedRoute) {
    // If no token, redirect to login
    if (!authToken) {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
    
    // Validate token format
    if (!isValidTokenFormat(authToken)) {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
    
    // Token exists and has valid format, allow access
    return NextResponse.next()
  }
  
  // If user has valid token and tries to access auth routes, redirect to dashboard
  if (isAuthRoute && authToken && isValidTokenFormat(authToken)) {
    const dashboardUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}