import { getStoryblokApi } from '@storyblok/react';

export async function GET() {
  try {
    // Initialize Storyblok API
    const storyblokApi = getStoryblokApi();
    
    // Fetch a specific category page (mens or womens)
    const { data } = await storyblokApi.get('cdn/stories', {
      version: 'published',
      starts_with: 'products/',
      // Try to get mens category content
      by_slugs: 'products/mens',
    });
    
    // Return the raw data structure
    return Response.json({
      categoryPage: data.stories,
      message: 'This shows the raw structure of a category page'
    }, { status: 200 });
  } catch (error) {
    console.error('Storyblok API error:', error);
    return Response.json({
      error: error.message || 'Failed to fetch Storyblok data'
    }, { status: 500 });
  }
} 