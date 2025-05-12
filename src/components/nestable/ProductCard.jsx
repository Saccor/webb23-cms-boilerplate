"use client";

import React from 'react';
import { storyblokEditable } from '@storyblok/react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ blok }) {
  // Enhanced debug logging
  console.log('ProductCard rendering:', {
    title: blok.title,
    slug: blok.slug,
    hasImage: !!blok.image || !!blok.heroImage,
    component: blok.component,
    _uid: blok._uid,
    source: blok._source || 'unknown'
  });
  
  // Process image URL - add image transformation for Storyblok images
  const getImageUrl = (image) => {
    // If image is null or undefined, return empty string
    if (!image) return '';
    
    // If image is a string, use it directly
    if (typeof image === 'string') {
      if (image.startsWith('https://a.storyblok.com')) {
        return `${image}/m/300x400/filters:format(webp)`;
      }
      return image;
    }
    
    // If image is an object with filename
    if (image.filename) {
      if (image.filename.startsWith('https://a.storyblok.com')) {
        return `${image.filename}/m/300x400/filters:format(webp)`;
      }
      return image.filename;
    }
    
    // Fallback to empty string if no valid image format found
    return '';
  };
  
  // Format price with dollar sign
  const formatPrice = (price) => {
    if (price === undefined || price === null) return '';
    // Handle case when price already has $ sign
    return price.toString().startsWith('$') ? price : `$${price}`;
  };
  
  // Generate slug from title if not provided
  const generateSlug = (title) => {
    if (!title) return '';
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')  // Remove special characters
      .replace(/\s+/g, '-')      // Replace spaces with hyphens
      .replace(/--+/g, '-');     // Replace multiple hyphens with single
  };
  
  // Generate product URL
  // First try using the explicit slug, then fallback to generating one from title
  const productSlug = blok.slug || generateSlug(blok.title);
  const productUrl = productSlug ? `/products/${productSlug}` : '#';
  
  // Store the full product data for passing to detail page
  const productData = {
    title: blok.title,
    price: blok.price,
    description: blok.description,
    image: blok.image,
    heroImage: blok.heroImage,
    slug: productSlug,
    component: "product",
    _uid: blok._uid,
    category: blok.category,
    size: blok.size,
    colors: blok.colors,
    sizes: blok.sizes
  };
  
  // Log the URL being used
  console.log(`ProductCard: Linking to ${productUrl} for product "${blok.title || 'unnamed'}"`);
  
  // Get the image URL, trying both image and heroImage fields
  const imageUrl = getImageUrl(blok.image || blok.heroImage);
  
  // Get categories from the product
  const getCategories = () => {
    console.log(`ProductCard: Checking categories for "${blok.title || 'unnamed product'}"`, {
      hasCategory: !!blok.category,
      categoryType: blok.category ? (Array.isArray(blok.category) ? 'array' : typeof blok.category) : 'none',
      rawCategory: blok.category
    });
    
    // If blok.category is an array (Storyblok blocks array field)
    if (Array.isArray(blok.category)) {
      const validCategories = blok.category.filter(cat => cat && cat.slug);
      console.log(`ProductCard: Found ${validCategories.length} valid categories`, 
        validCategories.map(c => `${c.name}(${c.slug})`));
      return validCategories;
    }
    
    // Return empty array if no category data found
    console.log(`ProductCard: No valid categories found`);
    return [];
  };
  
  const categories = getCategories();
  const primaryCategory = categories.length > 0 ? categories[0] : null;
  
  return (
    <Link href={productUrl} className="block">
      <div 
        {...storyblokEditable(blok)} 
        className="relative w-[265px] h-[331px] flex flex-col"
      >
        {/* Product Image - exact dimensions from spec */}
        <div className="w-[264.03px] h-[264.6px] bg-[#c4c4c4] relative">
          {imageUrl && (
            <Image 
              src={imageUrl}
              alt={blok.title || 'Product image'}
              width={264}
              height={265}
              className="w-full h-full object-cover"
              priority={false}
            />
          )}
          
          {/* Category badge */}
          {primaryCategory && (
            <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
              {primaryCategory.name}
            </div>
          )}
        </div>
        
        {/* Product Title - positioned exactly as in spec */}
        <div className="mt-2">
          <h3 className="text-[17px] font-bold leading-[28px] font-public text-black truncate max-w-[238px]">
            {blok.title || 'Product'}
          </h3>
          
          {/* Product Price */}
          <p className="text-[17px] font-normal leading-[28px] font-public text-black">
            {formatPrice(blok.price) || '$0.00'}
          </p>
        </div>
        
        {/* Product Size - absolute position if specified */}
        {blok.size && (
          <span className="absolute top-[277.3px] right-0 text-[17px] font-normal leading-[28px] font-public text-black">
            {blok.size}
          </span>
        )}
      </div>
    </Link>
  );
} 