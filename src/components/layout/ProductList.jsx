"use client";

import ImageWithText from "@/components/content-types/ImageWithText"; // Import ImageWithText
import { storyblokEditable } from "@storyblok/react";

const ProductList = ({ blok }) => {
  if (!blok) {
    console.error("ProductList block is missing or incorrectly structured:", blok);
    return null;
  }

  const { title, description, products } = blok;

  return (
    <section className="bg-[#EFF2F6] py-10" {...storyblokEditable(blok)}>
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Title Section */}
        <h2 className="text-[36px] font-bold text-[#020202] mb-4" style={{ letterSpacing: "-1.5px" }}>
          {title || "See our products"}
        </h2>

        {/* Description Section */}
        <p className="text-[18px] text-[#000000] font-normal mb-8" style={{ letterSpacing: "-0.3px", lineHeight: "26px" }}>
          {description || "Revamp your style with the latest designer trends in clothing or achieve a perfectly curated wardrobe."}
        </p>

        {/* Product Grid using ImageWithText */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products?.map((product, index) => (
            <ImageWithText key={index} blok={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
