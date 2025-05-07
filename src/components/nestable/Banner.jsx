"use client"
import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import Image from 'next/image'

const Banner = ({ blok }) => {
  // Process image URL for optimization if it's from Storyblok
  const getImageUrl = (filename) => {
    if (!filename) return '';
    
    // Check if it's a Storyblok image and add transformations
    if (filename.startsWith('https://a.storyblok.com')) {
      return `${filename}/m/2000x500/filters:format(webp)`;
    }
    
    return filename;
  };
  
  return (
    <section 
      {...storyblokEditable(blok)} 
      className="w-full relative"
    >
      {blok.image?.filename ? (
        <div className="w-full h-[316px] md:h-[400px] relative">
          {/* Negative margin to ensure full width */}
          <div className="absolute w-[100vw] left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] h-full">
            <Image 
              src={getImageUrl(blok.image.filename)}
              alt={blok.alt || ''}
              fill
              sizes="100vw"
              className="object-cover"
              priority={true}
            />
            
            {/* Optional overlay text */}
            {blok.overlay_text && (
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Semi-transparent background for better readability */}
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                <h2 className="text-white text-2xl md:text-4xl font-semibold text-center z-10 px-6 max-w-4xl">
                  {blok.overlay_text}
                </h2>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full h-[316px] md:h-[400px] bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">No banner image set</p>
        </div>
      )}
    </section>
  );
}

export default Banner 