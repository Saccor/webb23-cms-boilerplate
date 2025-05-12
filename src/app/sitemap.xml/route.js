// No imports to avoid dependency issues

export const dynamic = 'force-dynamic'; // Ensure this is always dynamic
export const revalidate = 0; // Don't cache this route

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webb23-cms-boilerplate-bsnb.vercel.app';
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const currentDate = new Date().toISOString();
    const token = process.env.NEXT_PUBLIC_PREVIEW_STORYBLOK_TOKEN || process.env.NEXT_PUBLIC_PRODUCTION_STORYBLOK_TOKEN;
    
    console.log('SITEMAP.XML - ENV:', process.env.NODE_ENV);
    console.log('SITEMAP.XML - BASE URL:', normalizedBaseUrl);
    console.log('SITEMAP.XML - TOKEN AVAILABLE:', !!token);
    
    // Create XML sitemap starting with homepage
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
  <loc>${normalizedBaseUrl}</loc>
  <lastmod>${currentDate}</lastmod>
  <changefreq>daily</changefreq>
  <priority>1</priority>
</url>`;

    try {
      // Direct fetch to Storyblok API without relying on utility functions
      const response = await fetch(
        `https://api.storyblok.com/v2/cdn/links?token=${token}&version=published`,
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      if (!response.ok) {
        throw new Error(`Storyblok API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('SITEMAP.XML - LINKS FOUND:', Object.keys(data?.links || {}).length);
      
      if (data && data.links) {
        // Add each link to sitemap, excluding folders and home
        Object.keys(data.links).forEach((linkKey) => {
          const link = data.links[linkKey];
          
          // Skip folders and home (already included)
          if (link.is_folder || link.slug === "home" || link.slug === "") {
            return;
          }
          
          const fullUrl = `${normalizedBaseUrl}/${link.slug}`;
          console.log('SITEMAP.XML - Adding:', fullUrl);
          
          // Properly format the date or use current date as fallback
          let lastmod;
          try {
            lastmod = link.published_at ? new Date(link.published_at).toISOString() : currentDate;
          } catch (dateError) {
            console.log('SITEMAP.XML - Invalid date for', link.slug);
            lastmod = currentDate;
          }
          
          xml += `
<url>
  <loc>${fullUrl}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>`;
        });
      } else {
        throw new Error('No links found in Storyblok response');
      }
    } catch (storyblokError) {
      console.error('SITEMAP.XML - API ERROR:', storyblokError.message);
      
      // Fallback: try to get a list of common pages that we know exist
      try {
        console.log('SITEMAP.XML - Using common pages fallback');
        const commonPages = ['about', 'product', 'product_detail_page', 'shoplistpage'];
        
        for (const page of commonPages) {
          const fullUrl = `${normalizedBaseUrl}/${page}`;
          console.log('SITEMAP.XML - Adding (fallback):', fullUrl);
          
          xml += `
<url>
  <loc>${fullUrl}</loc>
  <lastmod>${currentDate}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>`;
        }
      } catch (fallbackError) {
        console.error('SITEMAP.XML - FALLBACK ERROR:', fallbackError.message);
      }
    }
    
    // Close XML
    xml += `
</urlset>`;
    
    // Return XML response with cache control headers
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('SITEMAP.XML - GENERAL ERROR:', error.message);
    console.error('SITEMAP.XML - STACK:', error.stack);
    
    // Return basic sitemap with just the homepage
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
  <loc>${process.env.NEXT_PUBLIC_SITE_URL || 'https://webb23-cms-boilerplate-bsnb.vercel.app'}</loc>
  <lastmod>${new Date().toISOString()}</lastmod>
  <changefreq>daily</changefreq>
  <priority>1</priority>
</url>
</urlset>`;
    
    return new Response(fallbackXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  }
} 