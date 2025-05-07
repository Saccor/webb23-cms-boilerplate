"use client";

import React from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header({ logo_text, nav_links, search_placeholder }) {
  // Debug - log props
  console.log("Header receiving:", { logo_text, nav_links, search_placeholder });

  return (
    <header>
      <div className={styles.navbar}>
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
            <div className={`${styles.navLink} ${styles.search}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        
        <div className={styles.separator}></div>
      </div>
    </header>
  );
} 