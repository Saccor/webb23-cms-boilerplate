"use client";
import Image from 'next/image';
import Link from 'next/link';
import { storyblokEditable } from "@storyblok/react";

const Hero = ({ blok }) => {
  console.log("Hero blok data:", blok);  // Debugging log
  if (!blok) {
    console.error("Hero block is missing or incorrectly structured:", blok); 
    return null;
  }

  // Destructure fields from blok
  const { title, text, button_label, button, image } = blok;

  return (
    <section className="py-16" {...storyblokEditable(blok)} style={{ paddingTop: '126px' }}> {/* Removed bg-gray-100 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        
        {/* Hero Text Content */}
        <div className="max-w-lg mb-8">
          {title && <h1 className="text-4xl font-bold text-gray-900" style={{ fontSize: "48px", lineHeight: "56px", fontWeight: "700", marginBottom: "24px" }}>{title}</h1>}
          {text && <p className="mt-4 text-gray-600" style={{ fontSize: "18px", lineHeight: "32px", marginBottom: "40px" }}>{text}</p>}

          {button?.cached_url && (
            <Link href={button.cached_url}>
              <div style={{
                width: "194px",
                height: "50px",
                marginTop: "14px",
                marginBottom: "50px",
                display: 'inline-block',
                border: "1px solid #000000",
                borderRadius: "4px",
                lineHeight: "50px",
                color: "#000",
                fontSize: "16px",
                fontWeight: "600",
                textAlign: "center",
              }}>
                {button_label || 'Shop All'}
              </div>
            </Link>
          )}
        </div>

        {/* Hero Image */}
        {image?.filename && (
          <div className="w-full max-w-7xl h-auto mx-auto">
            <Image
              src={image.filename}
              alt={image.alt || 'Hero Image'}
              width={1114}
              height={776}  // Updated height for a larger image
              className="rounded-lg object-cover w-full h-auto"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
