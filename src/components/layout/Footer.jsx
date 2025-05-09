<<<<<<< HEAD
import Link from 'next/link';

const Footer = ({ links }) => {
  // Ensure links is always an array
  const footerLinks = Array.isArray(links) ? links : [];
  
  return (
    <footer className="bg-gray-100 w-full py-10 text-gray-900">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sign-up Section */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-2">
              Sign up for our newsletter
            </h3>
            <p className="text-base mb-4">
              Be the first to know about our special offers, new product launches, and events.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email Address"
                className="px-4 py-2 w-full border border-gray-300 rounded-l"
              />
              <button className="bg-black text-white px-6 py-2 rounded-r">Sign Up</button>
            </div>
          </div>

          {/* Shop Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              {footerLinks.length > 0 ? (
                footerLinks.map((link, index) => (
                  <li key={index}>
                    <Link href={link.url || '#'}>{link.title || 'Shop Link'}</Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link href="/">Women&apos;s</Link></li>
                  <li><Link href="/">Men&apos;s</Link></li>
                  <li><Link href="/">Kids&apos;</Link></li>
                  <li><Link href="/">Shoes</Link></li>
                  <li><Link href="/">Equipment</Link></li>
                  <li><Link href="/">By Activity</Link></li>
                  <li><Link href="/">Gift Cards</Link></li>
                  <li><Link href="/">Sale</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Help Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              <li><Link href="/">Help Center</Link></li>
              <li><Link href="/">Order Status</Link></li>
              <li><Link href="/">Size Chart</Link></li>
              <li><Link href="/">Returns &amp; Warranty</Link></li>
              <li><Link href="/">Contact Us</Link></li>
            </ul>
          </div>

          {/* About Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link href="/">About Us</Link></li>
              <li><Link href="/">Responsibility</Link></li>
              <li><Link href="/">Technology &amp; Innovation</Link></li>
              <li><Link href="/">Explore our stories</Link></li>
            </ul>
          </div>

          {/* Copyright and additional info can be added here */}
          <div className="col-span-1 md:col-span-2 mt-8 md:mt-0">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Your Company Name. All rights reserved.
            </p>
          </div>
=======
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
>>>>>>> test4
        </div>
      </div>
    </footer>
  );
<<<<<<< HEAD
};

export default Footer;
=======
}

// Default links as fallbacks if CMS doesn't provide them
const defaultShopLinks = ["Women's", "Men's", "Kids", "Shoes", "Equipment", "By Activity", "Gift Cards", "Sale"];
const defaultHelpLinks = ["Help Center", "Order Status", "Size Chart", "Returns & Warranty", "Contact Us"];
const defaultAboutLinks = ["About Us", "Responsibility", "Technology & Innovation", "Explore our stories"]; 
>>>>>>> test4
