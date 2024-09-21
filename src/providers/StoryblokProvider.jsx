"use client";
import { StoryblokCMS } from "@/utils/cms";
import { storyblokInit, apiPlugin } from "@storyblok/react/rsc";

import Page from "@/components/content-types/Page";
import Teaser from "@/components/nestable/Teaser";
import RichTextDefault from "@/components/nestable/RichText";
import Hero from "@/components/content-types/Hero";
import ImageWithText from "@/components/content-types/ImageWithText";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/layout/ProductGrid";
import ProductDetail from "@/components/content-types/ProductDetail";
import About from "@/components/content-types/About";

// Register components with Storyblok
const components = {
  "page": Page,
  "teaser": Teaser,
  "richtext": RichTextDefault,
  "hero": Hero,
  "imagewithtext": ImageWithText,
  "footer": Footer,
  "productgrid": ProductGrid,
  "productdetail": ProductDetail,
  "about": About,
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
