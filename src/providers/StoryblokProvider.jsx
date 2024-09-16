"use client";
import { StoryblokCMS } from "@/utils/cms";
import { storyblokInit, apiPlugin } from "@storyblok/react/rsc";

import Page from "@/components/content-types/Page";
import Teaser from "@/components/nestable/Teaser";
import RichTextDefault from "@/components/nestable/RichText";
import Hero from "@/components/content-types/Hero"; // Ensure Hero is correctly imported
import ImageWithText from "@/components/content-types/ImageWithText"; // Ensure ImageWithText is correctly imported

// Register components with Storyblok
const components = {
  "page": Page,
  "teaser": Teaser,
  "richtext": RichTextDefault,
  "hero": Hero, // Ensure Hero is registered here
  "ImageWithText": ImageWithText, // ImageWithText is also registered here
};

// Initialize Storyblok with components and API plugin
storyblokInit({
  accessToken: StoryblokCMS.TOKEN,
  use: [apiPlugin],
  components, // Register components here
});

export default function StoryblokProvider({ children }) {
  return children;
}
