import { StoryblokCMS } from "@/utils/cms";
import { notFound } from "next/navigation";
import StoryblokStory from "@storyblok/react/story";
import { storyblokInit, apiPlugin } from "@storyblok/react";

// Initialize Storyblok
storyblokInit({
  accessToken: StoryblokCMS.TOKEN,
  use: [apiPlugin],
});

// Generate static paths for category pages
export async function generateStaticParams() {
  // For now, we'll hardcode the known categories
  return [
    { category: 'mens' },
    { category: 'womens' }
  ];
}

// Generate metadata for category pages
export async function generateMetadata({ params }) {
  const { category } = params;
  
  // Capitalize first letter for title
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
  
  return {
    title: `${categoryName} Products`,
    description: `Browse our collection of ${category} products.`
  };
}

// Category page component
export default async function CategoryPage({ params }) {
  const { category } = params;
  
  if (!category || (category !== 'mens' && category !== 'womens')) {
    console.error(`Invalid category: ${category}`);
    notFound();
  }
  
  try {
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
    
    // Filter products by category
    const categoryProducts = response.data.stories.filter(story => {
      // Check if product has a category field and if it matches the current category
      if (story.content?.category?.length > 0) {
        const productCategory = story.content.category[0];
        return productCategory.slug === category;
      }
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
    
  } catch (error) {
    console.error("Error rendering category page:", error);
    notFound();
  }
}

// Force dynamic rendering in development for preview functionality
export const dynamic = StoryblokCMS.isDevelopment
  ? "force-dynamic"
  : "force-static"; 