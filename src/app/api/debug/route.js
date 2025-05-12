import { getStoryblokApi } from '@storyblok/react';
import StoryblokClient from 'storyblok-js-client';

export async function GET() {
  try {
    // Initialize Storyblok API directly with token
    const storyblokToken = process.env.NEXT_PUBLIC_PREVIEW_STORYBLOK_TOKEN || process.env.NEXT_PUBLIC_PRODUCTION_STORYBLOK_TOKEN;
    
    if (!storyblokToken) {
      return Response.json({
        error: 'Storyblok token not found in environment variables',
      }, { status: 500 });
    }
    
    const storyblokApi = new StoryblokClient({
      accessToken: storyblokToken,
      cache: {
        clear: 'auto',
        type: 'memory'
      }
    });
    
    // Fetch a ShopListPage content
    const { data } = await storyblokApi.get('cdn/stories', {
      version: 'published',
      starts_with: 'products/'
    });
    
    // Return the raw data structure
    return Response.json({
      stories: data.stories,
      message: 'This shows the raw structure of content',
      token: storyblokToken ? 'Token found' : 'No token found'
    }, { status: 200 });
  } catch (error) {
    console.error('Storyblok API error:', error);
    return Response.json({
      error: error.message || 'Failed to fetch Storyblok data',
      stack: error.stack
    }, { status: 500 });
  }
} 