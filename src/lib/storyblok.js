import { storyblokInit, apiPlugin } from '@storyblok/react/rsc';

// Initialize Storyblok API for server components
const { storyblokApi } = storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_PREVIEW_STORYBLOK_TOKEN,
  use: [apiPlugin],
});

export default storyblokApi; 