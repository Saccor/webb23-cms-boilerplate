"use client";

import React from 'react';
import { storyblokEditable } from '@storyblok/react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ blok }) {
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
  
  return (
    <Link href={productUrl} className="block">
      <div 
        {...storyblokEditable(blok)} 
        className="relative w-[265px] h-[331px] flex flex-col"
      >
        {/* Product Image - exact dimensions from spec */}
        <div className="w-[264.03px] h-[264.6px] bg-[#c4c4c4]">
          {(blok.image || blok.heroImage) && (
            <Image 
              src={getImageUrl(blok.image || blok.heroImage)}
              alt={blok.title || 'Product image'}
              width={264}
              height={265}
              className="w-full h-full object-cover"
              priority={false}
            />
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