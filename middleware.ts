import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');

  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ['/auth/signin', '/auth/signup', '/'];

  // Check if the path is public
  const isPublicPath = publicPaths.includes(pathname);

  // If there's no session and the path is not public, redirect to signin
  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // If there's a session and the user is trying to access auth pages, redirect to dashboard
  if (session && (pathname.startsWith('/auth/'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/ar/:path*',
    '/generate/:path*',
    '/upload/:path*',
    '/gallery/:path*',
    '/auth/:path*',
  ],
};
