/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"], // scan all JS/JSX files
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")], // enable DaisyUI
  daisyui: {
    themes: ["light"], // force light theme
  },
};