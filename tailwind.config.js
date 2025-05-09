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
        '13': '13px',
        '14': '14px',
        '16': '16px',
      },
      fontFamily: {
        'public': ['"Public Sans"', 'sans-serif'],
      },
      spacing: {
        '76': '76px',
        '8': '8px',
        '9': '9px',
        '21': '21px',
        '30': '30px',
        '63': '63px',
        '110': '110px',
        '148': '148px',
      },
      width: {
        '554': '554px',
      },
      height: {
        '554': '554px',
        '900': '900px',
        '60': '60px',
      },
    },
  },
  plugins: [],
};
