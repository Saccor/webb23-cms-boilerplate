"use client";

import React from 'react';
import { storyblokEditable } from '@storyblok/react';

export default function ColorOption({ blok, isSelected, onClick }) {
  return (
    <button 
      {...storyblokEditable(blok)}
      style={{ backgroundColor: blok.colorHex }}
      className={`w-8 h-8 rounded-full border ${isSelected ? 'border-black ring-2 ring-black' : 'border-gray-300'}`}
      onClick={onClick}
      aria-label={`Select color ${blok.colorHex}`}
    />
  );
} 