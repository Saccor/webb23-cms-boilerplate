"use client";

import React from 'react';
import { storyblokEditable } from '@storyblok/react';

export default function SizeOption({ blok, isSelected, onClick }) {
  return (
    <button 
      {...storyblokEditable(blok)}
      className={`px-4 py-2 border font-public ${isSelected ? 'bg-black text-white border-black' : 'border-gray-300'}`}
      onClick={onClick}
    >
      {blok.label}
    </button>
  );
} 