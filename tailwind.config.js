/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#2F265A",
        secondary: {
          DEFAULT: "#433878",
          100: "#5B5289",
          200: "#4E4673",
        },
        gray: {
          DEFAULT: "#FCFCFC",
          100: "#D9D9D9",
        },
      },
      fontFamily: {
        Osbold: ["Oswald-Bold", "sans-serif"],
        Oslight: ["Oswald-Light", "sans-serif"],
        Osextralight: ["Oswald-ExtraLight", "sans-serif"],
        Osmedium: ["Oswald-Medium", "sans-serif"],
        Osregular: ["Oswald-Regular", "sans-serif"],
        OsSemibold: ["Oswald-SemiBold", "sans-serif"],
        Mextrabold: ["Montserrat-ExtraBold", "sans-serif" ]
      },
      boxShadow: {
      correct: "#008000",
      danger: "#cd1c18",
      }
    },
  },
  plugins: [],
};
