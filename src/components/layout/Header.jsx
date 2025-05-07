"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header({ logo_text, nav_links, search_placeholder, theme = 'light' }) {
  const isDarkTheme = theme === 'dark';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <header className={`${styles.navbar} ${isDarkTheme ? styles.darkTheme : ''}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          {logo_text || 'Logo'}
        </Link>
        
        <nav className={styles.nav}>
          {Array.isArray(nav_links) && nav_links.map((link, index) => (
            <Link 
              key={index} 
              href={link.url || '/'} 
              className={styles.navLink}
            >
              {link.text || 'Link'}
            </Link>
          ))}
          
          {search_placeholder && (
            <div className={`${styles.navLink} ${styles.searchLink}`}>
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
        {Array.isArray(nav_links) && nav_links.map((link, index) => (
          <Link 
            key={index} 
            href={link.url || '/'} 
            className={styles.mobileNavLink}
            onClick={() => setMobileMenuOpen(false)}
          >
            {link.text || 'Link'}
          </Link>
        ))}
        
        {search_placeholder && (
          <div className={`${styles.mobileNavLink} ${styles.searchLink}`}>
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
      
      {/* Separator moved outside container for full width */}
      <div className={styles.separator}></div>
    </header>
  );
} 