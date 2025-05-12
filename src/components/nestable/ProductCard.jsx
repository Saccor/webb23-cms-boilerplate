"use client";

import React from 'react';
import { storyblokEditable } from '@storyblok/react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ blok }) {
  // Enhanced debug logging
  console.log('ProductCard rendering with blok:', {
    title: blok.title,
    hasImage: !!blok.image || !!blok.heroImage,
    imageType: blok.image ? (typeof blok.image === 'string' ? 'string' : 'object') : 'none',
    hasCategory: !!blok.category,
    categoryType: blok.category ? (Array.isArray(blok.category) ? 'array' : typeof blok.category) : 'none',
    categoryCount: Array.isArray(blok.category) ? blok.category.length : 0,
    firstCategory: Array.isArray(blok.category) && blok.category.length > 0 
      ? `${blok.category[0].name} (${blok.category[0].slug})` 
      : 'none',
    component: blok.component,
    uid: blok._uid
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
  const productSlug = blok.slug || generateSlug(blok.title);
  const productUrl = productSlug ? `/products/${productSlug}` : '#';
  
  // Get the image URL, trying both image and heroImage fields
  const imageUrl = getImageUrl(blok.image || blok.heroImage);
  
  // Get the primary category (if any)
  const getPrimaryCategoryName = () => {
    if (!blok.category || !Array.isArray(blok.category) || blok.category.length === 0) {
      return null;
    }
    
    // Find active category or first category
    const activeCategory = blok.category.find(cat => cat && cat.active);
    const primaryCategory = activeCategory || blok.category[0];
    
    return primaryCategory?.name || null;
  };
  
  const primaryCategory = getPrimaryCategoryName();
  
  return (
    <Link href={productUrl} className="block">
      <div 
        {...storyblokEditable(blok)} 
        className="relative w-[265px] h-[331px] flex flex-col"
      >
        {/* Product Image - exact dimensions from spec */}
        <div className="w-[264.03px] h-[264.6px] bg-[#c4c4c4]">
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
          
          {/* Primary category badge (if available) */}
          {primaryCategory && (
            <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
              {primaryCategory}
            </div>
          )}
        </div>
        
        {/* Product Title - positioned exactly as in spec */}
        <h3 className="w-[238.7px] h-[27.34px] absolute top-[277.3px] left-0 text-[17px] font-bold leading-[28px] font-public text-black">
          {blok.title}
        </h3>
        
        {/* Product Price - positioned exactly as in spec */}
        <p className="w-[149.06px] h-[27.34px] absolute top-[303.66px] left-0 text-[17px] font-normal leading-[28px] font-public text-black">
          {formatPrice(blok.price)}
        </p>
        
        {/* Product Size - positioned exactly as in spec */}
        {blok.size && (
          <span className="w-[15.59px] h-[27.34px] absolute top-[277.3px] left-[249.41px] text-[17px] font-normal leading-[28px] font-public text-black">
            {blok.size}
          </span>
        )}
      </div>
    </Link>
  );
} 