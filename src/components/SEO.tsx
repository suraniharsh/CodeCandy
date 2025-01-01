import React from 'react';
import { Helmet } from 'react-helmet-async';

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
  title = 'CodeCandy - Your Personal Code Snippet Manager',
  description = 'Save, organize, and share your code snippets with syntax highlighting, collections, and instant search. The modern way to manage your code snippets.',
  image = '/og-image.png',
  url = 'https://codecandy.suraniharsh.codes',
  type = 'website',
  publishedAt,
  modifiedAt,
  isArticle = false,
  tags = [],
  noindex = false
}: SEOProps) {
  const siteTitle = title.includes('CodeCandy') ? title : `${title} | CodeCandy`;
  const defaultTags = [
    'code snippets', 'code management', 'developer tools','Harsh Surani', 'Surani Harsh', 'surani', 'harsh',
     'programming', 'code editor', 'syntax highlighting', 'code organization', 'snippet manager', 
    'syntax highlighting', 'code organization', 'snippet manager',  
    'code sharing', 'development', 'software engineering', 'web development',
    'productivity tools', 'coding', 'developer workflow', 'code library'
  ];
  const allTags = [...new Set([...defaultTags, ...tags])];
  
  const baseUrl = 'https://codecandy.suraniharsh.codes';
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  const fullImage = image.startsWith('http') ? image : `${baseUrl}${image}`;

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
      <meta property="og:site_name" content="CodeCandy" />
      <meta property="og:locale" content="en_US" />
      {publishedAt && <meta property="article:published_time" content={publishedAt} />}
      {modifiedAt && <meta property="article:modified_time" content={modifiedAt} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@suraniharsh" />
      <meta name="twitter:creator" content="@suraniharsh" />
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
      <meta name="theme-color" content="#3B82F6" />
      
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
            "name": "Harsh Surani",
            "url": "https://suraniharsh.codes",
            "sameAs": [
              "https://twitter.com/suraniharsh",
              "https://github.com/suraniharsh"
            ]
          },
          "publisher": {
            "@type": "Organization",
            "name": "CodeCandy",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/logo.png`
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