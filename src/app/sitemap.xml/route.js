import { StoryblokCMS } from "@/utils/cms";
import { storyblokInit, apiPlugin, getStoryblokApi } from "@storyblok/react";

// Initialize Storyblok for this component - this matches your layout.js pattern
storyblokInit({
  accessToken: StoryblokCMS.TOKEN,
  use: [apiPlugin],
});

// Route handler for sitemap.xml
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';
  // Ensure the baseUrl doesn't end with a slash to prevent double slashes
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  // Get current date for lastModified
  const currentDate = new Date();
  
  // Log debugging info
  console.log('===== SITEMAP DEBUGGING =====');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('Is Production:', StoryblokCMS.IS_PROD);
  console.log('VERSION:', StoryblokCMS.VERSION);
  console.log('TOKEN available:', !!StoryblokCMS.TOKEN);
  console.log('SITE_URL:', baseUrl);
  console.log('Normalized URL:', normalizedBaseUrl);
  
  // Define static pages with their update frequency
  const staticPages = [
    {
      url: normalizedBaseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];
  
  try {
    // Get Storyblok API instance
    const storyblokApi = getStoryblokApi();
    
    // Fetch all stories directly using the Stories API instead of Links API
    const { data } = await storyblokApi.get('cdn/stories', {
      version: StoryblokCMS.VERSION,
      per_page: 100, // Adjust based on your content volume
      excluding_fields: 'content', // We don't need content for sitemap
    });
    
    if (!data || !data.stories || data.stories.length === 0) {
      console.warn("No stories found in Storyblok");
      return new Response(generateSitemapXml(staticPages), {
        headers: {
          'Content-Type': 'application/xml',
        },
      });
    }
    
    console.log(`Found ${data.stories.length} stories in Storyblok`);
    
    // Transform stories into sitemap entries
    const contentPages = data.stories
      .filter(story => {
        // Skip config stories and any other stories that shouldn't be in sitemap
        if (story.name === 'Config' || story.is_startpage) {
          console.log(`Skipping story: ${story.name} (${story.slug})`);
          return false;
        }
        return true;
      })
      .map(story => {
        // Format slug for URL
        const slug = story.full_slug;
        const fullUrl = `${normalizedBaseUrl}/${slug}`;
        
        console.log(`Adding story to sitemap: ${fullUrl}`);
        
        // Set priority based on path depth
        const pathDepth = slug.split('/').length;
        const priority = Math.max(0.5, 1 - (pathDepth * 0.2));
        
        return {
          url: fullUrl,
          lastModified: story.published_at ? new Date(story.published_at) : currentDate,
          changeFrequency: 'weekly',
          priority: priority.toFixed(1),
        };
      });
    
    console.log(`Added ${contentPages.length} content pages to sitemap`);
    
    // Return combined sitemap
    const sitemapEntries = [...staticPages, ...contentPages];
    
    return new Response(generateSitemapXml(sitemapEntries), {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
    
  } catch (error) {
    console.error("Error generating sitemap:", error);
    
    if (error.message) {
      console.error("Error message:", error.message);
    }
    
    if (error.response) {
      console.error("Error response data:", error.response.data);
    }
    
    console.error('===== END SITEMAP DEBUGGING =====');
    
    // Return basic sitemap in case of error
    return new Response(generateSitemapXml(staticPages), {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
}

// Helper function to generate sitemap XML
function generateSitemapXml(entries) {
  const xmlEntries = entries.map(entry => `
<url>
  <loc>${entry.url}</loc>
  <lastmod>${entry.lastModified.toISOString()}</lastmod>
  ${entry.changeFrequency ? `<changefreq>${entry.changeFrequency}</changefreq>` : ''}
  ${entry.priority ? `<priority>${entry.priority}</priority>` : ''}
</url>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;
} 