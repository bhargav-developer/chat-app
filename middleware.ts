import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  const currentPath = request.nextUrl.pathname;
  console.log("Current URL:", currentPath);

  // If no token, block protected routes
  if (!token) {
    if (currentPath !== "/login" && currentPath !== "/signup") {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If logged in and visiting login/signup, redirect to dashboard
  if (token && (currentPath === "/login" || currentPath === "/signup")) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};
