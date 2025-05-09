"use client";

import React, { useState } from 'react';
import { storyblokEditable } from '@storyblok/react';
import ProductCard from '../nestable/ProductCard';
import styles from './ShopListPage.module.css';

export default function ShopListPage({ blok }) {
  // Debug log to check what data is coming from Storyblok
  console.log("ShopListPage blok data:", blok);
  
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Handle category filter click
  const handleCategoryChange = (categorySlug) => {
    setActiveCategory(categorySlug);
  };
  
  // Prepare filtered products based on active category
  const filterProducts = (products) => {
    if (!products) return [];
    
    if (activeCategory === 'all') {
      return products;
    }
    
    return products.filter(product => 
      product.category === activeCategory
    );
  };
  
  const topProducts = filterProducts(blok.products_top);
  const bottomProducts = filterProducts(blok.products_bottom);
  
  // Debug log to check filtered products
  console.log("Filtered products:", { topProducts, bottomProducts });
  
  // Default category buttons if none provided from CMS
  const defaultCategories = [
    { _uid: 'sweaters', name: 'Sweaters', slug: 'sweaters' },
    { _uid: 'tops', name: 'Tops', slug: 'tops' },
    { _uid: 'jackets', name: 'Jackets', slug: 'jackets' },
    { _uid: 'hats', name: 'Hats', slug: 'hats' }
  ];
  
  // Use CMS categories or defaults
  const categories = blok.categories?.length ? blok.categories : defaultCategories;
  
  return (
    <div {...storyblokEditable(blok)} className={styles.shopPage}>
      <div className={styles.container}>
        {/* Header Area with Text */}
        <div className={styles.headerArea}>
          <h1>{blok.title || 'See our products'}</h1>
          <p>{blok.introText || 'Revamp your style with the latest designer trends in clothing or achieve a perfectly curated wardrobe thanks to our line-up of timeless pieces.'}</p>
        </div>
        
        {/* Filter Bar */}
        <div className={styles.filterBar}>
          {/* Category filters */}
          {categories.map((category) => (
            <button 
              key={category._uid}
              className={`${styles.filterButton} ${activeCategory === category.slug ? styles.active : ''}`}
              onClick={() => handleCategoryChange(category.slug)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Top Products Grid */}
        <div className={styles.productGrid}>
          {topProducts.map((product) => (
            <ProductCard
              key={product._uid}
              blok={product}
            />
          ))}
        </div>
        
        {/* Middle Description */}
        {blok.description && (
          <div className={styles.description}>
            <p>{blok.description}</p>
          </div>
        )}
        
        {/* Bottom Products Grid */}
        <div className={styles.productGrid}>
          {bottomProducts.map((product) => (
            <ProductCard
              key={product._uid}
              blok={product}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 