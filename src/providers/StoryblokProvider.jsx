"use client";
import { storyblokInit, apiPlugin, useStoryblokState } from "@storyblok/react"; // Corrected import
import { StoryblokCMS } from "@/utils/cms";

import Page from "@/components/content-types/Page";
import Teaser from "@/components/nestable/Teaser";
import RichTextDefault from "@/components/nestable/RichText";
import Hero from "@/components/content-types/Hero";
import ImageWithText from "@/components/content-types/ImageWithText";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/layout/ProductGrid";
import ProductDetail from "@/components/content-types/ProductDetail";
import About from "@/components/content-types/About";
import Banner from '@/components/content-types/Banner';


// Register components with Storyblok
const components = {
  page: Page,
  teaser: Teaser,
  richtext: RichTextDefault,
  hero: Hero,
  imagewithtext: ImageWithText,
  footer: Footer,
  productgrid: ProductGrid,
  productdetail: ProductDetail,
  about: About,
  banner: Banner,
};

// Initialize Storyblok with components and API plugin
storyblokInit({
  accessToken: StoryblokCMS.TOKEN, // Assuming StoryblokCMS has the access token.
  use: [apiPlugin],
  components, // Register components here
});

// Custom hook for live updates (Storyblok Visual Editor)
export function useStoryblok(story) {
  // Use `useStoryblokState` to enable live preview in Storyblok's Visual Editor
  return useStoryblokState(story);
}

export default function StoryblokProvider({ children }) {
  return children; // Minimal provider
}
