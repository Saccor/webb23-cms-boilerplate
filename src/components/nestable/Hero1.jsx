"use client"
import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import { StoryblokComponent } from "@storyblok/react/rsc"
import Image from 'next/image'

const Hero1 = ({ blok }) => {
  // Process image URL for optimization if it's from Storyblok
  const getImageUrl = (filename) => {
    if (!filename) return '';
    
    // Check if it's a Storyblok image and add transformations
    if (filename.startsWith('https://a.storyblok.com')) {
      return `${filename}/m/1600x900/filters:format(webp)`;
    }
    
    return filename;
  };
  
  return (
    <section 
      {...storyblokEditable(blok)} 
      className="
        relative 
        pt-16 md:pt-[126px] pb-16 md:pb-24
        px-4
        overflow-hidden
        bg-white
      "
    >
      <div className="mx-auto max-w-[1400px] relative">
        {/* Container for all elements - w-1114 h-776 */}
        <div className="mx-auto w-full max-w-[1114px]">
          {/* Title - Exact specs from Figma */}
          <h1 
            className="
              mx-auto
              w-full max-w-[755px]
              text-[32px] md:text-[48px] lg:text-[56px] 
              leading-[62px]
              font-public font-semibold 
              tracking-[-2px]
              text-black
              text-center
              mb-4
            "
          >
            {blok.title}
          </h1>
          
          {/* Subtitle - Exact specs from Figma */}
          {blok.subtitle && (
            <p 
              className="
                mx-auto
                w-full max-w-[610px]
                text-[20px]
                font-public font-normal
                leading-[28px]
                text-[#979797]
                text-center
                mb-6
              "
            >
              {blok.subtitle}
            </p>
          )}
          
          {/* CTA Button - Positioned exactly at 603px from left */}
          {blok.elements?.length > 0 && (
            <div className="flex justify-center mb-[40px]">
              {blok.elements.map((nestedBlok) => (
                <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
              ))}
            </div>
          )}
          
          {/* Image Container - Exact 1114×521 dimensions */}
          <div className="
            mx-auto
            w-full
            h-[521px]
            relative
            overflow-hidden
            bg-[#c4c4c4]
          ">
            {blok.image?.filename ? (
              <Image 
                src={getImageUrl(blok.image.filename)}
                alt={blok.title || 'Hero image'}
                fill
                sizes="(max-width: 768px) 100vw, 1114px"
                className="object-cover"
                priority={true}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-600">Hero image</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero1 