import { storyblokEditable } from "@storyblok/react/rsc";
import Link from "next/link";

const NavLink = ({ blok }) => {
  return (
    <div {...storyblokEditable(blok)}>
      <Link href={blok.url.url || '#'}>
        <span className="text-base font-inter hover:text-primary transition-colors duration-200">
          {blok.text}
        </span>
      </Link>
    </div>
  );
};

export default NavLink; 