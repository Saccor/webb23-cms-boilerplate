"use client";

import ImageWithText from "@/components/content-types/ImageWithText";
import ProductList from "@/components/layout/ProductList";

const Grid = ({ blocks }) => {
  if (!blocks || !blocks.length) {
    console.error("Grid blocks are missing or incorrectly structured:", blocks);
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-lg text-gray-500">No content available</p>
      </div>
    );
  }

  return (
    <section className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {blocks.map((block) => {
            console.log("Block Component:", block.component); // Log the component name to see what is returned

            // Handle ImageWithText blocks
            if (block.component === 'ImageWithText') {
              return (
                <div key={block._uid} className="transition-transform duration-300 transform hover:scale-105">
                  <ImageWithText blok={block} />
                </div>
              );
            }

            // Handle ProductList blocks
            if (block.component === 'ProductList') {
              return (
                <div key={block._uid} className="transition-transform duration-300 transform hover:scale-105">
                  <ProductList blok={block} />
                </div>
              );
            }

            return (
              <div key={block._uid}>
                <p>Unsupported block type: {block.component}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Grid;
