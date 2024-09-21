import { notFound } from "next/navigation";
import { StoryblokCMS } from "@/utils/cms";
import Hero from "@/components/content-types/Hero"; 
import Teaser from "@/components/nestable/Teaser"; 
import Page from "@/components/content-types/Page"; 
import ImageWithText from "@/components/content-types/ImageWithText"; 
import Grid from "@/components/layout/Grid"; 
import ProductList from "@/components/layout/ProductList"; 
import ProductGrid from "@/components/layout/ProductGrid";
import ProductDetail from "@/components/content-types/ProductDetail"; // Import ProductDetail

// Generate static paths for all stories
export async function generateStaticParams() {
  try {
    const paths = await StoryblokCMS.getStaticPaths();
    return paths;
  } catch (error) {
    console.log(error);
  }
}

// Generate static meta props for each story
export async function generateMetadata({ params }) {
  const slug = params.slug.join("/");
  return StoryblokCMS.generateMetaFromStory(slug);
}

// This function is called for each item in the paths array returned from generateStaticParams
export default async function CMSPage({ params }) {
  try {
    const currentStory = await StoryblokCMS.getStory(params);
    if (!currentStory) throw new Error();

    console.log("Full Story Content:", currentStory);

    // Filter ProductList and ImageWithText blocks
    const ProductListBlocks = currentStory.content.body.filter(
      (block) => block.component === "productlist"
    );
    const ImageWithTextBlocks = currentStory.content.body.filter(
      (block) => block.component === "imagewithtext"
    );

    return (
      <div>
        {currentStory.content.body.map((block) => {
          switch (block.component) {
            case "hero":
              return <Hero key={block._uid} hero={block} />;
            case "teaser":
              return <Teaser key={block._uid} teaser={block} />;
            case "page":
              return <Page key={block._uid} page={block} />;
            case "productlist":
              return <ProductList key={block._uid} blok={block} />;
            case "productgrid":
              return <ProductGrid key={block._uid} blok={block} />;
            case "productdetail": 
              return <ProductDetail key={block._uid} blok={block} />;
              case "about": 
              return <About key={block._uid} blok={block} />;
            default:
              return null;
          }
        })}

        {/* Render ImageWithText blocks in a Grid */}
        {ImageWithTextBlocks.length > 0 && <Grid blocks={ImageWithTextBlocks} />}
      </div>
    );
  } catch (error) {
    notFound();
  }
}

// Force dynamic rendering in development and Visual editor
export const dynamic = StoryblokCMS.isDevelopment ? "force-dynamic" : "force-static";
