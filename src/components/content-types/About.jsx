"use client";

import { storyblokEditable } from "@storyblok/react";
import ProductGrid from "@/components/layout/ProductGrid";

const About = ({ blok }) => {
  if (!blok) {
    console.error("About block is missing or incorrectly structured:", blok);
    return null;
  }

  const { title, body, productgrid } = blok;

  return (
    <section {...storyblokEditable(blok)} className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          {title && <h1 className="text-4xl font-bold">{title}</h1>}
        </div>

        {/* Handle textarea field instead of rich text */}
        {body && (
          <div className="prose mx-auto">
            <p>{body}</p> {/* Render plain text or HTML */}
          </div>
        )}

        {/* Render Product Grid if available */}
        {productgrid && (
          <div className="mt-16">
            <ProductGrid blok={productgrid} />
          </div>
        )}
      </div>
    </section>
  );
};

export default About;
