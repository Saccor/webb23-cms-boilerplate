import { storyblokEditable } from "@storyblok/react/rsc";
import Link from "next/link";
import { useState } from "react";

const Navbar = ({ blok }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav {...storyblokEditable(blok)} className="relative h-[60px] w-full border-b border-black/50 bg-white">
      {/* Frame 4 - Navigation elements */}
      <div className="absolute top-[18px] left-[145px] flex h-[24px] items-center gap-[32px]">
        {/* Logo */}
        <Link href="/">
          <span className="font-inter text-[20px] font-bold text-black">
            {blok.logo_text}
          </span>
        </Link>
        
        {/* Nav Links */}
        {blok.nav_links?.map((nestedBlok, index) => {
          if (nestedBlok.component === "navlink") {
            return (
              <Link key={nestedBlok._uid} href={nestedBlok.url?.url || '#'}>
                <span className="font-inter text-[17px] text-black">
                  {nestedBlok.text}
                </span>
              </Link>
            );
          }
          return null;
        })}
        
        {/* Search Group */}
        <div className="flex items-center gap-[12px] mt-[1.5px]">
          {/* Search Icon */}
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="mt-[3px]"
          >
            <path 
              d="M15.8023 14.9518L11.9913 11.1408C13.0709 9.95304 13.7204 8.36455 13.7204 6.61978C13.7204 2.96913 10.7513 0 7.10065 0C3.44999 0 0.480835 2.96913 0.480835 6.61978C0.480835 10.2704 3.44999 13.2396 7.10065 13.2396C8.84541 13.2396 10.4339 12.5901 11.6217 11.5104L15.4327 15.3214C15.5132 15.4019 15.6176 15.4422 15.7219 15.4422C15.8262 15.4422 15.9306 15.4019 16.0111 15.3214C16.1721 15.1605 16.1721 14.9126 15.8023 14.9518ZM7.10065 12.1599C4.06501 12.1599 1.56045 9.65535 1.56045 6.61972C1.56045 3.58408 4.06501 1.07952 7.10065 1.07952C10.1363 1.07952 12.6408 3.58408 12.6408 6.61972C12.6408 9.65535 10.1363 12.1599 7.10065 12.1599Z" 
              fill="black"
            />
          </svg>
          
          {/* Search Input */}
          <input
            type="text"
            placeholder={blok.search_placeholder}
            className="bg-transparent font-inter text-[17px] text-secondary outline-none w-[120px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 