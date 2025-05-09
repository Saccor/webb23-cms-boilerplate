"use client";
import { StoryblokCMS } from "@/utils/cms";
import { storyblokInit, apiPlugin } from "@storyblok/react/rsc";
import { useEffect } from "react";

import Page from "@/components/content-types/Page";
<<<<<<< HEAD
import Teaser from "@/components/nestable/Teaser";
import RichTextDefault from "@/components/nestable/RichText";
import Hero from "@/components/content-types/Hero"; // Ensure Hero is correctly imported
import ImageWithText from "@/components/content-types/ImageWithText"; // Ensure ImageWithText is correctly imported
=======
import ShopListPage from "@/components/content-types/ShopListPage";
import ProductDetailPage from "@/components/content-types/ProductDetailPage";
import AboutPage from "@/components/content-types/AboutPage";

import Teaser from "@/components/nestable/Teaser";
import RichTextDefault from "@/components/nestable/RichText";
import Newsletter from "@/components/nestable/Newsletter";
import FooterColumn from "@/components/nestable/FooterColumn";
import CategoryFilter from "@/components/nestable/CategoryFilter";
import ProductCard from "@/components/nestable/ProductCard";
import ColorOption from "@/components/nestable/ColorOption";
import SizeOption from "@/components/nestable/SizeOption";
import AboutTop from "@/components/nestable/AboutTop";
import Banner from "@/components/nestable/Banner";
import Hero3 from "@/components/nestable/Hero3";
import Hero1 from "@/components/nestable/Hero1";
import CtaButton from "@/components/nestable/CtaButton";
import ProductImage from "@/components/nestable/ProductImage";
>>>>>>> test4

// Register components with Storyblok
const components = {
  // Content types
  "page": Page,
<<<<<<< HEAD
  "teaser": Teaser,
  "richtext": RichTextDefault,
  "hero": Hero, // Ensure Hero is registered here
  "ImageWithText": ImageWithText, // ImageWithText is also registered here
};

// Initialize Storyblok with components and API plugin
if (StoryblokCMS.TOKEN) {
  storyblokInit({
    accessToken: StoryblokCMS.TOKEN,
    use: [apiPlugin],
    components, // Register components here
  });
=======
  "shop_list_page": ShopListPage,
  "product": ProductDetailPage,
  "about_page": AboutPage,
  
  // Nestable components
  "teaser": Teaser,
  "richtext": RichTextDefault,
  "newsletter": Newsletter,
  "footer_column": FooterColumn,
  "category": CategoryFilter,
  "product-card": ProductCard,
  "color-option": ColorOption,
  "size-option": SizeOption,
  "about_top": AboutTop,
  "banner": Banner,
  "hero3": Hero3,
  "hero1": Hero1,
  "button": CtaButton,
  "image": ProductImage
>>>>>>> test4
}

export default function StoryblokProvider({ children }) {
  useEffect(() => {
    if (!StoryblokCMS.TOKEN) {
      console.error(
        "Storyblok token is missing. Please add NEXT_PUBLIC_PREVIEW_STORYBLOK_TOKEN to your .env file."
      );
    }
  }, []);

  return children;
}
