import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import { db } from '../config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface SitemapUrl {
  url: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  lastmod?: string;
}

export async function generateSitemap(): Promise<string> {
  try {
    const baseUrl = 'https://codecandy.suraniharsh.codes';
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
      url: `${baseUrl}${page.url}`,
      changefreq: page.changefreq,
      priority: page.priority,
      lastmod: new Date().toISOString()
    })));

    // Add public collections
    const collectionsRef = collection(db, 'collections');
    const publicCollectionsQuery = query(collectionsRef, where('isPublic', '==', true));
    const collectionsSnapshot = await getDocs(publicCollectionsQuery);
    
    collectionsSnapshot.forEach(doc => {
      const data = doc.data();
      urls.push({
        url: `${baseUrl}/collections/${doc.id}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date(data.updatedAt || data.createdAt).toISOString()
      });
    });

    // Add public snippets
    const snippetsRef = collection(db, 'snippets');
    const publicSnippetsQuery = query(snippetsRef, where('isPublic', '==', true));
    const snippetsSnapshot = await getDocs(publicSnippetsQuery);

    snippetsSnapshot.forEach(doc => {
      const data = doc.data();
      urls.push({
        url: `${baseUrl}/snippet/${doc.id}`,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date(data.updatedAt || data.createdAt).toISOString()
      });
    });

    // Create sitemap
    const stream = new SitemapStream({
      hostname: baseUrl,
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