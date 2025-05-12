"use client";

import React, { useState, useEffect } from 'react';
import { storyblokEditable } from '@storyblok/react';
import ProductCard from '../nestable/ProductCard';
import styles from './ShopListPage.module.css';
import { usePathname } from 'next/navigation';

export default function ShopListPage({ blok }) {
  // Debug log to check what data is coming from Storyblok
  console.log("ShopListPage blok data:", {
    title: blok.title,
    hasCategoriesArray: !!blok.categories,
    categoriesCount: blok.categories?.length || 0, 
    topProductsCount: blok.products_top?.length || 0,
    bottomProductsCount: blok.products_bottom?.length || 0
  });

  // Use path to determine initial category
  const pathname = usePathname();
  const initialCategory = pathname.includes('/products/mens') ? 'mens' :
                         pathname.includes('/products/womens') ? 'womens' : 'all';
  
  // Use the extracted category as the initial state
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  
  // Log initial category from pathname
  console.log(`ShopListPage: Initial category from pathname: ${initialCategory}`);
  
  // Effect to update UI when the page first loads 
  useEffect(() => {
    console.log(`ShopListPage: Active category set to: ${activeCategory}`);
  }, [activeCategory]);
  
  // Handle category filter click
  const handleCategoryChange = (categorySlug) => {
    console.log(`ShopListPage: Changing category from ${activeCategory} to ${categorySlug}`);
    setActiveCategory(categorySlug);
  };
  
  // Prepare filtered products based on active category
  const filterProducts = (products) => {
    if (!products) return [];
    
    if (activeCategory === 'all') {
      return products;
    }
    
    console.log(`ShopListPage: Filtering ${products.length} products for category: ${activeCategory}`);
    
    // Enhanced filtering to handle category as a block instead of a string
    const filteredProducts = products.filter(product => {
      // Log the product structure to understand it better
      console.log(`ShopListPage: Checking product: ${product.title || product.component}`, {
        hasCategory: !!product.category,
        categoryType: product.category ? (Array.isArray(product.category) ? 'array' : typeof product.category) : 'none',
        component: product.component,
        _uid: product._uid
      });
      
      // Case 1: If category is a direct string match
      if (product.category === activeCategory) {
        console.log(`ShopListPage: ✅ Direct string match for "${product.title}"`);
        return true;
      }
      
      // Case 2: If category is an array of blocks
      if (Array.isArray(product.category) && product.category.length > 0) {
        // Log all categories to see what we're working with
        product.category.forEach((cat, index) => {
          console.log(`ShopListPage: Category ${index}:`, cat);
        });
        
        // Look for a category block with matching slug
        const hasMatchingCategory = product.category.some(cat => {
          // Handle both formats: {slug: 'mens'} and {slug: {name: 'mens'}}
          if (cat.slug === activeCategory) {
            console.log(`ShopListPage: Match found by slug: ${cat.slug} === ${activeCategory}`);
            return true;
          }
          if (cat.slug && cat.slug.name === activeCategory) {
            console.log(`ShopListPage: Match found by slug.name: ${cat.slug.name} === ${activeCategory}`);
            return true;
          }
          return false;
        });
        
        if (hasMatchingCategory) {
          console.log(`ShopListPage: ✅ Found matching category in array for "${product.title}"`);
          return true;
        }
      }
      
      // Case 3: If category is a single block object (not in array)
      if (product.category && typeof product.category === 'object' && !Array.isArray(product.category)) {
        if (product.category.slug === activeCategory) {
          console.log(`ShopListPage: ✅ Object category match for "${product.title}"`);
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
          console.log(`ShopListPage: ✅ Title match for "${product.title}" with category "${activeCategory}"`);
          return true;
        }
      }
      
      console.log(`ShopListPage: ❌ No match for "${product.title || 'Unknown'}"`);
      return false;
    });
    
    console.log(`ShopListPage: Found ${filteredProducts.length} products matching category ${activeCategory}`);
    return filteredProducts;
  };
  
  const topProducts = filterProducts(blok.products_top);
  const bottomProducts = filterProducts(blok.products_bottom);
  
  // Debug log to check filtered products
  console.log("ShopListPage filtered products:", { 
    active: activeCategory,
    topCount: topProducts.length, 
    bottomCount: bottomProducts.length 
  });
  
  // Default category buttons if none provided from CMS
  const defaultCategories = [
    { _uid: 'all', name: 'All', slug: 'all', component: "category" },
    { _uid: 'mens', name: 'Mens', slug: 'mens', component: "category" },
    { _uid: 'womens', name: 'Womens', slug: 'womens', component: "category" },
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
          {topProducts.length > 0 ? (
            topProducts.map((product) => (
              <ProductCard
                key={product._uid}
                blok={product}
              />
            ))
          ) : (
            <p className="w-full text-center p-8">No products found in this category.</p>
          )}
        </div>
        
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
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 