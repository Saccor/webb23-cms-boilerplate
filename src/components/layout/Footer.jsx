"use client";

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer({ newsletter, columns }) {
  // Organize columns by heading for the design
  const shopColumn = columns?.find(col => col.heading?.toLowerCase().includes('shop'));
  const helpColumn = columns?.find(col => col.heading?.toLowerCase().includes('help'));
  const aboutColumn = columns?.find(col => col.heading?.toLowerCase().includes('about'));
  
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Newsletter Section - Takes more space */}
          <div className={styles.newsletterSection}>
            <h2 className={styles.newsletterTitle}>
              {newsletter?.title || "Sign up for our newsletter"}
            </h2>
            <p className={styles.newsletterDesc}>
              {newsletter?.description || "Be the first to know about our special offers, new product launches, and events."}
            </p>
            <form className={styles.newsletterForm}>
              <input 
                type="email" 
                placeholder={newsletter?.placeholder || "Email Address"} 
                className={styles.input}
                aria-label="Email address"
                required
              />
              <button 
                type="submit" 
                className={styles.button}
              >
                {newsletter?.button_text || "Sign Up"}
              </button>
            </form>
          </div>

          {/* Shop Column */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>{shopColumn?.heading || "Shop"}</h3>
            <ul className={styles.columnList}>
              {shopColumn?.links?.map((link, index) => (
                <li key={link._uid || `shop-${index}`}>
                  <Link 
                    href={link.url?.cached_url || link.url?.url || link.url || '#'} 
                    className={styles.link}
                  >
                    {link.text}
                  </Link>
                </li>
              )) || defaultShopLinks.map((text, index) => (
                <li key={`shop-default-${index}`}>
                  <Link href="#" className={styles.link}>{text}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Column */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>{helpColumn?.heading || "Help"}</h3>
            <ul className={styles.columnList}>
              {helpColumn?.links?.map((link, index) => (
                <li key={link._uid || `help-${index}`}>
                  <Link 
                    href={link.url?.cached_url || link.url?.url || link.url || '#'} 
                    className={styles.link}
                  >
                    {link.text}
                  </Link>
                </li>
              )) || defaultHelpLinks.map((text, index) => (
                <li key={`help-default-${index}`}>
                  <Link href="#" className={styles.link}>{text}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Column */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>{aboutColumn?.heading || "About"}</h3>
            <ul className={styles.columnList}>
              {aboutColumn?.links?.map((link, index) => (
                <li key={link._uid || `about-${index}`}>
                  <Link 
                    href={link.url?.cached_url || link.url?.url || link.url || '#'} 
                    className={styles.link}
                  >
                    {link.text}
                  </Link>
                </li>
              )) || defaultAboutLinks.map((text, index) => (
                <li key={`about-default-${index}`}>
                  <Link href="#" className={styles.link}>{text}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Default links as fallbacks if CMS doesn't provide them
const defaultShopLinks = ["Women's", "Men's", "Kids", "Shoes", "Equipment", "By Activity", "Gift Cards", "Sale"];
const defaultHelpLinks = ["Help Center", "Order Status", "Size Chart", "Returns & Warranty", "Contact Us"];
const defaultAboutLinks = ["About Us", "Responsibility", "Technology & Innovation", "Explore our stories"]; 