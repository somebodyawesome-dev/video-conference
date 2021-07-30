module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateRows: {
        homeGrid: "1fr 1fr",
        chatGrid: "1fr 10fr",
      },
      gridTemplateColumns: {
        chatGrid: "1fr 4fr",
      },
      backgroundImage: (theme) => ({
        "home-bg": "url('/homeBG.jpg')",
        "swatek-bg": "url('/swatek.png')",
      }),
    },
  },
  variants: {
    extend: {
      borderRadius: ['hover', 'focus'],
      cursor: ['hover', 'focus'],
      width: ['hover', 'focus'],
      borderRadius: ['hover', 'focus'],
      borderStyle: ['hover', 'focus'],
    },
  },
  plugins: [],
};
