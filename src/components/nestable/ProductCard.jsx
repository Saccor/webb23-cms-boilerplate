"use client";

import React from 'react';
import { storyblokEditable } from '@storyblok/react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ blok }) {
  // Process image URL - add image transformation for Storyblok images
  const getImageUrl = (filename) => {
    if (!filename) return '';
    
    // Check if it's a Storyblok image and add transformations if needed
    if (filename.startsWith('https://a.storyblok.com')) {
      return `${filename}/m/300x400/filters:format(webp)`;
    }
    
    return filename;
  };
  
  // Format price with dollar sign
  const formatPrice = (price) => {
    if (price === undefined || price === null) return '';
    return `$${price}`;
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
  
  // Debug log to check product data and URL
  console.log("ProductCard data:", { 
    title: blok.title, 
    slug: blok.slug, 
    generatedSlug: productSlug, 
    url: productUrl 
  });
  
  return (
    <Link href={productUrl} className="block">
      <div 
        {...storyblokEditable(blok)} 
        className="w-[265px] h-[331px] flex flex-col bg-transparent cursor-pointer hover:opacity-90 transition"
      >
        <div className="w-full h-[264.6px] bg-[#c3c3c3]">
          {blok.image?.filename && (
            <Image 
              src={getImageUrl(blok.image.filename)}
              alt={blok.title || 'Product image'}
              width={265}
              height={264}
              className="w-full h-full object-cover"
              priority={false}
            />
          )}
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between items-center mt-2">
            <h3 className="font-public text-[17px] font-semibold leading-[28px] text-black">{blok.title}</h3>
            {blok.size && (
              <span className="font-public text-[17px] font-normal leading-[28px] text-black">{blok.size}</span>
            )}
          </div>
          <p className="font-public text-[17px] font-normal leading-[28px] text-black mt-1">{formatPrice(blok.price)}</p>
        </div>
      </div>
    </Link>
  );
} 