import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import "./globals.css"; // Ensure global styles are correctly imported
import StoryblokProvider from "@/providers/StoryblokProvider";
import { StoryblokCMS } from "@/utils/cms";
import { storyblokInit, apiPlugin, getStoryblokApi } from "@storyblok/react";

// Initialize Storyblok
storyblokInit({
  accessToken: StoryblokCMS.TOKEN,
  use: [apiPlugin], // Ensure apiPlugin is loaded
});

export default async function RootLayout({ children }) {
  const storyblokApi = getStoryblokApi(); // Access the Storyblok API client
  const currentConfig = await StoryblokCMS.getConfig(storyblokApi); // Fetch global config from Storyblok using the API

  // Log the currentConfig to verify its structure
  console.log("Fetched Global Config:", currentConfig);

  // If no config is found, return early to avoid rendering issues
  if (!currentConfig || !currentConfig.content) {
    console.error("No global config found in Storyblok");
    return null;
  }

  // Log the content for debugging
  console.log("Global Config Content:", currentConfig.content);

  return (
    <StoryblokProvider>
      <html lang="en">
        <body className="bg-gray-50 text-gray-900">
          {/* Render the Header with logo and links */}
          {currentConfig.content.logo && currentConfig.content.links ? (
            <Header logo={currentConfig.content.logo} links={currentConfig.content.links} />
          ) : (
            <p>Logo or links missing in global config</p>
          )}
          
          {/* Render main page content */}
          <main>{children}</main>

          {/* Render the Footer if available */}
          {currentConfig.content.footer ? (
            <Footer blok={currentConfig.content.footer} />
          ) : (
            <p>Footer missing in global config</p>
          )}
        </body>
      </html>
    </StoryblokProvider>
  );
}
