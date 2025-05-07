"use client";

import React, { useState } from 'react';
import { storyblokEditable } from '@storyblok/react';
import CategoryFilter from '../nestable/CategoryFilter';
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
  
  return (
    <div {...storyblokEditable(blok)} className={styles.shopPage}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <h1>{blok.title}</h1>
        <p>{blok.introText}</p>
      </div>
      
      {/* Filter Bar */}
      <div className={styles.filterBar}>
        {/* All category default option */}
        <button 
          className={`${styles.filter} ${activeCategory === 'all' ? styles.active : ''}`}
          onClick={() => handleCategoryChange('all')}
        >
          All
        </button>
        
        {/* Render category filters */}
        {blok.categories?.map((category) => (
          <CategoryFilter
            key={category._uid}
            blok={category}
            isActive={activeCategory === category.slug}
            onClick={() => handleCategoryChange(category.slug)}
            styles={styles}
          />
        ))}
      </div>
      
      {/* Top Products Grid */}
      {topProducts.length > 0 && (
        <div className={styles.productGrid}>
          {topProducts.map((product) => (
            <ProductCard
              key={product._uid}
              blok={product}
              styles={styles}
            />
          ))}
        </div>
      )}
      
      {/* Middle Description */}
      {blok.description && (
        <div className={styles.description}>
          <p>{blok.description}</p>
        </div>
      )}
      
      {/* Bottom Products Grid */}
      {bottomProducts.length > 0 && (
        <div className={styles.productGrid}>
          {bottomProducts.map((product) => (
            <ProductCard
              key={product._uid}
              blok={product}
              styles={styles}
            />
          ))}
        </div>
      )}
    </div>
  );
} 