"use client"
import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import { StoryblokComponent } from "@storyblok/react/rsc"

const Hero3 = ({ blok }) => {
  return (
    <section 
      {...storyblokEditable(blok)} 
      className="hero3 py-16 px-4 md:px-8 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto">
        {/* Title and Subtitle */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{blok.title}</h2>
          {blok.subtitle && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{blok.subtitle}</p>
          )}
        </div>
        
        {/* CTA Blocks */}
        {blok.cta?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {blok.cta.map((nestedBlok) => (
              <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
            ))}
          </div>
        )}
        
        {/* Products Blocks */}
        {blok.products?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {blok.products.map((nestedBlok) => (
              <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Hero3 