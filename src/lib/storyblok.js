import StoryblokClient from 'storyblok-js-client';

// Initialize a direct Storyblok client without using React plugins
// This approach works better for server components
const storyblokApi = new StoryblokClient({
  accessToken: process.env.NEXT_PUBLIC_PREVIEW_STORYBLOK_TOKEN,
  cache: {
    clear: 'auto',
    type: 'memory'
  }
});

export default storyblokApi; 