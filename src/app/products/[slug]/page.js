import StoryblokStory from "@storyblok/react/story";
import { notFound } from "next/navigation";
import { StoryblokCMS } from "@/utils/cms";
import { storyblokInit, apiPlugin } from "@storyblok/react";

// Initialize Storyblok
storyblokInit({
  accessToken: StoryblokCMS.TOKEN,
  use: [apiPlugin],
});

// Generate static paths for all products and categories
export async function generateStaticParams() {
  try {
    // Get all product slugs
    const productsData = await StoryblokCMS.getProductSlugs();
    
    // Add category slugs
    const paths = [
      { slug: 'mens' },
      { slug: 'womens' },
      ...productsData.map(slug => ({ slug }))
    ];
    
    return paths;
  } catch (error) {
    console.error("Error generating paths:", error);
    return [];
  }
}

// Generate metadata for product and category pages
export async function generateMetadata({ params }) {
  try {
    const slug = params.slug;
    
    // Check if this is a category page
    if (slug === 'mens' || slug === 'womens') {
      const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);
      return {
        title: `${categoryName} Products`,
        description: `Browse our collection of ${slug} products.`
      };
    }
    
    // Otherwise, try to get product metadata
    const story = await StoryblokCMS.getProductBySlug(slug);
    
    if (!story) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found.'
      };
    }
    
    return {
      title: story.content.title || 'Product',
      description: story.content.description || 'Product details'
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: 'Products',
      description: 'Product details'
    };
  }
}

// Unified page component that handles both products and categories
export default async function ProductPage({ params }) {
  const slug = params.slug;
  
  try {
    // Check if this is a category page
    if (slug === 'mens' || slug === 'womens') {
      return await renderCategoryPage(slug);
    }
    
    // Otherwise, render individual product
    return await renderProductPage(slug);
  } catch (error) {
    console.error("Error rendering page:", error);
    notFound();
  }
}

// Render an individual product detail page
async function renderProductPage(slug) {
  console.log("Fetching product with slug:", slug);
  
  const story = await StoryblokCMS.getProductBySlug(slug);
  
  if (!story) {
    console.error(`Product not found for slug: ${slug}`);
    notFound();
  }
  
  console.log("Found product:", { 
    title: story.content.title,
    slug: story.slug, 
    contentType: story.content.component 
  });
  
  return <StoryblokStory story={story} />;
}

// Render a category listing page
async function renderCategoryPage(category) {
  console.log(`Rendering category page for: ${category}`);
  
  // First try to get a specific story for this category (if it exists in Storyblok)
  try {
    const categoryStory = await StoryblokCMS.getStory({ slug: ['products', category] });
    if (categoryStory && categoryStory.content) {
      console.log(`Found specific story for category: ${category}`);
      return <StoryblokStory story={categoryStory} />;
    }
  } catch (specificStoryError) {
    console.log(`No specific story found for category: ${category}, will use generic approach`);
  }
  
  // Fallback approach: Fetch all products and filter by category
  const params = StoryblokCMS.getDefaultSBParams();
  params.filter_query = {
    component: { is: "product" }
  };
  params.per_page = 100;
  
  const response = await StoryblokCMS.sbGet('cdn/stories', params);
  
  if (!response.data?.stories) {
    console.error("No products found");
    notFound();
  }
  
  // Filter products by category - support multiple category structures
  const categoryProducts = response.data.stories.filter(story => {
    const content = story.content;
    
    // Debug to see product structure
    console.log(`Checking product ${content.title} for category ${category}`);
    
    // Case 1: Category is an array of objects with slug property
    if (content?.category?.length > 0 && typeof content.category[0] === 'object') {
      console.log("Case 1: Category is array of objects");
      const productCategory = content.category[0];
      return productCategory.slug === category;
    }
    
    // Case 2: Category is a string directly matching the category
    if (content?.category === category) {
      console.log("Case 2: Category is direct string match");
      return true;
    }
    
    // Case 3: Category might be inside some other field structure
    if (content?.category?._uid && content.category.slug === category) {
      console.log("Case 3: Category is nested object");
      return true;
    }
    
    // Case 4: Check if any product field contains the category value
    if (Object.keys(content).some(key => {
      if (content[key]?.slug === category) {
        console.log(`Case 4: Found category in field ${key}`);
        return true;
      }
      return false;
    })) {
      return true;
    }
    
    console.log("No category match found");
    return false;
  });
  
  if (categoryProducts.length === 0) {
    console.log(`No products found for category: ${category}`);
  } else {
    console.log(`Found ${categoryProducts.length} products for category: ${category}`);
  }
  
  // Create a synthetic shop list page with filtered products
  const shopListPage = {
    uuid: `synthetic-${category}-page`,
    name: `${category.charAt(0).toUpperCase() + category.slice(1)} Products`,
    slug: `products/${category}`,
    full_slug: `products/${category}`,
    content: {
      component: "shop_list_page",
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} Products`,
      introText: `Browse our collection of ${category} products.`,
      products_top: categoryProducts,
      products_bottom: [],
      // Add any other required fields for shop_list_page
      categories: [
        {
          _uid: 'all',
          name: 'All',
          slug: 'all'
        },
        {
          _uid: category,
          name: category.charAt(0).toUpperCase() + category.slice(1),
          slug: category
        }
      ]
    }
  };
  
  return <StoryblokStory story={shopListPage} />;
}

// Force dynamic rendering in development for preview functionality
export const dynamic = StoryblokCMS.isDevelopment
  ? "force-dynamic"
  : "force-static"; 