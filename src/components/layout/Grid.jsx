// /src/components/layout/Grid.jsx

"use client";

import ImageWithText from "@/components/content-types/ImageWithText"; // Import ImageWithText

const Grid = ({ blocks }) => {
  if (!blocks || !blocks.length) {
    console.error("Grid blocks are missing or incorrectly structured:", blocks); // Log for debugging
    return null;
  }

  return (
    <section className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid layout for the ImageWithText components */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"> {/* Increased gap between items */}
          {blocks.map((block) => (
            <ImageWithText key={block._uid} blok={block} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Grid;
