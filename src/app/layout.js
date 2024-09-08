//layout.js
import Layout from "@/components/layout";
import "./globals.css";
import StoryblokProvider from "@/providers/StoryblokProvider";
import { StoryblokCMS } from "@/utils/cms";
import { storyblokInit, apiPlugin } from "@storyblok/react";

storyblokInit({
  accessToken: StoryblokCMS.TOKEN,
  use: [apiPlugin],
});

export default async function RootLayout({ children }) {
  const currentConfig = await StoryblokCMS.getConfig();
  return (
    <StoryblokProvider>
      <html>
        <body>
          <Layout config={currentConfig}>{children}</Layout>
        </body>
      </html>
    </StoryblokProvider>
  );
}
