module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    boxShadow: {
      custom: "0 0 1px 1.5px #000, 0 0 1.3px 4px #fff",
    },
    extend: {
      gridTemplateRows: {
        homeGrid: "1fr 1fr",
        chatGrid: "1fr 10fr",
      },
      gridTemplateColumns: {
        chatGrid: "1fr 4fr",
      },
      width: {
        lw: "calc(100vw - 320px)",
      },
      zIndex: {
        251: "251",
        252: "252",
        300: "300",
      },
      ringOffsetWidth: {
        "-1": "-1px",
      },
      backgroundImage: (theme) => ({
        "home-bg": "url('/homeBG.jpg')",
        "swatek-bg": "url('/swatek.png')",
      }),
    },
    maxWidth: {
      "1/4": "25%",
      "1/2": "50%",
      "3/4": "75%",
      "4/5": "80%",
    },
  },
  variants: {
    extend: {
      borderRadius: ["hover", "focus"],
      cursor: ["hover", "focus"],
      width: ["hover", "focus"],
      borderRadius: ["hover", "focus"],
      borderStyle: ["hover", "focus"],
    },
  },
  plugins: [],
};
