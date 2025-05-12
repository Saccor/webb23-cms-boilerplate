import { StoryblokCMS } from "@/utils/cms";
import { storyblokInit, apiPlugin, getStoryblokApi } from "@storyblok/react";

// Initialize Storyblok
storyblokInit({
  accessToken: StoryblokCMS.TOKEN,
  use: [apiPlugin],
});

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webb23-cms-boilerplate-bsnb.vercel.app/';
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const currentDate = new Date().toISOString();
    
    console.log('SITEMAP - BASE URL:', normalizedBaseUrl);
    console.log('SITEMAP - TOKEN:', !!StoryblokCMS.TOKEN);
    
    // Create XML sitemap
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
  <loc>${normalizedBaseUrl}</loc>
  <lastmod>${currentDate}</lastmod>
  <changefreq>daily</changefreq>
  <priority>1</priority>
</url>`;

    try {
      // Get Storyblok API instance
      const storyblokApi = getStoryblokApi();
      
      // Fetch all stories
      const { data } = await storyblokApi.get('cdn/stories', {
        version: StoryblokCMS.VERSION,
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
      }
    } catch (storyblokError) {
      console.error('SITEMAP - STORYBLOK API ERROR:', storyblokError);
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
    console.error('SITEMAP - GENERAL ERROR:', error);
    
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