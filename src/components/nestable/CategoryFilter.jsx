"use client";

import React from 'react';
import { storyblokEditable } from '@storyblok/react';

export default function CategoryFilter({ blok, isActive, onClick, styles, position }) {
  return (
    <button 
      {...storyblokEditable(blok)}
      className={`${styles.filter} ${isActive ? styles.active : ''}`}
      onClick={onClick}
      data-position={position}
    >
      {blok.name}
    </button>
  );
} 