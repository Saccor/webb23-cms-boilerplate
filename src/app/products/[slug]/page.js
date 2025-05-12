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
  
  console.log(`Found ${response.data.stories.length} total products, filtering for category: ${category}`);
  
  // Print out all products and their data structure to understand how categories are stored
  response.data.stories.forEach(story => {
    console.log(`Product: ${story.content.title}, Content:`, JSON.stringify(story.content));
  });
  
  // Filter products by category - super flexible version
  const categoryProducts = response.data.stories.filter(story => {
    const content = story.content;
    
    // Log product being examined
    console.log(`Checking product "${content.title}" for category match with "${category}"`);
    
    // Case 1: Direct check for "category" field that contains the slug
    if (content.category === category) {
      console.log(`✓ Match: Direct category field equals "${category}"`);
      return true;
    }
    
    // Case 2: Check for array of category objects
    if (Array.isArray(content.category)) {
      for (const cat of content.category) {
        // If category is an object with a slug property
        if (cat && typeof cat === 'object') {
          if (cat.slug === category) {
            console.log(`✓ Match: Found category object with slug "${category}"`);
            return true;
          }
          
          // If it's a nested structure
          if (cat.content && cat.content.slug === category) {
            console.log(`✓ Match: Found nested category with slug "${category}"`);
            return true;
          }
        }
        // If category is directly the string we're looking for
        else if (cat === category) {
          console.log(`✓ Match: Found category string "${category}" in array`);
          return true;
        }
      }
    }
    
    // Case 3: Category field is an object (not in an array)
    if (content.category && typeof content.category === 'object' && !Array.isArray(content.category)) {
      if (content.category.slug === category) {
        console.log(`✓ Match: Found category object with slug "${category}"`);
        return true;
      }
    }
    
    // Case 4: Manual check title for category - temporary fallback
    if (content.title && (
        content.title.toLowerCase().includes(category) ||
        (category === 'mens' && content.title.toLowerCase().includes("men's")) ||
        (category === 'womens' && content.title.toLowerCase().includes("women's"))
    )) {
      console.log(`✓ Match: Product title contains category "${category}"`);
      return true;
    }
    
    console.log(`✗ No match for category "${category}"`);
    return false;
  });
  
  if (categoryProducts.length === 0) {
    console.log(`⚠️ Warning: No products found for category: ${category}`);
  } else {
    console.log(`✅ Success: Found ${categoryProducts.length} products for category: ${category}`);
    categoryProducts.forEach(product => {
      console.log(`- ${product.content.title}`);
    });
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