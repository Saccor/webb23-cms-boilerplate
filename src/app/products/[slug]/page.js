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
  
  // Extract products from ShopListPage
  const extractProductsFromShopList = (shopList) => {
    if (!shopList.content) return [];
    
    const allProducts = [
      ...(shopList.content.products_top || []),
      ...(shopList.content.products_bottom || [])
    ];
    
    // Filter products by category
    return allProducts.filter(product => {
      if (!product) return false;
      
      console.log(`Checking ShopList product: ${product.title || 'Unknown'}`, product.category);
      
      // Check if product has matching category as an array of objects
      if (Array.isArray(product.category)) {
        const hasCategory = product.category.some(cat => cat.slug === category);
        if (hasCategory) {
          console.log(`✅ Match found in category array for "${product.title}"`);
          return true;
        }
      }
      
      // Check if product component is product_card
      if (product.component === 'product_card') {
        // Fallback to title check for product_card components
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
      }
      
      console.log(`❌ No category match for "${product.title || 'Unknown'}"`);
      return false;
    });
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
        // Make sure each has the proper format and category field
        ...shopListProducts.map(product => {
          // Ensure each product has component and category field
          return {
            ...product,
            component: "product_card",
            // Ensure category array exists and contains this category
            category: Array.isArray(product.category) ? 
              // Keep existing categories and ensure this one is included
              product.category.some(cat => cat.slug === category) ?
                product.category : 
                [...product.category, { 
                  _uid: `cat-${category}-${Date.now()}`, 
                  name: category.charAt(0).toUpperCase() + category.slice(1), 
                  slug: category, 
                  active: true, 
                  component: "category" 
                }]
              : 
              // Create new category array
              [{ 
                _uid: `cat-${category}-${Date.now()}`, 
                name: category.charAt(0).toUpperCase() + category.slice(1), 
                slug: category, 
                active: true, 
                component: "category" 
              }]
          };
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
              _uid: product.uuid || product.content._uid || `product-${Date.now()}`,
              component: "product_card",
              title: product.content.title,
              price: product.content.price?.replace('$', '') || "99", 
              size: product.content.sizes?.[0]?.label || "M",
              image: imageField,
              // Set proper category as array of objects
              category: [{ 
                _uid: `cat-${category}-${Date.now()}`, 
                name: category.charAt(0).toUpperCase() + category.slice(1), 
                slug: category, 
                active: true, 
                component: "category" 
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
  
  // Add debug logging to see what products we're passing
  console.log(`Generating page with ${shopListPage.content.products_top.length} products`);
  shopListPage.content.products_top.forEach((product, index) => {
    console.log(`Product ${index + 1}: ${product.title}`, {
      component: product.component,
      hasImage: !!product.image,
      imageType: product.image ? (typeof product.image === 'string' ? 'string url' : 'object') : 'none',
      imageUrl: product.image?.filename || product.image || 'No image',
      categoryCount: Array.isArray(product.category) ? product.category.length : 0
    });
  });
  
  return <StoryblokStory story={shopListPage} />;
}

// Force dynamic rendering in development for preview functionality
export const dynamic = StoryblokCMS.isDevelopment
  ? "force-dynamic"
  : "force-static"; 