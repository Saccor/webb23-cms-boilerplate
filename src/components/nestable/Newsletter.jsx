"use client";

import React from 'react';

export default function Newsletter({ blok }) {
  return (
    <div className="newsletter">
      <h3 className="font-bold text-lg mb-4">{blok.title}</h3>
      <p className="mb-4 text-gray-600">{blok.description}</p>
      <form className="space-y-2">
        <input 
          type="email" 
          placeholder={blok.placeholder || "Email Address"} 
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button 
          type="submit" 
          className="w-full p-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
        >
          {blok.button_text || "Sign Up"}
        </button>
      </form>
    </div>
  );
} 