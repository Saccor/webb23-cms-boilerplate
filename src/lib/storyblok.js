import { getStoryblokApi } from "@storyblok/react/rsc";

// Initialize a simple Storyblok API client for server components
const storyblokApi = getStoryblokApi({
  accessToken: process.env.NEXT_PUBLIC_PREVIEW_STORYBLOK_TOKEN,
});

export default storyblokApi; 