"use client";
import { StoryblokCMS } from "@/utils/cms";
import { storyblokInit, apiPlugin } from "@storyblok/react/rsc";

import Page from "@/components/content-types/Page";

import Teaser from "@/components/nestable/Teaser";
import RichTextDefault from "@/components/nestable/RichText";
import Newsletter from "@/components/nestable/Newsletter";
import FooterColumn from "@/components/nestable/FooterColumn";

const components = {
  "page": Page,
  "teaser": Teaser,
  "richtext": RichTextDefault,
  "newsletter": Newsletter,
  "footer_column": FooterColumn
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