module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateRows: {
        homeGrid: "1fr 1fr",
      },
      backgroundImage: (theme) => ({
        "home-bg": "url('/homeBG.jpg')",
      }),
    },
  },
  variants: {
    extend: {
      borderRadius: ['hover', 'focus'],
      cursor: ['hover', 'focus']
    },
  },
  plugins: [],
};
