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
        videoChatGrid: "repeat(auto-fit,minmax(340px,1fr))",
      },
      gridTemplateColumns: {
        videoChatGrid: "repeat(auto-fit,minmax(340px,1fr))",
      },
      gridAutoRows: {
        videoChat: "minmax(100px, 100vh)",
      },
      width: {
        lw: "calc(100vw - 320px)",
      },
      zIndex: {
        251: "251",
        252: "252",
        300: "300",
        "-100": "-100",
        "-1": "-1",
        250: "250",
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
      full: "100%",
    },
    minWidth: {
      0: "0",
      "1/4": "25%",
      "1/2": "50%",
      "3/4": "75%",
      full: "100%",
    },
    minHeight: {
      0: "0",
      "1/4": "25%",
      "1/2": "50%",
      "3/4": "75%",
      full: "100%",
      1: "100px",
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
