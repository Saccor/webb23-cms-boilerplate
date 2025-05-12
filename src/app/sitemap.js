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
    // Try with the stories API instead of links since that seems to be working
    console.log('Testing direct stories API fetch...');
    let workingToken = null;
    let allStories = [];
    
    // Try the preview token first since that's what your app uses
    if (previewToken) {
      try {
        const previewApi = new StoryblokClient({
          accessToken: previewToken
        });
        
        console.log('Fetching stories with preview token...');
        const response = await previewApi.get('cdn/stories', {
          version: 'published',
          per_page: 100 // Increase if you have more stories
        });
        
        if (response && response.stories && response.stories.length > 0) {
          console.log('Preview token works! Found stories:', response.stories.length);
          workingToken = previewToken;
          allStories = response.stories;
        }
      } catch (error) {
        console.error('Preview token error with stories API:', error.message || 'Unknown error');
      }
    }
    
    // If preview token didn't work, try production token
    if (!workingToken && productionToken) {
      try {
        const productionApi = new StoryblokClient({
          accessToken: productionToken
        });
        
        console.log('Fetching stories with production token...');
        const response = await productionApi.get('cdn/stories', {
          version: 'published',
          per_page: 100
        });
        
        if (response && response.stories && response.stories.length > 0) {
          console.log('Production token works! Found stories:', response.stories.length);
          workingToken = productionToken;
          allStories = response.stories;
        }
      } catch (error) {
        console.error('Production token error with stories API:', error.message || 'Unknown error');
      }
    }
    
    // If still no working token, return only static pages
    if (!workingToken || allStories.length === 0) {
      console.error('Could not retrieve stories from Storyblok. Returning only homepage.');
      return staticPages;
    }
    
    // Log the stories we found
    console.log('All stories:');
    allStories.forEach(story => {
      console.log(`- ${story.full_slug} (published: ${!!story.published_at})`);
    });
    
    // Transform stories into sitemap entries
    const dynamicPages = allStories
      .filter(story => {
        // Skip home and config
        if (story.full_slug === 'home' || story.full_slug === 'config') {
          console.log(`Skipping story: ${story.full_slug}`);
          return false;
        }
        return true;
      })
      .map(story => {
        // Build the full URL
        const slug = story.full_slug;
        const fullUrl = `${baseUrl}/${slug}`;
        
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