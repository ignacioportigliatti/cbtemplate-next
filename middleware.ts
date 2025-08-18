import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path matches the pattern /[location] exactly (no additional segments)
  // This regex matches paths like /miami-fl but not /miami-fl/services or /miami-fl/about
  const locationOnlyPattern = /^\/[a-z0-9-]+$/;
  
  // Static routes to exclude from redirection
  const staticRoutes = [
    '/blog',
    '/pages',
    '/api',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/_next',
    '/_vercel',
    '/public'
  ];
  
  // Don't redirect if it's a static route
  const isStaticRoute = staticRoutes.some(route => pathname.startsWith(route));
  if (isStaticRoute) {
    return NextResponse.next();
  }
  
  // Don't redirect root path
  if (pathname === '/') {
    return NextResponse.next();
  }
  
  // Check if it matches the location-only pattern
  if (locationOnlyPattern.test(pathname)) {
    // For location-like patterns, redirect to home
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
  
  // Let Next.js handle all other routes
  return NextResponse.next();
}

export const config = {
  // Match all paths except those starting with specific prefixes
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}; 