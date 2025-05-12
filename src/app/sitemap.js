import StoryblokClient from 'storyblok-js-client';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';
  
  // Get current date for lastModified
  const currentDate = new Date();
  
  // Use a direct Storyblok client for server-only operations
  const storyblokApi = new StoryblokClient({
    accessToken: process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_PRODUCTION_STORYBLOK_TOKEN
      : process.env.NEXT_PUBLIC_PREVIEW_STORYBLOK_TOKEN
  });
  
  // Define static pages with their update frequency
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];
  
  try {
    // Debug environment
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Token available:', !!storyblokApi.accessToken);
    console.log('Base URL:', baseUrl);
    
    // Directly fetch links from Storyblok
    const sbParams = {
      version: "published", // Always use published for sitemap
    };
    
    const data = await storyblokApi.get("cdn/links", sbParams);
    
    if (!data || !data.links) {
      console.warn("No links found in Storyblok");
      return staticPages;
    }
    
    console.log(`Found ${Object.keys(data.links).length} links in Storyblok`);
    
    // Transform links into sitemap entries
    const dynamicPages = Object.values(data.links)
      .filter(link => {
        // Skip folders and home page (already included in staticPages)
        if (link.is_folder || link.slug === "home" || link.slug === "config") {
          console.log(`Skipping link: ${link.slug}`);
          return false;
        }
        return true;
      })
      .map(link => {
        // Build the full URL
        const slug = link.slug;
        const fullUrl = slug ? `${baseUrl}/${slug}` : baseUrl;
        
        console.log(`Adding link to sitemap: ${fullUrl}`);
        
        // Set priority based on path depth
        const pathDepth = slug.split('/').length;
        const priority = Math.max(0.5, 1 - (pathDepth * 0.2));
        
        return {
          url: fullUrl,
          lastModified: link.published_at ? new Date(link.published_at) : currentDate,
          changeFrequency: 'weekly',
          priority: priority.toFixed(1),
        };
      });
    
    console.log(`Added ${dynamicPages.length} dynamic pages to sitemap`);
    
    // Return combined sitemap
    return [...staticPages, ...dynamicPages];
    
  } catch (error) {
    console.error("Error generating sitemap:", error);
    
    if (error.message) {
      console.error("Error message:", error.message);
    }
    
    if (error.response) {
      console.error("Error response data:", error.response);
    }
    
    return staticPages;
  }
}