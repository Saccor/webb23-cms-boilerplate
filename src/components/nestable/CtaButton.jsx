"use client"
import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import Link from 'next/link'

const CtaButton = ({ blok }) => {
  const url = blok.link?.url || blok.link?.cached_url || '#';
  
  return (
    <div {...storyblokEditable(blok)}>
      <Link href={url} className="block">
        <button className="
          mx-auto block 
          w-[194px] h-[50px] 
          border border-black 
          flex items-center justify-center 
          font-public font-semibold 
          text-[16px] leading-[22px] tracking-[-0.4px]
          hover:bg-black hover:text-white transition-colors
        ">
          {blok.text || 'Go to products'}
        </button>
      </Link>
    </div>
  );
};

export default CtaButton; 