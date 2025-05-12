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
  
  // Only fetch ShopListPage content since that's where our products are
  const params = StoryblokCMS.getDefaultSBParams();
  
  const shoplistParams = {
    ...params,
    filter_query: {
      component: { is: "shop_list_page" }
    },
    per_page: 10
  };
  
  // Fetch only ShopListPage content
  const shoplistResponse = await StoryblokCMS.sbGet('cdn/stories', shoplistParams);
  const shoplistStories = shoplistResponse.data?.stories || [];
  
  if (shoplistStories.length === 0) {
    console.error("No shop list pages found");
    notFound();
  }
  
  console.log(`Found ${shoplistStories.length} shop list pages`);
  
  // Extract products from ShopListPage
  const getAllProducts = (shopListStories) => {
    const allProducts = [];
    
    // Process each ShopListPage story
    shopListStories.forEach((shopList, shopListIndex) => {
      if (!shopList.content) return;
      
      console.log(`Processing ShopListPage #${shopListIndex}: ${shopList.name || shopList.slug || 'unknown'}`);
      
      // Process products_top array
      if (Array.isArray(shopList.content.products_top)) {
        shopList.content.products_top.forEach((product, index) => {
          if (product) {
            console.log(`Found product #${index} in products_top: ${product.title || 'untitled'}`);
            // Make a deep copy of the product to avoid reference issues
            allProducts.push(JSON.parse(JSON.stringify(product)));
          }
        });
      }
      
      // Process products_bottom array
      if (Array.isArray(shopList.content.products_bottom)) {
        shopList.content.products_bottom.forEach((product, index) => {
          if (product) {
            console.log(`Found product #${index} in products_bottom: ${product.title || 'untitled'}`);
            // Make a deep copy of the product to avoid reference issues
            allProducts.push(JSON.parse(JSON.stringify(product)));
          }
        });
      }
    });
    
    return allProducts;
  };
  
  // Get all products from all ShopListPage stories
  const allProducts = getAllProducts(shoplistStories);
  console.log(`Total products extracted from all shop list pages: ${allProducts.length}`);

  // Filter products by category
  const filterProductsByCategory = (products, categorySlug) => {
    console.log(`Filtering ${products.length} products for category: ${categorySlug}`);
    
    return products.filter(product => {
      if (!product) return false;
      
      // Debug product structure
      console.log(`\nChecking product: ${product.title || 'Unknown'}`, {
        hasCategory: !!product.category,
        categoryType: product.category ? (Array.isArray(product.category) ? 'array' : typeof product.category) : 'none'
      });
      
      // Case 1: Check if category is an array of category objects with slug field
      if (Array.isArray(product.category)) {
        // Look for a category with the exact slug match
        const matchedCategory = product.category.find(cat => {
          if (!cat) return false;
          
          console.log(`Category object:`, cat);
          // Check slug directly
          return cat.slug === categorySlug;
        });
        
        if (matchedCategory) {
          console.log(`✅ Found matching category: ${matchedCategory.slug}`);
          return true;
        }
      }
      
      // Case 2: Fallback to title-based matching
      if (product.title) {
        const lowerTitle = product.title.toLowerCase();
        const titleMatch = (
          (categorySlug === 'mens' && lowerTitle.includes("men")) ||
          (categorySlug === 'womens' && lowerTitle.includes("women"))
        );
        
        if (titleMatch) {
          console.log(`✅ Title match for "${product.title}" with category "${categorySlug}"`);
          return true;
        }
      }
      
      console.log(`❌ No category match for "${product.title || 'Unknown'}"`);
      return false;
    });
  };
  
  // Filter products by category
  const filteredProducts = filterProductsByCategory(allProducts, category);
  
  console.log(`Found ${filteredProducts.length} products for category: ${category}`);
  
  if (filteredProducts.length === 0) {
    console.warn(`⚠️ Warning: No products found for category: ${category}`);
  } else {
    console.log(`✅ Success: Found ${filteredProducts.length} products for category: ${category}`);
    filteredProducts.forEach(product => {
      console.log(`  - ${product.title}`);
    });
  }
  
  // Ensure every product has a properly structured category array
  const ensureCategoryStructure = (products, categorySlug) => {
    return products.map(product => {
      // If product already has properly structured category array, leave it alone
      if (Array.isArray(product.category) && 
          product.category.some(cat => cat && cat.slug === categorySlug)) {
        return product;
      }
      
      // Otherwise, ensure it has the category array with the current category
      const newProduct = { ...product };
      
      if (!Array.isArray(newProduct.category)) {
        newProduct.category = [];
      }
      
      // Add the current category if it's not already present
      if (!newProduct.category.some(cat => cat && cat.slug === categorySlug)) {
        newProduct.category.push({
          _uid: `${categorySlug}-category`,
          name: categorySlug === 'mens' ? "Men's" : "Women's",
          slug: categorySlug,
          component: "category",
          active: true
        });
      }
      
      return newProduct;
    });
  };
  
  // Ensure all filtered products have the correct category structure
  const productsWithCategories = ensureCategoryStructure(filteredProducts, category);
  
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
      // Only use filtered products in products_top
      products_top: productsWithCategories,
      products_bottom: [],
      // Add categories for filtering
      categories: [
        {
          _uid: 'all-category',
          name: 'All',
          slug: 'all',
          component: "category",
          active: false
        },
        {
          _uid: `${category}-category`,
          name: category === 'mens' ? "Men's" : "Women's",
          slug: category,
          component: "category",
          active: true
        }
      ]
    }
  };
  
  // Add debug logging to see what products we're passing
  console.log(`\nGENERATING PAGE WITH ${shopListPage.content.products_top.length} PRODUCTS\n`);
  
  return <StoryblokStory story={shopListPage} />;
}

// Force dynamic rendering in development for preview functionality
export const dynamic = StoryblokCMS.isDevelopment
  ? "force-dynamic"
  : "force-static"; 