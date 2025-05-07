/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'eff2f6': '#EFF2F6',
      },
      fontSize: {
        '17': '17px',
        '18': '18px',
        '36': '36px',
      },
      fontFamily: {
        'public': ['"Public Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
