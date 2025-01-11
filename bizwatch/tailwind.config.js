/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        psfdark: "#05020d",
        psfviolet: "#6e41d1",
      },
      fontFamily: {
        psfsans: ["Roboto", "sans-serif"],
        alumni: ["LTMuseum", "sans-serif"],
        playfair: ['"Abril Fatface"', "serif"],
        masterclass: ["Crimson Text", "serif"],
        samarkan: ["samarkan", "serif"],
        domine: ["domine", "serif"],
      },
    },
  },
};
