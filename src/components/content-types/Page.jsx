//page.jsx
import { StoryblokComponent } from "@storyblok/react/rsc";

//Content-type component (acts as template for all pages)
export default function Page({ blok }) {
    return (
        <main className="flex flex-col">
            {blok?.body?.map((blok) => (
                <StoryblokComponent blok={blok} key={blok._uid} />
            ))}
        </main>
    )
}