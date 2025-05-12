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
    notFound();
  }
}

// Render an individual product detail page
async function renderProductPage(slug) {
  // First try to find a product by slug
  let story = await StoryblokCMS.getProductBySlug(slug);
  
  // If not found by slug, try to find it by title from all products
  if (!story) {
    // 1. Get products from ShopListPages
    const shopListProducts = await getProductsFromShopListPages();
    
    // 2. Get standalone products
    const standaloneProducts = await getStandaloneProducts();
    
    // 3. Combine all products
    const allProducts = [...shopListProducts, ...standaloneProducts];
    
    // Find a product with matching title-based slug or direct title match
    const matchByTitle = allProducts.find(product => {
      // Check slug
      if (product.slug === slug) return true;
      
      // Convert title to slug format and check
      const titleSlug = product.title ? 
        product.title.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/--+/g, '-')
        : '';
      
      // Also check if the slugified title matches
      if (titleSlug === slug) return true;
      
      // Direct title match (case insensitive)
      if (product.title && slug.replace(/-/g, ' ').toLowerCase() === product.title.toLowerCase()) return true;
      
      return false;
    });
    
    if (matchByTitle) {
      // Convert product card to proper Storyblok story format
      story = {
        content: {
          ...matchByTitle,
          component: 'product',
          _editable: matchByTitle._editable
        },
        name: matchByTitle.title,
        slug: matchByTitle.slug || slug,
        full_slug: `products/${matchByTitle.slug || slug}`,
        uuid: matchByTitle._uid,
        content_type: 'story'
      };
    }
  }
  
  if (!story) {
    notFound();
  }
  
  return <StoryblokStory story={story} />;
}

