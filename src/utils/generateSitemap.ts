import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import { supabase } from '../config/supabase';
import { siteConfig } from '../config/meta';

interface SitemapUrl {
  url: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  lastmod?: string;
}

export async function generateSitemap(): Promise<string> {
  try {
    const urls: SitemapUrl[] = [];

    // Add static pages
    const staticPages = [
      { url: '/', priority: 1.0, changefreq: 'daily' },
      { url: '/about', priority: 0.8, changefreq: 'monthly' },
      { url: '/collections', priority: 0.9, changefreq: 'daily' },
      { url: '/search', priority: 0.7, changefreq: 'daily' },
      { url: '/favorites', priority: 0.7, changefreq: 'daily' },
    ] as const;

    urls.push(...staticPages.map(page => ({
      url: `${siteConfig.baseUrl}${page.url}`,
      changefreq: page.changefreq,
      priority: page.priority,
      lastmod: new Date().toISOString()
    })));

    // Add public collections
    const { data: collections } = await supabase
      .from('collections')
      .select('id, updated_at, created_at')
      .eq('is_public', true);

    (collections ?? []).forEach(row => {
      urls.push({
        url: `${siteConfig.baseUrl}/collections/${row.id}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date(row.updated_at || row.created_at).toISOString(),
      });
    });

    // Add public snippets
    const { data: snippets } = await supabase
      .from('snippets')
      .select('id, updated_at, created_at')
      .eq('is_public', true);

    (snippets ?? []).forEach(row => {
      urls.push({
        url: `${siteConfig.baseUrl}/snippet/${row.id}`,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date(row.updated_at || row.created_at).toISOString(),
      });
    });

    // Create sitemap
    const stream = new SitemapStream({
      hostname: siteConfig.baseUrl,
      xmlns: {
        news: false,
        xhtml: false,
        image: false,
        video: false
      }
    });

    const xmlString = await streamToPromise(
      Readable.from(urls).pipe(stream)
    ).then(data => data.toString());

    return '<?xml version="1.0" encoding="UTF-8"?>' + xmlString;

  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw error;
  }
} 