"use client";

import React, { useState } from 'react';
import { storyblokEditable } from '@storyblok/react';
import Image from 'next/image';
import styles from './ProductDetailPage.module.css'; // We'll create this file next

export default function ProductDetailPage({ blok }) {
  // Log the blok data for debugging
  console.log("ProductDetailPage blok data:", blok);
  
  // Set initial selected color and size
  const [selectedColor, setSelectedColor] = useState(
    blok?.colors?.find(c => c.active) || (blok?.colors?.length > 0 ? blok.colors[0] : null)
  );
  
  const [selectedSize, setSelectedSize] = useState(
    blok?.sizes?.find(s => s.active) || (blok?.sizes?.length > 0 ? blok.sizes[0] : null)
  );

  // Format price with dollar sign
  const formatPrice = (price) => {
    if (!price) return '';
    return price.startsWith('$') ? price : `$${price}`;
  };
  
  // Process image URL for Storyblok images
  const getImageUrl = (filename) => {
    if (!filename) return '';
    
    // Check if it's a Storyblok image and add transformations if needed
    if (filename.startsWith('https://a.storyblok.com')) {
      return `${filename}/m/1200x800/filters:format(webp)`;
    }
    
    return filename;
  };

  return (
    <div {...storyblokEditable(blok)} className={styles.productDetailPage}>
      {/* Black header placeholder - this will visually extend the navbar */}
      <div className={styles.headerPlaceholder}></div>
      
      {/* Clear white background for content */}
      <div className={styles.productContainer}>
        {/* Product Image */}
        <div className={styles.productImageContainer}>
          {blok.heroImage?.filename ? (
            <Image 
              src={getImageUrl(blok.heroImage.filename)}
              alt={blok.title || 'Product image'}
              width={554}
              height={554}
              className={styles.productImage}
              priority={true}
            />
          ) : (
            <div className={styles.productImagePlaceholder}></div>
          )}
        </div>
        
        {/* Product Details */}
        <div className={styles.productDetails}>
          {/* Title & Price */}
          <h1 className={styles.productTitle}>{blok.title}</h1>
          <p className={styles.productPrice}>{formatPrice(blok.price)}</p>
          
          {/* Description */}
          {blok.description && (
            <p className={styles.productDescription}>
              {blok.description}
            </p>
          )}
          
          {/* Color Options */}
          <div className={styles.optionSection}>
            <p className={styles.optionLabel}>Color</p>
            <div className={styles.colorOptions}>
              {/* We'll use hardcoded color options as shown in the Figma */}
              <button
                className={`${styles.colorOption} ${selectedColor?.colorHex === '#DF9167' ? styles.colorOptionActive : ''}`}
                onClick={() => setSelectedColor({ _uid: 'color1', colorHex: '#DF9167' })}
                aria-label="Select orange color"
                data-index={0}
              />
              <button
                className={`${styles.colorOption} ${selectedColor?.colorHex === '#000000' ? styles.colorOptionActive : ''}`}
                onClick={() => setSelectedColor({ _uid: 'color2', colorHex: '#000000' })}
                aria-label="Select black color"
                data-index={1}
              />
            </div>
          </div>
          
          {/* Size Options */}
          <div className={styles.optionSection}>
            <p className={styles.optionLabel}>Size</p>
            <div className={styles.sizeOptions}>
              {/* Use static size options to match the Figma */}
              {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'].map((sizeLabel, index) => (
                <button
                  key={sizeLabel}
                  className={`${styles.sizeOption} ${selectedSize?.label === sizeLabel ? styles.sizeOptionActive : ''}`}
                  onClick={() => setSelectedSize({ _uid: `size${index}`, label: sizeLabel })}
                >
                  {sizeLabel}
                </button>
              ))}
            </div>
          </div>
          
          {/* Size & Fit Guide */}
          <div className={styles.fitGuideSection}>
            <h2 className={styles.fitGuideTitle}>Size & Fit Guide</h2>
            
            {/* Model Info */}
            {blok.modelInfo && (
              <p className={styles.fitGuideText}>
                {blok.modelInfo}
              </p>
            )}
            
            {/* If no model info, use a default one */}
            {!blok.modelInfo && (
              <p className={styles.fitGuideText}>
                Height of model: 189 cm. / 6&apos; 2&quot; Size 41
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 