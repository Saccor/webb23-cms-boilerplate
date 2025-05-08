import { StoryblokCMS } from "@/utils/cms";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Get the search query from the URL
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json({ 
        error: 'Missing search query parameter "q"' 
      }, { status: 400 });
    }
    
    // Search for products using the CMS utility function
    const results = await StoryblokCMS.searchProducts(query);
    
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ 
      error: 'An error occurred while processing your search request' 
    }, { status: 500 });
  }
} 