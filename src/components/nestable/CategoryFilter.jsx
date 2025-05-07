"use client";

import React from 'react';
import { storyblokEditable } from '@storyblok/react';

export default function CategoryFilter({ blok, isActive, onClick }) {
  return (
    <button 
      {...storyblokEditable(blok)}
      className={`px-4 py-2 border border-black rounded ${isActive ? 'bg-black text-white' : ''}`}
      onClick={onClick}
    >
      {blok.name}
    </button>
  );
} 