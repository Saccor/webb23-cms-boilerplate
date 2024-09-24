import { notFound } from "next/navigation";
import { StoryblokCMS } from "@/utils/cms";
import Hero from "@/components/content-types/Hero";
import Teaser from "@/components/nestable/Teaser";
import Page from "@/components/content-types/Page";
import ImageWithText from "@/components/content-types/ImageWithText";
import Grid from "@/components/layout/Grid";
import ProductList from "@/components/layout/ProductList";
import ProductGrid from "@/components/layout/ProductGrid";
import ProductDetail from "@/components/content-types/ProductDetail";

export async function generateStaticParams() {
  try {
    const paths = await StoryblokCMS.getStaticPaths();
    return paths;
  } catch (error) {
    console.log(error);
  }
}

export async function generateMetadata({ params }) {
  const slug = params.slug.join("/");
  return StoryblokCMS.generateMetaFromStory(slug);
}

export default async function CMSPage({ params }) {
  try {
    const currentStory = await StoryblokCMS.getStory(params);
    if (!currentStory) throw new Error("Story not found");

    console.log("Full Story Content:", currentStory);

    // Filter ImageWithText blocks for the Grid
    const ImageWithTextBlocks = currentStory.content.body.filter(
      (block) => block.component === "imagewithtext"
    );

    return (
      <div>
        {currentStory.content.body.map((block) => {
          console.log("Rendering block component:", block.component, block); // Log each block being rendered

          switch (block.component) {
            case "hero":
              console.log("Rendering Hero with data:", block);
              return <Hero key={block._uid} blok={block} />;
            case "teaser":
              return <Teaser key={block._uid} blok={block} />;
            case "page":
              return <Page key={block._uid} blok={block} />;
            case "imagewithtext":
              console.log("Rendering ImageWithText with data:", block);
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
  } catch (error) {
    console.error("Error rendering CMSPage:", error);
    notFound();
  }
}

export const dynamic = StoryblokCMS.isDevelopment ? "force-dynamic" : "force-static";
