"use client";

import React from 'react';
import Link from 'next/link';

export default function FooterColumn({ blok }) {
  return (
    <div className="footer-column">
      <h3 className="font-bold text-lg mb-4">{blok.heading}</h3>
      <ul className="space-y-2">
        {blok.links?.map((link, index) => (
          <li key={link._uid || index}>
            <Link 
              href={link.url?.url || link.url || '#'} 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
} 