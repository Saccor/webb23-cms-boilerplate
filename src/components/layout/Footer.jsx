"use client";

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer({ newsletter, columns }) {
  console.log("Footer receiving newsletter:", newsletter);
  console.log("Footer receiving columns:", columns);

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Newsletter Section */}
          {newsletter && (
            <div className={styles.column}>
              <h3 className={styles.newsletterTitle}>{newsletter.title}</h3>
              <p className={styles.newsletterDesc}>{newsletter.description}</p>
              <form>
                <input 
                  type="email" 
                  placeholder={newsletter.placeholder || "Email Address"} 
                  className={styles.input}
                />
                <button 
                  type="submit" 
                  className={styles.button}
                >
                  {newsletter.button_text || "Sign Up"}
                </button>
              </form>
            </div>
          )}

          {/* Footer Columns */}
          {columns?.map((column, index) => (
            <div key={column._uid || index} className={styles.column}>
              <h3>{column.heading}</h3>
              <ul>
                {column.links?.map((link, linkIndex) => (
                  <li key={link._uid || linkIndex}>
                    <Link 
                      href={link.url?.cached_url || link.url?.url || link.url || '#'} 
                      className={styles.link}
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.copyright}>
          © {new Date().getFullYear()} - Created with Next.js and Storyblok
        </div>
      </div>
    </footer>
  );
} 