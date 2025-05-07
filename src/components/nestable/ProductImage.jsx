"use client"
import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import Image from 'next/image'
import Link from 'next/link'

const ProductImage = ({ blok }) => {
  // Process image URL for optimization if it's from Storyblok
  const getImageUrl = (filename) => {
    if (!filename) return '';
    
    // Check if it's a Storyblok image and add transformations
    if (filename.startsWith('https://a.storyblok.com')) {
      return `${filename}/m/368x521/filters:format(webp)`;
    }
    
    return filename;
  };
  
  const url = blok.link?.url || blok.link?.cached_url || '#';
  
  return (
    <div 
      {...storyblokEditable(blok)} 
      className="
        w-full 
        h-[521px]
        bg-[#C4C4C4] 
        relative 
        overflow-hidden
        shadow-sm
      "
      style={{ aspectRatio: '368/521' }}
    >
      {blok.image?.filename ? (
        <Link href={url} className="block w-full h-full">
          <Image 
            src={getImageUrl(blok.image.filename)}
            alt={blok.alt || 'Product image'}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 368px"
            className="object-cover"
          />
        </Link>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-gray-600">Product Image</span>
        </div>
      )}
    </div>
  );
};

export default ProductImage; 