"use client"; 

import Image from 'next/image';
import Link from 'next/link';
import { storyblokEditable } from "@storyblok/react";

const Hero = ({ hero }) => {
  if (!hero) {
    console.error("Hero block is missing or incorrectly structured:", hero); // Log for debugging
    return null;
  }

  // Destructure fields from the top-level hero object (no content wrapper)
  const { title, text, Button, Image: HeroImage } = hero; 

  return (
    <section className="bg-gray-100 py-16" {...storyblokEditable(hero)}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        
        {/* Hero Text Content */}
        <div className="max-w-lg mb-8">
          {title && <h1 className="text-4xl font-bold text-gray-900">{title}</h1>}
          {text && <p className="mt-4 text-gray-600">{text}</p>} {/* Render plain text */}

          {Button?.cached_url && (
            <Link href={Button.cached_url} className="mt-8 inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
              {Button.label || 'Learn More'}
            </Link>
          )}
        </div>

        {/* Hero Image */}
        {HeroImage?.filename && (
          <div className="w-full max-w-4xl h-auto">
            <Image
              src={HeroImage.filename}
              alt={HeroImage.alt || 'Hero Image'}
              width={1114}
              height={521}
              className="rounded-lg object-cover w-full h-auto"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
