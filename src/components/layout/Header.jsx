"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';

export default function Header({ logo_text, nav_links, search_placeholder, theme = 'light' }) {
  const isDarkTheme = theme === 'dark';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const debounceTimerRef = useRef(null);
  
  // Handle outside clicks to collapse search
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSearchExpanded(false);
      }
    }
    
    if (searchExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchExpanded]);
  
  // Focus the input when search expands
  useEffect(() => {
    if (searchExpanded && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [searchExpanded]);
  
  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (searchExpanded) {
      setSearchExpanded(false);
    }
  };
  
  const toggleSearch = () => {
    setSearchExpanded(!searchExpanded);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };
  
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Clear previous timeout
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Debounce search
    debounceTimerRef.current = setTimeout(async () => {
      if (!value.trim()) {
        setSearchResults([]);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to search');
        }
        
        setSearchResults(data.results || []);
      } catch (error) {
        console.error('Search error:', error);
        setError('An error occurred while searching.');
      } finally {
        setLoading(false);
      }
    }, 300);
  };
  
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Escape') {
      setSearchExpanded(false);
    }
  };
  
  // Render desktop navigation items (recursive for multi-level)
  const renderNavItems = (items) => {
    if (!Array.isArray(items)) return null;
    
    return items.map((link, index) => {
      const hasChildren = link.children && link.children.length > 0;
      
      // Ensure URL is absolute (starts with a slash)
      const ensureAbsoluteUrl = (url) => {
        if (!url) return '/';
        if (url.startsWith('/') || url.startsWith('http')) return url;
        return `/${url}`;
      };
      
      const url = ensureAbsoluteUrl(link.url);
      
      if (hasChildren) {
        return (
          <div key={index} className={styles.navItem}>
            <Link href={url} className={styles.navLink}>
              {link.text || 'Link'}
              <svg 
                className={styles.dropdownArrow}
                xmlns="http://www.w3.org/2000/svg" 
                width="10" 
                height="6" 
                viewBox="0 0 10 6" 
                fill="none"
              >
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <div className={styles.dropdown}>
              {link.children.map((childLink, childIndex) => (
                <Link 
                  key={childIndex} 
                  href={ensureAbsoluteUrl(childLink.url)} 
                  className={styles.dropdownLink}
                >
                  {childLink.text || 'Link'}
                </Link>
              ))}
            </div>
          </div>
        );
      }
      
      return (
        <Link 
          key={index} 
          href={url} 
          className={styles.navLink}
        >
          {link.text || 'Link'}
        </Link>
      );
    });
  };
  
  // Render mobile navigation items (recursive for multi-level)
  const renderMobileNavItems = (items, level = 0) => {
    if (!Array.isArray(items)) return null;
    
    // Ensure URL is absolute (starts with a slash)
    const ensureAbsoluteUrl = (url) => {
      if (!url) return '/';
      if (url.startsWith('/') || url.startsWith('http')) return url;
      return `/${url}`;
    };
    
    return items.map((link, index) => {
      const hasChildren = link.children && link.children.length > 0;
      const url = ensureAbsoluteUrl(link.url);
      
      if (hasChildren) {
        return (
          <div key={index} className={styles.mobileNavItem} style={{ paddingLeft: `${level * 16}px` }}>
            <Link 
              href={url} 
              className={styles.mobileNavTitle}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.text || 'Link'}
            </Link>
            <div className={styles.mobileSubMenu}>
              {renderMobileNavItems(link.children, level + 1)}
            </div>
          </div>
        );
      }
      
      return (
        <Link 
          key={index} 
          href={url} 
          className={styles.mobileNavLink}
          style={{ paddingLeft: `${level * 16}px` }}
          onClick={() => setMobileMenuOpen(false)}
        >
          {link.text || 'Link'}
        </Link>
      );
    });
  };
  
  return (
    <>
      <header className={`${styles.navbar} ${isDarkTheme ? styles.darkTheme : ''} border-b border-black/50 relative w-full`}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            {logo_text || 'Logo'}
          </Link>
          
          <nav className={styles.nav}>
            {renderNavItems(nav_links)}
            
            {search_placeholder && (
              <div 
                ref={searchContainerRef}
                className={`${styles.navLink} ${styles.searchLink} ${searchExpanded ? styles.searchExpanded : ''} cursor-pointer relative`}
                onClick={!searchExpanded ? toggleSearch : undefined}
              >
                {!searchExpanded ? (
                  <>
                    <svg 
                      className={styles.searchIcon}
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
                    <span>{search_placeholder}</span>
                  </>
                ) : (
                  <div className={styles.expandedSearch}>
                    <svg 
                      className={styles.searchIcon}
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
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search for products..."
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      onKeyDown={handleSearchKeyDown}
                      className={styles.searchInput}
                      onClick={(e) => e.stopPropagation()}
                    />
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchExpanded(false);
                        setSearchQuery('');
                      }}
                      className={styles.closeButton}
                      aria-label="Clear search"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        width="16"
                        height="16"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                )}
                
                {/* Search results dropdown */}
                {searchExpanded && searchResults.length > 0 && (
                  <div className={styles.searchResults}>
                    {searchResults.map((product) => (
                      <Link 
                        href={`/products/${product.slug}`}
                        key={product.id}
                        className={styles.searchResultItem}
                        onClick={() => {
                          setSearchExpanded(false);
                          setSearchQuery('');
                        }}
                      >
                        <div className={styles.resultImage}>
                          {product.image && (
                            <Image
                              src={product.image.filename || product.image}
                              alt={product.title}
                              fill
                              style={{ objectFit: 'cover' }}
                            />
                          )}
                        </div>
                        <div className={styles.resultInfo}>
                          <h3 className={styles.resultTitle}>{product.title}</h3>
                          <p className={styles.resultPrice}>{product.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                
                {/* Loading indicator */}
                {searchExpanded && loading && (
                  <div className={styles.searchResults}>
                    <div className={styles.loadingIndicator}>
                      <div className={styles.spinner}></div>
                    </div>
                  </div>
                )}
                
                {/* No results message */}
                {searchExpanded && !loading && searchResults.length === 0 && searchQuery.trim() !== '' && (
                  <div className={styles.searchResults}>
                    <div className={styles.noResults}>
                      No products found matching &quot;{searchQuery}&quot;.
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>
          
          <div className={styles.icon}>
            {/* Cart icon or other icon could go here */}
          </div>
          
          <button 
            className={styles.mobileMenuButton} 
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <svg 
              className={styles.mobileMenuIcon}
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile menu */}
        <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.open : ''} ${isDarkTheme ? styles.darkTheme : ''}`}>
          {renderMobileNavItems(nav_links)}
          
          {search_placeholder && (
            <div className={styles.mobileSearchContainer}>
              <div className={styles.mobileSearch}>
                <svg 
                  className={styles.searchIcon}
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
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  className={styles.mobileSearchInput}
                />
              </div>
              
              {/* Mobile search results */}
              {searchQuery.trim() !== '' && (
                <div className={styles.mobileSearchResults}>
                  {loading && (
                    <div className={styles.mobileLoadingIndicator}>
                      <div className={styles.spinner}></div>
                    </div>
                  )}
                  
                  {!loading && searchResults.length === 0 && (
                    <div className={styles.mobileNoResults}>
                      No products found matching &quot;{searchQuery}&quot;.
                    </div>
                  )}
                  
                  {!loading && searchResults.length > 0 && (
                    <div>
                      {searchResults.map((product) => (
                        <Link 
                          href={`/products/${product.slug}`}
                          key={product.id}
                          className={styles.mobileResultItem}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setSearchQuery('');
                          }}
                        >
                          <div className={styles.mobileResultImage}>
                            {product.image && (
                              <Image
                                src={product.image.filename || product.image}
                                alt={product.title}
                                width={60}
                                height={60}
                                style={{ objectFit: 'cover' }}
                              />
                            )}
                          </div>
                          <div className={styles.mobileResultInfo}>
                            <h3 className={styles.mobileResultTitle}>{product.title}</h3>
                            <p className={styles.mobileResultPrice}>{product.price}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </header>
      
      {/* Completely separate black line as last resort - now thinner */}
      <div className="w-full h-[0.5px] bg-black/50 relative z-10"></div>
    </>
  );
} 