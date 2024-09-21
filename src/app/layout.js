import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/content-types/Hero';
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

  // If no config is found, return early to avoid rendering issues
  if (!currentConfig || !currentConfig.content) {
    console.error("No global config found in Storyblok");
    return null;
  }

  return (
    <StoryblokProvider>
      <html lang="en">
        <body className="bg-gray-50 text-gray-900">
          {/* Render the Header with logo and links */}
          <Header logo={currentConfig.content.logo} links={currentConfig.content.links} />
          
          {/* Render Hero section if available */}
          {currentConfig.content.hero && <Hero hero={currentConfig.content.hero} />}
          
          {/* Render main page content */}
          <main>{children}</main>

          {/* Render the Footer if available */}
          {currentConfig.content.footer && <Footer blok={currentConfig.content.footer} />}
        </body>
      </html>
    </StoryblokProvider>
  );
}
