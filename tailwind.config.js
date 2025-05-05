/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:   '#0D0D0D',
        secondary: '#979797',
        background:'#EFF2F6',
        black:     '#000000',
      },
      fontFamily: {
        publicSans: ['Public Sans','sans-serif'],
        inter:      ['Inter','sans-serif'],
      },
      fontSize: {
        h1:   ['4.5rem',  { lineHeight: '80px', letterSpacing: '-0.03em' }], // 72px
        h2:   ['3.5rem',  { lineHeight: '62px', letterSpacing: '-2.4px' }],  // 56px
        h3:   ['2.25rem', { lineHeight: '44px', letterSpacing: '-1.5px' }],  // 36px
        h4:   ['1.375rem',{ lineHeight: '30px', letterSpacing: '-0.55px' }], // 22px
        h5:   ['1rem',    { lineHeight: '22px', letterSpacing: '-0.4px' }],  // 16px
        base: ['1.125rem',{ lineHeight: '28px', letterSpacing: '-0.4px' }],  // 18px
        lg:   ['1.25rem', { lineHeight: '30px', letterSpacing: '-0.55px' }], // 20px
        sm:   ['0.875rem',{ lineHeight: '17px' }],                          // 14px
      },
      screens: {
        '2xl': '1400px',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
