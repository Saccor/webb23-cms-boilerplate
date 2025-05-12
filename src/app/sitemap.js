import { StoryblokCMS } from "@/utils/cms";
import { storyblokInit, apiPlugin } from "@storyblok/react";

// Initialize Storyblok for this component - this matches your layout.js pattern
storyblokInit({
  accessToken: StoryblokCMS.TOKEN,
  use: [apiPlugin],
});

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';
  
  // Get current date for lastModified
  const currentDate = new Date();
  
  // Log debugging info
  console.log('===== SITEMAP DEBUGGING =====');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('Is Production:', StoryblokCMS.IS_PROD);
  console.log('VERSION:', StoryblokCMS.VERSION);
  console.log('TOKEN available:', !!StoryblokCMS.TOKEN);
  console.log('SITE_URL:', baseUrl);
  
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
    // Use the same approach that works in your generateStaticParams
    const paths = await StoryblokCMS.getStaticPaths();
    
    if (!paths || paths.length === 0) {
      console.warn("No paths returned from getStaticPaths");
      return staticPages;
    }
    
    console.log(`Found ${paths.length} content paths in Storyblok`);
    
    if (paths.length > 0) {
      console.log('Sample paths:', paths.slice(0, 3));
    }
    
    // Transform paths into sitemap entries - similar to what you're doing in [...slug]/page.js
    const dynamicPages = paths.map(pathObj => {
      // Join slug parts for URL - this matches the format used in your application
      const slugPath = pathObj.slug.join('/');
      const fullUrl = `${baseUrl}/${slugPath}`;
      
      console.log(`Adding path to sitemap: ${fullUrl}`);
      
      // Set priority based on path depth
      const pathDepth = slugPath.split('/').length;
      const priority = Math.max(0.5, 1 - (pathDepth * 0.2));
      
      return {
        url: fullUrl,
        lastModified: currentDate, // We don't have publish date in paths
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