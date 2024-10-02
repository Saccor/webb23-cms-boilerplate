"use client";

import Link from "next/link";
import { useState } from "react";

const Footer = ({ blok }) => {
  const [email, setEmail] = useState("");

  // Helper function to get link URL
  const getLinkUrl = (linkObj) => {
    return linkObj?.url || linkObj?.cached_url || linkObj?.href || "#";
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Subscribed with: ${email}`);
    setEmail("");
  };

  return (
    <footer className="bg-gray-100 py-16" style={{ backgroundColor: "#EFF2F6", paddingTop: "45px", paddingBottom: "45px" }}>
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          
          {/* Left Column: Newsletter Section */}
          {blok?.title && (
            <div className="mb-12" style={{ maxWidth: "400px" }}>
              <h2
                className="text-3xl font-bold mb-4"
                style={{
                  fontFamily: "Public Sans",
                  fontWeight: "700",
                  fontSize: "32px",
                  lineHeight: "44px",
                  color: "#333",
                  marginBottom: "16px",
                }}
              >
                {blok.title}
              </h2>
              <p
                className="text-gray-600 mb-6"
                style={{
                  fontSize: "18px",
                  lineHeight: "32px",
                  color: "#333",
                  marginBottom: "24px",
                }}
              >
                {blok.description}
              </p>

              <form onSubmit={handleSubmit} className="flex max-w-md" style={{ width: "400px" }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={blok.email_placeholder || "Enter your email"}
                  className="border border-gray-400 p-3 rounded-l-lg"
                  required
                  style={{
                    padding: "12px",
                    borderColor: "#ccc",
                    width: "349px",
                    height: "40px",
                    borderRadius: "4px 0 0 4px",
                  }}
                />
                <button
                  type="submit"
                  className="bg-black text-white flex justify-center items-center"
                  style={{
                    backgroundColor: "#000",
                    width: "51px",
                    height: "40px",
                    borderRadius: "0 4px 4px 0",
                    padding: "0",
                    fontSize: "14px",
                    fontWeight: "bold",
                    lineHeight: "16px",
                    textTransform: "uppercase",
                    textAlign: "center",
                  }}
                >
                  {blok.button_text || "Sign Up"}
                </button>
              </form>
            </div>
          )}

          {/* Right Column: Links Section */}
          <div className="grid grid-cols-3 gap-8" style={{ marginTop: "66px" }}>
            {blok?.link_groups?.map((group) => (
              <div key={group._uid} style={{ width: "190px" }}>
                <h3
                  className="font-bold"
                  style={{
                    fontFamily: "Public Sans",
                    fontWeight: "600",
                    fontSize: "16px",
                    lineHeight: "22px",
                    color: "#333",
                    letterSpacing: "-0.4px",
                    marginBottom: "12px",
                  }}
                >
                  {group?.title || "Group Title"}
                </h3>
                <ul className="space-y-2">
                  {Array.isArray(group.links) ? (
                    group.links.map((link) => (
                      <li key={link._uid}>
                        <Link href={getLinkUrl(link.Link)} className="hover:underline" style={{ color: "#333", textDecoration: "none" }}>
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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
