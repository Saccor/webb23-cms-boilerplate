//cms.js
import { getStoryblokApi } from "@storyblok/react/rsc";
export class StoryblokCMS {
  static IS_PROD = process.env.NODE_ENV === "production";
  static IS_DEV = process.env.NODE_ENV === "development";
  static VERSION = this.IS_PROD ? "published" : "draft";
  static TOKEN = process.env.NEXT_PUBLIC_PREVIEW_STORYBLOK_TOKEN;

  static async sbGet(path, params) {
    if (!this.TOKEN) {
      console.error("Storyblok token is missing. Please add it to your .env file as NEXT_PUBLIC_PREVIEW_STORYBLOK_TOKEN");
      throw new Error("Storyblok token is missing");
    }
    
    try {
      return getStoryblokApi().get(path, params);
    } catch (error) {
      console.error("Error connecting to Storyblok API:", error);
      throw error;
    }
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
      const params = this.getDefaultSBParams();
      const response = await this.sbGet("cdn/stories/config", params);
      
      if (!response.data?.story) {
        console.warn("No config story found in Storyblok. Create a 'config' story with navbar fields.");
      }
      
      return response.data?.story || {};
    } catch (error) {
      console.error("CONFIG ERROR:", error);
      console.log("Make sure you have created a 'config' story in Storyblok and published it.");
      return {};
    }
  }

  // Get a product by its slug
  static async getProductBySlug(slug) {
    try {
      const params = {
        ...this.getDefaultSBParams(),
        filter_query: {
          component: { is: "product" }
        }
      };
      
      // First try to fetch from products folder if it exists
      try {
        const response = await this.sbGet(`cdn/stories/products/${slug}`, params);
        if (response.data?.story) {
          return response.data.story;
        }
      } catch (folderError) {
        console.log(`Product not found in products folder: ${slug}`);
      }
      
      // If not found in folder, try to find by slug in any location
      try {
        const searchParams = {
          ...params,
          by_slugs: `*/${slug}`
        };
        const response = await this.sbGet('cdn/stories', searchParams);
        
        if (response.data?.stories && response.data.stories.length > 0) {
          return response.data.stories[0];
        }
      } catch (searchError) {
        console.log(`Product not found by slug search: ${slug}`);
      }
      
      // Try to find by matching content.title (converted to slug format)
      try {
        const allProductsParams = {
          ...params,
          per_page: 100
        };
        
        const response = await this.sbGet('cdn/stories', allProductsParams);
        
        if (response.data?.stories && response.data.stories.length > 0) {
          // Find a product where the slug generated from title matches
          const product = response.data.stories.find(story => {
            const titleSlug = this.generateSlugFromTitle(story.content.title);
            return titleSlug === slug;
          });
          
          if (product) {
            return product;
          }
        }
      } catch (titleSearchError) {
        console.log(`Product not found by title search: ${slug}`);
      }
      
      console.warn(`No product found with slug: ${slug}`);
      return null;
    } catch (error) {
      console.error("PRODUCT ERROR:", error);
      return null;
    }
  }
  
  // Helper to generate slug from title (same as in ProductCard component)
  static generateSlugFromTitle(title) {
    if (!title) return '';
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')  // Remove special characters
      .replace(/\s+/g, '-')      // Replace spaces with hyphens
      .replace(/--+/g, '-');     // Replace multiple hyphens with single
  }
  
  // Get all product slugs for static path generation
  static async getProductSlugs() {
    try {
      const params = {
        ...this.getDefaultSBParams(),
        filter_query: {
          component: { is: "product" }
        },
        per_page: 100, // Increase if you have more products
      };
      
      const { data } = await this.sbGet('cdn/stories', params);
      
      if (!data?.stories || !data.stories.length) {
        console.warn("No products found in Storyblok");
        return [];
      }
      
      // Use slug from the story, or generate one from the title if missing
      return data.stories.map(story => {
        if (story.slug && story.slug !== '') {
          return story.slug;
        }
        
        // Generate slug from title if no slug is provided
        return this.generateSlugFromTitle(story.content.title);
      });
    } catch (error) {
      console.error("PRODUCT SLUGS ERROR:", error);
      return [];
    }
  }

  // Search for products by query string
  static async searchProducts(query) {
    if (!query || query.trim() === '') {
      return [];
    }

    try {
      // Define parameters for search
      const params = {
        ...this.getDefaultSBParams(),
        filter_query: {
          component: { is: "product" }
        },
        per_page: 12, // Limit results to reasonable number
      };
      
      // Get all products as Storyblok doesn't support text search directly in the API
      const { data } = await this.sbGet('cdn/stories', params);
      
      if (!data?.stories || !data.stories.length) {
        return [];
      }

      // Normalize the search query
      const normalizedQuery = query.toLowerCase().trim();
      
      // Filter products client-side based on title, description, or other relevant fields
      const filteredProducts = data.stories.filter(story => {
        const { content } = story;
        
        // Check title
        if (content.title && content.title.toLowerCase().includes(normalizedQuery)) {
          return true;
        }
        
        // Check description if available
        if (content.description && content.description.toLowerCase().includes(normalizedQuery)) {
          return true;
        }
        
        // Check other relevant fields
        // Add more fields as needed based on your product structure
        
        return false;
      });
      
      // Format the results
      return filteredProducts.map(product => ({
        id: product.uuid,
        title: product.content.title,
        description: product.content.description,
        image: product.content.heroImage || product.content.image,
        price: product.content.price,
        slug: product.slug || this.generateSlugFromTitle(product.content.title),
        // Add more fields as needed
      }));
    } catch (error) {
      console.error("SEARCH PRODUCTS ERROR:", error);
      return [];
    }
  }

  static async generateMetaFromStory(slug) {

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

// Define the Hero1 schema to add background color
export const hero1Schema = {
  component: 'hero1',
  props: {
    title: 'title',               // Heading text (required)
    subtitle: 'subtitle',         // Sub-heading text (optional)
    image: 'image',               // Hero image (required)
    elements: 'elements',         // Additional content blocks (array, optional)
    backgroundColor: 'backgroundColor', // Background color (optional, default: white)
  }
};
