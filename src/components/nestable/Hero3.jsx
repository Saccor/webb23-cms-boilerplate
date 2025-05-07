"use client"
import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import { StoryblokComponent } from "@storyblok/react/rsc"

const Hero3 = ({ blok }) => {
  return (
    <section 
      {...storyblokEditable(blok)} 
      className="
        relative 
        bg-[#EFF2F6] 
        pt-[126px] pb-24 md:pb-32 lg:pb-40
        min-h-[1035px]
        px-4
        overflow-hidden
      "
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Title */}
        <h2 
          className="
            text-[40px] md:text-[56px] leading-[1.1] md:leading-[62px] font-public font-semibold 
            tracking-[-2.4px] text-center text-black
          "
        >
          {blok.title}
        </h2>
        
        {/* Subtitle */}
        {blok.subtitle && (
          <p 
            className="
              mt-4 md:mt-6
              max-w-[610px] mx-auto 
              text-[18px] md:text-[20px] leading-[28px] font-public
              tracking-[-0.4px] text-center text-[#979797]
            "
          >
            {blok.subtitle}
          </p>
        )}
        
        {/* CTA Buttons */}
        {blok.cta?.length > 0 && (
          <div className="mt-4 md:mt-6 flex justify-center">
            {blok.cta.map((nestedBlok) => (
              <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
            ))}
          </div>
        )}
        
        {/* Products Images with middle card offset */}
        {blok.products?.length > 0 && (
          <div className="
            mt-[151px]
            grid gap-4 md:gap-8 
            grid-cols-1 sm:grid-cols-2 md:grid-cols-3
            max-w-[1200px] mx-auto
          ">
            {blok.products.map((nestedBlok, index) => (
              <div 
                key={nestedBlok._uid}
                className={`
                  w-full max-w-[368px] mx-auto
                  ${index === 1 ? 'md:-mt-[85px]' : ''}
                `}
              >
                <StoryblokComponent blok={nestedBlok} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Hero3 