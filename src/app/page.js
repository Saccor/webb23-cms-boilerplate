import { StoryblokCMS } from "@/utils/cms";
import { notFound } from "next/navigation";
import Page from "@/components/content-types/Page";

export async function generateMetadata() {
  return StoryblokCMS.generateMetaFromStory("home");
}

export default async function StartPage() {
  try {
    const currentStory = await StoryblokCMS.getStory({ slug: ["home"] });
    console.log("Fetched Story Data:", currentStory);
console.log("Content Body Structure:", JSON.stringify(currentStory.content.body, null, 2)); // Log detailed structure of body

    if (!currentStory) throw new Error();

    return <Page blok={currentStory.content} />;
  } catch (error) {
    notFound();
  }
}

export const dynamic = StoryblokCMS.isDevelopment ? "force-dynamic" : "force-static";
