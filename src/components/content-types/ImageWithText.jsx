"use client";

import Image from 'next/image';
import { storyblokEditable } from "@storyblok/react";

const ImageWithText = ({ blok }) => {
  if (!blok) {
    console.error("ImageWithText block is missing or incorrectly structured:", blok);
    return null;
  }

  const { title, text, image, price, size } = blok;

  return (
    <section className="bg-gray-100 p-4 w-[265px] h-[331px]" {...storyblokEditable(blok)}>
      <div className="flex flex-col items-center justify-center">
        
        {/* Image Section */}
        {image?.filename && (
          <div className="w-full h-[240px] mb-4">
            <Image
              src={image.filename}
              alt={image.alt || 'Product Image'}
              width={265}
              height={240}
              className="object-cover rounded-lg w-full h-full"
            />
          </div>
        )}

        {/* Title and Size Section */}
        <div className="flex justify-between items-center w-full">
          {title && (
            <h3 className="text-[17px] font-bold" style={{ letterSpacing: "-0.4px", width: "238.69px", height: "27.34px", lineHeight: "28px" }}>
              {title}
            </h3>
          )}
          {size && (
            <span className="text-[17px]" style={{ width: "15.59px", height: "27.34px", lineHeight: "28px", letterSpacing: "-0.4px" }}>
              {size}
            </span>
          )} {/* Size next to title */}
        </div>

        {/* Price Section */}
        {price && (
          <p className="text-[17px] text-[#000000] mt-1 text-left" style={{ letterSpacing: "-0.4px", width: "100%" }}>
            ${price}
          </p>
        )}
      </div>
    </section>
  );
};

export default ImageWithText;
