"use client";

import React, { useState } from 'react';
import { storyblokEditable } from '@storyblok/react';
import Image from 'next/image';
import styles from './ProductDetailPage.module.css'; // We'll create this file next

export default function ProductDetailPage({ blok }) {
  // Set initial selected color and size
  const [selectedColor, setSelectedColor] = useState(
    blok?.colors?.find(c => c.active) || (blok?.colors?.length > 0 ? blok.colors[0] : null)
  );
  
  const [selectedSize, setSelectedSize] = useState(
    blok?.sizes?.find(s => s.active) || (blok?.sizes?.length > 0 ? blok.sizes[0] : null)
  );

  // Format price with dollar sign
  const formatPrice = (price) => {
    if (price === undefined || price === null) return '';
    // Handle cases where price might be a number or already have a $ sign
    return price.toString().startsWith('$') ? price : `$${price}`;
  };
  
  // Enhanced image URL processor that handles different image formats
  const getImageUrl = (image) => {
    // If image is null or undefined, return empty string
    if (!image) return '';
    
    // If image is a string, use it directly
    if (typeof image === 'string') {
      // Add transformation for Storyblok images
      if (image.startsWith('https://a.storyblok.com')) {
        return `${image}/m/1200x800/filters:format(webp)`;
      }
      return image;
    }
    
    // If image is an object with filename property (Storyblok asset)
    if (image.filename) {
      if (image.filename.startsWith('https://a.storyblok.com')) {
        return `${image.filename}/m/1200x800/filters:format(webp)`;
      }
      return image.filename;
    }
    
    // Fallback to empty string if no valid image format found
    return '';
  };

  // Get image URL from any available source
  const productImageUrl = getImageUrl(blok.heroImage || blok.image);

  return (
    <div {...storyblokEditable(blok)} className={styles.productDetailPage}>
      {/* Black header placeholder - this will visually extend the navbar */}
      <div className={styles.headerPlaceholder}></div>
      
      {/* Clear white background for content */}
      <div className={styles.productContainer}>
        {/* Product Image */}
        <div className={styles.productImageContainer}>
          {productImageUrl ? (
            <Image 
              src={productImageUrl}
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
          <h1 className={styles.productTitle}>{blok.title || 'Product'}</h1>
          <p className={styles.productPrice}>{formatPrice(blok.price) || '$0.00'}</p>
          
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