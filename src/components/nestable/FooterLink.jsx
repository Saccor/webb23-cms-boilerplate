import { storyblokEditable } from "@storyblok/react/rsc";
import Link from "next/link";

const FooterLink = ({ blok }) => {
  return (
    <Link 
      {...storyblokEditable(blok)} 
      href={blok.url?.url || '#'} 
      className="text-base hover:text-primary/70 transition-colors"
    >
      {blok.text}
    </Link>
  );
};

export default FooterLink; 