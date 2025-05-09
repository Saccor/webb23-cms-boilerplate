import Layout from "@/components/layout";
import "./globals.css"; // Make sure the path to your global styles is correct
import StoryblokProvider from "@/providers/StoryblokProvider";
import { StoryblokCMS } from "@/utils/cms";
import { storyblokInit, apiPlugin } from "@storyblok/react";

// Initialize Storyblok outside the component
if (StoryblokCMS.TOKEN) {
  storyblokInit({
    accessToken: StoryblokCMS.TOKEN,
    use: [apiPlugin],
  });
}

export default async function RootLayout({ children }) {
  let currentConfig = {};
  
  try {
    // Only attempt to fetch config if token exists
    if (StoryblokCMS.TOKEN) {
      currentConfig = await StoryblokCMS.getConfig();
    } else {
      console.error("Storyblok token is missing. Please add NEXT_PUBLIC_PREVIEW_STORYBLOK_TOKEN to your .env file.");
    }
  } catch (error) {
    console.error("Error fetching Storyblok config:", error);
  }
  
  // Provide a default empty structure for config if it's not available
  if (!currentConfig.content) {
    currentConfig.content = {
      logo: null,
      links: [],
      hero: null,
      footer_links: []
    };
  }
  
  return (
    <StoryblokProvider>
      <html lang="en">
        <body className="bg-gray-50 text-gray-900">
          {!StoryblokCMS.TOKEN && (
            <div className="bg-red-500 text-white p-4 text-center">
              <p>⚠️ Storyblok token is missing! Please add NEXT_PUBLIC_PREVIEW_STORYBLOK_TOKEN to your .env file.</p>
            </div>
          )}
          <Layout config={currentConfig}>{children}</Layout>
        </body>
      </html>
    </StoryblokProvider>
  );
}
