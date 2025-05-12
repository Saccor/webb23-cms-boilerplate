import StoryblokClient from 'storyblok-js-client';

// Match the environment selection logic from your StoryblokCMS class
const IS_PROD = process.env.NODE_ENV === "production";
const STORYBLOK_TOKEN = IS_PROD 
  ? process.env.NEXT_PUBLIC_PRODUCTION_STORYBLOK_TOKEN 
  : process.env.NEXT_PUBLIC_PREVIEW_STORYBLOK_TOKEN;

// Initialize a direct Storyblok client without using React plugins
// This approach works better for server components
const storyblokApi = new StoryblokClient({
  accessToken: STORYBLOK_TOKEN,
  cache: {
    clear: 'auto',
    type: 'memory'
  }
});

export default storyblokApi; 