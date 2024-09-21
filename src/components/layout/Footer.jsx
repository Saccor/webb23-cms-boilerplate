"use client"; 
import Link from 'next/link';
import { storyblokEditable } from "@storyblok/react";

const Footer = ({ blok }) => {
  if (!blok) {
    console.error("Footer block is missing or incorrectly structured:", blok);
    return null;
  }

  // Access the fields from the footer
  const { title, description, email_placeholder, button_text, link_groups } = blok;

  return (
    <footer className="bg-gray-100 w-full py-10 text-gray-900" {...storyblokEditable(blok)}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-4 gap-8">

          {/* Sign-up Section */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-2">{title || "Sign up for our newsletter"}</h3>
            <p className="text-base mb-4">{description || "Be the first to know about our special offers, new product launches, and events."}</p>
            <div className="flex">
              <input
                type="email"
                placeholder={email_placeholder || "Email Address"}
                className="px-4 py-2 w-full border border-gray-300 rounded-l"
              />
              <button className="bg-black text-white px-6 py-2 rounded-r">{button_text || "Sign Up"}</button>
            </div>
          </div>

          {/* Dynamic Link Groups */}
          {Array.isArray(link_groups) && link_groups.map((group, index) => (
            <div key={index} className="col-span-1">
              <h3 className="text-lg font-semibold mb-4">{group.name || "Unnamed Group"}</h3>
              <ul className="space-y-2">
                {Array.isArray(group.links) && group.links.map((link, linkIndex) => (
                  <li key={link._uid || linkIndex}>
                    <Link href={link.Link.cached_url || '#'} className="hover:text-blue-400 transition">
                      {link.name || "Unnamed Link"}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Bottom Section */}
        <div className="mt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Grupp 12. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
