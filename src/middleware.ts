import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('craftcloud_session')?.value;

  // Protect panel routes
  if (pathname.startsWith('/panel')) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect logged-in users away from login
  if (pathname === '/login' && sessionToken) {
    return NextResponse.redirect(new URL('/panel', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/panel/:path*', '/login'],
};
