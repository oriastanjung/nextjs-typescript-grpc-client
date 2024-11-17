// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('__t__')?.value;
  const { pathname } = req.nextUrl;

  // Redirect to /login if no token and the user is trying to access a protected route
  if (!token && !['/auth/signin'].includes(pathname)) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/auth/signin';
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to home if a token exists and the user tries to access /auth/signin or /signup
  if (token && ['/auth/signin'].includes(pathname)) {
    const homeUrl = req.nextUrl.clone();
    homeUrl.pathname = '/dashboard';
    return NextResponse.redirect(homeUrl);
  }

  // Allow access if none of the conditions match
  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/:path*', '/dashboard/:path*', '/'], // Adjust paths as needed
};