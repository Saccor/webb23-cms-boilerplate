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
    
    console.log(`Filtering products for category: ${activeCategory}, total products: ${products.length}`);
    
    // Enhanced filtering to handle category as a block instead of a string
    return products.filter(product => {
      // Log the product structure to understand it better
      console.log(`Checking product: ${product.title || product.component}`, {
        hasCategory: !!product.category,
        categoryType: product.category ? (Array.isArray(product.category) ? 'array' : typeof product.category) : 'none',
        component: product.component
      });
      
      // Case 1: If category is a direct string match
      if (product.category === activeCategory) {
        console.log(`✅ Direct string match for "${product.title}"`);
        return true;
      }
      
      // Case 2: If category is an array of blocks
      if (Array.isArray(product.category) && product.category.length > 0) {
        // Log all categories to see what we're working with
        product.category.forEach((cat, index) => {
          console.log(`Category ${index}:`, cat);
        });
        
        // Look for a category block with matching slug
        const hasMatchingCategory = product.category.some(cat => {
          // Handle both formats: {slug: 'mens'} and {slug: {name: 'mens'}}
          if (cat.slug === activeCategory) return true;
          if (cat.slug && cat.slug.name === activeCategory) return true;
          return false;
        });
        
        if (hasMatchingCategory) {
          console.log(`✅ Found matching category in array for "${product.title}"`);
          return true;
        }
      }
      
      // Case 3: If category is a single block object (not in array)
      if (product.category && typeof product.category === 'object' && !Array.isArray(product.category)) {
        if (product.category.slug === activeCategory) {
          console.log(`✅ Object category match for "${product.title}"`);
          return true;
        }
      }
      
      // Case 4: Fallback - check title (temporary workaround)
      if (product.title) {
        const lowerTitle = product.title.toLowerCase();
        const titleMatch = (
          (activeCategory === 'mens' && lowerTitle.includes("men")) ||
          (activeCategory === 'womens' && lowerTitle.includes("women"))
        );
        
        if (titleMatch) {
          console.log(`✅ Title match for "${product.title}" with category "${activeCategory}"`);
          return true;
        }
      }
      
      console.log(`❌ No match for "${product.title || 'Unknown'}"`);
      return false;
    });
  };
  
  const topProducts = filterProducts(blok.products_top);
  const bottomProducts = filterProducts(blok.products_bottom);
  
  // Debug log to check filtered products
  console.log("Filtered products:", { 
    active: activeCategory,
    topCount: topProducts.length, 
    bottomCount: bottomProducts.length 
  });
  
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