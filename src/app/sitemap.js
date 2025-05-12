import { MetadataRoute } from 'next';

// Simple sitemap implementation that doesn't rely on StoryblokCMS utility functions
export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webb23-cms-boilerplate-bsnb.vercel.app';
  const token = process.env.NEXT_PUBLIC_PREVIEW_STORYBLOK_TOKEN || process.env.NEXT_PUBLIC_PRODUCTION_STORYBLOK_TOKEN;
  
  console.log('SITEMAP.JS - Generating sitemap');
  console.log('SITEMAP.JS - BASE URL:', baseUrl);
  console.log('SITEMAP.JS - TOKEN AVAILABLE:', !!token);
  
  // Start with the homepage
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  try {
    // Make a direct fetch to Storyblok's Links API instead of using the utility
    const response = await fetch(
      `https://api.storyblok.com/v2/cdn/links?token=${token}&version=published`,
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    if (!response.ok) {
      throw new Error(`Storyblok API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('SITEMAP.JS - LINKS FOUND:', Object.keys(data?.links || {}).length);
    
    if (data && data.links) {
      // Add each link to sitemap, excluding folders and home
      Object.keys(data.links).forEach((linkKey) => {
        const link = data.links[linkKey];
        
        // Skip folders and home (already included)
        if (link.is_folder || link.slug === "home" || link.slug === "") {
          return;
        }
        
        const fullUrl = `${baseUrl}/${link.slug}`;
        console.log('SITEMAP.JS - Adding:', fullUrl);
        
        routes.push({
          url: fullUrl,
          lastModified: new Date(link.published_at) || new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });
    }
  } catch (error) {
    console.error('SITEMAP.JS - ERROR:', error.message);
    
    // Fallback: try to get a list of common pages that we know exist
    try {
      const commonPages = ['about', 'product', 'product_detail_page', 'shoplistpage'];
      console.log('SITEMAP.JS - Using common pages fallback');
      
      commonPages.forEach(page => {
        const fullUrl = `${baseUrl}/${page}`;
        console.log('SITEMAP.JS - Adding (fallback):', fullUrl);
        
        routes.push({
          url: fullUrl,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });
    } catch (fallbackError) {
      console.error('SITEMAP.JS - FALLBACK ERROR:', fallbackError.message);
    }
  }

  console.log('SITEMAP.JS - Total URLs:', routes.length);
  return routes;
} 