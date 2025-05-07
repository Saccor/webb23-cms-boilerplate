"use client"
import React from 'react'
import { storyblokEditable } from '@storyblok/react'
import { render } from 'storyblok-rich-text-react-renderer'

// Custom rich text styles as per Figma spec
const richTextClasses = `
  font-public text-[1.25rem] leading-[1.4] tracking-[-0.4px] 
  text-[#979797] 
  max-w-[944px] mx-auto px-4
  space-y-6
  mt-[61px]
`;

const AboutTop = ({ blok }) => {
  return (
    <section 
      {...storyblokEditable(blok)} 
      className="bg-[#eff2f6] pt-32 md:pt-36 pb-16 md:pb-24"
    >
      <div className="mx-auto max-w-[1400px] px-4">
        <h1 className="text-4xl md:text-5xl font-semibold text-black text-center">
          {blok.title}
        </h1>
        
        {blok.subtitle && (
          <p className="mt-6 text-xl text-gray-600 text-center max-w-[944px] mx-auto">
            {blok.subtitle}
          </p>
        )}
        
        {blok.body && (
          <div className={richTextClasses}>
            {render(blok.body, {
              nodeResolvers: {
                paragraph: (children) => (
                  <p>{children}</p>
                ),
              }
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutTop 