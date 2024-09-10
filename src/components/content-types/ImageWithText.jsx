// /src/components/content-types/ImageWithText.jsx

"use client";

import Image from 'next/image';
import { storyblokEditable } from "@storyblok/react";

const ImageWithText = ({ blok }) => {
  if (!blok) {
    console.error("ImageWithText block is missing or incorrectly structured:", blok);
    return null;
  }

  // Destructure the fields from the ImageWithText block
  const { title, text, image } = blok;

  return (
    <section className="bg-gray-100 p-4" {...storyblokEditable(blok)}>
      <div className="flex flex-col items-center justify-center">
        
        {/* Image Section with fixed width and height */}
        {image?.filename && (
          <div className="w-60 h-60">
            <Image
              src={image.filename}
              alt={image.alt || 'Image With Text'}
              width={240} // Fixed width
              height={240} // Fixed height
              className="object-cover rounded-lg"
            />
          </div>
        )}

        {/* Title Section */}
        {title && <h2 className="text-xl font-bold text-gray-900 mt-4">{title}</h2>}

        {/* Text Section */}
        {text && <p className="mt-2 text-gray-600 text-center">{text}</p>}
      </div>
    </section>
  );
};

export default ImageWithText;
