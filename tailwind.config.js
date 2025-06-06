/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors: {
          // Replace these with your preferred colors using HEX or RGB — NOT oklch
          primary: "#4f46e5", // indigo-600
          secondary: "#ec4899", // pink-500
          background: "#ffffff", // white
          foreground: "#111827", // gray-900
        },
      },
    },
    plugins: [],
  };
  