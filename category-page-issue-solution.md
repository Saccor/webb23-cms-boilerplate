# Category Page Issue and Solution

## Original Problem

The e-commerce site built with Next.js and Storyblok CMS was experiencing an issue where category pages (`/products/mens` and `/products/womens`) were not displaying all products correctly:

1. Initially, only one product was showing on category pages
2. Later, no products were showing at all

## Storyblok CMS Structure

1. **Content Structure:**
   - Products were stored in two formats:
     - **Product Card Components**: Used within ShopListPage components (in `products_top` and `products_bottom` arrays)
     - **Standalone Product Components**: Individual product pages with their own URLs
   
2. **Category Structure:**
   - Products had a `category` field which was an array of category objects
   - Each category object had: `{ _uid, name, slug, active, component: "category" }`
   - Example: `{ "_uid": "c408a108-5e9a-4f1c-afc6-0c1f5e7a9881", "name": "Men's", "slug": "mens", "active": true, "component": "category" }`

3. **Component Structure:**
   - `ShopListPage` component contained arrays of product cards (`products_top` and `products_bottom`)
   - `ProductCard` components had fields for title, image, price, size, and category
   - Standalone `product` components had their own structure in Storyblok

## Code Structure

1. The app used a dynamic route (`/products/[slug]/page.js`) to handle both:
   - Individual product pages (when slug was a product name)
   - Category pages (when slug was "mens" or "womens")

2. The rendering logic was split between:
   - `renderProductPage()` for individual products
   - `renderCategoryPage()` for category listings

## Root Causes Identified

1. **Data Fetching Issues:**
   - The code was only querying for one component type at a time (either ShopListPage or product)
   - Products from ShopListPage were not being correctly extracted

2. **Category Filtering Issues:**
   - Inconsistencies in how categories were detected between server and client code
   - Different data structures between standalone products and product cards

3. **Data Transformation Problems:**
   - Products weren't being properly transformed between different formats
   - Deep copies weren't being made, leading to reference issues

## Solution Approach

### 1. Improved Data Fetching

We rewrote the `renderCategoryPage` function to:
- Fetch all ShopListPage components
- Extract product cards from both products_top and products_bottom arrays
- Also fetch standalone product components 
- Merge both sources into a single product collection

```javascript
// Helper to fetch products from ShopListPages
async function getProductsFromShopListPages() {
  // Fetch all ShopListPage components
  const shoplistStories = await fetchShopListPages();
  
  // Extract products from each ShopListPage
  const allProducts = [];
  
  shoplistStories.forEach(shopList => {
    // Process products_top and products_bottom arrays
    if (Array.isArray(shopList.content.products_top)) {
      // Extract and deep copy products
    }
    
    if (Array.isArray(shopList.content.products_bottom)) {
      // Extract and deep copy products
    }
  });
  
  return allProducts;
}

// Helper to fetch standalone product components
async function getStandaloneProducts() {
  // Fetch standalone product components
  // Transform them to match product_card format
}
```

### 2. Improved Category Filtering

We enhanced the category detection to handle multiple formats:

```javascript
function filterProductsByCategory(products, categorySlug) {
  return products.filter(product => {
    // Case 1: Check product.category array for a match
    if (Array.isArray(product.category)) {
      const matchedCategory = product.category.find(cat => 
        cat && cat.slug === categorySlug
      );
      
      if (matchedCategory) return true;
    }
    
    // Case 2: Fallback to title-based matching
    if (product.title && title.toLowerCase().includes(categorySlug)) {
      return true;
    }
    
    // Case 3: Check product.content.category (for standalone products)
    if (product.content && Array.isArray(product.content.category)) {
      // Check for category match in content.category
    }
    
    return false;
  });
}
```

### 3. Consistent Category Structure

We ensured all products had a consistent category structure:

```javascript
function ensureCategoryStructure(products, categorySlug) {
  return products.map(product => {
    // Create a deep copy
    const newProduct = JSON.parse(JSON.stringify(product));
    
    // Ensure category is an array
    if (!Array.isArray(newProduct.category)) {
      newProduct.category = [];
    }
    
    // Add the category if not already present
    if (!hasCategory(newProduct, categorySlug)) {
      newProduct.category.push({
        _uid: generateUID(categorySlug),
        name: formatCategoryName(categorySlug),
        slug: categorySlug,
        component: "category",
        active: true
      });
    }
    
    return newProduct;
  });
}
```

### 4. Enhanced Client-Side Components

1. **ShopListPage Component:**
   - Added better debugging information
   - Improved category filtering logic
   - Added safety checks for missing arrays
   - Enhanced user feedback for category counts

2. **ProductCard Component:**
   - Improved category detection and display
   - Added better image handling
   - Enhanced layout and responsiveness
   - Added fallbacks for missing data

## Implementation Results

The solution addressed all identified issues:

1. **Data Completeness:**
   - All products from both ShopListPage components and standalone products are now fetched
   - Deep copying prevents reference issues

2. **Category Filtering:**
   - Multiple category detection methods ensure robustness
   - Consistent category structure maintained across all products

3. **UI Improvements:**
   - Added category badges for visual feedback
   - Improved error handling and empty state messaging
   - Added debugging information to help troubleshoot

## Additional Issue: Server Startup Error

After implementing the category page fixes, we encountered a Next.js server startup error:

```
Error: You cannot define a route with the same specificity as a optional catch-all route ("/sitemap.xml" and "/sitemap.xml[[...__metadata_id__]]").
```

This error is unrelated to our category page issue but needs to be addressed:

1. **Problem**: There's a conflict between:
   - A static route file for `/sitemap.xml`
   - A dynamic optional catch-all route with the same path

2. **Solution Options**:
   - Remove the duplicate sitemap implementation (keeping either the static or dynamic version)
   - Use a different path for one of the implementations (like `/api/sitemap.xml`)
   - Merge the functionality into a single implementation

To fix this, examine the project structure to identify the conflicting files:
1. Look for both `/app/sitemap.xml/` directory and `/app/sitemap.js` (or similar)
2. Decide which implementation to keep based on requirements
3. Remove or rename the conflicting implementation

## Lessons Learned

1. **Content Modeling:**
   - Consistency in CMS structure is critical for proper data handling
   - Using consistent field names and data types makes development easier

2. **Data Transformation:**
   - Always create deep copies of data when manipulating complex objects
   - Ensure consistent data structures between server and client components

3. **Debugging:**
   - Add detailed logging at key points in the data flow
   - Include counts and structure information in logs
   - Test with real data from the CMS

4. **Next.js Routing:**
   - Dynamic routes can handle different content types
   - Server-side data fetching should consider all relevant content sources
   - Client-side filtering should match server-side logic
   - Be careful with route naming conflicts, especially with catch-all routes

## Future Improvements

1. **Performance Optimization:**
   - Add pagination for large product collections
   - Implement more efficient filtering on the CMS API side

2. **User Experience:**
   - Add more filtering options (price, size, etc.)
   - Implement sorting functionality

3. **Error Handling:**
   - Add more robust fallbacks for missing data
   - Implement better error messaging for users

4. **Code Organization:**
   - Move utility functions to separate files
   - Add TypeScript interfaces for better type safety 