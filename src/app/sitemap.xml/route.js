import { StoryblokCMS } from "@/utils/cms";
import { storyblokInit, apiPlugin, getStoryblokApi } from "@storyblok/react";

// Initialize Storyblok with explicit version control
storyblokInit({
  accessToken: process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_PRODUCTION_STORYBLOK_TOKEN 
    : process.env.NEXT_PUBLIC_PREVIEW_STORYBLOK_TOKEN,
  use: [apiPlugin],
  apiOptions: {
    region: 'eu',
  }
});

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webb23-cms-boilerplate-bsnb.vercel.app';
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const currentDate = new Date().toISOString();
    
    console.log('SITEMAP - ENV:', process.env.NODE_ENV);
    console.log('SITEMAP - BASE URL:', normalizedBaseUrl);
    console.log('SITEMAP - PREVIEW TOKEN:', !!process.env.NEXT_PUBLIC_PREVIEW_STORYBLOK_TOKEN);
    console.log('SITEMAP - PRODUCTION TOKEN:', !!process.env.NEXT_PUBLIC_PRODUCTION_STORYBLOK_TOKEN);
    
    // Create XML sitemap starting with homepage
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
  <loc>${normalizedBaseUrl}</loc>
  <lastmod>${currentDate}</lastmod>
  <changefreq>daily</changefreq>
  <priority>1</priority>
</url>`;

    // Use a direct instance of StoryblokClient for more reliability in production
    const apiToken = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_PRODUCTION_STORYBLOK_TOKEN 
      : process.env.NEXT_PUBLIC_PREVIEW_STORYBLOK_TOKEN;
    
    try {
      // Get Storyblok API instance
      const storyblokApi = getStoryblokApi();
      
      if (!storyblokApi) {
        throw new Error('Failed to get Storyblok API instance');
      }
      
      // Fetch all stories with explicit token
      const { data } = await storyblokApi.get('cdn/stories', {
        version: 'published',
        token: apiToken,
        per_page: 100,
      });
      
      console.log('SITEMAP - STORIES FOUND:', data?.stories?.length || 0);
      
      if (data && data.stories && data.stories.length > 0) {
        // Add each story to sitemap, excluding the config
        for (const story of data.stories) {
          if (story.name !== 'Config' && !story.is_startpage) {
            const slug = story.full_slug;
            const fullUrl = `${normalizedBaseUrl}/${slug}`;
            
            console.log('SITEMAP - Adding:', fullUrl);
            
            xml += `
<url>
  <loc>${fullUrl}</loc>
  <lastmod>${story.published_at || currentDate}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>`;
          }
        }
      } else {
        console.log('SITEMAP - NO STORIES FOUND OR EMPTY RESPONSE');
      }
    } catch (storyblokError) {
      console.error('SITEMAP - STORYBLOK API ERROR:', storyblokError.message);
      console.error('SITEMAP - STACK:', storyblokError.stack);
      
      // Try fallback method - direct API call without SDK
      try {
        console.log('SITEMAP - TRYING FALLBACK METHOD');
        
        const response = await fetch(`https://api.storyblok.com/v2/cdn/stories?token=${apiToken}&version=published&per_page=100`);
        const data = await response.json();
        
        console.log('SITEMAP - FALLBACK STORIES FOUND:', data?.stories?.length || 0);
        
        if (data && data.stories && data.stories.length > 0) {
          // Add each story to sitemap, excluding the config
          for (const story of data.stories) {
            if (story.name !== 'Config' && !story.is_startpage) {
              const slug = story.full_slug;
              const fullUrl = `${normalizedBaseUrl}/${slug}`;
              
              console.log('SITEMAP - Adding (fallback):', fullUrl);
              
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
      } catch (fallbackError) {
        console.error('SITEMAP - FALLBACK METHOD FAILED:', fallbackError.message);
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
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }
} 