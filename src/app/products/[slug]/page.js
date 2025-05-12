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
  
  // Update query to fetch both product components and shoplistpage
  // We need separate requests since Storyblok doesn't support OR conditions in filter_query
  const productParams = {
    ...params,
    filter_query: {
      component: { is: "product" }
    },
    per_page: 100
  };
  
  const shoplistParams = {
    ...params,
    filter_query: {
      component: { is: "shop_list_page" }
    },
    per_page: 10
  };
  
  // Fetch both types of content
  const [productResponse, shoplistResponse] = await Promise.all([
    StoryblokCMS.sbGet('cdn/stories', productParams),
    StoryblokCMS.sbGet('cdn/stories', shoplistParams)
  ]);
  
  // Process the responses
  const productStories = productResponse.data?.stories || [];
  const shoplistStories = shoplistResponse.data?.stories || [];
  
  if (productStories.length === 0 && shoplistStories.length === 0) {
    console.error("No products or shop pages found");
    notFound();
  }
  
  console.log(`Found ${productStories.length} product components and ${shoplistStories.length} shop list pages`);
  
  // Debug: Look at the first product if available
  if (productStories.length > 0) {
    const firstProduct = productStories[0];
    console.log('First product structure:', {
      uuid: firstProduct.uuid,
      name: firstProduct.name,
      slug: firstProduct.slug,
      full_slug: firstProduct.full_slug,
      contentType: firstProduct.content.component,
      hasTitle: !!firstProduct.content.title,
      hasCategory: !!firstProduct.content.category
    });
  }
  
  // Debug: Look at the first shop list page if available
  if (shoplistStories.length > 0) {
    const firstShopList = shoplistStories[0];
    console.log('First shop list structure:', {
      uuid: firstShopList.uuid,
      name: firstShopList.name,
      slug: firstShopList.slug,
      full_slug: firstShopList.full_slug,
      contentType: firstShopList.content.component,
      hasProductsTop: !!firstShopList.content.products_top,
      topProductsCount: firstShopList.content.products_top ? firstShopList.content.products_top.length : 0,
      hasProductsBottom: !!firstShopList.content.products_bottom,
      bottomProductsCount: firstShopList.content.products_bottom ? firstShopList.content.products_bottom.length : 0
    });
    
    // Debug: Check the first product in products_top if available
    if (firstShopList.content.products_top && firstShopList.content.products_top.length > 0) {
      const topProduct = firstShopList.content.products_top[0];
      console.log('First product in shop_list_page.products_top:', {
        _uid: topProduct._uid,
        component: topProduct.component,
        title: topProduct.title,
        hasCategory: !!topProduct.category,
        categoryType: topProduct.category ? (Array.isArray(topProduct.category) ? 'array' : typeof topProduct.category) : 'none'
      });
      
      // If category is an array, log the first item
      if (Array.isArray(topProduct.category) && topProduct.category.length > 0) {
        console.log('First category in product:', topProduct.category[0]);
      }
    }
  }
  
  // Extract products from ShopListPage
  const extractProductsFromShopList = (shopList) => {
    if (!shopList.content) return [];
    
    console.log(`Extracting products from ShopListPage: ${shopList.name || shopList.slug || 'unknown'}`);
    
    // Get all products from both arrays
    const allProducts = [];
    
    // Add products from products_top if it exists
    if (Array.isArray(shopList.content.products_top)) {
      shopList.content.products_top.forEach((product, index) => {
        if (product) {
          console.log(`Found product #${index} in products_top: ${product.title || product.component || 'unnamed'}`);
          allProducts.push({...product, _originalLocation: 'products_top'});
        }
      });
    }
    
    // Add products from products_bottom if it exists
    if (Array.isArray(shopList.content.products_bottom)) {
      shopList.content.products_bottom.forEach((product, index) => {
        if (product) {
          console.log(`Found product #${index} in products_bottom: ${product.title || product.component || 'unnamed'}`);
          allProducts.push({...product, _originalLocation: 'products_bottom'});
        }
      });
    }
    
    console.log(`Total products found in ShopListPage: ${allProducts.length}`);
    
    // Filter products by category
    const filteredProducts = allProducts.filter(product => {
      if (!product) return false;
      
      console.log(`\nChecking ShopList product: ${product.title || 'Unknown'}`, {
        hasCategory: !!product.category,
        categoryType: product.category ? (Array.isArray(product.category) ? 'array' : typeof product.category) : 'none',
        component: product.component,
        location: product._originalLocation
      });
      
      // Check if category is an array of category objects with slug field
      if (Array.isArray(product.category)) {
        // Look for a category with the exact slug match
        const matchedCategory = product.category.find(cat => {
          if (!cat) return false;
          
          // Get the slug directly - based on the screenshot structure
          console.log(`Category object:`, cat);
          return cat.slug === category;
        });
        
        if (matchedCategory) {
          console.log(`✅ Found matching category in array: ${matchedCategory.slug}`);
          return true;
        }
      }
      
      // Fallback to title-based matching for any product
      if (product.title) {
        const lowerTitle = product.title.toLowerCase();
        const titleMatch = (
          (category === 'mens' && lowerTitle.includes("men")) ||
          (category === 'womens' && lowerTitle.includes("women"))
        );
        
        if (titleMatch) {
          console.log(`✅ Title match for "${product.title}" with category "${category}"`);
          return true;
        }
      }
      
      console.log(`❌ No category match for "${product.title || 'Unknown'}"`);
      return false;
    });
    
    console.log(`Filtered ${allProducts.length} products down to ${filteredProducts.length} for category "${category}"`);
    return filteredProducts;
  };
  
  // Get all products from all shop list pages
  const shopListProducts = shoplistStories.flatMap(extractProductsFromShopList);
  
  console.log(`Found ${shopListProducts.length} products from shop list pages for category: ${category}`);
  
  // Filter standalone products by category
  const categoryProducts = productStories.filter(story => {
    const content = story.content;
    
    console.log(`Checking product ${content.title || content.component} for category: ${category}`);
    
    // For product components
    if (content.component === 'product' && content.title) {
      // Check if title contains the category name for backup matching
      const titleMatch = (
        (category === 'mens' && content.title.toLowerCase().includes("men")) ||
        (category === 'womens' && content.title.toLowerCase().includes("women"))
      );
      
      if (titleMatch) {
        console.log(`✓ Match: Product title contains category "${category}"`);
        return true;
      }
    }
    
    console.log(`✗ No match for category "${category}"`);
    return false;
  });
  
  if (categoryProducts.length === 0 && shopListProducts.length === 0) {
    console.log(`⚠️ Warning: No products found for category: ${category}`);
  } else {
    const totalProducts = categoryProducts.length + shopListProducts.length;
    console.log(`✅ Success: Found ${totalProducts} total products for category: ${category}`);
    if (categoryProducts.length > 0) {
      console.log(`- ${categoryProducts.length} standalone products`);
      categoryProducts.forEach(product => {
        console.log(`  - ${product.content.title}`);
      });
    }
    if (shopListProducts.length > 0) {
      console.log(`- ${shopListProducts.length} products from shop list pages`);
      shopListProducts.forEach(product => {
        console.log(`  - ${product.title}`);
      });
    }
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
      // Combine both sources of products
      products_top: [
        // Products from shop list pages (already in correct format)
        ...shopListProducts.map(product => {
          console.log(`Processing shop list product for synthetic page: ${product.title || 'Unknown'}`);
          
          // Create a clean copy with the correct structure
          const processedProduct = {
            _uid: product._uid || `product-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            component: "product_card",
            title: product.title || '',
            price: product.price || "99",
            size: product.size || "M",
            image: product.image || null,
          };
          
          // Ensure the category is correctly structured as shown in the screenshots
          processedProduct.category = [{
            _uid: `cat-${category}-${Date.now()}`,
            component: "category",
            name: category === 'mens' ? "Men's" : "Women's",
            slug: category,
            active: true
          }];
          
          return processedProduct;
        }),
        // Standalone products (need transformation)
        ...categoryProducts.map(product => {
          // Make sure we're returning the content of product components
          if (product.content?.component === 'product') {
            console.log("Converting product component to product_card format:", product.content.title);
            
            // Handle both image field formats
            let imageField = null;
            if (product.content.heroImage) {
              imageField = product.content.heroImage;
            } else if (product.content.image) {
              imageField = product.content.image;
            }
            
            return {
              _uid: product.uuid || product.content._uid || `product-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              component: "product_card",
              title: product.content.title || '',
              price: product.content.price?.replace('$', '') || "99", 
              size: product.content.sizes?.[0]?.label || "M",
              image: imageField,
              // Set category with exact structure as seen in screenshots
              category: [{
                _uid: `cat-${category}-${Date.now()}`,
                component: "category",
                name: category === 'mens' ? "Men's" : "Women's",
                slug: category,
                active: true
              }]
            };
          }
          return null;
        }).filter(Boolean)
      ],
      products_bottom: [],
      // Add any other required fields for shop_list_page
      categories: [
        {
          _uid: 'all',
          name: 'All',
          slug: 'all',
          component: "category",
          active: false
        },
        {
          _uid: category,
          name: category === 'mens' ? "Men's" : "Women's",
          slug: category,
          component: "category",
          active: true
        }
      ]
    }
  };
  
  // Add debug logging to see what products we're passing
  console.log(`\nGENERATING PAGE WITH ${shopListPage.content.products_top.length} PRODUCTS`);
  console.log(`Product count breakdown: ${shopListProducts.length} from ShopListPage, ${categoryProducts.length} standalone products\n`);
  
  shopListPage.content.products_top.forEach((product, index) => {
    console.log(`Product ${index + 1}: ${product.title}`, {
      component: product.component,
      hasImage: !!product.image,
      categoryStructure: product.category ? JSON.stringify(product.category[0]) : 'no category'
    });
  });
  
  return <StoryblokStory story={shopListPage} />;
}

// Force dynamic rendering in development for preview functionality
export const dynamic = StoryblokCMS.isDevelopment
  ? "force-dynamic"
  : "force-static"; 