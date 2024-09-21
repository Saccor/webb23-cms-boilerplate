import { getStoryblokApi } from "@storyblok/react/rsc";

export class StoryblokCMS {
  static IS_PROD = process.env.NODE_ENV === "production";
  static IS_DEV = process.env.NODE_ENV === "development";
  static VERSION = this.IS_PROD ? "published" : "draft";
  static TOKEN = process.env.NEXT_PUBLIC_PREVIEW_STORYBLOK_TOKEN;

  // Helper function to perform GET requests to Storyblok API
  static async sbGet(path, params) {
    return getStoryblokApi().get(path, params);
  }

  // Fetch a specific story from Storyblok using the slug
  static async getStory(params) {
    if (!params) return {};
    const uri = params?.slug?.join("/") || "home"; // Default to "home" if no slug provided
    const storyUrl = "cdn/stories/" + uri;
    
    try {
      const { data } = await this.sbGet(storyUrl, this.getDefaultSBParams());
      return data.story;
    } catch (error) {
      console.error("Error fetching story:", error);
      return null; // Return null in case of error, handled in dynamic pages
    }
  }

  // Generate default Storyblok API parameters
  static getDefaultSBParams() {
    return {
      version: this.VERSION,
      resolve_links: "url",
      cv: Date.now(), // Cache-busting timestamp
    };
  }

  // Fetch global config or settings from Storyblok (e.g., site-wide configuration)
  static async getConfig() {
    try {
      const { data } = await this.sbGet("cdn/stories/config", this.getDefaultSBParams());
      return data?.story;
    } catch (error) {
      console.error("CONFIG ERROR", error);
      return {};
    }
  }

  // Generate meta tags and SEO data from a Storyblok story
  static async generateMetaFromStory(slug) {
    try {
      const story = await this.getStory({ slug: [slug] });
      if (!story) return {};

      const { name, content } = story;
      const metaTitle = content?.meta_title || name;
      const metaDescription = content?.meta_description || "Default description";

      return {
        title: metaTitle,
        description: metaDescription,
      };
    } catch (error) {
      console.error("Error generating metadata:", error);
      return {
        title: "Title",
        description: "Description",
      };
    }
  }

  // Generate static paths for all pages from Storyblok
  static async getStaticPaths() {
    try {
      let sbParams = {
        version: this.VERSION,
      };

      let { data } = await this.sbGet("cdn/links/", sbParams);
      let paths = [];

      Object.keys(data.links).forEach((linkKey) => {
        const link = data.links[linkKey];
        if (link.is_folder || link.slug === "home") return;

        let slug = link.slug === "home" ? [] : link.slug;
        if (slug) {
          paths.push({
            slug: slug.split("/"),
          });
        }
      });

      return paths;
    } catch (error) {
      console.error("Error generating static paths:", error);
    }
  }
}
