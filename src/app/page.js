import { StoryblokCMS } from "@/utils/cms";
import { notFound } from "next/navigation";
import Page from "@/components/content-types/Page";

export async function generateMetadata() {
  return StoryblokCMS.generateMetaFromStory("home");
}

export default async function StartPage() {
  try {
    const currentStory = await StoryblokCMS.getStory({ slug: ["home"] });
    if (!currentStory) throw new Error();

    return <Page blok={currentStory.content} />;
  } catch (error) {
    notFound();
  }
}

export const dynamic = StoryblokCMS.isDevelopment ? "force-dynamic" : "force-static";
