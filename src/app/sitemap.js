import StoryblokClient from 'storyblok-js-client';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';
  
  // Get current date for lastModified
  const currentDate = new Date();
  
  // Try with both tokens to ensure flexibility
  // First use PREVIEW token since that's what works with the rest of your app
  const previewToken = process.env.NEXT_PUBLIC_PREVIEW_STORYBLOK_TOKEN;
  const productionToken = process.env.NEXT_PUBLIC_PRODUCTION_STORYBLOK_TOKEN;
  
  // Define static pages with their update frequency
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];
  
  // Log available tokens for debugging (with masking)
  console.log('Preview token available:', !!previewToken);
  console.log('Production token available:', !!productionToken);
  
  // Try with preview token first, then production if that fails
  let storyblokApi = new StoryblokClient({
    accessToken: previewToken
  });
  
  try {
    // Debug environment
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Base URL:', baseUrl);
    
    // Directly fetch links from Storyblok
    // For sitemap, always use published version
    const sbParams = {
      version: "published",
    };
    
    console.log('Trying preview token first...');
    
    let data;
    try {
      data = await storyblokApi.get("cdn/links", sbParams);
    } catch (tokenError) {
      // If preview token fails and production token is available, try that
      if (tokenError.status === 401 && productionToken) {
        console.log('Preview token unauthorized, trying production token...');
        storyblokApi = new StoryblokClient({
          accessToken: productionToken
        });
        data = await storyblokApi.get("cdn/links", sbParams);
      } else {
        // Re-throw if it's not an auth error or we don't have a production token
        throw tokenError;
      }
    }
    
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