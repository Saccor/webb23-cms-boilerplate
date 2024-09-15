"use client"; // This tells Next.js that this is a Client Component

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react'; // For mobile navigation toggle

const Header = ({ logo, links }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For mobile navigation toggle

  return (
    <header className="w-full">
      {/* Top Black Bar */}
      <div className="bg-black w-full h-[45px] flex justify-between items-center px-4 sm:px-6 lg:px-8">
        {/* Left-aligned content (e.g., Currency) */}
        <div className="text-white">USD</div>

        {/* Center-aligned content (e.g., Free shipping message) */}
        <div className="text-white">FREE SHIPPING ON ALL HERMAN MILLER! FEB. 25&ndash;28.</div>

        {/* Right-aligned content (e.g., Support) */}
        <div className="text-white">Support</div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-white w-full h-[60px] shadow-md flex justify-between items-center px-4 sm:px-6 lg:px-8">
        {/* Render the logo from Storyblok */}
        {logo && (
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src={logo.filename} // Dynamic logo from Storyblok
                alt="Logo"
                width={100}
                height={40}
                className="h-12 w-auto object-contain"
              />
            </Link>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="hidden md:block"> {/* Hidden on mobile */}
          <ul className="flex space-x-8">
            {Array.isArray(links) &&
              links.map((link) => {
                const linkUrl =
                  link.Link.cached_url ||
                  link.Link.story?.url ||
                  link.Link.story?.full_slug
                    ? `/${link.Link.story.full_slug}`
                    : '#'; // Fallback URL if the link is invalid

                const linkName = link.name || link.Link.story?.name || 'Unnamed Link'; // Fallback link name

                return (
                  <li key={link._uid}>
                    <Link href={linkUrl} className="text-black hover:text-blue-400 transition duration-300">
                      {linkName}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </nav>

        {/* Cart Icon */}
        <div className="text-black">🛒 3</div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="text-gray-100 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <span>&#10005; {/* Close Icon */}</span>
            ) : (
              <span>&#9776; {/* Hamburger Icon */}</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-gray-800">
          <ul className="flex flex-col space-y-4 p-4">
            {Array.isArray(links) &&
              links.map((link) => {
                const linkUrl =
                  link.Link.cached_url ||
                  link.Link.story?.url ||
                  link.Link.story?.full_slug
                    ? `/${link.Link.story.full_slug}`
                    : '#'; // Fallback URL

                const linkName = link.name || link.Link.story?.name || 'Unnamed Link'; // Fallback link name

                return (
                  <li key={link._uid}>
                    <Link
                      href={linkUrl}
                      className="text-white hover:text-blue-400 transition duration-300 block"
                      onClick={() => setIsMenuOpen(false)} // Close menu after clicking a link
                    >
                      {linkName}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
