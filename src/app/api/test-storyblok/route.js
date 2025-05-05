import { StoryblokCMS } from "@/utils/cms";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log('Testing Storyblok connection...');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Using token:', StoryblokCMS.TOKEN ? 'Token is set' : 'Token is missing');
    console.log('Space ID:', StoryblokCMS.SPACE_ID);
    
    const pages = await StoryblokCMS.getAllPages();
    
    return NextResponse.json({
      success: true,
      message: 'Storyblok connection successful',
      environment: process.env.NODE_ENV,
      tokenType: process.env.NODE_ENV === 'production' ? 'Production' : 'Preview',
      spaceId: StoryblokCMS.SPACE_ID,
      pageCount: pages.length,
      pages: pages.map(page => ({
        name: page.name,
        slug: page.full_slug,
        id: page.id,
        content_type: page.content.component
      }))
    });
  } catch (error) {
    console.error('Error testing Storyblok connection:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to connect to Storyblok',
      error: error.message
    }, { status: 500 });
  }
} 