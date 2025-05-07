"use client"
import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import Image from 'next/image'

const Banner = ({ blok }) => {
  // Process image URL for optimization if it's from Storyblok
  const getImageUrl = (filename) => {
    if (!filename) return '';
    
    // Check if it's a Storyblok image and add transformations
    if (filename.startsWith('https://a.storyblok.com')) {
      return `${filename}/m/1600x600/filters:format(webp)`;
    }
    
    return filename;
  };
  
  return (
    <section {...storyblokEditable(blok)}>
      {blok.image?.filename && (
        <Image 
          src={getImageUrl(blok.image.filename)}
          alt={blok.alt || ''}
          width={1600}
          height={600}
          className="w-full h-auto"
          priority={true}
        />
      )}
    </section>
  );
}

export default Banner 