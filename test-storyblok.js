// test-storyblok.js
require('dotenv').config({ path: '.env.local' });
const StoryblokClient = require('storyblok-js-client');

// Initialize client with your token from .env.local
const client = new StoryblokClient({
  accessToken: process.env.NEXT_PUBLIC_PREVIEW_STORYBLOK_TOKEN
});

// Check if token is available
console.log('Token available:', !!process.env.NEXT_PUBLIC_PREVIEW_STORYBLOK_TOKEN);

async function testStoryblok() {
  try {
    // Test Stories API
    console.log('Testing Stories API...');
    const storiesResponse = await client.get('cdn/stories');
    console.log('Story count:', storiesResponse.stories?.length || 0);
    console.log('First few stories:');
    console.log(storiesResponse.stories?.slice(0, 3).map(s => ({
      name: s.name,
      slug: s.slug,
      full_slug: s.full_slug,
      published: !!s.published_at
    })));

    // Test Links API
    console.log('\nTesting Links API...');
    const linksResponse = await client.get('cdn/links');
    const linkCount = Object.keys(linksResponse.links || {}).length;
    console.log('Link count:', linkCount);
    
    // Show some links details
    if (linkCount > 0) {
      console.log('Link examples:');
      const linkExamples = Object.values(linksResponse.links).slice(0, 5);
      console.log(linkExamples.map(link => ({
        id: link.id,
        slug: link.slug,
        is_folder: link.is_folder,
        published: !!link.published
      })));
    }
  } catch (error) {
    console.error('Error testing Storyblok API:', error);
    if (error.response) {
      console.error('Response:', error.response);
    }
  }
}

testStoryblok(); 