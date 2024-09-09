"use client"; // Ensure this file runs on the client-side

import Image from 'next/image';
import Link from 'next/link';
import { storyblokEditable } from "@storyblok/react"; // For Storyblok live-editing support

const Hero = ({ hero }) => {
  // Destructure the content from the hero prop
  const { title, text, button, image } = hero.content;

  return (
    <section className="bg-gray-100 py-16" {...storyblokEditable(hero)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Hero Text Content */}
        <div className="max-w-lg">
          {title && <h1 className="text-4xl font-bold text-gray-900">{title}</h1>}
          {text && <p className="mt-4 text-gray-600">{text}</p>}
          {button?.url && (
            <Link href={button.url}>
              <a className="mt-8 inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
                {button.label || 'Learn More'}
              </a>
            </Link>
          )}
        </div>

        {/* Hero Image */}
        {image?.filename && (
          <div className="ml-8">
            <Image
              src={image.filename}
              alt={image.alt || 'Hero Image'}
              width={600} // Adjust based on the image size
              height={400} // Adjust based on the image size
              className="rounded-lg"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
