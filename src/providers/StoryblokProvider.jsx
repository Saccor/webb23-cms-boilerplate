"use client";
import { StoryblokCMS } from "@/utils/cms";
import { storyblokInit, apiPlugin } from "@storyblok/react/rsc";

import Page from "@/components/content-types/Page";

import Teaser from "@/components/nestable/Teaser";
import RichTextDefault from "@/components/nestable/RichText";
import NavLink from "@/components/nestable/NavLink";
import Navbar from "@/components/nestable/Navbar";

const components = {
  "page": Page,
  "teaser": Teaser,
  "richtext": RichTextDefault,
  "navlink": NavLink,
  "navbar": Navbar
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