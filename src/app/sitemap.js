import { StoryblokCMS } from "@/utils/cms";

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
  
  try {
    // Debug environment
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Is production:', StoryblokCMS.IS_PROD);
    console.log('Version used:', StoryblokCMS.VERSION);
    console.log('Token available:', !!StoryblokCMS.TOKEN);
    console.log('Base URL:', baseUrl);
    
    // Get all paths using the same method used in getStaticPaths
    // This ensures consistency with the rest of your app
    const paths = await StoryblokCMS.getStaticPaths();
    
    if (!paths || paths.length === 0) {
      console.warn("No paths returned from getStaticPaths");
      return staticPages;
    }
    
    console.log(`Found ${paths.length} content paths in Storyblok`);
    
    // Transform paths into sitemap entries
    const dynamicPages = paths.map(pathObj => {
      // Join slug parts for URL
      const slugPath = pathObj.slug.join('/');
      const fullUrl = `${baseUrl}/${slugPath}`;
      
      console.log(`Adding path to sitemap: ${fullUrl}`);
      
      // Set priority based on path depth
      const pathDepth = slugPath.split('/').length;
      const priority = Math.max(0.5, 1 - (pathDepth * 0.2));
      
      return {
        url: fullUrl,
        lastModified: currentDate, // We don't have publish date from paths
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