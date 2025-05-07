import StoryblokStory from "@storyblok/react/story";
import { notFound } from "next/navigation";
import { StoryblokCMS } from "@/utils/cms";

// Generate static paths for all products
export async function generateStaticParams() {
  try {
    const productsData = await StoryblokCMS.getProductSlugs();
    return productsData.map(slug => ({ slug }));
  } catch (error) {
    console.error("Error generating product paths:", error);
    return [];
  }
}

// Generate metadata for product pages
export async function generateMetadata({ params }) {
  try {
    const slug = params.slug;
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
    console.error("Error generating product metadata:", error);
    return {
      title: 'Product',
      description: 'Product details'
    };
  }
}

// Product detail page component
export default async function ProductDetailPage({ params }) {
  try {
    const slug = params.slug;
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
  } catch (error) {
    console.error("Error rendering product:", error);
    notFound();
  }
}

// Force dynamic rendering in development for preview functionality
export const dynamic = StoryblokCMS.isDevelopment
  ? "force-dynamic"
  : "force-static"; 