import { generateSitemap } from '../../utils/generateSitemap';

export async function GET() {
  try {
    const sitemap = await generateSitemap();
    
    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });
  } catch (error) {
    console.error('Error serving sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
} 