// Unified sitemap implementation for Next.js

/**
 * Generate a sitemap for the site
 * This implementation uses the standard Next.js sitemap format
 * and avoids conflicts with route handlers
 */
export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webb23-cms-boilerplate-bsnb.vercel.app';
  const token = process.env.NEXT_PUBLIC_PREVIEW_STORYBLOK_TOKEN || process.env.NEXT_PUBLIC_PRODUCTION_STORYBLOK_TOKEN;
  
  console.log('SITEMAP - Generating sitemap');
  console.log('SITEMAP - BASE URL:', baseUrl);
  console.log('SITEMAP - TOKEN AVAILABLE:', !!token);
  
  // Always include homepage
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  // Always include product category pages
  routes.push(
    {
      url: `${baseUrl}/products/mens`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/products/womens`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    }
  );

  try {
    // Fetch data from Storyblok
    const response = await fetch(
      `https://api.storyblok.com/v2/cdn/links?token=${token}&version=published`,
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    if (!response.ok) {
      throw new Error(`Storyblok API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('SITEMAP - LINKS FOUND:', Object.keys(data?.links || {}).length);
    
    if (data && data.links) {
      // Add each link to sitemap, excluding folders and home
      Object.keys(data.links).forEach((linkKey) => {
        const link = data.links[linkKey];
        
        // Skip folders and home (already included)
        if (link.is_folder || link.slug === "home" || link.slug === "") {
          return;
        }
        
        const fullUrl = `${baseUrl}/${link.slug}`;
        console.log('SITEMAP - Adding:', fullUrl);
        
        // Safely create date object with try/catch
        let lastModified;
        try {
          lastModified = link.published_at ? new Date(link.published_at) : new Date();
          // Verify the date is valid
          if (isNaN(lastModified.getTime())) {
            throw new Error('Invalid date');
          }
        } catch (dateError) {
          console.log('SITEMAP - Invalid date for', link.slug);
          lastModified = new Date();
        }
        
        routes.push({
          url: fullUrl,
          lastModified: lastModified,
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });
    }
  } catch (error) {
    console.error('SITEMAP - ERROR:', error.message);
    
    // Fallback: add common pages
    const commonPages = ['about', 'product', 'product_detail_page', 'shoplistpage'];
    console.log('SITEMAP - Using common pages fallback');
    
    commonPages.forEach(page => {
      const fullUrl = `${baseUrl}/${page}`;
      console.log('SITEMAP - Adding (fallback):', fullUrl);
      
      routes.push({
        url: fullUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  }

  console.log('SITEMAP - Total URLs:', routes.length);
  return routes;
} 