// /src/components/layout/Grid.jsx

"use client";

import ImageWithText from "@/components/content-types/ImageWithText"; // Import ImageWithText

const Grid = ({ blocks }) => {
  if (!blocks || !blocks.length) {
    console.error("Grid blocks are missing or incorrectly structured:", blocks); // Log for debugging
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-lg text-gray-500">No content available</p> {/* Fallback message for empty blocks */}
      </div>
    );
  }

  return (
    <section className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid layout for the ImageWithText components */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {blocks.map((block) => (
            <div
              key={block._uid}
              className="transition-transform duration-300 transform hover:scale-105"
            >
              {/* Each block scales up slightly on hover */}
              <ImageWithText blok={block} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Grid;
