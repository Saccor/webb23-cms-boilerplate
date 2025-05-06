import { storyblokEditable } from "@storyblok/react/rsc";
import { useState } from "react";

const Newsletter = ({ blok }) => {
  const [email, setEmail] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup logic here
    console.log("Newsletter signup:", email);
    // Reset form
    setEmail("");
  };
  
  return (
    <div {...storyblokEditable(blok)} className="mb-8">
      <h3 className="text-h3 font-bold font-publicSans mb-4">{blok.title}</h3>
      <p className="text-base mb-6">{blok.description}</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder={blok.placeholder}
          className="border border-black/50 p-3 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-primary text-white py-3 px-6 hover:bg-primary/80 transition-colors"
        >
          {blok.button_text}
        </button>
      </form>
    </div>
  );
};

export default Newsletter; 