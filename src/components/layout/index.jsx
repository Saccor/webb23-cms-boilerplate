import { StoryblokComponent } from "@storyblok/react/rsc";

//Uses config set global components for the layout
export default function Layout({ config, children }) {
    const navbar = config?.content?.navbar && Array.isArray(config?.content?.navbar) 
                  ? config?.content?.navbar[0] 
                  : null;

    //Create at least a header and footer component
    //Use console.log to determine blok object structure if unsure...
    return (
        <>
            <header>
                {navbar && <StoryblokComponent blok={navbar} />}
            </header>
            <main>{children}</main>
            <footer></footer>
        </>
    );
}