import StoryblokClient from 'storyblok-js-client';
import { NextResponse } from "next/server";

// Mark the route as dynamic to avoid static rendering error
export const dynamic = 'force-dynamic';

export async function GET(request) {
  // Try with both tokens to ensure flexibility
  const previewToken = process.env.NEXT_PUBLIC_PREVIEW_STORYBLOK_TOKEN;
  const productionToken = process.env.NEXT_PUBLIC_PRODUCTION_STORYBLOK_TOKEN;
  
  // Start with preview token since that's what the rest of the app uses
  let storyblokApi = new StoryblokClient({
    accessToken: previewToken
  });
  
  try {
    // Get the search query from the URL
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json({ 
        error: 'Missing search query parameter "q"' 
      }, { status: 400 });
    }
    
    // Search for products
    try {
      // Define parameters for search, use appropriate version
      const params = {
        version: process.env.NODE_ENV === "production" ? "published" : "draft",
        filter_query: {
          component: { is: "product" }
        },
        per_page: 12, // Limit results to reasonable number
      };
      
      // Get all products - try with preview token first
      let data;
      try {
        data = await storyblokApi.get('cdn/stories', params);
      } catch (tokenError) {
        // If preview token fails and production token is available, try that
        if (tokenError.status === 401 && productionToken) {
          console.log('Preview token unauthorized for search, trying production token...');
          storyblokApi = new StoryblokClient({
            accessToken: productionToken
          });
          data = await storyblokApi.get('cdn/stories', params);
        } else {
          // Re-throw if it's not an auth error or we don't have a production token
          throw tokenError;
        }
      }
      
      if (!data?.stories || !data.stories.length) {
        return NextResponse.json({ results: [] });
      }

      // Normalize the search query
      const normalizedQuery = query.toLowerCase().trim();
      
      // Filter products client-side based on title, description, or other relevant fields
      const filteredProducts = data.stories.filter(story => {
        const { content } = story;
        
        // Check title
        if (content.title && content.title.toLowerCase().includes(normalizedQuery)) {
          return true;
        }
        
        // Check description if available
        if (content.description && content.description.toLowerCase().includes(normalizedQuery)) {
          return true;
        }
        
        return false;
      });
      
      // Format the results
      const results = filteredProducts.map(product => ({
        id: product.uuid,
        title: product.content.title,
        description: product.content.description,
        image: product.content.heroImage || product.content.image,
        price: product.content.price,
        slug: product.slug || product.content.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/--+/g, '-'),
      }));
      
      return NextResponse.json({ results });
    } catch (error) {
      console.error("SEARCH PRODUCTS ERROR:", error);
      return NextResponse.json({ results: [] });
    }
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ 
      error: 'An error occurred while processing your search request' 
    }, { status: 500 });
  }
} 