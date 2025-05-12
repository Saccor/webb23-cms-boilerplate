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
  
  // First try to find a product by slug
  let story = await StoryblokCMS.getProductBySlug(slug);
  
  // If not found by slug, try to find it by title from all products
  if (!story) {
    console.log(`Product not found by slug, trying to find by title matching: ${slug}`);
    
    // 1. Get products from ShopListPages
    const shopListProducts = await getProductsFromShopListPages();
    
    // 2. Get standalone products
    const standaloneProducts = await getStandaloneProducts();
    
    // 3. Combine all products
    const allProducts = [...shopListProducts, ...standaloneProducts];
    console.log(`Searching among ${allProducts.length} total products`);
    
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
      console.log(`Found product by title match: ${matchByTitle.title}`);
      
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
  
  // Filter products by the requested category
  const filteredProducts = filterProductsByCategory(allProducts, category);
  console.log(`Selected ${filteredProducts.length} products for category "${category}"`);
  
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
      console.log(`Processing ShopListPage: ${shopList.name || shopList.slug || 'unnamed'}`);
      
      if (!shopList.content) {
        console.log(`No content found in ShopListPage ${shopList.name || shopList.slug || 'unnamed'}`);
        return;
      }

      // Navigate to the correct nesting level
      // First check if there's a body array with shop_list_page components
      if (Array.isArray(shopList.content.body)) {
        shopList.content.body.forEach((block, blockIndex) => {
          if (block.component === 'shop_list_page') {
            console.log(`Found shop_list_page component in body[${blockIndex}]`);
            
            // Process products_top from the shop_list_page component
            if (Array.isArray(block.products_top)) {
              console.log(`Found ${block.products_top.length} products in body[${blockIndex}].products_top array`);
              
              block.products_top.forEach((product, index) => {
                if (product && product.component === 'product_card') {
                  // Make a deep copy and add source info
                  const productCopy = JSON.parse(JSON.stringify(product));
                  productCopy._source = 'products_top';
                  productCopy._shoplist = shopList.name || shopList.slug || 'unknown';
                  
                  console.log(`Product ${index} from products_top: ${productCopy.title || 'unnamed'}, has category: ${!!productCopy.category}`);
                  
                  allProducts.push(productCopy);
                } else {
                  console.log(`Skipping invalid product at index ${index} in products_top`);
                }
              });
            } else {
              console.log(`No products_top array found in shop_list_page component at body[${blockIndex}]`);
            }
            
            // Process products_bottom from the shop_list_page component
            if (Array.isArray(block.products_bottom)) {
              console.log(`Found ${block.products_bottom.length} products in body[${blockIndex}].products_bottom array`);
              
              block.products_bottom.forEach((product, index) => {
                if (product && product.component === 'product_card') {
                  // Make a deep copy and add source info
                  const productCopy = JSON.parse(JSON.stringify(product));
                  productCopy._source = 'products_bottom';
                  productCopy._shoplist = shopList.name || shopList.slug || 'unknown';
                  
                  console.log(`Product ${index} from products_bottom: ${productCopy.title || 'unnamed'}, has category: ${!!productCopy.category}`);
                  
                  allProducts.push(productCopy);
                } else {
                  console.log(`Skipping invalid product at index ${index} in products_bottom`);
                }
              });
            } else {
              console.log(`No products_bottom array found in shop_list_page component at body[${blockIndex}]`);
            }
          }
        });
      } else {
        console.log(`No body array found in ShopListPage ${shopList.name || shopList.slug || 'unnamed'}`);
      }
      
      // ALSO check for direct products_top and products_bottom at the content level (for backward compatibility)
      // Process products_top
      if (Array.isArray(shopList.content.products_top)) {
        console.log(`Found ${shopList.content.products_top.length} products in root products_top array`);
        
        shopList.content.products_top.forEach((product, index) => {
          if (product && product.component === 'product_card') {
            // Make a deep copy and add source info
            const productCopy = JSON.parse(JSON.stringify(product));
            productCopy._source = 'products_top';
            productCopy._shoplist = shopList.name || shopList.slug || 'unknown';
            
            console.log(`Product ${index} from root products_top: ${productCopy.title || 'unnamed'}, has category: ${!!productCopy.category}`);
            
            allProducts.push(productCopy);
          } else {
            console.log(`Skipping invalid product at index ${index} in root products_top`);
          }
        });
      } else {
        console.log(`No products_top array found at root level in ShopListPage ${shopList.name || shopList.slug || 'unnamed'}`);
      }
      
      // Process products_bottom
      if (Array.isArray(shopList.content.products_bottom)) {
        console.log(`Found ${shopList.content.products_bottom.length} products in root products_bottom array`);
        
        shopList.content.products_bottom.forEach((product, index) => {
          if (product && product.component === 'product_card') {
            // Make a deep copy and add source info
            const productCopy = JSON.parse(JSON.stringify(product));
            productCopy._source = 'products_bottom';
            productCopy._shoplist = shopList.name || shopList.slug || 'unknown';
            
            console.log(`Product ${index} from root products_bottom: ${productCopy.title || 'unnamed'}, has category: ${!!productCopy.category}`);
            
            allProducts.push(productCopy);
          } else {
            console.log(`Skipping invalid product at index ${index} in root products_bottom`);
          }
        });
      } else {
        console.log(`No products_bottom array found at root level in ShopListPage ${shopList.name || shopList.slug || 'unnamed'}`);
      }
    });
    
    console.log(`Extracted ${allProducts.length} products from ShopListPages`);
    return allProducts;
  } catch (error) {
    console.error("Error fetching products from ShopListPages:", error);
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
  
  // For detailed debugging, count how many products pass each filter
  let matchedByCategory = 0;
  let matchedByTitle = 0;
  let matchedBySource = 0;
  
  const filteredProducts = products.filter(product => {
    if (!product) return false;
    
    const productTitle = product.title || 'Unknown';
    const productSource = product._source || 'unknown';
    
    console.log(`Checking product "${productTitle}" (source: ${productSource}) for category "${categorySlug}"`);
    
    // Add detailed category debugging
    if (Array.isArray(product.category)) {
      console.log(`Product "${productTitle}" has ${product.category.length} categories:`, 
        product.category.map(c => c?.slug || 'unknown').join(', '));
    }
    
    // For mens category, we need to be very careful about title matching
    if (categorySlug === 'mens') {
      // 1. Check category array for a match (primary method)
      if (Array.isArray(product.category) && product.category.length > 0) {
        const matchedCategory = product.category.find(cat => 
          cat && cat.slug && cat.slug.toLowerCase() === 'mens'
        );
        
        if (matchedCategory) {
          console.log(`✅ Matched "${productTitle}" to category "mens" via category object`);
          matchedByCategory++;
          return true;
        }
      }
      
      // 2. Title-based matching with EXACT word boundary for "Men's" or "men's" only
      if (product.title) {
        const title = product.title.toLowerCase();
        // Use word boundary regex to ensure it's "men's" and not part of "women's"
        if (/\bmen'?s\b/.test(title)) {
          console.log(`✅ Matched "${productTitle}" to category "mens" via title word boundary`);
          matchedByTitle++;
          return true;
        }
      }
      
      // 3. ONLY use source as matching criteria for men's products if it's from products_top
      if (product._source === 'products_top') {
        console.log(`✅ Matched "${productTitle}" to category "mens" via source 'products_top'`);
        matchedBySource++;
        return true;
      }
      
      // If we get here, this product should NOT be in the mens category
      console.log(`❌ Product "${productTitle}" does not match category "mens"`);
      return false;
    }
    // For womens category, the existing logic works well
    else if (categorySlug === 'womens') {
      // 1. Check category array for a match (primary method)
      if (Array.isArray(product.category) && product.category.length > 0) {
        const matchedCategory = product.category.find(cat => 
          cat && cat.slug && cat.slug.toLowerCase() === 'womens'
        );
        
        if (matchedCategory) {
          console.log(`✅ Matched "${productTitle}" to category "womens" via category object`);
          matchedByCategory++;
          return true;
        }
      }
      
      // 2. Title-based matching for "Women's" or "women's"
      if (product.title) {
        const title = product.title.toLowerCase();
        if (title.includes("women's")) {
          console.log(`✅ Matched "${productTitle}" to category "womens" via title`);
          matchedByTitle++;
          return true;
        }
      }
      
      // 3. Check if product comes from products_bottom (which should be women's products)
      if (product._source === 'products_bottom') {
        console.log(`✅ Matched "${productTitle}" to category "womens" via source 'products_bottom'`);
        matchedBySource++;
        return true;
      }
      
      console.log(`❌ Product "${productTitle}" does not match category "womens"`);
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
          console.log(`✅ Matched "${productTitle}" to category "${categorySlug}" via category object`);
          matchedByCategory++;
          return true;
        }
      }
      
      console.log(`❌ Product "${productTitle}" does not match category "${categorySlug}"`);
      return false;
    }
  });
  
  console.log(`Category "${categorySlug}" filtering results:`);
  console.log(`- Total products: ${products.length}`);
  console.log(`- Matched by category: ${matchedByCategory}`);
  console.log(`- Matched by title: ${matchedByTitle}`);
  console.log(`- Matched by source: ${matchedBySource}`);
  console.log(`- Total matched: ${filteredProducts.length}`);
  
  return filteredProducts;
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
    
    // Do NOT modify original title or other data
    // This preserves the original product data from Storyblok
    
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