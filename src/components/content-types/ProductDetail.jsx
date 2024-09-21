"use client";
import Image from 'next/image';
import { storyblokEditable } from "@storyblok/react";

const ProductDetail = ({ blok }) => {
  if (!blok) {
    console.error("ProductDetail block is missing or incorrectly structured:", blok);
    return null;
  }

  const { title, price, description, colors, sizes, image } = blok;

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          {image?.filename && (
            <Image
              src={image.filename}
              alt={image.alt || "Product Image"}
              width={600}
              height={600}
              className="rounded-lg object-cover w-full h-auto"
            />
          )}
        </div>

        {/* Product Info */}
        <div>
          {/* Title and Price */}
          <h1 className="text-4xl font-bold">{title}</h1>
          <p className="text-xl text-gray-500 mt-2">${price}</p>
          <p className="mt-4 text-gray-700">{description}</p>

          {/* Colors */}
          {colors?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Color</h3>
              <div className="flex space-x-2">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {sizes?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Size</h3>
              <div className="flex space-x-2">
                {sizes.map((size, index) => (
                  <button
                    key={index}
                    className="px-4 py-2 border rounded"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fit Guide Link */}
          <div className="mt-4">
            <a href="#" className="text-blue-500 underline">Size & Fit Guide</a>
          </div>

          {/* Model Info */}
          <div className="mt-2 text-sm text-gray-600">
            Height of model: 189 cm / 6'2" Size 41
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
