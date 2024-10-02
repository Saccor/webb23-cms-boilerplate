"use client";

import ImageWithText from "@/components/content-types/ImageWithText";
import { storyblokEditable } from "@storyblok/react";

const ProductList = ({ blok }) => {
  if (!blok) {
    console.error("ProductList block is missing or incorrectly structured:", blok);
    return null;
  }

  const { title, description, products } = blok;

  return (
    <section className="bg-[#EFF2F6] py-16" {...storyblokEditable(blok)}>
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Title */}
        <h2
          className="text-[36px] font-bold text-[#020202] mb-6 text-left"
          style={{ letterSpacing: "-1.5px" }}
        >
          {title || "See our products"}
        </h2>

        {/* Description */}
        <p
          className="text-[18px] text-[#000000] font-normal mb-10 text-left"
          style={{ letterSpacing: "-0.3px", lineHeight: "26px" }}
        >
          {description || "Revamp your style with the latest designer trends."}
        </p>

        {/* Filter Buttons */}
        <div className="flex space-x-4 mb-12">
          <button className="px-6 py-2 border border-black text-sm">Sweaters</button>
          <button className="px-6 py-2 border border-black text-sm">Tops</button>
          <button className="px-6 py-2 border border-black text-sm">Jackets</button>
          <button className="px-6 py-2 border border-black text-sm">Hats</button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products?.map((product, index) => (
            <div key={index} className="flex flex-col items-start">
              <ImageWithText blok={product} />
              <div className="text-left mt-2">
                <h3 className="font-semibold text-lg">{product.name || "Product Name"}</h3>
                <p className="text-sm text-gray-600">{product.price || "$99"}</p>
                <p className="text-sm text-gray-600">{product.size || "M"}</p> {/* Add Size */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
