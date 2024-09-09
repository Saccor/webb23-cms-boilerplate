import Layout from "@/components/layout";
import "./globals.css"; // Make sure the path to your global styles is correct
import StoryblokProvider from "@/providers/StoryblokProvider";
import { StoryblokCMS } from "@/utils/cms";
import { storyblokInit, apiPlugin } from "@storyblok/react";

// Initialize Storyblok outside the component
storyblokInit({
  accessToken: StoryblokCMS.TOKEN,
  use: [apiPlugin],
});

export default async function RootLayout({ children }) {
  const currentConfig = await StoryblokCMS.getConfig(); // Fetch global config from Storyblok
  
  return (
    <StoryblokProvider>
      <html lang="en">
        <body className="bg-gray-50 text-gray-900"> {/* Tailwind utility classes */}
          <Layout config={currentConfig}>{children}</Layout> {/* Pass config */}
        </body>
      </html>
    </StoryblokProvider>
  );
}
