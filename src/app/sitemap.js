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
  
  try {
    // Fetch all published stories from Storyblok Links API
    const sbParams = {
      version: process.env.NODE_ENV === "production" ? "published" : "draft",
    };
    
    const { data } = await storyblokApi.get("cdn/links/", sbParams);
    
    if (!data || !data.links) {
      console.warn("No links found in Storyblok");
      return staticPages;
    }
    
    // Transform Storyblok links into sitemap entries
    const dynamicPages = Object.values(data.links).map(link => {
      // Skip folders and home page (already included in staticPages)
      if (link.is_folder || link.slug === "home" || link.slug === "config") {
        return null;
      }
      
      // Build the full URL
      const slug = link.slug;
      const fullUrl = slug ? `${baseUrl}/${slug}` : baseUrl;
      
      // Set priority based on path depth
      const pathDepth = slug.split('/').length;
      const priority = Math.max(0.5, 1 - (pathDepth * 0.2));
      
      return {
        url: fullUrl,
        lastModified: link.published_at ? new Date(link.published_at) : currentDate,
        changeFrequency: 'weekly',
        priority: priority.toFixed(1),
      };
    }).filter(Boolean); // Remove null entries
    
    // Return combined sitemap
    return [...staticPages, ...dynamicPages];
    
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticPages;
  }
}