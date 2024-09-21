"use client";

import { storyblokEditable } from "@storyblok/react";

const ProductGrid = ({ blok }) => {
  if (!blok) {
    console.error("ProductGrid block is missing or incorrectly structured:", blok);
    return null;
  }

  // Lowercase the field names to match Storyblok's schema
  const { title, description, products, button_label, button_url } = blok;

  return (
    <section
      className="bg-gray-100 py-16"
      {...storyblokEditable(blok)}
      style={{
        position: "relative",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{
          width: "1400px", // Match the width layout
          height: "1035px", // Match the height layout
          position: "relative",
        }}
      >
        {/* Title */}
        <div
          className="text-center"
          style={{
            width: "755px",
            height: "62px",
            top: "126px",
            left: "323px",
            position: "absolute",
          }}
        >
          {title && <h2 className="text-4xl font-bold mb-4">{title}</h2>}
        </div>

        {/* Description */}
        <div
          className="text-center"
          style={{
            width: "610px",
            height: "84px",
            top: "207px",
            left: "397px",
            position: "absolute",
          }}
        >
          {description && <p className="text-lg text-gray-600">{description}</p>}
        </div>

        {/* Button */}
        {button_label && button_url && (
          <div
            className="text-center"
            style={{
              width: "194px",
              height: "50px",
              top: "291px",
              left: "603px",
              position: "absolute",
            }}
          >
            <a
              href={button_url}
              className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
              style={{ width: "100%", height: "100%" }}
            >
              {button_label}
            </a>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-64">
          {products?.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow"
              style={{
                width: "368px",
                height: "521px",
                position: "absolute",
                top: index === 1 ? "407px" : "492px", // Middle image higher than the rest
                left: index === 0 ? "125px" : index === 1 ? "518px" : "911px",
              }}
            >
              {product.image && (
                <div className="mb-4">
                  <img
                    src={product.image.filename}
                    alt={product.image.alt || "Product Image"}
                    className="object-cover rounded-lg w-full h-full"
                  />
                </div>
              )}
              {product.title && (
                <h3 className="text-xl font-bold text-center">{product.title}</h3>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
