"use client";
import { StoryblokCMS } from "@/utils/cms";
import { storyblokInit, apiPlugin } from "@storyblok/react/rsc";

import Page from "@/components/content-types/Page";
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

const components = {
  // Content types
  "page": Page,
  "shop_list_page": ShopListPage,
  "product": ProductDetailPage,
  "about_page": AboutPage,
  
  // Nestable components
  "teaser": Teaser,
  "richtext": RichTextDefault,
  "newsletter": Newsletter,
  "footer_column": FooterColumn,
  "category": CategoryFilter,
  "product_card": ProductCard,
  "product-card": ProductCard,
  "color-option": ColorOption,
  "size-option": SizeOption,
  "about_top": AboutTop,
  "banner": Banner,
  "hero3": Hero3,
  "hero1": Hero1,
  "button": CtaButton,
  "image": ProductImage
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