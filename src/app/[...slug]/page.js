import { notFound } from "next/navigation";
import { StoryblokCMS } from "@/utils/cms";
import { useStoryblokState } from "@storyblok/react"; // Storyblok's hook for live-editing
import Hero from "@/components/content-types/Hero"; // Import Hero
import Teaser from "@/components/nestable/Teaser"; // Import other components if necessary
import Page from "@/components/content-types/Page"; // Import Page component
import ImageWithText from "@/components/content-types/ImageWithText"; // Import ImageWithText component
import Grid from "@/components/layout/Grid"; // Import Grid component

// Generates static paths for all stories
export async function generateStaticParams() {
  try {
    const paths = await StoryblokCMS.getStaticPaths();
    return paths;
  } catch (error) {
    console.log(error);
  }
}

// Generates static meta props for each story
export async function generateMetadata({ params }) {
  const slug = params.slug.join("/");
  return StoryblokCMS.generateMetaFromStory(slug);
}

// This function is called for each item in the paths array returned from generateStaticParams
export default async function CMSPage({ params }) {
  try {
    const currentStory = await StoryblokCMS.getStory(params);
    if (!currentStory) throw new Error();

    console.log("Full Story Content:", currentStory); // Log the full story content

    // Filter ImageWithText blocks to be rendered in a Grid
    const ImageWithTextBlocks = currentStory.content.body.filter(
      (block) => block.component === "ImageWithText"
    );

    return (
      <div>
        {currentStory.content.body.map((block) => {
          console.log("Block Component Type:", block.component); // Log each block's component type

          // Dynamically render components based on the block's "component" field
          switch (block.component) {
            case "hero":
              console.log("Rendering Hero Block:", block); // Log the hero block
              return <Hero key={block._uid} hero={block} />; // Ensure Hero is rendered here
            case "teaser":
              return <Teaser key={block._uid} teaser={block} />;
            case "page":
              return <Page key={block._uid} page={block} />;
            default:
              return null;
          }
        })}

        {/* Render ImageWithText blocks in a Grid */}
        {ImageWithTextBlocks.length > 0 && (
          <Grid blocks={ImageWithTextBlocks} />
        )}
      </div>
    );
  } catch (error) {
    notFound();
  }
}

// Force dynamic rendering in development and Visual editor
export const dynamic = StoryblokCMS.isDevelopment
  ? "force-dynamic"
  : "force-static";
