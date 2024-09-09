"use client"; 

import Image from 'next/image';
import Link from 'next/link';
import { storyblokEditable } from "@storyblok/react"; // Ensure this import is correct

const Hero = ({ hero }) => {
  if (!hero) {
    console.error("Hero block is missing or incorrectly structured:", hero); // Log for debugging
    return null;
  }

  // Destructure fields from the top-level hero object (no content wrapper)
  const { title, text, Button, Image: HeroImage } = hero; 

  return (
    <section className="bg-gray-100 py-16" {...storyblokEditable(hero)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Hero Text Content */}
        <div className="max-w-lg">
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
          <div className="ml-8">
            <Image
              src={HeroImage.filename}
              alt={HeroImage.alt || 'Hero Image'}
              width={600}
              height={400}
              className="rounded-lg"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
