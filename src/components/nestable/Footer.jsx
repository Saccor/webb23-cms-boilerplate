import { storyblokEditable, StoryblokComponent } from "@storyblok/react/rsc";

const Footer = ({ blok }) => {
  return (
    <footer {...storyblokEditable(blok)} className="bg-background py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Newsletter section */}
          <div className="md:col-span-1">
            {blok.newsletter?.map((nestedBlok) => (
              <StoryblokComponent key={nestedBlok._uid} blok={nestedBlok} />
            ))}
          </div>
          
          {/* Footer columns */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
            {blok.columns?.map((nestedBlok) => (
              <StoryblokComponent key={nestedBlok._uid} blok={nestedBlok} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 