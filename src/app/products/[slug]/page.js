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
  console.log(`====== CATEGORY PAGE DEBUG ======`);
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
  
  // 1. Fetch all product cards from ShopListPages
  const shopListProducts = await getProductsFromShopListPages();
  console.log(`Found ${shopListProducts.length} products from ShopListPages`);
  
  // Log sample shop list products 
  if (shopListProducts.length > 0) {
    console.log(`First product from ShopListPages:`, {
      title: shopListProducts[0]?.title,
      hasCategory: !!shopListProducts[0]?.category,
      categoryType: shopListProducts[0]?.category ? 
        (Array.isArray(shopListProducts[0]?.category) ? 'array' : typeof shopListProducts[0]?.category) : 'none',
      categoryCount: Array.isArray(shopListProducts[0]?.category) ? shopListProducts[0]?.category.length : 0,
      categoryDetails: Array.isArray(shopListProducts[0]?.category) ? 
        JSON.stringify(shopListProducts[0]?.category) : 'not an array'
    });
  }
  
  // 2. Fetch standalone product components
  const standaloneProducts = await getStandaloneProducts();
  console.log(`Found ${standaloneProducts.length} standalone products`);
  
  // Log sample standalone products
  if (standaloneProducts.length > 0) {
    console.log(`First standalone product:`, {
      title: standaloneProducts[0]?.title,
      hasCategory: !!standaloneProducts[0]?.category,
      categoryType: standaloneProducts[0]?.category ? 
        (Array.isArray(standaloneProducts[0]?.category) ? 'array' : typeof standaloneProducts[0]?.category) : 'none',
      categoryCount: Array.isArray(standaloneProducts[0]?.category) ? standaloneProducts[0]?.category.length : 0,
      categoryDetails: Array.isArray(standaloneProducts[0]?.category) ? 
        JSON.stringify(standaloneProducts[0]?.category) : 'not an array'
    });
  }
  
  // 3. Combine all products
  const allProducts = [...shopListProducts, ...standaloneProducts];
  console.log(`Total products combined: ${allProducts.length}`);
  
  if (allProducts.length === 0) {
    console.error("No products found in Storyblok");
    notFound();
  }
  
  // Filter products by category
  const filteredProducts = filterProductsByCategory(allProducts, category);
  console.log(`Filtered products by category "${category}": ${filteredProducts.length}`);
  
  // Ensure all product items have proper category structure
  const productsWithCategories = ensureCategoryStructure(filteredProducts, category);
  
  // Create a synthetic ShopListPage with the filtered products
  const shopListPage = createShopListPage(category, productsWithCategories);
  console.log(`====== END CATEGORY PAGE DEBUG ======`);
  
  return <StoryblokStory story={shopListPage} />;
}

// Helper to fetch products from ShopListPages
async function getProductsFromShopListPages() {
  try {
    // Fetch all ShopListPage components
    const params = StoryblokCMS.getDefaultSBParams();
    const shoplistParams = {
      ...params,
      filter_query: {
        component: { is: "shop_list_page" }
      },
      per_page: 100
    };
    
    const response = await StoryblokCMS.sbGet('cdn/stories', shoplistParams);
    const shoplistStories = response.data?.stories || [];
    
    console.log(`Found ${shoplistStories.length} ShopListPages`);
    
    // Extract products from each ShopListPage
    const allProducts = [];
    
    shoplistStories.forEach(shopList => {
      if (!shopList.content) return;
      
      // Process products_top
      if (Array.isArray(shopList.content.products_top)) {
        shopList.content.products_top.forEach(product => {
          if (product) {
            // Make a deep copy and add source info
            const productCopy = JSON.parse(JSON.stringify(product));
            productCopy._source = 'products_top';
            productCopy._shoplist = shopList.name || shopList.slug || 'unknown';
            allProducts.push(productCopy);
          }
        });
      }
      
      // Process products_bottom
      if (Array.isArray(shopList.content.products_bottom)) {
        shopList.content.products_bottom.forEach(product => {
          if (product) {
            // Make a deep copy and add source info
            const productCopy = JSON.parse(JSON.stringify(product));
            productCopy._source = 'products_bottom';
            productCopy._shoplist = shopList.name || shopList.slug || 'unknown';
            allProducts.push(productCopy);
          }
        });
      }
    });
    
    console.log(`Extracted ${allProducts.length} products from ShopListPages`);
    return allProducts;
    
  } catch (error) {
    console.error("Error fetching ShopListPage products:", error);
    return [];
  }
}

