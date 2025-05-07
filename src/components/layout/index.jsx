import { StoryblokComponent } from "@storyblok/react/rsc";

//Uses config set global components for the layout
export default function Layout({ config, children }) {
    const navbar = config?.content?.navbar && Array.isArray(config?.content?.navbar) 
                  ? config?.content?.navbar[0] 
                  : null;

    //Create navigation component only
    return (
        <>
            <header>
                {navbar && <StoryblokComponent blok={navbar} />}
            </header>
            <main>{children}</main>
        </>
    );
}