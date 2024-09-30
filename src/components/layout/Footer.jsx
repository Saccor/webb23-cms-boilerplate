"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const Footer = ({ blok }) => {
  const [email, setEmail] = useState("");

  // Forcefully map through the link object fields
  const getLinkUrl = (linkObj) => {
    // Check all likely fields for URL
    return linkObj?.url || linkObj?.cached_url || linkObj?.href || "#";
  };

  // Log the full structure of each link
  useEffect(() => {
    if (blok?.link_groups) {
      blok.link_groups.forEach((group, groupIndex) => {
        // Ensure the links array is defined and is an array before looping over it
        if (Array.isArray(group.links)) {
          console.log(`Link Group ${groupIndex}:`, JSON.stringify(group.links, null, 2));
          group.links.forEach((link, linkIndex) => {
            console.log(`Link ${linkIndex} Object:`, JSON.stringify(link.Link, null, 2));
          });
        } else {
          console.warn(`Link Group ${groupIndex} has no links or is not an array`);
        }
      });
    } else {
      console.log("No Link Groups Found");
    }
  }, [blok]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Subscribed with: ${email}`);
    setEmail("");
  };

  return (
    <footer className="bg-gray-100 py-16">
      <div className="container mx-auto px-8">
        {/* Newsletter Section */}
        {blok?.title && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">{blok.title}</h2>
            <p className="text-gray-600 mb-6">{blok.description}</p>

            <form onSubmit={handleSubmit} className="flex max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={blok.email_placeholder || "Enter your email"}
                className="border border-gray-400 p-3 rounded-l-lg w-full"
                required
              />
              <button type="submit" className="bg-black text-white px-6 py-3 rounded-r-lg">
                {blok.button_text || "Sign Up"}
              </button>
            </form>
          </div>
        )}

        {/* Links Section */}
        {blok?.link_groups?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16">
            {blok.link_groups.map((group) => (
              <div key={group._uid}>
                <h3 className="text-xl font-bold mb-4">{group?.title || "Group Title"}</h3>
                <ul className="space-y-2">
                  {Array.isArray(group.links) ? (
                    group.links.map((link) => (
                      <li key={link._uid}>
                        {/* Use only Link without <a> tag */}
                        <Link href={getLinkUrl(link.Link)} className="text-gray-700 hover:text-black hover:underline">
                          {link.name || "Link"}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li>No links available</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p>No link groups available</p>
        )}
      </div>
    </footer>
  );
};

export default Footer;
