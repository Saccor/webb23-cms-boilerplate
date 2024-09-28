"use client"; // Client-side component

import Link from "next/link";
import { useState } from "react";

const Footer = ({ blok }) => {
  const [email, setEmail] = useState("");

  // Function to handle form submission (replace with actual logic)
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Subscribed with: ${email}`);
    setEmail("");
  };

  return (
    <footer className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        {/* Newsletter Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">{blok.newsletter_signup?.headline}</h2>
          <p className="text-gray-600 mb-4">{blok.newsletter_signup?.description}</p>

          <form onSubmit={handleSubmit} className="flex">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="border border-gray-400 p-2 rounded-l-lg w-full max-w-sm"
              required
            />
            <button type="submit" className="bg-black text-white px-4 py-2 rounded-r-lg">
              Sign Up
            </button>
          </form>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-bold mb-2">Shop</h3>
            <ul>
              {blok.shop_links.map((link) => (
                <li key={link._uid} className="mb-1">
                  <Link href={link.url}>
                    <a className="text-gray-700 hover:underline">{link.label}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="text-lg font-bold mb-2">Help</h3>
            <ul>
              {blok.help_links.map((link) => (
                <li key={link._uid} className="mb-1">
                  <Link href={link.url}>
                    <a className="text-gray-700 hover:underline">{link.label}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h3 className="text-lg font-bold mb-2">About</h3>
            <ul>
              {blok.about_links.map((link) => (
                <li key={link._uid} className="mb-1">
                  <Link href={link.url}>
                    <a className="text-gray-700 hover:underline">{link.label}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
