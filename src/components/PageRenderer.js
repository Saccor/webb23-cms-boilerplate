// /src/components/PageRenderer.js
"use client"; // This makes it a client-side component

import { useStoryblok } from "../providers/StoryblokProvider";
import Hero from "@/components/content-types/Hero";
import Teaser from "@/components/nestable/Teaser";
import Page from "@/components/content-types/Page";
import ImageWithText from "@/components/content-types/ImageWithText";
import Grid from "@/components/layout/Grid";
import ProductList from "@/components/layout/ProductList";
import ProductGrid from "@/components/layout/ProductGrid";
import ProductDetail from "@/components/content-types/ProductDetail";
import About from "@/components/content-types/About";

export default function PageRenderer({ story }) {
  const liveStory = useStoryblok(story); // This will handle live updates in Storyblok’s Visual Editor

  // Filter ImageWithText blocks for the Grid
  const ImageWithTextBlocks = liveStory.content.body.filter(
    (block) => block.component === "imagewithtext"
  );

  return (
    <div>
      {liveStory.content.body.map((block) => {
        switch (block.component) {
          case "hero":
            return <Hero key={block._uid} blok={block} />;
          case "teaser":
            return <Teaser key={block._uid} blok={block} />;
          case "page":
            return <Page key={block._uid} blok={block} />;
          case "imagewithtext":
            return <ImageWithText key={block._uid} blok={block} />;
          case "productlist":
            return <ProductList key={block._uid} blok={block} />;
          case "productgrid":
            return <ProductGrid key={block._uid} blok={block} />;
          case "productdetail":
            return <ProductDetail key={block._uid} blok={block} />;
          case "about":
            return <About key={block._uid} blok={block} />;
          default:
            console.warn("Unknown component:", block.component);
            return null;
        }
      })}

      {/* Render ImageWithText blocks in a Grid */}
      {ImageWithTextBlocks.length > 0 && <Grid blocks={ImageWithTextBlocks} />}
    </div>
  );
}
