import { StoryblokCMS } from "@/utils/cms";
import { notFound } from "next/navigation";
import PageRenderer from "@/components/PageRenderer"; // Use PageRenderer instead of PageContent

export async function generateMetadata() {
  return StoryblokCMS.generateMetaFromStory("home");
}

export default async function StartPage() {
  try {
    const currentStory = await StoryblokCMS.getStory({ slug: ["home"] });
    
    // Handle the case where no story is found
    if (!currentStory) throw new Error();

    return <PageRenderer story={currentStory} />; // Pass fetched data to client component
  } catch (error) {
    console.error("Error fetching or rendering the story:", error);
    notFound();
  }
}

export const dynamic = StoryblokCMS.isDevelopment ? "force-dynamic" : "force-static";
