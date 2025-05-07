"use client";

import React from 'react';
import { storyblokEditable } from '@storyblok/react';
import Image from 'next/image';

export default function ProductCard({ blok, styles }) {
  // Process image URL - add image transformation for Storyblok images
  const getImageUrl = (filename) => {
    if (!filename) return '';
    
    // Check if it's a Storyblok image and add transformations if needed
    if (filename.startsWith('https://a.storyblok.com')) {
      return `${filename}/m/300x400/filters:format(webp)`;
    }
    
    return filename;
  };
  
  return (
    <div {...storyblokEditable(blok)} className={styles.productCard}>
      <div className={styles.image}>
        {blok.image?.filename && (
          <Image 
            src={getImageUrl(blok.image.filename)}
            alt={blok.title || 'Product image'}
            width={300}
            height={400}
            style={{ objectFit: "cover" }}
            priority={false}
          />
        )}
        {blok.size && <span className={styles.size}>{blok.size}</span>}
      </div>
      <h3 className={styles.title}>{blok.title}</h3>
      <p className={styles.price}>{blok.price}</p>
    </div>
  );
} 