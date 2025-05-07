"use client";
import { StoryblokCMS } from "@/utils/cms";
import { storyblokInit, apiPlugin } from "@storyblok/react/rsc";

import Page from "@/components/content-types/Page";
import ShopListPage from "@/components/content-types/ShopListPage";

import Teaser from "@/components/nestable/Teaser";
import RichTextDefault from "@/components/nestable/RichText";
import Newsletter from "@/components/nestable/Newsletter";
import FooterColumn from "@/components/nestable/FooterColumn";
import CategoryFilter from "@/components/nestable/CategoryFilter";
import ProductCard from "@/components/nestable/ProductCard";

const components = {
  // Content types
  "page": Page,
  "shop_list_page": ShopListPage,
  
  // Nestable components
  "teaser": Teaser,
  "richtext": RichTextDefault,
  "newsletter": Newsletter,
  "footer_column": FooterColumn,
  "category": CategoryFilter,
  "product-card": ProductCard
}

storyblokInit({
  accessToken: StoryblokCMS.TOKEN,

  use: [apiPlugin],
  components
});

export default function StoryblokProvider({ children }) {
  return (
    children
  );
}