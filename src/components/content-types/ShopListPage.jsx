"use client";

import React, { useState, useEffect } from 'react';
import { storyblokEditable } from '@storyblok/react';
import ProductCard from '../nestable/ProductCard';
import styles from './ShopListPage.module.css';
import { usePathname } from 'next/navigation';

export default function ShopListPage({ blok }) {
  // Enhanced debugging info about what data we're receiving
  console.log("ShopListPage rendering with data:", {
    title: blok.title,
    hasProductsTop: !!blok.products_top,
    productsTopLength: blok.products_top?.length || 0,
    hasProductsBottom: !!blok.products_bottom,
    productsBottomLength: blok.products_bottom?.length || 0,
    hasCategories: !!blok.categories,
    categoriesLength: blok.categories?.length || 0
  });

  // For debugging, log a few product entries if available
  if (blok.products_top && blok.products_top.length > 0) {
    blok.products_top.slice(0, 2).forEach((product, index) => {
      console.log(`Product ${index + 1} details:`, {
        title: product.title,
        hasCategory: !!product.category,
        categoryType: product.category ? (Array.isArray(product.category) ? 'array' : typeof product.category) : 'none',
        categoryCount: Array.isArray(product.category) ? product.category.length : 0,
        categories: Array.isArray(product.category) 
          ? product.category.map(cat => cat?.slug || 'invalid').join(', ') 
          : 'none',
        component: product.component,
        source: product._source || 'unknown'
      });
    });
  }

  // Extract category from URL if present
  const pathname = usePathname();
  const initialCategory = pathname.includes('/products/mens') ? 'mens' :
                          pathname.includes('/products/womens') ? 'womens' : 'all';
  
  console.log(`Initial category from pathname "${pathname}": ${initialCategory}`);
  
  // State for active category
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  
  // Handle category filter click
  const handleCategoryChange = (categorySlug) => {
    console.log(`Changing active category to: ${categorySlug}`);
    setActiveCategory(categorySlug);
  };
  
  // Filter products based on selected category
  const filterProducts = (products) => {
    if (!products || !Array.isArray(products)) {
      console.log("No products array to filter");
      return [];
    }
    
    console.log(`Filtering ${products.length} products with active category: ${activeCategory}`);
    
    // If 'all' is selected, return all products
    if (activeCategory === 'all') {
      return products;
    }
    
    // Filter products by category
    const filteredProducts = products.filter(product => {
      // Skip invalid products
      if (!product) {
        console.log("Skipping null/undefined product");
        return false;
      }
      
      console.log(`CATEGORY DEBUG - Product: ${product.title || 'Unnamed'}`, {
        hasCategory: !!product.category,
        categoryType: product.category ? (Array.isArray(product.category) ? 'array' : typeof product.category) : 'none',
        categoryValue: product.category
      });
      
      // Case 1: Check if product has a category array with matching slug
      if (Array.isArray(product.category)) {
        const matchedCategory = product.category.find(cat => 
          cat && cat.slug === activeCategory
        );
        
        if (matchedCategory) {
          console.log(`✅ Category match for "${product.title}" (${matchedCategory.slug})`);
          return true;
        }
      }
      
      // Case 2: Fallback to title matching
      if (product.title) {
        const title = product.title.toLowerCase();
        if ((activeCategory === 'mens' && title.includes('men')) || 
            (activeCategory === 'womens' && title.includes('women'))) {
          console.log(`✅ Title match for "${product.title}" with "${activeCategory}"`);
          return true;
        }
      }
      
      console.log(`❌ No match for product "${product.title || 'Unknown'}" with "${activeCategory}"`);
      return false;
    });
    
    console.log(`Filtered ${products.length} products down to ${filteredProducts.length} matching "${activeCategory}"`);
    return filteredProducts;
  };
  
  // Get filtered products
  const topProducts = filterProducts(blok.products_top || []);
  const bottomProducts = filterProducts(blok.products_bottom || []);
  
  // Log filtered product counts
  console.log(`Filtered products for display: ${topProducts.length} top, ${bottomProducts.length} bottom`);
  
  // Default category buttons if none provided from CMS
  const defaultCategories = [
    { 
      _uid: 'all-category',
      name: 'All',
      slug: 'all',
      component: "category",
      active: activeCategory === 'all'
    },
    { 
      _uid: 'mens-category',
      name: "Men's",
      slug: 'mens',
      component: "category",
      active: activeCategory === 'mens'
    },
    { 
      _uid: 'womens-category',
      name: "Women's",
      slug: 'womens',
      component: "category",
      active: activeCategory === 'womens'
    }
  ];
  
  // Use categories from CMS or defaults
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
          {categories.map((category) => (
            <button 
              key={category._uid || `cat-${category.slug}`}
              className={`${styles.filterButton} ${activeCategory === category.slug ? styles.active : ''}`}
              onClick={() => handleCategoryChange(category.slug)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Debug Info */}
        <div className="text-xs text-gray-400 mb-4">
          Found {topProducts.length + bottomProducts.length} products in the "{activeCategory}" category
        </div>
        
        {/* Top Products Grid */}
        <div className={styles.productGrid}>
          {topProducts.length > 0 ? (
            topProducts.map((product, index) => (
              <ProductCard
                key={product._uid || `product-${index}-${Math.random()}`}
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
            {bottomProducts.map((product, index) => (
              <ProductCard
                key={product._uid || `product-${index}-${Math.random()}`}
                blok={product}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 