"use client";

import { storyblokEditable } from "@storyblok/react";

const Banner = ({ blok }) => {
  return (
    <section
      {...storyblokEditable(blok)}
      className="w-full bg-gray-200"
      style={{
        height: "316px",
        width: "100%", // Ensures it covers full width
        margin: "0",
        padding: "0",
      }}
    >
      {/* Ensure the image fills the section */}
      {blok.image && (
        <div
          style={{
            backgroundImage: `url(${blok.image.filename})`,
            backgroundSize: "cover", // Ensures image covers the entire section
            backgroundPosition: "center", // Centers the image
            height: "100%",
            width: "100%",
          }}
        >
          <div className="h-full flex justify-center items-center">
            {blok.title && (
              <h1 className="text-4xl font-bold text-white">{blok.title}</h1>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Banner;
