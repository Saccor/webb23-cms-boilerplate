"use client";

import React from 'react';
import { storyblokEditable } from '@storyblok/react';

export default function CategoryFilter({ blok, isActive, onClick, styles }) {
  return (
    <button 
      {...storyblokEditable(blok)}
      className={`${styles.filter} ${isActive ? styles.active : ''}`}
      onClick={onClick}
    >
      {blok.name}
    </button>
  );
} 