// /src/components/content-types/ImageWithText.jsx

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
    <section className="py-8" {...storyblokEditable(blok)}> {/* Removed background, kept padding */}
      <div className="flex flex-col items-center"> {/* Flex layout with vertical stacking */}
        
        {/* Image Section */}
        {image?.filename && (
          <div className="w-full">
            <Image
              src={image.filename}
              alt={image.alt || 'Image With Text'}
              width={400}
              height={300}
              className="rounded-lg object-cover" // Ensure image fits well
            />
          </div>
        )}

        {/* Title Section */}
        {title && <h2 className="text-2xl font-bold text-gray-900 mt-4 text-center">{title}</h2>} {/* Center the title */}

        {/* Text Section */}
        {text && <p className="mt-2 text-gray-600 text-center">{text}</p>} {/* Center the text */}
        
      </div>
    </section>
  );
};

export default ImageWithText;
