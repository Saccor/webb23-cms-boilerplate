export default function robots() {
  // The public-facing URL of your site
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';

  return {
    // Define the rules for all search engine crawlers
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',       // Prevent crawling of API routes
        '/admin/',     // Prevent crawling of admin areas
        '/_next/',     // Prevent crawling of Next.js system files
        '/private/',   // Any private areas you define
      ],
    },
    // The sitemap URL - this should be the full URL path to your sitemap
    sitemap: `${baseUrl}/sitemap.xml`,
    // Optional: Host directive
    host: baseUrl,
  };
}