// Helper to fetch standalone product components
async function getStandaloneProducts() {
  try {
    const params = {
      ...StoryblokCMS.getDefaultSBParams(),
      filter_query: {
        component: { is: "product" }
      },
      per_page: 100
    };
    
    const response = await StoryblokCMS.sbGet('cdn/stories', params);
    const products = response.data?.stories || [];
    
    // Transform standalone products to match product_card format
    return products.map(product => {
      const { content } = product;
      return {
        _uid: product.uuid || `standalone-${Math.random()}`,
        component: "product_card",
        title: content.title,
        price: content.price,
        image: content.image || content.heroImage,
        category: content.category || [],
        size: content.size,
        slug: product.slug,
        _source: 'standalone_product'
      };
    });
  } catch (error) {
    console.error("Error fetching standalone products:", error);
    return [];
  }
}

// Helper to filter products by category
function filterProductsByCategory(products, categorySlug) {
  console.log(`Filtering ${products.length} products by category "${categorySlug}"`);
  
  // Always return all products for testing
  if (categorySlug === 'test-all') {
    console.log(`TEST MODE: Returning all products without filtering`);
    return products;
  }
  
  return products.filter(product => {
    if (!product) return false;
    
    // Debug log product details
    console.log(`Checking product "${product.title || 'Unknown'}" for category "${categorySlug}"`, {
      hasCategory: !!product.category,
      categoryType: product.category ? 
        (Array.isArray(product.category) ? 'array' : typeof product.category) : 'none',
      categories: Array.isArray(product.category) ? 
        product.category.map(c => c?.slug || 'invalid').join(', ') : 'none'
    });
    
    // Case 1: Check product.category array for a match
    if (Array.isArray(product.category) && product.category.length > 0) {
      const matchedCategory = product.category.find(cat => 
        cat && cat.slug && cat.slug.toLowerCase() === categorySlug.toLowerCase()
      );
      
      if (matchedCategory) {
        console.log(`✅ Category match found for ${product.title}: ${matchedCategory.slug}`);
        return true;
      }
    }
    
    // Case 2: Fallback to title-based matching - much more lenient
    if (product.title) {
      const title = product.title.toLowerCase();
      
      if (categorySlug === 'mens' && 
          (title.includes('men') || title.includes('man') || title.includes("men's"))) {
        console.log(`✅ Title match found for ${product.title} with "${categorySlug}"`);
        return true;
      }
      
      if (categorySlug === 'womens' && 
          (title.includes('women') || title.includes('woman') || title.includes("women's"))) {
        console.log(`✅ Title match found for ${product.title} with "${categorySlug}"`);
        return true;
      }
    }
    
    // Case 3: If product is from a standalone product with content.category
    if (product.content && Array.isArray(product.content.category) && product.content.category.length > 0) {
      const contentCategoryMatch = product.content.category.find(cat => 
        cat && cat.slug && cat.slug.toLowerCase() === categorySlug.toLowerCase()
      );
      
      if (contentCategoryMatch) {
        console.log(`✅ Content category match found for ${product.title}`);
        return true;
      }
    }
    
    console.log(`❌ No match for product "${product.title || 'Unknown'}" with "${categorySlug}"`);
    return false;
  });
}

// Helper to ensure consistent category structure on all products
function ensureCategoryStructure(products, categorySlug) {
  console.log(`Ensuring category structure for ${products.length} products`);
  
  return products.map(product => {
    // Create a deep copy to avoid reference issues
    const newProduct = JSON.parse(JSON.stringify(product));
    
    // Make sure category is an array
    if (!Array.isArray(newProduct.category)) {
      console.log(`Creating empty category array for product "${newProduct.title || 'Unnamed'}"`);
      newProduct.category = [];
    }
    
    // Check if this category is already present
    const hasCategory = newProduct.category.some(cat => 
      cat && cat.slug && cat.slug.toLowerCase() === categorySlug.toLowerCase()
    );
    
    // Add the category if not already present
    if (!hasCategory) {
      const categoryObj = {
        _uid: `${categorySlug}-${Math.random().toString(36).substring(2, 10)}`,
        name: categorySlug === 'mens' ? "Men's" : "Women's",
        slug: categorySlug,
        component: "category",
        active: true
      };
      
      console.log(`Adding category to product "${newProduct.title || 'Unnamed'}":`, categoryObj);
      newProduct.category.push(categoryObj);
    } else {
      console.log(`Product "${newProduct.title || 'Unnamed'}" already has category "${categorySlug}"`);
    }
    
    return newProduct;
  });
}

// Helper to create a synthetic ShopListPage with filtered products
function createShopListPage(category, products) {
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
  
  return {
    uuid: `synthetic-${category}-page-${Date.now()}`,
    name: `${categoryName} Products`,
    slug: `products/${category}`,
    full_slug: `products/${category}`,
    content: {
      component: "shop_list_page",
      title: `${categoryName} Products`,
      introText: `Browse our collection of ${category} products.`,
      products_top: products,
      products_bottom: [],
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
}

// Force dynamic rendering in development for preview functionality
export const dynamic = StoryblokCMS.isDevelopment
  ? "force-dynamic"
  : "force-static"; 