import { StoryblokComponent } from "@storyblok/react/rsc";

export default function Page({ blok }) {
  return (
    <main className="flex flex-col">
      {/* Map through the blocks and render each one dynamically */}
      {blok?.body?.map((blok) => (
        <StoryblokComponent blok={blok} key={blok._uid} />
      ))}
    </main>
  );
}
