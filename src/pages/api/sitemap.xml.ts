import { generateSitemap } from '../../utils/generateSitemap';

export async function GET() {
  try {
    const sitemap = await generateSitemap();
    
    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=UTF-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'X-Robots-Tag': 'noindex'
      }
    });
  } catch (error) {
    console.error('Error serving sitemap:', error);
    return new Response('<?xml version="1.0" encoding="UTF-8"?><error>Error generating sitemap</error>', {
      status: 500,
      headers: {
        'Content-Type': 'application/xml; charset=UTF-8'
      }
    });
  }
} 