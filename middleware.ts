import { NextResponse, NextRequest } from 'next/server';

// Define which routes should bypass authentication
const publicPaths = [
  '/api/spotify/now-playing',
  '/api/spotify/callback',
];

// This function can be marked `async` if using async operations
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path should bypass authentication
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  
  // For public API paths, add CORS headers and bypass auth
  if (isPublicPath) {
    const response = NextResponse.next();
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    return response;
  }
  
  // Continue normal middleware processing for other routes
  return NextResponse.next();
}

// Configure middleware to run only on matching paths for better performance
export const config = {
  matcher: [
    '/api/spotify/:path*',
    // Add other paths here if needed
  ],
};

