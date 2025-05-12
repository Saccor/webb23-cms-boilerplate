import StoryblokClient from 'storyblok-js-client';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';
  
  // Get current date for lastModified
  const currentDate = new Date();
  
  // Log all environment variables (without exposing full token values)
  console.log('===== SITEMAP DEBUGGING =====');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('SITE_URL:', baseUrl);
  
  // Get tokens and mask them for logging
  const previewToken = process.env.NEXT_PUBLIC_PREVIEW_STORYBLOK_TOKEN;
  const productionToken = process.env.NEXT_PUBLIC_PRODUCTION_STORYBLOK_TOKEN;
  
  const maskToken = (token) => {
    if (!token) return 'not set';
    if (token.length < 10) return '***short***';
    return token.substring(0, 4) + '...' + token.substring(token.length - 4);
  };
  
  console.log('PREVIEW_TOKEN:', maskToken(previewToken));
  console.log('PRODUCTION_TOKEN:', maskToken(productionToken));
  
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
    // Try manual direct fetch with preview token first
    console.log('Testing manual fetch with preview token...');
    let workingToken = null;
    
    // Test preview token if available
    if (previewToken) {
      try {
        const previewApi = new StoryblokClient({
          accessToken: previewToken
        });
        
        console.log('Fetching links with preview token...');
        const previewTest = await previewApi.get("cdn/links", { version: "published" });
        
        if (previewTest && previewTest.links) {
          console.log('Preview token works! Found links:', Object.keys(previewTest.links).length);
          workingToken = previewToken;
        }
      } catch (previewError) {
        console.error('Preview token error:', previewError.message || 'Unknown error');
        if (previewError.response) {
          console.error('Preview error response:', previewError.response);
        }
      }
    }
    
    // Test production token if preview failed and production is available
    if (!workingToken && productionToken) {
      try {
        const productionApi = new StoryblokClient({
          accessToken: productionToken
        });
        
        console.log('Fetching links with production token...');
        const productionTest = await productionApi.get("cdn/links", { version: "published" });
        
        if (productionTest && productionTest.links) {
          console.log('Production token works! Found links:', Object.keys(productionTest.links).length);
          workingToken = productionToken;
        }
      } catch (productionError) {
        console.error('Production token error:', productionError.message || 'Unknown error');
        if (productionError.response) {
          console.error('Production error response:', productionError.response);
        }
      }
    }
    
    // If no token worked, return only static pages
    if (!workingToken) {
      console.error('No working token found! Returning only homepage.');
      return staticPages;
    }
    
    // Initialize API with working token
    const storyblokApi = new StoryblokClient({
      accessToken: workingToken
    });
    
    // Directly fetch links from Storyblok with working token
    console.log('Fetching full links with working token...');
    const data = await storyblokApi.get("cdn/links", { version: "published" });
    
    if (!data || !data.links) {
      console.warn("No links found in Storyblok");
      return staticPages;
    }
    
    console.log(`Found ${Object.keys(data.links).length} links in Storyblok`);
    
    // List all links for debugging
    console.log('All links:');
    Object.values(data.links).forEach(link => {
      console.log(`- ${link.slug} (is_folder: ${link.is_folder})`);
    });
    
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
    
    console.error('===== END SITEMAP DEBUGGING =====');
    
    return staticPages;
  }
}