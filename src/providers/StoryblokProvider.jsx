"use client";
import { StoryblokCMS } from "@/utils/cms";
import { storyblokInit, apiPlugin } from "@storyblok/react/rsc";

import Page from "@/components/content-types/Page";

import Teaser from "@/components/nestable/Teaser";
import RichTextDefault from "@/components/nestable/RichText";
import NavLink from "@/components/nestable/NavLink";
import Navbar from "@/components/nestable/Navbar";
import Footer from "@/components/nestable/Footer";
import Newsletter from "@/components/nestable/Newsletter";
import FooterColumn from "@/components/nestable/FooterColumn";
import FooterLink from "@/components/nestable/FooterLink";

const components = {
  "page": Page,
  "teaser": Teaser,
  "richtext": RichTextDefault,
  "navlink": NavLink,
  "navbar": Navbar,
  "footer": Footer,
  "newsletter": Newsletter,
  "footer_column": FooterColumn,
  "footer_link": FooterLink
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