import { Helmet } from 'react-helmet-async';
import { siteConfig } from '../config/meta';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  publishedAt?: string;
  modifiedAt?: string;
  isArticle?: boolean;
  tags?: string[];
  noindex?: boolean;
}

export function SEO({ 
  title = siteConfig.title,
  description = siteConfig.description,
  image = '/og-image.png',
  url = '/',
  type = 'website',
  publishedAt,
  modifiedAt,
  isArticle = false,
  tags = [],
  noindex = false
}: SEOProps) {
  const siteTitle = title.includes('CodeCandy') ? title : `${title} | CodeCandy`;
  const allTags = [...new Set([...siteConfig.defaultTags, ...tags])];
  
  const fullUrl = url.startsWith('http') ? url : `${siteConfig.baseUrl}${url}`;
  const fullImage = image.startsWith('http') ? image : `${siteConfig.baseUrl}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang="en" />
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <link rel="canonical" href={fullUrl} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <meta name="keywords" content={allTags.join(', ')} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={isArticle ? 'article' : type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:alt" content={`${title} preview`} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteConfig.openGraph.siteName} />
      <meta property="og:locale" content={siteConfig.openGraph.locale} />
      {publishedAt && <meta property="article:published_time" content={publishedAt} />}
      {modifiedAt && <meta property="article:modified_time" content={modifiedAt} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={siteConfig.author.twitter} />
      <meta name="twitter:creator" content={siteConfig.author.twitter} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={`${title} preview`} />

      {/* PWA Tags */}
      <meta name="application-name" content="CodeCandy" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="CodeCandy" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content={siteConfig.themeColor} />
      
      {/* Favicon Tags */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />

      {/* Structured Data / JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": isArticle ? "Article" : "WebApplication",
          "name": "CodeCandy",
          "description": description,
          "url": fullUrl,
          "image": fullImage,
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "author": {
            "@type": "Person",
            "name": siteConfig.author.name,
            "url": siteConfig.author.url,
            "sameAs": [
              siteConfig.author.twitter,
              siteConfig.social.github,
              siteConfig.social.linkedin,
              siteConfig.social.instagram
            ]
          },
          "publisher": {
            "@type": "Organization",
            "name": siteConfig.openGraph.siteName,
            "logo": {
              "@type": "ImageObject",
              "url": `${siteConfig.baseUrl}/logo.png`
            }
          },
          ...(publishedAt && {
            "datePublished": publishedAt,
            "dateModified": modifiedAt || publishedAt
          }),
          "keywords": allTags.join(', '),
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": fullUrl
          }
        })}
      </script>
    </Helmet>
  );
} 