// Render a category listing page
async function renderCategoryPage(category) {
  // 1. Fetch all product cards from ShopListPages
  const shopListProducts = await getProductsFromShopListPages();
  
  // 2. Fetch standalone product components
  const standaloneProducts = await getStandaloneProducts();
  
  // 3. Combine all products
  const allProducts = [...shopListProducts, ...standaloneProducts];
  
  if (allProducts.length === 0) {
    notFound();
  }
  
  // Filter products by the requested category
  const filteredProducts = filterProductsByCategory(allProducts, category);
  
  // Ensure all product items have proper category structure
  const productsWithCategories = ensureCategoryStructure(filteredProducts, category);
  
  // Create a synthetic ShopListPage with the filtered products
  const shopListPage = createShopListPage(category, productsWithCategories);
  
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
    
    // Extract products from each ShopListPage
    const allProducts = [];
    
    shoplistStories.forEach(shopList => {
      if (!shopList.content) {
        return;
      }

      // Navigate to the correct nesting level
      // First check if there's a body array with shop_list_page components
      if (Array.isArray(shopList.content.body)) {
        shopList.content.body.forEach((block) => {
          if (block.component === 'shop_list_page') {
            // Process products_top from the shop_list_page component
            if (Array.isArray(block.products_top)) {
              block.products_top.forEach((product) => {
                if (product && product.component === 'product_card') {
                  // Make a deep copy and add source info
                  const productCopy = JSON.parse(JSON.stringify(product));
                  productCopy._source = 'products_top';
                  productCopy._shoplist = shopList.name || shopList.slug || 'unknown';
                  
                  allProducts.push(productCopy);
                }
              });
            }
            
            // Process products_bottom from the shop_list_page component
            if (Array.isArray(block.products_bottom)) {
              block.products_bottom.forEach((product) => {
                if (product && product.component === 'product_card') {
                  // Make a deep copy and add source info
                  const productCopy = JSON.parse(JSON.stringify(product));
                  productCopy._source = 'products_bottom';
                  productCopy._shoplist = shopList.name || shopList.slug || 'unknown';
                  
                  allProducts.push(productCopy);
                }
              });
            }
          }
        });
      }
      
      // ALSO check for direct products_top and products_bottom at the content level (for backward compatibility)
      // Process products_top
      if (Array.isArray(shopList.content.products_top)) {
        shopList.content.products_top.forEach((product) => {
          if (product && product.component === 'product_card') {
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
        shopList.content.products_bottom.forEach((product) => {
          if (product && product.component === 'product_card') {
            // Make a deep copy and add source info
            const productCopy = JSON.parse(JSON.stringify(product));
            productCopy._source = 'products_bottom';
            productCopy._shoplist = shopList.name || shopList.slug || 'unknown';
            
            allProducts.push(productCopy);
          }
        });
      }
    });
    
    return allProducts;
  } catch (error) {
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
    return [];
  }
}

// Helper to filter products by category
function filterProductsByCategory(products, categorySlug) {
  return products.filter(product => {
    if (!product) return false;
    
    // For mens category
    if (categorySlug === 'mens') {
      // 1. Check category array for a match (primary method)
      if (Array.isArray(product.category) && product.category.length > 0) {
        const matchedCategory = product.category.find(cat => 
          cat && cat.slug && cat.slug.toLowerCase() === 'mens'
        );
        
        if (matchedCategory) {
          return true;
        }
      }
      
      // 2. Title-based matching with EXACT word boundary for "Men's" or "men's" only
      if (product.title) {
        const title = product.title.toLowerCase();
        // Use word boundary regex to ensure it's "men's" and not part of "women's"
        if (/\bmen'?s\b/.test(title)) {
          return true;
        }
      }
      
      // 3. ONLY use source as matching criteria for men's products if it's from products_top
      if (product._source === 'products_top') {
        return true;
      }
      
      return false;
    }
    // For womens category
    else if (categorySlug === 'womens') {
      // 1. Check category array for a match (primary method)
      if (Array.isArray(product.category) && product.category.length > 0) {
        const matchedCategory = product.category.find(cat => 
          cat && cat.slug && cat.slug.toLowerCase() === 'womens'
        );
        
        if (matchedCategory) {
          return true;
        }
      }
      
      // 2. Title-based matching for "Women's" or "women's"
      if (product.title) {
        const title = product.title.toLowerCase();
        if (title.includes("women's")) {
          return true;
        }
      }
      
      // 3. Check if product comes from products_bottom (which should be women's products)
      if (product._source === 'products_bottom') {
        return true;
      }
      
      return false;
    }
    // For any other category (non-mens, non-womens)
    else {
      // Just match by category slug
      if (Array.isArray(product.category) && product.category.length > 0) {
        const matchedCategory = product.category.find(cat => 
          cat && cat.slug && cat.slug.toLowerCase() === categorySlug.toLowerCase()
        );
        
        if (matchedCategory) {
          return true;
        }
      }
      
      return false;
    }
  });
}

// Helper to ensure consistent category structure on all products
function ensureCategoryStructure(products, categorySlug) {
  return products.map(product => {
    // Create a deep copy to avoid reference issues
    const newProduct = JSON.parse(JSON.stringify(product));
    
    // Make sure category is an array
    if (!Array.isArray(newProduct.category)) {
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
      
      newProduct.category.push(categoryObj);
    }
    
    return newProduct;
  });
}

// Helper to create a synthetic ShopListPage with filtered products
function createShopListPage(category, products) {
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
  
  // Ensure all products have proper category data but preserve original title/content
  const enhancedProducts = products.map(product => {
    // Make a deep copy to avoid reference issues
    const enhancedProduct = JSON.parse(JSON.stringify(product));
    
    // Make sure categories are added
    if (!Array.isArray(enhancedProduct.category)) {
      enhancedProduct.category = [];
    }
    
    // Add the category if not already present
    const hasCategory = enhancedProduct.category.some(cat => 
      cat && cat.slug && cat.slug.toLowerCase() === category.toLowerCase()
    );
    
    if (!hasCategory) {
      enhancedProduct.category.push({
        _uid: `${category}-${Math.random().toString(36).substring(2, 10)}`,
        name: category === 'mens' ? "Men's" : "Women's",
        slug: category,
        component: "category",
        active: true
      });
    }
    
    return enhancedProduct;
  });
  
  return {
    uuid: `synthetic-${category}-page-${Date.now()}`,
    name: `${categoryName} Products`,
    slug: `products/${category}`,
    full_slug: `products/${category}`,
    content: {
      component: "shop_list_page",
      title: `${categoryName} Products`,
      introText: `Browse our collection of ${category} products.`,
      products_top: enhancedProducts,
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