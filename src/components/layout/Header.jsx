"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import SearchModal from '../search/SearchModal';

export default function Header({ logo_text, nav_links, search_placeholder, theme = 'light' }) {
  const isDarkTheme = theme === 'dark';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const searchTriggerRef = useRef(null);
  const mobileTriggerRef = useRef(null);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (searchModalOpen) {
      setSearchModalOpen(false);
    }
  };
  
  const openSearchModal = (useDesktopPosition = true) => {
    setSearchModalOpen(true);
  };
  
  const closeSearchModal = () => {
    setSearchModalOpen(false);
  };
  
  // Render desktop navigation items (recursive for multi-level)
  const renderNavItems = (items) => {
    if (!Array.isArray(items)) return null;
    
    return items.map((link, index) => {
      const hasChildren = link.children && link.children.length > 0;
      
      if (hasChildren) {
        return (
          <div key={index} className={styles.navItem}>
            <div className={styles.navLink}>
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
            </div>
            <div className={styles.dropdown}>
              {link.children.map((childLink, childIndex) => (
                <Link 
                  key={childIndex} 
                  href={childLink.url || '/'} 
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
          href={link.url || '/'} 
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
    
    return items.map((link, index) => {
      const hasChildren = link.children && link.children.length > 0;
      
      if (hasChildren) {
        return (
          <div key={index} className={styles.mobileNavItem} style={{ paddingLeft: `${level * 16}px` }}>
            <div className={styles.mobileNavTitle}>
              {link.text || 'Link'}
            </div>
            <div className={styles.mobileSubMenu}>
              {renderMobileNavItems(link.children, level + 1)}
            </div>
          </div>
        );
      }
      
      return (
        <Link 
          key={index} 
          href={link.url || '/'} 
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
                ref={searchTriggerRef}
                className={`${styles.navLink} ${styles.searchLink} cursor-pointer relative`}
                onClick={() => openSearchModal(true)}
              >
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
                
                {/* Desktop Search Dropdown */}
                {searchModalOpen && (
                  <SearchModal 
                    isOpen={searchModalOpen} 
                    onClose={closeSearchModal}
                    triggerRef={searchTriggerRef}
                  />
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
            <div 
              ref={mobileTriggerRef}
              className={`${styles.mobileNavLink} ${styles.searchLink} cursor-pointer`}
              onClick={() => {
                setMobileMenuOpen(false);
                openSearchModal(false);
              }}
            >
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
            </div>
          )}
        </div>
      </header>
      
      {/* Completely separate black line as last resort - now thinner */}
      <div className="w-full h-[0.5px] bg-black/50 relative z-10"></div>
    </>
  );
} 