import storyblokApi from '@/lib/storyblok';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';
  
  // Get current date for lastModified
  const currentDate = new Date();
  
  // Define static pages with their update frequency
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];
  
  // Debug: Log important environment values
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Base URL:', baseUrl);
  console.log('Token available:', !!storyblokApi.accessToken);
  
  try {
    // Using the stories API directly
    const sbParams = {
      // Always use published for sitemap
      version: "published",
      per_page: 100
    };
    
    console.log('Fetching stories for sitemap with params:', JSON.stringify(sbParams));
    
    const data = await storyblokApi.get("cdn/stories", sbParams);
    
    if (!data) {
      console.warn("No data returned from Storyblok API");
      return staticPages;
    }
    
    if (!data.stories || !data.stories.length) {
      console.warn("No stories found in Storyblok");
      return staticPages;
    }
    
    console.log(`Found ${data.stories.length} stories in Storyblok`);
    
    // Transform stories into sitemap entries
    const dynamicPages = data.stories
      .filter(story => {
        // Skip home and config stories
        if (story.slug === "home" || story.slug === "config") {
          console.log(`Skipping story: ${story.slug}`);
          return false;
        }
        return true;
      })
      .map(story => {
        // Build the full URL - handle nested stories correctly
        const slug = story.full_slug;
        const fullUrl = slug ? `${baseUrl}/${slug}` : baseUrl;
        
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
    
    console.log(`Added ${dynamicPages.length} dynamic pages to sitemap`);
    
    // Return combined sitemap
    return [...staticPages, ...dynamicPages];
    
  } catch (error) {
    console.error("Error generating sitemap:", error);
    
    // Log detailed error information
    if (error.response) {
      console.error("Error response data:", error.response);
    }
    
    if (error.config) {
      console.error("Error request config:", {
        url: error.config.url,
        params: error.config.params,
        headers: error.config.headers
      });
    }
    
    return staticPages;
  }
}