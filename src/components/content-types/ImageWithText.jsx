"use client";

import Image from 'next/image';
import { storyblokEditable } from "@storyblok/react"; // For Storyblok live-editing support

const ImageWithText = ({ blok }) => {
  if (!blok) {
    console.error("ImageWithText block is missing or incorrectly structured:", blok); // Log for debugging
    return null;
  }

  // Destructure the fields from the ImageWithText block
  const { title, text, image } = blok;

  return (
    <section className="bg-gray-100 py-16" {...storyblokEditable(blok)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Image Section */}
        {image?.filename && (
          <div className="flex-shrink-0">
            <Image
              src={image.filename}
              alt={image.alt || 'Image With Text'}
              width={600}
              height={400}
              className="rounded-lg"
            />
          </div>
        )}

        {/* Text Section */}
        <div className="ml-8 max-w-lg">
          {title && <h2 className="text-3xl font-bold text-gray-900">{title}</h2>}
          {text && <p className="mt-4 text-gray-600">{text}</p>} {/* Render the plain text */}
        </div>
      </div>
    </section>
  );
};

export default ImageWithText;
