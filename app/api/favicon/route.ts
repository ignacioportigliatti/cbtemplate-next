import { NextRequest, NextResponse } from 'next/server';
import { getThemeOptions } from '@/lib/wordpress';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get the size parameter from query (default to 32)
    const { searchParams } = new URL(request.url);
    const size = searchParams.get('size') || '32';
    
    // Get WordPress site icon
    const themeOptions = await getThemeOptions();
    const siteIcon = themeOptions.general.site_icon;
    
    if (siteIcon?.url) {
      // Choose the best size based on request
      let faviconUrl = siteIcon.url;
      
      if (size === '16' || size === '32') {
        faviconUrl = siteIcon.sizes?.thumbnail || siteIcon.url;
      } else if (size === '180' || size === 'apple') {
        faviconUrl = siteIcon.sizes?.medium || siteIcon.url;
      } else if (size === '192' || size === '512') {
        faviconUrl = siteIcon.sizes?.large || siteIcon.url;
      }
      
      // Fetch the favicon from WordPress
      const response = await fetch(faviconUrl, {
        headers: {
          'User-Agent': 'Next.js Favicon Proxy',
        },
      });
      
      if (response.ok) {
        const buffer = await response.arrayBuffer();
        
        return new NextResponse(buffer, {
          status: 200,
          headers: {
            'Content-Type': siteIcon.mime_type || 'image/png',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600', // 1 hour cache
            'Content-Length': buffer.byteLength.toString(),
          },
        });
      }
    }
    
    // Fallback: serve the default favicon
    const fallbackPath = new URL('/favicon.ico', request.url);
    const fallbackResponse = await fetch(fallbackPath.href);
    
    if (fallbackResponse.ok) {
      const buffer = await fallbackResponse.arrayBuffer();
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'image/x-icon',
          'Cache-Control': 'public, max-age=86400', // 24 hours cache for fallback
          'Content-Length': buffer.byteLength.toString(),
        },
      });
    }
    
    // Ultimate fallback: return a simple response
    return new NextResponse('Favicon not found', { status: 404 });
    
  } catch (error) {
    console.error('Favicon proxy error:', error);
    
    // Try to serve fallback favicon
    try {
      const fallbackPath = new URL('/favicon.ico', request.url);
      const fallbackResponse = await fetch(fallbackPath.href);
      
      if (fallbackResponse.ok) {
        const buffer = await fallbackResponse.arrayBuffer();
        return new NextResponse(buffer, {
          status: 200,
          headers: {
            'Content-Type': 'image/x-icon',
            'Cache-Control': 'public, max-age=86400',
            'Content-Length': buffer.byteLength.toString(),
          },
        });
      }
    } catch (fallbackError) {
      console.error('Fallback favicon error:', fallbackError);
    }
    
    return new NextResponse('Favicon service error', { status: 500 });
  }
}
