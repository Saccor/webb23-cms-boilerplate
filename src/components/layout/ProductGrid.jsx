"use client";

import { storyblokEditable } from "@storyblok/react";

const ProductGrid = ({ blok }) => {
  if (!blok) {
    console.error("ProductGrid block is missing or incorrectly structured:", blok);
    return null;
  }

  // Destructure the fields from Storyblok content
  const { title, description, products, button_label, button_url } = blok;

  return (
    <section
      className="w-full flex flex-col items-center justify-center py-16" // Removed bg-gray-100
      {...storyblokEditable(blok)}
      style={{ width: "1400px", height: "1035px", margin: "0 auto" }} // Ensure proper width and centering
    >
      {/* Title */}
      <div className="text-center mb-6"> {/* Adjusted margin to match the desired spacing */}
        {title && (
          <h2 className="text-[56px] leading-[62px] tracking-[-0.2px] font-bold" style={{ marginBottom: "10px" }}>
            {title}
          </h2>
        )}
      </div>

      {/* Description */}
      <div className="text-gray-600 mb-6" style={{ maxWidth: "610px", textAlign: "center" }}> {/* Adjusted margin */}
        {description && (
          <p className="text-[20px] leading-[28px] tracking-[-0.4px]">
            {description}
          </p>
        )}
      </div>

      {/* Button */}
      <div className="mb-24"> {/* Doubled the margin-bottom */}
        {button_label && button_url && (
          <a
            href={button_url}
            className="bg-black text-white font-semibold leading-[22px] tracking-[-0.4px] text-center"
            style={{ padding: "12px 32px", width: "194px", height: "50px", display: "inline-block", borderRadius: "6px" }}
          >
            {button_label}
          </a>
        )}
      </div>

{/* Products Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"> {/* Adjusted margin */}
  {products?.map((product, index) => (
    <div
      key={index}
      className={`bg-white rounded-lg shadow overflow-hidden ${
        index === 1 ? "-mt-[85px]" : ""
      }`}
      style={{ width: "368px", height: "521px" }}
    >
      {product.image && (
        <Image
          src={product.image.filename}
          alt={product.image.alt || "Product Image"}
          width={368}  // Specify the width
          height={521} // Specify the height
          className="object-cover w-full h-full rounded-lg"
        />
      )}
    </div>
  ))}
</div>

    </section>
  );
};

export default ProductGrid;
