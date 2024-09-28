// /src/app/[slug]/page.js
import { notFound } from "next/navigation";
import { StoryblokCMS } from "@/utils/cms";
import PageRenderer from "@/components/PageRenderer"; // New client-side component

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
    const currentStory = await StoryblokCMS.getStory(params); // Fetch the story on the server
    if (!currentStory) throw new Error("Story not found");

    console.log("Full Story Content:", currentStory);

    return <PageRenderer story={currentStory} />; // Pass the story data to a client-side component
  } catch (error) {
    console.error("Error rendering CMSPage:", error);
    notFound();
  }
}

export const dynamic = StoryblokCMS.isDevelopment ? "force-dynamic" : "force-static";
