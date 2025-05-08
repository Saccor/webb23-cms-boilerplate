"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function SearchModal({ isOpen, onClose, initialQuery = '', triggerRef }) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Focus the input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle clicks outside the modal to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target) && 
          (!triggerRef || !triggerRef.current || !triggerRef.current.contains(event.target))) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  // Clean up any pending timers when component unmounts
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback((searchQuery) => {
    // Clear any existing timeout
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set a new timeout
    debounceTimerRef.current = setTimeout(async () => {
      if (!searchQuery || searchQuery.trim() === '') {
        setResults([]);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Call the search API endpoint
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to search');
        }
        
        setResults(data.results || []);
      } catch (error) {
        console.error('Search error:', error);
        setError('An error occurred while searching. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 300); // Wait 300ms after user stops typing
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  // Handle keyboard events
  const handleKeyDown = (e) => {
    // Close modal on escape key
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Don't render anything if the modal is closed
  if (!isOpen) return null;

  // For mobile, show a fullscreen modal instead of a dropdown
  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <div className="p-4 border-b flex items-center">
          <button 
            onClick={onClose}
            className="p-1 mr-3"
          >
            <svg 
              className="w-6 h-6 text-gray-500"
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <svg 
            className="w-5 h-5 text-gray-500 mr-3"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for products..."
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-grow outline-none text-base"
          />
        </div>
        
        <div className="flex-grow overflow-y-auto">
          {loading && (
            <div className="flex justify-center items-center h-32 py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )}
          
          {error && (
            <div className="text-red-500 text-center p-4 text-sm">
              {error}
            </div>
          )}
          
          {!loading && !error && results.length === 0 && query.trim() !== '' && (
            <div className="text-gray-500 text-center p-4 text-sm">
              No products found matching "{query}".
            </div>
          )}
          
          {!loading && !error && results.length > 0 && (
            <div className="divide-y">
              {results.map((product) => (
                <Link 
                  href={`/products/${product.slug}`}
                  key={product.id}
                  className="flex p-4 hover:bg-gray-50 transition-colors"
                  onClick={onClose}
                >
                  <div className="w-24 h-24 bg-gray-200 relative flex-shrink-0">
                    {product.image && (
                      <Image
                        src={product.image.filename || product.image}
                        alt={product.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                  </div>
                  <div className="pl-4 flex-grow">
                    <h3 className="font-medium text-gray-900 text-base truncate">{product.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{product.price}</p>
                    {product.description && (
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop dropdown
  return (
    <div className="absolute right-0 top-[40px] z-50 w-[450px] -mr-24">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 flex flex-col"
      >
        {/* Search header */}
        <div className="p-4 border-b flex items-center">
          <svg 
            className="w-5 h-5 text-gray-500 mr-3"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for products..."
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-grow outline-none text-base"
          />
          
          <button 
            onClick={onClose}
            className="ml-2 p-1 rounded-full hover:bg-gray-100"
          >
            <svg 
              className="w-5 h-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {/* Search results */}
        <div className="overflow-y-auto max-h-[500px]">
          {loading && (
            <div className="flex justify-center items-center h-32 py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )}
          
          {error && (
            <div className="text-red-500 text-center p-4 text-sm">
              {error}
            </div>
          )}
          
          {!loading && !error && results.length === 0 && query.trim() !== '' && (
            <div className="text-gray-500 text-center p-4 text-sm">
              No products found matching "{query}".
            </div>
          )}
          
          {!loading && !error && results.length > 0 && (
            <div className="divide-y">
              {results.map((product) => (
                <Link 
                  href={`/products/${product.slug}`}
                  key={product.id}
                  className="flex p-4 hover:bg-gray-50 transition-colors"
                  onClick={onClose}
                >
                  <div className="w-24 h-24 bg-gray-200 relative flex-shrink-0">
                    {product.image && (
                      <Image
                        src={product.image.filename || product.image}
                        alt={product.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                  </div>
                  <div className="pl-4 flex-grow">
                    <h3 className="font-medium text-gray-900 text-base truncate">{product.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{product.price}</p>
                    {product.description && (
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 