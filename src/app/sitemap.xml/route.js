import { StoryblokCMS } from "@/utils/cms";
import { storyblokInit, apiPlugin } from "@storyblok/react";

// Initialize Storyblok using the same pattern as layout.js
storyblokInit({
  accessToken: StoryblokCMS.TOKEN,
  use: [apiPlugin],
});

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webb23-cms-boilerplate-bsnb.vercel.app';
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const currentDate = new Date().toISOString();
    
    console.log('SITEMAP - ENV:', process.env.NODE_ENV);
    console.log('SITEMAP - BASE URL:', normalizedBaseUrl);
    console.log('SITEMAP - VERSION:', StoryblokCMS.VERSION);
    console.log('SITEMAP - TOKEN AVAILABLE:', !!StoryblokCMS.TOKEN);
    
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
      // Use StoryblokCMS.sbGet to be consistent with the rest of the application
      const params = StoryblokCMS.getDefaultSBParams();
      params.per_page = 100;
      
      // First try to get using the Links API (which works in the getStaticPaths method)
      const { data } = await StoryblokCMS.sbGet("cdn/links/", params);
      
      console.log('SITEMAP - LINKS FOUND:', Object.keys(data?.links || {}).length);
      
      if (data && data.links) {
        // Add each link to sitemap, excluding folders and home
        Object.keys(data.links).forEach((linkKey) => {
          const link = data.links[linkKey];
          
          // Skip folders and home (already included)
          if (link.is_folder || link.slug === "home" || link.slug === "") {
            return;
          }
          
          const fullUrl = `${normalizedBaseUrl}/${link.slug}`;
          console.log('SITEMAP - Adding:', fullUrl);
          
          xml += `
<url>
  <loc>${fullUrl}</loc>
  <lastmod>${link.published_at || currentDate}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>`;
        });
      } else {
        console.log('SITEMAP - NO LINKS FOUND OR EMPTY RESPONSE');
        
        // Fallback to stories if links don't work
        const storiesResponse = await StoryblokCMS.sbGet('cdn/stories', params);
        const stories = storiesResponse.data?.stories || [];
        
        console.log('SITEMAP - STORIES FOUND:', stories.length);
        
        if (stories.length > 0) {
          // Add each story to sitemap, excluding the config
          for (const story of stories) {
            if (story.name !== 'Config' && !story.is_startpage) {
              const slug = story.full_slug;
              const fullUrl = `${normalizedBaseUrl}/${slug}`;
              
              console.log('SITEMAP - Adding (from stories):', fullUrl);
              
              xml += `
<url>
  <loc>${fullUrl}</loc>
  <lastmod>${story.published_at || currentDate}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>`;
            }
          }
        }
      }
    } catch (storyblokError) {
      console.error('SITEMAP - API ERROR:', storyblokError.message);
      
      // Use same method as in the getStaticPaths to get paths
      try {
        console.log('SITEMAP - TRYING STATIC PATHS METHOD');
        const paths = await StoryblokCMS.getStaticPaths();
        
        console.log('SITEMAP - PATHS FOUND:', paths?.length || 0);
        
        if (paths && paths.length > 0) {
          for (const path of paths) {
            if (path.slug && path.slug.length > 0) {
              const slugPath = path.slug.join('/');
              const fullUrl = `${normalizedBaseUrl}/${slugPath}`;
              
              console.log('SITEMAP - Adding (from static paths):', fullUrl);
              
              xml += `
<url>
  <loc>${fullUrl}</loc>
  <lastmod>${currentDate}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>`;
            }
          }
        }
      } catch (pathsError) {
        console.error('SITEMAP - PATHS METHOD FAILED:', pathsError.message);
      }
    }
    
    // Close XML
    xml += `
</urlset>`;
    
    // Return XML response
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('SITEMAP - GENERAL ERROR:', error.message);
    console.error('SITEMAP - STACK:', error.stack);
    
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
      },
    });
  }
} 