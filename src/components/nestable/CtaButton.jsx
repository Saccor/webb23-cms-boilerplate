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
          border border-[#0d0d0d] 
          flex items-center justify-center 
          font-public font-semibold 
          text-[16px] leading-[22px] tracking-[-0.4px]
          text-[#0d0d0d]
          hover:bg-black hover:text-white transition-colors
        ">
          {blok.text || 'Shop All'}
        </button>
      </Link>
    </div>
  );
};

export default CtaButton; 