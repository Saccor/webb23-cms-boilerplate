//cms.js
import { getStoryblokApi } from "@storyblok/react/rsc";
export class StoryblokCMS {
  static IS_PROD = process.env.NODE_ENV === "production";
  static IS_DEV = process.env.NODE_ENV === "development";
  static VERSION = this.IS_PROD ? "published" : "draft";
  static TOKEN = process.env.NEXT_PUBLIC_PREVIEW_STORYBLOK_TOKEN;

  static async sbGet(path, params) {
    return getStoryblokApi().get(path, params);
  }

  static async getStory(params) {
    if (!params) return {};
    const uri = params?.slug?.join("/");
    const storyUrl = "cdn/stories/" + uri;
    const { data } = await this.sbGet(
      storyUrl,
      this.getDefaultSBParams()
    );
    return data.story;
  }

  static getDefaultSBParams() {
    return {
      version: this.VERSION,
      resolve_links: "url",
      cv: Date.now(),
    };
  }

  static async getConfig() {
    try {
      const { data } = await this.sbGet(
        "cdn/stories/config",
        this.getDefaultSBParams()
      );
      return data?.story;
    } catch (error) {
      console.log("CONFIG ERROR", error);
      return {};
    }
  }

  static async generateMetaFromStory(slug) {
    //Read nextjs metadata docs
    //1. Add Seo fields to Page component in storyblok (in own tab)
    //1. Fetch the story from Storyblok (make sure that page content-type has metadata)
    //2. Extract the metadata from the story
    //3. Return the metadata object
    return {
      title: "Title",
      description: "Description",
    };
  }

  //Generates static paths from Links API endpoint
  static async getStaticPaths() {
    try {
      let sbParams = {
        version: this.VERSION,
      };

      let { data } = await this.sbGet("cdn/links/", sbParams);
      let paths = [];

      Object.keys(data.links).forEach((linkKey) => {
        const link = data.links[linkKey];
        if (link.is_folder || link.slug === "home") {
          return;
        }
        let slug = link.slug === "home" ? [] : link.slug;

        if (slug != "") {
          paths.push({
            slug: slug.split("/"),
          });
        }
      });

      return paths;
    } catch (error) {
      console.log("PATHS ERROR", error);
    }
  }
}
