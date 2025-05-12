import { StoryblokCMS } from "@/utils/cms";
import { MetadataRoute } from 'next';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webb23-cms-boilerplate-bsnb.vercel.app';

  console.log('SITEMAP.JS - Generating sitemap');
  console.log('SITEMAP.JS - BASE URL:', baseUrl);
  console.log('SITEMAP.JS - TOKEN AVAILABLE:', !!StoryblokCMS.TOKEN);

  // Start with the homepage
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  try {
    // Use the same method that works in getStaticPaths to get links from Storyblok
    const paths = await StoryblokCMS.getStaticPaths();
    console.log('SITEMAP.JS - PATHS FOUND:', paths?.length || 0);

    if (paths && paths.length > 0) {
      for (const path of paths) {
        if (path.slug && path.slug.length > 0) {
          const slugPath = path.slug.join('/');
          const fullUrl = `${baseUrl}/${slugPath}`;
          
          console.log('SITEMAP.JS - Adding:', fullUrl);
          
          routes.push({
            url: fullUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        }
      }
    }
  } catch (error) {
    console.error('SITEMAP.JS - ERROR:', error.message);
  }

  console.log('SITEMAP.JS - Total URLs:', routes.length);
  return routes;
} 