"use client";

import React, { useState } from 'react';
import { storyblokEditable } from '@storyblok/react';
import CategoryFilter from '../nestable/CategoryFilter';
import ProductCard from '../nestable/ProductCard';

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
    <div {...storyblokEditable(blok)} className="w-full py-12 px-8 max-w-[1400px] mx-auto">
      {/* Hero Section */}
      <div className="max-w-[600px] mb-8">
        <h1 className="text-36 font-semibold mb-2">See our products</h1>
        <p className="text-18 leading-relaxed">
          Revamp your style with the latest designer trends in clothing or achieve a perfectly curated wardrobe thanks to our line-up of timeless pieces.
        </p>
      </div>
      
      {/* Filter Bar */}
      <div className="flex gap-4 mb-10">
        {/* All category default option */}
        <button 
          className={`px-4 py-2 border border-black rounded ${activeCategory === 'all' ? 'bg-black text-white' : ''}`}
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
          />
        ))}
      </div>
      
      {/* Top Products Grid */}
      {topProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {topProducts.map((product) => (
            <ProductCard
              key={product._uid}
              blok={product}
            />
          ))}
        </div>
      )}
      
      {/* Middle Description */}
      {blok.description && (
        <div className="max-w-xl mx-auto text-center mb-12">
          <p className="text-18 leading-relaxed">{blok.description}</p>
        </div>
      )}
      
      {/* Bottom Products Grid */}
      {bottomProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {bottomProducts.map((product) => (
            <ProductCard
              key={product._uid}
              blok={product}
            />
          ))}
        </div>
      )}
    </div>
  );
} 