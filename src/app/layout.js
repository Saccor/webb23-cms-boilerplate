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

  // Fetch global config for header
  const currentConfig = await StoryblokCMS.getConfig(storyblokApi);

  // Fetch the footer story separately
  const footerConfig = await StoryblokCMS.getFooter(storyblokApi);

  // If no config or footer is found, return early with an error
  if (!currentConfig || !currentConfig.content || !footerConfig || !footerConfig.content) {
    return <p>No configuration found in Storyblok</p>;
  }

  const { logo, links } = currentConfig.content;

  return (
    <StoryblokProvider>
      <html lang="en">
        <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
          {/* Header */}
          {logo && links ? (
            <Header logo={logo} links={links} />
          ) : (
            <p>Logo or links missing in global config</p>
          )}

          {/* Main content */}
          <main className="flex-grow">{children}</main>

          {/* Footer */}
          <Footer blok={footerConfig.content} />
        </body>
      </html>
    </StoryblokProvider>
  );
}
