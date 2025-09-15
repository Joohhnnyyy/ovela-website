import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for admin routes
  if (pathname.startsWith('/admin')) {
    // For admin routes, check authentication
    const adminAuth = request.cookies.get('admin_authenticated')?.value;
    const adminSession = request.cookies.get('admin_session')?.value;

    if (!adminAuth || adminAuth !== 'true' || !adminSession) {
      // Redirect to auth login if not authenticated
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Check if session is still valid (24 hours)
    const sessionTime = parseInt(adminSession);
    const currentTime = Date.now();
    const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours

    if (currentTime - sessionTime > sessionDuration) {
      // Session expired, redirect to login
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete('admin_authenticated');
      response.cookies.delete('admin_session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
};