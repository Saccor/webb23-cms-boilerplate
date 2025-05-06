import { storyblokEditable, StoryblokComponent } from "@storyblok/react/rsc";

const FooterColumn = ({ blok }) => {
  return (
    <div {...storyblokEditable(blok)} className="flex flex-col">
      <h4 className="text-h4 font-bold font-publicSans mb-6">{blok.heading}</h4>
      <ul className="flex flex-col gap-3">
        {blok.links?.map((nestedBlok) => (
          <li key={nestedBlok._uid}>
            <StoryblokComponent blok={nestedBlok} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterColumn; 